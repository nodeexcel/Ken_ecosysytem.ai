import { CheckCircle2, CircleUserRound, CreditCardIcon, EllipsisVertical, Wallet, EyeIcon, EyeOffIcon, House, Pencil, SettingsIcon, Upload, UsersIcon, X, XCircle, UsersRound, Search, Plus, EllipsisIcon } from "lucide-react";
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
import { getTeamMembers, removeTeamMember, sendInviteEmail, updateTeamMember, updateGeneralSettings } from "../../api/teamMember";
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

const LANGUAGE_OPTIONS = ["English (US)", "French"];
const TIMEZONE_OPTIONS = [
  "GMT +1 (Paris, Berlin, Rome, Madrid)",
  "GMT +0 (London, Lisbon)",
  "GMT -5 (New York, Toronto)",
  "GMT -8 (Los Angeles, Vancouver)",
  "GMT +5:30 (Delhi, Mumbai)",
  "GMT +7 (Bangkok, Jakarta, Hanoi)",
  "GMT +8 (Singapore, Beijing, Kuala Lumpur)",
  "GMT +9 (Tokyo, Seoul)",
  "GMT +3 (Riyadh, Moscow)",
  "GMT +10 (Sydney, Melbourne)",
];
const DATE_FORMAT_OPTIONS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD"];




