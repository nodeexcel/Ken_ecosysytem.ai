import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, X } from "lucide-react";
import { BritishFlag, Delete, Notes, Phone, TestCall, ThreeDots } from "../icons/icons";
import DatePicker from "react-datepicker";
import { LuCalendarDays } from "react-icons/lu";
import { SelectDropdown } from "./Dropdown";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FaChevronDown } from "react-icons/fa";
import { outboundCall } from "../api/callAgent";

// Mock data for fallback
// const mockAgents = [
//     {
//         id: 1,
//         campaign_name: "XYZ Campaign",
//         agent_name: "Sami",
//         choosen: "chosen by the user",
//         date: "02-05-2024",
//         language: "Francais",
//         voice: "Nicolas Petit",
//         recipient_no: "4177809025",
//         status: "No Answer",
//         duration: "1:00 hr"
//     },
//     {
//         id: 2,
//         campaign_name: "XYZ Campaign",
//         agent_name: "Sami",
//         choosen: "chosen by the user",
//         date: "02-05-2024",
//         language: "Francais",
//         voice: "Nicolas Petit",
//         recipient_no: "4177809025",
//         status: "Replied",
//         duration: "1:00 hr"
//     },
//     {
//         id: 3,
//         campaign_name: "XYZ Campaign",
//         agent_name: "Sami",
//         choosen: "chosen by the user",
//         date: "02-05-2024",
//         language: "Francais",
//         voice: "Nicolas Petit",
//         recipient_no: "4177809025",
//         status: "Replied",
//         duration: "1:00 hr"
//     },
// ];

import uk_flag from "../assets/images/uk_flag.png"
import us_flag from "../assets/images/us_flag.png"
import fr_flag from "../assets/images/fr_flag.png"

const countries = [
    { name: "United States", code: "US", dial_code: "+1", flag: us_flag},
    { name: "United Kingdom", code: "GB", dial_code: "+44", flag: uk_flag },
    { name: "France", code: "FR", dial_code: "+33", flag: fr_flag },
    // Add more countries as needed
];

