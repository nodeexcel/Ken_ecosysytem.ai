// import React, { useEffect, useState } from "react";
// import {
//     format,
//     startOfWeek,
//     addDays,
//     startOfMonth,
//     endOfMonth,
//     endOfWeek,
//     isSameMonth,
//     isSameDay,
//     addMonths,
//     subMonths,
// } from "date-fns";

// const fetchGoogleCalendarEvents = async () => {
//     return [
//         { id: 1, title: "XYZ Campaign", date: "2025-01-03T10:00:00" },
//         { id: 2, title: "XYZ Campaign", date: "2025-01-15T10:00:00" },
//         { id: 3, title: "XYZ Campaign", date: "2025-01-20T10:00:00" },
//         { id: 4, title: "XYZ Campaign", date: "2025-01-11T06:00:00" },
//         { id: 5, title: "XYZ Campaign", date: "2025-01-13T08:30:00" },
//     ];
// };

// export default function Calendar() {
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const [events, setEvents] = useState([]);
//     const [view, setView] = useState("month");

//     useEffect(() => {
//         const loadEvents = async () => {
//             const data = await fetchGoogleCalendarEvents();
//             setEvents(data);
//         };
//         loadEvents();
//     }, []);

//     const renderHeader = () => (
//         <div className="flex justify-between items-center mb-4">
//             <div className="text-xl font-semibold">
//                 {format(currentDate, view === "month" ? "MMMM yyyy" : view === "week" ? "MMMM yyyy (EEE dd)" : "d MMMM yyyy")}
//             </div>
//             <div className="flex items-center gap-2">
//                 <button className="border px-2 py-1 rounded" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>&lt;</button>
//                 {format(currentDate, view === "month" ? "MMMM yyyy" : view === "week" ? "MMMM yyyy (EEE dd)" : "d MMMM yyyy")}
//                 <button className="border px-2 py-1 rounded" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>&gt;</button>
//                 <select
//                     className="ml-4 border rounded px-2 py-1"
//                     value={view}
//                     onChange={(e) => setView(e.target.value)}
//                 >
//                     <option value="month">Month View</option>
//                     <option value="week">Week View</option>
//                     <option value="day">Day View</option>
//                 </select>
//             </div>
//         </div>
//     );

//     const renderMonthView = () => {
//         const monthStart = startOfMonth(currentDate);
//         const monthEnd = endOfMonth(monthStart);
//         const startDate = startOfWeek(monthStart);
//         const endDate = endOfWeek(monthEnd);
//         const rows = [];
//         let days = [];
//         let day = startDate;

//         while (day <= endDate) {
//             for (let i = 0; i < 7; i++) {
//                 const cloneDay = day;
//                 const dayEvents = events.filter(event => isSameDay(new Date(event.date), cloneDay));
//                 days.push(
//                     <div className="border h-24 p-1 text-xs relative" key={day.toString()}>
//                         <div className={`absolute top-1 right-1 text-xs ${!isSameMonth(day, monthStart) ? "text-gray-400" : ""}`}>{format(day, "d")}</div>
//                         <div className="mt-5">
//                             {dayEvents.map(event => (
//                                 <div key={event.id} className="bg-purple-200 px-1 rounded text-[10px] mb-1 truncate">
//                                     {event.title} {format(new Date(event.date), "p")}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 );
//                 day = addDays(day, 1);
//             }
//             rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
//             days = [];
//         }
//         return <div>{rows}</div>;
//     };

//     const renderWeekView = () => {
//         const start = startOfWeek(currentDate, { weekStartsOn: 1 });
//         const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
//         const hours = Array.from({ length: 12 }, (_, i) => 6 + i);

//         return (
//             <div className="grid grid-cols-8 text-xs">
//                 <div className="border p-1">Time</div>
//                 {days.map(day => (
//                     <div className="border p-1 text-center" key={day.toString()}>{format(day, "EEE d")}</div>
//                 ))}
//                 {hours.map(hour => (
//                     <React.Fragment key={hour}>
//                         <div className="border p-1">{hour > 12 ? `${hour - 12} PM` : `${hour} AM`}</div>
//                         {days.map(day => {
//                             const slotEvents = events.filter(e => isSameDay(new Date(e.date), day) && new Date(e.date).getHours() === hour);
//                             return (
//                                 <div key={day.toString() + hour} className="border h-20 relative">
//                                     {slotEvents.map(ev => (
//                                         <div key={ev.id} className="absolute bg-blue-200 p-1 rounded text-[10px] w-full">
//                                             {ev.title} {format(new Date(ev.date), "p")}
//                                         </div>
//                                     ))}
//                                 </div>
//                             );
//                         })}
//                     </React.Fragment>
//                 ))}
//             </div>
//         );
//     };

