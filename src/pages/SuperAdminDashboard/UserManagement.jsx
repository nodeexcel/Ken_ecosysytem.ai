import { useState, useEffect, useRef } from "react"

// Sample user data - exact match to image
const users = [
  {
    id: 1,
    initials: "SN",
    name: "Stephanie Nicol",
    email: "eddie_lake@gmail.com",
    businessName: "Nexora",
    location: "199 Oakway Lane",
    status: "Active",
    isActive: true,
  },
  {
    id: 2,
    initials: "DC",
    name: "Dennis Callis",
    email: "paula611@gmail.com",
    businessName: "BrightNest",
    location: "2323 Dancing Dove Lane",
    status: "Inactive",
    isActive: false,
  },
  {
    id: 3,
    initials: "JR",
    name: "Judith Rodriguez",
    email: "k.r.mastrangelo@outlook.com",
    businessName: "Skybridge Collective",
    location: "4267 Cherry Tree Drive",
    status: "Active",
    isActive: true,
  },
  {
    id: 4,
    initials: "KS",
    name: "Katie Sims",
    email: "dennis416@gmail.com",
    businessName: "Momentum Lane",
    location: "1341 Poplar Street",
    status: "Inactive",
    isActive: false,
  },
  {
    id: 5,
    initials: "RR",
    name: "Rhonda Rhodes",
    email: "k.p.allen@aol.com",
    businessName: "Loop & Line",
    location: "184 Griffin Street",
    status: "Active",
    isActive: true,
  },
  {
    id: 6,
    initials: "EL",
    name: "Eddie Lake",
    email: "james_hall@gmail.com",
    businessName: "Zenith Works",
    location: "4387 Farland Avenue",
    status: "Active",
    isActive: true,
  },
]

// Chevron Down Icon Component
const ChevronDownIcon = () => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

// Search Icon Component
const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

