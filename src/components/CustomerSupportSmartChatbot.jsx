import { useEffect, useRef, useState } from "react"
import { DateFormat } from "../utils/TimeFormat"
import { Delete, Edit } from "../icons/icons"
import { Search, ChevronDown, Ellipsis } from "lucide-react"
import SethBot from "../assets/svg/SethBot.svg"
import CustomerSupportChatBotForm from "./CustomerSupportChatBotForm"
import { useTranslation } from "react-i18next";
import CustomerSupportChat from "./CustomerSupportChat";
import { deleteSmartChatBotById, getSmartBotById, getSmartBots } from "../api/customerSupport";


function SmartChatbot() {
    const [chatbotData, setChatbotData] = useState([])
    const [filteredChatbotData, setFilteredChatbotData] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
    const [chatBotFormStatus, setChatBotFormStatus] = useState(false);
    const [openChats, setOpenChats] = useState(false)
    const moreActionsRef = useRef()
    const [rows, setRows] = useState([]);
    const [loadingChats, setLoadingChats] = useState(false);
    const [deleteRow, setDeleteRow] = useState(null);
    const [editData, setEditData] = useState();
    const [agentId, setAgentId] = useState();
    const [selectedBotData, setSelectedBotData] = useState(null);
    const { t } = useTranslation()

    useEffect(() => {
        if (chatbotData?.length > 0) {
            setLoading(false)
        }
    }, [chatbotData])

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown !== null) {
                const dropdown = event.target.closest('.smart-chatbot-dropdown');
                const trigger = event.target.closest('[data-dropdown-trigger]');
                if (!dropdown && !trigger) {
                    setActiveDropdown(null);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown]);

    // Filter chatbots based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredChatbotData(chatbotData)
        } else {
            const filtered = chatbotData.filter(chatbot =>
                chatbot.bot_name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredChatbotData(filtered)
        }
    }, [searchQuery, chatbotData])


    const handleDropdownClick = (index, event) => {
        if (event) {
            const rect = event.currentTarget.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                right: window.innerWidth - rect.right,
            });
        }
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const fetchSmartBots = async () => {
        try {
            const response = await getSmartBots();
            if (response.status === 200) {
                const bots = response.data.success || [];
                setRows(bots);
                setChatbotData(bots);
                setFilteredChatbotData(bots);
                setLoading(false);
            } else {
                console.error("Failed to fetch smart bots");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching smart bots:", error);
            setLoading(false);
        }
    };
    const handleGetSmartBot = async (id) => {
        try {
            setLoadingChats(true)
            const response = await getSmartBotById(id);
            console.log(response.data)
            if (response.status === 200) {
                setSelectedBotData(response.data.success);
                // setMessages(data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingChats(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await deleteSmartChatBotById(id)
            if (response?.status === 200) {
                fetchSmartBots()
                setDeleteRow(null);
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if (rows && rows.length > 0) {
            setLoading(false)
        }
    }, [rows])

    useEffect(() => {
        fetchSmartBots();
    }, []);



    return (
        <>
            {!chatBotFormStatus ? <div className="p-12 h-screen overflow-auto flex flex-col gap-4 w-full">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    {/* Row 1: Title + New Chatbot */}
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-[24px] font-[600] text-[#1E1E1E]">{t("calina.smart_chatbot")}</h1>
                            <p className="text-[#5A687C] text-sm font-[400]">Manage all agents in one place</p>
                        </div>
                        <button
                            onClick={() => setChatBotFormStatus(true)}
                            className="bg-[#675FFF] cursor-pointer border border-[#5F58E8] text-white font-medium rounded-lg px-5 py-2 flex items-center gap-2 shadow-sm"
                        >
                            + {t("calina.new_chatbot")}
                        </button>
                    </div>

                    {/* Row 2: Search + Filters */}
                    <div className="flex items-center justify-between gap-4 mt-4">
                        <div className="w-full max-w-[300px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                                <input
                                    placeholder={t("calina.search")}
                                    className="bg-white focus:outline-none focus:border-[#675FFF] w-full rounded-[8px] border border-[#E1E4EA] py-[8px] pl-10 pr-3 text-sm text-[#1E1E1E]"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E1E4EA] bg-white text-[#1E1E1E] text-sm font-medium">
                                Sort By <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E1E4EA] bg-white text-[#1E1E1E] text-sm font-medium">
                                Status <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Table */}
                <div className="rounded-2xl border border-[#D6D6D6] overflow-auto mb-2 w-full bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="bg-[#F7F7F8]">
                                <tr className="text-[#5A687C] text-[16px]">
                                    <th className="px-6 text-start py-3 font-[400] whitespace-nowrap">{t("calina.bot_name")}</th>
                                    <th className="px-4 text-start py-3 font-[400] whitespace-nowrap">{t("date_and_time")}</th>
                                    <th className="px-4 text-start py-3 font-[400] whitespace-nowrap">{t("total_chat")}</th>
                                    <th className="px-4 text-right py-3 font-[400] whitespace-nowrap">{t("brain_ai.actions")}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center">
                                            <span className="loader" />
                                        </td>
                                    </tr>
                                ) : filteredChatbotData?.length !== 0 ? (
                                    filteredChatbotData?.map((row, index) => (
                                        <tr
                                            key={row.id}
                                            className={`text-[15px] text-[#1E1E1E] ${index !== filteredChatbotData?.length - 1 ? 'border-b border-[#E1E4EA]' : ''}`}
                                        >
                                            <td className="px-4 py-5 font-[600] text-[#1E1E1E] whitespace-nowrap flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-full bg-[#F2EBFF] flex items-center justify-center text-[#7C3AED] text-sm font-semibold">
                                                    <img src={SethBot} alt="bot" className="w-5 h-5" />
                                                </span>
                                                {row.bot_name}
                                            </td>
                                            <td className="px-4 py-4 text-black whitespace-nowrap items-center gap-3">
                                                {row.created_at && row.created_at !== "None"
                                                    ? DateFormat(row.created_at.replace(' ', 'T'))
                                                    : "--"}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap items-center gap-3">{row.chats}</td>
                                            <td ref={moreActionsRef} className="px-4 py-4 relative whitespace-nowrap">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        onClick={() => {
                                                            setChatBotFormStatus(true)
                                                            setOpenChats(true)
                                                            setAgentId(row.id)
                                                        }}
                                                        className="border border-[#D6D6D6] cursor-pointer shadow-sm font-[500] text-[14px] py-[7px] px-[8px] rounded-lg hover:bg-[#F5F4FF] transition"
                                                    >
                                                        {t("open")}
                                                    </button>
                                                    <div>
                                                        <button
                                                            data-dropdown-trigger
                                                            onClick={(e) => handleDropdownClick(index, e)}
                                                            className="flex items-center"
                                                        >
                                                            <div className=" cursor-pointer h-[34px] w-[34px] flex justify-center items-center rounded-lg shadow-sm hover:bg-[#F5F4FF] transition border border-[#E1E4EA]">
                                                                <Ellipsis/>
                                                            </div>
                                                        </button>
                                                        {activeDropdown === index && (
                                                            <div
                                                                className="smart-chatbot-dropdown fixed px-2 w-34 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-[9999]"
                                                                style={{
                                                                    top: dropdownPosition.top,
                                                                    right: dropdownPosition.right,
                                                                }}
                                                            >
                                                                <div className="py-1">
                                                                    <button
                                                                        type="button"
                                                                        className="block w-full group cursor-pointer text-left px-4 hover:rounded-lg py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                                                        onClick={() => {
                                                                            setActiveDropdown(null);
                                                                            setChatBotFormStatus(true)
                                                                            setEditData(row.id)
                                                                            handleGetSmartBot(row.id);
                                                                        }}
                                                                    >
                                                                        <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>{t("edit")}</span> </div>
                                                                    </button>
                                                                    <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                                                                    <div className='py-2'>
                                                                        <button
                                                                            className="block w-full cursor-pointer text-left px-4 hover:rounded-lg py-2 text-sm text-red-600 hover:bg-[#F4F5F6] font-[500]"
                                                                            onClick={() => {
                                                                                setActiveDropdown(null);
                                                                                setDeleteRow(row.id);
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center gap-2">{<Delete />} <span>{t("delete")}</span> </div>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center text-[#1E1E1E]">
                                            {t("calina.no_chatbot_listed")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination inside table container */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3  px-4 py-3">
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 rounded-md border border-[#E1E4EA] bg-white text-sm text-[#1E1E1E] hover:bg-[#F4F5F6]">{ "Prev"}</button>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1 rounded-md border border-[#675FFF] bg-[#675FFF] text-white text-sm">1</button>
                                <button className="px-3 py-1 rounded-md border border-[#E1E4EA] bg-white text-sm text-[#1E1E1E]">2</button>
                                <button className="px-3 py-1 rounded-md border border-[#E1E4EA] bg-white text-sm text-[#1E1E1E]">3</button>
                                <span className="text-[#5A687C] text-sm">...</span>
                                <button className="px-3 py-1 rounded-md border border-[#E1E4EA] bg-white text-sm text-[#1E1E1E]">10</button>
                            </div>
                            <button className="px-3 py-1 rounded-md border border-[#E1E4EA] bg-white text-sm text-[#1E1E1E] hover:bg-[#F4F5F6]">{"Next"}</button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#1E1E1E]">
                            <span className="text-[#5A687C]">Rows</span>
                            <button className="px-3 py-1 rounded-md border border-[#E1E1E1] bg-white text-sm text-[#1E1E1E]">5</button>
                            <button className="px-3 py-1 rounded-md border border-[#E1E1E1] bg-white text-sm text-[#1E1E1E]">10</button>
                            <button className="px-3 py-1 rounded-md border border-[#E1E1E1] bg-white text-sm text-[#1E1E1E]">20</button>
                        </div>
                    </div>
                </div>
            </div> : openChats ? <CustomerSupportChat agentId={agentId} /> : <CustomerSupportChatBotForm onCancel={() => setChatBotFormStatus(false)} editData={selectedBotData} editDataId={editData} />}

            {
                deleteRow && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                        <div className="bg-white rounded-2xl w-[400px] p-6 relative shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Smart Bot</h2>
                            <p className="text-gray-500 mb-4">Are you sure you want to delete this Smart Bot?</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setDeleteRow(null)}
                                    className="w-full text-[16px] cursor-pointer text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
                                >
                                    {t("phone.cancel")}
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(deleteRow);

                                    }}
                                    className="w-full text-[16px] cursor-pointer text-white rounded-[8px] bg-red-500 h-[38px] flex justify-center items-center gap-2 relative"
                                >
                                    {
                                        t("brain_ai.delete")
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default SmartChatbot
