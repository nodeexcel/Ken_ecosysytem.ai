import { EllipsisVertical, Search, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import CreateNewAgent from './CreateNewAgent';
import { deleteAppointmentSetter, getAppointmentSetter, updateAppointmentSetterStatus } from '../api/appointmentSetter';
import { CallAgent, CancelIcon, CorrectIcon, Delete, Duplicate, Edit } from '../icons/icons';
import AgentPreviewModal from './AgentPreview';
import { t } from 'i18next';
import { FaEllipsisH } from 'react-icons/fa';

function AgentsSeth() {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [updateAgent, setUpdateAgent] = useState(false)
    const [campaignData, setCampaignData] = useState();
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [editData, setEditData] = useState()
    const [previewAgent, setPreviewAgent] = useState('')
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const moreActionsRef = useRef(null);

    const [open, setOpen] = useState(true)

    // Filter states
    const [sortBy, setSortBy] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const sortDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);
    const sortButtonRef = useRef(null);
    const statusButtonRef = useRef(null);

    useEffect(() => {
        getAppointementSetterData()
    }, [open])

    const languagesOptions = [{ label: 'English (US)', key: "en" }, { label: 'French', key: 'fr' }];

    // Sort and filter options
    const sortOptions = [
        { label: `${t("appointment.sort_by")}: ${t("appointment.name")}`, key: "name" },
        { label: `${t("appointment.sort_by")}: ${t("appointment.channel")}`, key: "channel" },
        { label: `${t("appointment.sort_by")}: ${t("appointment.languages")}`, key: "language" },
        { label: `${t("appointment.sort_by")}: ${t("appointment.status")}`, key: "status" },
    ];

    const statusOptions = [
        { label: `All ${t("appointment.status")}`, key: "all" },
        { label: t("appointment.active"), key: "active" },
        { label: t("appointment.inactive"), key: "inactive" },
    ];

    // Filter and sort the data
    const getFilteredAndSortedData = () => {
        if (!campaignData) return [];

        let filtered = [...campaignData];

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter((item) => {
                const searchLower = searchQuery.toLowerCase();
                return (
                    item.agent_name?.toLowerCase().includes(searchLower) ||
                    item.agent_channel?.toLowerCase().includes(searchLower) ||
                    item.agent_language?.some(lang => {
                        const found = languagesOptions.find(d => d.key === lang);
                        return found?.label?.toLowerCase().includes(searchLower);
                    })
                );
            });
        }

        // Apply status filter
        if (statusFilter && statusFilter !== "all") {
            filtered = filtered.filter((item) => {
                if (statusFilter === "active") return item.is_active === true;
                if (statusFilter === "inactive") return item.is_active === false;
                return true;
            });
        }

        // Apply sorting
        if (sortBy) {
            filtered.sort((a, b) => {
                switch (sortBy) {
                    case "name":
                        return (a.agent_name || "").localeCompare(b.agent_name || "");
                    case "channel":
                        return (a.agent_channel || "").localeCompare(b.agent_channel || "");
                    case "language":
                        const aLang = a.agent_language?.[0] || "";
                        const bLang = b.agent_language?.[0] || "";
                        return aLang.localeCompare(bLang);
                    case "status":
                        if (a.is_active === b.is_active) return 0;
                        return a.is_active ? -1 : 1;
                    default:
                        return 0;
                }
            });
        }

        return filtered;
    };

    const filteredData = getFilteredAndSortedData();

    const handleDropdownClick = (index, e) => {
        e.stopPropagation();
        if (activeDropdown === index) {
            setActiveDropdown(null);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        setDropdownPosition({
            top: rect.bottom + window.scrollY + 4,
            left: rect.right - 192,
        });

        setActiveDropdown(index);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                moreActionsRef.current &&
                !moreActionsRef.current.contains(event.target)
            ) {
                setActiveDropdown(null);
            }
            // Close filter dropdowns when clicking outside
            if (
                sortDropdownRef.current &&
                !sortDropdownRef.current.contains(event.target) &&
                sortButtonRef.current &&
                !sortButtonRef.current.contains(event.target)
            ) {
                setSortDropdownOpen(false);
            }
            if (
                statusDropdownRef.current &&
                !statusDropdownRef.current.contains(event.target) &&
                statusButtonRef.current &&
                !statusButtonRef.current.contains(event.target)
            ) {
                setStatusDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const toggleStatus = async (index, key, id) => {
        try {
            const response = await updateAppointmentSetterStatus(id)
            if (response.status === 200) {
                const updated = [...campaignData];
                const itemIndex = updated.findIndex(item => item.agent_id === id);
                if (itemIndex !== -1) {
                    updated[itemIndex][key] = !updated[itemIndex][key];
                setCampaignData(updated);
                }
                setActiveDropdown(null);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getAppointementSetterData = async () => {
        setMessage("")
        try {
            const response = await getAppointmentSetter()
            console.log(response)
            if (response.status === 200) {
                setCampaignData(response.data.agent)
                if (response.data.agent.length === 0) {
                    setLoading(false)
                    setMessage(t("no_data"))
                }
            } else {
                setLoading(false)
                setMessage(t("brain_ai.network_connection_error"))
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (campaignData?.length > 0) {
            setLoading(false)
        }

    }, [campaignData])

    const handleDelete = async (index, id) => {
        try {
            const response = await deleteAppointmentSetter(id)
            if (response.status === 200) {
                setActiveDropdown(null);
                const updated = [...campaignData];
                const itemIndex = updated.findIndex(item => item.agent_id === id);
                if (itemIndex !== -1) {
                    updated.splice(itemIndex, 1);
                setCampaignData(updated);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='h-full w-full overflow-hidden flex flex-col'>
            {open ? <div className="w-full h-full p-12 flex flex-col gap-4 ">
                <div className="flex flex-col gap-3 mb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-gray-900 font-[500] text-md md:text-[22px] font-[500]">{t("appointment.agents")}</h1>
                            <p className="text-[#5A687C] font-[400] text-sm md:text-[14px] mt-1">
                                {t("appointment.manage_all_agents_in_one_place")}
                            </p>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="bg-[#675FFF] cursor-pointer text-center justify-center items-center text-white rounded-lg text-[14px] font-[500] px-3 py-1.5 mt-3 md:mt-0"
                        >
                            <span className="text-xl font-medium px-1">+</span>
                            {t("appointment.new_agent")}
                        </button>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
                        <div className="w-full md:max-w-md">
                            <div className="flex items-center gap-2 border border-[#D6D6D6] rounded-lg px-3 py-2 bg-white">
                                <Search className="w-4 h-4 text-[#5A687C]" />
                                <input
                                    type="text"
                                    placeholder={t("appointment.search_name_or_phone_number")}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full text-sm focus:outline-none text-[#1E1E1E] placeholder:text-[#5A687C]"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                            <div className="relative">
                                <button
                                    ref={sortButtonRef}
                                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                    className="flex items-center gap-2 border border-[#D6D6D6] rounded-lg px-3 py-2 text-[14px] font-[500] text-[#1E1E1E] bg-white cursor-pointer hover:bg-[#F9F8FF] transition-colors"
                                >
                                    {sortBy ? sortOptions.find(opt => opt.key === sortBy)?.label : t("appointment.sort_by")}
                                    <ChevronDown className={`w-4 h-4 text-[#5A687C] transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                                {sortDropdownOpen && (
                                    <div
                                        ref={sortDropdownRef}
                                        className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-200 z-50"
                                    >
                                        <ul className="py-1">
                                            {sortOptions.map((option) => (
                                                <li
                                                    key={option.key}
                                                    onClick={() => {
                                                        setSortBy(option.key);
                                                        setSortDropdownOpen(false);
                                                    }}
                                                    className={`cursor-pointer px-4 py-2 text-sm hover:bg-[#F4F5F6] hover:text-[#675FFF] ${
                                                        sortBy === option.key
                                                            ? "text-[#675FFF] bg-[#F4F5F6]"
                                                            : "text-[#5A687C]"
                                                    }`}
                                                >
                                                    {option.label}
                                                </li>
                                            ))}
                                            {sortBy && (
                                                <li
                                                    onClick={() => {
                                                        setSortBy(null);
                                                        setSortDropdownOpen(false);
                                                    }}
                                                    className="cursor-pointer px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6] border-t border-gray-200"
                                                >
                                                    Clear Sort
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button
                                    ref={statusButtonRef}
                                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                                    className="flex items-center gap-2 border border-[#D6D6D6] rounded-lg px-3 py-2 text-[14px] font-[500] text-[#1E1E1E] bg-white cursor-pointer hover:bg-[#F9F8FF] transition-colors"
                                >
                                    {statusFilter && statusFilter !== "all"
                                        ? statusOptions.find(opt => opt.key === statusFilter)?.label
                                        : t("appointment.status")}
                                    <ChevronDown className={`w-4 h-4 text-[#5A687C] transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                                {statusDropdownOpen && (
                                    <div
                                        ref={statusDropdownRef}
                                        className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-200 z-50"
                                    >
                                        <ul className="py-1">
                                            {statusOptions.map((option) => (
                                                <li
                                                    key={option.key}
                                                    onClick={() => {
                                                        setStatusFilter(option.key === "all" ? null : option.key);
                                                        setStatusDropdownOpen(false);
                                                    }}
                                                    className={`cursor-pointer px-4 py-2 text-sm hover:bg-[#F4F5F6] hover:text-[#675FFF] ${
                                                        (statusFilter === option.key || (!statusFilter && option.key === "all"))
                                                            ? "text-[#675FFF] bg-[#F4F5F6]"
                                                            : "text-[#5A687C]"
                                                    }`}
                                                >
                                                    {option.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-190px)]">
                    <div className="border border-[#D6D6D6] rounded-2xl overflow-hidden">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="bg-[#F7F7F8]  ">
                                <tr className="text-[#5A687C] ">
                                    <th className="px-6 text-start py-3 text-[14px] font-[400]">{t("appointment.agent")}</th>
                                    <th className="px-3 text-start py-3 text-[14px] font-[400]">{t("appointment.channel")}</th>
                                    <th className="px-3 text-start py-3 text-[14px] font-[400]">{t("appointment.languages")}</th>
                                    <th className=" text-center py-3 text-[14px] font-[400]">{t("appointment.status")}</th>
                                    <th className="px-6 text-center py-3 text-[14px] font-[400]">{t("appointment.action")}</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">
                                {loading ? <tr className='h-34'><td ></td><td ></td><td ><td ></td><td ></td><span className='loader' /></td><td></td><td></td></tr> : (message || filteredData.length === 0) ? <tr className='h-34'><td colSpan="6" className="text-center py-8 text-[#5A687C]">{filteredData.length === 0 && !loading ? t("no_data") : message}</td></tr> : <>{filteredData.map((item, index) => {
                                    return (
                                        <tr key={index} className="text-center">
                                            <td className="px-4 py-4 text-[16px] text-[#1E1E1E] font-semibold  ">
                                                <div className='flex items-center gap-2 text-[14px] font-[400]'>
                                                    <p className='flex justify-center items-center rounded-[12px] h-[40px] w-[40px] text-[16px] font-[400] bg-[#EBEFFF] text-[#675FFF]'>{item.agent_name[0]}</p>
                                                    {item.agent_name}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-[14px] text-[#000000] font-[400] text-start ">{item.agent_channel}</td>
                                            <td className="px-4 py-4 text-[14px] text-[#000000] font-[400] text-start ">{item.agent_language.map(lan => {
                                                const found = languagesOptions?.length > 0 && languagesOptions.find(d => d.key === lan);
                                                return found?.label
                                            }).join(', ')
                                            }</td>
                                            <td className="py-4 text-[14px] text-center align-middle">
                                                <div className="flex justify-center items-center">
                                                    <p
                                                        className={`${item.is_active
                                                            ? "text-[#34C759] border-[#34C759] bg-[#EBF9EE]"
                                                            : "text-[#5A687C] border-[#E0E2E5] bg-[#EFF0F2]"
                                                            } px-3 py-1 text-[14px] font-[500] border rounded-full inline-flex items-center justify-center`}
                                                    >
                                                        {item.is_active
                                                            ? `${t("appointment.active")}`
                                                            : `${t("appointment.inactive")}`}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="relative bg-[#FFFFFF] px-4 py-4 justify-center">
                                                <div ref={moreActionsRef} className="relative inline-block text-left">
                                                    <button
                                                        onClick={(e) => handleDropdownClick(index, e)}
                                                        className="text-gray-500 hover:text-gray-700 cursor-pointer border border-[#D6D6D6] rounded-xl p-2"
                                                    >
                                                        <FaEllipsisH />
                                                    </button>

                                                    {activeDropdown === index && (
                                                        <div
                                                            className="fixed z-50 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5"
                                                            style={{
                                                                top: dropdownPosition.top,
                                                                left: dropdownPosition.left,
                                                            }}
                                                            ref={moreActionsRef}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <div className="py-1">
                                                                <button
                                                                    className="block cursor-pointer w-full group text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg font-[500]"
                                                                    onClick={() => {
                                                                        // Handle edit action
                                                                        setEditData(item.agent_id)
                                                                        setActiveDropdown(null);
                                                                        setUpdateAgent(true)
                                                                        setOpen(false)
                                                                    }}
                                                                >
                                                                    <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>{t("edit")}</span> </div>
                                                                </button>
                                                                {item.is_active ?
                                                                    <button
                                                                        className="block cursor-pointer w-full group text-left hover:rounded-lg px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                                                        onClick={() => {
                                                                            toggleStatus(index, 'is_active', item.agent_id)
                                                                        }}
                                                                    >
                                                                        <div className="flex items-center gap-2"><div className='group-hover:hidden'><CancelIcon /></div> <div className='hidden group-hover:block'><CancelIcon status={true} /></div> <span>{t("appointment.mark_as_inactive")}</span> </div>
                                                                    </button> :
                                                                    <button
                                                                        className="block cursor-pointer w-full group text-left hover:rounded-lg px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                                                        onClick={() => {
                                                                            toggleStatus(index, 'is_active', item.agent_id)
                                                                        }}
                                                                    >
                                                                        <div className="flex items-center gap-2"><div className='group-hover:hidden'><CorrectIcon /></div> <div className='hidden group-hover:block'><CorrectIcon status={true} /></div> <span>{t("appointment.mark_as_active")}</span> </div>
                                                                    </button>
                                                                }
                                                                <button
                                                                    className="block cursor-pointer w-full group text-left px-4 hover:rounded-lg py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                                                    onClick={() => {
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                >
                                                                    <div className="flex items-center gap-2"><div className='group-hover:hidden'><Duplicate /></div> <div className='hidden group-hover:block'><Duplicate status={true} /></div> <span>{t("appointment.duplicate")}</span> </div>
                                                                </button>
                                                                <button
                                                                    className="block cursor-pointer w-full group text-left hover:rounded-lg pr-4 pl-[14px] py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                                                    onClick={() => {
                                                                        setActiveDropdown(null);
                                                                        setPreviewAgent(item.agent_id)
                                                                    }}
                                                                >
                                                                    <div className="flex items-center gap-2"><div className='group-hover:hidden'><CallAgent /></div> <div className='hidden group-hover:block'><CallAgent status={true} /></div> <span>{t("appointment.test_agent")}</span> </div>
                                                                </button>
                                                                <div className='py-2'>
                                                                    <button
                                                                        className="block cursor-pointer w-full text-left px-4 hover:rounded-lg py-2 text-sm text-red-600 hover:bg-[#F4F5F6] font-[500]"
                                                                        onClick={() => {
                                                                            // Handle delete action
                                                                            handleDelete(index, item.agent_id)
                                                                        }}
                                                                    >
                                                                        <div className="flex items-center gap-2">{<Delete />} <span>{t("delete")}</span> </div>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                                )}</>}
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
            </div> : <CreateNewAgent editData={editData} setOpen={setOpen} setUpdateAgentStatus={setUpdateAgent} updateAgentStatus={updateAgent} />}
            {previewAgent && <AgentPreviewModal setPreviewAgent={setPreviewAgent} previewAgent={previewAgent} />}
        </div>
    );
}

export default AgentsSeth;