export default function OutBoundCalls() {
    const { t } = useTranslation();
    // const countryData = useSelector((state) => state.country.data);
    const [countriesList, setCountriesList] = useState(countries);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [isOpen, setIsOpen] = useState(false);
    const countryRef = useRef();
    const [showModal, setShowModal] = useState(false);
    const [secondModel, setSecondModel] = useState(false);
    const [toggleTom, setToggleTom] = useState(true);
    const modalRef = useRef(null);
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [loading, setLoading] = useState(true);
    const [agents, setAgents] = useState([]);
    const [error, setError] = useState(null);

    // Fetch outbound calls data on component mount
    useEffect(() => {
        fetchOutboundCalls();
    }, []);

    // useEffect(() => {
    //     if (countryData && countryData.length > 0) {
    //         setCountriesList(countryData);
    //         if (!selectedCountry || selectedCountry.code === "US") {
    //             setSelectedCountry(countryData[240] || countryData[0]);
    //         }
    //     }
    // }, [countryData]);

    // Add filter state
    const [filters, setFilters] = useState({
        campaign: "",
        recipient: ""
    });

    // Define campaign options
    const campaignOptions = [
        // { key: "", label: "Campaign" },
        { key: "xyz-campaign", label: "XYZ Campaign" },
        { key: "abc-campaign", label: "ABC Campaign" },
        { key: "def-campaign", label: "DEF Campaign" }
    ];

    // Function to fetch outbound call data
    const fetchOutboundCalls = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await outboundCall();
            
            // Handle the API response structure: { success: [...] }
            let agentsData = [];
            if (response && response.data && response.data.success) {
                agentsData = Array.isArray(response.data.success) ? response.data.success : [];
            } else if (response && response.success) {
                agentsData = Array.isArray(response.success) ? response.success : [];
            } else if (Array.isArray(response)) {
                agentsData = response;
            }
            
            // Transform the data to match the expected format
            const transformedData = agentsData.map((item, index) => ({
                id: index + 1,
                campaign_name: item.campaign_name || "N/A",
                agent_name: item.agent_name || "N/A",
                choosen: "chosen by the user",
                date: item.date ? new Date(item.date).toLocaleDateString() : "N/A",
                language: item.langauage || "N/A", // Note: API has typo "langauage"
                voice: item.voice || "N/A",
                recipient_no: item.recipient_no || "N/A",
                status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "N/A",
                duration: item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')} min` : "N/A"
            }));
            
            if (transformedData.length > 0) {
                setAgents(transformedData);
            } else {
                // Fallback to mock data if API doesn't return expected format
                // setAgents(mockAgents);
            }
        } catch (error) {
            console.error('Error fetching outbound calls:', error);
            setError('Failed to load outbound calls data');
            // Fallback to mock data on error
            // setAgents(mockAgents);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        }
        if (showModal) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showModal]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countryRef.current && !countryRef.current.contains(event.target)) {
                setIsOpen(false);
                setCountriesList(countries);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        if (searchValue === "") {
            setCountriesList(countries);
            return;
        }
        const filteredRows = countries.filter((country) =>
            country.name.toLowerCase().includes(searchValue) ||
            country.dial_code.toLowerCase().includes(searchValue)
        );
        setCountriesList(filteredRows);
    };

    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    

    return (
        <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-black">{t("phone.outbound_calls")}</h1>
                <button
                    className="bg-[#7065F0] text-white font-medium px-5 py-2 rounded-lg shadow"
                    onClick={() => setShowModal(true)}
                >
                    {
                        t("emailings.new_campaign")
                    }
                </button>
            </div>

            {/* Filters */}
            <div className='flex flex-wrap gap-2'>
                <div className="relative">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        customInput={
                            <button className="flex items-center gap-2 px-4 py-[8px] bg-white text-[#5A687C] border border-[#E1E4EA] rounded-lg text-[16px]  focus:border-[#675FFF] focus:outline-none">
                                {
                                    t("phone.start_date")
                                }
                                <LuCalendarDays className="text-[16px]" />
                            </button>
                        }
                    />
                </div>
                <div className="relative">
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        customInput={
                            <button className="flex items-center gap-2 px-4 py-[8px] bg-white text-[#5A687C] border border-[#E1E4EA] rounded-lg text-[16px]  focus:border-[#675FFF] focus:outline-none">
                               {
                                t("phone.end_date")
                               }
                                <LuCalendarDays className="text-[16px]" />
                            </button>
                        }
                    />
                </div>
                <div className="w-48">
                    <SelectDropdown
                        name="campaign"
                        options={campaignOptions}
                        placeholder={t("emailings.campaign")}
                        value={filters.campaign}
                        onChange={(value) => setFilters({ ...filters, campaign: value })}
                    />
                </div>
                <div>
                    <input
                        value={filters.recipient}
                        onChange={(e) => setFilters({ ...filters, recipient: e.target.value })}
                        placeholder={t("phone.receipient")}
                        className="bg-white border text-[#5A687C] max-w-[152px] text-[16px] font-[400] w-fit border-[#E1E4EA] px-4 py-2 rounded-lg focus:border-[#675FFF] focus:outline-none"
                    />
                </div>
            </div>
            {/* Table */}
            <div className="overflow-auto w-full">
                <table className="w-full">
                    <thead> 
                        <tr className="text-left text-[#5a687c] text-[16px]">
                            <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] table-cell-wrap">{t("emailings.campaign_name")}</th>
                            <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] table-cell-wrap">{t("appointment.agent_name")}</th>
                            <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] table-cell-wrap">{t("brain_ai.date")}</th>
                            <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] table-cell-wrap">{t("phone.language")}</th>
                            <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] table-cell-wrap">{t("phone.voice")}</th>
                            <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] table-cell-wrap">{t("phone.receipient_no")}</th>
                            <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] table-cell-wrap">{t("phone.status")}</th>
                            <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] table-cell-wrap">{t("phone.duration")}</th>
                            <th className="p-[14px] w-full font-[400] table-cell-wrap">{t("phone.actions")}</th>
                        </tr>
                    </thead>
                    <tbody className="border border-[#E1E4EA] w-full bg-white rounded-2xl p-3">
                        {loading ? (
                            <tr>
                                <td colSpan="9" className="text-center py-8">
                                    <span className="loader" />
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="9" className="text-center py-8">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <p className="text-red-500 mb-2">{error}</p>
                                        <button 
                                            onClick={fetchOutboundCalls}
                                            className="px-4 py-2 bg-[#7065F0] text-white rounded-lg hover:bg-[#5A52E5]"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : Array.isArray(agents) && agents.length !== 0 ? (
                            agents.map((agent, index) => (
                                        <tr
                                            key={agent.id}
                                            className={`${index !== agents.length - 1 ? 'border-b border-[#E1E4EA]' : ''}`}
                                        >
                                            <td className="p-[14px] min-w-[200px] max-w-[17%] w-full  font-[600] text-[#1E1E1E] text-[16px]">{agent.campaign_name}</td>
                                            <td className="py-[14px] pl-[18px] pr-[14px] min-w-[200px] max-w-[17%] w-full "><div className="flex flex-col text-[16px] text-[#1E1E1E] font-[400] table-cell-wrap">{agent.agent_name}<span className="text-[#5A687C]">{agent.choosen}</span></div></td>
                      <td className="p-[14px] min-w-[200px] max-w-[17%] w-full  text-[#5A687C] table-cell-wrap">{agent.date}</td>
                                            <td className="p-[14px] min-w-[200px] max-w-[17%] w-full  text-[#5A687C]">{agent.language}</td>
                                            <td className="py-[14px] pl-[5px] pr-[14px] min-w-[200px] max-w-[17%] w-full  text-[#5A687C] table-cell-wrap">{agent.voice}</td>
                                            <td className="py-[14px] pl-[5px] pr-[14px] min-w-[200px] max-w-[17%] w-full  text-[#5A687C]">{agent.recipient_no}</td>
                                            <td className="py-[14px] pr-[14px] min-w-[200px] max-w-[17%] w-full table-cell-wrap">
                                                <span className={`inline-block ${agent.status.toLowerCase() === "replied" ? "text-[#34C759]" : "text-[#FF3B30]"} text-[16px] font-[400] px-3 py-1 rounded-full`}>
                                                    {agent.status}
                                                </span>
                                            </td>
                                            <td className="p-[14px] min-w-[200px] max-w-[17%] w-full  text-[#5A687C]">{agent.duration}</td>
                                            <td className="p-[14px] w-full ">
                                                <button onClick={() => handleDropdownClick(index)} className="p-2 rounded-lg">
                                                    <div className='bg-[#F4F5F6] p-2 rounded-lg'><ThreeDots /></div>
                                                </button>
                                                {activeDropdown === index && (
                                                    <div className="absolute right-6 px-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                                                        <div className="py-1">
                                                            <button
                                                                className="block group w-full hover:rounded-lg text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] font-[500] hover:bg-[#F4F5F6]"
                                                                onClick={() => {
                                                                    // Handle edit action
                                                                    setActiveDropdown(null);
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2"><div className='group-hover:hidden'><Phone /></div> <div className='hidden group-hover:block'><Phone active={true} /></div> <span>{t("phone.listen_call")}</span> </div>
                                                            </button>
                                                            <button
                                                                className="block group w-full hover:rounded-lg text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] font-[500] hover:bg-[#F4F5F6]"
                                                                onClick={() => {
                                                                    // Handle delete action
                                                                    setActiveDropdown(null);
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2"><div className='group-hover:hidden'><Notes /></div> <div className='hidden group-hover:block'><Notes status={true} /></div> <span>{t("phone.notes")}</span> </div>
                                                            </button>
                                                            <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                                                            <div className='py-2'>
                                                                <button
                                                                    className="block w-full text-left hover:rounded-lg px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6]"
                                                                    onClick={() => {
                                                                        // Handle delete action
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                >
                                                                    <div className="flex items-center gap-2">{<Delete />} <span className="font-[500]">{t("delete")}</span> </div>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-8 text-[#1E1E1E]">
                                    {t("phone.no_outbound_calls")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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

                        <h2 className="text-xl font-semibold mb-6">{t("phone.add_new_campaign")}</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">{t("emailings.campaigns")}</label>
                                <input
                                    type="text"
                                    placeholder={t("phone.enter_campaign_name")}
                                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:border-[#675FFF] focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">{t("emailings.language")}</label>
                                    <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                        <option>{t("emailings.select")}</option>
                                        <option value="english">{t("sandro.english")}</option>
                                        <option value="french">{t("sandro.french")}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">{t("phone.voice")}</label>
                                    <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                        <option>{t("select")}</option>
                                        <option value="male">{t("phone.male")}</option>
                                        <option value="female">{t("phone.female")}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">{t("phone.choose_calender")}</label>
                                    <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                        <option>{t("select")}</option>
                                        <option value="google">{t("google_calendar")}</option>
                                        <option value="outlook">{t("outlook_calendar")}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">{t("phone.max_call_time")}</label>
                                    <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                        <option>{t("select")}</option>
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                        <option value="60">60</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">{t("phone.target_lists")}</label>
                                <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                    <option>{t("select")}</option>
                                    <option value="list1">{t("brain_ai.list")} 1</option>
                                    <option value="list2">{t("brain_ai.list")} 2</option>
                                </select>
                                <button className="text-[#7065F0] text-sm font-medium mt-1">+ {t("phone.create_new_contact_list")}</button>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">{t("phone.choose_an_agent")}</label>
                                <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                    <option>{t("select")}</option>
                                    <option value="agent1">{t("phone.agent")} 1</option>
                                    <option value="agent2">{t("phone.agent")} 2</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-medium block mb-1">
                                    {t("phone.phone_number")}
                                </label>
                                <div ref={countryRef} className="flex group items-center focus-within:border-[#675FFF] gap-2 border border-gray-300 rounded-lg px-4 py-2">
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsOpen(!isOpen)}
                                            className="w-[120px] flex hover:cursor-pointer relative border-none justify-between gap-1 items-center border py-1 text-left"
                                        >
                                            <div className="flex items-center gap-2 mr-3">
                                                {selectedCountry && <img src={selectedCountry.flag} alt={selectedCountry.name} className="w-4 h-4 rounded-full" />}
                                                <p className="text-[#5A687C] font-[400] text-[16px]">{selectedCountry ? selectedCountry.dial_code : "+1"}</p>
                                            </div>
                                            <FaChevronDown color="#5A687C" className={`w-[10px] transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                                            <hr style={{ color: "#E1E4EA", width: "22px", transform: "rotate(-90deg)" }} />
                                        </button>
                                        {isOpen && (
                                            <div className="absolute px-1 z-10 rounded-md shadow-lg border border-gray-200 max-h-40 overflow-auto top-6 w-full left-[-13px] bg-white mt-1">
                                                <input
                                                    type="text"
                                                    placeholder="Search"
                                                    onChange={handleSearch}
                                                    className="w-full px-3 py-2 border-b border-gray-200 outline-none text-sm"
                                                />
                                                {countriesList.length > 0 ? (
                                                    countriesList.map((country, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => {
                                                                setSelectedCountry(country);
                                                                setIsOpen(false);
                                                                setCountriesList(countries);
                                                            }}
                                                            className={`flex px-2 gap-2 hover:bg-[#F4F5F6] hover:rounded-lg my-1 py-2 ${selectedCountry?.code === country?.code ? "bg-[#F4F5F6] rounded-lg" : ""} cursor-pointer items-center`}
                                                        >
                                                            <img src={country.flag} alt={country.name} className="w-4 h-4 rounded-full" />
                                                            <p className="text-[#5A687C] font-[400] text-[16px]">{country.dial_code}</p>
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
                                        placeholder={t("phone.enter_number")}
                                        className="w-full outline-none focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {t("phone.tom_engages_conversation")}
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
                                <label className="block text-sm text-gray-700 mb-1">{t("phone.your_catch_phrase")}</label>
                                <textarea
                                    placeholder={t("phone.catch_phrase_placeholder")}
                                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:border-[#675FFF] focus:outline-none resize-none"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Your Call Script</label>
                                <textarea
                                    placeholder={t("phone.placeholder_call_script")}
                                    className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none resize-none"
                                    rows={4}
                                />
                            </div>

                            <div className="flex gap-4 mt-6 justify-between">
                                <button onClick={() => setSecondModel(true)} className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px] hover:border-[#675FFF] focus:border-[#675FFF] focus:outline-none">
                    {t("phone.cancel")}
                                </button>
                                <button className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]  focus:bg-[#5A52E5] focus:outline-none">
                                    {t("phone.test_call")}
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
                           {t("phone.test_call")}
                        </h2>
                        <p className="text-gray-500 text-sm mb-4">
                            {t("phone.test_call_with")} <span className="text-[#5E54FF]">Tom</span>
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
                               {t("phone.not_receive_a_call")}
                            </button>
                            <button
                                className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]"
                            >
                               {t("phone.finish_test")}
                            </button>
                        </div>
                    </div>}
                </div>
            )}
        </div>
    );
}
