import { CheckCircle2, CircleUserRound, CreditCardIcon, EllipsisVertical,Wallet, EyeIcon, EyeOffIcon, House, Pencil, SettingsIcon, Upload, UsersIcon, X, XCircle, UsersRound } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import profile_pic from '../../assets/images/profile.png';
import edit_icon from '../../assets/images/edit_icon.svg';
import { LuRefreshCw } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";
import Plan from "../../components/Plan";
import ManagePlan from "./ManagePlan";
import { useDispatch, useSelector } from "react-redux";
import { deleteProfile, getProfile, updateProfile } from "../../api/profile";
import { updatePassword } from "../../api/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getTeamMembers, removeTeamMember, sendInviteEmail, updateTeamMember } from "../../api/teamMember";
import TransactionHistory from "../../components/TransactionHistory";
import { Delete, Edit, LeftArrow, PasswordLock, PlanIcon, ProfileEditIcon, RefreshIcon, Settings, SuccessIcon, TeamMemberIcon, ThreeDots } from "../../icons/icons";
import { discardData } from "../../store/profileSlice";
import { SelectDropdown } from "../../components/Dropdown";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { BsThreeDots } from "react-icons/bs";
import default_avatar from '../../assets/images/default_avatar.png';

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { set } from "date-fns";
import LightTheme from '../../assets/images/Light-Theme.png'
import DarkTheme from '../../assets/images/Dark-Theme.png'
import SystemTheme from '../../assets/images/Match-System.png'




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

const GENERAL_DEFAULT_SETTINGS = {
  theme: "light",
  language: "English (US)",
  timezone: "GMT +7 (Bangkok, Jakarta)",
  dateFormat: "DD/MM/YYYY",
  pushEnabled: true,
  emailEnabled: true,
};

const THEME_OPTIONS = [
  {
    key: "light",
    label: "Light mode",
    caption: "Crisp bright workspace",
    preview: "from-[#F6F7FF] via-[#FFFFFF] to-[#EEF1FF]",
  },
  {
    key: "dark",
    label: "Darkmode",
    caption: "Low light friendly",
    preview: "from-[#24262F] via-[#1A1C23] to-[#05060A]",
  },
  {
    key: "system",
    label: "Match System",
    caption: "Auto adapts to device",
    preview: "from-[#111322] via-[#2D3151] to-[#FEFEFE]",
  },
];

const LANGUAGE_OPTIONS = ["English (US)", "English (UK)", "French", "Spanish"];
const TIMEZONE_OPTIONS = [
  "GMT +7 (Bangkok, Jakarta)",
  "GMT +5:30 (Delhi)",
  "GMT +1 (Berlin, Paris)",
  "GMT -5 (New York)",
];
const DATE_FORMAT_OPTIONS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD"];




