import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, X } from "lucide-react";
import { BritishFlag, Delete, Notes, Phone, TestCall, ThreeDots } from "../icons/icons";
import DatePicker from "react-datepicker";
import { LuCalendarDays } from "react-icons/lu";
import { SelectDropdown } from "./Dropdown";

const agents = [
    {
        id: 1,
        campaign_name: "XYZ Campaign",
        agent_name: "Sami",
        choosen: "chosen by the user",
        date: "02-05-2024",
        language: "Francais",
        voice: "Nicolas Petit",
        recipient_no: "4177809025",
        status: "No Answer",
        duration: "1:00 hr"
    },
    {
        id: 2,
        campaign_name: "XYZ Campaign",
        agent_name: "Sami",
        choosen: "chosen by the user",
        date: "02-05-2024",
        language: "Francais",
        voice: "Nicolas Petit",
        recipient_no: "4177809025",
        status: "Replied",
        duration: "1:00 hr"
    },
    {
        id: 3,
        campaign_name: "XYZ Campaign",
        agent_name: "Sami",
        choosen: "chosen by the user",
        date: "02-05-2024",
        language: "Francais",
        voice: "Nicolas Petit",
        recipient_no: "4177809025",
        status: "Replied",
        duration: "1:00 hr"
    },
];

const countries = [
    { name: "United States", code: "US", dial_code: "+1", flag: <BritishFlag /> },
    { name: "United Kingdom", code: "GB", dial_code: "+44", flag: <BritishFlag /> },
    { name: "India", code: "IN", dial_code: "+91", flag: <BritishFlag /> },
    // Add more countries as needed
];

export default function OutBoundCalls() {
    const [showModal, setShowModal] = useState(false);
    const [secondModel, setSecondModel] = useState(false);
    const [toggleTom, setToggleTom] = useState(true);
    const modalRef = useRef(null);
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (agents.length > 0) {
            setLoading(false)
        }
    }, [agents])

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

    return (
        <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-black">Outbound Calls</h1>
                <button
                    className="bg-[#7065F0] text-white font-medium px-5 py-2 rounded-lg shadow"
                    onClick={() => setShowModal(true)}
                >
                    New Campaign
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
                                Start Date
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
                                End Date
                                <LuCalendarDays className="text-[16px]" />
                            </button>
                        }
                    />
                </div>
                <div className="w-48">
                    <SelectDropdown
                        name="campaign"
                        options={campaignOptions}
                        placeholder="Campaign"
                        value={filters.campaign}
                        onChange={(value) => setFilters({ ...filters, campaign: value })}
                    />
                </div>
                <div>
                    <input
                        value={filters.recipient}
                        onChange={(e) => setFilters({ ...filters, recipient: e.target.value })}
                        placeholder="Recipient"
                        className="bg-white border text-[#5A687C] max-w-[152px] text-[16px] font-[400] w-fit border-[#E1E4EA] px-4 py-2 rounded-lg focus:border-[#675FFF] focus:outline-none"
                    />
                </div>
            </div>
            {/* Table */}
            <div className="overflow-auto w-full">
                <table className="w-full">
                    <div className="px-5 w-full">
                        <thead>
                            <tr className="text-left text-[#5a687c] text-[16px]">
                                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">Campaign Name</th>
                                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">Agent Name</th>
                                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">Date</th>
                                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">Language</th>
                                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">Voice</th>
                                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">Recipient No</th>
                                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">Status</th>
                                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">Duration</th>
                                <th className="p-[14px] w-full font-[400] whitespace-nowrap">Actions</th>
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
                                            <td className="p-[14px] min-w-[200px] max-w-[17%] w-full  font-[600] text-[#1E1E1E] text-[16px]">{agent.campaign_name}</td>
                                            <td className="py-[14px] pl-[18px] pr-[14px] min-w-[200px] max-w-[17%] w-full "><div className="flex flex-col text-[16px] text-[#1E1E1E] font-[400] whitespace-nowrap">{agent.agent_name}<span className="text-[#5A687C]">{agent.choosen}</span></div></td>
                                            <td className="p-[14px] min-w-[200px] max-w-[17%] w-full  text-[#5A687C] whitespace-nowrap">{agent.date}</td>
                                            <td className="p-[14px] min-w-[200px] max-w-[17%] w-full  text-[#5A687C]">{agent.language}</td>
                                            <td className="py-[14px] pl-[5px] pr-[14px] min-w-[200px] max-w-[17%] w-full  text-[#5A687C] whitespace-nowrap">{agent.voice}</td>
                                            <td className="py-[14px] pl-[5px] pr-[14px] min-w-[200px] max-w-[17%] w-full  text-[#5A687C]">{agent.recipient_no}</td>
                                            <td className="py-[14px] pr-[14px] min-w-[200px] max-w-[17%] w-full  whitespace-nowrap">
                                                <span className={`inline-block ${agent.status !== "Replied" ? "text-[#34C759]" : "text-[#FF3B30]"} text-[16px] font-[400] px-3 py-1 rounded-full`}>
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
                                                                <div className="flex items-center gap-2"><div className='group-hover:hidden'><Phone /></div> <div className='hidden group-hover:block'><Phone active={true} /></div> <span>Listen the call</span> </div>
                                                            </button>
                                                            <button
                                                                className="block group w-full hover:rounded-lg text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] font-[500] hover:bg-[#F4F5F6]"
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
                                                                    className="block w-full text-left hover:rounded-lg px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6]"
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody> : <p className="flex justify-center items-center h-34 text-[#1E1E1E]">No Outbound Calls Listed</p>}
                    </div>

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

                        <h2 className="text-xl font-semibold mb-6">Add New Campaign</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Campaign Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter campaign name"
                                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:border-[#675FFF] focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Language</label>
                                    <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                        <option>Select</option>
                                        <option value="english">English</option>
                                        <option value="french">French</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Voice</label>
                                    <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                        <option>Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Choose Calendar</label>
                                    <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                        <option>Select</option>
                                        <option value="google">Google Calendar</option>
                                        <option value="outlook">Outlook Calendar</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Max Call Time (Minutes)</label>
                                    <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                        <option>Select</option>
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                        <option value="60">60</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Target Lists</label>
                                <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                    <option>Select</option>
                                    <option value="list1">List 1</option>
                                    <option value="list2">List 2</option>
                                </select>
                                <button className="text-[#7065F0] text-sm font-medium mt-1">+ Create New Contact List</button>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Choose an Agent</label>
                                <select className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none">
                                    <option>Select</option>
                                    <option value="agent1">Agent 1</option>
                                    <option value="agent2">Agent 2</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-medium block mb-1">
                                    Phone Number
                                </label>
                                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2  focus-within:border-[#675FFF]">
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
                                        placeholder="Enter number"
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
                                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:border-[#675FFF] focus:outline-none resize-none"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Your Call Script</label>
                                <textarea
                                    placeholder="Enter your call script"
                                    className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:border-[#675FFF] focus:outline-none resize-none"
                                    rows={4}
                                />
                            </div>

                            <div className="flex gap-4 mt-6 justify-between">
                                <button onClick={() => setSecondModel(true)} className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px] hover:border-[#675FFF] focus:border-[#675FFF] focus:outline-none">
                                    Test Call
                                </button>
                                <button className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]  focus:bg-[#5A52E5] focus:outline-none">
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
