import { useState, useEffect, useRef } from "react"
import { Search, ChevronDown, Calendar, MoreHorizontal, Mail, Phone, Download, Trash2 } from "lucide-react"
import { SelectDropdown } from "../../components/Dropdown"

// Mock data for Logs & Troubleshooting
const logsData = [
  {
    id: 1,
    userName: "Jerry Heffer",
    userInitials: "JH",
    agentName: "Stephanie Sharkey",
    agentAvatar: "/stephanie.png",
    date: "20/05/2026, 05:12 PM",
    type: "Email",
    typeColor: "orange",
    description: "Sent to recipient",
  },
  {
    id: 2,
    userName: "Eddie Lake",
    userInitials: "EL",
    agentName: "Kathy Pacheco",
    agentAvatar: "/kathy.png",
    date: "20/05/2026, 05:12 PM",
    type: "Email",
    typeColor: "orange",
    description: "Opened by recipient",
  },
  {
    id: 3,
    userName: "Joshua Jones",
    userInitials: "JJ",
    agentName: "Katie Sims",
    agentAvatar: "/katie.png",
    date: "20/05/2026, 05:12 PM",
    type: "Call",
    typeColor: "blue",
    description: "Duration: 5:12",
  },
  {
    id: 4,
    userName: "Alex Buckmaster",
    userInitials: "AB",
    agentName: "Kurt Bates",
    agentAvatar: "/kurt.png",
    date: "20/05/2026, 05:12 PM",
    type: "Call",
    typeColor: "blue",
    description: "Call failed: no answer",
  },
  {
    id: 5,
    userName: "James Hall",
    userInitials: "JH",
    agentName: "John Dukes",
    agentAvatar: "/john.png",
    date: "20/05/2026, 05:12 PM",
    type: "Conversations",
    typeColor: "blue",
    description: "Start Conversations",
  },
]