// Edit Icon Component
const EditIcon = () => (
  <svg
    className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

// Delete Icon Component
const DeleteIcon = () => (
  <svg
    className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const statusDropdownRef = useRef(null)
  const [userStates, setUserStates] = useState(
    users.reduce(
      (acc, user) => {
        acc[user.id] = user.isActive
        return acc
      },
    ),
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleUserStatus = (userId) => {
    setUserStates((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
    setIsStatusDropdownOpen(false)
  }

  const filteredUsers = users.filter(
    (user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.businessName.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filter by status
      if (statusFilter === "Active") {
        return matchesSearch && user.isActive
      } else if (statusFilter === "Inactive") {
        return matchesSearch && !user.isActive
      } else if (statusFilter === "Deleted") {
        // For demo purposes, we'll show users with specific names as "deleted"
        return matchesSearch && (user.name === "Deleted User" || user.status === "Deleted")
      } else if (statusFilter === "All") {
        // Show all users when "All" is selected
        return matchesSearch
      }
      
      return matchesSearch
    }
  )

  return (
    <div>
      <div className="m-0">
        <h1 className="w-full mt-0.5 border-b border-[#E1E4EA] font-medium p-2 ml-0 m-0 font-Semibold text-[#1E1E1E] text-[26px]">User Management</h1>
      </div>
      <div className="w-full p-4 flex flex-col gap-4 overflow-visible">
        {/* Filters and Search */}
        <div className="flex items-center justify-between mb-6 relative overflow-visible">
          <div className="flex items-center space-x-4">
            {/* Plan Filter */}
            <div className="flex items-center border border-[#e1e4ea] rounded-md px-4 py-2 text-[#1E1E1E] cursor-pointer bg-white">
              <span className="text-sm">Plan</span>
              <ChevronDownIcon />
            </div>

            {/* Agent Usage Filter */}
            <div className="flex items-center border border-[#e1e4ea] rounded-md px-4 py-2 text-[#1E1E1E] cursor-pointer bg-white">
              <span className="text-sm">Agent Usage</span>
              <ChevronDownIcon />
            </div>

            {/* Onboarding Stage Filter */}
            <div className="flex items-center border border-[#e1e4ea] rounded-md px-4 py-2 text-[#1E1E1E] cursor-pointer bg-white">
              <span className="text-sm">Onboarding Stage</span>
              <ChevronDownIcon />
            </div>
            <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#e1e4ea] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white"
              />
            </div>

            
          </div>
          </div>

          {/* User Avatar and Status */}
          <div className="flex items-center space-x-2">
              
              {/* Status Filter Dropdown */}
              <div className="relative" ref={statusDropdownRef}>
                <div 
                  className="flex items-center text-[#1E1E1E] cursor-pointer border border-[#e1e4ea] rounded-md px-4 py-2 bg-white"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                >
                  <span className="text-sm">{statusFilter}</span>
                  <ChevronDownIcon />
                </div>
                
                {/* Dropdown Menu */}
                {isStatusDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-[#e1e4ea] rounded-md shadow-lg z-50 min-w-max">
                    <div 
                      className={`px-4 py-2 text-sm cursor-pointer rounded-md mx-2 my-1 ${
                        statusFilter === "All" 
                          ? "bg-[#F3F4F6] text-[#8B5CF6]" 
                          : "text-[#6B7280]"
                      }`}
                      onClick={() => handleStatusFilterChange("All")}
                    >
                      All
                    </div>
                    <div 
                      className={`px-4 py-2 text-sm cursor-pointer rounded-md mx-2 my-1 ${
                        statusFilter === "Active" 
                          ? "bg-[#F3F4F6] text-[#8B5CF6]" 
                          : "text-[#6B7280]"
                      }`}
                      onClick={() => handleStatusFilterChange("Active")}
                    >
                      Active
                    </div>
                    <div 
                                              className={`px-4 py-2 text-sm cursor-pointer rounded-md mx-2 my-1 ${
                          statusFilter === "Inactive" 
                            ? "bg-[#F3F4F6] text-[#8B5CF6]" 
                            : "text-[#6B7280]"
                        }`}
                      onClick={() => handleStatusFilterChange("Inactive")}
                    >
                      Inactive
                    </div>
                    <div 
                      className={`px-4 py-2 text-sm cursor-pointer rounded-md mx-2 my-1 ${
                        statusFilter === "Deleted" 
                          ? "bg-[#F3F4F6] text-[#8B5CF6]" 
                          : "text-[#6B7280]"
                      }`}
                      onClick={() => handleStatusFilterChange("Deleted")}
                    >
                      Deleted
                    </div>
                  </div>
                )}
              </div>
            </div>

          
        </div>

        
        {/* Table with proper column alignment */}
        <div className="overflow-x-auto">
          <table className="w-full ml-8">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">
                  Business Name
                </th>
                <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">
                  Location
                </th>
                <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">
                  Status
                </th>
                <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">
                  Actions
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body - With border */}
        <div className="border border-[#e1e4ea] bg-[#FFFFFF] rounded-lg p-6 -mt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className={index > 0 ? "border-t border-[#e1e4ea]" : ""}>
                    <td className="py-4 px-4 w-1/8">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-[#675FFF] text-sm font-semibold bg-[#335BFB1A]"
                        >
                          {user.initials}
                        </div>
                        <span className="text-[#1E1E1E] font-medium whitespace-nowrap">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 w-1/8">
                      <span className="text-[#5A687C] font-medium">
                        {user.email}
                      </span>
                    </td>
                    <td className="py-4 px-4 w-1/8">
                      <span className="text-[#5A687C] font-medium">
                        {user.businessName}
                      </span>
                    </td>
                    <td className="py-4 px-4 w-1/8">
                      <span className="text-[#5A687C] font-medium">
                        {user.location}
                      </span>
                    </td>
                    <td className="py-4 px-4 w-1/8">
                      <div className="flex items-center justify-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          userStates[user.id]
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {userStates[user.id] ? "Active" : "Inactive"}
                        </span>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            userStates[user.id] ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            userStates[user.id] ? "translate-x-6" : "translate-x-1"
                          }`} />
                        </button>
                      </div>
                    </td>
                                         <td className="py-4 px-4 w-1/8">
                       <div className="flex items-center justify-center gap-3">
                         <EditIcon />
                         <DeleteIcon />
                       </div>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-[#5A687C]">
                No users found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