//     const renderDayView = () => {
//         const hours = Array.from({ length: 18 }, (_, i) => 6 + i);
//         const dayEvents = events.filter(e => isSameDay(new Date(e.date), currentDate));

//         return (
//             <div className="border rounded p-4">
//                 <div className="text-sm font-medium mb-4">{format(currentDate, "dd MMMM yyyy")}</div>
//                 <div className="grid grid-cols-12">
//                     <div className="col-span-1 text-right pr-2">
//                         {hours.map(hour => (
//                             <div key={hour} className="h-16 text-xs leading-4">
//                                 {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
//                             </div>
//                         ))}
//                     </div>
//                     <div className="col-span-11 relative">
//                         {hours.map(hour => (
//                             <div key={hour} className="h-16 border-t border-gray-200"></div>
//                         ))}
//                         {dayEvents.map(event => {
//                             const eventDate = new Date(event.date);
//                             const top = (eventDate.getHours() - 6) * 64 + (eventDate.getMinutes() / 60) * 64;
//                             return (
//                                 <div
//                                     key={event.id}
//                                     className="absolute left-0 right-0 bg-yellow-100 border rounded px-2 py-1 text-xs shadow"
//                                     style={{ top: `${top}px` }}
//                                 >
//                                     <div className="font-semibold text-[10px]">{format(eventDate, "p")}</div>
//                                     <div className="text-[11px]">{event.title}</div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="gap-6 onest">
//             <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">
//                 Calendar
//             </h1>
//             {renderHeader()}
//             {view === "month" && renderMonthView()}
//             {view === "week" && renderWeekView()}
//             {view === "day" && renderDayView()}
//         </div>
//     );
// }


