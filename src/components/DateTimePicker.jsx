import { useState, useMemo, useRef, useEffect } from "react"
import { X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
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
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7, 1)) // Initialize to August 2025
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 7, 11)) // Initialize to August 11, 2025
  const [time, setTime] = useState("16:30")
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const today = useMemo(() => new Date(), []) // Actual current date for 'Today' highlight
  const { t } = useTranslation()

  const yearPickerRef = useRef(null)
  const currentYearRef = useRef(null)
  const dateDropdownRef = useRef(null)
  const timeDropdownRef = useRef(null)

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

  // Format date for input field: "11/08/2025"
  function formatDateInput(date) {
    if (!date || isNaN(date.getTime())) {
      return "";
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Format time for input field: "16:30"
  function formatTimeInput(timeStr) {
    if (!timeStr) return "16:30";
    return timeStr.replace(/\s/g, ""); // Remove spaces
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return newDate;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      return newDate;
    });
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setShowDateDropdown(false);
      }
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setShowTimeDropdown(false);
      }
    };
    if (showDateDropdown || showTimeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDateDropdown, showTimeDropdown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-md overflow-auto max-h-[85vh] rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between z-10 rounded-t-xl">
          <h1 className="text-[#1E1E1E] font-[600] text-xl">Schedule Post</h1>
          <button 
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" 
            aria-label="Close" 
            onClick={onClose}
          >
            <X className="h-5 w-5 text-[#868C98]" />
          </button>
        </div>
      
        
        {/* Date and Time Inputs */}
        <div className="px-8 py-2 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            {/* Date Input */}
            <div className="relative" ref={dateDropdownRef}>
              <label className="block text-sm font-medium text-[#808591] mb-1">Date</label>
              <input
                type="text"
                value={formatDateInput(selectedDate)}
                readOnly
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="w-full rounded-lg border border-[#E1E4EA] px-4 py-2 text-sm text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none focus:ring-1 focus:ring-[#675FFF] cursor-pointer bg-white"
              />
              <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-gray-400 pointer-events-none" />
              
              {/* Date Calendar Dropdown */}
              {showDateDropdown && (
                <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-[320px]">
                  {/* Month Navigation */}
                  <div className="flex items-center bg-[#F6F8FA] justify-between mb-4 ">
                    <button
                      onClick={goToPreviousMonth}
                      className="p-1 hover:bg-gray-100 rounded"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="text-base font-semibold text-gray-800">
                      {getMonthName(currentMonth.getMonth())}, {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={goToNextMonth}
                      className="p-1 hover:bg-gray-100 rounded"
                      aria-label="Next month"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((dayInfo, index) => {
                      const isToday = isSameDay(dayInfo.date, today)
                      const isSelected = isSameDay(dayInfo.date, selectedDate)
                      // Mock event indicator - you can replace this with actual event data
                      const hasEvent = dayInfo.date.getDate() === 6 || dayInfo.date.getDate() === 23

                      return (
                        <div
                          key={index}
                          className={`h-9 w-9 cursor-pointer rounded-md transition-colors flex flex-col items-center justify-center relative
                            ${dayInfo.isOtherMonth ? "text-gray-400" : "text-gray-800"}
                            ${isSelected ? "bg-[#675FFF] text-white" : ""}
                            ${!isSelected && !dayInfo.isOtherMonth ? "hover:bg-gray-100" : ""}
                          `}
                          onClick={() => {
                            handleDateClick(dayInfo.date)
                            setShowDateDropdown(false)
                          }}
                        >
                          <span className={`text-sm ${isSelected ? "text-white font-semibold" : ""}`}>
                            {dayInfo.date.getDate()}
                          </span>
                          {/* Event indicator dot */}
                          {hasEvent && !dayInfo.isOtherMonth && !isSelected && (
                            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#675FFF]"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Time Input */}
            <div className="relative" ref={timeDropdownRef}>
              <label className="block text-sm font-medium text-[#808591] mb-1">Time</label>
              <input
                type="text"
                value={formatTimeInput(time)}
                readOnly
                onClick={() => setShowTimeDropdown(true)}
                className="w-full rounded-lg border border-[#E1E4EA] px-4 py-2 text-sm text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none focus:ring-1 focus:ring-[#675FFF] cursor-pointer bg-white"
              />
              {showTimeDropdown && (
                <div className="absolute left-0 top-full mt-2 w-full z-50">
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

        {/* Content */}
        <div className="px-6 py-4">
          {/* Month Navigation Header */}
          <div className="flex items-center bg-[#F6F8FA] rounded-lg justify-between mb-4">
            <button
              onClick={goToPreviousMonth}
              className="p-1.5 rounded-lg m-2 hover:bg-gray-300 cursor-pointer transition-colors bg-white"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <div className="text-base font-semibold text-gray-800">
              {getMonthName(currentMonth.getMonth())}, {currentMonth.getFullYear()}
            </div>
            <button
              onClick={goToNextMonth}
              className="p-1.5 m-2 rounded-lg bg-white cursor-pointer hover:bg-gray-300 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="mb-2">
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600">
              {daysOfWeek.map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((dayInfo, index) => {
              const isToday = isSameDay(dayInfo.date, today)
              const isSelected = isSameDay(dayInfo.date, selectedDate)
              // Mock event indicator - you can replace this with actual event data
              const hasEvent = dayInfo.date.getDate() === 6 || dayInfo.date.getDate() === 23

              return (
                <div
                  key={index}
                  className={`h-9 w-9 cursor-pointer rounded-md transition-colors flex items-center justify-center relative
                    ${dayInfo.isOtherMonth ? "text-gray-400" : "text-gray-800"}
                    ${isSelected ? "bg-[#675FFF] text-white font-semibold" : ""}
                    ${!isSelected && !dayInfo.isOtherMonth ? "hover:bg-gray-100" : ""}
                  `}
                  onClick={() => handleDateClick(dayInfo.date)}
                >
                  <span className={`text-sm ${isSelected ? "text-white font-semibold" : ""}`}>
                    {dayInfo.date.getDate()}
                  </span>
                  {/* Event indicator dot */}
                  {hasEvent && !dayInfo.isOtherMonth && !isSelected && (
                    <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#675FFF]"></div>
                  )}
                </div>
              )
            })}
          </div>


          {/* Footer with Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-2 py-4 flex items-center justify-end gap-3 z-10 rounded-b-xl">
            <button 
              className="px-5 py-2.5 rounded-lg cursor-pointer bg-white border border-gray-300 text-[#1E1E1E] font-[500] text-sm hover:bg-gray-50 transition-colors shadow-sm"
              onClick={onClose}
            >
              {t("cancel")}
            </button>
            <button
              className={`px-5 py-2.5 rounded-lg ${isSaving ? 'cursor-not-allowed' : 'cursor-pointer'} bg-[#675FFF] text-white font-[500] text-sm hover:bg-[#5a4fe6] transition-colors shadow-sm`}
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
                "Schedule Now"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