const LogsTroubleshooting = () => {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("All")
  const [selectedUser] = useState("All")
  const [dateRange, setDateRange] = useState("")
  const [logs, setLogs] = useState(logsData)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const dropdownRef = useRef(null)

  const handleSearch = () => {
    console.log("Search clicked")
    // Add search functionality here
  }

  const handleDownload = () => {
    console.log("Download clicked")
    // Add download functionality here
  }

  const handleActionClick = (logId, event) => {
    if (openDropdown === logId) {
      setOpenDropdown(null)
    } else {
      // Calculate position for the dropdown
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      
      // Calculate left position to ensure dropdown doesn't go off-screen
      let left = rect.right - 192 // 192px is the width of dropdown (w-48 = 12rem = 192px)
      if (left < 0) {
        left = rect.left // Align to left edge of button if dropdown would go off-screen
      }
      
      setDropdownPosition({
        top: rect.bottom + 8, // 8px margin, no need to add scrollY with fixed positioning
        left: left
      })
      setOpenDropdown(logId)
    }
  }

  const handleDownloadLog = (logId) => {
    console.log("Download log for:", logId)
    setOpenDropdown(null)
    // Add download log functionality here
  }

  const handleDeleteLog = (logId) => {
    console.log("Delete log for:", logId)
    setOpenDropdown(null)
    // Add delete log functionality here
  }

  const closeDropdown = () => {
    setOpenDropdown(null)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null)
      }
    }

    const handleScroll = () => {
      if (openDropdown) {
        setOpenDropdown(null)
      }
    }

    const handleResize = () => {
      if (openDropdown) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [openDropdown])

  const filteredLogs = logs.filter(
    (log) =>
      (log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedAgent === "All" || log.agentName === selectedAgent) &&
      (selectedUser === "All" || log.userName === selectedUser),
  )

  const getTypeIcon = (type) => {
    switch (type) {
      case "Email":
        return <Mail className="w-4 h-4" />
      case "Call":
        return <Phone className="w-4 h-4" />
      case "Conversations":
        return <Phone className="w-4 h-4" />
      default:
        return ""
    }
  }

  const getTypeColorClasses = (typeColor) => {
    switch (typeColor) {
      case "orange":
        return "bg-orange-100 text-orange-600 border-orange-200"
      case "blue":
        return "bg-blue-100 text-blue-600 border-blue-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  return (
    <div>
      <div className="m-0">
        <h1 className="w-full mt-0.5 border-b border-[#E1E4EA] font-medium p-2 ml-0 m-0 font-Semibold text-[#1E1E1E] text-[26px]">
          Logs & Troubleshooting
        </h1>
      </div>

      <div className="w-full p-4 flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <span className="loader" />
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6 w-full items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Agent Dropdown */}
                <div className="relative">
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="appearance-none bg-white border border-[#e1e4ea] rounded-lg px-4 py-2 pr-10 text-[#5A687C] focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                  >
                    <option value="All">Agent: All</option>
                    <option value="Stephanie Sharkey">Stephanie Sharkey</option>
                    <option value="Kathy Pacheco">Kathy Pacheco</option>
                    <option value="Katie Sims">Katie Sims</option>
                    <option value="Kurt Bates">Kurt Bates</option>
                    <option value="John Dukes">John Dukes</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="appearance-none bg-white border border-[#e1e4ea] rounded-lg px-4 py-2 pr-10 text-[#5A687C] focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                  >
                    <option value="All">User: All</option>
                    <option value="Jerry Heffer">Jerry Heffer</option>
                    <option value="Eddie Lake">Eddie Lake</option>
                    <option value="Joshua Jones">Joshua Jones</option>
                    <option value="Alex Buckmaster">Alex Buckmaster</option>
                    <option value="James Hall">James Hall</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Date Range */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Date Range"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="bg-white border border-[#e1e4ea] rounded-lg px-4 py-2 pr-10 text-[#5A687C] focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] placeholder-[#5A687C]"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Search Input */}
                <div className="relative flex-1 max-w-md bg-[#FFFFFF] rounded-lg">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Keyword"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#5A687C] placeholder-[#5A687C]"
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="bg-[#675FFF] hover:bg-[#5A4FE5] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Search
                </button>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="border border-[#675FFF] text-[#675FFF] hover:bg-[#675FFF] hover:text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Download
              </button>
            </div>

            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="flex justify-between items-center w-full p-2">
                    <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium">User Name</th>
                    <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium">Agent Name</th>
                    <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium">Description</th>
                    <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium">Actions</th>
                  </tr>
                </thead>
              </table>
            </div>

            {/* Table Body */}
            <div className="border border-[#e1e4ea] bg-[#FFFFFF] rounded-lg p-6 -mt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {filteredLogs.map((log, index) => (
                      <tr key={log.id} className={index > 0 ? "border-t border-[#e1e4ea]" : ""}>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[#675FFF] text-sm font-semibold bg-[#335BFB1A]">
                              {log.userInitials}
                            </div>
                            <span className="text-[#1E1E1E] font-medium">{log.userName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={log.agentAvatar || "/placeholder.svg"}
                              alt={log.agentName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-[#5A687C] font-medium">{log.agentName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-[#5A687C]">{log.date}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getTypeColorClasses(log.typeColor)}`}
                          >
                            <span>{getTypeIcon(log.type)}</span>
                            {log.type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-[#5A687C]">{log.description}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center relative" ref={dropdownRef}>
                            <button
                              onClick={(event) => handleActionClick(log.id, event)}
                              className="p-2 text-[#5A687C] hover:text-[#675FFF] hover:bg-[#335BFB1A] rounded-lg transition-colors"
                              title="More actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {openDropdown === log.id && (
                              <div 
                                className="fixed w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                                style={{ 
                                  top: dropdownPosition.top, 
                                  left: dropdownPosition.left 
                                }}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => handleDownloadLog(log.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <Download className="w-4 h-4 text-gray-600" />
                                    <span>Download Log</span>
                                  </button>
                                  <div className="border-t border-gray-200"></div>
                                  <button
                                    onClick={() => handleDeleteLog(log.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                    <span>Delete Log</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLogs.length === 0 && (
                  <div className="text-center py-8 text-[#5A687C]">No logs found matching your search criteria.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LogsTroubleshooting
