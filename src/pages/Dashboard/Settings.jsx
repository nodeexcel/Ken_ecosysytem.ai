import { CreditCardIcon, EllipsisVertical, EyeIcon, EyeOffIcon, SettingsIcon, UsersIcon, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import profile_pic from '../../assets/images/profile.png';
import edit_icon from '../../assets/images/edit_icon.svg';
import { LuRefreshCw } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";
import Plan from "../../components/Plan";
import { useDispatch, useSelector } from "react-redux";
import { deleteProfile, getProfile, updateProfile } from "../../api/profile";
import { updatePassword } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { getTeamMembers, sendInviteEmail } from "../../api/teamMember";
import TransactionHistory from "../../components/TransactionHistory";
import { Delete, Edit, LeftArrow, PasswordLock, PlanIcon, Settings, TeamMemberIcon } from "../../icons/icons";
import { discardData } from "../../store/profileSlice";
import { SelectDropdown } from "../../components/Dropdown";
import { FaChevronDown } from "react-icons/fa";


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
  const countryData = useSelector((state) => state.country.data)
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
  const [selectedCountry, setSelectedCountry] = useState(countryData[240]);

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [success, setSuccess] = useState({})
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [teamMembersData, setTeamMembersData] = useState({})
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const countryRef = useRef()


  const token = useSelector((state) => state.auth.token);

  const [updateLoading, setUpdateLoading] = useState(false)

  const userDetails = useSelector((state) => state.profile)


  useEffect(() => {
    if (token && !userDetails.loading) {
      if (userDetails?.user.phoneNumber === null) {
        setProfileFormData(userDetails?.user)
      } else {
        const formatPhoneNumber = extractPhoneDetails(userDetails?.user.phoneNumber)
        const formatedData = { ...userDetails?.user, phoneNumber: formatPhoneNumber.number }
        const filterCountryCode = countryData.filter((e) => e.dial_code === formatPhoneNumber.countryCode)
        setSelectedCountry(filterCountryCode[0])
        setProfileFormData(formatedData)
      }
      renderTeamMembers()
    }

  }, [token, !userDetails.loading])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [open, setOpen] = useState(false);
  const [emailInvite, setEmailInvite] = useState("")
  const [emailInviteRole, setEmailInviteRole] = useState("Member")
  const [role, setRole] = useState("All")
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState({})
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false)
  const [inviteErrors, setInviteErrors] = useState({ email: "", limit: "" });
  const [inviteEmailLoading, setInviteEmailLoading] = useState(false)
  const [teamMembersDataMessage, setTeamMembersDataMessage] = useState("")
  const [teamMembersDataLoading, setTeamMembersDataLoading] = useState(true);
  const [modalStatus, setModalStatus] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false)

  const users = useSelector((state) => state.auth);

  const roleOptions = [{ label: "All", key: "All" }, { label: "Admin", key: "Admin" }, { label: "Member", key: "Member" }, { label: "Guest", key: "Guest" }]
  const roleEmailOptions = [{ label: "Admin", key: "Admin" }, { label: "Member", key: "Member" }, { label: "Guest", key: "Guest" }]

  useEffect(() => {
    setTimeout(() => {
      setSuccess({})
    }, 5000)
  }, [success])

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage({})
    }, 5000)
  }, [errorMessage])

  useEffect(() => {
    if (filteredMembers?.length > 0) {
      setTeamMembersDataLoading(false)
    }

  }, [filteredMembers])

  const validateForm = () => {
    const newErrors = {};

    if (profileFormData.firstName === null) newErrors.firstName = "First Name is required.";
    if (profileFormData.lastName === null) newErrors.lastName = "Last Name is required.";
    if (profileFormData.phoneNumber === null) newErrors.phoneNumber = "Phone Number is required.";
    if (profileFormData.company === null) newErrors.company = "Company is required.";
    if (profileFormData.city === null) newErrors.city = "City is required.";
    if (profileFormData.country === null) newErrors.country = "Country is required.";
    if (profileFormData.image === null && !profileFormData.imageFile) newErrors.imageFile = "Profile Image is required.";

    return newErrors;
  };

  const renderTeamMembers = async () => {
    setTeamMembersDataMessage("")
    setTeamMembersDataLoading(true)
    try {
      const response = await getTeamMembers()

      if (response?.status === 200) {
        setTeamMembersData(response?.data?.data)
        if (response?.data?.data?.membersData?.length == 0) {
          setTeamMembersDataLoading(false)
          setTeamMembersDataMessage("No Data Found")
        } else {
          setFilteredMembers(response?.data?.data?.membersData)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

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
    setProfileErrors((prev) => ({
      ...prev, [name]: ""
    }))
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileErrors((prev) => ({
      ...prev, imageFile: ""
    }))
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setProfileFormData((prev) => ({
        ...prev,
        imagePath: imageUrl,
        imageFile: file, // Optional: for uploading to backend later
      }));
    }
  };

  const extractPhoneDetails = (phoneNumber) => {
    const regex = /^(\+\d+)\s*(\d+)$/;
    const match = phoneNumber.match(regex);

    if (match) {
      const countryCode = match[1];
      const number = match[2];
      return { countryCode, number };
    }
    return { countryCode: "", number: "" };
  };


  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setProfileErrors(validationErrors);
      console.log("Validation errors:", validationErrors);
      return;
    }
    console.log('Profile data to update:', profileFormData);
    try {
      setUpdateLoading(true)
      const updatedForm = { ...profileFormData, phoneNumber: `${selectedCountry.dial_code} ${profileFormData.phoneNumber}` }
      const formData = new FormData();
      Object.entries(updatedForm).forEach(([key, value]) => {
        if (key === 'imageFile' && value) {
          formData.append('file', value);
        } else if (key !== "imagePath") {
          formData.append(key, value);
        }
      });
      const response = await updateProfile(formData, token)
      console.log(response)
      if (response?.status === 200) {
        dispatch(discardData())
        setSuccess((prev) => ({ ...prev, profile: response?.data?.message }))
      } else {
        setErrorMessage((prev) => ({ ...prev, profile: response?.data?.message }))
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

        const response = await updatePassword(payload)
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

  const handleInvite = async () => {
    const newErrors = { email: "", limit: "" };
    setInviteErrors(newErrors)

    if ((teamMembersData?.teamSize - teamMembersData?.teamMembers) === 0) {
      newErrors.limit = `You’ve reached the limit for your plan (${teamMembersData?.teamSize} members).`;
    }
    if (!emailInvite || !emailInvite.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }

    // If there are errors, set them and return early
    if (newErrors.email || newErrors.limit) {
      setInviteErrors(newErrors);
      return;
    }

    try {
      setInviteEmailLoading(true)
      const payload = {
        email: emailInvite,
        role: emailInviteRole
      }
      const response = await sendInviteEmail(payload)
      console.log(response)
      if (response?.status === 200) {
        setSuccess({ emailInvite: response?.data?.message })
        setEmailInvite("")
        setEmailInviteRole("Member")
        setInviteErrors({ email: "", limit: "" });
      } else {
        setInviteErrors((prev) => ({
          ...prev, inviteError: response?.response?.data?.message
        }))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setInviteEmailLoading(false)
    }
  }

  const handleInviteTeam = () => {
    if (userDetails?.user?.subscriptionType === "pro") {
      setActiveSidebarItem("billing")
      setShowPlanPopup(true)
    } else {
      setOpen(true)
    }
  }

  const handleDeleteProfile = async () => {
    try {
      const response = await deleteProfile();
      console.log(response)
      if (response.status === 200) {
        localStorage.clear()
        navigate("/")
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleSelect = (value) => {
    if (userDetails?.user?.isProfileComplete === false) {
      setModalStatus(true)
    } else {
      setActiveSidebarItem(value)
    }
  }

  const handleChangeRole = (value) => {
    setRole(value);
    if (value !== "All") {
      const filterData = teamMembersData?.membersData?.filter((e) => e.role === value)
      setFilteredMembers(filterData)
    } else {
      setFilteredMembers(teamMembersData?.membersData)
    }
  }

  const renderMainContent = () => {
    if (activeSidebarItem === "billing") {
      return (
        <div className="flex py-3 pr-4 flex-col w-full gap-6">
          <Plan teamMembersData={teamMembersData} setActiveSidebarItem={setActiveSidebarItem} showPlanPopup={showPlanPopup} setShowPlanPopup={setShowPlanPopup} />
        </div>
      );
    }

    else if (activeSidebarItem === "team") {
      return (
        <>
          <div className="w-full py-4 flex flex-col gap-3 pr-4">
            <div className="flex justify-between">
              <h1 className="text-[#1E1E1E] font-semibold text-[20px] md:text-[24px]">Team Members</h1>
              <button className="bg-[#5E54FF] text-white rounded-md text-[14px] md:text-[16px] p-2" onClick={handleInviteTeam}>Invite A Team Member</button>
            </div>
            <div className="flex justify-between">
              <SelectDropdown
                name="role"
                options={roleOptions}
                value={role}
                onChange={(updated) => {
                  handleChangeRole(updated)
                }}
                placeholder="Select"
                className="w-[157px]"
                extraName="Role"
              />
              <div onClick={renderTeamMembers} className="flex items-center px-3 gap-2 cursor-pointer bg-white border border-[#E1E4EA] rounded-[8px] py-[8px]">
                <img src="/src/assets/svg/refresh.svg" alt="" />
                <button className="text-[16px] cursor-pointer text-[#5A687C]">
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

                  {teamMembersDataLoading ? <tr className='h-34'><td></td><td></td><td><span className='loader' /></td></tr> : teamMembersDataMessage ? <tr className='h-34'><td></td><td></td><td>{teamMembersDataMessage}</td></tr> : <>{filteredMembers?.length > 0 ? filteredMembers?.map((user, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3 border-l-1 border-t-1 border-b-1 border-[#E1E4EA] rounded-l-lg">
                        <div className="w-10 h-10 p-2 bg-[#EBEFFF] text-[#5E54FF] rounded-xl flex items-center justify-center font-[600] text-[16px]">
                          {user.firstName !== null ? user.firstName[0] : user.email[0]}{""}{user.lastName !== null && user.lastName[0]}
                        </div>
                        <span className="font-[600] text-[16px] text-[#1E1E1E]">{user.firstName !== null && user.firstName}{" "}{user.lastName !== null && user.lastName}</span>
                      </td>
                      <td className="px-6 py-4 text-[16px] font-[400] text-[#5A687C] border-t-1 border-b-1 border-[#E1E4EA]">{user.email}</td>
                      <td className="px-6 py-4 text-[16px] font-[400] text-[#5A687C] border-t-1 border-b-1 border-[#E1E4EA]">{user.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r-1 border-t-1 border-b-1 rounded-r-lg border-[#E1E4EA]">
                        {/* <select
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
                        </select> */}
                      </td>
                      <td className="px-6 py-4 text-left bg-[#FAFBFD]">
                        <button
                          onClick={() => handleDropdownClick(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <EllipsisVertical />
                        </button>
                        {activeDropdown === index && (
                          <div className="absolute right-6 px-2  w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                            <div className="py-1">
                              <button
                                className="block group w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF]"
                                onClick={() => {
                                  // Handle edit action
                                  setActiveDropdown(null);
                                }}
                              >
                                <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>Edit</span> </div>
                              </button>
                              <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                              <div className="py-2">
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#F4F5F6] hover:rounded-lg"
                                  onClick={() => {
                                    // Handle delete action
                                    setActiveDropdown(null);
                                  }}
                                >
                                  <div className="flex items-center gap-2">{<Delete />} <span>Delete</span> </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )) : <tr className='h-34'><td></td><td></td><td>No Data Found</td></tr>}</>}
                </tbody>
              </table>
            </div>

          </div>

          {open && (
            <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
              <div className="bg-white max-h-[364px] flex flex-col gap-3 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
                <button
                  onClick={() => {
                    setInviteErrors({})
                    setOpen(false)
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-[#1E1E1E] font-semibold text-[20px] mb-2">Invite a team member</h2>

                <div>
                  <label className="block text-[14px] font-medium text-[#292D32] mb-1">Email Address</label>
                  <div className="flex items-center border border-[#E1E4EA] focus-within:border-[#675FFF] rounded-[8px] px-4 py-2">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={emailInvite}
                      onChange={(e) => {
                        setEmailInvite(e.target.value)
                        setInviteErrors({})
                      }}
                      className="w-full focus:outline-none"
                    />
                  </div>
                  {inviteErrors.email && <p className="text-sm text-red-500 mt-1">{inviteErrors.email}</p>}
                  <label className="block my-2 text-[14px] font-medium text-[#292D32]">Invite as</label>
                  < SelectDropdown
                    name="role_options"
                    options={roleEmailOptions}
                    value={emailInviteRole}
                    onChange={(updated) => {
                      setEmailInviteRole(updated)
                    }}
                    placeholder="Select"
                    className=""
                  />
                </div>

                {inviteErrors.limit && <p className="text-sm text-red-500 mt-1">{inviteErrors.limit}</p>}
                {inviteErrors.inviteError && <p className="text-sm text-red-500 mt-1">{inviteErrors.inviteError}</p>}
                {success.emailInvite && <p className="text-sm text-green-500 mt-1">{success.emailInvite}</p>}

                <div className="flex gap-2 mt-3">
                  <button onClick={() => {
                    setOpen(false)
                    setInviteErrors({})
                  }} className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                    Close
                  </button>
                  <button onClick={handleInvite} className={`w-full text-[16px] text-white rounded-[8px] ${inviteEmailLoading ? "bg-[#5f54ff98]" : " bg-[#5E54FF]"} h-[38px]`}>
                    {inviteEmailLoading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Invite"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    else if (activeSidebarItem === "transaction-history") {
      return <TransactionHistory />
    }

    return (
      <div className="flex flex-col py-4 pr-4 w-full items-start gap-5 relative ">
        {/* Header */}
        <div className="flex flex-col items-start gap-[23px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-semibold text-[#1e1e1e] text-xl sm:text-2xl tracking-[0] leading-8 whitespace-nowrap">
                <h1 className="text-[20px] sm:text-[24px] font-[600]">
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
        <div className="w-full pr-4">
          <div className="flex items-start relative self-stretch w-full flex-[0_0_auto] border-b border-[#e1e4ea]">
            <button
              onClick={() => setActiveTab("profile")}
              className={`inline-flex items-center justify-center gap-1 p-2.5 relative flex-[0_0_auto] border-b-2 ${activeTab === "profile"
                ? "border-[#5E54FF] text-primary-color"
                : "border-[#e1e4ea] text-text-grey"
                } rounded-none`}
            >
              <span className={`text-[14px] inter font-medium text-sm tracking-[0] leading-6 whitespace-nowrap ${activeTab === "profile" ? "text-[#675FFF]"
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
              <span className={`inter font-medium text-sm tracking-[0] leading-6 whitespace-nowrap ${activeTab === "password" ? "text-[#5E54FF]"
                : "text-[#5A687C] "}`}>
                Change Password
              </span>
            </button>
          </div>

          {activeTab === "profile" && (
            <div className="mt-5">
              <div className="w-full rounded-2xl">
                <div className="flex flex-col justify-center gap-[26px] py-4 relative">
                  {/* Profile Avatar */}
                  <div className="relative flex">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden">
                      <img
                        src={profileFormData.imagePath || profileFormData.image || profileData.avatar}
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
                      onChange={handleImageUpload}
                    />

                    <button
                      type="button"
                      onClick={() => document.getElementById('profileImageInput').click()}
                      className="absolute top-[55px] ml-15 sm:top-[65px] bg-[#675FFF] rounded-full cursor-pointer w-[31px] h-[31px] p-[7px]"
                    >
                      <img className="w-[17px] h-[17px]" alt="Edit" src='/src/assets/svg/edit.svg' />
                    </button>
                  </div>
                  {profileErrors.imageFile && <p className="text-[#FF3B30]">{profileErrors.imageFile}</p>}

                  {/* Profile Form */}
                  <div className="flex flex-col items-start gap-4 relative self-stretch w-full text-[#1E1E1E]">

                    {/* Name Fields */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-[17px] relative self-stretch w-full">
                      {["firstName", "lastName"].map((field, i) => (
                        <div key={field} className="flex flex-col items-start gap-1.5 relative flex-1 grow w-full">
                          <label className="font-medium text-text-black text-sm leading-5">
                            {field === "firstName" ? "First Name" : "Last Name"}
                          </label>
                          <input
                            type="text"
                            name={field}
                            value={profileFormData[field] === "null" ? '' : profileFormData[field]}
                            placeholder={`Enter ${field === "firstName" ? "First Name" : "Last Name"}`}
                            onChange={handleProfileChange}
                            className={`w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid ${profileErrors[field] ? 'border-[#FF3B30]' : 'border-[#e1e4ea]'} text-[16px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none`}
                          />
                          {profileErrors[field] && <p className="text-[#FF3B30] py-1">{profileErrors[field]}</p>}
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
                          value={profileFormData.email === "null" ? '' : profileFormData.email}
                          disabled
                          className="w-full px-3.5 py-2.5 bg-[#E1E4EA] rounded-lg border border-solid border-[#e1e4ea]  text-[16px] text-[#5A687C]"
                        />
                      </div>
                      {/* <div className="flex flex-col items-start gap-1.5 relative flex-1 grow w-full">
                        <label className="font-medium text-sm text-text-black">Phone No</label>
                        <input
                          type="text"
                          name="phoneNumber"
                          value={profileFormData.phoneNumber === "null" ? '' : profileFormData.phoneNumber}

                          onChange={handleProfileChange}
                          className={`w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid ${profileErrors.phoneNumber ? 'border-[#FF3B30]' : 'border-[#e1e4ea]'}  text-[16px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none`}
                        />
                        {profileErrors.phoneNumber && <p className="text-[#FF3B30] py-1">{profileErrors.phoneNumber}</p>}
                      </div> */}
                      <div className=" flex-1 grow w-full">
                        <label className="text-[14px] text-[#1E1E1E] font-[500] block mb-1">
                          Phone No
                        </label>
                        <div ref={countryRef} className={`flex group items-center bg-white focus-within:border-[#675FFF] gap-2 border ${profileErrors.phoneNumber ? 'border-[#FF3B30]' : 'border-[#e1e4ea]'} rounded-lg px-4 py-1.5`}>
                          <div className="relative">
                            <button
                              onClick={() => setIsOpen(!isOpen)}
                              className="w-[120px] flex hover:cursor-pointer relative border-none justify-between gap-1 items-center border py-1 text-left"
                            >
                              <div className="flex items-center gap-2 mr-3">
                                <p className={`fi fi-${selectedCountry.flag} fis w-4 h-4 rounded-full`}></p>
                                <p className="text-[#5A687C] font-[400] text-[16px]">{selectedCountry.dial_code}</p>
                              </div>
                              <FaChevronDown color="#5A687C" className={`w-[10px]  transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                              <hr style={{ color: "#E1E4EA", width: "22px", transform: "rotate(-90deg)" }} />
                            </button>
                            {isOpen && (
                              <div className="absolute px-1 z-10 rounded-md shadow-lg border border-gray-200 max-h-40 overflow-auto top-6 w-full left-[-13px] bg-white mt-1">
                                {countryData.map((country) => (
                                  <div
                                    key={country.code}
                                    onClick={() => {
                                      setSelectedCountry(country);
                                      setIsOpen(false);
                                      // setAddNewContact((prev) => ({ ...prev, phoneCode: country.dial_code }));
                                    }}
                                    className={`flex px-2 gap-2 hover:bg-[#F4F5F6] hover:rounded-lg my-1 py-2 ${selectedCountry?.code === country?.code && 'bg-[#F4F5F6] rounded-lg'} cursor-pointer flex items-center`}
                                  >
                                    <p className={`fi fi-${country.flag} fis w-4 h-4 rounded-full`}></p>
                                    <p className="text-[#5A687C] font-[400] text-[16px]">{country.dial_code}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={profileFormData.phoneNumber === "null" ? '' : profileFormData.phoneNumber}
                            onChange={handleProfileChange}
                            placeholder="Enter Phone Number"
                            className="w-full outline-none"
                          // onChange={(e) => {
                          //   setNumber(e.target.value);
                          //   setError((prev) => ({ ...prev, number: "" }));
                          // }}
                          />
                        </div>
                        {profileErrors.phoneNumber && <p className="text-[#FF3B30] py-1">{profileErrors.phoneNumber}</p>}
                      </div>
                    </div>

                    {/* Company Fields */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-[17px] relative self-stretch w-full">
                      <div className="flex flex-col items-start gap-1.5 relative flex-1 grow w-full">
                        <label className="font-medium text-sm text-text-black">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={profileFormData.company === "null" ? '' : profileFormData.company}
                          placeholder="Enter Company"
                          onChange={handleProfileChange}
                          className={`w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid ${profileErrors.company ? 'border-[#FF3B30]' : 'border-[#e1e4ea]'}  text-[16px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none`}
                        />
                        {profileErrors.company && <p className="text-[#FF3B30] py-1">{profileErrors.company}</p>}
                      </div>
                      <div className="flex flex-col items-start gap-1.5 relative flex-1 grow w-full">
                        <label className="font-medium text-sm text-text-black">
                          Role
                        </label>
                        <input
                          name="role"
                          disabled
                          value={profileFormData.role === "null" ? '' : profileFormData.role}
                          className="w-full px-3.5 py-2.5 bg-[#E1E4EA] rounded-lg border border-solid border-[#e1e4ea]  text-[16px] text-[#5A687C]"
                        />
                        {/* <select
                          name="role"
                          value={profileFormData.role}
                          onChange={handleProfileChange}

                          className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] shadow-shadows-shadow-xs text-base text-text-black leading-6"
                        >
                          <option value="" disabled>Role</option>
                          <option value="Admin">Admin</option>
                          <option value="Member">Member</option>
                          <option value="Guest">Guest</option>
                        </select> */}
                      </div>
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
                            value={profileFormData[field] === "null" ? '' : profileFormData[field]}
                            placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                            onChange={handleProfileChange}
                            className={`w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid ${profileErrors[field] ? 'border-[#FF3B30]' : 'border-[#e1e4ea]'} text-[16px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none`}
                          />
                          {profileErrors[field] && <p className="text-[#FF3B30] py-1">{profileErrors[field]}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {errorMessage.profile && <p className="text-sm text-red-500 mt-1">{errorMessage.profile}</p>}
                  {success.profile && <p className="text-sm text-green-500 mt-1">{success.profile}</p>}


                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        disabled={updateLoading}
                        onClick={handleProfileSubmit}
                        className={`sm:w-auto px-4 py-2 ${updateLoading ? "bg-[#5f54ff87]" : "bg-[#5E54FF]"} text-white text-[16px] rounded-lg`}
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
                      {/* <button
                        type="button"
                        onClick={() => {
                          dispatch(discardData())
                        }}
                        className="px-4 py-2 bg-[#f5f7ff] text-[#5A687C] text-[16px] border-[1.5px] border-[#E1E4EA] rounded-lg"
                      >
                        Cancel
                      </button> */}
                    </div>
                    <div>
                      <button onClick={() => setDeleteModalStatus(true)} className="w-full text-[13px] font-[500] bg-transparent text-[#5A687C]">
                        Delete Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          )}

          {activeTab === "password" && (
            <div className="mt-5">
              <div className="w-full">
                <div className="flex flex-col items-start gap-6 py-4">
                  {/* <div className="flex flex-col items-start gap-1">
                    <h2 className="font-semibold text-text-black text-lg leading-7">
                      Change Password
                    </h2>
                    <p className="text-text-grey text-sm leading-5">
                      Please enter your current password to change your password
                    </p>
                  </div> */}

                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-medium text-text-black text-sm leading-5">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
                          <PasswordLock />
                        </div>
                        <input
                          type={showPasswords.currentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] text-[16px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none"
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
                      <label className="font-medium text-text-black text-sm leading-5">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
                          <PasswordLock />
                        </div>
                        <input
                          type={showPasswords.newPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] text-[16px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none"
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
                      <label className="font-medium text-text-black text-sm leading-5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
                          <PasswordLock />
                        </div>
                        <input
                          type={showPasswords.confirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg border border-solid border-[#e1e4ea] text-[16px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none"
                          placeholder="Confirm password"
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
                    {/* <button onClick={() => setFormData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })} className="w-full sm:w-auto px-4 py-2 bg-[#f5f7ff] text-text-grey border border-[#5a687c] rounded-lg">
                      Cancel
                    </button> */}
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
    <div className="w-full overflow-auto">
      {/* <div>
        <div className='flex items-center pl-4 py-3' onClick={() => navigate("/dashboard")}>
          <MdOutlineKeyboardArrowLeft size={25} />
          <h1 className="text-[26px] font-bold pb-1">Settings</h1>
        </div>
        <hr className='text-[#E1E4EA]' />
      </div> */}
      <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full">
        {/* Sidebar Navigation */}
        <div className="flex flex-col bg-white gap-8 border-r border-[#E1E4EA] w-[272px] h-full">
          <div className=''>
            <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => navigate("/dashboard")}>
              {/* <MdOutlineKeyboardArrowLeft size={25} /> */}
              <div className="flex gap-4 pl-5 items-center h-[57px]">
                <LeftArrow />
                <h1 className="text-[20px] font-[600]">Settings</h1>
              </div>
            </div>
            <hr className='text-[#E1E4EA]' />
          </div>
          <div className="flex inter flex-col w-full px-2 items-start gap-2 relative">
            <div
              onClick={() => handleSelect("general")}
              className={`flex group justify-center md:justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "general" ? "bg-[#F0EFFF]" : "hover:bg-[#F9F8FF]"
                }`}
            >
              {activeSidebarItem === "general" ? <Settings status={activeSidebarItem === "general"} /> : <div className="flex items-center gap-2"><div className='group-hover:hidden'>{<Settings status={activeSidebarItem === "general"} />}</div> <div className='hidden group-hover:block'>{<Settings hover={true} />}</div></div>}
              <span className={`font-[400] text-[16px] ${activeSidebarItem === "general" ? "text-[#675FFF]" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                General Settings
              </span>
            </div>

            <div
              onClick={() => handleSelect("billing")}
              className={`flex group justify-center md:justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "billing" ? "bg-[#EDF3FF]" : "hover:bg-[#F9F8FF]"
                }`}
            >
              {activeSidebarItem === "billing" ? <PlanIcon status={activeSidebarItem === "billing"} /> :
                <div className="flex items-center gap-2"><div className='group-hover:hidden'>{<PlanIcon status={activeSidebarItem === "billing"} />}</div> <div className='hidden group-hover:block'>{<PlanIcon hover={true} />}</div></div>}
              <span className={`font-[400] text-[16px] ${activeSidebarItem === "billing" ? "text-[#675FFF]" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                Plan &amp; Billing
              </span>
            </div>

            <div
              onClick={() => handleSelect("team")}
              className={`flex group justify-center md:justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "team" ? "bg-[#EDF3FF]" : "hover:bg-[#F9F8FF]"
                }`}
            >
              {activeSidebarItem === "team" ? <TeamMemberIcon status={activeSidebarItem === "team"} /> :
                <div className="flex items-center gap-2"><div className='group-hover:hidden'><TeamMemberIcon status={activeSidebarItem === "team"} /></div> <div className='hidden group-hover:block'><TeamMemberIcon hover={true} /></div></div>}
              <span className={`font-[400] text-[16px] ${activeSidebarItem === "team" ? "text-[#675FFF]" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                Team Members
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full h-full overflow-x-hidden py-3">
          {renderMainContent()}
        </div>
      </div>
      {modalStatus && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-[514px] p-6 relative shadow-lg">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => {
              setModalStatus(false)
            }}
          >
            <X size={20} />
          </button>

          <div className='h-[120px] flex flex-col justify-around gap-2 items-center '>
            <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-1">
              Please complete your profile first
            </h2>
            <button
              className="bg-[#675FFF] text-white px-5 py-2 font-[500] test-[16px]  rounded-lg"
              onClick={() => setModalStatus(false)}
            >
              Ok
            </button>
          </div>
        </div>
      </div>}
      {deleteModalStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-[514px] p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setDeleteModalStatus(false)
              }}
            >
              <X size={20} />
            </button>

            <div className="flex flex-col justify-around h-[150px] text-center">
              <h2 className="text-[20px] font-semibold text-[#1E1E1E] mb-4">
                Are you sure you want to delete your profile?
              </h2>
              <div className="flex gap-4 mt-2 w-full">
                <button
                  className="w-full bg-[#FF3B30] text-white px-5 py-2 font-[500] test-[16px]  rounded-lg"
                  onClick={handleDeleteProfile}
                >
                  Confirm Delete
                </button>
                <button
                  className="w-full bg-white text-[#5A687C] border-[1.5px] border-[#E1E4EA] font-[500] test-[16px] px-5 py-2 rounded-lg"
                  onClick={() => setDeleteModalStatus(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;