// Full-featured modal with pixel-perfect layout, click-outside-to-close, and toggle logic.
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, MoreHorizontal, X, Search, Plus, CheckCircle, Check, Upload, UploadCloudIcon, UploadIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { BritishFlag, Delete, DocIcon, Duplicate, Edit, Notes, TestCall, Ellipsis } from "../icons/icons";
import { useDispatch } from "react-redux";
import { getNavbarData } from "../store/navbarSlice";
import uk_flag from "../assets/images/uk_flag.png"
import us_flag from "../assets/images/us_flag.png"
import fr_flag from "../assets/images/fr_flag.png"
import { FaChevronDown } from "react-icons/fa";
import { createPhoneCampaign } from "../api/callAgent";
import { getCallAgent, getPhoneNumber, getPhoneCampaign, deletePhoneCampaign, getPhoneCampaignDetail, updatePhoneCampaign, duplicateCampaign } from "../api/callAgent";
import { format } from "date-fns";
import { SelectDropdown } from "./Dropdown";
import { getLists } from "../api/brainai";
import { DateFormat } from "../utils/TimeFormat";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import googleCalendarIcon from "../assets/svg/google_calender.svg"
import CalendlyIcon from "../assets/svg/calendly.svg"
import ToastModal from "./ToastModal";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Helper function to capitalize first letter
const capitalizeFirst = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const renderColor = (text) => {
  const normalizedText = text ? text.toLowerCase() : '';
  switch (normalizedText) {
    case "issue detected":
      return `text-[#FF9500] bg-[#FFF4E6] border-[#FF9500]`;
    case "running":
      return `text-[#675FFF] bg-[#F0EFFF] border-[#675FFF]`;
    case "pending":
      return `text-[#5A687C] bg-[#E9E9E9] border-[#5A687C]`;
    case "terminated":
      return `text-[#FF2D55] bg-[#FFEAEE] border-[#FF2D55]`;
    default:
      return `text-[#34C759] bg-[#EBF9EE] border-[#34C759]`;
  }
};

const countries = [
  { name: "United States", code: "US", dial_code: "+1", flag: us_flag },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: uk_flag },
  { name: "France", code: "FR", dial_code: "+33", flag: fr_flag },
  // Add more countries as needed
];

