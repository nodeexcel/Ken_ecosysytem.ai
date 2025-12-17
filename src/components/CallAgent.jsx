import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, Info, MoreHorizontal, X, Search, Plus } from "lucide-react";
import { Ellipsis, Edit, Delete, DocIcon } from "../icons/icons";
// import { AlertIcon, Ellipsis } from "../icons/icons"; // Commented out - no longer needed with single phone number selection
// import { FaChevronDown } from "react-icons/fa"; // Commented out - using ChevronDown from lucide-react instead

import uk_flag from "../assets/images/uk_flag.png"
import us_flag from "../assets/images/us_flag.png"
import fr_flag from "../assets/images/fr_flag.png"
import { getPhoneNumber, createPhoneAgent, getCallAgent, updatePhoneNumberAgentStatus } from "../api/callAgent";
import { SelectDropdown } from "./Dropdown";
import { useTranslation } from "react-i18next";
import ToastModal from "./ToastModal";

const countries = [
  { name: "United States", code: "US", dial_code: "+1", flag: us_flag },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: uk_flag }, ,
  { name: "France", code: "FR", dial_code: "+33", flag: fr_flag }, ,
  // Add more countries as needed
];

export default function CallAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries && countries.length > 0 ? countries[0] : { name: "United States", code: "US", dial_code: "+1", flag: us_flag });
  const [isOpen, setIsOpen] = useState(false);
  // Changed from array to string - phone_number now stores single value instead of array
  const [agent, setAgent] = useState({ agent_name: "", language: "", voice: "", type: "", phone_number: "" });
  const [error, setError] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [inboundLimitStatus, setInboundLimitStatus] = useState(false) // Commented out - no longer needed with single phone number selection
  const [showPhoneNumberList, setShowPhoneNumberList] = useState(false)
  const [openUpward, setOpenUpward] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const { t } = useTranslation();


  const buttonRef = useRef(null);
  const phoneNumberRef = useRef();
  const dropdownRef = useRef(null);

  // Add filter state
  const [filters, setFilters] = useState({
    country: "",
    language: "",
    voice: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({
    open: false,
    type: "success",
    title: "",
    description: "",
    highlightText: "",
  });

  const countryOptions = [
    { key: "US", label: "United States" },
    { key: "GB", label: "United Kingdom" },
    { key: "FR", label: "France" }
  ];

  const languageOptions = [
    { key: "english", label: "English" },
    { key: "french", label: "French" },
    // { key: "spanish", label: "Spanish" }
  ];

  const voiceOptions = [
    { key: "male", label: t("phone.male") },
    { key: "female", label: t("phone.female") },
  ];

  const toggleActive = async (id) => {
    try {
      const response = await updatePhoneNumberAgentStatus(id);
      if (response.status === 200) {
        fetchAgents();
      }
      else {
        console.error("Failed to update agent status");
      }
    } catch (error) {
      console.error("Error toggling agent status:", error);
      return error;
    }
  };

  const renderPhoneNumber = (phone, country) => {
    const filterCode = countries.filter((e) => e.name === country)
    return `${filterCode[0]?.dial_code}${phone.slice(0, 3)}${phone.slice(3, 6)}${phone.slice(6)}`
  }

  useEffect(() => {
    if (showPhoneNumberList && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 240;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [showPhoneNumberList]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown !== null) {
        const clickedElement = event.target;
        const isDropdownClick = clickedElement.closest('[data-dropdown]');
        const isTriggerClick = clickedElement.closest('button')?.querySelector('svg') ||
          clickedElement.closest('button[class*="rounded-lg"]');

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

  {/* Changed from array to string - now handles single phone number selection instead of multiple */}
  const CustomSelector = ({ options, setShowSelector, value = "", onChange, ref }) => {

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowSelector(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelection = (e) => {
      onChange(e);
    };
    return (
      <div className="bg-white rounded-lg shadow-lg">
        <div className="max-h-60 overflow-auto">
          <ul className="py-1 px-2 flex flex-col gap-1 my-1">
            {options?.length > 0 && options.map((e) => (
              <li
                key={e.key}
                onClick={() => handleSelection(e.key)}
                className={`py-2 px-4 rounded-lg cursor-pointer flex items-center hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF] gap-2 ${value === e.key
                  ? 'bg-[#F4F5F6] rounded-lg text-[#675FFF]' : 'text-[#5A687C]'
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${value === e.key
                    ? 'border-[#675FFF] bg-[#675FFF]'
                    : 'border-[#E1E4EA]'
                    }`}
                >
                  {value === e.key && (
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

  const fetchPhoneNumbers = async () => {
    try {
      const response = await getPhoneNumber();
      if (response.status === 200) {
        if (response.data.phone_numbers?.length > 0) {
          const data = response.data.phone_numbers.map((e) => ({
            label: e.phone_number,
            key: e.phone_number
          }))
          setPhoneNumbers(data)
        }
      } else {
        console.error("Failed to fetch phone numbers");
      }
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
    }
  }

  const isValidForm = () => {
    const error = {};
    if (!agent.agent_name) error.agent_name = t("phone.agent_name_validation");
    if (!agent.language) error.language = t("phone.agent_language_validation");
    if (!agent.voice) error.voice = t("phone.agent_voice_validation");
    if (!agent.type) error.type = t("phone.agent_type_validation");
    // Changed from array length check to string existence check
    if (!agent.phone_number) error.phone_number = t("phone.agent_phone_number_validation");
    setError({ ...error });
    return Object.keys(error).length === 0;
  };

  const submitForm = async (e) => {
    
    try{
    e.preventDefault();
    if (!isValidForm()) {
      return;
    } else {
      const response = await createPhoneAgent(agent);

      if (response.status === 201) {
        setShowModal(false);
        setLoader(true);
        setAgent({ agent_name: "", language: "", voice: "", type: "", phone_number: "" });
        fetchAgents();
        setToast({
          open: true,
          type: "success",
          title: t("success") || "Success",
          description: t("phone.agent_created_success") || "Call agent has been created successfully.",
        });
      } else { 
    error.response=response.response?.data?.error|| "An error occurred";
    setError({...error});
        setToast({
          open: true,
          type: "error",
          title: t("error") || "Error",
          description: error.response || t("phone.agent_create_failed") || "Failed to create agent. Please try again.",
        });
      }
      setLoader(false);
    }
  } catch (error) {
    setLoader(false);
    setToast({
      open: true,
      type: "error",
      title: t("error") || "Error",
      description: error?.message || t("phone.agent_create_failed") || "Failed to create agent. Please try again.",
    });
  }
}

  const fetchAgents = async () => {
    try {
      const response = await getCallAgent();
      if (response.status === 200) {
        setAgents(response.data.agents_info || []);
        if (response?.data?.agents_info?.length === 0) {
          setLoading(false)
        }
      } else {
        console.error("Failed to fetch agents");
        setLoading(false)
      }
    }
    catch (error) {
      console.error("Error fetching agents:", error);
      setLoading(false)
    }
  }

  useEffect(() => {
    if (agents?.length > 0) {
      setLoading(false)
    }
  }, [agents])

  useEffect(() => {
    fetchPhoneNumbers();
    fetchAgents();
  }, []);

  return (
    <div className="p-12 h-screen overflow-auto flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-[24px] font-semibold text-[#1E1E1E]">{t("phone.call_agents")}</h1>
          <p className="text-sm md:text-base text-[#5A687C] font-[400]">{t("phone.manage_your_ai_and_human_call_agents") || "Manage your AI and human call agents"}</p>
        </div>
        <button 
          className="bg-[#675FFF] cursor-pointer text-white font-medium px-4 py-1.5 rounded-lg shadow-sm hover:bg-[#5E54FF] transition-colors flex items-center gap-2 w-fit"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          { t("phone.add_a_call_agent") || "Add a Call Agent"}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3 justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0 max-w-[270px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A687C] w-4 h-4" />
          <input
            type="text"
            placeholder={t("phone.search_name_or_phone_number") || "Search name or phone number"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E1E4EA] bg-white rounded-lg focus:outline-none focus:border-[#675FFF] text-sm"
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

      {/* Table */}
      <div className="rounded-2xl border border-[#D6D6D6] overflow-auto mb-2 w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-[#F7F7F8]">
              <tr className="text-[#5A687C]">
                <th className="px-6 text-start py-3 text-[16px] font-[400]">{t("appointment.agent_name")}</th>
                <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("phone.language")}</th>
                <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("phone.voice")}</th>
                <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("brain_ai.phone_no")}</th>
                <th className="px-3 text-center py-3 text-[16px] font-[400]">{t("phone.status")}</th>
                <th className="px-6 text-center py-3 text-[16px] font-[400]">{t("phone.actions")}</th>
              </tr>
            </thead>

            <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">
              {loading ? (
                <tr className="h-34">
                  <td></td>
                  <td></td>
                  <td className="text-center"><span className="loader" /></td>
                  <td></td>
                  <td></td>
                  <td ></td>
                </tr>
              ) : (() => {
                // Filter agents based on search query and filters
                const filteredAgents = agents.filter((agent) => {
                  // Search filter
                  if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    const matchesSearch = 
                      agent.agent_name?.toLowerCase().includes(query) ||
                      agent.phone_numbers?.toLowerCase().includes(query);
                    if (!matchesSearch) return false;
                  }
                  
                  // Language filter
                  if (filters.language && agent.language?.toLowerCase() !== filters.language.toLowerCase()) {
                    return false;
                  }
                  
                  // Voice filter
                  if (filters.voice && agent.voice?.toLowerCase() !== filters.voice.toLowerCase()) {
                    return false;
                  }
                  
                  return true;
                });
                
                return filteredAgents.length !== 0 ? (
                  filteredAgents.map((agent, index) => (
                  <tr key={agent.id} className="text-[16px] text-[#1E1E1E]">
                    <td className="px-4 py-4 text-[16px] text-[#1E1E1E] font-medium text-start">{agent.agent_name}</td>
                    <td className="px-4 py-4 text-[16px] text-start">{agent.language.charAt(0).toLocaleUpperCase() + agent.language.substring(1, agent.language.length)}</td>
                    <td className="px-4 py-4 text-[16px] text-start">{agent.voice}</td>
                    <td className="px-4 py-4 text-[16px] text-start">{agent.phone_numbers}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <ToggleSwitch
                          checked={agent.status}
                          onChange={() => toggleActive(agent.id)}
                          className="cursor-pointer"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap relative">
                      <div className='flex items-center justify-center gap-2'>
                        <button 
                          onClick={(e) => handleDropdownClick(index, e)} 
                          className="p-2 rounded-lg cursor-pointer relative"
                        >
                          <div className='bg-white border border-[#D6D6D6] shadow-sm p-2 rounded-lg'><Ellipsis className="text-black"/></div>
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr className="h-34">
                    <td colSpan="6" className="text-center text-[#1E1E1E]">
                      {t("phone.no_call_agents")}
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>

          {activeDropdown !== null && (() => {
            const filteredAgents = agents.filter((agent) => {
              if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch = 
                  agent.agent_name?.toLowerCase().includes(query) ||
                  agent.phone_numbers?.toLowerCase().includes(query);
                if (!matchesSearch) return false;
              }
              
              if (filters.language && agent.language?.toLowerCase() !== filters.language.toLowerCase()) {
                return false;
              }
              
              if (filters.voice && agent.voice?.toLowerCase() !== filters.voice.toLowerCase()) {
                return false;
              }
              return true;
            });
            
            if (!filteredAgents[activeDropdown]) return null;
            
            const selectedAgent = filteredAgents[activeDropdown];
            return (
              <div
                ref={dropdownRef}
                data-dropdown
                className="fixed w-36 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-[9999]"
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
                      // Handle View Report action
                      setActiveDropdown(null);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className='group-hover:hidden'><DocIcon /></div>
                      <div className='hidden group-hover:block'><DocIcon status={true} /></div>
                      <span>{t("emailings.view_report")}</span>
                    </div>
                  </button>
                  <button
                    className="block group w-full cursor-pointer text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF]"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle Edit action
                      setActiveDropdown(null);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className='group-hover:hidden'><Edit /></div>
                      <div className='hidden group-hover:block'><Edit status={true} /></div>
                      <span>{t("edit")}</span>
                    </div>
                  </button>
                  <div className="">
                    <button
                      className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-[#F4F5F6] hover:rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle Delete action
                        setActiveDropdown(null);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Delete />
                        <span>{t("delete")}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="flex items-center justify-between bg-[#F7F7F8] px-4 py-3">
            {/* pagination + row controls */}
            <div className="flex items-center gap-2">
              <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer">
                ‹ Prev
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
                Next ›
              </button>
            </div>

            {/* Right side – rows per page */}
            <div className="flex items-center gap-2 text-sm text-[#5A687C]">
              <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] bg-white cursor-pointer">5 rows</button>
              <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] hover:bg-white cursor-pointer">10</button>
              <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] hover:bg-white cursor-pointer">20</button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-h-[80vh] overflow-auto w-full max-w-[400px] p-6 relative shadow-lg">
            <button
              className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowModal(false)
                setAgent({ agent_name: "", language: "", voice: "", type: "", phone_number: [] })
                setError({})
              }}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-8">
             {t("phone.add_new_call_agent")}
            </h2>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm  font-medium block mb-1">
                {t("appointment.agent_name")}
                </label>
                <input
                  type="text"
                  placeholder={t("phone.enter_number_placeholder")}
                  className={`w-full px-4 py-2 border rounded-lg resize-none ${error.agent_name ? 'border-red-500' : 'border-[#E1E4EA]'} focus:outline-none focus:border-[#675FFF]`}
                  value={agent.agent_name}
                  name="agent_name"
                  onChange={(e) => { setAgent({ ...agent, agent_name: e.target.value }); setError({ ...error, agent_name: "" }) }
                  }
                />
                {error.agent_name && <p className="text-red-500 text-sm mt-1">{error.agent_name}</p>}
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  {t("phone.language")}
                </label>
                <SelectDropdown
                  name="language"
                  placeholder={t("select")}
                  options={[
                    { key: 'english', label: 'English' },
                    { key: 'french', label: 'French' },
                  ]}
                  value={agent.language}
                  onChange={(selectedLanguage) => {
                    setAgent({ ...agent, language: selectedLanguage });
                    setError({ ...error, language: '' });
                  }}
                  className="mt-2"
                  errors={error}
                />
                {error.language && <p className="text-red-500 text-sm mt-1">{error.language}</p>}
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  {t("phone.voice")}
                </label>
                <SelectDropdown
                 placeholder={t("select")}
                  name="voice"
                  options={[
                    { key: 'English', label: 'English' },
                    { key: 'French', label: 'French' },
                  ]}
                  value={agent.voice}
                  onChange={(selectedVoice) => {
                    setAgent({ ...agent, voice: selectedVoice });
                    setError({ ...error, voice: '' });
                  }}
                  className="mt-2"
                  errors={error}
                />
                {error.voice && <p className="text-red-500 text-sm mt-1">{error.voice}</p>}
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                 {t("phone.type")}
                </label>
                <SelectDropdown
                  placeholder={t("select")}
                  name="type"
                  options={[
                    { key: 'inbound', label: t("phone.inbound") },
                    { key: 'outbound', label: t("phone.outbound") },
                  ]}
                  value={agent.type}
                  onChange={(selectedType) => {
                    // Changed from array reset to string reset
                    setAgent({ ...agent, type: selectedType, phone_number: "" });
                    setError({ ...error, type: '' });
                  }}
                  className="mt-2"
                  errors={error}
                />
                {error.type && <p className="text-red-500 text-sm mt-1">{error.type}</p>}
              </div>

              <div>
                <div className="flex items-center gap-2 ">
                  <label className="text-sm font-medium block mb-1">
                {t("phone.phone_number")}
                  </label>

                  <div className="relative group">
                    <Info className="text-gray-500 cursor-pointer mb-1" size={16} />
                    <div className="absolute bottom-full flex-col mb-1 gap-1 w-60 left-3 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 hidden group-hover:flex transition-opacity duration-200 z-10">
                      {t("phone.inbound_can_choose_one_number")}
                    </div>
                  </div>
                </div>
                <div className="relative" ref={phoneNumberRef}>
                  <button
                    ref={buttonRef}
                    onClick={() => setShowPhoneNumberList((prev) => !prev)}
                    className={`w-full flex items-center justify-between focus:outline-none focus:border-[#675FFF] bg-white border ${error.phone_number ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 cursor-pointer`}
                  >
                    {/* Changed from array to string - now displays single phone number */}
                    <span className={`truncate ${agent.phone_number ? 'text-[#1E1E1E]' : 'text-[#5A687C]'}`}>{agent.phone_number ? (() => {
                      const found = phoneNumbers?.length > 0 && phoneNumbers.find(d => d.key === agent.phone_number);
                      return found?.label || agent.phone_number;
                    })() : t("select")}</span>
                    <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${showPhoneNumberList ? 'transform rotate-180' : ''}`} />
                  </button>
                  {showPhoneNumberList && (
                    <div className={`absolute z-50 mt-1 w-full ${openUpward ? 'bottom-full mb-1' : 'mt-1'}`}>
                      {/* Changed from array to string - now handles single phone number selection */}
                      <CustomSelector
                        options={phoneNumbers?.length > 0 && phoneNumbers}
                        setShowSelector={setShowPhoneNumberList}
                        value={agent.phone_number}
                        onChange={(selectedPhone) => {
                          setAgent({ ...agent, phone_number: selectedPhone });
                          setError({ ...error, phone_number: '' });
                          setShowPhoneNumberList(false);
                        }}
                        ref={phoneNumberRef}
                      />
                    </div>
                  )}
                  {error.phone_number && <p className="text-red-500 text-sm mt-1">{error.phone_number}</p>}
                </div>

              </div>

            </div>
              {error.response && <p className="text-red-500 text-sm mt-1">{error.response}</p>}

            {/* Footer */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowModal(false)
                  setAgent({ agent_name: "", language: "", voice: "", type: "", phone_number: "" })
                  setError({})
                }}
                className="w-full cursor-pointer text-[16px] text-[#5A687C] bg-white border-[1.5px] border-[#E1E4EA] rounded-[8px] h-[38px]"
              >
              {t("cancel")}
              </button>
              <button
                className="w-full cursor-pointer text-[16px] text-white rounded-[8px] bg-[#5E54FF]  h-[38px] flex items-center justify-center gap-2 relative"
                disabled={loader}
                onClick={submitForm}
              >
                <p> {t("phone.add_number")}</p>
                {loader && <span className="loader text-[#5E54FF]"></span>}
              </button>
              
            </div>
          </div>
                  </div>
        )}

      {/* Toast notifications */}
      <ToastModal
        open={toast.open}
        type={toast.type}
        title={toast.title}
        description={toast.description}
        highlightText={toast.highlightText}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
      </div>
    );
  }

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${checked ? "bg-indigo-500" : "bg-gray-300"
        }`}
    >
      <span
        className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${checked ? "translate-x-4" : "translate-x-0"
          }`}
      />
    </button>
  );
}


