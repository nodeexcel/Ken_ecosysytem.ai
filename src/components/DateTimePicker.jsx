import { useState, useMemo, useRef, useEffect } from "react"
import { X , ChevronDown , ChevronUp, ChevronRight, ChevronLeft} from "lucide-react" // Removed ChevronLeft, ChevronRight
import { UtcFormat } from "../utils/TimeFormat"
import { useTranslation } from "react-i18next";

function TimeSelector24({ value, onChange, onClose }) {
  // value: "HH : mm" or "HH:mm"
  const parseInitial = () => {
    let [h, m] = value.split(":").map((v) => v.trim());
    h = h ? h.padStart(2, "0") : "00";
    m = m ? m.padStart(2, "0") : "00";
    return { hour: h, minute: m };
  };
  const { hour, minute } = parseInitial();
  const [selectedHour, setSelectedHour] = useState(hour);
  const [selectedMinute, setSelectedMinute] = useState(minute);
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);
  const itemHeight = 36;
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const circularHours = [...hours, ...hours, ...hours];
  const circularMinutes = [...minutes, ...minutes, ...minutes];

  const scrollToItem = (ref, items, value, height = itemHeight, isCircular = false) => {
    if (!ref.current) return;
    if (isCircular) {
      const index = items.indexOf(value);
      if (index !== -1) {
        const centerOffset = 2;
        ref.current.scrollTop = (items.length + index - centerOffset) * height;
      }
    } else {
      const index = items.indexOf(value);
      if (index !== -1) {
        const paddedIndex = index + 2;
        const centerOffset = 2;
        ref.current.scrollTop = (paddedIndex - centerOffset) * height;
      }
    }
  };

  useEffect(() => {
    if (hoursRef.current && minutesRef.current) {
      scrollToItem(hoursRef, hours, selectedHour, itemHeight, true);
      scrollToItem(minutesRef, minutes, selectedMinute, itemHeight, true);
    }
  }, []);

  const handleCircularScroll = (ref, originalItems, circularItems, setValue) => {
    if (!ref.current) return;
    const scrollTop = ref.current.scrollTop;
    const itemsLength = originalItems.length;
    const centerPosition = scrollTop + 72;
    const centerIndex = Math.round(centerPosition / itemHeight);
    const actualIndex = centerIndex % itemsLength;
    const selectedItem = originalItems[actualIndex];
    setValue(selectedItem);
    const totalItems = circularItems.length;
    const threshold = itemHeight * 2;
    if (scrollTop < threshold) {
      ref.current.scrollTop = itemsLength * itemHeight + (scrollTop % (itemsLength * itemHeight));
    } else if (scrollTop > (totalItems - itemsLength - 2) * itemHeight) {
      ref.current.scrollTop = itemsLength * itemHeight + (scrollTop % (itemsLength * itemHeight));
    }
  };

  useEffect(() => {
    let timeout;
    const handleScrollEnd = (ref, items, circularItems, setValue) => () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!ref.current) return;
        handleCircularScroll(ref, items, circularItems, setValue);
      }, 50);
    };
    if (hoursRef.current) {
      hoursRef.current.addEventListener('scroll', handleScrollEnd(hoursRef, hours, circularHours, setSelectedHour));
    }
    if (minutesRef.current) {
      minutesRef.current.addEventListener('scroll', handleScrollEnd(minutesRef, minutes, circularMinutes, setSelectedMinute));
    }
    return () => {
      if (hoursRef.current) hoursRef.current.removeEventListener('scroll', handleScrollEnd(hoursRef, hours, circularHours, setSelectedHour));
      if (minutesRef.current) minutesRef.current.removeEventListener('scroll', handleScrollEnd(minutesRef, minutes, circularMinutes, setSelectedMinute));
    };
  }, []);

  useEffect(() => {
    onChange(`${selectedHour}:${selectedMinute}`);
  }, [selectedHour, selectedMinute]);

  const isSelected = (item, selectedItem) => item === selectedItem;

  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-2 z-50 border border-gray-200">
      <div className="flex gap-4 items-center w-full justify-center">
        {/* Hours column */}
        <div className="flex-1 min-w-[60px]">
          <div ref={hoursRef} className="h-[108px] overflow-auto scrollbar-hide">
            <div className="px-2">
              {circularHours.map((hour, index) => (
                <div
                  key={`hour-${index}`}
                  className={`h-[36px] flex items-center justify-center text-[18px] cursor-pointer select-none ${isSelected(hour, selectedHour) ? 'text-[#675FFF] font-semibold' : 'text-gray-500'}`}
                  onClick={() => {
                    setSelectedHour(hour);
                    scrollToItem(hoursRef, hours, hour, itemHeight, true);
                    onChange(`${hour}:${selectedMinute}`);
                    if (onClose) onClose();
                  }}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>
        </div>
        <span className="text-lg font-bold">:</span>
        {/* Minutes column */}
        <div className="flex-1 min-w-[60px]">
          <div ref={minutesRef} className="h-[108px] overflow-auto scrollbar-hide">
            <div className="px-2">
              {circularMinutes.map((minute, index) => (
                <div
                  key={`minute-${index}`}
                  className={`h-[36px] flex items-center justify-center text-[18px] cursor-pointer select-none ${isSelected(minute, selectedMinute) ? 'text-[#675FFF] font-semibold' : 'text-gray-500'}`}
                  onClick={() => {
                    setSelectedMinute(minute);
                    scrollToItem(minutesRef, minutes, minute, itemHeight, true);
                    onChange(`${selectedHour}:${minute}`);
                    if (onClose) onClose();
                  }}
                >
                  {minute}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateSelector({ value, onChange, onClose }) {
 const ITEM_HEIGHT = 36;
  const VIEWPORT_HEIGHT = 108;
  const WINDOW = 201; // sliding year window size (odd)

  // parse value "DD/MM/YYYY"
  const parseValue = (val) => {
    if (!val) return { d: "01", m: "01", y: String(new Date().getFullYear()) };
    const [dd = "01", mm = "01", yyyy = String(new Date().getFullYear())] = val.split("/");
    return { d: dd.padStart(2, "0"), m: mm.padStart(2, "0"), y: yyyy };
  };

  const { d: initD, m: initM, y: initY } = parseValue(value);

  // selected values
  const [selectedDay, setSelectedDay] = useState(initD);
  const [selectedMonth, setSelectedMonth] = useState(initM);
  const [selectedYear, setSelectedYear] = useState(initY);

  // days list depends on month + year
  const getDaysCount = (year, month1) => new Date(Number(year), Number(month1), 0).getDate();

  const [days, setDays] = useState(() =>
    Array.from({ length: getDaysCount(initY, initM) }, (_, i) => String(i + 1).padStart(2, "0"))
  );
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

  // dynamic year window centered around initY
  const centerYearRef = useRef(Number(initY));
  const [years, setYears] = useState(() => {
    const center = Number(initY);
    const half = Math.floor(WINDOW / 2);
    return Array.from({ length: WINDOW }, (_, i) => String(center - half + i));
  });

  // circular arrays for infinite feel
  const circularDays = [...days, ...days, ...days];
  const circularMonths = [...months, ...months, ...months];
  const circularYears = [...years, ...years, ...years];

  // refs
  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  // emit to parent when selected changes via scrolling or other means
  useEffect(() => {
    if (onChange) onChange(`${selectedDay}/${selectedMonth}/${selectedYear}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, selectedMonth, selectedYear]);

  // update days list when month/year change
  useEffect(() => {
    const count = getDaysCount(selectedYear, selectedMonth);
    const newDays = Array.from({ length: count }, (_, i) => String(i + 1).padStart(2, "0"));
    setDays(newDays);
    // clamp day
    if (Number(selectedDay) > count) {
      setSelectedDay(String(count).padStart(2, "0"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  // scroll-to helper (centers inside middle copy)
  const scrollToItem = (ref, items, value, isCircular = false) => {
    if (!ref?.current) return;
    const index = items.indexOf(value);
    if (index === -1) return;
    const centerOffset = 2;
    if (isCircular) {
      ref.current.scrollTop = (items.length + index - centerOffset) * ITEM_HEIGHT;
    } else {
      ref.current.scrollTop = (index + centerOffset) * ITEM_HEIGHT;
    }
  };

  // center initial scroll when mounted or when lists change
  useEffect(() => {
    // delay to ensure DOM exists
    setTimeout(() => {
      scrollToItem(dayRef, days, selectedDay, true);
      scrollToItem(monthRef, months, selectedMonth, true);
      scrollToItem(yearRef, years, selectedYear, true);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, months, years]);

  // handle circular scroll - reused function
  const handleCircularScroll = (ref, originalItems, circularItems, setValue) => {
    if (!ref.current) return;
    const scrollTop = ref.current.scrollTop;
    const itemsLength = originalItems.length;
    const centerPosition = scrollTop + VIEWPORT_HEIGHT / 2; // 72
    const centerIndex = Math.round(centerPosition / ITEM_HEIGHT);
    const actualIndex = ((centerIndex % itemsLength) + itemsLength) % itemsLength;
    const selectedItem = originalItems[actualIndex];
    setValue(selectedItem);

    // recenter when near edges (for years we will regenerate window)
    const totalItems = circularItems.length;
    if (scrollTop < ITEM_HEIGHT * 2 || scrollTop > (totalItems - itemsLength - 2) * ITEM_HEIGHT) {
      ref.current.scrollTop = itemsLength * ITEM_HEIGHT + (scrollTop % (itemsLength * ITEM_HEIGHT));
    }
  };

  // attach scroll listeners with debounce and year-window recentering
  useEffect(() => {
    let timeout;
    const makeHandler = (ref, originalItems, circularItems, setValue, onRecenter) => {
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (!ref.current) return;
          handleCircularScroll(ref, originalItems, circularItems, setValue);
          if (onRecenter) onRecenter();
        }, 60);
      };
    };

    // year recentering: when selection gets close to edges of window, regenerate
    const yearRecenter = () => {
      const idx = years.indexOf(String(selectedYear));
      if (idx === -1) return;
      const nearEdge = idx < 10 || idx > years.length - 11;
      if (nearEdge) {
        const newCenter = Number(selectedYear);
        centerYearRef.current = newCenter;
        const half = Math.floor(WINDOW / 2);
        const newWindow = Array.from({ length: WINDOW }, (_, i) => String(newCenter - half + i));
        setYears(newWindow);
        // after years state updates, scroll yearRef to center copy
        setTimeout(() => {
          if (!yearRef.current) return;
          const newIndex = newWindow.indexOf(String(newCenter));
          if (newIndex !== -1) {
            yearRef.current.scrollTop = (newWindow.length + newIndex - 2) * ITEM_HEIGHT;
          }
        }, 0);
      }
    };

    const dayHandler = makeHandler(dayRef, days, circularDays, setSelectedDay);
    const monthHandler = makeHandler(monthRef, months, circularMonths, setSelectedMonth);
    const yearHandler = makeHandler(yearRef, years, circularYears, setSelectedYear, yearRecenter);

    if (dayRef.current) dayRef.current.addEventListener("scroll", dayHandler);
    if (monthRef.current) monthRef.current.addEventListener("scroll", monthHandler);
    if (yearRef.current) yearRef.current.addEventListener("scroll", yearHandler);

    return () => {
      clearTimeout(timeout);
      if (dayRef.current) dayRef.current.removeEventListener("scroll", dayHandler);
      if (monthRef.current) monthRef.current.removeEventListener("scroll", monthHandler);
      if (yearRef.current) yearRef.current.removeEventListener("scroll", yearHandler);
    };
  }, [days, months, years, selectedYear]);

  const Column = ({ refObj, items, selected, onSelect }) => (
    <div className="flex-shrink-0 relative">
      <div className="h-[108px] overflow-hidden">
        <div
          ref={refObj}
          className="h-full overflow-auto scrollbar-hide px-0"
          style={{ scrollSnapType: "y mandatory" }}
        >
          <div className="py-0">
            {items.map((v, i) => (
              <div
                key={i}
                className={`h-[36px] flex items-center justify-center text-[13px] tracking-tight cursor-pointer select-none ${
                  v === selected ? "text-[#675FFF] font-semibold" : "text-gray-500"
                }`}
                onClick={() => {
                  onSelect(v);
                  if (onClose) onClose();
                }}
              >
                {v}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Soft gradient masks */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent" />
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-3 z-50 border border-gray-200">
      <div className="flex items-center justify-center gap-2">
        <Column refObj={dayRef} items={circularDays} selected={selectedDay} onSelect={setSelectedDay} />
        <span className="text-[18px] font-bold text-gray-700">/</span>
        <Column refObj={monthRef} items={circularMonths} selected={selectedMonth} onSelect={setSelectedMonth} />
        <span className="text-[18px] font-bold text-gray-700">/</span>
        <Column refObj={yearRef} items={circularYears} selected={selectedYear} onSelect={setSelectedYear} />
      </div>
    </div>
  );
}

export default function DateTimePicker({ onClose, onSchedule, isSaving }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6, 1)) // Initialize to July 2025
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 12)) // Initialize to July 12, 2025
  const [time, setTime] = useState("15 : 25")
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false);
const [selectedDateString, setSelectedDateString] = useState(formatDDMMYYYY(selectedDate));
  const today = useMemo(() => new Date(), []) // Actual current date for 'Today' highlight
  const { t , i18n} = useTranslation()

  const yearPickerRef = useRef(null)
  const currentYearRef = useRef(null)

  const daysOfWeek = [t("emailings.mon"), t("emailings.tue"), t("emailings.wed"), t("emailings.thu"), t("emailings.fri"), t("emailings.sat"), t("emailings.sun")]

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth() // 0-indexed

    const firstDayOfMonth = getFirstDayOfMonth(year, month) // 0 for Mon, 6 for Sun
    const daysInMonth = getDaysInMonth(year, month)

    const prevMonthYear = month === 0 ? year - 1 : year
    const prevMonth = month === 0 ? 11 : month - 1
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth)

    const days = []

    // Add days from previous month
    for (let i = firstDayOfMonth; i > 0; i--) {
      days.push({
        date: new Date(prevMonthYear, prevMonth, daysInPrevMonth - i + 1),
        isOtherMonth: true,
      })
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isOtherMonth: false,
      })
    }

    // Add days from next month to fill the grid (up to 42 days total for 6 weeks)
    const nextMonthYear = month === 11 ? year + 1 : year
    const nextMonth = month === 11 ? 0 : month + 1
    let dayCounter = 1
    while (days.length < 42) {
      days.push({
        date: new Date(nextMonthYear, nextMonth, dayCounter),
        isOtherMonth: true,
      })
      dayCounter++
    }

    return days
  }, [currentMonth])
  
function formatDDMMYYYY(date) {
  return `${String(date.getDate()).padStart(2,"0")}/${String(date.getMonth()+1).padStart(2,"0")}/${date.getFullYear()}`;
}

function parseDDMMYYYY(str) {
  const [dd, mm, yyyy] = str.split("/").map((x) => parseInt(x, 10));
  return new Date(yyyy, mm - 1, dd);
}


  const handleDateClick = (date) => {
    setSelectedDate(date)
     setSelectedDateString(formatDDMMYYYY(date));  
    // When a date is clicked, ensure the calendar view updates to that month
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
  }

  // const handleYearClick = (year) => {
  //   setCurrentMonth((prev) => new Date(year, prev.getMonth(), 1))
  //   setSelectedDate(
  //     (prev) => new Date(year, prev.getMonth(), Math.min(prev.getDate(), getDaysInMonth(year, prev.getMonth()))),
  //   )
  //   setShowYearPicker(false)
  // }

  // Scroll to current year when year picker opens
  // useEffect(() => {
  //   if (showYearPicker && currentYearRef.current && yearPickerRef.current) {
  //     currentYearRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
  //   }
  // }, [showYearPicker])

  // Close year picker when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (yearPickerRef.current && !yearPickerRef.current.contains(event.target)) {
  //       setShowYearPicker(false)
  //     }
  //   }
  //   if (showYearPicker) {
  //     document.addEventListener("mousedown", handleClickOutside)
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutside)
  //   }
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside)
  //   }
  // }, [showYearPicker])

  // const years = useMemo(() => {
  //   const currentYear = currentMonth.getFullYear()
  //   const startYear = currentYear - 10
  //   const endYear = currentYear + 10
  //   const yearList = []
  //   for (let year = startYear; year <= endYear; year++) {
  //     yearList.push(year)
  //   }
  //   return yearList
  // }, [currentMonth])

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  }
function goToPreviousMonth() {
  setCurrentMonth(prev => {
    const year = prev.getFullYear();
    const month = prev.getMonth();
    return new Date(year, month - 1, 1);
  });
}

function goToNextMonth() {
  setCurrentMonth(prev => {
    const year = prev.getFullYear();
    const month = prev.getMonth();
    return new Date(year, month + 1, 1);
  });
}


  // function formatDate(date) {
  //   if (!date || isNaN(date.getTime())) {
  //     return "";
  //   }
  //   const options = { weekday: "short", month: "short", day: "numeric" };
  //   const formatted = date.toLocaleDateString("en-US", options);
  //   const day = date.getDate();
  //   let suffix = "th";
  //   if (day === 1 || day === 21 || day === 31) suffix = "st";
  //   else if (day === 2 || day === 22) suffix = "nd";
  //   else if (day === 3 || day === 23) suffix = "rd";

  //   return `${formatted.replace(/\d+/, "").trim()} ${day}${suffix}`;
  // }

  function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }
function getMonthName(monthIndex) {
  const date = new Date(2000, monthIndex, 1);
  return date.toLocaleString(i18n?.language || "en-US", { month: "short" });
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4">
      <div className="relative w-full max-w-[406px] max-h-[90vh] sm:max-h-[621px] overflow-auto rounded-[12px] bg-[#FFFFFF] border-[#00000029] border-[0.5px] mx-auto">
        <div className="flex flex-row justify-between align-center items-center h-[56px] w-full py-[16px] px-[20px] sm:px-[24px] gap-8 border-b-[0.5px] border-[#E2E4E9]">
          <h1 className="text-[16px] sm:text-[18px] font-medium">{t("constance.schedule_post")}</h1>
          <button className="cursor-pointer text-gray-400 hover:text-gray-600" aria-label="Close" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
        </div>
        
        {/* Your exact date/time section - completely unchanged */}
        <div className="p-[20px] gap-4 border-r-[1px] flex flex-col max-h-[501px] w-full">
          <div className="max-h-[57px] gap-[16px] flex flex-row">
            <div className="h-full w-[175px] flex flex-col">
              <label className="text-[12px] text-[#868C98] mb-1">{t("constance.date")}</label>

              <div className="relative w-full">
                <input
                  type="text"
                  value={selectedDateString}
                  readOnly
                  className="w-full rounded-md border h-[34px] border-gray-300 px-4 py-2 text-[13px] focus:border-v0-purple focus:outline-none focus:ring-1 focus:ring-v0-purple cursor-pointer bg-white"
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                />

                <div className="absolute right-3 top-[9px] text-gray-500 pointer-events-none">
                  {showDateDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {showDateDropdown && (
                  <div className="left-0 bottom-full mb-2 mt-1 w-full z-50">
                    <DateSelector
                        value={selectedDateString}
                      onChange={(val) => {
                        setSelectedDateString(val);
                        const parsed = parseDDMMYYYY(val);
                        setSelectedDate(parsed);
                        setCurrentMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
                      }}

                      onClose={() => setShowDateDropdown(false)}
                    />
                  </div>
                )}
              </div>
            </div>


            <div className="h-full w-[175px] flex flex-col">
              <label className="text-[12px] text-[#868C98] mb-1">
                {t("constance.time")}
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  value={time}
                  readOnly
                  className="w-full rounded-md border h-[34px] border-gray-300 px-4 py-2 text-[13px] focus:border-v0-purple focus:outline-none focus:ring-1 focus:ring-v0-purple cursor-pointer bg-white"
                  aria-label="Time input"
                  // onClick={() => setShowTimeDropdown(true)}
                  onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                />
                {showTimeDropdown && (
                  <div className="left-0 bottom-full mb-2  mt-1 w-full z-50">
                    <TimeSelector24
                      value={time}
                      onChange={(val) => setTime(val)}
                      onClose={() => setShowTimeDropdown(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <hr className="border-[0.5px] w-full max-w-[366px] mx-auto border-[#E2E4E9]" />
        <div className="max-h-[372px] w-full max-w-[366px] flex flex-col mx-auto mt-2 p-2 sm:p-0">
          <div className="flex flex-row justify-between max-h-[36px] rounded-[8px] gap-[6px] p-[6px] bg-[#F6F8FA]">
            <button className="w-[24px] h-[24px] flex justify-center items-center rounded-[6px] p-[2px] bg-[#FFFFFF]"
             onClick={goToPreviousMonth}
             >
              <ChevronLeft className="text-[#525866]" />
            </button>

            <label className="text-[14px] sm:text-[16px]">{getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}</label>
            <button className="w-[24px] h-[24px] flex justify-center items-center rounded-[6px] p-[2px] bg-[#FFFFFF]"
             onClick={goToNextMonth} ><ChevronRight className="text-[#525866]" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mt-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2 mx-auto text-[#868C98] text-[12px] sm:text-[14px] uppercase">
                {day.charAt(0)}
              </div>
            ))}

            {calendarDays.map((dayInfo, index) => {
              const isToday = isSameDay(dayInfo.date, today)
              const isSelected = isSameDay(dayInfo.date, selectedDate)
              const isFirstDayOfMonth = dayInfo.date.getDate() === 1
              const monthLabel = isFirstDayOfMonth ? getMonthName(dayInfo.date.getMonth()) : ""

              return (
                <div
                  key={index}
                  className={`h-8 w-8 sm:h-10 sm:w-10 cursor-pointer rounded-lg transition-colors text-[12px] sm:text-[14px] flex items-center justify-center
                ${dayInfo.isOtherMonth ? "text-gray-400" : "text-gray-800"}
                ${isToday ? "bg-v0-purple text-white font-semibold" : ""}
                ${isSelected && !isToday ? "bg-[#675FFF] text-white" : ""}
                ${!isToday && !isSelected && !dayInfo.isOtherMonth ? "hover:bg-gray-100" : ""}
                ${monthLabel || isToday ? "flex flex-col items-center justify-center" : "flex items-center justify-center"}
              `}
                  onClick={() => handleDateClick(dayInfo.date)}
                >
                  {/* {(monthLabel || isToday) && (
                    <span className="text-[10px] font-medium leading-none">{isToday ? "Today" : monthLabel}</span>
                  )} */}
                  <span className={`${monthLabel || isToday ? "mt-0.5" : ""}`}>{dayInfo.date.getDate()}</span>
                </div>
              )
            })}
          </div> 
        </div>
        <div className="h-[64px] w-full border-t-[0.5px] border-[#E2E4E9] flex items-center justify-end px-[16px] sm:px-[20px]">
          <div className="flex flex-row items-center gap-[12px] sm:gap-[16px]">
            <button className="h-[32px] w-[63px] rounded-[8px] border-[0.5px] border-[#00000029] text-[13px] font-medium flex items-center justify-center" onClick={onClose}>
              {t("constance.cancel")}
            </button>

            <button className={`h-[32px] ${isSaving ? 'cursor-not-allowed' : 'cursor-pointer'} w-[110px] rounded-[8px] border-[0.5px] border-[#00000029] text-[13px] font-medium text-white bg-[#675FFF] flex items-center justify-center`}
              onClick={() => {
                const dateUTC = UtcFormat(selectedDate);
                // Parse time string and format as HH:mm in UTC
                const [hourStr, minuteStr] = time.split(":").map((s) => s.trim());
                const hours = String(parseInt(hourStr, 10)).padStart(2, '0');
                const minutes = String(parseInt(minuteStr, 10)).padStart(2, '0');
                const timeUTC = `${hourStr}:${minuteStr}`;
                if (onSchedule) onSchedule(dateUTC, timeUTC);
                if (onClose) onClose();
              }}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center justify-center gap-2">
                  <p>{t("brain_ai.processing")}</p>
                  <span className="loader" />
                </div>
              ) : (
                t("constance.schedule_now")
              )}

            </button>
          </div>
        </div>

        {/* <button className="absolute cursor-pointer right-4 top-4 text-gray-400 hover:text-gray-600" aria-label="Close" onClick={onClose}>
          <X className="h-5 w-5" />
        </button> */}

        {/* <div className="mb-6 space-y-1">
          <div
            className="relative text-lg font-semibold text-gray-500 cursor-pointer hover:text-gray-700 min-w-[60px] w-[60px] text-center"
            onClick={() => setShowYearPicker(!showYearPicker)}
          >
            {currentMonth.getFullYear()}
            {showYearPicker && (
              <div
                ref={yearPickerRef}
                className="absolute left-0 top-full z-10 mt-2 h-48 w-24 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
              >
                {years.map((year) => (
                  <div
                    key={year}
                    ref={year === currentMonth.getFullYear() ? currentYearRef : null}
                    className={`cursor-pointer px-4 py-2 text-center hover:bg-gray-100
                      ${year === currentMonth.getFullYear() ? "bg-v0-purple text-white font-semibold" : ""}
                    `}
                    onClick={(e) => {
                      e.stopPropagation() // Prevent closing the picker immediately
                      handleYearClick(year)
                    }}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="text-3xl font-bold">{formatDate(selectedDate)}</div>
        </div> */}

        {/* Removed month navigation buttons */}
        {/* <div className="mb-4 flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-xl font-semibold text-gray-800">
            {getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}
          </div>
          <button
            onClick={goToNextMonth}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div> */}

      
        {/* <div className="mb-2">
          <div className="grid grid-cols-7 text-center text-sm font-medium bg-[#E1E4EA99] text-gray-500  border-gray-200 rounded-md overflow-hidden">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>
        </div> */}

        {/* <div className="grid grid-cols-7 gap-2 text-center text-base">
          {calendarDays.map((dayInfo, index) => {
            const isToday = isSameDay(dayInfo.date, today)
            const isSelected = isSameDay(dayInfo.date, selectedDate)
            const isFirstDayOfMonth = dayInfo.date.getDate() === 1
            const monthLabel = isFirstDayOfMonth ? getMonthName(dayInfo.date.getMonth()) : ""

            return (
              <div
                key={index}
                className={`h-10 w-10 cursor-pointer rounded-lg transition-colors
                ${dayInfo.isOtherMonth ? "text-gray-400" : "text-gray-800"}
                ${isToday ? "bg-v0-purple text-white font-semibold" : ""}
                ${isSelected && !isToday ? "bg-[#675FFF] text-white" : ""}
                ${!isToday && !isSelected && !dayInfo.isOtherMonth ? "hover:bg-gray-100" : ""}
                ${monthLabel || isToday ? "flex flex-col items-center justify-center" : "flex items-center justify-center"}
              `}
                onClick={() => handleDateClick(dayInfo.date)}
              >
                {(monthLabel || isToday) && (
                  <span className="text-[10px] font-medium leading-none">{isToday ? "Today" : monthLabel}</span>
                )}
                <span className={`${monthLabel || isToday ? "mt-0.5" : ""}`}>{dayInfo.date.getDate()}</span>
              </div>
            )
          })}
        </div>  */}

        {/* <div className="mt-6 space-y-4">
          <div className="text-base font-medium text-gray-700">{t("constance.time")}</div>
          <div className="relative w-full">
            <input
              type="text"
              value={time}
              readOnly
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-lg focus:border-v0-purple focus:outline-none focus:ring-1 focus:ring-v0-purple cursor-pointer bg-white"
              aria-label="Time input"
              onClick={() => setShowTimeDropdown(true)}
            />
            {showTimeDropdown && (
              <div className="absolute left-0 bottom-full mb-2 w-full z-50">
                <TimeSelector24
                  value={time}
                  onChange={(val) => setTime(val)}
                  onClose={() => setShowTimeDropdown(false)}
                />
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">{t("predefined_time_slot")}</div>
        </div> */}

        {/* <div className="mt-8 flex justify-center gap-[16px] ">
          <button className="rounded-md cursor-pointer border border-gray-300 px-5 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200
          w-[225px]" onClick={onClose}>
            {t("cancel")}
          </button>
          <button
            className={`w-[225px] ${isSaving ? 'cursor-not-allowed' : 'cursor-pointer'} bg-[#675FFF] rounded-md  px-5 py-2 text-base font-medium text-white border border-[#675FFF] hover:bg-v0-purple/90 focus:outline-none focus:ring-2 focus:ring-v0-purple`}
            onClick={() => {
              const dateUTC = UtcFormat(selectedDate);
              // Parse time string and format as HH:mm in UTC
              const [hourStr, minuteStr] = time.split(":").map((s) => s.trim());
              const hours = String(parseInt(hourStr, 10)).padStart(2, '0');
              const minutes = String(parseInt(minuteStr, 10)).padStart(2, '0');
              const timeUTC = `${hourStr}:${minuteStr}`;
              if (onSchedule) onSchedule(dateUTC, timeUTC);
              if (onClose) onClose();
            }}
            disabled={isSaving}
          >
            {isSaving ? <div className="flex items-center justify-center gap-2"><p>{t("brain_ai.processing")}</p><span className="loader" /></div> : t("schedule")}
          </button>
        </div> */}
      </div>
    </div>
  )
}
