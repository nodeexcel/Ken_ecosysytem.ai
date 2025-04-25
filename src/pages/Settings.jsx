import { CreditCardIcon, EyeIcon, EyeOffIcon, SettingsIcon, UsersIcon, X } from "lucide-react";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import profile_pic from '../assets/images/profile.png';
import { LuRefreshCw } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";


// User profile data
const profileData = {
  firstName: "Robert",
  lastName: "Downey",
  email: "robertdowney45@gmail.com",
  phone: "+1 (252) 212 2125",
  company: "Ecosysteme",
  role: "Admin",
  city: "Springfield",
  country: "United States",
  avatar: "/rectangle-1043.png",
};

const tableData = [
  {
    initials: 'RD',
    name: 'Robert Downey',
    email: 'robertdowney45@gmail.com',
    role: 'Admin',
    assigned: 'Liam',
  },
  {
    initials: 'NC',
    name: 'Nicolas Cage',
    email: 'nicolascage88@gmail.com',
    role: 'Member',
    assigned: 'Daniel, Criss',
  },
  {
    initials: 'JD',
    name: 'Johny Deep',
    email: 'johnydeep86@gmail.com',
    role: 'Member',
    assigned: 'Kenneth, Lori',
  },
  {
    initials: 'JM',
    name: 'Jecob More',
    email: 'jecobmore56542@gmail.com',
    role: 'Guest',
    assigned: 'Kurt',
  },
]


