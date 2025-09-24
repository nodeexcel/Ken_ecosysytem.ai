import React, { useState } from "react";
import { Search, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for AI Brain Management
const brainData = [
  {
    id: 1,
    name: "Stephanie Nicol",
    initials: "SN",
    users: 6,
    appointments: 12,
    emailSent: 15,
    callHandled: 17,
    status: "Online",
    isActive: true,
  },
  {
    id: 2,
    name: "Lorri Warf",
    initials: "LW",
    users: 6,
    appointments: 12,
    emailSent: 15,
    callHandled: 17,
    status: "Offline",
    isActive: true,
  },
  {
    id: 3,
    name: "Ricky Smith",
    initials: "RS",
    users: 6,
    appointments: 12,
    emailSent: 15,
    callHandled: 17,
    status: "Online",
    isActive: true,
  },
];

const AgentMonitoring = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [users, setUsers] = useState(brainData);
  const navigate = useNavigate();

  const handleToggleUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive, status: user.isActive ? "Offline" : "Online" }
        : user
    ));
  };

  const handleView = (userId) => {
    console.log("View user:", userId);
    // Add view functionality here
    navigate(`/super-admin/agent-monitoring-sub`);
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
        (user.status === "Online" || user.status === "Offline")
  );

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
            {/* Main Content */}
            <div className="flex flex-col gap-6 ">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
                <div className="flex flex-row gap-4 w-[290px] h-[34px]">
                <div className="relative">
                  <select   
                    className="appearance-none bg-white border border-[#e1e4ea] rounded-lg px-4 py-2 pr-10 text-[#5A687C] focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                  >
                    <option value="Status">Status</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select> 
                  
                </div>

                <div className="relative flex-1 bg-[#FFFFFF] rounded-lg h-[34px]">
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
                        Agent Name
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/6">
                        Users
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/6">
                        Appointments
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/6">
                        Email Sent
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/6">
                        Call Handled    
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
                              {user.users}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center w-1/6">
                            <span className="text-[#1E1E1E] font-medium">
                              {user.appointments}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center w-1/6">
                            <span className="text-[#1E1E1E] font-medium">
                                {user.emailSent}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center w-1/6">
                            <span className="text-[#1E1E1E] font-medium">
                              {user.callHandled}
                            </span> 
                          </td>
                          
                          <td className="py-4 px-4 w-1/6">
                            <div className="flex items-center justify-center gap-3">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                                user.status === "Online"
                                  ? "bg-[#34C7591A] text-[#34C759] border border-[#34C759]" 
                                  : "bg-[#5A687C1A] text-[#5C636E] border border-[#8C929B]"
                              }`}>
                                {user.status}       
                              </span>

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

  export default AgentMonitoring;
