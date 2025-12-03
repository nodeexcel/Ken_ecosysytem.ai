import React, { useState, useRef, useEffect, useMemo } from "react";
import { MoreHorizontal, X, Search } from "lucide-react";
import { BritishFlag, Delete, Notes, Phone, TestCall, ThreeDots } from "../icons/icons";
import DatePicker from "react-datepicker";
import { LuCalendarDays } from "react-icons/lu";
import { SelectDropdown } from "./Dropdown";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { inboundCall } from "../api/callAgent";

// Static data removed - now using API data

const countries = [
    { name: "United States", code: "US", dial_code: "+1", flag: <BritishFlag /> },
    { name: "United Kingdom", code: "GB", dial_code: "+44", flag: <BritishFlag /> },
    { name: "India", code: "IN", dial_code: "+91", flag: <BritishFlag /> },
    // Add more countries as needed
];

export default function InBoundCalls() {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [secondModel, setSecondModel] = useState(false);
    const [toggleTom, setToggleTom] = useState(true);
    const modalRef = useRef(null);
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        campaign: ""
    });
    const [loading, setLoading] = useState(true);
    const [agents, setAgents] = useState([]);
    const [error, setError] = useState(null);

    // Define campaign options (extract unique campaigns from agents)
    const campaignOptions = useMemo(() => {
        if (!Array.isArray(agents)) return [];
        const uniqueCampaigns = [...new Set(agents.map(agent => agent.campaign_name).filter(Boolean))];
        return uniqueCampaigns.map(campaign => ({
            key: campaign.toLowerCase().replace(/\s+/g, '-'),
            label: campaign
        }));
    }, [agents]);

    // Fetch inbound calls data on component mount
    useEffect(() => {
        const fetchInboundCalls = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await inboundCall();
                
                // Ensure we always set an array
                if (response && response.data && Array.isArray(response.data)) {
                    setAgents(response.data);
                } else if (response && Array.isArray(response)) {
                    setAgents(response);
                } else {
                    setAgents([]);
                }
            } catch (err) {
                console.error('Error fetching inbound calls:', err);
                setError('Failed to load inbound calls data');
                setAgents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInboundCalls();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        }
        if (showModal) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showModal]);

    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    // Filter agents based on search query, date range, and campaign
    const filteredAgents = useMemo(() => {
        // Ensure agents is an array before filtering
        if (!Array.isArray(agents)) {
            return [];
        }
        
        return agents.filter((agent) => {
            // Safety check for agent object
            if (!agent || typeof agent !== 'object') {
                return false;
            }
            
            // Search filter - search by name or phone number
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch = 
                    agent.agent_name?.toLowerCase().includes(query) ||
                    agent.caller_no?.toLowerCase().includes(query) ||
                    agent.campaign_name?.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }
            
            // Campaign filter
            if (filters.campaign) {
                const campaignOption = campaignOptions.find(opt => opt.key === filters.campaign);
                if (campaignOption) {
                    // Match by label (campaign name)
                    if (agent.campaign_name?.toLowerCase() !== campaignOption.label.toLowerCase()) {
                        return false;
                    }
                } else {
                    // If no option found, try direct match
                    if (agent.campaign_name?.toLowerCase() !== filters.campaign.toLowerCase()) {
                        return false;
                    }
                }
            }
            
            // Filter by date range
            let dateInRange = true;
            if (startDate && endDate && agent.date) {
                let agentDate;
                if (typeof agent.date === 'string') {
                    // Try different date formats
                    if (agent.date.includes('-')) {
                        const agentDateParts = agent.date.split('-');
                        if (agentDateParts.length === 3) {
                            // Convert DD-MM-YYYY to Date object
                            agentDate = new Date(agentDateParts[2], agentDateParts[1] - 1, agentDateParts[0]);
                        } else {
                            agentDate = new Date(agent.date);
                        }
                    } else if (agent.date.includes('/')) {
                        const agentDateParts = agent.date.split('/');
                        if (agentDateParts.length === 3) {
                            agentDate = new Date(agentDateParts[2], agentDateParts[1] - 1, agentDateParts[0]);
                        } else {
                            agentDate = new Date(agent.date);
                        }
                    } else {
                        agentDate = new Date(agent.date);
                    }
                } else {
                    agentDate = new Date(agent.date);
                }
                
                if (!isNaN(agentDate.getTime())) {
                    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999);
                    dateInRange = agentDate >= start && agentDate <= end;
                } else {
                    dateInRange = false;
                }
            }
            
            return dateInRange;
        });
    }, [agents, searchQuery, filters.campaign, startDate, endDate, campaignOptions]);

    // Format date range for display
    const dateRangeDisplay = useMemo(() => {
        if (startDate && endDate) {
            const startFormatted = format(startDate, 'd MMM');
            const endFormatted = format(endDate, 'd MMM');
            return `${startFormatted} - ${endFormatted}`;
        } else if (startDate) {
            return `${format(startDate, 'd MMM')} - ...`;
        }
        return "Select date range";
    }, [startDate, endDate]);

    return (
        <div className="py-6 px-6 h-screen overflow-auto flex flex-col gap-4 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl md:text-2xl font-semibold text-[#1E1E1E]">{t("phone.outbound_calls")}</h1>
              <p className="text-sm md:text-base text-[#5A687C] font-[400]">Monitor all inbound calls received through your campaigns</p>
            </div>
            {/* <button
                    className="bg-[#7065F0] text-white font-medium px-5 py-2 rounded-lg shadow"
                    onClick={() => setShowModal(true)}
                >
                    New Campaign
                </button> */}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-3 justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-0 max-w-[270px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A687C] w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search name or phone number"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#E1E4EA] bg-white rounded-lg focus:outline-none focus:border-[#675FFF] text-sm"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap sm:flex-nowrap gap-3 flex-shrink-0">
                    <div className="relative">
                        <DatePicker
                            selected={startDate}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            onChange={(dates) => {
                                const [start, end] = dates;
                                if (start) setStartDate(start);
                                if (end) setEndDate(end);
                                // Reset if both are null
                                if (!start && !end) {
                                    setStartDate(new Date());
                                    setEndDate(new Date());
                                }
                            }}
                            dateFormat="d MMM"
                            customInput={
                                <button className="flex items-center gap-2 px-4 py-[6px] bg-white text-[#5A687C] border border-[#E1E4EA] rounded-lg text-[16px] focus:border-[#675FFF] focus:outline-none">
                                    {dateRangeDisplay}
                                    <LuCalendarDays className="text-[16px]" />
                                </button>
                            }
                        />
                    </div>
                    <div className="w-48 text-[13px] font-[500]">
                        <SelectDropdown
                            name="campaign"
                            options={campaignOptions}
                            placeholder={t("emailings.campaign")}
                            value={filters.campaign}
                            onChange={(value) => setFilters({ ...filters, campaign: value })}
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
                      <th className="px-6 text-start py-3 text-[16px] font-[400]">{t("emailings.campaign_name")}</th>
                      <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("appointment.agent_name")}</th>
                      <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("brain_ai.date")}</th>
                      <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("phone.language")}</th>
                      <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("phone.voice")}</th>
                      <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("phone.receipient_no")}</th>
                      <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("phone.status")}</th>
                      <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("phone.duration")}</th>
                      <th className="px-6 text-center py-3 text-[16px] font-[400]">{t("phone.actions")}</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">
                    {loading ? (
                      <tr>
                        <td colSpan="9" className="text-center py-8">
                          <span className="loader" />
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="9" className="text-center py-8">
                          <div className="flex flex-col justify-center items-center text-center">
                            <p className="text-[#FF3B30] text-[16px] mb-2">{error}</p>
                            <button 
                              onClick={() => window.location.reload()} 
                              className="text-[#675FFF] text-[14px] hover:underline cursor-pointer"
                            >
                              Try Again
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : filteredAgents.length !== 0 ? (
                      filteredAgents.map((agent, index) => (
                        <tr key={agent.id} className="text-[16px] text-[#1E1E1E]">
                          <td className="px-4 py-4 text-[16px] text-[#1E1E1E] font-[600] text-start">{agent.agent_name}</td>
                          <td className="px-4 py-4 text-[16px] text-[#5A687C] text-start">{agent.date}</td>
                          <td className="px-4 py-4 text-[16px] text-[#5A687C] text-start">{agent.language}</td>
                          <td className="px-4 py-4 text-[16px] text-[#5A687C] text-start">{agent.voice}</td>
                          <td className="px-4 py-4 text-[16px] text-[#5A687C] text-start">{agent.caller_no}</td>
                          <td className="px-4 py-4 text-start">
                            <span className={`inline-block ${agent.status !== "Replied" ? "text-[#34C759]" : "text-[#FF3B30]"} text-[16px] font-[400] px-3 py-1 rounded-full`}>
                              {agent.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-[16px] text-[#5A687C] text-start">{agent.duration}</td>
                          <td className="px-4 py-4 text-center">
                            <button onClick={() => handleDropdownClick(index)} className="p-2 rounded-lg relative cursor-pointer">
                              <div className='bg-[#F4F5F6] p-2 rounded-lg'><ThreeDots /></div>
                              {activeDropdown === index && (
                                <div className="absolute right-0 px-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                                  <div className="py-1">
                                    <button
                                      className="block group w-full hover:rounded-lg text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] font-[500] hover:bg-[#F4F5F6] cursor-pointer"
                                      onClick={() => {
                                        // Handle edit action
                                        setActiveDropdown(null);
                                      }}
                                    >
                                      <div className="flex items-center gap-2"><div className='group-hover:hidden'><Phone /></div> <div className='hidden group-hover:block'><Phone active={true} /></div> <span>Listen the call</span> </div>
                                    </button>
                                    <button
                                      className="block group w-full hover:rounded-lg text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] font-[500] hover:bg-[#F4F5F6] cursor-pointer"
                                      onClick={() => {
                                        // Handle delete action
                                        setActiveDropdown(null);
                                      }}
                                    >
                                      <div className="flex items-center gap-2"><div className='group-hover:hidden'><Notes /></div> <div className='hidden group-hover:block'><Notes status={true} /></div> <span>Notes</span> </div>
                                    </button>
                                    <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                                    <div className='py-2'>
                                      <button
                                        className="block w-full text-left hover:rounded-lg px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6] cursor-pointer"
                                        onClick={() => {
                                          // Handle delete action
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        <div className="flex items-center gap-2">{<Delete />} <span className="font-[500]">Delete</span> </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-8 text-[#1E1E1E]">
                          No Inbound Calls Listed
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    {!secondModel ? <div
                        ref={modalRef}
                        className="bg-white rounded-2xl z-40 w-full max-w-2xl p-6 relative h-[90vh] overflow-y-auto"
                    >
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            onClick={() => setShowModal(false)}
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-semibold mb-6">Add New Campaign</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Campaign Name</label>
                                <input
                                    type="text"
                                    placeholder={t("phone.enter_campaign_name")}
                                    className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Language</label>
                                    <select className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:border-[#675FFF] focus:outline-none">
                                        <option>Select</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Voice</label>
                                    <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                        <option>Select</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Choose Calendar</label>
                                    <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                        <option>Select</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Max Call Time (Minutes)</label>
                                    <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                        <option>Select</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Target Lists</label>
                                <select className="w-full px-4 py-2 border rounded-lg border-gray-300 hover:border-[#675FFF] focus:border-[#675FFF] focus:outline-none">
                                    <option>Select</option>
                                </select>
                                <button className="text-[#7065F0] text-sm font-medium mt-1">+ Create New Contact List</button>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Choose an Agent</label>
                                <select className="w-full px-4 py-2 border rounded-lg border-gray-300 hover:border-[#675FFF] focus:border-[#675FFF] focus:outline-none">
                                    <option>Select</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-medium block mb-1">
                                    Phone Number
                                </label>
                                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:border-[#675FFF] focus-within:border-[#675FFF]">
                                    <select
                                        className="outline-none bg-transparent pr-2 text-xl focus:outline-none"
                                        value={countries[0].code}
                                    >
                                        {countries.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.flag} {country.dial_code}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        placeholder={t("phone.enter_number")}
                                        className="w-full outline-none focus:outline-none"
                                    />
                                </div>
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
                                    className="w-full px-4 py-2 border rounded-lg border-gray-300 hover:border-[#675FFF] focus:border-[#675FFF] focus:outline-none resize-none"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Your Call Script</label>
                                <textarea
                                    placeholder="Enter your call script"
                                    className="w-full px-4 py-2 border rounded-lg border-gray-300 hover:border-[#675FFF] focus:border-[#675FFF] focus:outline-none resize-none"
                                    rows={4}
                                />
                            </div>

                            <div className="flex gap-4 mt-6 justify-between">
                                <button onClick={() => setSecondModel(true)} className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px] hover:border-[#675FFF] focus:border-[#675FFF] focus:outline-none">
                                    Test Call
                                </button>
                                <button className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px] hover:bg-[#5A52E5] focus:bg-[#5A52E5] focus:outline-none">
                                    Launch Calls
                                </button>
                            </div>
                        </div>
                    </div> : <div className="bg-white rounded-2xl w-full max-w-[514px] p-6 relative shadow-lg">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                setShowModal(false)
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
                                onClick={() => setShowModal(false)}
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
                    </div>}
                </div>
            )}
        </div>
    );
}