const SettingsPage = () => {

  const countryData = useSelector((state) => state.country.data)
  const [countries, setCountries] = useState(countryData);

  const [activeSidebarItem, setActiveSidebarItem] = useState("my-profile");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedCountry, setSelectedCountry] = useState(countryData && countryData.length > 0 ? countryData[240] : { name: "United States", code: "US", dial_code: "+1", flag: "us" });
  const { t } = useTranslation()

  const [profileFormData, setProfileFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: 'US',
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
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [teamMembersData, setTeamMembersData] = useState({})
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showManagePlan, setShowManagePlan] = useState(false);
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [sidebarStatus, setSideBarStatus] = useState(false)
  const countryRef = useRef()
  const dropdownRef = useRef(null)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorMethod, setTwoFactorMethod] = useState("sms")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      uppercase: false,
      number: false,
      length: false,
    },
  })
  const [generalSettings, setGeneralSettings] = useState(() => ({ ...GENERAL_DEFAULT_SETTINGS }))
  const twoFactorOptions = [
    { key: "sms", title: "SMS Code", description: "Receive a one-time verification code via SMS" },
    { key: "email", title: "Email Code", description: "Get a verification code sent to your email" },
    { key: "app", title: "Authenticator App", description: "Use an authenticator app to generate codes" },
  ]



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
        if (userDetails?.user?.countryCode === "null") {
          const filterData = countryData.filter((e) => e.dial_code === formatPhoneNumber.countryCode)
          console.log(filterData, "filterCountryCode")
          setSelectedCountry(filterData[0])
        } else {
          const filterCountryCode = countryData.filter((e) => e.code === userDetails?.user?.countryCode)
          setSelectedCountry(filterCountryCode[0])
        }
        setProfileFormData(formatedData)
      }
      renderTeamMembers()
    }

  }, [token, !userDetails.loading])

  // Check URL params for manage-plan view
  useEffect(() => {
    const view = searchParams.get('view');
    const tab = searchParams.get('tab');
    if (view === 'manage-plan' && activeSidebarItem === 'billing') {
      setShowManagePlan(true);
    } else if (view !== 'manage-plan') {
      setShowManagePlan(false);
    }
    if (tab === 'billing' && !view) {
      setActiveSidebarItem('billing');
      setShowManagePlan(false);
    }
  }, [searchParams, activeSidebarItem])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any dropdown
      if (activeDropdown !== null) {
        const clickedElement = event.target;
        // Check if click is inside the dropdown menu
        const isDropdownClick = clickedElement.closest('[data-dropdown]');
        // Check if click is on the three dots button or within the table cell containing the dropdown
        const isTriggerClick = clickedElement.closest('td.bg-\\[\\#F7F7F8\\]') ||
          clickedElement.closest('td[class*="bg-[#F7F7F8]"]');

        if (!isDropdownClick && !isTriggerClick) {
          setActiveDropdown(null);
        }
      }
    };

    if (activeDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);


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
  // const [modalStatus, setModalStatus] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false)
  const [successModalStatus, setSuccessModalStatus] = useState('')
  const [editTeamMemberModal, setEditTeamMemberModal] = useState(false)
  const [editMemberFormData, setEditMemberFormData] = useState({
    email: "",
    role: "Member"
  })
  const [editMemberErrors, setEditMemberErrors] = useState({})
  const [updateMemberLoading, setUpdateMemberLoading] = useState(false)

  const users = useSelector((state) => state.auth);

  const roleOptions = [{ label: `${t("settings.tab_3_list.all")}`, key: "All" }, { label: `${t("settings.tab_3_list.admin")}`, key: "Admin" }, { label: `${t("settings.tab_3_list.member")}`, key: "Member" }, { label: `${t("settings.tab_3_list.guest")}`, key: "Guest" }]
  const roleEmailOptions = [{ label: `${t("settings.tab_3_list.admin")}`, key: "Admin" }, { label: `${t("settings.tab_3_list.member")}`, key: "Member" }, { label: `${t("settings.tab_3_list.guest")}`, key: "Guest" }]

  useEffect(() => {
    setTimeout(() => {
      setSuccess({})
    }, 5000)
  }, [success])

  useEffect(() => {
    if (success?.passwordSuccess) {
      setShowPasswordModal(false);
      setPasswordStrength(evaluatePasswordStrength(""));
    }
  }, [success?.passwordSuccess])

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


  function validatePhoneNumber(phoneNumber) {
    try {
      const parsed = parsePhoneNumberFromString(phoneNumber);
      return parsed && parsed.isValid();
    } catch (err) {
      return false;
    }
  }

  const validateForm = () => {
    const newErrors = {};

    if (profileFormData.firstName === null || profileFormData.firstName === "") {
      newErrors.firstName = `${t("settings.tab_1_list.first_name_required")}`;
    } else if (profileFormData.firstName.length > 50) {
      newErrors.firstName = "First name must be at most 50 characters.";
    }

    if (profileFormData.lastName === null || profileFormData.lastName === "") {
      newErrors.lastName = `${t("settings.tab_1_list.last_name_required")}`;
    } else if (profileFormData.lastName.length > 50) {
      newErrors.lastName = "Last name must be at most 50 characters.";
    }
    if (profileFormData.phoneNumber === null || profileFormData.phoneNumber === "") {
      newErrors.phoneNumber = `${t("settings.tab_1_list.phone_required")}`;
    } else if (!validatePhoneNumber(`${selectedCountry.dial_code}${profileFormData.phoneNumber}`)) {
      newErrors.phoneNumber = `${t("brain_ai.invalid_phone_no")}`;
    }

    if (profileFormData.company === null || profileFormData.company === "") {
      newErrors.company = `${t("settings.tab_1_list.company_required")}`;
    } else if (profileFormData.company.length > 50) {
      newErrors.company = "Company must be at most 50 characters.";
    }

    if (profileFormData.city === null || profileFormData.city === "") {
      newErrors.city = `${t("settings.tab_1_list.city_required")}`;
    } else if (profileFormData.city.length > 50) {
      newErrors.city = "City must be at most 50 characters.";
    }

    if (profileFormData.country === null || profileFormData.country === "") {
      newErrors.country = `${t("settings.tab_1_list.country_required")}`;
    } else if (profileFormData.country.length > 50) {
      newErrors.country = "Country must be at most 50 characters.";
    }

    if (profileFormData.image === null && !profileFormData.imageFile) newErrors.imageFile = `${t("settings.tab_1_list.profile_image_required")}`;

    return newErrors;
  };

  const handleGeneralSettingChange = (key, value) => {
    setGeneralSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleResetGeneralSettings = () => {
    setGeneralSettings({ ...GENERAL_DEFAULT_SETTINGS })
    setSuccess((prev) => ({ ...prev, general: "Changes discarded." }))
  }

  const handleSaveGeneralSettings = () => {
    setSuccess((prev) => ({ ...prev, general: "General settings saved." }))
  }

  const renderTeamMembers = async (currentRole = role) => {
    setTeamMembersDataMessage("");
    setTeamMembersDataLoading(true);
    try {
      const response = await getTeamMembers();

      if (response?.status === 200) {
        setTeamMembersData(response?.data?.data);
        if (response?.data?.data?.membersData?.length == 0) {
          setTeamMembersDataLoading(false);
          setTeamMembersDataMessage(`${t("no_data")}`);
          setFilteredMembers([]);
        } else {
          // Filter according to current role
          const allMembers = response?.data?.data?.membersData;
          if (currentRole !== "All") {
            setFilteredMembers(allMembers.filter((e) => e.role === currentRole));
          } else {
            setFilteredMembers(allMembers);
          }
          setTeamMembersDataLoading(false); // Ensure loading is stopped
        }
      } else {
        setTeamMembersDataLoading(false); // Stop loading on error
      }
    } catch (error) {
      setTeamMembersDataLoading(false);
      console.log(error);
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "newPassword") {
      setPasswordStrength(evaluatePasswordStrength(value));
    }
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

  const handleFullNameChange = (value) => {
    const parts = value.split(" ").filter(Boolean);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ");
    setProfileFormData((prev) => ({
      ...prev,
      firstName,
      lastName,
    }));
    setProfileErrors((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
    }));
  };

  const evaluatePasswordStrength = (password) => {
    const requirements = {
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      length: password.length >= 8,
    };
    const score = Object.values(requirements).filter(Boolean).length;
    return { score, requirements };
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
      newErrors.currentPassword = `${t("settings.tab_1_list.current_password_required")}`;
      hasError = true;
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      newErrors.newPassword = `${t("settings.tab_1_list.new_password_required")}`;
      hasError = true;
    }

    if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = `${t("settings.tab_1_list.confirm_password_required")}`;
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
          setSuccessModalStatus('psd')
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
      newErrors.limit = `${t("settings.tab_3_list.invite_error")} (${teamMembersData?.teamSize} ${t("settings.tab_3_list.members")}).`;
    }
    if (!emailInvite || !emailInvite.includes("@")) {
      newErrors.email = `${t("settings.tab_3_list.email_error")}`;
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
        setOpen(false)
        setInviteErrors({ email: "", limit: "" });
        setSuccessModalStatus('inv')
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

  const handleDeleteUser = async () => {
    try {

      const response = await removeTeamMember(userToEdit.id);
      if (response?.status === 200) {
        setSuccess({ emailInvite: response?.data?.message })
        renderTeamMembers()

      }

    } catch (error) {
      console.log(error)
    } finally {
      setActiveDropdown(null);
      setIsDeleteOpen(false);
    }

  }

  const validateEditMemberForm = () => {
    const newErrors = {};

    if (!editMemberFormData.email || !editMemberFormData.email.includes("@")) {
      newErrors.email = `${t("settings.tab_3_list.email_error")}`;
    }

    if (!editMemberFormData.role) {
      newErrors.role = `${t("settings.tab_3_list.role_required")}`;
    }

    setEditMemberErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleUpdateTeamMember = async () => {
    if (!validateEditMemberForm()) {
      return;
    }

    setUpdateMemberLoading(true);
    try {
      const payload = {
        memberId: userToEdit.id,
        role: editMemberFormData.role
      };

      const response = await updateTeamMember(payload);

      if (response?.status === 200) {
        setSuccess({ emailInvite: response?.data?.message });
        setEditTeamMemberModal(false);
        setEditMemberFormData({ email: "", role: "Member" });
        setEditMemberErrors({});
        setUserToEdit(null);
        setActiveDropdown(null);
        renderTeamMembers();
      } else {
        setEditMemberErrors((prev) => ({
          ...prev,
          error: response?.response?.data?.message || `${t("brain_ai.network_connection_error")}`
        }));
      }
    } catch (error) {
      console.log(error);
      setEditMemberErrors((prev) => ({
        ...prev,
        error: `${t("brain_ai.network_connection_error")}`
      }));
    } finally {
      setUpdateMemberLoading(false);
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

  const handleAddSeatsTeam = () => {
    if (userDetails?.user?.subscriptionType === "pro") {
      setShowPlanPopup(true)
    } else {
      setActiveSidebarItem("team")
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
    // if (userDetails?.user?.isProfileComplete === false) {
    //   setModalStatus(true)
    // } else {
    // Reset Manage Plan view when switching sections
    setShowManagePlan(false);
    
    // Update active sidebar item
    setActiveSidebarItem(value);
    
    // Clear or update URL params based on selected section
    if (value === "billing") {
      // When clicking billing, show main Plan & Billing page (not Manage Plan)
      setSearchParams({ tab: 'billing' });
    } else {
      // Clear URL params when switching to other sections
      setSearchParams({});
    }
    // }
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

  const handleSearch = (e) => {



    const searchTerm = e.target.value.toLowerCase().trim();


    if (searchTerm === "") {
      setCountries(countryData);
      return;
    }

    const filteredData = countryData.filter((country) =>
      country.name.toLowerCase().includes(searchTerm) || country.dial_code.includes(searchTerm)
    );
    console.log(filteredData, "filteredData")
    setCountries(filteredData);
  }

  const renderMainContent = () => {
    if (activeSidebarItem === "my-profile") {
      return (
        <div className="flex flex-col pr-4 items-start relative gap-6 w-full px-4 py-4 ">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center sm:justify-between w-full mb-4 gap-4 px-4 py-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1e1e1e] text-[22px]  font-[600] leading-tight">
                My Profile Settings
              </h1>
              <p className="text-[#5A687C] text-[14px] sm:text-[16px] font-[400]">
                Update your personal details, control your preferences, and keep your account secure.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  dispatch(discardData());
                  // Reset form to original values
                  if (userDetails?.user) {
                    if (userDetails?.user.phoneNumber === null) {
                      setProfileFormData(userDetails?.user);
                    } else {
                      const formatPhoneNumber = extractPhoneDetails(userDetails?.user.phoneNumber);
                      const formatedData = { ...userDetails?.user, phoneNumber: formatPhoneNumber.number };
                      if (userDetails?.user?.countryCode === "null") {
                        const filterData = countryData.filter((e) => e.dial_code === formatPhoneNumber.countryCode);
                        setSelectedCountry(filterData[0]);
                      } else {
                        const filterCountryCode = countryData.filter((e) => e.code === userDetails?.user?.countryCode);
                        setSelectedCountry(filterCountryCode[0]);
                      }
                      setProfileFormData(formatedData);
                    }
                  }
                  setProfileErrors({});
                  setErrorMessage({});
                  setSuccess({});
                }}
                className="px-2.5 py-1.5 bg-white border border-[#E1E4EA] rounded-lg text-[#000000] text-[14px] sm:text-[16px] font-[500] cursor-pointer hover:bg-[#F9F8FF] transition-colors whitespace-nowrap"
              >
                Discard
              </button>
              <button
                type="button"
                disabled={updateLoading}
                onClick={handleProfileSubmit}
                className={`px-2.5 py-1.5 rounded-lg text-white text-[14px] sm:text-[16px] font-[500] cursor-pointer transition-colors whitespace-nowrap ${updateLoading ? "bg-[#5f54ff87] cursor-not-allowed" : "bg-[#675FFF] hover:bg-[#5E54FF]"}`}
              >
                {updateLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <p>Processing</p>
                    <span className="loader" />
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>

          </div>
          <hr className="border border-gray-200 w-full px-4 mx-4" />
          <div className="flex flex-col gap-4 w-full">
            {/* Profile Avatar */}


            <div className=" grid md:grid-cols-[40%_60%] gap-4 md:items-center justify-left px-4 py-2">
              <div>
                <h3 className="text-[#1E1E1E] text-[16px] font-[600]">{"Profile Picture"}</h3>
                <p className="text-[#5A687C] text-[14px] font-[400]">
                  Your photo so your teammates can easily recognize you
                </p>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-3 justify-left">

                  {/* Avatar */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-[#E6EAEE]">
                    <img
                      src={
                        profileFormData.imagePath ||
                        profileFormData.image ||
                        default_avatar
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Buttons + Recommended text in ONE stacked div */}
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap gap-2 ">
                      <button
                        type="button"
                        onClick={() => document.getElementById('profileImageInput')?.click()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#675FFF] text-white text-sm font-[500] cursor-pointer hover:bg-[#5E54FF] transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Upload New
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileFormData((prev) => ({
                            ...prev,
                            imagePath: "",
                            image: null,
                            imageFile: null,
                          }));
                          const fileInput = document.getElementById('profileImageInput');
                          if (fileInput) fileInput.value = "";
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E1E4EA] text-black text-sm font-[500] cursor-pointer hover:bg-[#F5F7FF] transition-colors"
                      >
                        <Delete className="w-4 h-4 text-black" />
                        Delete
                      </button>
                    </div>
                    <div className="w-full items-start"><p className="text-xs text-[#5A687C] mt-2 ">
                      Recommended 400×400px, Max 5MB
                    </p>
                    </div>
                    {/* Text directly under buttons */}

                  </div>
                </div>
              </div>

            </div>

            {profileErrors.imageFile && <p className="text-[#FF3B30]">{profileErrors.imageFile}</p>}
            <input
              type="file"
              accept="image/*"
              id="profileImageInput"
              className="hidden"
              onChange={handleImageUpload}
            />
            <hr className="border border-gray-200 w-full px-4 mx-4" />

            {/* Profile Form */}
            <div className="w-full  bg-[#F7F7F8] p-5">
              <div className="grid md:grid-cols-[40%_60%] gap-4 pb-2">
                <div>
                  <h3 className="text-[#1E1E1E] text-[16px] font-[600]">
                    {"Personal Information"}
                  </h3>
                  <p className="text-[#5A687C] text-sm">
                    Manage the basic details that identify your account
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-[#1E1E1E]">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="font-medium text-sm text-[#868C98]">
                      {"Full Name"}
                    </label>
                    <input
                      type="text"
                      value={`${profileFormData.firstName || ""}${profileFormData.lastName ? ` ${profileFormData.lastName}` : ""}`}
                      placeholder="Robert Johnson"
                      onChange={(e) => handleFullNameChange(e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid ${(profileErrors.firstName || profileErrors.lastName) ? 'border-[#FF3B30]' : 'border-[#e1e4ea]'} text-[16px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none`}
                    />
                    {(profileErrors.firstName || profileErrors.lastName) && (
                      <p className="text-[#FF3B30] text-sm">
                        {profileErrors.firstName || profileErrors.lastName}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 text-[#868C98]">
                    <label className="font-medium text-sm text-text-black">{t("settings.tab_1_list.email_address")}</label>
                    <input
                      type="email"
                      name="email"
                      value={profileFormData.email === "null" ? '' : profileFormData.email}
                      disabled
                      className="w-full px-3.5 py-2.5 bg-[#E1E4EA] rounded-lg border border-solid border-[#e1e4ea]  text-[16px] text-[#5A687C]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 ">
                    <label className="text-[14px] text-[#868C98] font-[500] block">
                      {t("settings.tab_1_list.phone")}
                    </label>
                    <div ref={countryRef} className={`flex group items-center bg-white focus-within:border-[#675FFF] gap-2 border ${profileErrors.phoneNumber ? 'border-[#FF3B30]' : 'border-[#e1e4ea]'} rounded-lg px-4 py-1.5`}>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsOpen(!isOpen)}
                          className="w-[120px] flex hover:cursor-pointer relative justify-between gap-1 items-center border-none py-1 text-left"
                        >
                          <div className="flex items-center gap-2 mr-3">
                            <p className={`fi fi-${selectedCountry?.flag} fis w-4 h-4 rounded-full`}></p>
                            <p className="text-[#5A687C] font-[400] text-[16px]">{selectedCountry?.dial_code}</p>
                          </div>
                          <FaChevronDown color="#5A687C" className={`w-[10px]  transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="absolute px-1 z-10 rounded-md shadow-lg border border-gray-200 max-h-40 overflow-auto top-6 w-full left-[-13px] bg-white mt-1">
                            <input
                              type="text"
                              placeholder="Search"
                              onChange={handleSearch}
                              className="w-full px-3 py-2 border-b border-gray-200 outline-none text-sm"
                            />
                            {countries.length > 0 ? (
                              countries.map((country, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    setSelectedCountry(country);
                                    setIsOpen(false);
                                    setCountries(countryData);
                                    setProfileFormData((prev) => ({
                                      ...prev,
                                      countryCode: country.code,
                                    }));
                                  }}
                                  className={`flex px-2 gap-2 hover:bg-[#F4F5F6] hover:rounded-lg my-1 py-2 ${selectedCountry?.code === country?.code
                                    ? "bg-[#F4F5F6] rounded-lg"
                                    : ""
                                    } cursor-pointer items-center`}
                                >
                                  <p className={`fi fi-${country.flag} fis w-4 h-4 rounded-full`}></p>
                                  <p className="text-[#5A687C] font-[400] text-[16px]">
                                    {country.dial_code}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-sm text-gray-500 py-2">No results found</p>
                            )}
                          </div>
                        )}
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={profileFormData.phoneNumber === "null" ? '' : profileFormData.phoneNumber}
                        onChange={handleProfileChange}
                        placeholder={t("settings.tab_1_list.phone_placeholder")}
                        className="w-full outline-none"
                      />
                    </div>
                    {profileErrors.phoneNumber && <p className="text-[#FF3B30] py-1">{profileErrors.phoneNumber}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-medium text-sm text-[#868C98]">
                      {t("settings.tab_1_list.company")}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={profileFormData.company === "null" ? '' : profileFormData.company}
                      placeholder={t("settings.tab_1_list.company_placeholder")}
                      onChange={handleProfileChange}
                      className={`w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid ${profileErrors.company ? 'border-[#FF3B30]' : 'border-[#e1e4ea]'}  text-[16px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none`}
                    />
                    {profileErrors.company && <p className="text-[#FF3B30] py-1">{profileErrors.company}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-medium text-sm text-[#868C98]">
                      {t("settings.tab_1_list.role")}
                    </label>
                    <input
                      name="role"
                      disabled
                      value={profileFormData.role === "null" ? '' : profileFormData.role}
                      className="w-full px-3.5 py-2.5 bg-[#E1E4EA] rounded-lg border border-solid border-[#e1e4ea]  text-[16px] text-[#5A687C]"
                    />
                  </div>

                  {/* <div className="flex flex-col gap-1.5">
                    <label className="font-medium text-sm text-text-black">
                      {t("settings.tab_1_list.city")}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={profileFormData.city === "null" ? '' : profileFormData.city}
                      placeholder={t("settings.tab_1_list.city")}
                      onChange={handleProfileChange}
                      className={`w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid ${profileErrors.city ? 'border-[#FF3B30]' : 'border-[#e1e4ea]'} text-[16px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none`}
                    />
                    {profileErrors.city && <p className="text-[#FF3B30] py-1">{profileErrors.city}</p>}
                  </div> */}

                  {/* <div className="flex flex-col gap-1.5">
                    <label className="font-medium text-sm text-text-black">
                      {t("settings.tab_1_list.country")}
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={profileFormData.country === "null" ? '' : profileFormData.country}
                      placeholder={t("settings.tab_1_list.country")}
                      onChange={handleProfileChange}
                      className={`w-full px-3.5 py-2.5 bg-white rounded-lg border border-solid ${profileErrors.country ? 'border-[#FF3B30]' : 'border-[#e1e4ea]'} text-[16px] text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none`}
                    />
                    {profileErrors.country && <p className="text-[#FF3B30] py-1">{profileErrors.country}</p>}
                  </div> */}
                </div>
              </div>
              <hr className="border border-gray-200 w-full mx-2" />
              {/* Security */}
              <div className="w-full bg-[#F6F6F7] p-5 mt-6">
                <div className="grid md:grid-cols-[40%_60%] gap-4">
                  <div>
                    <h3 className="text-[#1E1E1E] text-[16px] font-[600]">Security</h3>
                    <p className="text-[#5A687C] text-sm">
                      Keep your account protected with secure login and verification methods.
                    </p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[14px] text-[#1E1E1E] font-[500]">Your Password</p>
                        <p className="text-sm text-[#5A687C]">Last changed password: _ days ago</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordStrength(evaluatePasswordStrength(formData.newPassword || ""));
                          setShowPasswordModal(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E1E1E1] rounded-lg text-[#1E1E1E] text-sm font-[500] cursor-pointer hover:bg-[#F9F8FF]"
                      >
                        <Pencil className="w-4 h-4 text-[#1E1E1E]" />
                        Change Password
                      </button>
                    </div>

                    {/* <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[14px] text-[#1E1E1E] font-[500]">Two-Factor Authentication</p>
                          <p className="text-sm text-[#5A687C]">
                            Enable two-factor authentication to your account.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[#5A687C]">
                          <span> {twoFactorEnabled ? "On" : "Off"} </span>
                          <button
                            type="button"
                            onClick={() => setTwoFactorEnabled((prev) => !prev)}
                            className={`w-12 h-6 rounded-full cursor-pointer p-1 transition-colors ${twoFactorEnabled ? "bg-[#675FFF]" : "bg-[#DDE1E7]"}`}
                          >
                            <span
                              className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${twoFactorEnabled ? "translate-x-6" : ""
                                }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        {twoFactorOptions.map((option) => {
                          const isSelected = twoFactorMethod === option.key
                          return (
                            <button
                              key={option.key}
                              type="button"
                              disabled={!twoFactorEnabled}
                              onClick={() => setTwoFactorMethod(option.key)}
                              className={`text-left border rounded-xl p-4 transition-colors ${isSelected ? "border-[#675FFF] bg-[#F7F7F8]" : "border-[#E1E4EA]"
                                } ${!twoFactorEnabled ? "opacity-60 cursor-not-allowed" : "hover:border-[#675FFF]"}`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`h-4 w-4 rounded-full border ${isSelected ? "border-[#675FFF] bg-[#675FFF]" : "border-[#C5CAD4]"
                                    }`}
                                />
                                <p className="text-[14px] text-[#1E1E1E] font-[500]">{option.title}</p>
                              </div>
                              <p className="text-sm text-[#5A687C]">{option.description}</p>
                            </button>
                          )
                        })}
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            {errorMessage.profile && <p className="text-sm text-red-500 mt-1">{errorMessage.profile}</p>}
            {success.profile && <p className="text-sm text-green-500 mt-1">{success.profile}</p>}

            {/* Delete Profile Button */}
            {/* <div className="flex justify-end items-center mt-4">
              <button
                onClick={() => setDeleteModalStatus(true)}
                className="cursor-pointer text-[13px] font-[500] bg-transparent text-[#5A687C] hover:text-[#FF3B30] transition-colors"
              >
                {t("settings.tab_1_list.delete_profile")}
              </button>
            </div> */}
          </div>
          

      
        </div>
        
      );
    }

    if (activeSidebarItem === "billing") {
      // If manage-plan view is active, show ManagePlan component
      if (showManagePlan) {
        return (
          <div className="flex py-3 pr-4 flex-col h-full w-full gap-6">
            <ManagePlan onClose={() => {
              setShowManagePlan(false);
              setSearchParams({});
            }} />
          </div>
        );
      }
      // Otherwise show the Plan & Billing section
      return (
        <div className="flex py-3 pr-4 flex-col h-full w-full gap-6">
          <Plan t={t} teamMembersData={teamMembersData} setActiveSidebarItem={setActiveSidebarItem} showPlanPopup={showPlanPopup} setShowPlanPopup={setShowPlanPopup} handleAddSeatsTeam={handleAddSeatsTeam} setShowManagePlan={setShowManagePlan} setSearchParams={setSearchParams} />
        </div>
      );
    }

    else if (activeSidebarItem === "team") {
      return (
        <>
          <div className="w-full py-4 flex flex-col gap-3 pr-4">
            <div className="flex justify-between">
              <h1 className="text-[#1E1E1E] font-semibold text-[20px] md:text-[24px]">{t("settings.tab_3")}</h1>
              <button className="bg-[#5E54FF] cursor-pointer text-white rounded-md text-[14px] md:text-[16px] p-2" onClick={handleInviteTeam}>{t("settings.tab_3_list.invite_team_member")}</button>
            </div>
            <div className="flex justify-between">
              <SelectDropdown
                name="role"
                options={roleOptions}
                value={role}
                onChange={(updated) => {
                  handleChangeRole(updated)
                }}
                placeholder={t("brain_ai.select")}
                className="w-[157px]"
                extraName={t("settings.tab_3_list.role")}
              />
              <div onClick={() => renderTeamMembers(role)} className="flex items-center px-3 gap-2 cursor-pointer bg-white border border-[#E1E4EA] rounded-[8px] py-[8px]">
                <RefreshIcon />
                <button className="text-[16px] cursor-pointer text-[#5A687C]">
                  {t("refresh")}
                </button>
              </div>
            </div>
            <div className="overflow-auto" style={{ overflow: activeDropdown !== null ? 'visible' : 'auto' }}>
              <table className="min-w-full border-separate border-spacing-y-3" style={{ overflow: activeDropdown !== null ? 'visible' : 'auto' }}>
                <thead className="bg-transparent">
                  <tr>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#5A687C]"> {t("settings.tab_3_list.name")}</th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#5A687C]"> {t("settings.tab_3_list.email")}</th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#5A687C]"> {t("settings.tab_3_list.role")}</th>
                    <th className="px-6 py-3 text-left text-[16px] font-medium text-[#5A687C]"> {t("settings.tab_3_list.agents")}</th>
                    {/* <th className="px-6 py-3"></th> */}
                  </tr>
                </thead>
                <tbody className=" rounded-lg">

                  {teamMembersDataLoading ? <tr className='h-34'><td></td><td></td><td><span className='loader' /></td></tr> : teamMembersDataMessage ? <tr className='h-34'><td></td><td></td><td>{teamMembersDataMessage}</td></tr> : <>{filteredMembers?.length > 0 ? filteredMembers?.map((user, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3 border-l-1 border-t-1 border-b-1 border-[#E1E4EA] rounded-l-lg">
                        <div className="w-10 h-10 p-2 bg-[#EEFFFB] text-[#5E54FF] rounded-xl flex items-center justify-center font-[600] text-[16px]">
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
                      {user?.role.toLowerCase() !== 'admin' && (
                        <td className="text-center bg-[#F7F7F8] relative" style={{ overflow: 'visible' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDropdownClick(index);
                              setUserToEdit(user);
                              console.log(user);
                            }}
                            className="text-gray-500 cursor-pointer hover:text-gray-700"
                          >
                            <EllipsisVertical />
                          </button>
                          {activeDropdown === index && (
                            <div ref={dropdownRef} data-dropdown className="absolute right-0 top-full mt-1 px-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-[9999]">
                              <div className="py-1">
                                <button
                                  className="block group w-full cursor-pointer text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUserToEdit(user);
                                    setEditMemberFormData({
                                      email: user.email,
                                      role: user.role
                                    });
                                    setEditMemberErrors({});
                                    setEditTeamMemberModal(true);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span> {t("edit")}</span> </div>
                                </button>
                                <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                                <div className="py-2">
                                  <button
                                    className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-[#F4F5F6] hover:rounded-lg"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsDeleteOpen(true);
                                      setActiveDropdown(null);
                                    }}
                                  >
                                    <div className="flex items-center gap-2">{<Delete />} <span> {t("delete")}</span> </div>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  )) : <tr className='h-34'><td></td><td></td><td>{t("no_data")}</td></tr>}</>}
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
                  className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-[#1E1E1E] font-semibold text-[20px] mb-2">{t("settings.tab_3_list.invite_team_member")}</h2>

                <div>
                  <label className="block text-[14px] font-medium text-[#292D32] mb-1"> {t("settings.tab_3_list.email_address")}</label>
                  <div className="flex items-center border border-[#E1E4EA] focus-within:border-[#675FFF] rounded-[8px] px-4 py-2">
                    <input
                      type="email"
                      placeholder={t("settings.tab_3_list.email_placeholder")}
                      value={emailInvite}
                      onChange={(e) => {
                        setEmailInvite(e.target.value)
                        setInviteErrors({})
                      }}
                      className="w-full focus:outline-none"
                    />
                  </div>
                  {inviteErrors.email && <p className="text-sm text-red-500 mt-1">{inviteErrors.email}</p>}
                  <label className="block my-2 text-[14px] font-medium text-[#292D32]">{t("settings.tab_3_list.invite_as")}</label>
                  < SelectDropdown
                    name="role_options"
                    options={roleEmailOptions}
                    value={emailInviteRole}
                    onChange={(updated) => {
                      setEmailInviteRole(updated)
                    }}
                    placeholder={t("brain_ai.select")}
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
                  }} className="w-full text-[16px] cursor-pointer  text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                    {t("settings.tab_3_list.close")}
                  </button>
                  <button onClick={handleInvite} className={`w-full cursor-pointer  text-[16px] text-white rounded-[8px] ${inviteEmailLoading ? "bg-[#5f54ff98]" : " bg-[#5E54FF]"} h-[38px]`}>
                    {inviteEmailLoading ? <div className="flex items-center justify-center gap-2"><p>{t("processing")}</p><span className="loader" /></div> : `${t("settings.tab_3_list.invite")}`}
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
      <div className="flex flex-col gap-6 w-full px-4 py-4">
        <div className="bg-[#F7F7F8] overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-6 border-b border-[#d1d3db]">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[#1E1E1E]">General Settings</h2>
              <p className="text-md text-[#5A687C] max-w-2xl">
                Adjust your workspace preferences, default behaviors, and system display options.
              </p>
              {success.general && (
                <p className="text-sm text-green-600">{success.general}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetGeneralSettings}
                className="px-2.5 py-1.5 bg-white border border-[#E1E4EA] rounded-lg text-[#000000] text-[14px] sm:text-[16px] font-[500] cursor-pointer hover:bg-[#F9F8FF] transition-colors whitespace-nowrap"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSaveGeneralSettings}
               className={`px-2.5 py-1.5 rounded-lg text-white text-[14px] sm:text-[16px] font-[500] cursor-pointer transition-colors whitespace-nowrap ${updateLoading ? "bg-[#5f54ff87] cursor-not-allowed" : "bg-[#675FFF] hover:bg-[#5E54FF]"}`}
              >
                Save Changes
              </button>
            </div>
          </div>

          <div className="px-6 py-6 space-y-8">
            <section className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-6 border-b border-[#d1d3db] pb-2">
                <div className="min-w-[260px] max-w-sm">
                  <h3 className="text-lg font-semibold text-[#1E1E1E]">Theme & Appearance</h3>
                  <p className="text-sm text-[#7A8298]">Choose between light, dark, or system themes</p>
                </div>
                <div className="flex flex-wrap gap-4 lg:gap-6">
                  {THEME_OPTIONS.map((option) => {
                    const selected = generalSettings.theme === option.key
                    return (
                      <div key={option.key} className="flex flex-col items-center gap-3 w-[150px] sm:w-[170px]">
                        <button
                          type="button"
                          onClick={() => handleGeneralSettingChange("theme", option.key)}
                          className={`w-full transition-all ${
                            selected ? "border-[#675FFF] shadow-[0_10px_30px_rgba(79,70,229,0.15)]" : ""
                          }`}
                        >
                          <div
                            className={`w-full h-24 rounded-lg border ${selected ? "border-[#C7CCF7]" : "border-[#E4E6EF]"} relative overflow-hidden`}
                          >
                            <img
                              src={
                                option.key === "light"
                                  ? LightTheme
                                  : option.key === "dark"
                                    ? DarkTheme
                                    : SystemTheme
                              }
                              alt={option.label}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                        </button>
                        <span className={`text-sm font-semibold ${selected ? "text-[#1E1E1E]" : "text-[#6C7489]"}`}>
                          {option.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 border-b border-[#d1d3db]">
                <div className="min-w-[240px] max-w-sm">
                  <h3 className="text-lg font-semibold text-[#1E1E1E]">Account Preferences</h3>
                  <p className="text-sm text-[#7A8298]">
                    Customize how Ecosystem.ai behaves to match your working style.
                  </p>
                </div>
                <div className="flex-1">
                  <div className=" p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#7A8298]">Language</label>
                        <div className="relative">
                          <select
                            value={generalSettings.language}
                            onChange={(e) => handleGeneralSettingChange("language", e.target.value)}
                            className="w-full appearance-none rounded-xl border border-[#E1E4EA] bg-white px-4 py-2 text-sm text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none"
                          >
                            {LANGUAGE_OPTIONS.map((lang) => (
                              <option key={lang} value={lang}>{lang}</option>
                            ))}
                          </select>
                          <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA8BC] pointer-events-none" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#7A8298]">Timezone</label>
                        <div className="relative">
                          <select
                            value={generalSettings.timezone}
                            onChange={(e) => handleGeneralSettingChange("timezone", e.target.value)}
                            className="w-full appearance-none rounded-xl border border-[#E1E4EA] bg-white px-4 py-2 text-sm text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none"
                          >
                            {TIMEZONE_OPTIONS.map((zone) => (
                              <option key={zone} value={zone}>{zone}</option>
                            ))}
                          </select>
                          <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA8BC] pointer-events-none" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#7A8298]">Date Format</label>
                        <div className="relative">
                          <select
                            value={generalSettings.dateFormat}
                            onChange={(e) => handleGeneralSettingChange("dateFormat", e.target.value)}
                            className="w-full appearance-none rounded-xl border border-[#E1E4EA] bg-white px-4 py-2 text-sm text-[#1E1E1E] focus:border-[#675FFF] focus:outline-none"
                          >
                            {DATE_FORMAT_OPTIONS.map((format) => (
                              <option key={format} value={format}>{format}</option>
                            ))}
                          </select>
                          <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA8BC] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="min-w-[240px] max-w-sm">
                  <h3 className="text-lg font-semibold text-[#1E1E1E]">Notifications & Alerts</h3>
                  <p className="text-sm text-[#7A8298]">
                    Control how you receive important updates and insights from Ecosystem.ai.
                  </p>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  {[
                    {
                      key: "pushEnabled",
                      title: "Push Notifications",
                      description: "Get real-time updates and alerts directly on your device",
                    },
                    {
                      key: "emailEnabled",
                      title: "Email notification",
                      description: "Receive notifications via email",
                    },
                  ].map((item) => {
                    const enabled = generalSettings[item.key]
                    return (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-5"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#1E1E1E]">{item.title}</p>
                          <p className="text-sm text-[#7A8298]">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#675FFF]">
                            {enabled ? "On" : "Off"}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleGeneralSettingChange(item.key, !enabled)}
                            className={`inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                              enabled ? "bg-[#675FFF]" : "bg-[#D7DBE6]"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                enabled ? "translate-x-5" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  if (userDetails?.loading) return <p className='flex justify-center items-center h-full'><span className='loader' /></p>


  return (
    <div className="w-full overflow-auto relative">
      {/* <div>
        <div className='flex items-center pl-4 py-3' onClick={() => navigate("/dashboard")}>
          <MdOutlineKeyboardArrowLeft size={25} />
          <h1 className="text-[26px] font-bold pb-1">Settings</h1>
        </div>
        <hr className='text-[#E1E4EA]' />
      </div> */}
      <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} ><BsThreeDots size={24} color='#1e1e1e' /></div>
      <div className="flex flex-col md:flex-row items-start lg:gap-8 relative w-full">
        {/* Sidebar Navigation */}
        <div className="lg:flex hidden flex-col bg-white gap-4 border border-[#D6D6D6] min-w-[272px] rounded-2xl fixed h-[calc(100vh-86px)] mt-2 mb-8 overflow-y-auto">
          <div className=''>
            <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => navigate("/dashboard")}>
              {/* <MdOutlineKeyboardArrowLeft size={25} /> */}
              <div className="flex gap-4 pl-4 items-center h-[57px]">
                {/* <LeftArrow /> */}
                <h1 className="text-[20px] font-[600]">{t("settings.label")}</h1>
              </div>
            </div>
            <hr className='text-[#E1E4EA]' />
          </div>
          <div className="flex inter flex-col w-full px-3 items-start gap-2 relative">
            <div
              onClick={() => handleSelect("my-profile")}
              className={`flex group justify-center md:justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === "my-profile" ? "bg-[#F0EFFF]" : "hover:bg-[#F9F8FF]"
                }`}
            >
              {activeSidebarItem === "my-profile" ? <CircleUserRound className="text-[#675FFF]"/> : <div className="flex items-center gap-2"><div className='group-hover:hidden'><CircleUserRound className="text-gray-500"/></div> <div className='hidden group-hover:block'><CircleUserRound /></div></div>}
              <span className={`font-[400] text-[16px] ${activeSidebarItem === "my-profile" ? "text-black" : "text-blackgroup-hover:text-[#1E1E1E]"}`}>
                My Profile
              </span>
            </div>

            <div
              onClick={() => handleSelect("general")}
              className={`flex group justify-center md:justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === "general" ? "bg-[#F0EFFF]" : "hover:bg-[#F9F8FF]"
                }`}
            >
              {activeSidebarItem === "general" ? <House className="text-[#675FFF]" status={activeSidebarItem === "general"} /> : <div className="flex items-center gap-2"><div className='group-hover:hidden'>{<House className="text-gray-500" status={activeSidebarItem === "general"} />}</div> <div className='hidden group-hover:block'>{<House hover={true} />}</div></div>}
              <span className={`font-[400] text-[16px] ${activeSidebarItem === "general" ? "text-black" : "text-black group-hover:text-[#1E1E1E]"}`}>
                {t("settings.tab_1")}
              </span>
            </div>

            <div
              onClick={() => handleSelect("billing")}
              className={`flex group justify-center md:justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === "billing" ? "bg-[#EDF3FF]" : "hover:bg-[#F9F8FF]"
                }`}
            >
              {activeSidebarItem === "billing" ? <Wallet className="text-[#675FFF]" status={activeSidebarItem === "billing"} /> :
                <div className="flex items-center gap-2"><div className='group-hover:hidden'>{<Wallet className="text-gray-500" status={activeSidebarItem === "billing"} />}</div> <div className='hidden group-hover:block'>{<Wallet className="text-gray-500" hover={true} />}</div></div>}
              <span className={`font-[400] text-[16px] ${activeSidebarItem === "billing" ? "text-black" : "text-black group-hover:text-[#1E1E1E]"}`}>
                {t("settings.tab_2")}
              </span>
            </div>

            <div
              onClick={() => handleSelect("team")}
              className={`flex group justify-center md:justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === "team" ? "bg-[#EDF3FF]" : "hover:bg-[#F9F8FF]"
                }`}
            >
              {activeSidebarItem === "team" ? <UsersRound className="text-[#675FFF]" status={activeSidebarItem === "team"} /> :
                <div className="flex items-center gap-2"><div className='group-hover:hidden'><UsersRound className="text-gray-500" status={activeSidebarItem === "team"} /></div> <div className='hidden group-hover:block'><UsersRound hover={true} /></div></div>}
              <span className={`font-[400] text-[16px] ${activeSidebarItem === "team" ? "text-black" : "text-black group-hover:text-[#1E1E1E]"}`}>
                {t("settings.tab_3")}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:ml-[280px] overflow-hidden pr-0 py-8 pl-3 lg:pl-0 lg:pr-4 lg:py-3">
          {renderMainContent()}
        </div>
      </div>
      {/* {modalStatus && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-[514px] p-6 relative shadow-lg">
          <button
            className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => {
              setModalStatus(false)
            }}
          >
            <X size={20} />
          </button>

          <div className='h-[120px] flex flex-col justify-around gap-2 items-center '>
            <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-1">
              {t("settings.profile_status")}
            </h2>
            <button
              className="bg-[#675FFF] text-white px-5 cursor-pointer py-2 font-[500] test-[16px]  rounded-lg"
              onClick={() => setModalStatus(false)}
            >
              {t("settings.ok")}
            </button>
          </div>
        </div>
      </div>} */}
      {deleteModalStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-[514px] p-6 relative shadow-lg">
            <button
              className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setDeleteModalStatus(false)
              }}
            >
              <X size={20} />
            </button>

            <div className="flex flex-col justify-around h-[150px] text-center">
              <h2 className="text-[20px] font-semibold text-[#1E1E1E] mb-4">
                {t("settings.tab_1_list.delete_header")}
              </h2>
              <div className="flex gap-4 mt-2 w-full">
                <button
                  className="w-full cursor-pointer bg-[#FF3B30] text-white px-5 py-2 font-[500] test-[16px]  rounded-lg"
                  onClick={handleDeleteProfile}
                >
                  {t("settings.tab_1_list.confirm_delete")}
                </button>
                <button
                  className="w-full cursor-pointer bg-white text-[#5A687C] border-[1.5px] border-[#E1E4EA] font-[500] test-[16px] px-5 py-2 rounded-lg"
                  onClick={() => setDeleteModalStatus(false)}
                >
                  {t("settings.tab_1_list.cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {sidebarStatus &&
        <div className="lg:hidden fixed inset-0 bg-black/20 flex items-end z-50">
          <div className="flex flex-col relative bg-white gap-8 w-full max-h-[80%] overflow-auto py-8 rounded-t-[20px]">
            <button
              className="absolute top-4 cursor-pointer right-4 text-[#1e1e1e]"
              onClick={() => {
                setSideBarStatus(false)
              }}
            >
              <X size={20} />
            </button>
            <div className=''>
              <div className='flex justify-center items-center cursor-pointer' onClick={() => navigate("/dashboard")}>
                {/* <MdOutlineKeyboardArrowLeft size={25} /> */}
                <div className="flex gap-4 pl-3 items-center h-[57px]">
                  {/* <LeftArrow /> */}
                  <h1 className="text-[20px] font-[600]">{t("settings.label")}</h1>
                </div>
              </div>
              <hr className='text-[#E1E4EA]' />
            </div>
            <div className="flex inter flex-col w-full px-5 items-start gap-2 relative">
              <div
                onClick={() => {
                  handleSelect("my-profile")
                  setSideBarStatus(false)
                }}
                className={`flex group justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "my-profile" ? "bg-[#F0EFFF]" : "hover:bg-[#F9F8FF]"
                  }`}
              >
                {activeSidebarItem === "my-profile" ? <ProfileEditIcon /> : <div className="flex items-center gap-2"><div className='group-hover:hidden'><ProfileEditIcon /></div> <div className='hidden group-hover:block'><ProfileEditIcon /></div></div>}
                <span className={`font-[400] text-[16px] ${activeSidebarItem === "my-profile" ? "text-[#675FFF]" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                  My Profile
                </span>
              </div>

              <div
                onClick={() => {
                  handleSelect("general")
                  setSideBarStatus(false)
                }}
                className={`flex group justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "general" ? "bg-[#F0EFFF]" : "hover:bg-[#F9F8FF]"
                  }`}
              >
                {activeSidebarItem === "general" ? <Settings status={activeSidebarItem === "general"} /> : <div className="flex items-center gap-2"><div className='group-hover:hidden'>{<Settings status={activeSidebarItem === "general"} />}</div> <div className='hidden group-hover:block'>{<Settings hover={true} />}</div></div>}
                <span className={`font-[400] text-[16px] ${activeSidebarItem === "general" ? "text-[#675FFF]" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                  {t("settings.tab_1")}
                </span>
              </div>

              <div
                onClick={() => {
                  handleSelect("billing")
                  setSideBarStatus(false)
                }}
                className={`flex group justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "billing" ? "bg-[#EDF3FF]" : "hover:bg-[#F9F8FF]"
                  }`}
              >
                {activeSidebarItem === "billing" ? <PlanIcon status={activeSidebarItem === "billing"} /> :
                  <div className="flex items-center gap-2"><div className='group-hover:hidden'>{<PlanIcon status={activeSidebarItem === "billing"} />}</div> <div className='hidden group-hover:block'>{<PlanIcon hover={true} />}</div></div>}
                <span className={`font-[400] text-[16px] ${activeSidebarItem === "billing" ? "text-[#675FFF]" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                  {t("settings.tab_2")}
                </span>
              </div>

              <div
                onClick={() => {
                  handleSelect("team")
                  setSideBarStatus(false)
                }}
                className={`flex group justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "team" ? "bg-[#EDF3FF]" : "hover:bg-[#F9F8FF]"
                  }`}
              >
                {activeSidebarItem === "team" ? <TeamMemberIcon status={activeSidebarItem === "team"} /> :
                  <div className="flex items-center gap-2"><div className='group-hover:hidden'><TeamMemberIcon status={activeSidebarItem === "team"} /></div> <div className='hidden group-hover:block'><TeamMemberIcon hover={true} /></div></div>}
                <span className={`font-[400] text-[16px] ${activeSidebarItem === "team" ? "text-[#675FFF]" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                  {t("settings.tab_3")}
                </span>
              </div>
            </div>
          </div>
        </div>
      }
      {successModalStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-[457px] p-6 relative shadow-lg">
            <button
              className="absolute top-4 cursor-pointer  right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setSuccessModalStatus('')
              }}
            >
              <X size={20} />
            </button>

            <div className="flex flex-col gap-6 justify-center pt-8 pb-6 items-center text-center">
              <div>
                <SuccessIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-[28px] font-[700] text-[#292D32]">
                  {successModalStatus === "psd" ? t("settings.tab_1_list.password_changed_header") : t("settings.tab_3_list.invite_email_success_header")}
                </h2>
                <h2 className="text-[16px] font-[400] text-[#5A687C]">
                  {successModalStatus === "psd" ? t("settings.tab_1_list.password_changed_description") : t("settings.tab_3_list.invite_email_success_description")}
                </h2>
              </div>
              <button
                className="w-full cursor-pointer border-[1.5px] border-[#5F58E8] bg-[#675FFF] text-white px-[20px] py-[12px] font-[500] text-[16px]  rounded-[7px]"
                onClick={() => {
                  setSuccessModalStatus('')
                }}
              >
                {t("appointment.ok")}
              </button>
            </div>
          </div>
        </div>
      )}

  {showPasswordModal && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPasswordModal(false)}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-1">Change Password</h2>
        <p className="text-sm text-[#5A687C] mb-4">Create a strong password to secure your account.</p>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.currentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full pr-10 pl-3 py-2.5 bg-white rounded-lg border border-[#E1E4EA] focus:border-[#675FFF] focus:outline-none"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("currentPassword")}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400"
              >
                {showPasswords.currentPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]">Create New Passowrd</label>
            <div className="relative">
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full pr-10 pl-3 py-2.5 bg-white rounded-lg border border-[#E1E4EA] focus:border-[#675FFF] focus:outline-none"
                placeholder="Create new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400"
              >
                {showPasswords.confirmPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]">Confirm Password</label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handlePasswordChange}
                className="w-full pr-10 pl-3 py-2.5 bg-white rounded-lg border border-[#E1E4EA] focus:border-[#675FFF] focus:outline-none"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400"
              >
                {showPasswords.newPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-1 mt-2">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className={`h-1 flex-1 rounded-full ${passwordStrength.score > index ? "bg-[#675FFF]" : "bg-[#E1E4EA]"}`}
                />
              ))}
            </div>
            <p className="text-sm text-[#5A687C]">Moderate password. Must contain at least:</p>
            <div className="flex flex-col gap-1 text-sm">
              {[
                { key: "uppercase", label: "At least 1 uppercase" },
                { key: "number", label: "At least 1 number" },
                { key: "length", label: "At least 8 characters" },
              ].map((item) => (
                <span key={item.key} className="flex items-center gap-2">
                  {passwordStrength.requirements[item.key] ? (
                    <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#C5CAD4]" />
                  )}
                  <span className={passwordStrength.requirements[item.key] ? "text-[#1E1E1E]" : "text-[#5A687C]"}>
                    {item.label}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {errors.newError && <p className="text-sm text-red-500 mt-2">{errors.newError}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setShowPasswordModal(false)}
            className="px-4 py-2 rounded-lg border border-[#E1E4EA] text-[#1E1E1E] font-[500] hover:bg-[#F9F8FF]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={updatePasswordLoading}
            className={`px-4 py-2 rounded-lg text-white font-[500] ${
              updatePasswordLoading ? "bg-[#5f54ff87] cursor-not-allowed" : "bg-[#675FFF] hover:bg-[#5E54FF]"
            }`}
          >
            {updatePasswordLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )}

      {isDeleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[1px] bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editTeamMemberModal && (
        <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
          <div className="bg-white max-h-[364px] flex flex-col gap-3 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => {
                setEditTeamMemberModal(false);
                setEditMemberFormData({ email: "", role: "Member" });
                setEditMemberErrors({});
                setUserToEdit(null);
                setSuccess({});
              }}
              className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-[#1E1E1E] font-semibold text-[20px] mb-2">{t("Edit Member")}</h2>

            <div>
              <label className="block text-[14px] font-medium text-[#292D32] mb-1">{t("settings.tab_3_list.email_address")}</label>
              <div className="flex items-center border border-[#E1E4EA] focus-within:border-[#675FFF] rounded-[8px] px-4 py-2">
                <input
                  type="email"
                  name="email"
                  value={editMemberFormData.email}
                  disabled
                  className="w-full focus:outline-none bg-[#ffffff] text-[#5A687C]"
                />
              </div>
              {editMemberErrors.email && <p className="text-sm text-red-500 mt-1">{editMemberErrors.email}</p>}

              <label className="block my-2 text-[14px] font-medium text-[#292D32]">{t("settings.tab_3_list.invite_as")}</label>
              <SelectDropdown
                name="role"
                options={roleEmailOptions}
                value={editMemberFormData.role}
                onChange={(updated) => {
                  setEditMemberFormData((prev) => ({
                    ...prev,
                    role: updated
                  }));
                  setEditMemberErrors((prev) => ({
                    ...prev,
                    role: ""
                  }));
                }}
                placeholder={t("brain_ai.select")}
                className=""
              />
              {editMemberErrors.role && <p className="text-sm text-red-500 mt-1">{editMemberErrors.role}</p>}
            </div>

            {editMemberErrors.error && <p className="text-sm text-red-500 mt-1">{editMemberErrors.error}</p>}
            {success.emailInvite && <p className="text-sm text-green-500 mt-1">{success.emailInvite}</p>}

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setEditTeamMemberModal(false);
                  setEditMemberFormData({ email: "", role: "Member" });
                  setEditMemberErrors({});
                  setUserToEdit(null);
                  setSuccess({});
                }}
                className="w-full text-[16px] cursor-pointer text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
              >
                {t("settings.tab_3_list.close")}
              </button>
              <button
                onClick={handleUpdateTeamMember}
                className={`w-full cursor-pointer text-[16px] text-white rounded-[8px] ${updateMemberLoading ? "bg-[#5f54ff98]" : "bg-[#5E54FF]"} h-[38px]`}
              >
                {updateMemberLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <p>{t("processing")}</p>
                    <span className="loader" />
                  </div>
                ) : (
                  t("settings.tab_1_list.update_profile")
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;