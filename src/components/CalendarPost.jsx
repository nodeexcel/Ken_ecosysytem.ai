import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import successImg from "../assets/svg/success.svg"
import { getContentCreationCalender } from "../api/contentCreationAgent"
import { SelectDropdown } from "./Dropdown"
import { useTranslation } from "react-i18next";

export default function CalendarPost({status=true}) {
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


  // Week view state
  const [selectedWeekStart, setSelectedWeekStart] = useState(0)
  const [selectedWeekEnd, setSelectedWeekEnd] = useState(0);

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
        event.scheduled_type === "schedule" &&
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

  const calendarOptions = [{ label: `${t("emailings.month_view")}`, key: "month" }, { label: `${t("emailings.week_view")}`, key: "week" }, { label: `${t("emailings.day_view")}`, key: "day" }]

  // Fetch content creation calendar data
  const getScheduleDate = async () => {
    try {
      const response = await getContentCreationCalender()
      if (response?.status === 200 && response?.data?.content_details?.length > 0) {
        setNewEvents(response.data.content_details)
      } else {
        setLoading(false)
        setNewEvents([])
      }
    } catch (error) {
      setLoading(false)
      setNewEvents([])
    }
  }

  useEffect(() => {
    getScheduleDate()
  }, [])

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
          bg: "bg-[#E1F7E3]",
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
        return "Scheduled"
      case "draft":
        return "Draft"
      case "publish":
        return "Published"
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
          <div key={day} className="py-2 text-center border-r border-b border-[#E1E4EA] font-medium text-sm">
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
                    <div key={eventIndex} className={`text-xs ${statusStyles.bg} flex items-center gap-1 p-1 mb-1 rounded`}>
                      <div className="text-[12px] font-[600] text-[#000]">{event.platform}</div>
                      <div className="text-[#5A687C] text-[12px] font-[600]">{formatTimeHHMM(event.scheduled_time)}</div>
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
                  {!isToday?<span className={`${isToday ? "w-6 h-6 rounded-full bg-[#675FFF] p-1 text-white" : ""}`}>
                    {day.day}
                  </span>:
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
                          <div className="text-[12px] font-[400] text-[#5A687C]">{formatTimeHHMM(event.scheduled_time)}</div>
                          <div className="text-[14px] font-[600] text-[#1E1E1E]">{event.platform}</div>
                          <div
                            className={`text-[12px] font-[500] ${statusStyles.text} rounded-full border ${statusStyles.border} w-fit px-1.5 py-0.5 bg-white`}
                          >
                            {renderStatusLabel(event.scheduled_type)}
                          </div>
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
                      <div className="text-[12px] font-[400] text-[#5A687C]">{formatTimeHHMM(event.scheduled_time)}</div>
                      <div className="text-[14px] font-[600] text-[#1E1E1E]">{event.platform}</div>
                      <div
                        className={`text-[12px] font-[500] ${statusStyles.text} rounded-full border ${statusStyles.border} w-fit px-1.5 py-0.5 bg-white`}
                      >
                        {renderStatusLabel(event.scheduled_type)}
                      </div>
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
    if (currentView === "month") {
      return (
        <div className="flex justify-between bg-[#F9FAFB] rounded-t-2xl items-center p-4">
          <h2 className="text-lg font-medium">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-[#E1E4EA] focus-within:border-[#675FFF] py-[6px] bg-white rounded-lg">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-md cursor-pointer hover:bg-gray-100"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5 text-[#5A687C]" />
              </button>
              <span className="mx-2 text-[#5A687C]">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button onClick={handleNextMonth} className="p-1 rounded-md cursor-pointer hover:bg-gray-100" aria-label="Next month">
                <ChevronRight className="h-5 w-5 text-[#5A687C]" />
              </button>
            </div>
            <SelectDropdown
              name="calendar"
              options={calendarOptions}
              value={currentView}
              onChange={(updated) => {
                setCurrentView(updated)
              }}
              placeholder={t("emailings.select")}
              className="w-[147px]"
            />
          </div>
        </div>
      )
    } else if (currentView === "week") {
      return (
        <div className="flex justify-between bg-[#F9FAFB] rounded-t-2xl items-center p-4">
          <h2 className="text-lg font-medium">
            {monthNames[currentMonth]} {currentYear} ({t("emailings.mon")} {selectedWeekStart} - {t("emailings.sun")} {selectedWeekEnd})
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-[#E1E4EA] focus-within:border-[#675FFF] py-[6px] bg-white rounded-lg">
              <button onClick={handlePrevWeek} className="p-1 cursor-pointer rounded-md hover:bg-gray-100" aria-label="Previous week">
                <ChevronLeft className="h-5 w-5 text-[#5A687C]" />
              </button>
              <span className="mx-2 text-[#5A687C]">
                {t("emailings.mon")} {selectedWeekStart} - {t("emailings.sun")} {selectedWeekEnd}
              </span>
              <button onClick={handleNextWeek} className="p-1 cursor-pointer rounded-md hover:bg-gray-100" aria-label="Next week">
                <ChevronRight className="h-5 w-5 text-[#5A687C]" />
              </button>
            </div>

            <SelectDropdown
              name="calendar"
              options={calendarOptions}
              value={currentView}
              onChange={(updated) => {
                setCurrentView(updated)
              }}
              placeholder={t("emailings.select")}
              className="w-[147px]"
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="flex justify-between bg-[#F9FAFB] rounded-t-2xl items-center p-4">
          <h2 className="text-lg font-medium">
            {currentDay} {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-[#E1E4EA] focus-within:border-[#675FFF] py-[6px] bg-white rounded-lg">
              <button onClick={handlePrevDay} className="p-1 cursor-pointer rounded-md hover:bg-gray-100" aria-label="Previous day">
                <ChevronLeft className="h-5 w-5 text-[#5A687C]" />
              </button>
              <span className="mx-2 text-[#5A687C]">
                {currentDay} {monthNames[currentMonth]} {currentYear}
              </span>
              <button onClick={handleNextDay} className="p-1 cursor-pointer rounded-md hover:bg-gray-100" aria-label="Next day">
                <ChevronRight className="h-5 w-5 text-[#5A687C]" />
              </button>
            </div>

            <SelectDropdown
              name="calendar"
              options={calendarOptions}
              value={currentView}
              onChange={(updated) => {
                setCurrentView(updated)
              }}
              placeholder={t("emailings.select")}
              className="w-[147px]"
            />
          </div>
        </div>
      )
    }
  }

  if (loading) return <p className="h-screen flex justify-center items-center"><span className="loader" /></p>

  return (
    <div className="gap-6 h-screen overflow-auto py-4 pr-2">
      {status && <h1 className="font-semibold text-[#1e1e1e] mb-5 text-2xl leading-8">Scheduler</h1>}
      <div className="w-full  mx-auto bg-white rounded-xl border border-[#E1E4EA]">
        {renderCalendarHeader()}
        {currentView === "month" && renderMonthView()}
        {currentView === "week" && renderWeekView()}
        {currentView === "day" && renderDayView()}
      </div>
    </div>
  )
}
