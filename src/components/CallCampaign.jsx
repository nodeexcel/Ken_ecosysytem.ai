// Full-featured modal with pixel-perfect layout, click-outside-to-close, and toggle logic.
import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, X } from "lucide-react";
import { BritishFlag, Delete, Duplicate, Edit, Notes, TestCall, ThreeDots } from "../icons/icons";
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

const renderColor = (text) => {
  switch (text) {
    case "Issue Detected":
      return `text-[#FF9500] bg-[#FFF4E6] border-[#FF9500]`;
    case "Running":
      return `text-[#675FFF] bg-[#F0EFFF] border-[#675FFF]`;
    case "Pending":
      return `text-[#5A687C] bg-[#E9E9E9] border-[#5A687C]`;
    case "Terminated":
      return `text-[#FF2D55] bg-[#FFEAEE] border-[#FF2D55]`;
    default:
      return `text-[#34C759] bg-[#EBF9EE] border-[#34C759]`;
  }
};

const countries = [
  { name: "United States", code: "US", dial_code: "+1", flag: us_flag },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: uk_flag }, ,
  { name: "France", code: "FR", dial_code: "+33", flag: fr_flag }, ,
  // Add more countries as needed
];

export default function CallCampaign() {
  const [showModal, setShowModal] = useState(false);
  const [secondModel, setSecondModel] = useState(false);
  const [toggleTom, setToggleTom] = useState(true);
  const modalRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewReportModel, setViewReportModel] = useState(false);
  const [editData, setEditData] = useState();
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const dispatch = useDispatch()
  const [agents, setAgent] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

  // Add filter state
  const [filters, setFilters] = useState({
    country: "",
    language: "",
    voice: ""
  });

  // Define options for filters
  const countryOptions = [
    // { key: "", label: "Country" },
    { key: "US", label: "United States" },
    { key: "GB", label: "United Kingdom" },
    { key: "FR", label: "France" }
  ];

  const languageOptions = [
    // { key: "", label: "Language" },
    { key: "english", label: "English" },
    { key: "french", label: "French" },
    { key: "spanish", label: "Spanish" }
  ];

  const voiceOptions = [
    // { key: "", label: "Voice" },
    { key: "male", label: "Male" },
    { key: "female", label: "Female" },
    { key: "neutral", label: "Neutral" }
  ];

  const [campaign, setCampaign] = useState(
    {
      campaign_name: "",
      language: "",
      voice: "",
      choose_calendar: "",
      max_call_time: 10,
      target_lists: ["0"],
      agent: 0,
      country: "USA",
      phone_number: "",
      catch_phrase: "",
      call_script: "",
      tom_engages: true
    }

  );

  const [campaigns, setCampaigns] = useState([]);



  const [errors, setErrors] = useState({
    campaign_name: "",
    language: "",
    voice: "",
    choose_calendar: "",
    max_call_time: "",
    target_lists: "",
    agent: "",
    country: "",
    phone_number: "",
    catch_phrase: "",
    call_script: ""
  });



  const validateForm = () => {
    const newErrors = {};

    if (!campaign.campaign_name.trim()) newErrors.campaign_name = "Campaign name is required.";
    if (!campaign.language) newErrors.language = "Language is required.";
    if (!campaign.voice) newErrors.voice = "Voice selection is required.";
    if (!campaign.choose_calendar) newErrors.choose_calendar = "Calendar selection is required.";
    if (!campaign.max_call_time || campaign.max_call_time <= 0) newErrors.max_call_time = "Enter a valid call time.";
    if (!campaign.target_lists || campaign.target_lists.length === 0) newErrors.target_lists = "At least one target list is required.";
    if (!campaign.agent) newErrors.agent = "Agent selection is required.";
    // if (!campaign.country) newErrors.country = "Country is required.";
    if (!campaign.phone_number) newErrors.phone_number = "Phone number is required.";
    if (!campaign.catch_phrase.trim()) newErrors.catch_phrase = "Catch phrase is required.";
    if (!campaign.call_script.trim()) newErrors.call_script = "Call script is required.";
    if (campaign.catch_phrase.trim().length < 20) newErrors.catch_phrase = "Minimum 20 characters required for catch phrase.";
    if (campaign.call_script.trim().length < 50) newErrors.call_script = "Minimum 50 characters required for call script.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const removeRow = async (id) => {
    try {
      const response = await deletePhoneCampaign(id);
      if (response.status === 200) {
        console.log("Phone number status updated successfully");

        handleGetPhoneCampaign();
        setDeleteRow(null);
      } else {
        console.error("Failed to update phone number status:", response);
      }

    } catch (error) {
      console.error("Error removing row:", error);
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
    setCampaign({
      campaign_name: "",
      language: "",
      voice: "",
      choose_calendar: "",
      max_call_time: 10,
      target_lists: ["0"],
      agent: 0,
      country: "USA",
      phone_number: "",
      catch_phrase: "",
      call_script: "",
      tom_engages: true
    })
  }


  const handleGetPhoneCampaign = async () => {
    try {
      const response = await getPhoneCampaign();

      if (response.status === 200) {
        setCampaigns(response.data.campaigns_info || []);
      } else {
        console.error("Failed to fetch phone campaigns:", response);
      }
    } catch (error) {
      console.error("Error fetching phone campaigns:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    if (validateForm()) {

      const response = await createPhoneCampaign(campaign);


      if (response.status === 200) {
        console.log(response.data);

      }
      setShowModal(false);
      handleGetPhoneCampaign();
      // Submit logic here

    } else {
      console.log("Validation failed");
      console.log("Errors:", errors);
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
      const response = await updatePhoneCampaign(campaign);
      if (response.status === 200) {
        console.log("Campaign details:", response.data);
        setShowModal(false);
        getPhoneCampaign();
      } else {
        console.error("Failed to fetch campaign details:", response);
      }
    } catch (error) {
      console.error("Error fetching campaign details:", error);
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
      const response = await duplicateCampaign(id);

      if (response.status === 201) {
        console.log("Campaign duplicated successfully:", response.data);
        handleGetPhoneCampaign();
      } else {
        console.error("Failed to duplicate campaign:", response);
      }
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error duplicating campaign:", error);
    }

  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }
    if (showModal) document.addEventListener("mousedown", handleClickOutside);
    handleGetPhoneNumber();
    handleGetPhoneAgent();
    handleGetPhoneCampaign();
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  const handleDropdownClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className="h-screen overflow-auto">
      {!showModal ?
        <div className="py-4 pr-2 flex flex-col gap-4 w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-black">Call Campaign</h1>
            <button
              className="bg-[#7065F0] text-white font-medium px-5 py-2 rounded-lg shadow cursor-pointer"
              onClick={() => {
                dispatch(getNavbarData("Tom, Phone"))
                setShowModal(true)
                setSecondModel(false)
              }}
            >
              New Campaign
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="w-48">
              <SelectDropdown
                name="country"
                options={countryOptions}
                placeholder="Country"
                value={filters.country}
                onChange={(value) => setFilters({ ...filters, country: value })}
              />
            </div>

            <div className="w-48">
              <SelectDropdown
                name="language"
                options={languageOptions}
                placeholder="Language"
                value={filters.language}
                onChange={(value) => setFilters({ ...filters, language: value })}
              />
            </div>

            <div className="w-48">
              <SelectDropdown
                name="voice"
                options={voiceOptions}
                placeholder="Voice"
                value={filters.voice}
                onChange={(value) => setFilters({ ...filters, voice: value })}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto w-full rounded-2xl">
            <table className="w-full rounded-2xl">
              <thead>
                <tr className="text-left text-[#5a687c] text-[16px]">
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Campaign Name</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Agent Name</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Creation Date</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Language</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Total Calls</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Status</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white border border-[#E1E4EA] p-3">
                {campaigns.map((agent, index) => (
                  <tr
                    key={agent.id}
                    className={`hover:bg-gray-50 ${index !== agents.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{agent.campaign_name}</td>
                    <td className="px-6 py-4">{agent.agent_name}</td>
                    <td className="px-6 py-4">{format(agent.creation_date, "dd-mm-yy hh:mm a")}</td>
                    <td className="px-6 py-4">{agent.language}</td>
                    <td className="px-6 py-4">{agent.total_calls}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block border ${renderColor(agent.status)} text-sm font-medium px-3 py-1 rounded-full`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className='flex items-center gap-2'>
                        <button className='text-[#5A687C] px-2 py-1 border-2 text-[16px] font-[500] border-[#E1E4EA] rounded-lg cursor-pointer' onClick={() => setShowReport(true)}>
                          View Report
                        </button>
                        <button onClick={() => handleDropdownClick(index)} className="p-2 rounded-lg relative">
                          <div className='bg-[#F4F5F6] p-2 rounded-lg cursor-pointer'><ThreeDots /></div>
                          {activeDropdown === index && (
                            <div className="absolute right-0 px-2  w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                              <div className="py-1">
                                <button
                                  className="block w-full text-left group px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg font-[500] cursor-pointer"
                                  onClick={() => {
                                    // Handle edit action
                                    setEditData(agent.id)

                                    handleGetPhoneCampaignDetail(agent.id);


                                  }}
                                >
                                  <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>Edit</span> </div>
                                </button>
                                <button
                                  className="block w-full text-left px-4 group py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg font-[500] cursor-pointer"
                                  onClick={() => {
                                    // Handle delete action

                                    handleDuplicate(agent.id);
                                  }}
                                >
                                  <div className="flex items-center gap-2"><div className='group-hover:hidden'><Duplicate /></div> <div className='hidden group-hover:block'><Duplicate status={true} /></div> <span>Duplicate</span> </div>
                                </button>
                                <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                                <div className="py-2">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6] hover:rounded-lg font-[500]"
                                    onClick={() => {
                                      // Handle delete action
                                      setActiveDropdown(null);
                                      setDeleteRow(agent.id);

                                    }}
                                  >
                                    <div className="flex items-center gap-2 cursor-pointer">{<Delete />} <span>Delete</span> </div>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </button>
                      </div>

                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
          {viewReportModel && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-[678px] p-6 relative shadow-lg">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setViewReportModel(false)}
              >
                <X size={20} />
              </button>

              <h2 className="text-[20px] font-[600] text-[#1E1E1E] my-4">
                Campaign Name : Inbound.4d74997e-2c17-4024-98c4-
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
        </div> :
        <div className="py-4 pr-2 flex flex-col gap-4 w-full">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 onClick={() => {
              setShowModal(false)
              setEditData()
              resetForm()
            }} className="text-[14px] font-[400] text-[#5A687C] hover:text-[#5a687cdb] cursor-pointer">{`Call Campaigns > ${editData ? `${campaign.campaign_name}` : 'New Campaign'}`}</h1>
            <h1 className="text-[24px] font-[600] text-[#1E1E1E]">{editData ? 'Edit' : 'Add New'} Campaigns</h1>
          </div>
          <div className="w-full"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  placeholder="Enter campaign name"
                  className="w-full px-4 py-2 bg-white border rounded-lg border-[#E1E4EA] focus:outline-none focus:border-[#675FFF]"

                  name="campaign_name"
                  value={campaign.campaign_name}
                  onChange={handleCampaignForm}
                />
                {errors.campaign_name && <p className="text-red-500 text-sm mt-1">{errors.campaign_name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Language</label>
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
                  <label className="block text-sm text-gray-700 mb-1">Voice</label>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Choose Calendar</label>
                  <SelectDropdown
                    name="choose_calendar"
                    options={[
                      { key: "Google Calendar", label: "Google Calendar" },
                      { key: "Outlook Calendar", label: "Outlook Calendar" }
                    ]}
                    placeholder="Select"
                    value={campaign.choose_calendar}
                    onChange={(value) => handleCampaignForm({ target: { name: 'choose_calendar', value } })}
                    errors={errors}
                  />
                  {errors.choose_calendar && <p className="text-red-500 text-sm mt-1">{errors.choose_calendar}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Max Call Time (Minutes)</label>
                  <SelectDropdown
                    name="max_call_time"
                    options={[
                      { key: "30", label: "30" },
                      { key: "40", label: "40" },
                      { key: "60", label: "60" }
                    ]}
                    placeholder="Select"
                    value={campaign.max_call_time.toString()}
                    onChange={(value) => handleCampaignForm({ target: { name: 'max_call_time', value: parseInt(value) } })}
                    errors={errors}
                  />
                  {errors.max_call_time && <p className="text-red-500 text-sm mt-1">{errors.max_call_time}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Target Lists</label>
                <SelectDropdown
                  name="target_lists"
                  options={[
                    { key: "0", label: "0" },
                    { key: "1", label: "1" }
                  ]}
                  placeholder="Select"
                  value={campaign.target_lists[0]}
                  onChange={(value) => setCampaign(prev => ({ ...prev, target_lists: [value] }))}
                  errors={errors}
                />
                {errors.target_lists && <p className="text-red-500 text-sm mt-1">{errors.target_lists}</p>}
                <button className="text-[#7065F0] text-sm font-medium mt-1">+ Create New Contact List</button>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Choose an Agent</label>
                <SelectDropdown
                  name="agent"
                  options={agents.map(agent => ({ key: agent.id.toString(), label: agent.agent_name }))}
                  placeholder="Select"
                  value={campaign.agent.toString()}
                  onChange={(value) => handleCampaignForm({ target: { name: 'agent', value: parseInt(value) } })}
                  errors={errors}
                />
                {errors.agent && <p className="text-red-500 text-sm mt-1">{errors.agent}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium block mb-1">
                  Phone Number
                </label>
                <div className="flex group items-center focus-within:border-[#675FFF] gap-2 border border-[#E1E4EA] rounded-lg px-4 py-2">
                  <div className="relative">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-fit flex hover:cursor-pointer border-none justify-between gap-2 items-center border pl-1 py-1 text-left"
                    >
                      <img src={selectedCountry?.flag} alt={selectedCountry?.name} width={16} />
                      <FaChevronDown color="#5A687C" className={`w-[10px] transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                      <hr style={{ color: "#E1E4EA", width: "22px", transform: "rotate(-90deg)" }} />
                    </button>
                    {isOpen && (
                      <div className="absolute px-1 z-10 rounded-md shadow-lg border border-gray-200 max-h-30 overflow-auto top-6 w-full left-[-13px] bg-white mt-1">
                        {countries.map((country) => (
                          <div
                            key={country.code}
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsOpen(false);
                            }}
                            className={`flex justify-center hover:bg-[#F4F5F6] hover:rounded-lg pr-1 my-1 py-2 ${selectedCountry?.code === country?.code && 'bg-[#F4F5F6] rounded-lg'} cursor-pointer flex items-center`}
                          >
                            <img src={country.flag} alt={country.name} width={16} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <select
                    name="phone_number"
                    value={campaign.phone_number}
                    onChange={handleCampaignForm}
                    className="w-full outline-none bg-transparent text-[#5A687C] px-2"
                  >
                    <option value="" className="text-gray-500">Select</option>
                    {phoneNumbers.map((phone) => (
                      <option key={phone.phone_number} value={phone.phone_number} className="text-[#5A687C]">
                        {phone.phone_number}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-gray-700">
                  Tom, Engages the Conversation
                </span>
                <button
                  onClick={() => setToggleTom(!toggleTom)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${toggleTom ? "bg-[#7065F0]" : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${toggleTom ? "translate-x-5" : "translate-x-0.5"
                      }`}
                  ></span>
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Your Catch Phrase</label>
                <textarea
                  placeholder="Enter your catch phrase"
                  className="w-full px-4 py-2 border rounded-lg resize-none border-[#E1E4EA] focus:outline-none focus:border-[#675FFF]"
                  rows={4}
                  value={campaign.catch_phrase}
                  onChange={handleCampaignForm}
                  name="catch_phrase"
                />
                {errors.catch_phrase && <p className="text-red-500 text-sm mt-1">{errors.catch_phrase}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Your Call Script</label>
                <textarea
                  placeholder="Enter your call script"
                  className="w-full px-4 py-2 border rounded-lg resize-none border-[#E1E4EA] focus:outline-none focus:border-[#675FFF]"
                  rows={4}
                  value={campaign.call_script}
                  onChange={handleCampaignForm}
                  name="call_script"
                />
                {errors.call_script && <p className="text-red-500 text-sm mt-1">{errors.call_script}</p>}
              </div>

              {editData ? <div className="flex gap-4 mt-6">
                <button className="w-[195px]  text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]"
                  onClick={handleEditCampaign} disabled={loader}
                >
                  Save Campaign
                </button>
                <button onClick={() => {
                  setShowModal(false)
                  setEditData()
                  resetForm()
                }} className="w-[195px]  text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                  Cancel
                </button>
              </div> : <div className="flex gap-4 mt-6">
                <button onClick={() => {
                  setSecondModel(true)
                  setShowModal(false)
                }} className="w-[195px] text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                  Test Call
                </button>


                <button
                  className="w-[195px] text-[16px] text-white rounded-[8px] bg-[#5E54FF]  h-[38px] flex items-center justify-center gap-2 relative"
                  disabled={loader}
                  onClick={handleSubmit}
                >

                  <p>   Launch Calls</p>
                  {loader && <span className="loader text-[#5E54FF]"></span>}


                </button>

              </div>}
            </div>
          </div>

        </div>}
      {secondModel && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-[514px] p-6 relative shadow-lg">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => {
              setSecondModel(false)
            }}
          >
            <X size={20} />
          </button>

          <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-1">
            Test Call
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Test your call with <span className="text-[#5E54FF]">Tom</span>
          </p>
          <div className="flex flex-col my-5 justify-center items-center gap-3">
            <div><TestCall /></div>
            <h2 className="text-[20px] text-[#1E1E1E] font-[600]">Call from +99778090935 in Progress...</h2>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setSecondModel(false)}
              className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
            >
              I Haven't Received A Call
            </button>
            <button
              className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]"
            >
              Finish The Test
            </button>
          </div>
        </div>
      </div>}

      {
        showReport && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl shadow-lg p-6 w-[500px]">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-md font-semibold text-gray-800">Campaign Name :  Inbound.4d74997e-2c17-4024-98c4-5fbca9d4f5d1</h4>



              </div>
              <button class="text-gray-400 hover:text-gray-600 text-xl relative -top-4 -right-4 cursor-pointer" onClick={() => setShowReport(false)}><X /></button>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class=" rounded-lg border border-gray-200 ">
                <p class=" text-xs p-2 bg-[#F1F1FF] rounded-t-lg">Total calls</p>
                <p class="text-xl font-semibold text-gray-900 m-2">0</p>
              </div>

              <div class=" rounded-lg border border-gray-200 ">
                <p class=" text-xs p-2 bg-[#F1F1FF] rounded-t-lg">Unsuccessful calls</p>
                <p class="text-xl font-semibold text-gray-900 m-2">0</p>
              </div>
              <div class=" rounded-lg border border-gray-200 ">
                <p class=" text-xs p-2 bg-[#F1F1FF] rounded-t-lg">Average call duration</p>
                <p class="text-xl font-semibold text-gray-900 m-2">0</p>
              </div>

              <div class=" rounded-lg border border-gray-200 ">
                <p class=" text-xs p-2 bg-[#F1F1FF] rounded-t-lg">Total call time</p>
                <p class="text-xl font-semibold text-gray-900 m-2">00:00:00</p>
              </div>
            </div>
          </div>
        </div>

      }


      {
        deleteRow && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-[400px] p-6 relative shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Call Campaign</h2>
              <p className="text-gray-500 mb-4">Are you sure you want to delete this call cmapagin?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteRow(null)}
                  className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    removeRow(deleteRow);

                  }}
                  className="w-full text-[16px] text-white rounded-[8px] bg-red-500 h-[38px] flex justify-center items-center gap-2 relative"
                >
                  Delete
                  {/* <span className="loader"></span> */}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}
