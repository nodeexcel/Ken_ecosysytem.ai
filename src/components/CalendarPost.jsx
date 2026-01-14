import { useEffect, useState, useRef, useMemo } from "react"
import { ChevronLeft, ChevronRight, X, Search, ChevronDown } from "lucide-react"
import successImg from "../assets/svg/success.svg"
// removed API fallback; events now come exclusively from props
import { SelectDropdown } from "./Dropdown"
import { useTranslation } from "react-i18next";

export default function CalendarPost({ status = true, calenderData = [] }) {
  // Get current date information
  const today = new Date()
  const { t } = useTranslation();
  // State for current view date information
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentDay, setCurrentDay] = useState(today.getDate())
  const [currentView, setCurrentView] = useState("month");
  const [newEvents, setNewEvents] = useState([]);
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDateDropdown, setShowDateDropdown] = useState(false)


  // Week view state
  const [selectedWeekStart, setSelectedWeekStart] = useState(0)
  const [selectedWeekEnd, setSelectedWeekEnd] = useState(0);
  const dateDropdownRef = useRef(null);

  // Handle click outside to close date dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setShowDateDropdown(false);
      }
    };
    if (showDateDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDateDropdown]);

  useEffect(() => {
    if (newEvents.length > 0) {
      setLoading(false)
    }
  }, [newEvents])

  // Initialize week view dates if needed
  if (selectedWeekStart === 0) {
    const firstDayOfWeek = getFirstDayOfWeek(new Date(currentYear, currentMonth, currentDay))
    setSelectedWeekStart(firstDayOfWeek.getDate())

    const lastDayOfWeek = new Date(firstDayOfWeek)
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)
    setSelectedWeekEnd(lastDayOfWeek.getDate())
  }

  // Helper function to parse date string (YYYY-MM-DD) to Date object
  const parseDate = (dateString) => {
    if (!dateString || dateString === "None") return null;
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  // Helper function to get day name from date
  const getDayName = (date) => {
    const days = [`${t("emailings.sunday")}`, `${t("emailings.monday")}`, `${t("emailings.tuesday")}`, `${t("emailings.wednesday")}`, `${t("emailings.thursday")}`, `${t("emailings.friday")}`, `${t("emailings.saturday")}`]
    return days[date.getDay()]
  }

  // Helper function to get events for a specific day
  const getNewEventForDay = (day, month, year) => {
    return newEvents.filter((event) => {
      const eventDate = parseDate(event.scheduled_date)
      return (
        eventDate &&
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      )
    })
  }

  // Parse time string to get hour and minutes (HH:MM:SS)
  const parseTime = (timeStr) => {
    if (!timeStr || timeStr === "None") return { hour: 0, minutes: 0 }
    const [hour, minutes] = timeStr.split(":").map(Number)
    return { hour, minutes }
  }

  // Helper function to get events for a specific hour and day
  const getNewEventForHourDay = (hourStr, day, month, year) => {
    const eventsForDay = getNewEventForDay(day, month, year)
    // Convert hourStr (e.g., "1PM") to 24-hour format
    let slotHour = 0;
    if (/AM|PM/i.test(hourStr)) {
      const match = hourStr.match(/(\d+)(AM|PM)/i);
      if (match) {
        let h = Number(match[1]);
        const period = match[2];
        if (period.toUpperCase() === "PM" && h !== 12) slotHour = h + 12;
        else if (period.toUpperCase() === "AM" && h === 12) slotHour = 0;
        else slotHour = h;
      }
    }
    return eventsForDay.filter((event) => {
      const { hour: eventHour } = parseTime(event.scheduled_time)
      return eventHour === slotHour
    })
  }

  // Calculate position within hour slot based on minutes
  const calculateEventPosition = (timeStr) => {
    const { minutes } = parseTime(timeStr)
    return (minutes / 60) * 100
  }

  // Helper to format date as YYYY-MM-DD (or empty if none)
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "None") return "";
    return dateStr;
  }

  // Helper to format time as HH:MM
  const formatTimeHHMM = (timeStr) => {
    if (!timeStr || timeStr === "None") return "";
    const [hour, minute] = timeStr.split(":");
    return `${hour}:${minute}`;
  }

  const daysOfWeek = [`${t("emailings.mon")}`, `${t("emailings.tue")}`, `${t("emailings.wed")}`, `${t("emailings.thu")}`, `${t("emailings.fri")}`, `${t("emailings.sat")}`, `${t("emailings.sun")}`]
  const monthNames = [
    `${t("emailings.january")}`,
    `${t("emailings.february")}`,
    `${t("emailings.march")}`,
    `${t("emailings.april")}`,
    `${t("emailings.may")}`,
    `${t("emailings.june")}`,
    `${t("emailings.july")}`,
    `${t("emailings.august")}`,
    `${t("emailings.september")}`,
    `${t("emailings.october")}`,
    `${t("emailings.november")}`,
    `${t("emailings.december")}`,
  ]

  // Replace the hours array with full 24-hour cycle in 12-hour format
  const hours = [
    "12AM",
    "1AM",
    "2AM",
    "3AM",
    "4AM",
    "5AM",
    "6AM",
    "7AM",
    "8AM",
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
    "6PM",
    "7PM",
    "8PM",
    "9PM",
    "10PM",
    "11PM",
  ]

  const calendarOptions = useMemo(() => [
    { label: t("constance.monthly"), key: "month" },
    { label: t("constance.weekly"), key: "week" },
    { label: t("constance.daily"), key: "day" }
  ], [t])

  // Get current month/year display text
  const getCurrentDateText = () => {
    return `${monthNames[currentMonth]} ${currentYear}`
  }

  // Local dummy data for development. Same keys as API: platform, scheduled_type, scheduled_date, scheduled_time
  // Normalize incoming events (derive date/time from published_time when scheduled values are "None")
  const normalizeEvents = (events) => {
    if (!Array.isArray(events)) return []
    return events.map((e) => {
      let scheduled_date = e.scheduled_date
      let scheduled_time = e.scheduled_time
      if ((!scheduled_date || scheduled_date === "None" || scheduled_date === null) && e.published_time && e.published_time !== "None") {
        const [datePart, timePartRaw] = String(e.published_time).split(" ")
        const timePart = timePartRaw ? timePartRaw.split(".")[0] : ""
        if (datePart) scheduled_date = datePart
        if (timePart) scheduled_time = timePart
      }
      return { ...e, scheduled_date, scheduled_time }
    })
  }

  // Initialize events from props only
  useEffect(() => {
    if (Array.isArray(calenderData)) {
      setNewEvents(normalizeEvents(calenderData))
    } else {
      setNewEvents([])
    }
    setLoading(false)
  }, [calenderData])

  // Helper functions for date manipulation
  function getFirstDayOfWeek(date) {
    const day = date.getDay() // 0 = Sunday, 1 = Monday, etc.
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust to get Monday

    const monday = new Date(date)
    monday.setDate(diff)
    return monday
  }

  function getMonthData(year, month) {
    // Get the first day of the month
    const firstDay = new Date(year, month, 1)
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDay.getDay() - 1 // Adjust for Monday as first day
    if (firstDayOfWeek < 0) firstDayOfWeek = 6 // If Sunday, set to 6

    // Get the number of days in the month
    const daysInMonth = lastDay.getDate()

    // Get the number of days in the previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate()

    const days = []

    // Add days from previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const day = prevMonthLastDay - firstDayOfWeek + i + 1
      days.push({
        day,
        month: month - 1 < 0 ? 11 : month - 1,
        year: month - 1 < 0 ? year - 1 : year,
        isCurrentMonth: false,
      })
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      })
    }

    // Add days from next month
    const remainingDays = 42 - days.length // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1 > 11 ? 0 : month + 1,
        year: month + 1 > 11 ? year + 1 : year,
        isCurrentMonth: false,
      })
    }

    return days
  }

  // Navigation functions
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handlePrevWeek = () => {
    const currentDate = new Date(currentYear, currentMonth, selectedWeekStart)
    currentDate.setDate(currentDate.getDate() - 7)

    setCurrentMonth(currentDate.getMonth())
    setCurrentYear(currentDate.getFullYear())

    const newWeekStart = currentDate.getDate()
    setSelectedWeekStart(newWeekStart)

    const endDate = new Date(currentDate)
    endDate.setDate(newWeekStart + 6)
    setSelectedWeekEnd(endDate.getDate())
  }

  const handleNextWeek = () => {
    const currentDate = new Date(currentYear, currentMonth, selectedWeekStart)
    currentDate.setDate(currentDate.getDate() + 7)

    setCurrentMonth(currentDate.getMonth())
    setCurrentYear(currentDate.getFullYear())

    const newWeekStart = currentDate.getDate()
    setSelectedWeekStart(newWeekStart)

    const endDate = new Date(currentDate)
    endDate.setDate(newWeekStart + 6)
    setSelectedWeekEnd(endDate.getDate())
  }

  const handlePrevDay = () => {
    const currentDate = new Date(currentYear, currentMonth, currentDay)
    currentDate.setDate(currentDate.getDate() - 1)

    setCurrentDay(currentDate.getDate())
    setCurrentMonth(currentDate.getMonth())
    setCurrentYear(currentDate.getFullYear())
  }

  const handleNextDay = () => {
    const currentDate = new Date(currentYear, currentMonth, currentDay)
    currentDate.setDate(currentDate.getDate() + 1)

    setCurrentDay(currentDate.getDate())
    setCurrentMonth(currentDate.getMonth())
    setCurrentYear(currentDate.getFullYear())
  }

  // Get status color for events
  const getStatusStyles = (scheduled_type) => {
    switch (scheduled_type) {
      case "schedule":
        return {
          bg: "bg-[#EEEDFF]",
          border: "border-[#007AFF]",
          text: "text-[#007AFF]",
        }
      case "draft":
        return {
          bg: "bg-[#FFEFD9]",
          border: "border-[#FF9500]",
          text: "text-[#FF9500]",
        }
      case "publish":
        return {
          bg: "bg-[]",
          border: "border-[#34C759]",
          text: "text-[#34C759]",
        }
      default:
        return {
          bg: "bg-[#EEEDFF]",
          border: "border-gray-400",
          text: "text-gray-600",
        }
    }
  }

  const renderStatusLabel = (scheduled_type) => {
    switch (scheduled_type) {
      case "schedule":
        return "schedule"
      case "draft":
        return "Draft"
      case "publish":
        return "publish"
      default:
        return "Unknown"
    }
  }

  // Calendar view rendering functions
  const renderMonthView = () => {
    const days = getMonthData(currentYear, currentMonth)

    return (
      <div className="grid grid-cols-7 border-t border-[#E1E4EA]">
        {/* Header row with days of the week */}
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2 text-center border-r border-b border-[#E1E4EA] font-medium text-sm text-[#868C98]">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const dayEvents = getNewEventForDay(day.day, day.month, day.year)
          const isToday =
            day.day === today.getDate() && day.month === today.getMonth() && day.year === today.getFullYear()

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border-r border-b border-[#E1E4EA] relative ${!day.isCurrentMonth ? "bg-[#F0EFFF]" : ""}`}
              onClick={() => {
                setCurrentDay(day.day)
                setCurrentMonth(day.month)
                setCurrentYear(day.year)
                setCurrentView("day")
              }}
            >
              <div className="flex justify-between items-start">
                <div className={`relative ${isToday ? "flex items-center justify-center" : ""}`}>
                  {isToday ? (
                    <div className="w-7 h-7 rounded-full bg-[#675FFF] flex items-center justify-center">
                      <span className="text-white">{day.day}</span>
                    </div>
                  ) : (
                    <span className={`text-sm text-[#5A687C] font-[600]`}>{day.day}</span>
                  )}
                </div>
              </div>

              {/* Events */}
              <div className="mt-1">
                {dayEvents.map((event, eventIndex) => {
                  const statusStyles = getStatusStyles(event.scheduled_type)
                  return (
                    <div key={eventIndex} className={`text-xs ${statusStyles.bg} flex flex-col items-start p-2 mb-1 rounded gap-1`}>
                      <div className="text-sm font-[700] text-[#1E1E1E] w-auto border border-transparent border-xl bg-black/10 rounded-sm  px-3">{event.platform}</div>
                      <div className={`mt-0.5 w-70% text-sm font-[600] ${statusStyles.text} rounded-full border ${statusStyles.border} px-3  bg-[#EBFAEF]`}>
                        {renderStatusLabel(event.scheduled_type)}
                      </div>
                      <div className="mt-0.5 text-[#5A687C] text-[12px] font-[600]">{formatTimeHHMM(event.scheduled_time)}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Generate week days for week view
  const getWeekDays = () => {
    const weekDays = []
    const startDate = new Date(currentYear, currentMonth, selectedWeekStart)

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      weekDays.push({
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
      })
    }

    return weekDays
  }

  const renderWeekView = () => {
    const weekDays = getWeekDays()

    return (
      <div className="grid grid-cols-8 border-t border-[#E1E4EA]">
        {/* Time column */}
        <div className="border-r border-[#E1E4EA]">
          <div className="h-10 border-b border-[#E1E4EA]" />
          {hours.map((hour, index) => (
            <div
              key={hour}
              className={`h-34 ${hours.length !== index + 1 && "border-b"} border-[#E1E4EA] flex items-start justify-end pr-2 pt-1`}
            >
              <span className="text-xs text-[#5A687C] font-[600]">{hour}</span>
            </div>
          ))}
        </div>

        {/* Days columns */}
        {weekDays.map((day, index) => {
          const isToday =
            day.day === today.getDate() && day.month === today.getMonth() && day.year === today.getFullYear()
          const dayName = daysOfWeek[index]

          return (
            <div key={index} className={`${weekDays.length !== index + 1 && "border-r"} border-[#E1E4EA]`}>
              {/* Day header */}
              <div className="h-10 border-b border-[#E1E4EA] flex flex-col items-center justify-center">
                <div className="text-sm flex items-center gap-1 font-medium">
                  {dayName}{" "}
                  {!isToday ? <span className={`${isToday ? "w-6 h-6 rounded-full bg-[#675FFF] p-1 text-white" : ""}`}>
                    {day.day}
                  </span> :
                    <div className="w-6 h-6 rounded-full bg-[#675FFF] flex items-center justify-center">
                      <span className="text-white">{day.day}</span>
                    </div>}
                </div>
              </div>

              {/* Hour cells */}
              {hours.map((hour, hourIndex) => {
                const hourEvents = getNewEventForHourDay(hour, day.day, day.month, day.year)

                return (
                  <div
                    key={`${day.day}-${hour}`}
                    className={`h-34 ${hours.length !== hourIndex + 1 && "border-b"} border-[#E1E4EA] relative`}
                  >
                    {/* 30-minute line */}
                    <div className="absolute left-0 right-0 top-1/2 border-t border-gray-200 border-dashed"></div>

                    {hourEvents.map((event, eventIndex) => {
                      const statusStyles = getStatusStyles(event.scheduled_type)
                      const topPosition = calculateEventPosition(event.scheduled_time)

                      return (
                        <div
                          key={eventIndex}
                          className={`${statusStyles.bg} p-2 rounded cursor-pointer absolute left-1 right-1 z-10`}
                          style={{ top: `${topPosition}%` }}
                        >
                          <div className="text-[14px] font-[700] text-[#1E1E1E]">{event.platform}</div>
                          <div className={`mt-0.5 text-[12px] font-[500] ${statusStyles.text} rounded-full border ${statusStyles.border} w-fit px-1.5 py-0.5 bg-white`}>{renderStatusLabel(event.scheduled_type)}</div>
                          <div className="mt-0.5 text-[12px] font-[400] text-[#5A687C]">{formatTimeHHMM(event.scheduled_time)}</div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  const renderDayView = () => {
    return (
      <div className="grid grid-cols-1 border-t border-[#E1E4EA]">
        {/* Hours */}
        {hours.map((hour, index) => {
          const hourEvents = getNewEventForHourDay(hour, currentDay, currentMonth, currentYear)

          return (
            <div key={hour} className="flex border-[#E1E4EA]">
              {/* Time column */}
              <div
                className={`w-20 py-2 border-r border-[#E1E4EA] ${hours.length !== index + 1 && "border-b"} flex items-start justify-end pr-2`}
              >
                <span className="text-xs text-[#5A687C] font-[600]">{hour}</span>
              </div>

              {/* Events column */}
              <div className={`flex-1 border-[#E1E4EA] ${hours.length !== index + 1 && "border-b"} h-34 relative`}>
                {/* 30-minute line */}
                <div className="absolute left-0 right-0 top-1/2 border-t border-gray-200 border-dashed"></div>

                {hourEvents.map((event, eventIndex) => {
                  const statusStyles = getStatusStyles(event.scheduled_type)
                  const topPosition = calculateEventPosition(event.scheduled_time)

                  return (
                    <div
                      key={eventIndex}
                      className={`${statusStyles.bg} p-2 rounded-l cursor-pointer w-full absolute z-10`}
                      style={{ top: `${topPosition}%` }}
                    >
                      <div className="text-[14px] font-[700] text-[#1E1E1E]">{event.platform}</div>
                      <div className={`mt-0.5 text-[12px] font-[500] ${statusStyles.text} rounded-full border ${statusStyles.border} w-fit px-1.5 py-0.5 bg-white`}>{renderStatusLabel(event.scheduled_type)}</div>
                      <div className="mt-0.5 text-[12px] font-[400] text-[#5A687C]">{formatTimeHHMM(event.scheduled_time)}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderCalendarHeader = () => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 p-2 sm:p-3 lg:p-4 border-b border-gray-200">
        {/* Left Side - Date Selector */}
        <div className="relative" ref={dateDropdownRef}>
          <div className="flex items-center justify-center p-1.5 sm:p-2 border border-transparent rounded-md hover:border-gray-300 cursor-pointer transition-all">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-1.5 sm:gap-2 text-[#1E1E1E] cursor-pointer font-medium text-sm sm:text-base hover:text-gray-700 transition-colors"
            >
              <span>{getCurrentDateText()}</span>
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            </button>
          </div>




          {/* Date Dropdown - Month/Year Picker */}
          {showDateDropdown && (
            <div className="absolute left-0 sm:left-auto right-0 sm:right-auto top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 sm:p-4 z-50 w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[280px] max-w-[320px] sm:max-w-none">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <button
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11)
                      setCurrentYear(currentYear - 1)
                    } else {
                      setCurrentMonth(currentMonth - 1)
                    }
                  }}
                  className="p-0.5 sm:p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="font-semibold text-sm sm:text-base">{getCurrentDateText()}</span>
                <button
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0)
                      setCurrentYear(currentYear + 1)
                    } else {
                      setCurrentMonth(currentMonth + 1)
                    }
                  }}
                  className="p-0.5 sm:p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {monthNames.map((month, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentMonth(index)
                      setShowDateDropdown(false)
                    }}
                    className={`p-1.5 sm:p-2 rounded text-xs sm:text-sm hover:bg-gray-100 ${currentMonth === index ? "bg-[#675FFF] text-white" : "text-gray-700"
                      }`}
                  >
                    {month.substring(0, 3)}
                  </button>
                ))}
              </div>

              {/* Year Selector */}
              <div className="mt-3 sm:mt-4 flex items-center justify-between">
                <button
                  onClick={() => setCurrentYear(currentYear - 1)}
                  className="p-0.5 sm:p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="font-medium text-sm sm:text-base">{currentYear}</span>
                <button
                  onClick={() => setCurrentYear(currentYear + 1)}
                  className="p-0.5 sm:p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Search and View Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 sm:pl-9 pr-3 sm:pr-4 py-3 md:py-2.5 text-xs sm:text-sm border border-[#E1E4EA] rounded-lg bg-white focus:outline-none focus:border-[#675FFF] text-[#1E1E1E] placeholder:text-gray-400 w-full sm:w-[180px] lg:w-[200px]"
            />
          </div>

          {/* View Dropdown */}
          <SelectDropdown
            name="view"
            options={calendarOptions}
            value={currentView}
            onChange={(updated) => {
              setCurrentView(updated)
            }}
            placeholder={t("constance.monthly")}
            className="w-[100px] sm:w-[150px]"
            forceDownward={true}
          />
        </div>
      </div>
    )
  }

  if (loading) return <p className="h-screen flex justify-center items-center"><span className="loader" /></p>

  return (
    <div className="gap-3 sm:gap-4 lg:gap-6 h-screen overflow-auto py-2 sm:py-3 lg:py-4 pr-1 sm:pr-2">
      {status && <h1 className="font-semibold text-[#1e1e1e] mb-3 sm:mb-4 lg:mb-5 text-xl sm:text-2xl leading-7 sm:leading-8 px-2 sm:px-0">Scheduler</h1>}
      <div className="w-full mx-auto bg-white rounded-lg sm:rounded-xl border border-[#E1E4EA]">
        {renderCalendarHeader()}
        {currentView === "month" && renderMonthView()}
        {currentView === "week" && renderWeekView()}
        {currentView === "day" && renderDayView()}
      </div>
    </div>
  )
}
