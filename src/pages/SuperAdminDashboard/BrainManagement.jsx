import React, { useState } from "react";
import { Search, ChevronDown, Eye, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for AI Brain Management
const brainData = [
  {
    id: 1,
    name: "Judith Rodriguez",
    initials: "JR",
    websiteSources: 4,
    files: 3,
    snippets: 12,
    status: "Active",
    isActive: true,
  },
  {
    id: 2,
    name: "Iva Ryan",
    initials: "IR",
    websiteSources: 4,
    files: 3,
    snippets: 12,
    status: "Active",
    isActive: true,
  },
  {
    id: 3,
    name: "Dennis Callis",
    initials: "DC",
    websiteSources: 4,
    files: 3,
    snippets: 12,
    status: "Active",
    isActive: true,
  },
  {
    id: 4,
    name: "Eddie Lake",
    initials: "EL",
    websiteSources: 4,
    files: 3,
    snippets: 12,
    status: "Active",
    isActive: true,
  }
];

const BrainManagement = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [users, setUsers] = useState(brainData);
  const navigate = useNavigate();

  const handleToggleUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive, status: user.isActive ? "Inactive" : "Active" }
        : user
    ));
  };

  const handleView = (userId) => {
    console.log("View user:", userId);
    // Add view functionality here
    navigate(`/super-admin/brain-management-sub`);
  };

  const handleDownload = (userId) => {
    console.log("Download user data:", userId);
    // Add download functionality here
  };

  const handleDelete = (userId) => {
    console.log("Delete user:", userId);
    // Add delete functionality here
    setUsers(users.filter(user => user.id !== userId));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedStatus === "Status" || user.status === selectedStatus)
  );

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
            {/* Main Content */}
            <div className="flex flex-col gap-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
                <div className="flex flex-row gap-4 w-[290px] h-[34px]">
                <div className="relative">
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="appearance-none bg-white border border-[#e1e4ea] rounded-lg px-4 py-2 pr-10 text-[#5A687C] focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                  >
                    <option value="Status">Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative flex-1 max-w-md bg-[#FFFFFF] rounded-lg ">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 " />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#5A687C] placeholder-[#5A687C]"
                  />
                </div>
                </div>
              </div>

              {/* Table with proper column alignment */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/6">
                        User Name
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/6">
                        Website Sources
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/6">
                        Files
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/6">
                        Snippets
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/6">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/6">
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
                          <td className="py-4 px-4 w-1/6">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-[#675FFF] text-sm font-semibold bg-[#335BFB1A]   "
                              >
                                {user.initials}
                              </div>
                              <span className="text-[#1E1E1E] font-medium">
                                {user.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center w-1/6">
                            <span className="text-[#1E1E1E] font-medium">
                              {user.websiteSources}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center w-1/6">
                            <span className="text-[#1E1E1E] font-medium">
                              {user.files}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center w-1/6">
                            <span className="text-[#1E1E1E] font-medium">
                              {user.snippets}
                            </span>
                          </td>
                          <td className="py-4 px-4 w-1/6">
                            <div className="flex items-center justify-center gap-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                user.isActive 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {user.status}
                              </span>
                              <button
                                onClick={() => handleToggleUser(user.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                  user.isActive ? "bg-blue-600" : "bg-gray-200"
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    user.isActive ? "translate-x-6" : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 w-1/6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleView(user.id)}
                                className="p-2 text-[#5A687C] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDownload(user.id)}
                                className="p-2 text-[#675FFF] hover:text-[#675FFF] hover:bg-[#335BFB1A] rounded-lg transition-colors"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
          </>
        )}
      </div>
    </div>
  );
};

  export default BrainManagement;
