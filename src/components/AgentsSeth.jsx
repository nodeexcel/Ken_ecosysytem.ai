import { EllipsisVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import CreateNewAgent from './CreateNewAgent';
import { deleteAppointmentSetter, getAppointmentSetter, updateAppointmentSetterStatus } from '../api/appointmentSetter';
import { CallAgent, CancelIcon, CorrectIcon, Delete, Duplicate, Edit } from '../icons/icons';
import AgentPreviewModal from './AgentPreview';

function AgentsSeth() {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [updateAgent, setUpdateAgent] = useState(false)
    const [campaignData, setCampaignData] = useState();
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [editData, setEditData] = useState()
    const [previewAgent, setPreviewAgent] = useState('')
    const moreActionsRef = useRef()

    const [open, setOpen] = useState(true)

    useEffect(() => {
        getAppointementSetterData()
    }, [open])

    const languagesOptions = [{ label: 'ENG', key: "en" }, { label: 'FR', key: 'fr' }];

    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
                    setMessage("No Data Found")
                }
            } else {
                setLoading(false)
                setMessage("Network connection error")
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
        <div className='h-screen overflow-auto'>
            {open ? <div className="w-full h-full  py-4 pr-4 flex flex-col gap-4 ">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Agents</h1>
                    <button onClick={() => setOpen(false)} className="bg-[#675FFF] text-white rounded-md text-sm md:text-base px-4 py-2">
                        New Agent
                    </button>
                </div>

                <div className="overflow-auto h-full">
                    <table className="min-w-full rounded-2xl border-separate border-spacing-y-2">
                        <thead className="bg-transparent">
                            <tr className="text-[#5A687C]">
                                <th className="px-6 text-start py-3 text-[16px] font-[400]">Name</th>
                                <th className="px-6 text-start py-3 text-[16px] font-[400]">Channel</th>
                                <th className="px-6 text-start py-3 text-[16px] font-[400]">Language</th>
                                <th className="px-6 text-end py-3 text-[16px] font-[400]">Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className='rounded-lg'>
                            {loading ? <tr className='h-34'><td ></td><td ></td><td><span className='loader' /></td></tr> : message ? <tr className='h-34'><td></td><td>{message}</td></tr> : <>{campaignData.map((item, index) => {
                                return (
                                    <tr key={index} className="text-center bg-white">
                                        <td className="px-6 py-4 text-[16px] text-[#1E1E1E] font-semibold border-l-1 border-t-1 border-b-1 border-[#E1E4EA] rounded-l-lg">
                                            <div className='flex items-center gap-2 text-[16px] font-[600]'>
                                                <p className='flex justify-center items-center rounded-[12px] h-[40px] w-[40px] text-[16px] font-[600] bg-[#EBEFFF] text-[#675FFF]'>{item.agent_name[0]}</p>
                                                {item.agent_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[16px] text-[#5A687C] font-[400] text-start border-t-1 border-b-1 border-[#E1E4EA]">{item.agent_channel}</td>
                                        <td className="px-6 py-4 text-[16px] text-[#5A687C] font-[400] text-start border-t-1 border-b-1 border-[#E1E4EA]">{item.agent_language.map(lan => {
                                            const found = languagesOptions?.length > 0 && languagesOptions.find(d => d.key === lan);
                                            return found?.label
                                        }).join(', ')
                                        }</td>
                                        <td className="px-6 py-6 text-[16px] text-end flex justify-end gap-2 border-r-1 border-t-1 border-b-1 rounded-r-lg border-[#E1E4EA]">
                                            <div className='flex justify-center items-center gap-2'>
                                                <p className={`${item.is_active ? "text-[#34C759] border-[#34C759] bg-[#EBF9EE]" : "text-[#FF9500] border-[#FF9500] bg-[#FFF4E6]"} px-2 py-1 text-[14px] font-[500] border rounded-full`}>
                                                    {item.is_active ? 'Active' : 'Inactive'}
                                                </p>
                                                {/* <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={item.is_active}
                                                        onChange={() => toggleStatus(index, 'is_active', item.agent_id)}
                                                    />
                                                    <div className="w-9 h-5 bg-[#F2F4F7] rounded-full peer dark:bg-[#F2F4F7] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#675FFF]"></div>
                                                </label> */}
                                            </div>
                                        </td>
                                        <td className='bg-[#FAFBFD]'>
                                            <button
                                                // ref={moreActionsRef}
                                                onClick={() => handleDropdownClick(index)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <EllipsisVertical />
                                            </button>
                                            {activeDropdown === index && (
                                                <div className="absolute right-6 px-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                                                    <div className="py-1">
                                                        <button
                                                            className="block w-full group text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg font-[500]"
                                                            onClick={() => {
                                                                // Handle edit action
                                                                setEditData(item.agent_id)
                                                                setActiveDropdown(null);
                                                                setUpdateAgent(true)
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>Edit</span> </div>
                                                        </button>
                                                        {item.is_active ?
                                                            <button
                                                                className="block w-full group text-left hover:rounded-lg px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                                                onClick={() => {
                                                                    toggleStatus(index, 'is_active', item.agent_id)
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2"><div className='group-hover:hidden'><CancelIcon /></div> <div className='hidden group-hover:block'><CancelIcon status={true} /></div> <span>Mark As Inactive</span> </div>
                                                            </button> :
                                                            <button
                                                                className="block w-full group text-left hover:rounded-lg px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                                                onClick={() => {
                                                                    toggleStatus(index, 'is_active', item.agent_id)
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2"><div className='group-hover:hidden'><CorrectIcon /></div> <div className='hidden group-hover:block'><CorrectIcon status={true} /></div> <span>Mark As Active</span> </div>
                                                            </button>
                                                        }
                                                        <button
                                                            className="block w-full group text-left px-4 hover:rounded-lg py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                                            onClick={() => {
                                                                setActiveDropdown(null);
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><Duplicate /></div> <div className='hidden group-hover:block'><Duplicate status={true} /></div> <span>Duplicate</span> </div>
                                                        </button>
                                                        <button
                                                            className="block w-full group text-left hover:rounded-lg pr-4 pl-[14px] py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                                            onClick={() => {
                                                                setActiveDropdown(null);
                                                                setPreviewAgent(item.agent_id)
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><CallAgent /></div> <div className='hidden group-hover:block'><CallAgent status={true} /></div> <span>Test Agent</span> </div>
                                                        </button>
                                                        <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                                                        <div className='py-2'>
                                                            <button
                                                                className="block w-full text-left px-4 hover:rounded-lg py-2 text-sm text-red-600 hover:bg-[#F4F5F6] font-[500]"
                                                                onClick={() => {
                                                                    // Handle delete action
                                                                    handleDelete(index, item.agent_id)
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2">{<Delete />} <span>Delete</span> </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            }
                            )}</>}
                        </tbody>
                    </table>
                </div>
            </div> : <CreateNewAgent editData={editData} setOpen={setOpen} setUpdateAgentStatus={setUpdateAgent} updateAgentStatus={updateAgent} />}
            {previewAgent && <AgentPreviewModal setPreviewAgent={setPreviewAgent} previewAgent={previewAgent} />}
        </div>
    );
}

export default AgentsSeth;
