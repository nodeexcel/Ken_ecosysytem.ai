import React, { useState } from "react";
import { Search, ChevronDown, Mail, Phone, Calendar, User } from 'lucide-react';

// Mock data for the agent profile
const agentData = {
  name: "Stephanie Nicol",
  initials: "SN",
  stats: [
    { label: "Users", value: 6 },
    { label: "Appointments", value: 12 },
    { label: "Emails Sent/Open Rate", value: 15 },
    { label: "Calls Handled", value: 14 },
  ],
  status: "Online"
};

// Mock data for users table
const usersData = [
  {
    id: 1,
    name: "Kurt Bates",
    email: "alex941@outlook.com",
    activeAgent: "Emailing",
    status: "Active",
    isActive: true
  },
  {
    id: 2,
    name: "Chris Glasser",
    email: "eddie_lake@gmail.com",
    activeAgent: "Telephony",
    status: "Active",
    isActive: true
  },
  {
    id: 3,
    name: "Corina McCoy",
    email: "autumn_philips@aol.com",
    activeAgent: "Appointment",
    status: "Active",
    isActive: true
  }
];

const AgentMonitoringSub = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("All");
  const [users, setUsers] = useState(usersData);

  const handleToggleUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive, status: user.isActive ? "Inactive" : "Active" }
        : user
    ));
  };

  const getAgentIcon = (agentType) => {
    switch (agentType) {
      case "Emailing":
        return <Mail className="w-4 h-4 text-orange-500" />;
      case "Telephony":
        return <Phone className="w-4 h-4 text-blue-500" />;
      case "Appointment":
        return <Calendar className="w-4 h-4 text-green-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAgentTypeColor = (agentType) => {
    switch (agentType) {
      case "Emailing":
        return "text-orange-500 bg-orange-50";
      case "Telephony":
        return "text-blue-500 bg-blue-50";
      case "Appointment":
        return "text-green-500 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            {/* Agent Profile Card */}
            <div className="border border-[#e1e4ea] bg-[#FFFFFF] rounded-lg p-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 bg-[#335BFB1A] rounded-lg flex items-center justify-center">
                  <span className="text-[#675FFF] text-2xl font-semibold">
                    {agentData.initials}
                  </span>
                </div>

                {/* Agent Info */}
                <div className="flex-1">
                  <h2 className="text-[#1E1E1E] text-[20px] font-[600] mb-4">
                    {agentData.name}
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {agentData.stats.map((stat, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-[#5A687C] text-[14px] mb-1">
                          {stat.label}
                        </span>
                        <span className="text-[#1E1E1E] text-[24px] font-[600]">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                    <div className="flex flex-col">
                      <span className="text-[#5A687C] text-[14px] mb-1">
                        Status
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 w-fit">
                        {agentData.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Section */}
            <div className="border border-[#e1e4ea] bg-[#FFFFFF] rounded-lg p-6">
              <h2 className="text-[#1E1E1E] text-[20px] font-[600] mb-6">
                Users
              </h2>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative">
                  <select 
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="appearance-none bg-white border border-[#e1e4ea] rounded-lg px-4 py-2 pr-10 text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">Channel: All</option>
                    <option value="Emailing">Channel: Emailing</option>
                    <option value="Telephony">Channel: Telephony</option>
                    <option value="Appointment">Channel: Appointment</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e1e4ea]">
                      <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium">
                        User Name
                      </th>
                      <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium">
                        Active Agent
                      </th>
                      <th className="text-right py-3 px-4 text-[#5A687C] text-[14px] font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id} className={index > 0 ? "border-t border-[#e1e4ea]" : ""}>
                        <td className="py-4 px-4">
                          <span className="text-[#1E1E1E] font-medium">
                            {user.name}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-[#5A687C]">
                            {user.email}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getAgentTypeColor(user.activeAgent)}`}>
                            {getAgentIcon(user.activeAgent)}
                            {user.activeAgent}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-3">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AgentMonitoringSub;
