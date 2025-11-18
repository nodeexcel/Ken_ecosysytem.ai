import { EllipsisVertical } from 'lucide-react';
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

    useEffect(() => {
        getAppointementSetterData()
    }, [open])

    const languagesOptions = [{ label: 'English (US)', key: "en" }, { label: 'French', key: 'fr' }];

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
                updated[index][key] = !updated[index][key];
                setCampaignData(updated);
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
                updated.splice(index, 1);
                setCampaignData(updated);
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='h-screen w-full overflow-hidden flex flex-col'>
            {open ? <div className="w-full h-full  py-4 pr-4 flex flex-col gap-4 ">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                        <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Agents</h1>
                        <p className="text-[#5A687C] text-sm md:text-base mt-1">
                            Your AI agents are ready to boost your outreach.
                        </p>
                    </div>

                    <button
                        onClick={() => setOpen(false)}
                        className="bg-[#675FFF] cursor-pointer text-white rounded-xl text-sm md:text-base px-3 py-2 mt-3 md:mt-0"
                    >
                        <span className="text-xl font-medium px-1">+</span>
                        {t("appointment.new_agent")}
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-180px)]">
                    <div className="border border-[#D6D6D6] rounded-2xl overflow-hidden">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="bg-[#F7F7F8]  ">
                                <tr className="text-[#5A687C] ">
                                    <th className="px-6 text-start py-3 text-[16px] font-[400]">{t("appointment.agent")}</th>
                                    <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("appointment.channel")}</th>
                                    <th className="px-3 text-start py-3 text-[16px] font-[400]">{t("appointment.languages")}</th>
                                    <th className=" text-center py-3 text-[16px] font-[400]">{t("appointment.status")}</th>
                                    <th className="px-6 text-center py-3 text-[16px] font-[400]">{t("appointment.action")}</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">
                                {loading ? <tr className='h-34'><td ></td><td ></td><td ><span className='loader' /></td><td></td><td></td></tr> : message ? <tr className='h-34'><td></td><td></td><td>{message}</td></tr> : <>{campaignData.map((item, index) => {
                                    return (
                                        <tr key={index} className="text-center">
                                            <td className="px-4 py-4 text-[16px] text-[#1E1E1E] font-semibold  ">
                                                <div className='flex items-center gap-2 text-[16px] font-[600]'>
                                                    <p className='flex justify-center items-center rounded-[12px] h-[40px] w-[40px] text-[16px] font-[600] bg-[#EBEFFF] text-[#675FFF]'>{item.agent_name[0]}</p>
                                                    {item.agent_name}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-[16px] text-[#000000] font-[400] text-start ">{item.agent_channel}</td>
                                            <td className="px-4 py-4 text-[16px] text-[#000000] font-[400] text-start ">{item.agent_language.map(lan => {
                                                const found = languagesOptions?.length > 0 && languagesOptions.find(d => d.key === lan);
                                                return found?.label
                                            }).join(', ')
                                            }</td>
                                            <td className="py-4 text-[16px] text-center align-middle">
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
