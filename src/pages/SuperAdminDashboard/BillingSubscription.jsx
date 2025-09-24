import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Eye, Download, Trash2, CirclePlus, CreditCard, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThreeDots, AddIcon, CreditsIcon, EditPlanIcon, Delete, ProIcon, TeamIcon, BusinessIcon, EnterpriseIcon } from '../../icons/icons';

// Mock data for Billing Subscription Management
const billingData = [
  {
    id: 1,
    name: "Autumn Phillips",
    initials: "JR",
    callCredit: 200,
    emailCredit: 350,
    messageCredit: 500,
    currentPlan: (
      <div className="flex items-center justify-center gap-2">
        <ProIcon />
        <span>Pro</span>
      </div>
    ),
    plan: "Pro",
    renewalDate: "20/05/2026", 
    status: "Active",
    isActive: true,
  },
  {
    id: 2,
    name: "David Elson",
    initials: "JR",
    callCredit: 200,
    emailCredit: 200,
    messageCredit: 200,
    currentPlan: (
        <div className="flex items-center justify-center gap-2">
          <TeamIcon />
          <span>Team</span>
        </div>
      ),
    plan: "Team",
    renewalDate: "20/05/2026",
    status: "Active",
    isActive: true,
  },
  {
    id: 3,
    name: "Mary Freund",
    initials: "JR",
    callCredit: 200,
    emailCredit: 200,
    messageCredit: 200,
    currentPlan: (
        <div className="flex items-center justify-center gap-2">
          <BusinessIcon/>
          <span>Business</span>
        </div>
      ),
    plan: "Business",
    renewalDate: "20/05/2026",
    status: "Active",
    isActive: true,
  },
  {
    id: 4,
    name: "Bradley Lawlor",
    initials: "JR",
    callCredit: 200,
    emailCredit: 200,
    messageCredit: 200,
    currentPlan: (
        <div className="flex items-center justify-center gap-2">
          <EnterpriseIcon />
          <span>Enterprise</span>
        </div>
      ),
    plan: "Enterprise",
    renewalDate: "20/05/2026",
    status: "Inactive",
    isActive: false,
  }
];

const BillingSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [selectedPlan, setSelectedPlan] = useState("Plan");
  const [users, setUsers] = useState(billingData);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [openUpward, setOpenUpward] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedElement = event.target;
      const isDropdownClick = clickedElement.closest('[data-dropdown]');
      const isTriggerClick = clickedElement.closest('button[data-dropdown-trigger]');
      
      if (!isDropdownClick && !isTriggerClick) {
        setActiveDropdown(null);
        setOpenUpward(false);
      }
    };
    
    if (activeDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeDropdown]);

  const handleToggleUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive, status: user.isActive ? "Inactive" : "Active" }
        : user
    ));
  };

  const handleDropdownClick = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
      setOpenUpward(false);
    } else {
      const button = document.querySelector(`[data-dropdown-trigger="${index}"]`);
      if (button) {
        const rect = button.getBoundingClientRect();
        const dropdownHeight = 200; // Approximate height of dropdown
        const dropdownWidth = 208; // Width of the dropdown (w-52 = 13rem = 208px)
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        let top, left;
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          // Position above the button
          top = rect.top - dropdownHeight - 8;
          setOpenUpward(true);
        } else {
          // Position below the button
          top = rect.bottom + 8;
          setOpenUpward(false);
        }
        
        // Position horizontally - align to the right of the button
        left = rect.right - dropdownWidth;
        
        // Check if dropdown would go off-screen to the left
        if (left < 0) {
          left = rect.left;
        }
        
        // Check if dropdown would go off-screen to the right
        if (left + dropdownWidth > window.innerWidth) {
          left = window.innerWidth - dropdownWidth - 8;
        }
        
        setDropdownPosition({ top, left });
        setActiveDropdown(index);
      }
    }
  };

  const handleAddCredits = (userId) => {
    console.log("Add credits for user:", userId);
    setActiveDropdown(null);
    // Add credits functionality here
  };

  const handleExtendSubscription = (userId) => {
    console.log("Extend subscription for user:", userId);
    setActiveDropdown(null);
    // Extend subscription functionality here
  };

  const handleChangePlan = (userId) => {
    console.log("Change plan for user:", userId);
    setActiveDropdown(null);
    // Change plan functionality here
  };

  const handleDelete = (userId) => {
    console.log("Delete user:", userId);
    setActiveDropdown(null);
    // Add delete functionality here
    setUsers(users.filter(user => user.id !== userId));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedStatus === "Status" || user.status === selectedStatus) &&
    (selectedPlan === "Plan" || user.plan === selectedPlan)
  );

  return (
    <div>
      <div className="m-0">
        <h1 className="w-full mt-0.5 border-b border-[#E1E4EA] font-medium p-2 ml-0 m-0 font-Semibold text-[#1E1E1E] text-[26px]">
          Billing & Subscription
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
                <div className="flex flex-row gap-4 w-[420px] h-[34px]">
                <div className="relative">
                  <select 
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="appearance-none bg-white border border-[#e1e4ea] rounded-lg px-4 py-2 pr-10 text-[#5A687C] focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                  >
                    <option value="Plan">Plan</option>
                    <option value="Pro">Pro</option>
                    <option value="Team">Team</option>
                    <option value="Business">Business</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

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

                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#e1e4ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#5A687C] placeholder-[#5A687C] bg-white"
                  />
                </div>
                </div>
              </div>

              {/* Table with proper column alignment */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">
                        User Name
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">
                        Call Credit
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">
                        Email Credit
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">
                        Message Credit
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">
                        Current Plan
                      </th>
                      <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">
                        Renewal Date
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
                          <td className="py-4 px-4 text-center w-1/8">
                            <span className="text-[#5A687C] font-medium">
                              {user.callCredit}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center w-1/8">
                            <span className="text-[#5A687C] font-medium">
                              {user.emailCredit}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center w-1/8">
                            <span className="text-[#5A687C] font-medium">
                              {user.messageCredit}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center w-1/8">
                            {user.currentPlan}
                          </td>
                          <td className="py-4 px-4 text-center w-1/8">
                            <span className="text-[#5A687C] font-medium">
                              {user.renewalDate}
                            </span>
                          </td>
                          <td className="py-4 px-4 w-1/8">
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
                          <td className="py-4 px-4 w-1/8">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleDropdownClick(index)}
                                className="p-2 text-[#5A687C] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Actions"
                                data-dropdown-trigger={index}
                              >
                                <div className='bg-[#F4F5F6] p-2 rounded-lg'>
                                  <ThreeDots />
                                </div>
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
      
      {/* Dropdown positioned absolutely outside the table */}
      {activeDropdown !== null && (
        <div 
          ref={dropdownRef}
          data-dropdown
          className="fixed px-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-50"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <div className="py-1">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg font-medium"
              onClick={() => handleAddCredits(users[activeDropdown]?.id)}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center">
                  <CirclePlus className="w-4 h-4 text-[#675FFF]" />
                </div>
                <span className="whitespace-nowrap">Add Credits</span>
              </div>
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6] hover:rounded-lg"
              onClick={() => handleExtendSubscription(users[activeDropdown]?.id)}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#5A687C]" />
                <span className="whitespace-nowrap">Extend Subscription</span>
              </div>
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6] hover:rounded-lg"
              onClick={() => handleChangePlan(users[activeDropdown]?.id)}
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#5A687C]"/>
                <span className="whitespace-nowrap">Change Plan</span>
              </div>
            </button>
            <hr className="border-[#E6EAEE] my-1" />
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#F4F5F6] hover:rounded-lg"
              onClick={() => handleDelete(users[activeDropdown]?.id)}
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-600" />
                <span className="whitespace-nowrap">Delete</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingSubscription;
