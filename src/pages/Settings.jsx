import { CreditCardIcon, EyeIcon, EyeOffIcon, SettingsIcon, UsersIcon } from "lucide-react";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { TbLockPassword } from "react-icons/tb";
import profile_pic from '../assets/images/profile.png'

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

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
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

  return (
    <div className="h-full w-full overflow-auto">
      <div>
        <div className='flex items-center pl-4 py-3'>
          <MdOutlineKeyboardArrowLeft size={25} />
          <h1 className="text-[26px] font-bold pb-1">Settings</h1>
        </div>
        <hr className='text-[#E1E4EA]' />
      </div>
      <div className="inline-flex items-start gap-8 relative pl-4 py-3">
        {/* Sidebar Navigation */}
        <div className="flex flex-col w-[153px] items-start gap-2 relative">
          <div className="flex items-center gap-1.5 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] bg-[#e1e5ea] rounded">
            <SettingsIcon className="w-4 h-4" />
            <div className="relative w-fit mt-[-1.00px] [font-family:'Onest',Helvetica] font-normal text-text-black text-sm tracking-[-0.28px] leading-5 whitespace-nowrap">
              General Settings
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] rounded">
            <CreditCardIcon className="w-4 h-4" />
            <div className="relative w-fit mt-[-1.00px] [font-family:'Onest',Helvetica] font-normal text-text-grey text-sm tracking-[-0.28px] leading-5 whitespace-nowrap">
              Plan &amp; Billing
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] rounded">
            <UsersIcon className="w-4 h-4" />
            <div className="relative w-fit mt-[-1.00px] [font-family:'Onest',Helvetica] font-normal text-text-grey text-sm tracking-[-0.28px] leading-5 whitespace-nowrap">
              Team Members
            </div>
          </div>
        </div>

        {/* Main Content */}
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
                    ? "border-[#335bfb] text-primary-color"
                    : "border-[#e1e4ea] text-text-grey"
                  } rounded-none`}
              >
                <span className="[font-family:'Onest',Helvetica] font-medium text-sm tracking-[0] leading-6 whitespace-nowrap">
                  My Profile
                </span>
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`inline-flex items-center justify-center gap-1 p-2.5 relative flex-[0_0_auto] border-b-2 ${activeTab === "password"
                    ? "border-[#335bfb] text-primary-color"
                    : "border-[#e1e4ea] text-text-grey"
                  } rounded-none`}
              >
                <span className="[font-family:'Onest',Helvetica] font-medium text-sm tracking-[0] leading-6 whitespace-nowrap">
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
                      <button className="px-4 py-2 bg-[#335BFB] text-white rounded-lg">
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
                      <button className="px-4 py-2 bg-[#335BFB] text-white rounded-lg">
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
      </div>
    </div>
  );
};

export default SettingsPage;