import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Calendar() {
  // Get current date information
  const today = new Date()

  // State for current view date information
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentDay, setCurrentDay] = useState(today.getDate())
  const [currentView, setCurrentView] = useState("month")

  // Week view state
  const [selectedWeekStart, setSelectedWeekStart] = useState(0)
  const [selectedWeekEnd, setSelectedWeekEnd] = useState(0)

  // Initialize week view dates if needed
  if (selectedWeekStart === 0) {
    const firstDayOfWeek = getFirstDayOfWeek(new Date(currentYear, currentMonth, currentDay))
    setSelectedWeekStart(firstDayOfWeek.getDate())

    const lastDayOfWeek = new Date(firstDayOfWeek)
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)
    setSelectedWeekEnd(lastDayOfWeek.getDate())
  }

  // Sample events data
  const events = [
    { id: "1", name: "XYZ Campaign", time: "8:00 AM", date: 11, month: 4, year: 2025, color: "purple" },
    { id: "2", name: "XYZ Campaign", time: "8:30 AM", date: 13, month: 4, year: 2025, color: "orange" },
    { id: "3", name: "XYZ Campaign", time: "10 AM", date: 3, month: 4, year: 2025 },
    { id: "4", name: "XYZ Campaign", time: "10 AM", date: 15, month: 4, year: 2025 },
    { id: "5", name: "XYZ Campaign", time: "10 AM", date: 20, month: 4, year: 2025 },
    { id: "6", name: "XYZ Campaign", time: "6:00 AM", date: 12, month: 4, year: 2025, color: "purple" },
    { id: "7", name: "XYZ Campaign", time: "8:30 AM", date: 12, month: 4, year: 2025, color: "orange" },
  ]

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

  const hours = ["6AM", "7AM", "8AM", "9AM", "10AM", "11AM"]

  // Helper functions for date manipulation
  function getFirstDayOfWeek(date){
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

  // Event handling functions
  const getEventForDay = (day, month, year) => {
    return events.filter((event) => event.date === day && event.month === month && event.year === year)
  }

  const getEventForHourDay = (hour, day, month, year) => {
    return events.filter(
      (event) =>
        event.date === day &&
        event.month === month &&
        event.year === year &&
        event.time.includes(hour.replace("AM", "")),
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

  const weekDays = getWeekDays()

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
          const dayEvents = getEventForDay(day.day, day.month, day.year)
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
                {dayEvents.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`text-xs ${
                      event.color === "purple"
                        ? "bg-purple-100"
                        : event.color === "orange"
                          ? "bg-orange-100"
                          : "bg-white"
                    } p-1 mb-1 rounded`}
                  >
                    <div className="font-medium">{event.name}</div>
                    <div className="text-gray-500">{event.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    return (
      <div className="grid grid-cols-8 border-t border-[#E1E4EA]">
        {/* Time column */}
        <div className="border-r border-[#E1E4EA]">
             <div className="h-10 border-b border-[#E1E4EA]" />
          {hours.map((hour,index) => (
            <div key={hour} className={`h-16 ${hours.length!==index+1 && 'border-b'} border-[#E1E4EA] flex items-start justify-end pr-2 pt-1`}>
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
            <div
              key={index}
              className={`${weekDays.length!==index+1 && 'border-r'} border-[#E1E4EA]`}
              onClick={() => {
                setCurrentDay(day.day)
                setCurrentMonth(day.month)
                setCurrentYear(day.year)
                setCurrentView("day")
              }}
            >
              {/* Day header */}
              <div className="h-10 border-b border-[#E1E4EA] flex flex-col items-center justify-center">
                <div className="text-sm font-medium">
                  {dayName} {day.day}
                </div>
                {isToday && (
                  <div className="w-6 h-6 rounded-full bg-[#675FFF] flex items-center justify-center absolute">
                    <span className="text-white text-xs">{day.day}</span>
                  </div>
                )}
              </div>

              {/* Hour cells */}
              {hours.map((hour,index) => {
                const hourEvents = getEventForHourDay(hour, day.day, day.month, day.year)

                return (
                  <div key={`${day.day}-${hour}`} className={`h-16 ${hours.length!==index+1 && 'border-b'} border-[#E1E4EA] relative`}>
                    {hourEvents.map((event, eventIndex) => {
                      const bgColor =
                        event.color === "purple"
                          ? "bg-purple-100"
                          : event.color === "orange"
                            ? "bg-orange-100"
                            : "bg-gray-100"

                      return (
                        <div key={eventIndex} className={`absolute top-0 left-0 right-0 h-full ${bgColor} p-1`}>
                          <div className="text-xs font-medium">{event.time}</div>
                          <div className="text-xs">{event.name}</div>
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
        {hours.map((hour,index) => {
          const hourEvents = getEventForHourDay(hour, currentDay, currentMonth, currentYear)

          return (
            <div key={hour} className="flex border-[#E1E4EA]">
              {/* Time column */}
              <div className={`w-16 py-2 border-r border-[#E1E4EA] ${hours.length!==index+1 && 'border-b'} flex items-start justify-end pr-2`}>
                <span className="text-xs text-gray-500">{hour}</span>
              </div>

              {/* Events column */}
              <div className={`flex-1 border-[#E1E4EA] ${hours.length!==index+1 && 'border-b'}  min-h-16 relative`}>
                {hourEvents.map((event, eventIndex) => {
                  const bgColor =
                    event.color === "purple"
                      ? "bg-purple-100"
                      : event.color === "orange"
                        ? "bg-orange-100"
                        : "bg-gray-100"

                  return (
                    <div key={eventIndex} className={`absolute top-0 left-0 right-0 h-full ${bgColor} p-2`}>
                      <div className="text-xs font-medium">{event.time}</div>
                      <div className="text-xs">{event.name}</div>
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
            <div className="flex items-center border border-[#E1E4EA] py-1 rounded-lg">
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

            <div>
              <select
                onChange={(e) => setCurrentView(e.target.value)}
                value={currentView}
                className="flex text-[#5A687C] border-[#E1E4EA] items-center gap-1 px-3 py-1.5 border rounded-md"
              >
                <option value="month">Month View</option>
                <option value="week">Week View</option>
                <option value="day">Day View</option>
              </select>
            </div>
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
            <div className="flex items-center border border-[#E1E4EA] py-1 rounded-lg">
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

            <div>
              <select
                onChange={(e) => setCurrentView(e.target.value)}
                value={currentView}
                className="flex text-[#5A687C] border-[#E1E4EA] items-center gap-1 px-3 py-1.5 border rounded-md"
              >
                <option value="month">Month View</option>
                <option value="week">Week View</option>
                <option value="day">Day View</option>
              </select>
            </div>
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
            <div className="flex items-center border border-[#E1E4EA] py-1 rounded-lg">
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

            <div>
              <select
                onChange={(e) => setCurrentView(e.target.value)}
                value={currentView}
                className="flex text-[#5A687C] border-[#E1E4EA] items-center gap-1 px-3 py-1.5 border rounded-md"
              >
                <option value="month">Month View</option>
                <option value="week">Week View</option>
                <option value="day">Day View</option>
              </select>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="gap-6 onest">
      <h1 className="font-semibold text-[#1e1e1e] mb-5 text-2xl leading-8">Calendar</h1>
      <div className="w-full max-w-5xl mx-auto bg-white rounded-xl border border-[#E1E4EA]">
        {renderCalendarHeader()}
        {currentView === "month" && renderMonthView()}
        {currentView === "week" && renderWeekView()}
        {currentView === "day" && renderDayView()}
      </div>
    </div>
  )
}

