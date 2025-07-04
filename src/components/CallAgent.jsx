import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, Info, MoreHorizontal, X } from "lucide-react";
import { AlertIcon, ThreeDots } from "../icons/icons";
import { FaChevronDown } from "react-icons/fa";
import uk_flag from "../assets/images/uk_flag.png"
import us_flag from "../assets/images/us_flag.png"
import fr_flag from "../assets/images/fr_flag.png"
import { getPhoneNumber, createPhoneAgent, getCallAgent, updatePhoneNumberAgentStatus } from "../api/callAgent";
import { SelectDropdown } from "./Dropdown";
import { useTranslation } from "react-i18next";

const countries = [
  { name: "United States", code: "US", dial_code: "+1", flag: us_flag },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: uk_flag }, ,
  { name: "France", code: "FR", dial_code: "+33", flag: fr_flag }, ,
  // Add more countries as needed
];

export default function CallAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [agent, setAgent] = useState({ agent_name: "", language: "", voice: "", type: "", phone_number: [] });
  const [error, setError] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inboundLimitStatus, setInboundLimitStatus] = useState(false)
  const [showPhoneNumberList, setShowPhoneNumberList] = useState(false)
  const [openUpward, setOpenUpward] = useState(false);
  const { t } = useTranslation();


  const buttonRef = useRef(null);
  const phoneNumberRef = useRef()

  // Add filter state
  const [filters, setFilters] = useState({
    country: "",
    language: "",
    voice: ""
  });

  const countryOptions = [
    { key: "US", label: "United States" },
    { key: "GB", label: "United Kingdom" },
    { key: "FR", label: "France" }
  ];

  const languageOptions = [
    { key: "english", label: "English" },
    { key: "french", label: "French" },
    { key: "spanish", label: "Spanish" }
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
    return `${filterCode[0]?.dial_code}-${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`
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

  const fetchPhoneNumbers = async () => {
    try {
      const response = await getPhoneNumber();
      if (response.status === 200) {
        if (response.data.phone_numbers?.length > 0) {
          const data = response.data.phone_numbers.map((e) => ({
            label: renderPhoneNumber(e.phone_number, e.country),
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
    if (agent.phone_number?.length === 0) error.phone_number = t("phone.agent_phone_number_validation");
    setError({ ...error });
    return Object.keys(error).length === 0;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!isValidForm()) {
      return;
    } else {
      const response = await createPhoneAgent(agent);

      if (response.status === 201) {
        setShowModal(false);
        setLoader(true);
        setAgent({ name: "", language: "", voice: "", type: "", phone: "" });
        fetchAgents();
      } else {
        console.log("Error creating agent:", response);
      }
      setLoader(false);
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
    <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-semibold text-black">{t("phone.call_agents")}</h1>
        <button className="bg-[#7065F0] text-white font-medium px-5 py-2 rounded-lg shadow" onClick={() => setShowModal(true)}>
          {
            t("phone.new_agent")
          }
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-3">
        <div className="w-48">
          <SelectDropdown
            name="country"
            options={countryOptions}
            placeholder={t("phone.country")}
            value={filters.country}
            onChange={(value) => setFilters({ ...filters, country: value })}
          />
        </div>

        <div className="w-48">
          <SelectDropdown
            name="language"
            options={languageOptions}
            placeholder={t("phone.language")}
            value={filters.language}
            onChange={(value) => setFilters({ ...filters, language: value })}
          />
        </div>

        <div className="w-48">
          <SelectDropdown
            name="voice"
            options={voiceOptions}
            placeholder={t("phone.voice")}
            value={filters.voice}
            onChange={(value) => setFilters({ ...filters, voice: value })}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto w-full">
        <table className="w-full">
          <div className="px-5 w-full">
            <thead>
              <tr className="text-left text-[#5A687C] text-[16px]">
                <th className="p-[14px] min-w-[200px] max-w-[20%] w-full font-[400] whitespace-nowrap">{t("appointment.agent_name")}</th>
                <th className="p-[14px] min-w-[200px] max-w-[20%] w-full font-[400] whitespace-nowrap">{t("phone.language")}</th>
                <th className="p-[14px] min-w-[200px] max-w-[20%] w-full font-[400] whitespace-nowrap">{t("phone.voice")}</th>
                <th className="p-[14px] min-w-[200px] max-w-[20%] w-full font-[400] whitespace-nowrap">{t("brain_ai.phone_no")}</th>
                <th className="p-[14px] min-w-[200px] max-w-[20%] w-full font-[400] whitespace-nowrap">{t("phone.status")}</th>
                <th className="p-[14px] min-w-[200px] max-w-[20%] w-full font-[400] whitespace-nowrap">{t("phone.actions")}</th>
              </tr>
            </thead>
          </div>
          <div className="border border-[#E1E4EA] w-full bg-white rounded-2xl p-3">
            {loading ? <p className="flex justify-center items-center h-34"><span className="loader" /></p> :
              agents.length !== 0 ?
                <tbody className="w-full">
                  {agents.map((agent, index) => (
                    <tr
                      key={agent.id}
                      className={`${index !== agents.length - 1 ? 'border-b border-[#E1E4EA]' : ''}`}
                    >
                      <td className="p-[14px] min-w-[200px] max-w-[20%] w-full font-medium text-gray-900">{agent.agent_name}</td>
                      <td className="py-[14px] pl-[20px] pr-[14px] min-w-[200px] max-w-[20%] w-full">{agent.language.charAt(0).toLocaleUpperCase() + agent.language.substring(1, agent.language.length)}</td>
                      <td className="p-[14px] min-w-[200px] max-w-[20%] w-full">{agent.voice}</td>
                      <td className="p-[14px] min-w-[200px] max-w-[20%] w-full">{agent.phone_numbers}</td>
                      <td className="p-[14px] min-w-[200px] max-w-[20%] w-full">
                        <div className="flex items-center gap-3 ">
                          <ToggleSwitch
                            checked={agent.status}
                            onChange={() => toggleActive(agent.id)}
                            className="cursor-pointer"
                          />
                        </div>
                      </td>
                      <td className="p-[14px] min-w-[200px] max-w-[20%] w-full whitespace-nowrap">
                        <div className='flex items-center gap-2'>
                          <button className='text-[#5A687C] px-2 py-1 border-2 text-[16px] font-[500] border-[#E1E4EA] rounded-lg'>
                            {t("emailings.view_report")}
                          </button>
                          <button className="p-2 rounded-lg">
                            <div className='bg-[#F4F5F6] p-2 rounded-lg'><ThreeDots /></div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody> : <p className="flex justify-center items-center h-34 text-[#1E1E1E]">{t("phone.no_call_agents")}</p>}
          </div>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-h-[85vh] overflow-auto w-full max-w-[610px] p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
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
                    setAgent({ ...agent, type: selectedType, phone_number: [] });
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
                    <span className={`truncate ${agent.phone_number?.length > 0 ? 'text-[#1E1E1E]' : 'text-[#5A687C]'}`}>{agent.phone_number?.length > 0
                      ? agent.phone_number.map(dayKey => {
                        const found = phoneNumbers?.length > 0 && phoneNumbers.find(d => d.key === dayKey);
                        return found?.label;
                      }).join(', ')
                      : t("select")}</span>
                    <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${showPhoneNumberList ? 'transform rotate-180' : ''}`} />
                  </button>
                  {showPhoneNumberList && (
                    <div className={`absolute z-50 mt-1 w-full ${openUpward ? 'bottom-full mb-1' : 'mt-1'}`}>
                      <CustomSelector
                        options={phoneNumbers?.length > 0 && phoneNumbers}
                        setShowSelector={setShowPhoneNumberList}
                        value={agent.phone_number}
                        onChange={(selectedPhone) => {
                          if (
                            agent.type === "inbound" &&
                            agent.phone_number.length === 1
                          ) {
                            setShowPhoneNumberList(false)
                            setInboundLimitStatus(true)
                          } else {
                            setAgent({ ...agent, phone_number: selectedPhone });
                            setError({ ...error, phone_number: '' });
                          }
                        }
                        }
                        ref={phoneNumberRef}
                      />
                    </div>
                  )}
                  {error.phone_number && <p className="text-red-500 text-sm mt-1">{error.phone_number}</p>}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowModal(false)
                  setAgent({ agent_name: "", language: "", voice: "", type: "", phone_number: [] })
                  setError({})
                }}
                className="w-full text-[16px] text-[#5A687C] bg-white border-[1.5px] border-[#E1E4EA] rounded-[8px] h-[38px]"
              >
              {t("cancel")}
              </button>
              <button
                className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF]  h-[38px] flex items-center justify-center gap-2 relative"
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
      {inboundLimitStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-[406px] p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setInboundLimitStatus(false)
                setShowPhoneNumberList(true)
              }}
            >
              <X size={20} />
            </button>

            <div className="flex flex-col justify-center items-center gap-6 py-4 text-center">
              <div>
                <AlertIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-[20px] font-[600] text-[#1E1E1E]">
                  {
                    t("phone.warning_inbound")
                  }
                </h2>
                <p className="text-[14px] font-[400] text-[#5A687C]">
                  {
                    t("phone.warning_inbound_msg")
                  }
                </p>
              </div>
              <button
                className="w-full bg-[#675FFF] text-center text-white px-5 py-[7px] border-[1.5px] border-[#5F58E8] font-[500] test-[16px]  rounded-lg"
                onClick={() => {
                  setInboundLimitStatus(false)
                  setShowPhoneNumberList(true)
                }}
              >
                {
                  t("phone.ok")
                }
              </button>
            </div>
          </div>
        </div>
      )}
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


