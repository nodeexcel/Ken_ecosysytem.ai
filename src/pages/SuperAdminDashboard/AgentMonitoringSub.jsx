import { useState } from "react"
import { Search, Download, Trash2, Mail, Phone, Calendar } from "lucide-react"

// Mock data for the user profile
const userData = {
  name: "Stephanie Nichol",
  initials: "SN",
  stats: [
    { label: "Users", value: 6 },
    { label: "Appointments", value: 12 },
    { label: "Email Sent/Open Rate", value: 15 },
    { label: "Call Handled", value: 14 },
  ],
  status: "Online",
}

// Mock data for files table
const filesData = [
  {
    id: 1,
    name: "Kurt Batese",
    email: "alex941@outlook.com",
    Active_agents: { icon: "Mail", text: "Emailing" },
    status: "Active",
    isActive: true,
  },
  {
    id: 2,
    name: "Chris Glasser",
    email: "eddie_lake@gmail.com",
    Active_agents: { icon: "Phone", text: "Telephony" },
    status: "Active",
    isActive: true,
  },
  {
    id: 3,
    name: "Corina McCoy",
    email: "autumn_philips@aol.com",
    Active_agents: { icon: "Calendar", text: "Appointment" },
    status: "Active",
    isActive: true,
  },
]

const AgentMonitoringSub = () => {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("Files")
  const [files, setFiles] = useState(filesData)

  const handleDeleteFile = (fileId) => {
    setFiles(files.filter((file) => file.id !== fileId))
  }

  const handleToggleStatus = (fileId) => {
    setFiles(files.map((file) => 
      file.id === fileId 
        ? { ...file, isActive: !file.isActive, status: file.isActive ? "Inactive" : "Active" }
        : file
    ))
  }

  const handleDownloadFile = (fileId) => {
    // Handle file download logic here
    console.log(`Downloading file ${fileId}`)
  }

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <div className="m-0">
        <h1 className="w-full mt-0.5 border-b border-[#E1E4EA] font-medium p-2 ml-0 m-0 font-Semibold text-[#1E1E1E] text-[26px]">
          Agent Monitoring
        </h1>
      </div>

      <div className="w-full p-4 flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <span className="loader" />
          </div>
        ) : (
          <>
            {/* User Profile Card */}
            <div className="border border-[#e1e4ea] bg-[#FFFFFF] rounded-lg p-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 bg-[#335BFB1A] rounded-lg flex items-center justify-center">
                  <span className="text-[#675FFF] text-2xl font-semibold">{userData.initials}</span>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-[#1E1E1E] text-[20px] font-[600] mb-4">{userData.name}</h2>

                  <div className="flex items-center gap-6 flex-wrap">
                    {userData.stats.map((stat, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-[#5A687C] text-[14px] mb-1">{stat.label}</span>
                        <span className="text-[#1E1E1E] text-[24px] font-[600]">{stat.value}</span>
                      </div>
                    ))}
                    <div className="flex flex-col">
                      <span className="text-[#5A687C] text-[14px] mb-1">Status</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#34C7591A] border border-[#34C759] text-[#34C759] w-fit">
                        {userData.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            {/* <div className="flex border-b border-[#e1e4ea]">
              {["Files", "Snippets", "Website Sources"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-[#675FFF] border-b-2 border-[#675FFF]"
                      : "text-[#5A687C] hover:text-[#1E1E1E]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div> */}
            {/* sub heading */}
            <div className="flex items-center gap-4">
              <h2 className="text-[#1E1E1E] text-[30px] font-[600]">Users</h2>
            </div>

            {/* Filter and Search Row */}
            <div className="flex items-center gap-4">
              {/* Filter Dropdown */}
              <div className="relative">
                <select className="appearance-none pl-4 pr-10 py-2 border border-[#e1e4ea] bg-white rounded-lg text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#675FFF] cursor-pointer">
                  <option value="all">Channel: All</option>
                  <option value="email">Email</option>
                  <option value="chat">Chat</option>
                  <option value="phone">Phone</option>
                  <option value="social">Social Media</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-[#e1e4ea] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF]"
                />
              </div>
            </div>

            {/* Table Headers */}
            <div className="px-6">
              <div className="grid grid-cols-12 gap-4 py-2">
                <div className="col-span-4 text-[#5A687C] text-[14px] font-medium">User Name</div>
                <div className="col-span-3 text-[#5A687C] text-[14px] font-medium">Email</div>
                <div className="col-span-3 text-[#5A687C] text-[14px] font-medium">Active Agents</div>
                <div className="col-span-2 text-[#5A687C] text-[14px] font-medium">Status</div>
              </div>
            </div>

            {/* Content Container */}
            <div className="border border-[#e1e4ea] bg-[#FFFFFF] rounded-lg">
              {/* Users Table */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <div className="w-full">
                    {filteredFiles.map((user, index) => (
                      <div
                        key={user.id}
                        className={`grid grid-cols-12 gap-4 py-4 ${index > 0 ? "border-t border-[#e1e4ea]" : ""}`}
                      >
                        <div className="col-span-4">
                          <span className="text-[#1E1E1E] font-medium">{user.name}</span>
                        </div>
                        <div className="col-span-3">
                          <span className="text-[#5A687C]">{user.email}</span>
                        </div>
                        <div className="col-span-3">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium  ${
                              user.Active_agents.icon === "Mail" 
                                ? "bg-[#FF95001A] text-[#FF9F1C]" 
                                : user.Active_agents.icon === "Phone"
                                ? "bg-[#675FFF1A] text-[#675FFF]"
                                : "bg-[#34C7591A] text-[#34C759]"
                            }`}
                          >
                            <span>
                              {user.Active_agents.icon === "Mail" && <Mail className="w-4 h-4" />}
                              {user.Active_agents.icon === "Phone" && <Phone className="w-4 h-4" />}
                              {user.Active_agents.icon === "Calendar" && <Calendar className="w-4 h-4" />}
                            </span>
                            {user.Active_agents.text}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center justify-center gap-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                              user.isActive 
                                ? "bg-[#34C7591A] text-[#34C759] border-[#34C759]" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {user.status}
                            </span>
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                user.isActive ? "bg-[#335CFF]" : "bg-[#E1E4EA]"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  user.isActive ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AgentMonitoringSub;
