import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import successImg from "../assets/svg/success.svg"
import { getCampaignSchedule, getScheduledContent, updateContentStatus } from "../api/emailCampaign"
import { SelectDropdown } from "./Dropdown"

export default function Calendar() {
  // Get current date information
  const today = new Date()

  // State for current view date information
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentDay, setCurrentDay] = useState(today.getDate())
  const [currentView, setCurrentView] = useState("month");
  const [newEvents, setNewEvents] = useState();
  const [popUpData, setPopUpData] = useState({})

  const [loading, setLoading] = useState(true)
  const [submitStatus, setSubmitStatus] = useState(false)

  const [modalStatus, setModalStatus] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [isDisapprove, setIsDisapprove] = useState(false)

  const [emailContent, setEmailContent] = useState("")

  const handleSubmit = async () => {
    setSubmitStatus(true);
    try {
      const payload = {
        status: isDisapprove ? 'pending_approval' : 'approved',
        email_content: emailContent
      }
      const response = await updateContentStatus(popUpData?.content_id, payload)
      if (response?.status === 200) {
        if (isDisapprove) {
          setModalStatus(false)
          setIsDisapprove(false)
        } else {
          setModalStatus(false)
          setSuccessModal(true)
        }
        setPopUpData({})
        setEmailContent("")
        getScheduleDate()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitStatus(false);
    }
  }

  // Week view state
  const [selectedWeekStart, setSelectedWeekStart] = useState(0)
  const [selectedWeekEnd, setSelectedWeekEnd] = useState(0);

  useEffect(() => {
    if (newEvents?.length > 0) {
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

  // Helper function to parse date string (DD-MM-YYYY) to Date object
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day) // month is 0-indexed in Date constructor
  }

  // Helper function to get day name from date
  const getDayName = (date) => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    return days[date.getDay()]
  }

  // Helper function to check if a date matches event frequency
  const isEventDay = (event, checkDate) => {
    const startDate = parseDate(event.start_date)

    // If the check date is before start date, no event
    if (checkDate < startDate) return false

    // If it's the start date, always show event
    if (checkDate.getTime() === startDate.getTime()) return true

    // Check if the day matches the frequency
    const dayName = getDayName(checkDate)
    return event.frequency.includes(dayName)
  }

  // Helper function to get events for a specific day
  const getNewEventForDay = (day, month, year) => {
    const checkDate = new Date(year, month, day)
    return newEvents.filter((event) => isEventDay(event, checkDate))
  }

  // Parse time string to get hour and minutes
  const parseTime = (timeStr) => {
    // Handle formats like "8:30 AM", "10AM", "6:00 AM", "10:32 PM"
    const cleaned = timeStr.replace(/\s+/g, "").toLowerCase()

    // Match patterns like "8:30am", "10am", "6:00am"
    const match = cleaned.match(/^(\d{1,2})(?::(\d{1,2}))?([ap]m)$/)

    if (match) {
      let hour = Number.parseInt(match[1])
      const minutes = match[2] ? Number.parseInt(match[2]) : 0
      const isPM = match[3] === "pm"

      // Convert to 24-hour format for easier comparison
      if (isPM && hour < 12) hour += 12
      if (!isPM && hour === 12) hour = 0

      return { hour, minutes }
    }

    return { hour: 0, minutes: 0 } // Default fallback
  }

  // Helper function to get events for a specific hour and day
  const getNewEventForHourDay = (hourStr, day, month, year) => {
    const checkDate = new Date(year, month, day)
    const eventsForDay = newEvents.filter((event) => isEventDay(event, checkDate))

    // Parse the hour slot
    const { hour: slotHour } = parseTime(hourStr)

    // Filter events that belong to this hour slot
    return eventsForDay.filter((event) => {
      const { hour: eventHour } = parseTime(event.time)
      return eventHour === slotHour
    })
  }

  // Calculate position within hour slot based on minutes
  const calculateEventPosition = (timeStr) => {
    const { minutes } = parseTime(timeStr)
    // Calculate percentage position within the hour (0-60 minutes)
    return (minutes / 60) * 100
  }

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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

  const calendarOptions = [{ label: "Month View", key: "month" }, { label: "Week View", key: "week" }, { label: "Day View", key: "day" }]

  const getScheduleDate = async () => {
    try {
      const response = await getCampaignSchedule()
      console.log(response)
      if (response?.status === 200) {
        if (response?.data?.schedule_info?.length > 0) {
          const transformedData = response?.data?.schedule_info.map((item, index) => ({
            ...item,
            id: item.campaign_id,
            name: item.name,
            frequency: item.scheduled_days,
            start_date: item.date.split("-").reverse().join("-"), // Convert YYYY-MM-DD → DD-MM-YYYY
            time: item.time
          }))
          setNewEvents(transformedData)
        } else {
          setLoading(false)
          setNewEvents([])
        }
      }

    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getScheduleDate()
  }, [])


  const handleScheduleContent = async (id) => {
    try {
      const response = await getScheduledContent(id)
      if (response?.status === 200) {
        console.log(response?.data)
        setModalStatus(true)
        let cleaned = response?.data?.email;

        // STEP 1: Remove wrapping parentheses or extra quotes
        cleaned = cleaned.trim();

        // Remove leading and trailing parentheses or quotes (if present)
        if (
          (cleaned.startsWith('("') && cleaned.endsWith('")')) ||
          (cleaned.startsWith('"') && cleaned.endsWith('"'))
        ) {
          cleaned = cleaned.slice(1, -1);
        }

        // STEP 2: Unescape characters
        cleaned = cleaned
          .replace(/\\"/g, '"')      // Escaped double quotes → "
          .replace(/\\n/g, '\n')     // Escaped newlines → real line breaks
          .replace(/\\'/g, "'")      // Escaped single quotes → '
          .replace(/^\"|\"$/g, '')   // Remove any remaining surrounding quotes

        setEmailContent(cleaned.trim());
      }

    } catch (error) {
      console.log(error)
    }
  }

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
  const getStatusStyles = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-[#EEEDFF]",
          border: "border-[#34C759]",
          text: "text-[#34C759]",
        }
      case "planned":
        return {
          bg: "bg-[#EEEDFF]",
          border: "border-[#007AFF]",
          text: "text-[#007AFF]",
        }
      case "pending_approval":
        return {
          bg: "bg-[#FFEFD9]",
          border: "border-[#FF9500]",
          text: "text-[#FF9500]",
        }
      default:
        return {
          bg: "bg-[#EEEDFF]",
          border: "border-gray-400",
          text: "text-gray-600",
        }
    }
  }

  const renderStatusLabel = (status) => {
    switch (status) {
      case "approved":
        return "Approved"
      case "planned":
        return "Planned"
      default:
        return "Pending Approval"
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
              className={`min-h-[100px] p-2 border-r border-b border-[#E1E4EA] relative ${!day.isCurrentMonth ? "bg-gray-50" : ""}`}
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
                    <span className={`text-sm ${!day.isCurrentMonth ? "text-gray-400" : ""}`}>{day.day}</span>
                  )}
                </div>
              </div>

              {/* Events */}
              <div className="mt-1">
                {dayEvents.map((event, eventIndex) => {
                  const statusStyles = getStatusStyles(event.status)
                  return (
                    <div key={eventIndex} className={`text-xs ${statusStyles.bg} p-1 mb-1 rounded`}>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-gray-500">{event.time}</div>
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
              <span className="text-xs text-gray-500">{hour}</span>
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
                <div className="text-sm font-medium">
                  {dayName}{" "}
                  <span className={`${isToday ? "w-6 h-6 rounded-full bg-[#675FFF] p-1 text-white" : ""}`}>
                    {day.day}
                  </span>
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
                      const statusStyles = getStatusStyles(event.status)
                      const topPosition = calculateEventPosition(event.time)

                      return (
                        <div
                          key={eventIndex}
                          onClick={() => {
                            setCurrentDay(day.day)
                            setCurrentMonth(day.month)
                            setCurrentYear(day.year)
                            if (event.status !== "planned") {
                              handleScheduleContent(event.content_id)
                              setPopUpData(event)
                              // setModalStatus(true)
                            }
                          }}
                          className={`${statusStyles.bg} p-2 rounded cursor-pointer absolute left-1 right-1 z-10`}
                          style={{ top: `${topPosition}%` }}
                        >
                          <div className="text-[12px] font-[400] text-[#5A687C]">{event.time}</div>
                          <div className="text-[14px] font-[600] text-[#1E1E1E]">{event.name}</div>
                          <div
                            className={`text-[12px] font-[500] ${statusStyles.text} rounded-full border ${statusStyles.border} w-fit px-1.5 py-0.5 bg-white`}
                          >
                            {renderStatusLabel(event.status)}
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
                <span className="text-xs text-gray-500">{hour}</span>
              </div>

              {/* Events column */}
              <div className={`flex-1 border-[#E1E4EA] ${hours.length !== index + 1 && "border-b"} h-34 relative`}>
                {/* 30-minute line */}
                <div className="absolute left-0 right-0 top-1/2 border-t border-gray-200 border-dashed"></div>

                {hourEvents.map((event, eventIndex) => {
                  const statusStyles = getStatusStyles(event.status)
                  const topPosition = calculateEventPosition(event.time)

                  return (
                    <div
                      key={eventIndex}
                      className={`${statusStyles.bg} p-2 rounded-l cursor-pointer w-full absolute z-10`}
                      style={{ top: `${topPosition}%` }}
                      onClick={() => {
                        if (event.status !== "planned") {
                          handleScheduleContent(event.content_id)
                          setPopUpData(event)
                        }
                      }}
                    >
                      <div className="text-[12px] font-[400] text-[#5A687C]">{event.time}</div>
                      <div className="text-[14px] font-[600] text-[#1E1E1E]">{event.name}</div>
                      <div
                        className={`text-[12px] font-[500] ${statusStyles.text} rounded-full border ${statusStyles.border} w-fit px-1.5 py-0.5 bg-white`}
                      >
                        {renderStatusLabel(event.status)}
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
                className="p-1 rounded-md hover:bg-gray-100"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5 text-[#5A687C]" />
              </button>
              <span className="mx-2 text-[#5A687C]">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button onClick={handleNextMonth} className="p-1 rounded-md hover:bg-gray-100" aria-label="Next month">
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
              placeholder="Select"
              className="w-[147px]"
            />
          </div>
        </div>
      )
    } else if (currentView === "week") {
      return (
        <div className="flex justify-between bg-[#F9FAFB] rounded-t-2xl items-center p-4">
          <h2 className="text-lg font-medium">
            {monthNames[currentMonth]} {currentYear} (Mon {selectedWeekStart} - Sun {selectedWeekEnd})
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-[#E1E4EA] focus-within:border-[#675FFF] py-[6px] bg-white rounded-lg">
              <button onClick={handlePrevWeek} className="p-1 rounded-md hover:bg-gray-100" aria-label="Previous week">
                <ChevronLeft className="h-5 w-5 text-[#5A687C]" />
              </button>
              <span className="mx-2 text-[#5A687C]">
                Mon {selectedWeekStart} - Sun {selectedWeekEnd}
              </span>
              <button onClick={handleNextWeek} className="p-1 rounded-md hover:bg-gray-100" aria-label="Next week">
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
              placeholder="Select"
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
              <button onClick={handlePrevDay} className="p-1 rounded-md hover:bg-gray-100" aria-label="Previous day">
                <ChevronLeft className="h-5 w-5 text-[#5A687C]" />
              </button>
              <span className="mx-2 text-[#5A687C]">
                {currentDay} {monthNames[currentMonth]} {currentYear}
              </span>
              <button onClick={handleNextDay} className="p-1 rounded-md hover:bg-gray-100" aria-label="Next day">
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
              placeholder="Select"
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
      <h1 className="font-semibold text-[#1e1e1e] mb-5 text-2xl leading-8">Calendar</h1>
      <div className="w-full max-w-5xl mx-auto bg-white rounded-xl border border-[#E1E4EA]">
        {renderCalendarHeader()}
        {currentView === "month" && renderMonthView()}
        {currentView === "week" && renderWeekView()}
        {currentView === "day" && renderDayView()}
      </div>
      {modalStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-[718px] p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setModalStatus(false)
                setIsDisapprove(false)
              }}
            >
              <X size={20} />
            </button>

            <div className="flex flex-col gap-2 mt-3">
              <div className="flex justify-between items-center my-1">
                <h2 className="text-[20px] font-[600] text-[#1E1E1E]">{popUpData?.name}</h2>
                {isDisapprove && (
                  <button
                    // onClick={handleSubmit}
                    className="border-[1.5px] p-1.5 rounded-lg border-[#5F58E8] text-[#675FFF] text-[16px] font-[500]"
                  >
                    Generate New Email
                  </button>
                )}
              </div>
              <div>
                <div className="space-y-4">
                  {/* Editable Textarea */}
                  <textarea
                    rows={12}
                    disabled={!isDisapprove}
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm text-gray-800 bg-white resize-none"
                  />

                  {/* HTML Preview */}
                  {/* <div
                  className="p-4 border bg-gray-50 rounded text-sm text-gray-800"
                  dangerouslySetInnerHTML={{ __html: convertToHtml(rawText) }}
                /> */}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-white w-full border-[1.5px] border-[#E1E4EA] text-[#5A687C] px-5 py-2 font-[500] text-[16px] rounded-lg"
                  onClick={
                    isDisapprove
                      ? () => {
                        setModalStatus(false)
                        setIsDisapprove(false)
                      }
                      : () => setIsDisapprove(true)
                  }
                >
                  {isDisapprove ? "Cancel" : "Disapprove"}
                </button>
                <button
                  className="bg-[#675FFF] w-full border border-[#5F58E8] text-white px-5 py-2 font-[500] text-[16px] rounded-lg"
                  onClick={
                    handleSubmit
                  }
                >
                  {submitStatus ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : isDisapprove ? "Save" : "Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {successModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-[442px] p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setSuccessModal(false)
              }}
            >
              <X size={20} />
            </button>

            <div className="flex h-[270px] flex-col justify-end items-center gap-3">
              <div>
                <img src={successImg || "/placeholder.svg"} alt="success" />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <h2 className="text-[28px] font-[700] text-[#292D32]">Congratulations!</h2>
                <p className="text-[#5A687C] text-[16px] font-[400]">You have successfully approved the campaign.</p>
              </div>
              {/* <div className="flex gap-2"> */}
              <button
                className="bg-[#675FFF] w-full border border-[#5F58E8] text-white px-5 py-2 font-[500] text-[16px] rounded-lg"
                onClick={() => setSuccessModal(false)}
              >
                Ok
              </button>
              {/* </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
