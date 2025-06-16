import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, Info, MoreHorizontal, X } from "lucide-react";
import { ThreeDots } from "../icons/icons";
import { FaChevronDown } from "react-icons/fa";
import uk_flag from "../assets/images/uk_flag.png"
import us_flag from "../assets/images/us_flag.png"
import fr_flag from "../assets/images/fr_flag.png"
import { getPhoneNumber, createPhoneAgent, getCallAgent, updatePhoneNumberAgentStatus } from "../api/callAgent";
import { SelectDropdown } from "./Dropdown";

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
  const [agent, setAgent] = useState({ agent_name: "", language: "", voice: "", phone_number: "" });
  const [error, setError] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  
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

  const fetchPhoneNumbers = async () => {
    try {
      const response = await getPhoneNumber();
      if (response.status === 200) {
        setPhoneNumbers(response.data.phone_numbers || []);
      } else {
        console.error("Failed to fetch phone numbers");
      }
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
    }
  }

  const isValidForm = () => {
    const error = {};
    if (!agent.agent_name) error.agent_name = "Agent name is required";
    if (!agent.language) error.language = "Language is required";
    if (!agent.voice) error.voice = "Voice is required";
    if (!agent.phone_number) error.phone_number = "Phone number is required";
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
        setAgent({ name: "", language: "", voice: "", phone: "" });
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
        <h1 className="text-2xl font-semibold text-black">Call Agents</h1>
        <button className="bg-[#7065F0] text-white font-medium px-5 py-2 rounded-lg shadow" onClick={() => setShowModal(true)}>
          New Agent
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
              <th className="px-6 py-3 font-medium whitespace-nowrap">Agent Name</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Language</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Voice</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Phone No</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Status</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white border rounded-2xl border-[#E1E4EA]  p-3 ">
            {loading ? <tr className='h-34'><td ></td><td ></td><td ></td><td><span className='loader' /></td></tr> : agents.length !== 0 ? (agents.map((agent, index) => (
              <tr
                key={agent.id}
                className={`hover:bg-gray-50 ${index !== agents.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <td className="px-6 py-4 font-medium text-gray-900 ml-3">{agent.agent_name}</td>
                <td className="px-6 py-4">{agent.language.charAt(0).toLocaleUpperCase() + agent.language.substring(1, agent.language.length)}</td>
                <td className="px-6 py-4">{agent.voice}</td>
                <td className="px-6 py-4">{agent.phone_numbers}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 ">
                    <ToggleSwitch
                      checked={agent.status}
                      onChange={() => toggleActive(agent.id)}
                      className="cursor-pointer"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className='flex items-center gap-2'>
                    <button className='text-[#5A687C] px-2 py-1 border-2 text-[16px] font-[500] border-[#E1E4EA] rounded-lg'>
                      View Report
                    </button>
                    <button className="p-2 rounded-lg">
                      <div className='bg-[#F4F5F6] p-2 rounded-lg'><ThreeDots /></div>
                    </button>
                  </div>
                </td>
              </tr>
            ))) : (
              <tr className="text-sm text-[#1e1e1e]">
                <td colSpan="7" className="px-6 py-5 text-center text-gray-500">
                  No phone numbers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[610px] p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-8">
              Add a New Call Agent
            </h2>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm  font-medium block mb-1">
                  Agent Name
                </label>
                <input
                  type="text"
                  placeholder="Enter number name"
                  className="w-full px-4 py-2 border rounded-lg resize-none border-[#E1E4EA] focus:outline-none focus:border-[#675FFF]"
                  value={agent.agent_name}
                  name="agent_name"
                  onChange={(e) => { setAgent({ ...agent, agent_name: e.target.value }); setError({ ...error, agent_name: "" }) }
                  }
                />
                {error.agent_name && <p className="text-red-500 text-sm mt-1">{error.agent_name}</p>}
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Language
                </label>
                <SelectDropdown
                  name="language"
                  options={[
                    { key: '', label: 'Select' },
                    { key: 'english', label: 'English' },
                    { key: 'french', label: 'French' },
                  ]}
                  value={agent.language}
                  onChange={(selectedLanguage) => {
                    setAgent({ ...agent, language: selectedLanguage });
                    setError({ ...error, language: '' });
                  }}
                  className="mt-2"
                />
                {error.language && <p className="text-red-500 text-sm mt-1">{error.language}</p>}
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Voice
                </label>
                <SelectDropdown
                  name="voice"
                  options={[
                    { key: '', label: 'Select' },
                    { key: 'English', label: 'English' },
                    { key: 'French', label: 'French' },
                  ]}
                  value={agent.voice}
                  onChange={(selectedVoice) => {
                    setAgent({ ...agent, voice: selectedVoice });
                    setError({ ...error, voice: '' });
                  }}
                  className="mt-2"
                />
                {error.voice && <p className="text-red-500 text-sm mt-1">{error.voice}</p>}
              </div>

              <div>
                <div className="flex items-center gap-2 ">
                  <label className="text-sm font-medium block mb-1">
                    Phone Number
                  </label>

                  <div className="relative group">
                    <Info className="text-gray-500 cursor-pointer mb-1" size={16} />
                    <div className="absolute bottom-full flex-col mb-1 gap-1 w-60 left-3 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 hidden group-hover:flex transition-opacity duration-200 z-10">
                      {`For inbound user can choose one number but for outbound user can choose multiples.`}
                    </div>
                  </div>
                </div>

                <SelectDropdown
                  name="phone_number"
                  options={phoneNumbers?.length > 0 && [...phoneNumbers.map((number) => ({
                    key: number.phone_number,
                    label: number.phone_number
                  }))]}
                  value={agent.phone_number}
                  onChange={(selectedPhone) => {
                    setAgent({ ...agent, phone_number: selectedPhone });
                    setError({ ...error, phone_number: '' });
                  }}
                  placeholder="Select"
                  className="mt-2"
                />

                {error.phone_number && <p className="text-red-500 text-sm mt-1">{error.phone_number}</p>}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
              >
                Cancel
              </button>
              <button
                className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF]  h-[38px] flex items-center justify-center gap-2 relative"
                disabled={loader}
                onClick={submitForm}
              >
                <p>  Add Number</p>
                {loader && <span className="loader text-[#5E54FF]"></span>}
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