export default function CallCampaign() {

  const staticData = [
    {
      label: "Total calls",
      value: "0"
    },
    {
      label: "Unsuccessful calls",
      value: "0"
    },
    {
      label: "Average call duration",
      value: "0"
    },
    {
      label: "Total call time",
      value: "00:00:00"
    }
  ]

  const [showModal, setShowModal] = useState(false); // edit/view modal
  const [showNewCampaignForm, setShowNewCampaignForm] = useState(false); // inline create form
  const [stepCampaignOpen, setStepCampaignOpen] = useState(true);
  const [stepAgentOpen, setStepAgentOpen] = useState(false);

  // Local form state for "Create a new agent" step (UI only for now)
  const [newAgentForm, setNewAgentForm] = useState({
    agent_id: "",
    agent_name: "",
    max_call_time: "",
    language: "",
    voice: "",
    knowledge_base: "",
    behavior: "",
    pullsFromBrain: true,
    tools: ["google_calendar"],
    agentPrompt: "",
  });

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const { t } = useTranslation();

  const agentLanguageOptions = [
    { key: "English", label: t("phone.english") },
    { key: "French", label: t("phone.french") },
  ];

  const agentVoiceOptions = [
    { key: "male", label: t("phone.male") },
    { key: "female", label: t("phone.female") },
  ];

  const knowledgeBaseOptions = [
    { key: "none", label: t("phone.none") },
    { key: "sales_playbook", label: t("phone.sales_playbook") },
    { key: "product_docs", label: t("phone.product_docs") },
  ];

  const behaviorOptions = [
    { key: "wait_to_speak", label: t("phone.wait_for_the_person_to_speak") },
    { key: "start_pitch", label: t("phone.start_the_pitch_immediately") },
  ];

  const toolOptions = [
    { key: "google_calendar", label: "Google Calendar", icon: googleCalendarIcon },
    { key: "calendly", label: "Calendly", icon: CalendlyIcon },
  ];

  const toggleToolSelection = (toolKey) => {
    setNewAgentForm((prev) => {
      const alreadySelected = prev.tools.includes(toolKey);
      return {
        ...prev,
        tools: alreadySelected
          ? prev.tools.filter((t) => t !== toolKey)
          : [...prev.tools, toolKey],
      };
    });
  };

  // File upload handlers
  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
      // You can add file validation here (size, type, etc.)
      console.log("File selected:", file.name, file.size, file.type);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const [secondModel, setSecondModel] = useState(false);
  const [toggleTom, setToggleTom] = useState(true);
  const modalRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewReportModel, setViewReportModel] = useState(false);
  const [editData, setEditData] = useState();
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [dropdownAgent, setDropdownAgent] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dispatch = useDispatch()
  const [agents, setAgent] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);
  const [contactLists, setContactLists] = useState([]);
  const [showListTargetSelector, setShowListTargetSelector] = useState(false);
  const [toast, setToast] = useState({ open: false, type: 'success', title: '', description: '', highlightText: '' });
  const targetListRef = useRef()
  const navigator = useNavigate()

  const [filters, setFilters] = useState({
    country: "",
    language: "",
    voice: ""
  });
  const [searchQuery, setSearchQuery] = useState("");

  const countryOptions = [
    { key: "US", label: t("phone.united_states") },
    { key: "GB", label: t("phone.united_kingdom") },
    { key: "FR", label: t("phone.france") }
  ];

  const languageOptions = [
    { key: "english", label: t("phone.english") },
    { key: "french", label: t("phone.french") },
    { key: "spanish", label: t("phone.spanish") }
  ];
  const voiceOptions = [
    { key: "male", label: `${t("male")}` },
    { key: "female", label: `${t("female")}` },
  ];

  const tagsOptions = [{ label: `${t("interested")}`, key: "interested" }, { label: `${t("not_interested")}`, key: "not_interested" },
  { label: `${t("Voicemail")}`, key: "voicemail" }, { label: `${t("appointment.no_answer")}`, key: "no_answer" }, { label: `${t("recall_request")}`, key: "recall_ask" }
  ]

  const [campaign, setCampaign] = useState(
    {
      campaign_name: "",
      campaign_type: "",
      language: "",
      voice: "",
      choose_calendar: "",
      max_call_time: "",
      tag: "",
      target_lists: "",
      agent: "",
      country: countries[0]?.code || "", // Initialize with default country (France)
      phone_number: "",
      catch_phrase: "",
      call_script: "",
      status: "",
      tom_engages: false
    }

  );

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true)



  const [errors, setErrors] = useState({
    campaign_name: "",
    campaign_type: "",
    language: "",
    voice: "",
    choose_calendar: "",
    max_call_time: "",
    tag: "",
    target_lists: "",
    agent: "",
    country: "",
    phone_number: "",
    catch_phrase: "",
    call_script: "",
    status: ""
  });



  const validateForm = () => {
    const newErrors = {};

    // Required fields based on DB schema (nullable=False)
    if (!campaign.campaign_name || !campaign.campaign_name.trim()) newErrors.campaign_name = t("phone.campaign_name_required");
    if (!campaign.language) newErrors.language = "Language is required.";
    if (!campaign.voice) newErrors.voice = "Voice selection is required.";
    if (!campaign.target_lists) newErrors.target_lists = t("phone.atleast_one_target_required");
    if (!campaign.agent) newErrors.agent = t("phone.agent_validation");
    if (!campaign.country) newErrors.country = "Country is required.";
    if (!campaign.phone_number || !campaign.phone_number.trim()) newErrors.phone_number = t("phone.phone_number_validation");
    if (!campaign.catch_phrase || !campaign.catch_phrase.trim()) newErrors.catch_phrase = t("phone.catch_phase");
    if (!campaign.call_script || !campaign.call_script.trim()) newErrors.call_script = t("phone.call_script_validation");

    // Optional fields with validation rules (nullable=True)
    // campaign_type is optional (nullable=True) - no validation needed
    // choose_calendar is optional (nullable=True) - no validation needed
    // max_call_time is optional (nullable=True) - no validation needed
    // tag is not in DB schema, so we can ignore it
    // status has default="pending" - no validation needed

    // Min length validations
    if (campaign.catch_phrase && campaign.catch_phrase.trim().length < 20) newErrors.catch_phrase = t("phone.min_20_char_required_validation");
    if (campaign.call_script && campaign.call_script.trim().length < 50) newErrors.call_script = t("phone.max_50_char_required_validation");

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleGetListsContacts = async () => {
    try {
      const response = await getLists("phone", '');
      if (response?.status === 200) {
        console.log(response?.data?.lists)
        const data = response?.data?.lists
        if (data?.length > 0) {
          const formatData = data.map((e) => ({
            label: e.listName,
            key: e.id
          }))
          setContactLists(formatData)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }


  const removeRow = async (id) => {
    try {
      // Find the campaign before deleting to show in toast
      const campaignToDelete = campaigns.find(c => c.id === id);
      const campaignName = campaignToDelete?.campaign_name || 'campaign';

      const response = await deletePhoneCampaign(id);
      if (response.status === 200) {
        console.log("Campaign deleted successfully");
        handleGetPhoneCampaign();
        setDeleteRow(null);

        // Show success toast
        setToast({
          open: true,
          type: 'success',
          title: 'Campaign Deleted Successfully',
          description: `Your campaign "${campaignName}" has been deleted.`,
          highlightText: campaignName
        });
      } else {
        console.error("Failed to delete campaign:", response);
        setDeleteRow(null);
        setToast({
          open: true,
          type: 'error',
          title: 'Delete Failed',
          description: 'We couldn\'t delete the campaign. Please try again.',
        });
      }

    } catch (error) {
      console.error("Error removing row:", error);
      setDeleteRow(null);
      setToast({
        open: true,
        type: 'error',
        title: 'Delete Failed',
        description: 'We couldn\'t delete the campaign. Please try again.',
      });
    }
  }

  const handleCampaignForm = (e) => {
    const { name, value } = e.target;
    setCampaign((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ""
      }));
    }

  }

  const handleGetPhoneAgent = async () => {
    try {
      const response = await getCallAgent();

      if (response.status === 200) {
        setAgent(response.data.agents_info || []);
      } else {
        console.error("Failed to fetch agents:", response);
      }

    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  }

  const resetForm = () => {
    const defaultCountry = countries[0]; // France (+33)
    setSelectedCountry(defaultCountry);
    setCampaign({
      campaign_name: "",
      campaign_type: "",
      language: "",
      voice: "",
      choose_calendar: "",
      max_call_time: "",
      tag: '',
      target_lists: "",
      agent: "",
      country: defaultCountry.code,
      phone_number: "",
      catch_phrase: "",
      call_script: "",
      status: "",
      tom_engages: false
    })
  }

  useEffect(() => {
    if (campaigns?.length > 0) {
      setLoading(false)
    }
  }, [campaigns])


  const handleGetPhoneCampaign = async () => {
    try {
      const response = await getPhoneCampaign();

      if (response.status === 200) {
        setCampaigns(response.data.campaigns_info);
        if (response?.data?.campaigns_info?.length === 0) {
          setLoading(false)
        }
      } else {
        setLoading(false)
        console.error("Failed to fetch phone campaigns:", response);
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching phone campaigns:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    if (validateForm()) {
      try {
        // Prepare campaign data matching DB schema
        const campaignData = {
          campaign_name: campaign.campaign_name,
          language: campaign.language,
          voice: campaign.voice,
          target_lists: parseInt(campaign.target_lists), // Integer, required
          country: campaign.country,
          phone_number: campaign.phone_number,
          status: campaign.status || "pending", // default="pending"
          catch_phrase: campaign.catch_phrase,
          call_script: campaign.call_script,
          tom_engages: campaign.tom_engages || false, // Boolean, default=False
          agent: parseInt(campaign.agent) // Integer, ForeignKey
        };

        // Only include optional fields if they have values
        if (campaign.campaign_type) {
          campaignData.campaign_type = campaign.campaign_type;
        }
        if (campaign.choose_calendar) {
          campaignData.choose_calendar = campaign.choose_calendar;
        }
        if (newAgentForm.max_call_time && newAgentForm.max_call_time !== '' && newAgentForm.max_call_time !== null) {
          const maxCallTimeValue = parseInt(newAgentForm.max_call_time);
          if (!isNaN(maxCallTimeValue)) {
            campaignData.max_call_time = maxCallTimeValue;
          }
        }

        console.log("Submitting campaign data:", campaignData);
        const response = await createPhoneCampaign(campaignData);
        console.log("API Response:", response);

        if (response && response.status === 201) {
          console.log("Campaign created successfully:", response.data)
          const campaignName = campaign.campaign_name || 'campaign';
          setToast({
            open: true,
            type: 'success',
            title: 'Campaign Created Successfully',
            description: `Your campaign "${campaignName}" has been created.`,
            highlightText: campaignName
          });
          // Close inline form if open
          setShowNewCampaignForm(false);
          // Also close modal if it was used (edit flow)
          setShowModal(false);
          resetForm();
          handleGetPhoneCampaign();
        } else {
          console.error("Failed to create campaign:", response);
          setToast({
            open: true,
            type: 'error',
            title: 'Failed to Create Campaign',
            description: 'We couldn\'t create the campaign. Please try again.',
          });
        }
      } catch (error) {
        console.error("Error creating campaign:", error);
        setToast({
          open: true,
          type: 'error',
          title: 'Failed to Create Campaign',
          description: 'We couldn\'t create the campaign. Please try again.',
        });
      }
    } else {
      console.log("Validation failed");
      // Re-run validation to see current errors (since setState is async)
      const newErrors = {};
      if (!campaign.campaign_name || !campaign.campaign_name.trim()) newErrors.campaign_name = t("phone.campaign_name_required");
      if (!campaign.language) newErrors.language = "Language is required.";
      if (!campaign.voice) newErrors.voice = "Voice selection is required.";
      if (!campaign.target_lists) newErrors.target_lists = t("phone.atleast_one_target_required");
      if (!campaign.agent) newErrors.agent = t("phone.agent_validation");
      if (!campaign.country) newErrors.country = "Country is required.";
      if (!campaign.phone_number || !campaign.phone_number.trim()) newErrors.phone_number = t("phone.phone_number_validation");
      if (!campaign.catch_phrase || !campaign.catch_phrase.trim()) newErrors.catch_phrase = t("phone.catch_phase");
      if (!campaign.call_script || !campaign.call_script.trim()) newErrors.call_script = t("phone.call_script_validation");
      if (campaign.catch_phrase && campaign.catch_phrase.trim().length < 20) newErrors.catch_phrase = t("phone.min_20_char_required_validation");
      if (campaign.call_script && campaign.call_script.trim().length < 50) newErrors.call_script = t("phone.max_50_char_required_validation");
      console.log("Validation Errors:", newErrors);
      console.log("Campaign Data:", campaign);
    }
    setLoader(false);
  };


  const handleGetPhoneCampaignDetail = async (id) => {
    try {
      const response = await getPhoneCampaignDetail(id);
      if (response.status === 200) {
        setCampaign(response.data.campaign_data);
        setShowModal(true)
      } else {
        console.error("Failed to fetch campaign details:", response);
      }
    } catch (error) {
      console.error("Error fetching campaign details:", error);
    } finally {
      setActiveDropdown(null);
    }
  }

  const handleEditCampaign = async () => {
    try {
      if (!validateForm()) {
        console.log("Validation failed");
        return;
      }
      // Prepare campaign data matching DB schema
      const campaignData = {
        campaign_name: campaign.campaign_name,
        language: campaign.language,
        voice: campaign.voice,
        target_lists: parseInt(campaign.target_lists),
        country: campaign.country,
        phone_number: campaign.phone_number,
        status: campaign.status || "pending",
        catch_phrase: campaign.catch_phrase,
        call_script: campaign.call_script,
        tom_engages: campaign.tom_engages || false,
        agent: parseInt(campaign.agent)
      };

      // Only include optional fields if they have values
      if (campaign.campaign_type) {
        campaignData.campaign_type = campaign.campaign_type;
      }
      if (campaign.choose_calendar) {
        campaignData.choose_calendar = campaign.choose_calendar;
      }
      if (newAgentForm.max_call_time && newAgentForm.max_call_time !== '' && newAgentForm.max_call_time !== null) {
        const maxCallTimeValue = parseInt(newAgentForm.max_call_time);
        if (!isNaN(maxCallTimeValue)) {
          campaignData.max_call_time = maxCallTimeValue;
        }
      }

      const response = await updatePhoneCampaign(campaignData);
      if (response.status === 200) {
        console.log("Campaign details:", response.data);
        const campaignName = campaign.campaign_name || 'campaign';
        setToast({
          open: true,
          type: 'success',
          title: 'Campaign Updated Successfully',
          description: `Your campaign "${campaignName}" has been updated.`,
          highlightText: campaignName
        });
        setShowModal(false);
        setEditData();
        resetForm();
        handleGetPhoneCampaign();
      } else {
        console.error("Failed to update campaign:", response);
        setToast({
          open: true,
          type: 'error',
          title: 'Failed to Update Campaign',
          description: 'We couldn\'t update the campaign. Please try again.',
        });
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
      setToast({
        open: true,
        type: 'error',
        title: 'Failed to Update Campaign',
        description: 'We couldn\'t update the campaign. Please try again.',
      });
    } finally {
      setActiveDropdown(null);
    }
  }

  const handleGetPhoneNumber = async () => {
    try {
      const response = await getPhoneNumber();
      // console.log("Response from getPhoneNumber API:", response);
      if (response.status === 200) {
        setPhoneNumbers(response.data.phone_numbers || []);
      } else {
        console.error("Failed to fetch phone numbers:", response);
      }
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
    }
  }

  const handleDuplicate = async (id) => {
    try {
      // Find the campaign before duplicating to show in toast
      const campaignToDuplicate = campaigns.find(c => c.id === id);
      const campaignName = campaignToDuplicate?.campaign_name || 'campaign';

      const response = await duplicateCampaign(id);

      if (response.status === 201) {
        console.log("Campaign duplicated successfully:", response.data);
        handleGetPhoneCampaign();
        setActiveDropdown(null);

        // Show success toast
        setToast({
          open: true,
          type: 'success',
          title: 'Campaign Duplicated Successfully',
          description: `Your campaign "${campaignName}" has been duplicated.`,
          highlightText: campaignName
        });
      } else {
        console.error("Failed to duplicate campaign:", response);
        setActiveDropdown(null);
        setToast({
          open: true,
          type: 'error',
          title: 'Duplicate Failed',
          description: 'We couldn\'t duplicate the campaign. Please try again.',
        });
      }
    } catch (error) {
      console.error("Error duplicating campaign:", error);
      setActiveDropdown(null);
      setToast({
        open: true,
        type: 'error',
        title: 'Duplicate Failed',
        description: 'We couldn\'t duplicate the campaign. Please try again.',
      });
    }

  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
        setEditData();
        resetForm();
      }
    }
    if (showModal) document.addEventListener("mousedown", handleClickOutside);
    handleGetPhoneNumber();
    handleGetPhoneAgent();
    handleGetPhoneCampaign();
    handleGetListsContacts();
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  // Close country dropdown when clicking outside
  useEffect(() => {
    function handleClickOutsideCountry(event) {
      if (isCountryOpen && !event.target.closest('.country-selector')) {
        setIsCountryOpen(false);
      }
    }
    if (isCountryOpen) {
      document.addEventListener("mousedown", handleClickOutsideCountry);
    }
    return () => document.removeEventListener("mousedown", handleClickOutsideCountry);
  }, [isCountryOpen]);


  const CustomSelector = ({ options, setShowSelector, value = [], onChange, ref }) => {

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowSelector(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleChange = (e) => {
      const newSelection = value.includes(e)
        ? value.filter((d) => d !== e)
        : [...value, e];
      onChange(newSelection);
    };
    return (
      <div className="bg-white rounded-lg shadow-lg">
        <div className="max-h-60 overflow-auto">
          <ul className="py-1 px-2 flex flex-col gap-1 my-1">
            {options?.length > 0 && options.map((e) => (
              <li
                key={e.key}
                onClick={() => toggleChange(e.key)}
                className={`py-2 px-4 rounded-lg cursor-pointer flex items-center hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF] gap-2 ${value.includes(e.key)
                  ? 'bg-[#F4F5F6] rounded-lg text-[#675FFF]' : 'text-[#5A687C]'
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${value.includes(e.key)
                    ? 'border-[#675FFF] bg-[#675FFF]'
                    : 'border-[#E1E4EA]'
                    }`}
                >
                  {value.includes(e.key) && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <span>{e.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
    setDropdownAgent(null);
  };

  const handleDropdownClick = (index, agent, event) => {
    event.stopPropagation();
    event.preventDefault();

    if (activeDropdown === index) {
      closeDropdown();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownWidth = 192;
    const horizontalPadding = 16;
    const verticalGap = 8;

    const preferredLeft = rect.right - dropdownWidth;
    const maxLeft = window.innerWidth - dropdownWidth - horizontalPadding;
    const left = Math.max(horizontalPadding, Math.min(preferredLeft, maxLeft)) + window.scrollX;
    const top = rect.bottom + verticalGap + window.scrollY;

    setDropdownPosition({ top, left });
    setDropdownAgent(agent);
    setActiveDropdown(index);
  };

  return (
    <div>
      {!showModal ?
        <div className="p-12 flex flex-col gap-4 w-full h-full overflow-auto">
          {/* Header */}
          {!showNewCampaignForm ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-[22px] font-[500] text-[#1E1E1E]">{t("phone.call_campaigns")}</h1>
                <p className="text-sm md:text-[14px] text-[#5A687C] font-[400] mt-2">
                  {t("phone.manage_and_track_your_outbound_and_inbound_calling_campaigns") || "Manage and track your outbound and inbound calling campaigns."}
                </p>
              </div>
              <button
                className="bg-[#675FFF] cursor-pointer text-white font-medium px-4 py-1.5 rounded-lg shadow-sm hover:bg-[#5E54FF] transition-colors flex items-center gap-2 w-fit"
                onClick={() => {
                  dispatch(getNavbarData("Tom, Phone"))
                  setEditData();
                  resetForm();
                  setShowNewCampaignForm(true);
                  setStepCampaignOpen(true);
                  setStepAgentOpen(false);
                }}
              >
                <Plus className="w-4 h-4" />
                {t("phone.add_new_campaign") || "Add New Campaign"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-[22px] font-[500] text-[#1E1E1E]">
                  {t("phone.new_campaign") || "New Campaign"}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowNewCampaignForm(false);
                    resetForm();
                  }}
                  className="px-5 py-1.5 cursor-pointer text-md text-[#1E1E1E] bg-white border border-[#E1E4EA] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t("phone.cancel") || "Cancel"}
                </button>
                <button
                  className="px-5 py-1.5 cursor-pointer text-md text-white rounded-lg bg-[#5E54FF] hover:bg-[#5a4aff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loader}
                  onClick={handleSubmit}
                >
                  {t("phone.save_campaign")}
                </button>
              </div>
            </div>
          )}

          {/* Inline New Campaign Form (Accordion steps) */}
          {showNewCampaignForm && (
            <div className="bg-white border border-[#E1E4EA] rounded-2xl shadow-sm mb-4">
              {/* Step 1: New Campaign */}
              <div className="border-b border-[#E1E4EA]">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 cursor-pointer"
                  onClick={() => setStepCampaignOpen((prev) => !prev)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center rounded-md bg-[#675FFF] text-white text-sm">
                      1
                    </div>
                    <span className="text-sm sm:text-md font-normal text-[#1E1E1E]">
                      {t("phone.new_campaign") || "New Campaign"}
                    </span>
                  </div>
                  <span className="text-[#5A687C] text-lg flex items-center">
                    {stepCampaignOpen ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </span>

                </button>
              </div>

              {stepCampaignOpen && (
                <div className="px-4 sm:px-6 pb-6 space-y-6 mt-4">
                  {/* Grid with campaign name and agent name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Campaign Name */}
                    <div className="flex flex-col gap-1">
                      <label className="block text-[14px] font-[400] text-[#868C98] mb-1">{t("emailings.campaign_name")}</label>
                      <input
                        type="text"
                        placeholder={t("phone.enter_campaign_name")}
                        className={`w-full px-4 py-2 bg-white border rounded-lg ${errors.campaign_name ? 'border-red-500' : 'border-[#E1E4EA]'} focus:outline-none focus:border-[#675FFF]`}
                        name="campaign_name"
                        value={campaign.campaign_name || ''}
                        onChange={handleCampaignForm}
                      />
                      {errors.campaign_name && <p className="text-red-500 text-sm mt-1">{errors.campaign_name}</p>}
                    </div>

                    {/* Agent Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[14px] font-[400] text-[#868C98] mb-1">
                        {t("phone.agent_name")}
                      </label>
                      <SelectDropdown
                        name="agent"
                        options={agents.map(agent => ({ key: agent.id.toString(), label: agent.agent_name }))}
                        placeholder={t("phone.select_agent")}
                        value={campaign.agent ? campaign.agent.toString() : ''}
                        onChange={(value) => {
                          const selectedAgent = agents.find(agent => agent.id.toString() === value);
                          const agentId = value ? parseInt(value) : '';

                          // Helper function to capitalize first letter
                          const capitalizeFirst = (str) => {
                            if (!str) return '';
                            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
                          };

                          // Auto-fill campaign_type, phone_number, language, and voice based on agent's data
                          if (selectedAgent && selectedAgent.phone_numbers) {
                            const agentPhoneNumber = selectedAgent.phone_numbers; // e.g., "+17019976600"

                            // Find matching phone number in phoneNumbers array using agent's phone_numbers
                            const matchingPhone = phoneNumbers.find(
                              phone => phone.phone_number === agentPhoneNumber
                            );

                            if (matchingPhone) {
                              // Get direction from matching phone number and use it as campaign_type
                              const direction = matchingPhone.direction; // "inbound" or "outbound"
                              const phoneNumberStr = matchingPhone.phone_number;

                              // Parse phone number to extract country code and format
                              const parsedPhone = parsePhoneNumberFromString(phoneNumberStr);

                              // Find country based on dial code
                              if (parsedPhone) {
                                const countryCode = parsedPhone.countryCode;
                                const dialCode = `+${countryCode}`;
                                const matchedCountry = countries && countries.length > 0 ? countries.find(
                                  country => country && country.dial_code === dialCode
                                ) : null;

                                const formattedPhoneNumber = parsedPhone.nationalNumber || phoneNumberStr;

                                if (matchedCountry) {
                                  setSelectedCountry(matchedCountry);
                                }

                                // Update all values in a single state update
                                setCampaign((prev) => ({
                                  ...prev,
                                  agent: agentId,
                                  country: matchedCountry?.code || prev.country,
                                  campaign_type: direction, // Use direction from getPhoneNumber response
                                  phone_number: formattedPhoneNumber,
                                  language: selectedAgent.language ? capitalizeFirst(selectedAgent.language) : '',
                                  voice: selectedAgent.voice || ''
                                }));
                              } else {
                                // If parsing fails, use the original values
                                setCampaign((prev) => ({
                                  ...prev,
                                  agent: agentId,
                                  campaign_type: direction, // Use direction from getPhoneNumber response
                                  phone_number: phoneNumberStr,
                                  language: selectedAgent.language ? capitalizeFirst(selectedAgent.language) : '',
                                  voice: selectedAgent.voice || ''
                                }));
                              }
                            } else {
                              // If no matching phone found in phoneNumbers array, try to parse from agent's phone_numbers
                              const phoneNumberStr = agentPhoneNumber;
                              const parsedPhone = parsePhoneNumberFromString(phoneNumberStr);

                              if (parsedPhone) {
                                const countryCode = parsedPhone.countryCode;
                                const dialCode = `+${countryCode}`;
                                const matchedCountry = countries && countries.length > 0 ? countries.find(
                                  country => country && country.dial_code === dialCode
                                ) : null;

                                if (matchedCountry) {
                                  setSelectedCountry(matchedCountry);
                                  setCampaign((prev) => ({
                                    ...prev,
                                    agent: agentId,
                                    country: matchedCountry.code,
                                    phone_number: parsedPhone.nationalNumber || phoneNumberStr,
                                    language: selectedAgent.language ? capitalizeFirst(selectedAgent.language) : '',
                                    voice: selectedAgent.voice || ''
                                  }));
                                } else {
                                  setCampaign((prev) => ({
                                    ...prev,
                                    agent: agentId,
                                    phone_number: parsedPhone.nationalNumber || phoneNumberStr,
                                    language: selectedAgent.language ? capitalizeFirst(selectedAgent.language) : '',
                                    voice: selectedAgent.voice || ''
                                  }));
                                }
                              } else {
                                // If parsing fails completely, just set agent and phone number as-is
                                setCampaign((prev) => ({
                                  ...prev,
                                  agent: agentId,
                                  phone_number: phoneNumberStr,
                                  language: selectedAgent.language ? capitalizeFirst(selectedAgent.language) : '',
                                  voice: selectedAgent.voice || ''
                                }));
                              }
                            }
                          } else {
                            // Reset if no agent selected
                            setCampaign((prev) => ({
                              ...prev,
                              agent: agentId || '',
                              campaign_type: '',
                              phone_number: '',
                              language: '',
                              voice: ''
                            }));
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Grid with campaign type and phone number - Now in the same row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Campaign Type */}
                    <div className="gap-1">
                      <label className="block text-[14px] font-[400] text-[#868C98] mb-1">{t("phone.campaign_type")}</label>
                      <input
                        type="text"
                        readOnly
                        className="w-full px-4 py-2 border border-[#E1E4EA] rounded-lg bg-[#F5F5F5] text-[#5A687C] cursor-not-allowed"
                        value={campaign.campaign_type === 'inbound' ? t("phone.inbound_call") : campaign.campaign_type === 'outbound' ? t("phone.outbound_call") : ""}
                        placeholder={t("phone.select_campaign_type") || "Select Campaign Type"}
                      />
                      {errors.campaign_type && <p className="text-red-500 text-sm mt-1">{errors.campaign_type}</p>}
                    </div>

                    {/* Number linked to the campaign */}
                    <div>
                      <label className="block text-[14px] font-[400] text-[#868C98] mb-1">{t("phone.number_linked_to_the_campaign")}</label>
                      <div className="flex group items-center gap-2 border border-[#E1E4EA] rounded-lg px-4 py-2.5 bg-[#F5F5F5]">
                        <div className="relative country-selector">
                          <div className="w-fit flex justify-between gap-2 items-center cursor-not-allowed opacity-75">
                            <img src={selectedCountry?.flag} alt={selectedCountry?.name} width={20} />
                            <span className="text-[14px] text-[#1E1E1E]">{selectedCountry?.dial_code}</span>
                          </div>
                        </div>
                        <input
                          type="tel"
                          name="phone_number"
                          readOnly={true}
                          value={campaign.phone_number || ''}
                          onChange={handleCampaignForm}
                          placeholder="(555) 000-0000"
                          className="w-full outline-none text-[14px] bg-[#F5F5F5] text-[#5A687C] cursor-not-allowed"
                        />
                      </div>
                      {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                    </div>

                    {/* Tags selection */}
                    <div>
                      <label className="block text-[14px] font-[400] text-[#868C98] mb-1">{t("phone.select_your_tag")}</label>
                      <div className="flex flex-wrap gap-2">
                        {tagsOptions.map((e) => {
                          const isSelected = campaign.tag === e.key;
                          return (
                            <button
                              key={e.key}
                              type="button"
                              onClick={() => {
                                setCampaign((prev) => ({ ...prev, tag: e.key }))
                                setErrors((prev) => ({ ...prev, tag: "" }))
                              }}
                              className={`flex items-center cursor-pointer gap-2 px-2 py-2 rounded-lg border transition-all ${isSelected
                                ? 'bg-white border-[#675FFF] text-[#1E1E1E]'
                                : 'bg-white border-[#E1E4EA] text-[#1E1E1E] hover:border-[#675FFF]'
                                }`}
                            >
                              {isSelected ? (
                                <div className="w-[18px] h-[18px] bg-[#675FFF] rounded-sm flex items-center justify-center flex-shrink-0">
                                  <Check size={14} className="text-white" strokeWidth={3} />
                                </div>
                              ) : (
                                <div className="w-[18px] h-[18px] border-2 border-[#D6D6D6] rounded-sm flex-shrink-0"></div>
                              )}
                              <span className={`text-[14px] ${isSelected ? 'font-[600]' : 'font-[400]'}`}>{e.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.tag && <p className="text-red-500 text-sm mt-1">{errors.tag}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Create a new agent */}
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 cursor-pointer border-t border-[#E1E4EA]"
                onClick={() => setStepAgentOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center rounded-md bg-[#2d7e12] text-[#fafbfc] text-md">
                    2
                  </div>
                  <span className="text-sm sm:text-md font-normal text-[#1E1E1E]">
                    {t("phone.create_new_agent") || "Create a new agent"}
                  </span>
                </div>
                <span className="text-[#5A687C] text-lg flex items-center">
                  {stepAgentOpen ? (
                    <ChevronUpIcon className="w-5 h-5" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5" />
                  )}
                </span>
              </button>

              {stepAgentOpen && (
                <div className="px-4 sm:px-6 pb-6 pt-2">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                    <div>
                      <label className="block text-[14px] font-[400] text-[#868C98] mb-1">{t("phone.language")}</label>
                      <input
                        type="text"
                        readOnly
                        className="w-full px-4 py-2 border border-[#E1E4EA] rounded-lg bg-[#F5F5F5] text-[#5A687C] cursor-not-allowed"
                        value={campaign.language || ''}
                        placeholder={t("phone.select_language")}
                      />
                      {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
                    </div>

                    <div>
                      <label className="block text-[14px] font-[400] text-[#868C98] mb-1">{t("phone.voice")}</label>
                      <input
                        type="text"
                        readOnly
                        className="w-full px-4 py-2 border border-[#E1E4EA] rounded-lg bg-[#F5F5F5] text-[#5A687C] cursor-not-allowed"
                        value={campaign.voice || ''}
                        placeholder={t("phone.select_voice")}
                      />
                      {errors.voice && <p className="text-red-500 text-sm mt-1">{errors.voice}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                    <div className="flex flex-col gap-1">
                      <label className="text-[14px] font-[400] text-[#868C98] mb-1">
                        {t("phone.target_list") || "Target List"}
                      </label>
                      <SelectDropdown
                        name="target_lists"
                        options={contactLists}
                        placeholder={t("phone.select_target_list") || "Select Target List"}
                        value={campaign.target_lists || ''}
                        onChange={(value) => handleCampaignForm({ target: { name: 'target_lists', value } })}
                        errors={errors}
                      />
                      {errors.target_lists && <p className="text-red-500 text-sm mt-1">{errors.target_lists}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[14px] font-[400] text-[#868C98] mb-1">
                        {t("phone.maximum_call_time_in_minutes")}
                      </label>
                      <input
                        type="number"
                        value={newAgentForm.max_call_time}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\d+$/.test(value)) {
                            setNewAgentForm((prev) => ({ ...prev, max_call_time: value }));
                          }
                        }}
                        placeholder={t("phone.enter_number")}
                        className="w-full px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg focus:outline-none focus:border-[#675FFF] text-[14px] appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>



                  {/* Row 2: Language + Voice */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                    <div className="flex flex-col gap-1">
                      <label className="text-[14px] font-[400] text-[#868C98] mb-1">
                        {t("phone.status") || "Status"}
                      </label>
                      <SelectDropdown
                        name="status"
                        options={[
                          { key: "active", label: t("phone.active") || "Active" },
                          { key: "inactive", label: t("phone.inactive") || "Inactive" }
                        ]}
                        placeholder={t("phone.select_status") || "Select Status"}
                        value={campaign.status || ''}
                        onChange={(value) => handleCampaignForm({ target: { name: 'status', value } })}
                        errors={errors}
                      />
                      {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                    </div>

                    <div className="mb-4">
                      <p className="text-[14px] font-[400] text-[#868C98] mb-2">{t("phone.select_tools")}</p>
                      <div className="flex flex-wrap gap-2">
                        {toolOptions.map((tool) => {
                          const active = newAgentForm.tools.includes(tool.key);
                          return (
                            <button
                              key={tool.key}
                              type="button"
                              onClick={() => toggleToolSelection(tool.key)}
                              className={`px-3 py-2.5 rounded-md border shadow-sm text-sm font-[500] cursor-pointer transition-colors flex items-center gap-2 ${active
                                ? "bg-white border-[#675FFF] text-[#1E1E1E]"
                                : "bg-white border-[#E1E4EA] text-[#5A687C] hover:border-[#675FFF]"
                                }`}
                            >
                              {tool.icon && (
                                <img
                                  src={tool.icon}
                                  alt={`${tool.label} icon`}
                                  className="w-4 h-4"
                                />
                              )}
                              {tool.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>


                  {/* AI Brain toggle */}
                  <div className="flex items-center justify-start px-2 py-3 mb-4">
                    <button
                      type="button"
                      className={`w-10 h-5 rounded-full relative transition-colors duration-300 cursor-pointer ${newAgentForm.pullsFromBrain ? "bg-[#675FFF]" : "bg-gray-300"
                        }`}
                      onClick={() =>
                        setNewAgentForm((prev) => ({
                          ...prev,
                          pullsFromBrain: !prev.pullsFromBrain,
                        }))
                      }
                    >
                      <span
                        className={`block w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${newAgentForm.pullsFromBrain ? "translate-x-5" : "translate-x-0.5"
                          }`}
                      />
                    </button>
                    <div className="flex flex-col">

                      <span className="text-sm px-3 font-[400] text-[#1E1E1E]">
                        {t("phone.the_agent_pulls_information_directly_from_the_ai_brain")}
                      </span>
                    </div>
                  </div>

                  {/* Catch Phrase - Textarea */}
                  <div className="flex flex-col gap-1 mb-4">
                    <label className="text-[14px] font-[400] text-[#868C98] mb-1">
                      {t("phone.catch_phrase") || "Catch Phrase"}
                    </label>
                    <textarea
                      rows={4}
                      name="catch_phrase"
                      value={campaign.catch_phrase || ''}
                      onChange={handleCampaignForm}
                      placeholder={t("phone.enter_catch_phrase") || "Enter catch phrase"}
                      className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:border-[#675FFF] text-[14px] text-[#1E1E1E] ${errors.catch_phrase ? 'border-red-500' : 'border-[#E1E4EA]'}`}
                    />
                    {errors.catch_phrase && <p className="text-red-500 text-sm mt-1">{errors.catch_phrase}</p>}
                  </div>

                  {/* Call Script - Textarea */}
                  <div className="flex flex-col gap-1 mb-4">
                    <label className="text-[14px] font-[400] text-[#868C98] mb-1">
                      {t("phone.call_script") || "Call Script"}
                    </label>
                    <textarea
                      rows={6}
                      name="call_script"
                      value={campaign.call_script || ''}
                      onChange={handleCampaignForm}
                      placeholder={t("phone.enter_call_script") || "Enter call script"}
                      className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:border-[#675FFF] text-[14px] text-[#1E1E1E] ${errors.call_script ? 'border-red-500' : 'border-[#E1E4EA]'}`}
                    />
                    {errors.call_script && <p className="text-red-500 text-sm mt-1">{errors.call_script}</p>}
                  </div>

                  {/* Import file + Agent prompt */}
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-[12px] font-[500] text-[#868C98] mb-1">
                        {t("phone.import_file")}
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.csv"
                      />
                      <div
                        onClick={handleUploadAreaClick}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border border-dashed min-h-[200px] border-[#E1E4EA] rounded-2xl flex flex-col items-center justify-center px-4 py-8 text-center cursor-pointer transition-colors ${isDragOver ? 'border-[#675FFF] bg-[#F1EEFF]' : 'hover:border-[#675FFF] hover:bg-[#FAFAFA]'
                          } ${selectedFile ? 'border-[#675FFF]' : ''}`}
                      >
                        {selectedFile ? (
                          <div className="flex flex-col items-center gap-2 w-full">
                            <div className="flex items-center gap-2 bg-[#F1EEFF] px-3 py-2 rounded-lg w-full max-w-[90%]">
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-[500] text-[#1E1E1E] truncate">
                                  {selectedFile.name}
                                </p>
                                <p className="text-[11px] text-[#868C98]">
                                  {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="ml-2 p-1 hover:bg-[#E1E4EA] rounded transition-colors"
                              >
                                <X size={16} className="text-[#5A687C]" />
                              </button>
                            </div>
                            <p className="text-[12px] text-[#868C98] mt-2">
                              {t("phone.click_to_change_file")}
                            </p>
                          </div>
                        ) : (
                          <>
                            <Upload className="mb-2 text-[#9CA3AF] w-6 h-6" />
                            <p className="text-[13px] text-[#5A687C]">
                              <span className="text-[#675FFF] font-[500]">{t("phone.choose_a_file")}</span> {t("phone.or_drag_and_drop_it_here")}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 ">
                      <p className="text-[12px] font-[500] text-[#868C98] mb-1 ">
                        {t("phone.agent_prompt")}
                      </p>
                      <textarea
                        rows={5}
                        value={newAgentForm.agentPrompt}
                        onChange={(e) =>
                          setNewAgentForm((prev) => ({ ...prev, agentPrompt: e.target.value }))
                        }
                        placeholder={t("phone.enter_agent_prompt")}
                        className="w-full px-4 py-3 border min-h-[200px] border-[#E1E4EA] rounded-2xl resize-none focus:outline-none focus:border-[#675FFF] text-[13px] text-[#1E1E1E]"
                      />
                    </div>
                  </div> */}
                </div>
              )}
            </div>
          )}

          {/* Search and Filters (hidden while creating a new campaign) */}
          {!showNewCampaignForm && (
            <div className="flex flex-col sm:flex-row gap-3 mb-3 justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-0 max-w-[270px] rounded-lg ">
                <Search className="absolute left-3 top-1/2 transform  -translate-y-1/2 text-[#5A687C] w-4 h-4" />
                <input
                  type="text"
                  placeholder={t("phone.search_name_or_phone_number")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E1E4EA] rounded-lg bg-white focus:outline-none focus:border-[#675FFF] text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3 flex-shrink-0">
                <div className="w-full sm:w-[140px] text-[13px] font-[500]">
                  <SelectDropdown
                    name="country"
                    options={countryOptions}
                    placeholder={t("phone.country")}
                    value={filters.country}
                    onChange={(value) => setFilters({ ...filters, country: value })}
                  />
                </div>

                <div className="w-full sm:w-[140px] text-[13px] font-[500]">
                  <SelectDropdown
                    name="language"
                    options={languageOptions}
                    placeholder={t("phone.language")}
                    value={filters.language}
                    onChange={(value) => setFilters({ ...filters, language: value })}
                  />
                </div>

                <div className="w-full sm:w-[100px] text-[13px] font-[500]">
                  <SelectDropdown
                    name="voice"
                    options={voiceOptions}
                    placeholder={t("phone.voice")}
                    value={filters.voice}
                    onChange={(value) => setFilters({ ...filters, voice: value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Table (hidden while creating a new campaign) */}
          {!showNewCampaignForm && (
            <div className="rounded-2xl border border-[#D6D6D6] overflow-auto mb-2 w-full">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead className="bg-[#F7F7F8]">
                    <tr className="text-[#5A687C]">
                      <th className="px-6 text-start py-3 text-[16px] font-[400]">{t("emailings.campaign_name")}</th>
                      <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("appointment.agent_name")}</th>
                      <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("phone.creation_date")}</th>
                      <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("phone.language")}</th>
                      <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("phone.total_call")}</th>
                      <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("phone.status")}</th>
                      <th className="px-6 text-center py-3 text-[16px] font-[400]">{t("phone.action")}</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">
                    {loading ? (
                      <tr className="h-34">
                        <td></td>
                        <td></td>
                        <td className="text-center"><span className="loader" /></td>
                        <td ></td>
                        <td></td>
                        <td></td>
                        <td ></td>
                      </tr>
                    ) : (() => {
                      // Filter campaigns based on search query and filters
                      const filteredCampaigns = campaigns.filter((campaign) => {
                        // Search filter
                        if (searchQuery) {
                          const query = searchQuery.toLowerCase();
                          const matchesSearch =
                            campaign.campaign_name?.toLowerCase().includes(query) ||
                            campaign.agent_name?.toLowerCase().includes(query) ||
                            campaign.phone_number?.toLowerCase().includes(query);
                          if (!matchesSearch) return false;
                        }

                        // Language filter
                        if (filters.language && campaign.language?.toLowerCase() !== filters.language.toLowerCase()) {
                          return false;
                        }

                        // Voice filter (if campaign has voice field)
                        if (filters.voice && campaign.voice?.toLowerCase() !== filters.voice.toLowerCase()) {
                          return false;
                        }

                        return true;
                      });

                      return filteredCampaigns.length !== 0 ? (
                        filteredCampaigns.map((agent, index) => (
                          <tr key={agent.id} className="text-[16px] text-[#1E1E1E]">
                            <td className="px-4 py-4 text-[14px] text-black font-[400] text-start">{agent.campaign_name}</td>
                            <td className="px-4 py-4 text-[14px] text-black font-[400] text-start">{agent.agent_name}</td>
                            <td className="px-4 py-4 text-[14px] text-black font-[400] text-start whitespace-nowrap">{DateFormat(agent.creation_date)}</td>
                            <td className="px-4 py-4 text-[14px] text-black font-[400] text-start">{capitalizeFirst(agent.language)}</td>
                            <td className="px-10 py-4 text-[14px] font-[500] text-black text-start ">{agent.total_calls}</td>
                            <td className="px-4 py-4 text-start">
                              <span className={`inline-block border ${renderColor(agent.status)} text-sm font-medium px-3 py-1 rounded-full`}>
                                {capitalizeFirst(agent.status)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center whitespace-nowrap">
                              <div className='flex items-center justify-center'>
                                <button onClick={(e) => handleDropdownClick(index, agent, e)} className="p-2 rounded-lg relative">
                                  <div className='bg-white cursor-pointer border border-[#D6D6D6] shadow-sm p-2 rounded-lg'><Ellipsis className="text-black" /></div>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="h-34">
                          <td colSpan="7" className="text-center text-[#1E1E1E]">
                            {t("phone.no_call_listed")}
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>

                <div className="flex items-center justify-between bg-[#F7F7F8] px-4 py-3">
                  {/* pagination + row controls */}
                  <div className="flex items-center gap-2">
                    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer">
                      ‹ {t("phone.prev")}
                    </button>
                    <button className="bg-[#675FFF] text-white rounded-lg px-3 py-1 text-sm cursor-pointer">
                      1
                    </button>
                    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer">
                      2
                    </button>
                    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer">
                      3
                    </button>
                    <span className="text-[#000000] text-sm">…</span>
                    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer">
                      10
                    </button>
                    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer">
                      {t("phone.next")} ›
                    </button>
                  </div>

                  {/* Right side – rows per page */}
                  <div className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] bg-white cursor-pointer">5 {t("phone.rows")}</button>
                    <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] hover:bg-white cursor-pointer">10</button>
                    <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] hover:bg-white cursor-pointer">20</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {typeof document !== "undefined" && activeDropdown !== null && dropdownAgent && createPortal(
            <div className="fixed inset-0 z-[9998]" onClick={closeDropdown}>
              <div
                className="absolute px-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5"
                style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-1">
                  <button
                    className="block w-full text-left group px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg font-[500] cursor-pointer"
                    onClick={() => {
                      closeDropdown();
                      setShowReport(true);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className='group-hover:hidden'><DocIcon /></div>
                      <div className='hidden group-hover:block'><DocIcon status={true} /></div>
                      <span>{t("emailings.view_report")}</span>
                    </div>
                  </button>
                  <button
                    className="block w-full text-left group px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg font-[500] cursor-pointer"
                    onClick={() => {
                      setEditData(dropdownAgent.id);
                      handleGetPhoneCampaignDetail(dropdownAgent.id);
                      closeDropdown();
                    }}
                  >
                    <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>{t("edit")}</span> </div>
                  </button>
                  <button
                    className="block w-full text-left px-4 group py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg font-[500] cursor-pointer"
                    onClick={() => {
                      handleDuplicate(dropdownAgent.id);
                      closeDropdown();
                    }}
                  >
                    <div className="flex items-center gap-2"><div className='group-hover:hidden'><Duplicate /></div> <div className='hidden group-hover:block'><Duplicate status={true} /></div> <span>{t("appointment.duplicate")}</span> </div>
                  </button>
                  <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                  <div className="py-2">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6] hover:rounded-lg font-[500]"
                      onClick={() => {
                        closeDropdown();
                        setDeleteRow(dropdownAgent.id);
                      }}
                    >
                      <div className="flex items-center gap-2 cursor-pointer">{<Delete />} <span>{t("delete")}</span> </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
          {viewReportModel && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-[678px] p-6 relative shadow-lg">
              <button
                className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setViewReportModel(false)}
              >
                <X size={20} />
              </button>

              <h2 className="text-[20px] font-[600] text-[#1E1E1E] my-4">
                {t("emailings.campaign_name")} : Inbound.4d74997e-2c17-4024-98c4-
                5fbca9d4f5d1
              </h2>
              <div className="grid grid-cols-2 gap-5 w-full">
                {staticData.map((each) => (
                  <div
                    key={each.label}
                    className={`flex flex-col gap-2 rounded-lg border shadow-shadows-shadow-xs transition bg-white border-[#e1e4ea]`}
                  >
                    <h1 className="text-[#1E1E1E] p-2 bg-[#F2F2F7] text-[14px] font-[400]">
                      {each.label}
                    </h1>

                    <div className='flex gap-2 p-3 items-center'>
                      <p className="font-[600] text-[#1E1E1E] text-[24px]">
                        {each.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>}
        </div> : null}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false)
              setEditData()
              resetForm()
            }
          }}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-2xl w-full max-w-[754px] px-6 relative shadow-lg my-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-4 pr-2 flex flex-col gap-4 w-full">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-[24px] font-[600] text-[#1E1E1E]">{editData ? t("phone.edit_campaign") : t('phone.add_campaign')} </h1>
                <button
                  className="cursor-pointer text-gray-500 hover:text-gray-700 z-10"
                  onClick={() => {
                    setShowModal(false)
                    setEditData()
                    resetForm()
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <hr className="border-[#E1E4EA]" />
              <div className="w-full">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Campaign Name - Top Left */}
                    <div>
                      <label className="block text-[14px] font-[500] text-[#868C98] mb-1">{t("emailings.campaign_name")}</label>
                      <input
                        type="text"
                        placeholder={t("phone.enter_campaign_name")}
                        className={`w-full px-4 py-2 bg-white border rounded-lg ${errors.campaign_name ? 'border-red-500' : 'border-[#E1E4EA]'} focus:outline-none focus:border-[#675FFF]`}
                        name="campaign_name"
                        value={campaign.campaign_name || ''}
                        onChange={handleCampaignForm}
                      />
                      {errors.campaign_name && <p className="text-red-500 text-sm mt-1">{errors.campaign_name}</p>}
                    </div>

                    {/* Campaign Type - Top Right */}
                    <div>
                      <label className="block text-[14px] font-[500] text-[#868C98] mb-1">{t("phone.campaign_type")}</label>
                      <SelectDropdown
                        name="campaign_type"
                        options={[
                          { key: "outbound", label: t("phone.outbound_call") },
                          { key: "inbound", label: t("phone.inbound_call") }
                        ]}
                        placeholder="Select Campaign Type"
                        value={campaign.campaign_type || ''}
                        onChange={(value) => handleCampaignForm({ target: { name: 'campaign_type', value } })}
                        errors={errors}
                      />
                      {errors.campaign_type && <p className="text-red-500 text-sm mt-1">{errors.campaign_type}</p>}
                    </div>

                    {/* Maximum Call Time in Minutes - Bottom Left */}
                    <div>
                      <label className="block text-[14px] font-[500] text-[#868C98] mb-1">Maximum Call Time in Minutes</label>
                      <input
                        type="number"
                        name="max_call_time"
                        value={campaign.max_call_time || ''}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          if (value === '' || /^\d+$/.test(value)) {
                            setCampaign((prev) => ({
                              ...prev,
                              [name]: value === '' ? '' : parseInt(value, 10)
                            }));
                            setErrors((prev) => ({ ...prev, [name]: '' }))
                          }
                        }}
                        placeholder="Enter number"
                        className={`w-full px-4 py-2 bg-white border rounded-lg ${errors.max_call_time ? 'border-red-500' : 'border-[#E1E4EA]'} focus:outline-none focus:border-[#675FFF] appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                      />
                      {errors.max_call_time && <p className="text-red-500 text-sm mt-1">{errors.max_call_time}</p>}
                    </div>

                    {/* Choose Calendar - Bottom Right */}
                    <div>
                      <label className="block text-[14px] font-[500] text-[#868C98] mb-1">Choose Calendar</label>
                      <SelectDropdown
                        name="choose_calendar"
                        options={[
                          { key: "Google Calendar", label: "Google Calendar" },
                          { key: "Outlook Calendar", label: "Outlook Calendar" }
                        ]}
                        placeholder="Select"
                        value={campaign.choose_calendar || ''}
                        onChange={(value) => handleCampaignForm({ target: { name: 'choose_calendar', value } })}
                        errors={errors}
                      />
                      {errors.choose_calendar && <p className="text-red-500 text-sm mt-1">{errors.choose_calendar}</p>}
                    </div>
                  </div>

                  {/* Commented out fields */}
                  {/* <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[14px] font-[500] text-[#1E1E1E] mb-1">Language</label>
                      <SelectDropdown
                        name="language"
                        options={[
                          { key: "English", label: "English" },
                          { key: "French", label: "French" }
                        ]}
                        placeholder="Select"
                        value={campaign.language}
                        onChange={(value) => handleCampaignForm({ target: { name: 'language', value } })}
                        errors={errors}
                      />
                      {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
                    </div>
                    <div>
                      <label className="block text-[14px] font-[500] text-[#1E1E1E] mb-1">Voice</label>
                      <SelectDropdown
                        name="voice"
                        options={[
                          { key: "English", label: "English" },
                          { key: "French", label: "French" }
                        ]}
                        placeholder="Select"
                        value={campaign.voice}
                        onChange={(value) => handleCampaignForm({ target: { name: 'voice', value } })}
                        errors={errors}
                      />
                      {errors.voice && <p className="text-red-500 text-sm mt-1">{errors.voice}</p>}
                    </div>
                  </div> */}

                  {/* <div>
                    <label className="block text-[14px] font-[500] text-[#1E1E1E] mb-1">{t("phone.max_call_time")}</label>
                    <input
                      type="text"
                      name='max_call_time'
                      value={campaign.max_call_time}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        if (value === '' || /^\d+$/.test(value)) {
                          setCampaign((prev) => ({
                            ...prev,
                            [name]: value === '' ? '' : parseInt(value, 10)
                          }));
                          setErrors((prev) => ({ ...prev, [name]: '' }))
                        }
                      }}
                      className={`w-full bg-white p-2 rounded-lg border ${errors.max_call_time ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                      placeholder={t("phone.enter_number")}
                    />
                    {errors.max_call_time && <p className="text-red-500 text-sm mt-1">{errors.max_call_time}</p>}
                  </div> */}

                  {/* Select Your Tags */}
                  <div>
                    <label className="block text-[14px] font-[500] text-[#868C98] mb-1">{t("phone.select_your_tag")}</label>
                    <div className="flex flex-wrap gap-2">
                      {tagsOptions.map((e) => {
                        const isSelected = campaign.tag === e.key;
                        return (
                          <button
                            key={e.key}
                            type="button"
                            onClick={() => {
                              setCampaign((prev) => ({ ...prev, tag: e.key }))
                              setErrors((prev) => ({ ...prev, tag: "" }))
                            }}
                            className={`flex items-center cursor-pointer gap-2 px-2 py-2 rounded-lg border transition-all ${isSelected
                              ? 'bg-white border-[#675FFF] text-[#1E1E1E]'
                              : 'bg-white border-[#E1E4EA] text-[#1E1E1E] hover:border-[#675FFF]'
                              }`}
                          >
                            {isSelected ? (
                              <div className="w-[18px] h-[18px] bg-[#675FFF] rounded-sm flex items-center justify-center flex-shrink-0">
                                <Check size={14} className="text-white" strokeWidth={3} />
                              </div>
                            ) : (
                              <div className="w-[18px] h-[18px] border-2 border-[#D6D6D6] rounded-sm flex-shrink-0"></div>
                            )}
                            <span className={`text-[14px] ${isSelected ? 'font-[600]' : 'font-[400]'}`}>{e.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.tag && <p className="text-red-500 text-sm mt-1">{errors.tag}</p>}
                    <button
                      className="flex items-center cursor-pointer gap-1 text-[#675FFF] text-sm font-medium mt-3 hover:text-[#483ed1] transition-colors"
                      onClick={() => navigator('/dashboard/brain')}
                    >
                      <Plus size={16} />
                      <span>{t("phone.create_contact_list")}</span>
                    </button>
                  </div>

                  {/* Commented out Target Contact Lists */}
                  {/* <div>
                    <label className="block text-[14px] font-[500] text-[#1E1E1E] mb-1">{t("phone.target_contact_lists")}</label>
                    <SelectDropdown
                      name="target_lists"
                      options={contactLists?.length > 0 && contactLists}
                      value={campaign.target_lists}
                      onChange={(updated) => {
                        setCampaign((prev) => ({
                          ...prev,
                          target_lists: updated,
                        }))
                        setErrors((prev) => ({ ...prev, target_lists: "" }))
                      }}
                      errors={errors}
                      placeholder={t("select")}
                    />
                    {errors.target_lists && <p className="text-red-500 text-sm mt-1">{errors.target_lists}</p>}
                  </div> */}

                  {/* Choose an agent and Number linked to the campaign - Top Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Choose an agent - Left */}
                    <div>
                      <label className="block text-[14px] font-[500] text-[#868C98] mb-1">{t("phone.choose_an_agent")}</label>
                      <SelectDropdown
                        name="agent"
                        options={agents.map(agent => ({ key: agent.id.toString(), label: agent.agent_name }))}
                        placeholder="Select Agent"
                        value={campaign.agent ? campaign.agent.toString() : ''}
                        onChange={(value) => handleCampaignForm({ target: { name: 'agent', value: value ? parseInt(value) : '' } })}
                        errors={errors}
                      />
                      {errors.agent && <p className="text-red-500 text-sm mt-1">{errors.agent}</p>}
                    </div>

                    {/* Number linked to the campaign - Right */}
                    <div>
                      <label className="block text-[14px] font-[500] text-[#868C98] mb-1">Number linked to the campaign</label>
                      <div className="flex group items-center focus-within:border-[#675FFF] gap-2 border border-[#E1E4EA] rounded-lg px-4 py-2.5">
                        <div className="relative country-selector">
                          <button
                            type="button"
                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                            className="w-fit flex hover:cursor-pointer border-none justify-between gap-2 items-center"
                          >
                            <img src={selectedCountry?.flag} alt={selectedCountry?.name} width={20} />
                            <span className="text-[14px] text-[#1E1E1E]">{selectedCountry?.dial_code}</span>
                            <FaChevronDown color="#5A687C" className={`w-[10px] transition-transform duration-200 ${isCountryOpen ? 'transform rotate-180' : ''}`} />
                            <hr style={{ color: "#E1E4EA", width: "22px", transform: "rotate(-90deg)", margin: "0 8px" }} />
                          </button>
                          {isCountryOpen && (
                            <div className="absolute z-10 rounded-md shadow-lg border border-gray-200 max-h-40 overflow-auto top-8 left-0 bg-white mt-1 min-w-[120px]">
                              {countries.map((country) => (
                                <div
                                  key={country.code}
                                  onClick={() => {
                                    setSelectedCountry(country);
                                    setCampaign((prev) => ({ ...prev, country: country.code }));
                                    setIsCountryOpen(false);
                                  }}
                                  className={`flex items-center gap-2 px-3 py-2 hover:bg-[#F4F5F6] cursor-pointer ${selectedCountry?.code === country?.code && 'bg-[#F4F5F6]'}`}
                                >
                                  <img src={country.flag} alt={country.name} width={16} />
                                  <span className="text-[14px] text-[#1E1E1E]">{country.dial_code}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          type="tel"
                          name="phone_number"
                          value={campaign.phone_number || ''}
                          onChange={handleCampaignForm}
                          placeholder="(555) 000-0000"
                          className="w-full outline-none bg-transparent text-[#1E1E1E] text-[14px]"
                        />
                      </div>
                      {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                    </div>
                  </div>

                  {/* Tom Engages Conversation Toggle - Bottom Left */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCampaign((prev) => ({ ...prev, tom_engages: !prev.tom_engages }))}
                      className={`w-11 h-6 cursor-pointer rounded-full relative transition-colors duration-300 ${campaign.tom_engages ? "bg-[#675FFF]" : "bg-gray-300"
                        }`}
                    >
                      <span
                        className={`block w-6 h-6 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${campaign.tom_engages ? "translate-x-5" : "translate-x-0.5"
                          }`}
                      ></span>
                    </button>
                    <span className="text-[14px] font-[500] text-[#1E1E1E]">
                      {t("phone.tom_engages_conversation")}
                    </span>
                  </div>

                  {/* Your Catch Phrase */}
                  <div>
                    <label className="block text-[14px] font-[500] text-[#868C98] mb-1">{t("phone.your_catch_phrase")}</label>
                    <textarea
                      placeholder="Enter your catch phrase"
                      className={`w-full px-4 py-3 border rounded-lg resize-none ${errors.catch_phrase ? 'border-red-500' : 'border-[#E1E4EA]'} focus:outline-none focus:border-[#675FFF]`}
                      rows={4}
                      value={campaign.catch_phrase}
                      onChange={handleCampaignForm}
                      name="catch_phrase"
                    />
                    {errors.catch_phrase && <p className="text-red-500 text-sm mt-1">{errors.catch_phrase}</p>}
                  </div>

                  {/* Your Call Script */}
                  <div>
                    <label className="block text-[14px] font-[500] text-[#868C98] mb-1">{t("phone.call_script")}</label>
                    <textarea
                      placeholder="Enter your call script"
                      className={`w-full px-4 py-3 border rounded-lg resize-none ${errors.call_script ? 'border-red-500' : 'border-[#E1E4EA]'} focus:outline-none focus:border-[#675FFF]`}
                      rows={4}
                      value={campaign.call_script}
                      onChange={handleCampaignForm}
                      name="call_script"
                    />
                    {errors.call_script && <p className="text-red-500 text-sm mt-1">{errors.call_script}</p>}
                  </div>

                  {/* Action Buttons */}
                  {editData ? (
                    <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-[#E1E4EA]">
                      <button
                        onClick={() => {
                          setShowModal(false)
                          setEditData()
                          resetForm()
                        }}
                        className="px-6 py-2 cursor-pointer text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px] hover:bg-gray-50 transition-colors"
                      >
                        {t("phone.cancel")}
                      </button>
                      <button
                        className="px-6 py-2 cursor-pointer text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px] hover:bg-[#5a4aff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleEditCampaign}
                        disabled={loader}
                      >
                        {t("phone.save_campaign")}
                      </button>
                    </div>
                  ) :
                    <div>

                      <div className="flex gap-4 mt-6">
                        <button onClick={() => {
                          setSecondModel(true)
                          // setShowModal(false)
                        }} className="w-[195px] text-[16px] cursor-pointer text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                          {t("phone.test_call")}
                        </button>


                        <button
                          className="w-[195px] text-[16px] cursor-pointer text-white rounded-[8px] bg-[#5E54FF]  h-[38px] flex items-center justify-center gap-2 relative"
                          disabled={loader}
                          onClick={handleSubmit}
                        >

                          <p>  {t("phone.launch_call")}</p>
                          {loader && <span className="loader text-[#5E54FF]"></span>}


                        </button>

                      </div>
                    </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {secondModel && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-[514px] p-6 relative shadow-lg">
          <button
            className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-700"
            onClick={() => {
              setSecondModel(false)
            }}
          >
            <X size={20} />
          </button>

          <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-1">
            {t("phone.test_call")}
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            {t("phone.test_call_with")}<span className="text-[#5E54FF]">Tom</span>
          </p>
          <div className="flex flex-col my-5 justify-center items-center gap-3">
            <div><TestCall /></div>
            <h2 className="text-[20px] text-[#1E1E1E] font-[600]">Call from +99778090935 in Progress...</h2>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setSecondModel(false)}
              className="w-full cursor-pointer text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
            >
              {t("phone.not_received_a_call")}
            </button>
            <button
              className="w-full cursor-pointer text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]"
              onClick={() => setSecondModel(false)}
            >
              {t("phone.finish_test")}
            </button>
          </div>
        </div>
      </div>}

      {
        showReport && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-[914px] min-h-[21vh]">

            <div class="flex justify-between items-center mb-4">
              <h4 class="text-2xl font-500">
                {t("emailings.campaign_name")}
              </h4>

              <button
                class="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
                onClick={() => setShowReport(false)}
              >
                <X />
              </button>
            </div>


            <hr class="border-gray-200 mb-4" />

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
              <div class="rounded-lg border border-[#D6D6D6] px-2 py-2">
                <p class=" text-md p-2 text-[#5A687C] rounded-t-lg">{t("phone.total_call")}</p>
                <p class="text-2xl font-semibold text-gray-900 m-2">0</p>
              </div>

              <div class="rounded-lg border border-[#D6D6D6] px-2 py-2">
                <p class=" text-md p-2 text-[#5A687C] rounded-t-lg">{t("phone.unsuccessful_call")}</p>
                <p class="text-2xl font-semibold text-gray-900 m-2">0</p>
              </div>

              <div class="rounded-lg border border-[#D6D6D6] px-2 py-2">
                <p class=" text-md p-2 text-[#5A687C] rounded-t-lg">{t("phone.average_call")}</p>
                <p class="text-2xl font-semibold text-gray-900 m-2">0</p>
              </div>

              <div class="rounded-lg border border-[#D6D6D6] px-2 py-2">
                <p class=" text-md p-2 text-[#5A687C] rounded-t-lg">{t("phone.total_call_time")}</p>
                <p class="text-2xl font-semibold text-gray-900 m-2">00:00:00</p>
              </div>

            </div>
          </div>

        </div>

      }


      {
        deleteRow && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-2xl w-[400px] p-6 relative shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("phone.delete_call_campaign")}</h2>
              <p className="text-gray-500 mb-4">{t("phone.delete_call_campaign_msg")}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteRow(null)}
                  className="w-full text-[16px] cursor-pointer text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
                >
                  {t("phone.cancel")}
                </button>
                <button
                  onClick={() => {
                    removeRow(deleteRow);

                  }}
                  className="w-full text-[16px] cursor-pointer text-white rounded-[8px] bg-red-500 h-[38px] flex justify-center items-center gap-2 relative"
                >
                  {
                    t("brain_ai.delete")
                  }
                  {/* <span className="loader"></span> */}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Toast Modal */}
      <ToastModal
        open={toast.open}
        type={toast.type}
        title={toast.title}
        description={toast.description}
        highlightText={toast.highlightText}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
}