const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [activeSidebarItem, setActiveSidebarItem] = useState("general");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [open, setOpen] = useState(false);
  const [emailInvite, setEmailInvite] = useState("")
  const [role, setRole] = useState("")

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderMainContent = () => {
    if (activeSidebarItem === "billing") {
      return (
        <div className="flex flex-col w-full gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[#1E1E1E] text-2xl font-semibold">Plan & Billing</h2>
            <p className="text-[#5A687C] text-base">Manage your subscription and billing details</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="flex flex-col p-6 border border-[#E1E4EA] rounded-2xl">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-[#1E1E1E]">Free Plan</h3>
                  <p className="text-sm text-[#5A687C]">Perfect for getting started</p>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-semibold text-[#1E1E1E]">$0</span>
                  <span className="text-base text-[#5A687C] mb-1">/month</span>
                </div>
                <button className="w-full py-2 px-4 bg-[#F5F7FF] text-[#335BFB] border border-[#335BFB] rounded-lg">
                  Current Plan
                </button>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-[#1E1E1E] mb-3">What's included:</h4>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <div className="w-1.5 h-1.5 bg-[#335BFB] rounded-full" />
                    Up to 5 projects
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <div className="w-1.5 h-1.5 bg-[#335BFB] rounded-full" />
                    Up to 10 team members
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <div className="w-1.5 h-1.5 bg-[#335BFB] rounded-full" />
                    Basic analytics
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="flex flex-col p-6 border border-[#335BFB] rounded-2xl bg-[#F5F7FF]">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-[#1E1E1E]">Pro Plan</h3>
                  <p className="text-sm text-[#5A687C]">Perfect for growing teams</p>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-semibold text-[#1E1E1E]">$49</span>
                  <span className="text-base text-[#5A687C] mb-1">/month</span>
                </div>
                <button className="w-full py-2 px-4 bg-[#335BFB] text-white rounded-lg">
                  Upgrade Plan
                </button>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-[#1E1E1E] mb-3">What's included:</h4>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <div className="w-1.5 h-1.5 bg-[#335BFB] rounded-full" />
                    Up to 15 projects
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <div className="w-1.5 h-1.5 bg-[#335BFB] rounded-full" />
                    Up to 50 team members
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <div className="w-1.5 h-1.5 bg-[#335BFB] rounded-full" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <div className="w-1.5 h-1.5 bg-[#335BFB] rounded-full" />
                    Priority support
                  </li>
                </ul>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="flex flex-col p-6 border border-[#E1E4EA] rounded-2xl">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-[#1E1E1E]">Enterprise Plan</h3>
                  <p className="text-sm text-[#5A687C]">Perfect for large organizations</p>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-semibold text-[#1E1E1E]">$99</span>
                  <span className="text-base text-[#5A687C] mb-1">/month</span>
                </div>
                <button className="w-full py-2 px-4 bg-white text-[#5A687C] border border-[#5A687C] rounded-lg">
                  Contact Sales
                </button>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-[#1E1E1E] mb-3">What's included:</h4>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <div className="w-1.5 h-1.5 bg-[#335BFB] rounded-full" />
                    Unlimited projects
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <div className="w-1.5 h-1.5 bg-[#335BFB] rounded-full" />
                    Unlimited team members
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <div className="w-1.5 h-1.5 bg-[#335BFB] rounded-full" />
                    Custom analytics
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <div className="w-1.5 h-1.5 bg-[#335BFB] rounded-full" />
                    24/7 dedicated support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    else if (activeSidebarItem === "team") {
      return (
        <>
          <div className="w-full p-2 flex flex-col gap-3">
            <div className="flex justify-between">
              <h1 className="text-[#1E1E1E] font-semibold text-[24px]">Team Members</h1>
              <button className="bg-[#5E54FF] text-white rounded-md p-2" onClick={() => setOpen(true)}>Invite A Team Member</button>
            </div>
            <div className="flex justify-between">
              <div className="w-[137px] flex items-center border border-gray-300 rounded ">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white px-4 py-2"
                >
                  <option value="" disabled>Role</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
              <div className="flex items-center px-3 gap-2 border border-[#E1E4EA] rounded-[8px] h-[38px]">
                <LuRefreshCw color="#5E54FF" />
                <button className="text-[16px] text-[#5A687C] bg-white">
                  Refresh
                </button>
              </div>
            </div>
            <div className="rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-transparent">
                  <tr>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#5A687C]">Name</th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#5A687C]">Email</th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#5A687C]">Role</th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#5A687C]">Agents</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-[#F9FAFB] divide-y divide-gray-200">
                  {tableData.map((user, index) => (
                    <tr key={index} className="rounded-xl my-2">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#E8E9FF] text-[#5E54FF] rounded-full flex items-center justify-center font-semibold text-sm">
                          {user.initials}
                        </div>
                        <span className="font-medium text-[#1E1E1E]">{user.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.assigned}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-500 hover:text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {open && (
            <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
              <div className="bg-white max-h-[316px] flex flex-col gap-3 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-[#1E1E1E] font-semibold text-[20px] mb-4">Invite a team member</h2>

                <div className="mb-4">
                  <label className="block text-[14px] font-medium text-[#292D32] mb-1">Email Address</label>
                  <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={emailInvite}
                      onChange={(e) => setEmailInvite(e.target.value)}
                      className="w-full focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                    Close
                  </button>
                  <button className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]">
                    Invite
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    return (
      <div className="flex flex-col w-[1136px] items-start gap-5 relative">
        {/* Header */}
        <div className="flex flex-col items-start gap-[23px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Onest',Helvetica] font-semibold text-[#1e1e1e] text-2xl tracking-[0] leading-8 whitespace-nowrap">
                General Settings
              </div>
            </div>

            <div className="inline-flex items-center gap-4 relative flex-[0_0_auto] opacity-0">
              <button className="px-4 py-2 bg-[#f5f7ff] text-primary-color border border-[#335bfb] rounded-lg">
                Save Draft
              </button>
              <button className="px-4 py-2 bg-primary-color text-white rounded-lg">
                Submit Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="flex items-start relative self-stretch w-full flex-[0_0_auto] border-b border-[#e1e4ea]">
            <button
              onClick={() => setActiveTab("profile")}
              className={`inline-flex items-center justify-center gap-1 p-2.5 relative flex-[0_0_auto] border-b-2 ${activeTab === "profile"
                ? "border-[#5E54FF] text-primary-color"
                : "border-[#e1e4ea] text-text-grey"
                } rounded-none`}
            >
              <span className={`[font-family:'Onest',Helvetica] font-medium text-sm tracking-[0] leading-6 whitespace-nowrap ${activeTab === "profile"? "text-[#5E54FF]"
                : "text-[#5A687C] "}`}>
                My Profile
              </span>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`inline-flex items-center justify-center gap-1 p-2.5 relative flex-[0_0_auto] border-b-2 ${activeTab === "password"
                ? "border-[#5E54FF] text-primary-color"
                : "border-[#e1e4ea] text-text-grey"
                } rounded-none`}
            >
              <span className={`[font-family:'Onest',Helvetica] font-medium text-sm tracking-[0] leading-6 whitespace-nowrap ${activeTab === "password"? "text-[#5E54FF]"
                : "text-[#5A687C] "}`}>
                Change Password
              </span>
            </button>
          </div>

          {activeTab === "profile" && (
            <div className="mt-5 p-0">
              <div className="w-[648px] border border-solid border-[#e1e4ea] rounded-2xl">
                <div className="flex flex-col items-center justify-center gap-[26px] p-[30px] relative">
                  {/* Profile Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={profile_pic || profileData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute top-[65px] left-[65px] bg-primary-color rounded-[110px] w-[31px] h-[31px] p-[7px]">
                      <img
                        className="w-[17px] h-[17px]"
                        alt="Edit"
                        src="/frame.svg"
                      />
                    </button>
                  </div>

                  {/* Profile Form */}
                  <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
                    {/* Name Fields */}
                    <div className="flex items-start gap-[17px] relative self-stretch w-full">
                      <div className="flex flex-col items-start gap-1.5 relative flex-1 grow">
                        <label className="[font-family:'Onest',Helvetica] font-medium text-text-black text-sm tracking-[0] leading-5">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue={profileData.firstName}
                          className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs [font-family:'Onest',Helvetica] font-normal text-text-black text-base tracking-[0] leading-6"
                        />
                      </div>
                      <div className="flex flex-col items-start gap-1.5 relative flex-1 grow">
                        <label className="[font-family:'Onest',Helvetica] font-medium text-text-black text-sm tracking-[0] leading-5">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue={profileData.lastName}
                          className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs [font-family:'Onest',Helvetica] font-normal text-text-black text-base tracking-[0] leading-6"
                        />
                      </div>
                    </div>

                    {/* Contact Fields */}
                    <div className="flex items-start gap-[17px] relative self-stretch w-full">
                      <div className="flex flex-col items-start gap-1.5 relative flex-1 grow">
                        <label className="[font-family:'Onest',Helvetica] font-medium text-text-black text-sm tracking-[0] leading-5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={profileData.email}
                          className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs [font-family:'Onest',Helvetica] font-normal text-text-black text-base tracking-[0] leading-6"
                        />
                      </div>
                      <div className="flex flex-col items-start gap-1.5 relative flex-1 grow">
                        <label className="[font-family:'Onest',Helvetica] font-medium text-text-black text-sm tracking-[0] leading-5">
                          Phone No
                        </label>
                        <input
                          type="tel"
                          defaultValue={profileData.phone}
                          className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs [font-family:'Onest',Helvetica] font-normal text-text-black text-base tracking-[0] leading-6"
                        />
                      </div>
                    </div>

                    {/* Company Fields */}
                    <div className="flex items-start gap-[17px] relative self-stretch w-full">
                      <div className="flex flex-col items-start gap-1.5 relative flex-1 grow">
                        <label className="[font-family:'Onest',Helvetica] font-medium text-text-black text-sm tracking-[0] leading-5">
                          Company
                        </label>
                        <input
                          type="text"
                          defaultValue={profileData.company}
                          className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs [font-family:'Onest',Helvetica] font-normal text-text-black text-base tracking-[0] leading-6"
                        />
                      </div>
                      <div className="flex flex-col items-start gap-1.5 relative flex-1 grow">
                        <label className="[font-family:'Onest',Helvetica] font-medium text-text-black text-sm tracking-[0] leading-5">
                          Role
                        </label>
                        <input
                          type="text"
                          defaultValue={profileData.role}
                          className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs [font-family:'Onest',Helvetica] font-normal text-text-black text-base tracking-[0] leading-6"
                        />
                      </div>
                    </div>

                    {/* Location Fields */}
                    <div className="flex items-start gap-[17px] relative self-stretch w-full">
                      <div className="flex flex-col items-start gap-1.5 relative flex-1 grow">
                        <label className="[font-family:'Onest',Helvetica] font-medium text-text-black text-sm tracking-[0] leading-5">
                          City
                        </label>
                        <input
                          type="text"
                          defaultValue={profileData.city}
                          className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs [font-family:'Onest',Helvetica] font-normal text-text-black text-base tracking-[0] leading-6"
                        />
                      </div>
                      <div className="flex flex-col items-start gap-1.5 relative flex-1 grow">
                        <label className="[font-family:'Onest',Helvetica] font-medium text-text-black text-sm tracking-[0] leading-5">
                          Country
                        </label>
                        <input
                          type="text"
                          defaultValue={profileData.country}
                          className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs [font-family:'Onest',Helvetica] font-normal text-text-black text-base tracking-[0] leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 relative self-stretch w-full">
                    <button className="px-4 py-2 bg-[#5E54FF] text-white rounded-lg">
                      Update Profile
                    </button>
                    <button className="px-4 py-2 bg-[#f5f7ff] text-text-grey border border-[#5a687c] rounded-lg">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className="mt-5">
              <div className="w-[648px] border border-solid border-[#e1e4ea] rounded-2xl">
                <div className="flex flex-col items-start gap-6 p-[30px]">
                  <div className="flex flex-col items-start gap-1">
                    <h2 className="[font-family:'Onest',Helvetica] font-semibold text-text-black text-lg leading-7">
                      Change Password
                    </h2>
                    <p className="[font-family:'Onest',Helvetica] text-text-grey text-sm leading-5">
                      Please enter your current password to change your password
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1.5">
                      <label className="[font-family:'Onest',Helvetica] font-medium text-text-black text-sm leading-5">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
                          <TbLockPassword className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.currentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs [font-family:'Onest',Helvetica] font-normal text-text-black text-base leading-6"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('currentPassword')}
                          className="absolute right-3.5 top-1/2 transform -translate-y-1/2"
                        >
                          {showPasswords.currentPassword ? (
                            <EyeIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <EyeOffIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="[font-family:'Onest',Helvetica] font-medium text-text-black text-sm leading-5">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
                          <TbLockPassword className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.newPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs [font-family:'Onest',Helvetica] font-normal text-text-black text-base leading-6"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('newPassword')}
                          className="absolute right-3.5 top-1/2 transform -translate-y-1/2"
                        >
                          {showPasswords.newPassword ? (
                            <EyeIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <EyeOffIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="[font-family:'Onest',Helvetica] font-medium text-text-black text-sm leading-5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
                          <TbLockPassword className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.confirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs [font-family:'Onest',Helvetica] font-normal text-text-black text-base leading-6"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                          className="absolute right-3.5 top-1/2 transform -translate-y-1/2"
                        >
                          {showPasswords.confirmPassword ? (
                            <EyeIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <EyeOffIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button className="px-4 py-2 bg-[#5E54FF] text-white rounded-lg">
                      Update Password
                    </button>
                    <button className="px-4 py-2 bg-[#f5f7ff] text-text-grey border border-[#5a687c] rounded-lg">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-auto">
      <div>
        <div className='flex items-center pl-4 py-3'>
          <MdOutlineKeyboardArrowLeft size={25} />
          <h1 className="text-[26px] font-bold pb-1">Settings</h1>
        </div>
        <hr className='text-[#E1E4EA]' />
      </div>
      <div className="flex items-start gap-8 relative pl-4 py-3">
        {/* Sidebar Navigation */}
        <div className="flex flex-col w-[153px] items-start gap-2 relative">
          <div
            onClick={() => setActiveSidebarItem("general")}
            className={`flex items-center gap-1.5 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "general" ? "bg-[#e1e5ea]" : ""
              }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <div className={`relative w-fit mt-[-1.00px] [font-family:'Onest',Helvetica] font-normal text-sm tracking-[-0.28px] leading-5 whitespace-nowrap ${activeSidebarItem === "general" ? "text-text-black" : "text-text-grey"
              }`}>
              General Settings
            </div>
          </div>

          <div
            onClick={() => setActiveSidebarItem("billing")}
            className={`flex items-center gap-1.5 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "billing" ? "bg-[#e1e5ea]" : ""
              }`}
          >
            <CreditCardIcon className="w-4 h-4" />
            <div className={`relative w-fit mt-[-1.00px] [font-family:'Onest',Helvetica] font-normal text-sm tracking-[-0.28px] leading-5 whitespace-nowrap ${activeSidebarItem === "billing" ? "text-text-black" : "text-text-grey"
              }`}>
              Plan &amp; Billing
            </div>
          </div>

          <div
            onClick={() => setActiveSidebarItem("team")}
            className={`flex items-center gap-1.5 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "team" ? "bg-[#e1e5ea]" : ""
              }`}
          >
            <UsersIcon className="w-4 h-4" />
            <div className={`relative w-fit mt-[-1.00px] [font-family:'Onest',Helvetica] font-normal text-sm tracking-[-0.28px] leading-5 whitespace-nowrap ${activeSidebarItem === "team" ? "text-text-black" : "text-text-grey"
              }`}>
              Team Members
            </div>
          </div>
        </div>

        {/* Main Content */}
        {renderMainContent()}
      </div>
    </div>
  );
};

export default SettingsPage;