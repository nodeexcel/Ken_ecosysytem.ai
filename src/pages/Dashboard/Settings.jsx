import { CreditCardIcon, EllipsisVertical, EyeIcon, EyeOffIcon, SettingsIcon, UsersIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import profile_pic from '../../assets/images/profile.png';
import edit_icon from '../../assets/images/edit_icon.svg';
import { LuRefreshCw } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";
import Plan from "../../components/Plan";
import { useSelector } from "react-redux";
import { getProfile, updateProfile } from "../../api/profile";
import { updatePassword } from "../../api/auth";
import { useNavigate } from "react-router-dom";


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
  avatar: profile_pic,
};

const tableData = [
  {
    initials: 'RD',
    name: 'Robert Downey',
    email: 'robertdowney45@gmail.com',
    role: 'Admin',
    assigned: ['Liam'],
  },
  {
    initials: 'NC',
    name: 'Nicolas Cage',
    email: 'nicolascage88@gmail.com',
    role: 'Member',
    assigned: ['Daniel', 'Criss'],
  },
  {
    initials: 'JD',
    name: 'Johny Deep',
    email: 'johnydeep86@gmail.com',
    role: 'Member',
    assigned: ['Kenneth', 'Lori'],
  },
  {
    initials: 'JM',
    name: 'Jecob More',
    email: 'jecobmore56542@gmail.com',
    role: 'Guest',
    assigned: ['Kurt'],
  },
]


