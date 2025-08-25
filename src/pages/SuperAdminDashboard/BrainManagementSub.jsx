import { useState } from "react"
import { Search, Download, Trash2 } from "lucide-react"

// Mock data for the user profile
const userData = {
  name: "Judith Rodriguez",
  initials: "JR",
  stats: [
    { label: "Website Sources", value: 6 },
    { label: "Files", value: 12 },
    { label: "Snippets", value: 15 },
  ],
  status: "Active",
}

// Mock data for files table
const filesData = [
  {
    id: 1,
    name: "Xyz file.pdf",
    type: "PDF",
    uploaded: "2 days ago",
  },
  {
    id: 2,
    name: "Xyz file.pdf",
    type: "PDF",
    uploaded: "2 days ago",
  },
  {
    id: 3,
    name: "Xyz file.pdf",
    type: "PDF",
    uploaded: "2 days ago",
  },
]

const BrainManagementSub = () => {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("Files")
  const [files, setFiles] = useState(filesData)

  const handleDeleteFile = (fileId) => {
    setFiles(files.filter((file) => file.id !== fileId))
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
          AI Brain Management
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

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-fit">
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
            <div className="flex border-b border-[#e1e4ea]">
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
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-fit pl-10 pr-4 py-2 border border-[#e1e4ea] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF]"
              />
            </div>

            {/* Table Headers */}
            <div className="px-6">
              <div className="grid grid-cols-12 gap-4 py-2">
                <div className="col-span-4 text-[#5A687C] text-[14px] font-medium">Name</div>
                <div className="col-span-2 text-[#5A687C] text-[14px] font-medium">Type</div>
                <div className="col-span-3 text-[#5A687C] text-[14px] font-medium">Uploaded</div>
                <div className="col-span-3 text-[#5A687C] text-[14px] font-medium text-right">Action</div>
              </div>
            </div>

            {/* Content Container */}
            <div className="border border-[#e1e4ea] bg-[#FFFFFF] rounded-lg">
              {/* Files Table */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <div className="w-full">
                    {filteredFiles.map((file, index) => (
                      <div
                        key={file.id}
                        className={`grid grid-cols-12 gap-4 py-4 ${index > 0 ? "border-t border-[#e1e4ea]" : ""}`}
                      >
                        <div className="col-span-4">
                          <span className="text-[#1E1E1E] font-medium">{file.name}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[#5A687C]">{file.type}</span>
                        </div>
                        <div className="col-span-3">
                          <span className="text-[#5A687C]">{file.uploaded}</span>
                        </div>
                        <div className="col-span-3">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleDownloadFile(file.id)}
                              className="p-2 text-[#675FFF] hover:bg-[#675FFF] hover:text-white rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
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

export default BrainManagementSub;
