import { useEffect, useRef, useState } from 'react';
import { ActiveIcon, DeactiveIcon, Delete, Duplicate, Edit, EndIcon, ThreeDots } from '../icons/icons';
import { X } from 'lucide-react';
import { deleteEmailCampaign, duplicateCampaign, getEmailCampaign, updateEmailCampaignStatus } from '../api/emailCampaign';
import CampaignsTable from './Campaigns';
import { useTranslation } from "react-i18next";


function CampaignDashboard() {
    const [campaignData, setCampaignData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isEdit, setIsEdit] = useState();
    const [newCampaignStatus, setNewCampaignStatus] = useState(false)
    const { t } = useTranslation();


    const staticData = [
        {
            label: `${t("emailings.total_email_sent")}`,
            value: "0"
        },
        {
            label: `${t("emailings.email_delivered")}`,
            value: "0"
        },
        {
            label: `${t("emailings.email_opened")}`,
            value: "0"
        },
        {
            label: `${t("emailings.email_clicks")}`,
            value: "0"
        },
        {
            label: `${t("emailings.bounced_email")}`,
            value: "0"
        }
    ]

    const [viewReportModel, setViewReportModel] = useState(false)

    const [activeDropdown, setActiveDropdown] = useState(null);
    const moreActionsRef = useRef()

    useEffect(() => {
        getCampaignData()
    }, [newCampaignStatus])


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
            const response = await updateEmailCampaignStatus(id)
            if (response.status === 200) {
                // const updated = [...campaignData];
                // updated[index][key] = !updated[index][key];
                // setCampaignData(updated);
                getCampaignData()
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
                    setMessage(`${t("no_data")}`)
                }
                setCampaignData(updated);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDuplicate = async (id) => {
        try {
            const response = await duplicateCampaign(id)
            if (response?.status === 201) {
                setActiveDropdown(null);
                getCampaignData()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleEdit = (id) => {
        setIsEdit(id)
        setNewCampaignStatus(true)
        setActiveDropdown(null);
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
                    setLoading(false)
                    setMessage(`${t("no_data")}`)
                }
            } else {
                setLoading(false)
                setMessage(`${t("network_error")}`)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const renderColor = (text) => {
        switch (text) {
            case "issue_detected":
                return `text-[#FF9500] bg-[#FFF4E6] border-[#FF9500]`;
            case "running":
                return `text-[#675FFF] bg-[#F0EFFF] border-[#675FFF]`;
            case "scheduled":
                return `text-[#34C759] bg-[#EBF9EE] border-[#34C759]`;
            case "terminated":
                return `text-[#B42318] bg-[#FFEBEA] border-[#B42318]`;
            case "draft":
                return `text-[#1E1E1E] bg-[#E9E9E9] border-[#1E1E1E]`
            default:
                return `text-[#5A687C] bg-[#fff] border-[#5A687C]`;
        }
    };

    const renderStatus = (text) => {
        switch (text) {
            case "issue_detected":
                return `Issue Detected`;
            case "running":
                return `Running`;
            case "scheduled":
                return `Scheduled`;
            case "terminated":
                return `Terminated`;
            case "draft":
                return `Draft`
            default:
                return `Paused`
        }
    }

    return (
        <div className=' overflow-auto h-screen'>
            {!newCampaignStatus ? <div className="w-full py-4 pr-2 flex flex-col gap-4 ">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">{t("emailings.campaigns")}</h1>
                    <button onClick={() => setNewCampaignStatus(true)} className="bg-[#675FFF] text-white rounded-md text-sm md:text-base px-4 py-2">
                        {t("emailings.add_campaign")}
                    </button>
                </div>

                <div className="overflow-auto w-full">
                    <table className="w-full">
                        <div className="px-5 w-full">
                            <thead>
                                <tr className="text-left text-[#5A687C]">
                                    <th className="p-[14px] whitespace-nowrap min-w-[190px] max-w-[25%] w-full text-[16px] font-[400]">{t("brain_ai.name")}</th>
                                    <th className="p-[14px] whitespace-nowrap min-w-[190px] max-w-[25%] w-full text-[16px] font-[400]">{t("emailings.sent")}</th>
                                    <th className="p-[14px] whitespace-nowrap min-w-[190px] max-w-[25%] w-full text-[16px] font-[400]">{t("emailings.sent_to")}</th>
                                    <th className="p-[14px] whitespace-nowrap min-w-[190px] max-w-[25%] w-full text-[16px] font-[400]">{t("emailings.campaign_status")}</th>
                                    {/* <th className="p-[14px] whitespace-nowrap min-w-[190px] max-w-[17%] w-full text-[16px] font-[400]">Status</th> */}
                                    <th className="p-[14px] whitespace-nowrap min-w-[190px] max-w-[25%] w-full text-[16px] font-[400]">{t("brain_ai.actions")}</th>
                                </tr>
                            </thead>
                        </div>
                        <div className="border border-[#E1E4EA] w-full bg-white rounded-2xl p-3">
                            {loading ? <p className="flex justify-center items-center h-34"><span className="loader" /></p> :
                                campaignData.length !== 0 ?
                                    <tbody className="w-full">
                                        {campaignData.map((item, index) => (
                                            <tr key={index} className={`${index !== campaignData.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                                <td className={`p-[14px] whitespace-nowrap min-w-[190px] max-w-[25%] w-full text-[16px] text-gray-800  font-semibold`}>{item.campaign_name}</td>
                                                <td className={`p-[14px] whitespace-nowrap min-w-[190px] max-w-[25%] w-full text-[16px] text-[#5A687C]`}>{item.sent}</td>
                                                <td className={`p-[14px] whitespace-nowrap min-w-[190px] max-w-[25%] w-full text-[16px] text-[#5A687C]`}>{item.sent_to}</td>

                                                <td className={`p-[14px] whitespace-nowrap min-w-[190px] max-w-[25%] w-full text-[16px] items-center gap-2`}>
                                                    <div className='flex justify-between items-center gap-2'>
                                                        <p className={`${renderColor(item.campaign_status)} border flex items-center gap-2 px-2 py-1 text-xs rounded-full`}>
                                                            {renderStatus(item.campaign_status)}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* <td className={`text-center`}>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            disabled={(item.campaign_status === "draft" || item.campaign_status === "issue_detected")}
                                                            checked={item.is_active}
                                                            onChange={item.campaign_status !== "draft" || item.campaign_status !== "issue_detected" ? () => toggleStatus(index, 'is_active', item.campaign_id) : undefined}
                                                        />
                                                        <div className={`w-9 h-5 bg-gray-200  rounded-full ${(item.campaign_status === "draft" || item.campaign_status === "issue_detected") ? 'dark:bg-[#F1F3F6] cursor-not-allowed' : 'dark:bg-[#D9D7FF] peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-400'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600`}></div>
                                                    </label>
                                                </td> */}


                                                <td className={`p-[14px] whitespace-nowrap min-w-[190px] max-w-[25%] w-full text-[16px]  text-[#5A687C]`}>
                                                    <div className='flex items-center gap-2'>
                                                        <button onClick={() => setViewReportModel(true)} className='text-[#5A687C] px-2 py-1 border-2 text-[16px] font-[500] border-[#E1E4EA] rounded-lg'>
                                                            {t("emailings.view_report")}
                                                        </button>
                                                        <button ref={moreActionsRef} onClick={() => handleDropdownClick(index)} className="p-2 rounded-lg">
                                                            <div className='bg-[#F4F5F6] p-2 rounded-lg'><ThreeDots /></div>
                                                            {activeDropdown === index && (
                                                                <div className="absolute right-6 px-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                                                                    <div className="py-1">
                                                                        <button
                                                                            className="block w-full text-left font-[500] group px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg"
                                                                            onClick={() => {
                                                                                handleEdit(item.campaign_id)
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>{t("edit")}</span> </div>
                                                                        </button>
                                                                        <button
                                                                            className="block w-full text-left font-[500] group px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg"
                                                                            onClick={item.campaign_status !== "draft" || item.campaign_status !== "issue_detected" ? () => toggleStatus(index, 'is_active', item.campaign_id) : undefined}
                                                                        >
                                                                            <div className="flex items-center gap-2"><div className='group-hover:hidden'>{item.is_active ? <DeactiveIcon /> : <ActiveIcon />}</div> <div className='hidden group-hover:block'>{item.is_active ? <DeactiveIcon status={true} /> : <ActiveIcon status={true} />}</div> <span>{item.is_active ? 'Deactive' : 'Active'}</span> </div>
                                                                        </button>
                                                                        <button
                                                                            className="block w-full text-left font-[500] px-4 group py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg"
                                                                            onClick={() => {
                                                                                handleDuplicate(item.campaign_id)
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><Duplicate /></div> <div className='hidden group-hover:block'><Duplicate status={true} /></div> <span>{t("brain_ai.duplicate")}</span> </div>
                                                                        </button>
                                                                        <button
                                                                            className="block w-full text-left font-[500] px-4 group py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg"
                                                                            onClick={() => {
                                                                                setActiveDropdown(null);
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><EndIcon /></div> <div className='hidden group-hover:block'><EndIcon status={true} /></div> <span>{t("emailings.end")}</span> </div>
                                                                        </button>
                                                                        <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                                                                        <div className='py-2'>
                                                                            <button
                                                                                className="block w-full text-left font-[500] px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6] hover:rounded-lg"
                                                                                onClick={() => {
                                                                                    handleDelete(index, item.campaign_id)
                                                                                }}
                                                                            >
                                                                                <div className="flex items-center gap-2">{<Delete />} <span>{t("delete")}</span> </div>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody> : <p className="flex justify-center items-center h-34 text-[#1E1E1E]">{t("emailings.no_campaign_listed")}</p>}
                        </div>
                    </table>
                </div>
                <div onClick={() => setNewCampaignStatus(true)} className="w-full border rounded-lg border-dashed border-[#C0C0C0] mt-4 p-3 flex justify-center">
                    <button
                        className="text-[#5E54FF] bg-transparent px-6 py-2 rounded-md text-[16px] font-[500]"
                    >
                        + {t("brain_ai.add_new")}
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
                            {t("emailings.campaign_name")}: Inbound.4d74997e-2c17-4024-98c4-
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
            </div> : <CampaignsTable isEdit={isEdit} setNewCampaignStatus={setNewCampaignStatus} setIsEdit={setIsEdit} />}
        </div>
    );
}

export default CampaignDashboard;
