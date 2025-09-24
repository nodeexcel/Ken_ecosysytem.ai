import { useState, useMemo, useRef, useEffect } from "react"
import { X } from "lucide-react" // Removed ChevronLeft, ChevronRight
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

export default function DateTimePicker({ onClose, onSchedule, isSaving }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6, 1)) // Initialize to July 2025
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 12)) // Initialize to July 12, 2025
  const [time, setTime] = useState("15 : 25")
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const today = useMemo(() => new Date(), []) // Actual current date for 'Today' highlight
  const { t } = useTranslation()

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

  const handleDateClick = (date) => {
    setSelectedDate(date)
    // When a date is clicked, ensure the calendar view updates to that month
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
  }

  const handleYearClick = (year) => {
    setCurrentMonth((prev) => new Date(year, prev.getMonth(), 1))
    setSelectedDate(
      (prev) => new Date(year, prev.getMonth(), Math.min(prev.getDate(), getDaysInMonth(year, prev.getMonth()))),
    )
    setShowYearPicker(false)
  }

  // Scroll to current year when year picker opens
  useEffect(() => {
    if (showYearPicker && currentYearRef.current && yearPickerRef.current) {
      currentYearRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [showYearPicker])

  // Close year picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearPickerRef.current && !yearPickerRef.current.contains(event.target)) {
        setShowYearPicker(false)
      }
    }
    if (showYearPicker) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showYearPicker])

  const years = useMemo(() => {
    const currentYear = currentMonth.getFullYear()
    const startYear = currentYear - 10
    const endYear = currentYear + 10
    const yearList = []
    for (let year = startYear; year <= endYear; year++) {
      yearList.push(year)
    }
    return yearList
  }, [currentMonth])

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  }

  function formatDate(date) {
    if (!date || isNaN(date.getTime())) {
      return "";
    }
    const options = { weekday: "short", month: "short", day: "numeric" };
    const formatted = date.toLocaleDateString("en-US", options);
    const day = date.getDate();
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    return `${formatted.replace(/\d+/, "").trim()} ${day}${suffix}`;
  }

  function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  function getMonthName(monthIndex) {
    const date = new Date(2000, monthIndex, 1);
    return date.toLocaleString("en-US", { month: "short" });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-md overflow-auto max-h-[85vh] rounded-xl bg-white p-6 shadow-lg">
        <button className="absolute cursor-pointer right-4 top-4 text-gray-400 hover:text-gray-600" aria-label="Close" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 space-y-1">
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
        </div>

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

        <div className="mb-2">
          <div className="grid grid-cols-7 text-center text-sm font-medium bg-[#E1E4EA99] text-gray-500  border-gray-200 rounded-md overflow-hidden">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-base">
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
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-base font-medium text-gray-700">{t("constance.time")}</div>
          {/* Time Input with Dropdown Selector */}
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
        </div>

        <div className="mt-8 flex justify-center gap-[16px] ">
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
        </div>
      </div>
    </div>
  )
}