const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [activeSidebarItem, setActiveSidebarItem] = useState("general");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileFormData, setProfileFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
    role: "",
    city: "",
    country: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [success, setSuccess] = useState({})
  const navigate = useNavigate()


  const token = localStorage.getItem('token');

  const [updateLoading, setUpdateLoading] = useState(false)

  const userDetails = useSelector((state) => state.profile)


  useEffect(() => {
    if (token && !userDetails.loading) {
      setProfileFormData(userDetails?.user)
    }

  }, [token, !userDetails.loading])


  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [open, setOpen] = useState(false);
  const [emailInvite, setEmailInvite] = useState("")
  const [role, setRole] = useState("")
  const [isEditing, setIsEditing] = useState(false);
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false)

  const users = useSelector((state) => state.auth)

  useEffect(() => {
    setTimeout(() => {
      setSuccess({})
    }, 5000)
  }, [success])

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev, [name]: ''
    }))
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setProfileFormData((prev) => ({
        ...prev,
        image: imageUrl,
        imageFile: file, // Optional: for uploading to backend later
      }));
    }
  };


  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    console.log('Profile data to update:', profileFormData);
    try {
      setUpdateLoading(true)
      const formData = new FormData();
      Object.entries(profileFormData).forEach(([key, value]) => {
        if (key === 'imageFile' && value) {
          formData.append('file', value);
        } else if (key !== 'image') {
          formData.append(key, value);
        }
      });
      const response = await updateProfile(formData, token)
      console.log(response)
      if (response?.status === 200) {
        setIsEditing(false)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setUpdateLoading(false)
    }
  };

  const handleChangePassword = async () => {

    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    let hasError = false;

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      hasError = true;
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
      hasError = true;
    }

    if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      try {
        setUpdatePasswordLoading(true)
        const payload = {
          email: profileFormData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }

        const response = await updatePassword(payload, token)
        console.log(response)
        if (response?.status === 200) {
          setSuccess({ passwordSuccess: response?.data?.message })
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          })
        } else {
          setErrors((prev) => ({
            ...prev, newError: response?.response?.data?.message
          }))
        }

      } catch (error) {
        console.log(error)
      } finally {
        setUpdatePasswordLoading(false)
      }
    }
  };


  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleDropdownClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const renderMainContent = () => {
    if (activeSidebarItem === "billing") {
      return (
        <div className="flex flex-col w-full gap-6">
          <Plan />
        </div>
      );
    }

    else if (activeSidebarItem === "team") {
      return (
        <>
          <div className="w-full p-2 flex flex-col gap-3 px-2">
            <div className="flex justify-between">
              <h1 className="text-[#1E1E1E] font-semibold text-[20px] md:text-[24px]">Team Members</h1>
              <button className="bg-[#5E54FF] text-white rounded-md text-[14px] md:text-[16px] p-2" onClick={() => setOpen(true)}>Invite A Team Member</button>
            </div>
            <div className="flex justify-between">
              <div className="w-[137px] flex items-center border border-gray-300 rounded-lg ">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white px-4 py-2 rounded-lg "
                >
                  <option value="" disabled>Role</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
              <div className="flex items-center px-3 gap-2 border border-[#E1E4EA] rounded-[8px] h-[38px]">
                <LuRefreshCw color="#5E54FF" />
                <button className="text-[16px] text-[#5A687C]">
                  Refresh
                </button>
              </div>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead className="bg-transparent">
                  <tr>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#5A687C]">Name</th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#5A687C]">Email</th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#5A687C]">Role</th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#5A687C]">Agents</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className=" rounded-lg">
                  {tableData.map((user, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2 border-l-1 border-t-1 border-b-1 border-[#E1E4EA] rounded-l-lg">
                        <div className="w-8 h-8 bg-[#E8E9FF] text-[#5E54FF] rounded-full flex items-center justify-center font-semibold text-sm">
                          {user.initials}
                        </div>
                        <span className="font-medium text-[#1E1E1E]">{user.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-t-1 border-b-1 border-[#E1E4EA]">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-t-1 border-b-1 border-[#E1E4EA]">{user.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r-1 border-t-1 border-b-1 rounded-r-lg border-[#E1E4EA]">
                        <select
                          className="w-full bg-white  rounded-md px-2 py-1"
                          value={user.assigned[0]}
                          onChange={(e) => {
                            // Handle agent selection change
                            console.log('Selected agent:', e.target.value);
                          }}
                        >
                          {user.assigned.map((agent, idx) => (
                            <option key={idx} value={agent}>
                              {agent}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-left border-[#E1E4EA] rounded-r-lg bg-[#F6F7F9]">
                        <button
                          onClick={() => handleDropdownClick(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <EllipsisVertical />
                        </button>
                        {activeDropdown === index && (
                          <div className="absolute right-6  w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                            <div className="py-1">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  // Handle edit action
                                  setActiveDropdown(null);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={() => {
                                  // Handle delete action
                                  setActiveDropdown(null);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
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
      <div className="flex flex-col w-full items-start gap-5 relative px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-start gap-[23px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Onest',Helvetica] font-semibold text-[#1e1e1e] text-xl sm:text-2xl tracking-[0] leading-8 whitespace-nowrap">
                <h1 className="text-[20px] sm:text-[24px] font-[600] onest">
                  General Settings
                </h1>
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
              <span className={`onest text-[14px] font-medium text-sm tracking-[0] leading-6 whitespace-nowrap ${activeTab === "profile" ? "text-[#675FFF]"
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
              <span className={`[font-family:'Onest',Helvetica] font-medium text-sm tracking-[0] leading-6 whitespace-nowrap ${activeTab === "password" ? "text-[#5E54FF]"
                : "text-[#5A687C] "}`}>
                Change Password
              </span>
            </button>
          </div>

          {activeTab === "profile" && (
            <div className="mt-5 bg-white lg:w-[648px]">
              <div className="w-full border border-solid border-[#e1e4ea] rounded-2xl">
                <div className="flex flex-col items-center justify-center gap-[26px] p-4 sm:p-[30px] relative">
                  {/* Profile Avatar */}
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden">
                      <img
                        src={profileFormData.image || profileData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      id="profileImageInput"
                      className="hidden"
                      onChange={isEditing ? handleImageUpload : undefined}
                    />

                    {isEditing && <button
                      type="button"
                      onClick={() => document.getElementById('profileImageInput').click()}
                      className="absolute top-[55px] left-[45px] sm:top-[65px] sm:left-[65px] bg-[#675FFF] rounded-full cursor-pointer w-[31px] h-[31px] p-[7px]"
                    >
                      <img className="w-[17px] h-[17px]" alt="Edit" src='/src/assets/svg/edit.svg' />
                    </button>}
                  </div>

                  {/* Profile Form */}
                  <div className="flex flex-col items-start gap-4 relative self-stretch w-full">

                    {/* Name Fields */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-[17px] relative self-stretch w-full">
                      {["firstName", "lastName"].map((field, i) => (
                        <div key={field} className="flex flex-col items-start gap-1.5 relative flex-1 grow w-full">
                          <label className="[font-family:'Onest',Helvetica] font-medium text-text-black text-sm leading-5">
                            {field === "firstName" ? "First Name" : "Last Name"}
                          </label>
                          <input
                            type="text"
                            name={field}
                            value={profileFormData[field]}
                            readOnly={!isEditing}
                            onChange={handleProfileChange}
                            className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs text-base text-text-black leading-6"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Contact Fields */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-[17px] relative self-stretch w-full">
                      <div className="flex flex-col items-start gap-1.5 relative flex-1 grow w-full">
                        <label className="font-medium text-sm text-text-black">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={profileFormData.email}
                          readOnly
                          className="w-full px-3.5 py-2.5 bg-gray-100 rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs text-base text-text-black leading-6"
                        />
                      </div>
                      <div className="flex flex-col items-start gap-1.5 relative flex-1 grow w-full">
                        <label className="font-medium text-sm text-text-black">Phone No</label>
                        <input
                          type="text"
                          name="phoneNumber"
                          value={profileFormData.phoneNumber}
                          readOnly={!isEditing}
                          onChange={handleProfileChange}
                          className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs text-base text-text-black leading-6"
                        />
                      </div>
                    </div>

                    {/* Company Fields */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-[17px] relative self-stretch w-full">
                      {["company", "role"].map((field) => (
                        <div key={field} className="flex flex-col items-start gap-1.5 relative flex-1 grow w-full">
                          <label className="font-medium text-sm text-text-black">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            type="text"
                            name={field}
                            value={profileFormData[field]}
                            readOnly={!isEditing}
                            onChange={handleProfileChange}
                            className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs text-base text-text-black leading-6"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Location Fields */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-[17px] relative self-stretch w-full">
                      {["city", "country"].map((field) => (
                        <div key={field} className="flex flex-col items-start gap-1.5 relative flex-1 grow w-full">
                          <label className="font-medium text-sm text-text-black">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            type="text"
                            name={field}
                            value={profileFormData[field]}
                            readOnly={!isEditing}
                            onChange={handleProfileChange}
                            className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs text-base text-text-black leading-6"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 relative self-stretch w-full">
                    {!isEditing ? (
                      <button
                        type="button"
                        className="w-full sm:w-auto px-4 py-2 bg-[#5E54FF] text-white rounded-lg"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled={updateLoading}
                          onClick={handleProfileSubmit}
                          className={`w-full sm:w-auto px-4 py-2 ${updateLoading ? "bg-[#5f54ff87]" : "bg-[#5E54FF]"} text-white rounded-lg`}
                        >
                          {updateLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <p>Processing...</p>
                              <span className="loader" />
                            </div>
                          ) : (
                            "Update Profile"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                          }}
                          className="w-full sm:w-auto px-4 py-2 bg-[#f5f7ff] text-text-grey border border-[#5a687c] rounded-lg"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

          )}

          {activeTab === "password" && (
            <div className="mt-5">
              <div className="w-full max-w-[648px] bg-[#fff] border border-solid border-[#e1e4ea] rounded-2xl">
                <div className="flex flex-col items-start gap-6 p-4 sm:p-[30px]">
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
                      {errors.currentPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                      )}
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
                      {errors.newPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                      )}
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
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                  {success.passwordSuccess && (
                    <p className="text-green-500 text-xs mt-1">{success.passwordSuccess}</p>
                  )}
                  {errors.newError && (
                    <p className="text-red-500 text-xs mt-1">{errors.newError}</p>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full">
                    <button onClick={handleChangePassword} disabled={updatePasswordLoading} className={`w-full sm:w-auto px-4 py-2 ${updatePasswordLoading ? "bg-[#5f54ff87]" : "bg-[#5E54FF]"} text-white rounded-lg`}>
                      {updatePasswordLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <p>Processing...</p>
                          <span className="loader" />
                        </div>
                      ) : (
                        " Update Password"
                      )}
                    </button>
                    <button className="w-full sm:w-auto px-4 py-2 bg-[#f5f7ff] text-text-grey border border-[#5a687c] rounded-lg">
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

  if (userDetails?.loading) return <p className='flex justify-center items-center h-full'><span className='loader' /></p>


  return (
    <div className="h-full w-full bg-[#F6F7F9]">
      <div>
        <div className='flex items-center pl-4 py-3' onClick={() => navigate("/dashboard")}>
          <MdOutlineKeyboardArrowLeft size={25} />
          <h1 className="text-[26px] font-bold pb-1">Settings</h1>
        </div>
        <hr className='text-[#E1E4EA]' />
      </div>
      <div className="flex flex-col md:flex-row items-start gap-8 relative pl-4 py-3 w-full">
        {/* Sidebar Navigation */}
        <div className="flex flex-col w-[153px] items-start gap-2 relative">
          <div
            onClick={() => setActiveSidebarItem("general")}
            className={`flex items-center gap-1.5 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "general" ? "bg-[#e1e5ea]" : ""
              }`}
          >
            <SettingsIcon className={`w-4 h-4 ${activeSidebarItem === "general" ? "text-black" : "text-[#5A687C] "
              } `} />
            <div className={`relative w-fit mt-[-1.00px] onest font-normal text-sm tracking-[-0.28px] leading-5 whitespace-nowrap ${activeSidebarItem === "general" ? "text-black" : "text-[#5A687C] "
              }`}>
              General Settings
            </div>
          </div>

          <div
            onClick={() => setActiveSidebarItem("billing")}
            className={`flex items-center gap-1.5 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "billing" ? "bg-[#e1e5ea]" : ""
              }`}
          >
            <CreditCardIcon className={`w-4 h-4 ${activeSidebarItem === "billing" ? "text-black" : "text-[#5A687C] "
              } `} />
            <div className={`relative w-fit mt-[-1.00px] [font-family:'Onest',Helvetica] font-normal text-sm tracking-[-0.28px] leading-5 whitespace-nowrap ${activeSidebarItem === "billing" ? "text-black" : "text-[#5A687C] "
              }`}>
              Plan &amp; Billing
            </div>
          </div>

          <div
            onClick={() => setActiveSidebarItem("team")}
            className={`flex items-center gap-1.5 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "team" ? "bg-[#e1e5ea]" : ""
              }`}
          >
            <UsersIcon className={`w-4 h-4 ${activeSidebarItem === "team" ? "text-black" : "text-[#5A687C] "
              } `} />
            <div className={`relative w-fit mt-[-1.00px] [font-family:'Onest',Helvetica] font-normal text-sm tracking-[-0.28px] leading-5 whitespace-nowrap ${activeSidebarItem === "team" ? "text-black" : "text-[#5A687C] "
              }`}>
              Team Members
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full overflow-x-hidden">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;