const SettingsPage = () => {

  const countryData = useSelector((state) => state.country.data)
  const [countries, setCountries] = useState(countryData);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get tab from URL or default to "my-profile"
  const tabFromUrl = searchParams.get('tab') || 'my-profile';
  const [activeSidebarItem, setActiveSidebarItem] = useState(tabFromUrl);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
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

  const [fullNameInput, setFullNameInput] = useState("");

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [success, setSuccess] = useState({})
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [teamMembersData, setTeamMembersData] = useState({})
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

  // Helper function to calculate time since password was last changed
  const getPasswordLastChanged = (passwordUpdatedAt) => {
    if (!passwordUpdatedAt) {
      return "Never";
    }

    const now = new Date();
    const passwordDate = new Date(passwordUpdatedAt);
    const diffTime = Math.abs(now - passwordDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) {
      return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
    } else if (diffMonths > 0) {
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    } else if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours > 0) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      } else {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes > 0 ? `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago` : 'Just now';
      }
    }
  };

  // Function to apply theme to the app
  const applyTheme = (theme) => {
    const html = document.documentElement;
    
    if (theme === "system") {
      // Detect system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      html.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      html.setAttribute("data-theme", theme);
    }
  };

  // Function to get system theme preference
  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

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


  useEffect(() => {
    if (profileFormData.firstName || profileFormData.lastName) {
      const constructedName = `${profileFormData.firstName || ""}${profileFormData.lastName ? ` ${profileFormData.lastName}` : ""}`;
      if (!fullNameInput || (profileFormData.firstName && !fullNameInput.startsWith(profileFormData.firstName))) {
        setFullNameInput(constructedName);
      }
    }
  }, [profileFormData.firstName, profileFormData.lastName])

  useEffect(() => {
    const view = searchParams.get('view');
    const tab = searchParams.get('tab');

    if (view === 'manage-plan') {
      setShowManagePlan(true);
      setActiveSidebarItem('billing');
    } else if (tab) {
      // Handle all tabs from URL
      const validTabs = ['my-profile', 'general', 'billing', 'team', 'transaction-history'];
      if (validTabs.includes(tab)) {
        setActiveSidebarItem(tab);
        if (tab !== 'billing') {
          setShowManagePlan(false);
        }
      }
    } else {
      // Default to my-profile if no tab specified
      setActiveSidebarItem('my-profile');
      setShowManagePlan(false);
    }
  }, [searchParams])

  // Apply theme on mount and handle system preference changes
  useEffect(() => {
    // Apply initial theme
    applyTheme(generalSettings.theme);

    // If theme is "system", listen for system preference changes
    if (generalSettings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      const handleSystemThemeChange = (e) => {
        const html = document.documentElement;
        html.setAttribute("data-theme", e.matches ? "dark" : "light");
      };

      // Add listener for system preference changes
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleSystemThemeChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleSystemThemeChange);
      }

      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handleSystemThemeChange);
        } else {
          mediaQuery.removeListener(handleSystemThemeChange);
        }
      };
    }
  }, [generalSettings.theme]);

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
      if (activeDropdown !== null) {
        const clickedElement = event.target;
        const isDropdownClick = clickedElement.closest('[data-dropdown]');
        const isTriggerClick = clickedElement.closest('button')?.querySelector('svg') ||
          clickedElement.closest('button[class*="border"]');

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
  const [teamSearchQuery, setTeamSearchQuery] = useState("")
  const [teamCurrentPage, setTeamCurrentPage] = useState(1)
  const [teamRowsPerPage, setTeamRowsPerPage] = useState(5)

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

    if (profileFormData.image === null && !profileFormData.imageFile) newErrors.imageFile = `${t("settings.tab_1_list.profile_image_required")}`;

    return newErrors;
  };

  const handleGeneralSettingChange = (key, value) => {
    setGeneralSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
    
    // Apply theme immediately when user selects a theme (for preview)
    if (key === "theme") {
      applyTheme(value);
    }
  }

  const handleResetGeneralSettings = () => {
    setGeneralSettings({ ...GENERAL_DEFAULT_SETTINGS })
    setSuccess((prev) => ({ ...prev, general: "Changes discarded." }))
    // Reset theme to default
    applyTheme(GENERAL_DEFAULT_SETTINGS.theme);
  }

  const handleSaveGeneralSettings = async () => {
    setUpdateLoading(true);
    try {
      // Map language to language code
      const languageMap = {
        "English (US)": "en",
        "French": "fr"
      };
      
      const payload = {
        theme: generalSettings.theme,
        dateFormat: generalSettings.dateFormat,
        timeFormat: generalSettings.timezone, // Using timezone as timeFormat
        language: languageMap[generalSettings.language] || "en"
      };

      const response = await updateGeneralSettings(payload);
      
      if (response?.status === 200 || response?.status === 201) {
        // Apply the theme after successful save
        applyTheme(generalSettings.theme);
        setSuccess((prev) => ({ ...prev, general: response?.data?.message || "General settings saved." }));
      } else {
        setSuccess((prev) => ({ ...prev, general: "Failed to save settings. Please try again." }));
      }
    } catch (error) {
      console.error("Error saving general settings:", error);
      setSuccess((prev) => ({ ...prev, general: error?.response?.data?.message || "Failed to save settings. Please try again." }));
    } finally {
      setUpdateLoading(false);
    }
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
    setFullNameInput(value);
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

  const handleDropdownClick = (index, event) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right + window.scrollX
      });
      setActiveDropdown(index);
    }
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
    // Reset form state when opening invite modal
    setEmailInvite("");
    setEmailInviteRole("");
    setInviteErrors({});
    setSuccess((prev) => ({ ...prev, emailInvite: "" }));

    // Always open the invite modal
    // The limit check will be handled in handleInvite function
    setOpen(true);
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

    // Update URL params for all tabs
    setSearchParams({ tab: value }, { replace: true });
    // }
  }

  const handleChangeRole = (value) => {
    setRole(value);
    setTeamCurrentPage(1); // Reset to first page when filter changes
    if (value !== "All") {
      const filterData = teamMembersData?.membersData?.filter((e) => e.role === value)
      setFilteredMembers(filterData)
    } else {
      setFilteredMembers(teamMembersData?.membersData)
    }
  }

  // Search and filter team members
  const getFilteredAndSearchedMembers = () => {
    let result = filteredMembers || [];

    // Apply search filter
    if (teamSearchQuery.trim()) {
      const query = teamSearchQuery.toLowerCase();
      result = result.filter((member) => {
        const fullName = `${member.firstName || ''} ${member.lastName || ''}`.toLowerCase();
        return (
          fullName.includes(query) ||
          member.email?.toLowerCase().includes(query) ||
          member.role?.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }

  // Pagination helpers
  const getTeamPageNumbers = () => {
    const totalPages = Math.ceil(getFilteredAndSearchedMembers().length / teamRowsPerPage);
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (teamCurrentPage > 3) pages.push("...");
      for (let i = Math.max(2, teamCurrentPage - 1); i <= Math.min(totalPages - 1, teamCurrentPage + 1); i++) {
        pages.push(i);
      }
      if (teamCurrentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  const getPaginatedTeamMembers = () => {
    const filtered = getFilteredAndSearchedMembers();
    const startIndex = (teamCurrentPage - 1) * teamRowsPerPage;
    const endIndex = startIndex + teamRowsPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  // Generate avatar colors for agents
  const getAvatarColor = (index) => {
    const colors = [
      'bg-[#EBEFFF] text-[#675FFF]',
      'bg-[#EBF9EE] text-[#34C759]',
      'bg-[#FFF4E6] text-[#FF9500]',
      'bg-[#F3E8FF] text-[#9B59B6]',
      'bg-[#FFE6E6] text-[#FF6B6B]'
    ];
    return colors[index % colors.length];
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
              <h1 className="text-[#1e1e1e] dark:text-white text-[22px]  font-[600] leading-tight">
                {t("settings.tab_1_list.my_profile_settings")}
              </h1>
              <p className="text-[#5A687C] dark:text-gray-400 text-[14px] sm:text-[16px] font-[400]">
                {t("settings.tab_1_list.my_profile_paragraph")}
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
                      setFullNameInput(`${userDetails?.user?.firstName || ""}${userDetails?.user?.lastName ? ` ${userDetails?.user?.lastName}` : ""}`);
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
                      setFullNameInput(`${userDetails?.user?.firstName || ""}${userDetails?.user?.lastName ? ` ${userDetails?.user?.lastName}` : ""}`);
                    }
                  }
                  setProfileErrors({});
                  setErrorMessage({});
                  setSuccess({});
                }}
                className="px-2.5 py-1.5 bg-white dark:bg-[#2D3151] border border-[#E1E4EA] dark:border-[#2D3151] rounded-lg text-[#000000] dark:text-gray-300 text-[14px] sm:text-[16px] font-[500] cursor-pointer hover:bg-[#F9F8FF] dark:hover:bg-[#1E2A4A] transition-colors whitespace-nowrap"
              >
                {t("settings.tab_1_list.discard")}
              </button>
              <button
                type="button"
                disabled={updateLoading}
                onClick={handleProfileSubmit}
                className={`px-2.5 py-1.5 rounded-lg text-white text-[14px] sm:text-[16px] font-[500] cursor-pointer transition-colors whitespace-nowrap ${updateLoading ? "bg-[#5f54ff87] cursor-not-allowed" : "bg-[#675FFF] hover:bg-[#5E54FF]"
                  }`}
              >
                {updateLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <p>{t("settings.tab_1_list.processing")}</p>
                    <span className="loader" />
                  </div>
                ) : (
                  t("settings.tab_1_list.save_changes")
                )}
              </button>

            </div>

          </div>
          <hr className="border border-gray-200 w-full px-4 mx-4" />
          <div className="flex flex-col gap-4 w-full">
            {/* Profile Avatar */}


            <div className=" grid md:grid-cols-[40%_60%] gap-4 md:items-center justify-left px-4 py-2">
              <div>
                <h3 className="text-[#1E1E1E] text-[16px] font-[600]">{t("settings.tab_1_list.profile_picture")}</h3>
                <p className="text-[#5A687C] text-[14px] font-[400]">
                  {t("settings.tab_1_list.profile_picture_description")}
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
                        {t("settings.tab_1_list.upload_new")}
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
                        {t("settings.tab_1_list.delete")}
                      </button>
                    </div>

                    <div className="w-full flex justify-center">
                      <p className="text-xs text-[#5A687C] mt-1 text-center w-full">
                        {t("settings.tab_1_list.recommended_size")}
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
            <div className="w-full p-5">
              <div className="grid md:grid-cols-[40%_60%] gap-4 pb-2">
                <div>
                  <h3 className="text-[#1E1E1E] text-[16px] font-[600]">
                    {t("settings.tab_1_list.personal_information")}
                  </h3>
                  <p className="text-[#5A687C] text-sm">
                    {t("settings.tab_1_list.personal_information_description")}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-[#1E1E1E]">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="font-medium text-sm text-[#868C98]">
                      {t("settings.tab_1_list.full_name")}
                    </label>
                    <input
                      type="text"
                      value={fullNameInput}
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
                              placeholder={t("settings.tab_1_list.search")}
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
                              <p className="text-center text-sm text-gray-500 py-2">{t("settings.tab_1_list.no_results_found")}</p>
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
              <div className="w-full p-5 mt-6">
                <div className="grid md:grid-cols-[40%_60%] gap-4">
                  <div>
                    <h3 className="text-[#1E1E1E] text-[16px] font-[600]">{t("settings.tab_1_list.security")}</h3>
                    <p className="text-[#5A687C] text-sm">
                      {t("settings.tab_1_list.security_description")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[14px] text-[#1E1E1E] font-[500]">{t("settings.tab_1_list.your_password")}</p>
                        <p className="text-sm text-[#5A687C]">
                          {t("settings.tab_1_list.last_changed_password")} {userDetails?.user?.passwordUpdatedAt
                            ? getPasswordLastChanged(userDetails.user.passwordUpdatedAt)
                            : 'Never'}
                        </p>
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
                        {t("settings.tab_1_list.change_password")}
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
      return (
        <div className="flex py-6 pr-4 flex-col h-full w-full gap-6">
          <Plan t={t} teamMembersData={teamMembersData} setActiveSidebarItem={setActiveSidebarItem} showPlanPopup={showPlanPopup} setShowPlanPopup={setShowPlanPopup} handleAddSeatsTeam={handleAddSeatsTeam} setShowManagePlan={setShowManagePlan} setSearchParams={setSearchParams} />
        </div>
      );
    }

    else if (activeSidebarItem === "team") {
      const paginatedMembers = getPaginatedTeamMembers();
      const totalTeamPages = Math.ceil(getFilteredAndSearchedMembers().length / teamRowsPerPage);
      const avatarColors = [
        'bg-[#EBEFFF] text-[#675FFF]',
        'bg-[#EBF9EE] text-[#34C759]',
        'bg-[#FFF4E6] text-[#FF9500]',
        'bg-[#F3E8FF] text-[#9B59B6]',
        'bg-[#FFE6E6] text-[#FF6B6B]'
      ];

      return (
        <>
          <div className="w-full pr-4 flex flex-col h-full gap-6 px-6 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-md text-2xl font-[600] text-[#1E1E1E]">
                  {t("settings.tab_3")}
                </h1>
                <p className="text-[14px] sm:text-[16px] text-[#5A687C] font-[400]">
                  Manage access and collaboration across your workspace.
                </p>
              </div>
              <button
                className="flex items-center gap-2 bg-[#675FFF] hover:bg-[#5E54FF] text-white rounded-lg px-4 py-2 text-[14px] font-[500] transition-colors"
                onClick={handleInviteTeam}
              >
                <Plus className="w-4 h-4" />
                {t("settings.tab_3_list.invite_team_member")}
              </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Filter Tabs */}
              <div className="flex gap-2 bg-[#F2F2F7] p-0.5 rounded-lg border border-[#E6E6E7]">
                {roleOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleChangeRole(option.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${role === option.key
                      ? "bg-white text-[#1E1E1E] shadow-sm"
                      : "bg-transparent text-[#5A687C]"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Search and Refresh */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black stroke-black w-4 h-4"
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    value={teamSearchQuery}
                    onChange={(e) => {
                      setTeamSearchQuery(e.target.value);
                      setTeamCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 border bg-white border-[#E1E4EA] rounded-lg text-[14px] text-black focus:outline-none focus:border-[#675FFF] w-full sm:w-[200px]"
                  />
                </div>
                <button
                  onClick={() => renderTeamMembers(role)}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E1E4EA] rounded-lg text-black text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  <RefreshIcon />
                  {t("refresh")}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#D6D6D6] overflow-hidden">
              <div className="overflow-x-auto overflow-y-visible">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead className="bg-[#F7F7F8]">
                    <tr>
                      <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">{t("settings.tab_3_list.name")}</th>
                      <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">{t("settings.tab_3_list.email")}</th>
                      <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">{t("settings.tab_3_list.role")}</th>
                      <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">{t("settings.tab_3_list.agents")}</th>
                      <th className="px-6 text-start py-3 text-[16px] font-[400] text-[#5A687C]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">
                    {teamMembersDataLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center">
                          <span className="loader" />
                        </td>
                      </tr>
                    ) : teamMembersDataMessage ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[#5A687C]">
                          {teamMembersDataMessage}
                        </td>
                      </tr>
                    ) : paginatedMembers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[#5A687C]">
                          {t("no_data")}
                        </td>
                      </tr>
                    ) : (
                      paginatedMembers.map((user, index) => {
                        const userInitials = `${user.firstName?.[0] || user.email[0]}${user.lastName?.[0] || ''}`.toUpperCase();
                        const colorIndex = index % avatarColors.length;
                        const userAvatarColor = avatarColors[colorIndex];

                        return (
                          <tr key={index} className="text-left">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`flex justify-center items-center rounded-full h-[40px] w-[40px] text-[16px] font-[600] ${userAvatarColor}`}>
                                  {userInitials}
                                </div>
                                <span className="text-[16px] font-[600] text-[#1E1E1E]">
                                  {user.firstName || ''} {user.lastName || ''}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[16px] font-[400] text-[#1E1E1E]">
                              {user.email}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[14px] font-[500] text-[#5A687C] bg-[#EFF0F2] border border-[#E0E2E5]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5A687C]"></span>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {[0, 1, 2].map((agentIndex) => (
                                  <div
                                    key={agentIndex}
                                    className={`flex justify-center items-center rounded-full h-[32px] w-[32px] text-[12px] font-[600] ${getAvatarColor(agentIndex)}`}
                                  >
                                    {String.fromCharCode(65 + agentIndex)}
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 relative">
                              {user?.role?.toLowerCase() !== 'admin' && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDropdownClick(index, e);
                                      setUserToEdit(user);
                                    }}
                                    className="text-black shadow-sm hover:text-gray-700 cursor-pointer border border-[#D6D6D6] rounded-lg p-2"
                                  >
                                    <EllipsisIcon className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Dropdown rendered outside table */}
              {activeDropdown !== null && paginatedMembers[activeDropdown] && (() => {
                const selectedUser = paginatedMembers[activeDropdown];
                return (
                  <div
                    ref={dropdownRef}
                    data-dropdown
                    className="fixed px-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-[9999]"
                    style={{
                      top: `${dropdownPosition.top}px`,
                      right: `${dropdownPosition.right}px`
                    }}
                  >
                    <div className="py-1">
                      <button
                        className="block group w-full cursor-pointer text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUserToEdit(selectedUser);
                          setEditMemberFormData({
                            email: selectedUser.email,
                            role: selectedUser.role
                          });
                          setEditMemberErrors({});
                          setEditTeamMemberModal(true);
                          setActiveDropdown(null);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className='group-hover:hidden'><Edit /></div>
                          <div className='hidden group-hover:block'><Edit status={true} /></div>
                          <span>{t("edit")}</span>
                        </div>
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
                          <div className="flex items-center gap-2">
                            {<Delete />}
                            <span>{t("delete")}</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Pagination */}
              {getFilteredAndSearchedMembers().length > 0 && (
                <div className="flex items-center justify-between bg-[#F7F7F8] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTeamCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={teamCurrentPage === 1}
                      className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ‹ Prev
                    </button>
                    {getTeamPageNumbers().map((page, idx) => (
                      <button
                        key={idx}
                        onClick={() => typeof page === "number" && setTeamCurrentPage(page)}
                        disabled={page === "..."}
                        className={`rounded-lg px-3 py-1 text-sm cursor-pointer ${page === teamCurrentPage
                          ? "bg-[#675FFF] text-white"
                          : page === "..."
                            ? "text-[#000000] cursor-default"
                            : "border border-[#D6D6D6] text-[#000000] bg-white hover:bg-gray-50"
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setTeamCurrentPage((prev) => Math.min(totalTeamPages, prev + 1))}
                      disabled={teamCurrentPage === totalTeamPages}
                      className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next ›
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <button
                      onClick={() => {
                        setTeamRowsPerPage(5);
                        setTeamCurrentPage(1);
                      }}
                      className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] cursor-pointer ${teamRowsPerPage === 5 ? "bg-white" : "bg-transparent hover:bg-white"
                        }`}
                    >
                      5 rows
                    </button>
                    <button
                      onClick={() => {
                        setTeamRowsPerPage(10);
                        setTeamCurrentPage(1);
                      }}
                      className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] cursor-pointer ${teamRowsPerPage === 10 ? "bg-white" : "bg-transparent hover:bg-white"
                        }`}
                    >
                      10
                    </button>
                    <button
                      onClick={() => {
                        setTeamRowsPerPage(20);
                        setTeamCurrentPage(1);
                      }}
                      className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] cursor-pointer ${teamRowsPerPage === 20 ? "bg-white" : "bg-transparent hover:bg-white"
                        }`}
                    >
                      20
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {open && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E1E4EA]">
                  <h2 className="text-[#1E1E1E] font-semibold text-xl leading-6">
                    {t("settings.tab_3_list.invite_team_member")}
                  </h2>
                  <button
                    onClick={() => {
                      setInviteErrors({})
                      setOpen(false)
                    }}
                    className="cursor-pointer p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 pt-4">
                  {/* Email and Invite As - Side by Side */}
                  <div className="flex gap-4 mb-4">
                    {/* Email Input */}
                    <div className="w-[70%] space-y-1.5">
                      <label className="block text-sm font-medium text-[#868C98]">
                        {t("settings.tab_3_list.email_address")}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder={t("settings.tab_3_list.email_placeholder")}
                          value={emailInvite}
                          onChange={(e) => {
                            setEmailInvite(e.target.value)
                            setInviteErrors({})
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#675FFF]/20 transition-all ${inviteErrors.email
                            ? "border-red-300 focus:border-red-500"
                            : "border-[#E1E4EA] focus:border-[#675FFF]"
                            }`}
                        />
                      </div>
                      {inviteErrors.email && (
                        <p className="text-xs text-red-500 mt-1">{inviteErrors.email}</p>
                      )}
                      {/* Add New Member Link */}
                      <button
                        onClick={() => {
                          setEmailInvite("")
                          setEmailInviteRole("")
                          setInviteErrors({})
                        }}
                        className="flex items-center gap-1 cursor-pointer text-[#675FFF] text-sm font-medium mt-6 hover:text-[#5E54FF] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add New Member
                      </button>
                    </div>

                    {/* Role Dropdown */}
                    <div className="w-[30%] space-y-1.5">
                      <label className="block text-sm font-medium text-[#868C98]">
                        {t("settings.tab_3_list.invite_as")}
                      </label>
                      <SelectDropdown
                        name="role_options"
                        options={roleEmailOptions}
                        value={emailInviteRole}
                        onChange={(updated) => {
                          setEmailInviteRole(updated)
                        }}
                        placeholder={t("brain_ai.select")}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Error/Success Messages */}
                  <div className="space-y-1 mb-4">
                    {inviteErrors.limit && (
                      <p className="text-xs text-red-500">{inviteErrors.limit}</p>
                    )}
                    {inviteErrors.inviteError && (
                      <p className="text-xs text-red-500">{inviteErrors.inviteError}</p>
                    )}
                    {success.emailInvite && (
                      <p className="text-xs text-green-600">{success.emailInvite}</p>
                    )}
                  </div>

                  {/* Footer Actions */}

                </div>
                <div className="flex gap-3 justify-end px-6 pb-4 pt-4 border-t border-[#E1E4EA]">
                  <button
                    onClick={() => {
                      setOpen(false)
                      setInviteErrors({})
                    }}
                    className="px-4 py-2.5 text-base font-medium text-[#5A687C] cursor-pointer bg-white border border-[#E1E4EA] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t("settings.tab_1_list.cancel")}
                  </button>
                  <button
                    onClick={handleInvite}
                    disabled={inviteEmailLoading}
                    className={`px-4 py-2.5 text-base cursor-pointer font-medium text-white rounded-lg transition-all ${inviteEmailLoading
                      ? "bg-[#5f54ff98] cursor-not-allowed"
                      : "bg-[#5E54FF] hover:bg-[#4d44e6] active:scale-[0.98]"
                      }`}
                  >
                    {inviteEmailLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="loader" />
                        <span>{t("processing")}</span>
                      </div>
                    ) : (
                      t("settings.tab_3_list.invite")
                    )}
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
      <div className="flex flex-col gap-6 w-full px-3 py-2">
        <div className="overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-6 ">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[#1E1E1E] dark:text-white">{t("settings.tab_1_list.general_settings")}</h2>
              <p className="text-md text-[#5A687C] dark:text-gray-400 max-w-2xl">
                {t("settings.tab_1_list.general_settings_description")}
              </p>
              {success.general && (
                <p className="text-sm text-green-600 dark:text-green-400">{success.general}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetGeneralSettings}
                className="px-2.5 py-1.5 bg-white dark:bg-[#2D3151] border border-[#E1E4EA] dark:border-[#2D3151] rounded-lg text-[#000000] dark:text-gray-300 text-[14px] sm:text-[16px] font-[500] cursor-pointer hover:bg-[#F9F8FF] dark:hover:bg-[#1E2A4A] transition-colors whitespace-nowrap"
              >
                {t("settings.tab_1_list.discard")}
              </button>
              <button
                type="button"
                onClick={handleSaveGeneralSettings}
                className={`px-2.5 py-1.5 rounded-lg text-white text-[14px] sm:text-[16px] font-[500] cursor-pointer transition-colors whitespace-nowrap ${updateLoading ? "bg-[#5f54ff87] cursor-not-allowed" : "bg-[#675FFF] hover:bg-[#5E54FF]"}`}
              >
                {t("settings.tab_1_list.save_changes")}
              </button>
            </div>
          </div>

          <hr className="border border-gray-200 dark:border-[#2D3151] w-full mx-4"></hr>

          <div className="px-6 py-6 space-y-8">

            <div className="w-full">
              <section className="flex flex-col gap-4">
                <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-6 border-b border-[#d1d3db] dark:border-[#2D3151] pb-2">
                  <div className="min-w-[260px] max-w-sm">
                    <h3 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">{t("settings.tab_1_list.theme_appearance")}</h3>
                    <p className="text-sm text-[#7A8298] dark:text-gray-400">{t("settings.tab_1_list.theme_appearance_description")}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 lg:gap-6">
                    {THEME_OPTIONS.map((option) => {
                      const selected = generalSettings.theme === option.key
                      const getThemeLabel = (key) => {
                        switch(key) {
                          case "light":
                            return t("settings.tab_1_list.theme_light_mode");
                          case "dark":
                            return t("settings.tab_1_list.theme_dark_mode");
                          case "system":
                            return t("settings.tab_1_list.theme_system_mode");
                          default:
                            return option.label;
                        }
                      };
                      return (
                        <div key={option.key} className="flex flex-col items-center gap-3 w-[150px] sm:w-[170px]">
                          <button
                            type="button"
                            onClick={() => handleGeneralSettingChange("theme", option.key)}
                            className={`w-full transition-all duration-300 ${selected ? "border-[#675FFF] shadow-[0_10px_30px_rgba(79,70,229,0.15)]" : ""
                              }`}
                          >
                            <div
                              className={`w-full h-24 rounded-lg border transition-all duration-300 scale-105 ${selected 
                                ? "border-[#C7CCF7] dark:border-[#675FFF]" 
                                : "border-[#E4E6EF] dark:border-[#2D3151] hover:border-[#C7CCF7] dark:hover:border-[#675FFF] hover:shadow-lg hover:shadow-[#675FFF]/20 dark:hover:shadow-[#675FFF]/30"
                              } relative overflow-hidden transform hover:scale-110 cursor-pointer`}
                            >
                              <img
                                src={
                                  option.key === "light"
                                    ? LightTheme
                                    : option.key === "dark"
                                      ? DarkTheme
                                      : SystemTheme
                                }
                                alt={getThemeLabel(option.key)}
                                className="w-full h-full object-cover rounded-md transition-transform duration-300 hover:scale-110"
                              />
                            </div>
                          </button>

                          <span className={`text-sm font-semibold transition-colors duration-300 ${selected ? "text-[#1E1E1E] dark:text-white" : "text-[#6C7489] dark:text-gray-400"}`}>
                            {getThemeLabel(option.key)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            </div>

            {/* ---------------- ACCOUNT PREFERENCES ---------------- */}
            <div className="w-full">
              <section className="flex flex-col gap-6">
                <div className="w-full flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 border-b border-[#d1d3db] dark:border-[#2D3151] pb-2">
                  <div className="min-w-[240px] max-w-sm">
                    <h3 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">{t("settings.tab_1_list.account_preferences")}</h3>
                    <p className="text-sm text-[#7A8298] dark:text-gray-400">
                      {t("settings.tab_1_list.account_preferences_description")}
                    </p>
                  </div>

                  <div className="flex-1">
                    <div className="p-4">
                      <div className="flex flex-col gap-4">

                        {/* Language */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium text-[#7A8298] dark:text-gray-400">{t("settings.tab_1_list.language")}</label>
                          <div className="relative">
                            <select
                              value={generalSettings.language}
                              onChange={(e) => handleGeneralSettingChange("language", e.target.value)}
                              className="w-full appearance-none rounded-xl border border-[#E1E4EA] dark:border-[#2D3151] bg-white dark:bg-[#2D3151] px-4 py-2 text-sm text-[#1E1E1E] dark:text-white focus:border-[#675FFF] focus:outline-none"
                            >
                              {LANGUAGE_OPTIONS.map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                              ))}
                            </select>
                            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA8BC] pointer-events-none" />
                          </div>
                        </div>

                        {/* Timezone */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium text-[#7A8298] dark:text-gray-400">{t("settings.tab_1_list.timezone")}</label>
                          <div className="relative">
                            <select
                              value={generalSettings.timezone}
                              onChange={(e) => handleGeneralSettingChange("timezone", e.target.value)}
                              className="w-full appearance-none rounded-xl border border-[#E1E4EA] dark:border-[#2D3151] bg-white dark:bg-[#2D3151] px-4 py-2 text-sm text-[#1E1E1E] dark:text-white focus:border-[#675FFF] focus:outline-none"
                            >
                              {TIMEZONE_OPTIONS.map((zone) => (
                                <option key={zone} value={zone}>{zone}</option>
                              ))}
                            </select>
                            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA8BC] pointer-events-none" />
                          </div>
                        </div>

                        {/* Date Format */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium text-[#7A8298] dark:text-gray-400">{t("settings.tab_1_list.date_format")}</label>
                          <div className="relative">
                            <select
                              value={generalSettings.dateFormat}
                              onChange={(e) => handleGeneralSettingChange("dateFormat", e.target.value)}
                              className="w-full appearance-none rounded-xl border border-[#E1E4EA] dark:border-[#2D3151] bg-white dark:bg-[#2D3151] px-4 py-2 text-sm text-[#1E1E1E] dark:text-white focus:border-[#675FFF] focus:outline-none"
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
            </div>

            {/* ---------------- NOTIFICATIONS & ALERTS ---------------- */}
            <div className="w-full">
              <section className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="min-w-[240px] max-w-sm">
                    <h3 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">{t("settings.tab_1_list.notifications_alerts")}</h3>
                    <p className="text-sm text-[#7A8298] dark:text-gray-400">
                      {t("settings.tab_1_list.notifications_alerts_description")}
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    {[
                      {
                        key: "pushEnabled",
                        title: t("settings.tab_1_list.push_notifications"),
                        description: t("settings.tab_1_list.push_notifications_description"),
                      },
                      {
                        key: "emailEnabled",
                        title: t("settings.tab_1_list.email_notification"),
                        description: t("settings.tab_1_list.email_notification_description"),
                      },
                    ].map((item) => {
                      const enabled = generalSettings[item.key]
                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-5"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#1E1E1E] dark:text-white">{item.title}</p>
                            <p className="text-sm text-[#7A8298] dark:text-gray-400">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#675FFF]">
                              {enabled ? t("settings.tab_1_list.on") : t("settings.tab_1_list.off")}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleGeneralSettingChange(item.key, !enabled)}
                              className={`inline-flex h-5 w-10 items-center rounded-full transition-colors ${enabled ? "bg-[#675FFF]" : "bg-[#D7DBE6]"
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-1"
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
      <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} ><BsThreeDots size={24} className="text-[#1e1e1e] dark:text-white" /></div>
      <div className="flex flex-col md:flex-row items-start lg:gap-8 relative w-full">
        {/* Sidebar Navigation */}
        <div className="lg:flex hidden flex-col bg-white dark:bg-[#1A1C23] gap-4 border border-[#D6D6D6] dark:border-[#2D3151] min-w-[272px] rounded-r-2xl rounded-tl-none rounded-bl-none fixed h-[calc(100vh-89px)] mt-2 mb-8 overflow-y-auto">
          <div className=''>
            <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => navigate("/dashboard")}>
              {/* <MdOutlineKeyboardArrowLeft size={25} /> */}
              <div className="flex gap-4 pl-4 items-center h-[57px]">
                {/* <LeftArrow /> */}
                <h1 className="text-[20px] font-[600] dark:text-white">{t("settings.label")}</h1>
              </div>
            </div>
            <hr className='text-[#E1E4EA] dark:border-[#2D3151]' />
          </div>
          <div className="flex inter flex-col w-full px-3 items-start gap-2 relative">
            <div
              onClick={() => handleSelect("my-profile")}
              className={`flex group justify-center md:justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === "my-profile" ? "bg-[#F0EFFF] dark:bg-[#2D1F5F]" : "hover:bg-[#F9F8FF] dark:hover:bg-[#2D3151]"
                }`}
            >
              {activeSidebarItem === "my-profile" ? <CircleUserRound className="text-[#675FFF]" /> : <div className="flex items-center gap-2"><div className='group-hover:hidden'><CircleUserRound className="text-gray-500 dark:text-gray-400" /></div> <div className='hidden group-hover:block'><CircleUserRound className="dark:text-white" /></div></div>}
              <span className={`font-[400] text-[16px] ${activeSidebarItem === "my-profile" ? "text-black dark:text-white" : "text-black dark:text-gray-300 group-hover:text-[#1E1E1E] dark:group-hover:text-white"}`}>
                My Profile
              </span>
            </div>

            <div
              onClick={() => handleSelect("general")}
              className={`flex group justify-center md:justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === "general" ? "bg-[#F0EFFF] dark:bg-[#2D1F5F]" : "hover:bg-[#F9F8FF] dark:hover:bg-[#2D3151]"
                }`}
            >
              {activeSidebarItem === "general" ? <House className="text-[#675FFF]" status={activeSidebarItem === "general"} /> :
                <div className="flex items-center gap-2"><div className='group-hover:hidden'>{<House className="text-gray-500 dark:text-gray-400" status={activeSidebarItem === "general"} />}</div> <div className='hidden group-hover:block'>{<House hover={true} className="dark:text-white" />}</div></div>}
              <span className={`font-[400] text-[16px] ${activeSidebarItem === "general" ? "text-black dark:text-white" : "text-black dark:text-gray-300 group-hover:text-[#1E1E1E] dark:group-hover:text-white"}`}>
                {t("settings.tab_1")}
              </span>
            </div>

            <div
              onClick={() => handleSelect("billing")}
              className={`flex group justify-center md:justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === "billing" ? "bg-[#EDF3FF] dark:bg-[#1E2A4A]" : "hover:bg-[#F9F8FF] dark:hover:bg-[#2D3151]"
                }`}
            >
              {activeSidebarItem === "billing" ? <Wallet className="text-[#675FFF]" status={activeSidebarItem === "billing"} /> :
                <div className="flex items-center gap-2"><div className='group-hover:hidden'>{<Wallet className="text-gray-500 dark:text-gray-400" status={activeSidebarItem === "billing"} />}</div> <div className='hidden group-hover:block'>{<Wallet hover={true} className="dark:text-white" />}</div></div>}
              <span className={`font-[400] text-[16px] ${activeSidebarItem === "billing" ? "text-black dark:text-white" : "text-black dark:text-gray-300 group-hover:text-[#1E1E1E] dark:group-hover:text-white"}`}>
                {t("settings.tab_2")}
              </span>
            </div>

            <div
              onClick={() => handleSelect("team")}
              className={`flex group justify-center md:justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === "team" ? "bg-[#EDF3FF] dark:bg-[#1E2A4A]" : "hover:bg-[#F9F8FF] dark:hover:bg-[#2D3151]"
                }`}
            >
              {activeSidebarItem === "team" ? <UsersRound className="text-[#675FFF]" status={activeSidebarItem === "team"} /> :
                <div className="flex items-center gap-2"><div className='group-hover:hidden'><UsersRound className="text-gray-500 dark:text-gray-400" status={activeSidebarItem === "team"} /></div> <div className='hidden group-hover:block'><UsersRound hover={true} className="dark:text-white" /></div></div>}
              <span className={`font-[400] text-[16px] ${activeSidebarItem === "team" ? "text-black dark:text-white" : "text-black dark:text-gray-300 group-hover:text-[#1E1E1E] dark:group-hover:text-white"}`}>
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
          <div className="bg-white dark:bg-[#1A1C23] rounded-2xl w-full max-w-[514px] p-6 relative shadow-lg">
            <button
              className="absolute cursor-pointer top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => {
                setDeleteModalStatus(false)
              }}
            >
              <X size={20} />
            </button>

            <div className="flex flex-col justify-around h-[150px] text-center">
              <h2 className="text-[20px] font-semibold text-[#1E1E1E] dark:text-white mb-4">
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
                  className="w-full cursor-pointer bg-white dark:bg-[#2D3151] text-[#5A687C] dark:text-gray-300 border-[1.5px] border-[#E1E4EA] dark:border-[#2D3151] font-[500] test-[16px] px-5 py-2 rounded-lg"
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
          <div className="flex flex-col relative bg-white dark:bg-[#1A1C23] gap-8 w-full max-h-[80%] overflow-auto py-8 rounded-t-[20px]">
            <button
              className="absolute top-4 cursor-pointer right-4 text-[#1e1e1e] dark:text-white"
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
                  <h1 className="text-[20px] font-[600] dark:text-white">{t("settings.label")}</h1>
                </div>
              </div>
              <hr className='text-[#E1E4EA] dark:border-[#2D3151]' />
            </div>
            <div className="flex inter flex-col w-full px-5 items-start gap-2 relative">
              <div
                onClick={() => {
                  handleSelect("my-profile")
                  setSideBarStatus(false)
                }}
                className={`flex group justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "my-profile" ? "bg-[#F0EFFF] dark:bg-[#2D1F5F]" : "hover:bg-[#F9F8FF] dark:hover:bg-[#2D3151]"
                  }`}
              >
                {activeSidebarItem === "my-profile" ? <ProfileEditIcon /> : <div className="flex items-center gap-2"><div className='group-hover:hidden'><ProfileEditIcon /></div> <div className='hidden group-hover:block'><ProfileEditIcon /></div></div>}
                <span className={`font-[400] text-[16px] ${activeSidebarItem === "my-profile" ? "text-[#675FFF] dark:text-[#675FFF]" : "text-[#5A687C] dark:text-gray-300 group-hover:text-[#1E1E1E] dark:group-hover:text-white"}`}>
                  My Profile
                </span>
              </div>

              <div
                onClick={() => {
                  handleSelect("general")
                  setSideBarStatus(false)
                }}
                className={`flex group justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "general" ? "bg-[#F0EFFF] dark:bg-[#2D1F5F]" : "hover:bg-[#F9F8FF] dark:hover:bg-[#2D3151]"
                  }`}
              >
                {activeSidebarItem === "general" ? <Settings status={activeSidebarItem === "general"} /> : <div className="flex items-center gap-2"><div className='group-hover:hidden'>{<Settings status={activeSidebarItem === "general"} />}</div> <div className='hidden group-hover:block'>{<Settings hover={true} />}</div></div>}
                <span className={`font-[400] text-[16px] ${activeSidebarItem === "general" ? "text-[#675FFF] dark:text-[#675FFF]" : "text-[#5A687C] dark:text-gray-300 group-hover:text-[#1E1E1E] dark:group-hover:text-white"}`}>
                  {t("settings.tab_1")}
                </span>
              </div>

              <div
                onClick={() => {
                  handleSelect("billing")
                  setSideBarStatus(false)
                }}
                className={`flex group justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "billing" ? "bg-[#EDF3FF] dark:bg-[#1E2A4A]" : "hover:bg-[#F9F8FF] dark:hover:bg-[#2D3151]"
                  }`}
              >
                {activeSidebarItem === "billing" ? <PlanIcon status={activeSidebarItem === "billing"} /> :
                  <div className="flex items-center gap-2"><div className='group-hover:hidden'>{<PlanIcon status={activeSidebarItem === "billing"} />}</div> <div className='hidden group-hover:block'>{<PlanIcon hover={true} />}</div></div>}
                <span className={`font-[400] text-[16px] ${activeSidebarItem === "billing" ? "text-[#675FFF] dark:text-[#675FFF]" : "text-[#5A687C] dark:text-gray-300 group-hover:text-[#1E1E1E] dark:group-hover:text-white"}`}>
                  {t("settings.tab_2")}
                </span>
              </div>

              <div
                onClick={() => {
                  handleSelect("team")
                  setSideBarStatus(false)
                }}
                className={`flex group justify-start items-center gap-1.5 p-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === "team" ? "bg-[#EDF3FF] dark:bg-[#1E2A4A]" : "hover:bg-[#F9F8FF] dark:hover:bg-[#2D3151]"
                  }`}
              >
                {activeSidebarItem === "team" ? <TeamMemberIcon status={activeSidebarItem === "team"} /> :
                  <div className="flex items-center gap-2"><div className='group-hover:hidden'><TeamMemberIcon status={activeSidebarItem === "team"} /></div> <div className='hidden group-hover:block'><TeamMemberIcon hover={true} /></div></div>}
                <span className={`font-[400] text-[16px] ${activeSidebarItem === "team" ? "text-[#675FFF] dark:text-[#675FFF]" : "text-[#5A687C] dark:text-gray-300 group-hover:text-[#1E1E1E] dark:group-hover:text-white"}`}>
                  {t("settings.tab_3")}
                </span>
              </div>
            </div>
          </div>
        </div>
      }
      {successModalStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1A1C23] rounded-2xl w-full max-w-[457px] p-6 relative shadow-lg">
            <button
              className="absolute top-4 cursor-pointer  right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
                className={`px-4 py-2 rounded-lg text-white font-[500] ${updatePasswordLoading ? "bg-[#5f54ff87] cursor-not-allowed" : "bg-[#675FFF] hover:bg-[#5E54FF]"
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