import { useEffect, useState } from 'react';
import { Delete, Duplicate, Edit, Notes, ThreeDots } from '../icons/icons';
import { X } from 'lucide-react';
import { deleteEmailCampaign, getEmailCampaign, updateEmailCampaignStatus } from '../api/emailCampaign';

const staticData = [
    {
        label: "Total Emails Sent",
        value: "0"
    },
    {
        label: "Emails Delivered",
        value: "0"
    },
    {
        label: "Emails Opened",
        value: "0"
    },
    {
        label: "Email Clicks",
        value: "0"
    },
    {
        label: "Bounced Emails",
        value: "0"
    }
]
function CampaignDashboard({ setActiveSidebarItem, setIsEdit }) {
    const [campaignData, setCampaignData] = useState();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("")

    const [viewReportModel, setViewReportModel] = useState(false)

    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        getCampaignData()
    }, [])

    const toggleStatus = async (index, key, id) => {
        try {
            const response = await updateEmailCampaignStatus(id)
            if (response.status === 200) {
                const updated = [...campaignData];
                updated[index][key] = !updated[index][key];
                setCampaignData(updated);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleDelete = async (index, id) => {
        try {
            const response = await deleteEmailCampaign(id)
            if (response.status === 200) {
                setActiveDropdown(null);
                const updated = [...campaignData];
                updated.splice(index, 1);
                if (updated?.length === 0) {
                    setMessage("No Data Found")
                }
                setCampaignData(updated);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleEdit = (id) => {
        setIsEdit(id)
        setActiveSidebarItem("campaigns")
    }

    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    useEffect(() => {
        if (campaignData?.length > 0) {
            setLoading(false)
        }
    }, [campaignData])

    const getCampaignData = async () => {
        setMessage("")
        setLoading(true)
        try {
            const response = await getEmailCampaign()
            if (response.status === 200) {
                console.log(response?.data?.campaign_info)
                if (response?.data?.campaign_info?.length > 0) {
                    setCampaignData(response?.data?.campaign_info)
                } else {
                    setCampaignData([])
                    setLoading(false)
                    setMessage("No Data Found")
                }
            } else {
                setLoading(false)
                setMessage("Network Error!")
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const renderColor = (text) => {
        switch (text) {
            case "Issue Detected":
                return `text-[#FF9500] bg-[#FFF4E6] border-[#FF9500]`;
            case "Running":
                return `text-[#675FFF] bg-[#F0EFFF] border-[#675FFF]`;
            case "Planned":
                return `text-[#34C759] bg-[#EBF9EE] border-[#34C759]`;
            case "Terminated":
                return `text-[#B42318] bg-[#FFEBEA] border-[#B42318]`;
            default:
                return `text-[#5A687C] bg-[#fff] border-[#5A687C]`;
        }
    };

    return (
        <div className="w-full p-4 flex flex-col gap-4 ">
            <div className="flex justify-between items-center">
                <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Campaigns</h1>
                <button onClick={() => setActiveSidebarItem("campaigns")} className="bg-[#675FFF] text-white rounded-md text-sm md:text-base px-4 py-2">
                    Add Campaign
                </button>
            </div>

            <div className="overflow-auto w-full rounded-lg">
                <table className="w-full rounded-2xl">
                    <thead>
                        <tr className="text-left text-[#5A687C]">
                            <th className="px-6 py-3 text-[16px] font-medium">Name</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Sent</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Sent to</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Status</th>
                            <th className="px-6 py-3 text-[16px] font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`${!message && !loading && 'bg-white'} border border-[#E1E4EA]`}>
                        {loading ? <tr><td className='h-34'></td><td></td><td><span className='loader' /></td></tr> : message ? <tr className='h-34'><td></td><td></td><td>{message}</td></tr> :
                            campaignData?.length > 0 && campaignData.map((item, index) => (
                                <tr key={index} className={`${index !== campaignData.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-semibold">{item.campaign_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.sent}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.sent_to}</td>

                                    <td className="px-6 py-4 text-sm items-center gap-2">
                                        <div className='flex justify-between items-center gap-2'>
                                            <p className={`${renderColor(item.campaign_status)} border px-2 py-1 text-xs rounded-full`}>
                                                {item.campaign_status}
                                            </p>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={item.is_active}
                                                    onChange={() => toggleStatus(index, 'is_active', item.campaign_id)}
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-400 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </td>


                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className='flex items-center gap-2'>
                                            <button onClick={() => setViewReportModel(true)} className='text-[#5A687C] px-2 py-1 border-2 text-[16px] font-[500] border-[#E1E4EA] rounded-lg'>
                                                View Report
                                            </button>
                                            <button onClick={() => handleDropdownClick(index)} className="p-2 rounded-lg">
                                                <div className='bg-[#F4F5F6] p-2 rounded-lg'><ThreeDots /></div>
                                            </button>
                                        </div>
                                        {activeDropdown === index && (
                                            <div className="absolute right-6  w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                                                <div className="py-1">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-gray-100"
                                                        onClick={() => {
                                                            // Handle edit action
                                                            handleEdit(item.campaign_id)
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">{<Edit />} <span className="hover:text-[#675FFF]">Edit</span> </div>
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6]"
                                                        onClick={() => {
                                                            // Handle delete action
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">{<Duplicate />} <span className="hover:text-[#675FFF]">Duplicate</span> </div>
                                                    </button>
                                                    <hr style={{ color: "#E6EAEE" }} />
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6]"
                                                        onClick={() => {
                                                            // Handle delete action
                                                            setActiveDropdown(null);
                                                            handleDelete(index, item.campaign_id)
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">{<Delete />} <span>Delete</span> </div>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div onClick={() => setActiveSidebarItem("campaigns")} className="w-full border rounded-lg border-dashed border-[#C0C0C0] mt-4 p-3 flex justify-center">
                <button
                    className="text-[#5E54FF] bg-transparent px-6 py-2 rounded-md text-[16px] font-[500]"
                >
                    + Add New
                </button>
            </div>
            {viewReportModel && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl w-full max-w-[678px] p-6 relative shadow-lg">
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        onClick={() => setViewReportModel(false)}
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-[20px] font-[600] text-[#1E1E1E] my-4">
                        Campaign Name : Inbound.4d74997e-2c17-4024-98c4-
                        5fbca9d4f5d1
                    </h2>
                    <div className="grid grid-cols-2 gap-5 w-full">
                        {staticData.map((each) => (
                            <div
                                key={each.label}
                                className={`flex flex-col gap-2 rounded-lg border shadow-shadows-shadow-xs transition bg-white border-[#e1e4ea]`}
                            >
                                <h1 className="text-[#1E1E1E] p-2 bg-[#F2F2F7] text-[14px] font-[400]">
                                    {each.label}
                                </h1>

                                <div className='flex gap-2 p-3 items-center'>
                                    <p className="font-[600] text-[#1E1E1E] text-[24px]">
                                        {each.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default CampaignDashboard;
