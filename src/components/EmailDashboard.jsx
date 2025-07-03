import { useEffect, useState } from 'react'
import { campaignStatics } from '../api/emailCampaign';
import { useTranslation } from "react-i18next";



function EmailDashboard() {
    const [loading, setLoading] = useState(true);
    const [campaignData, setCampaignData] = useState({})
    const { t } = useTranslation();

    const staticData = [
        {
            header: `${t("emailings.campaign")}`, list: [
                { label: `${t("running")}`, key: "running" }, { label: `${t("scheduled")}`, key: "scheduled" }, { label: `${t("terminated")}`, key: "terminated" },
                { label: `${t("emailings.issue_detected")}`, key: "issue_detected" }, { label: `${t("draft")}`, key: "draft" }, { label: `${t("paused")}`, key: "paused" }
            ]
        },
        {
            header: `${t("email_statistics")}`, list: [
                { label: `${t("emailings.total_email_sent")}`, value: 10 }, { label: `${t("emailings.email_delivered")}`, value: 12 }, { label: `${t("emailings.email_opened")}`, value: 14 },
                { label: `${t("emailings.email_clicks")}`, value: 12 }, { label: `${t("emailings.bounced_email")}`, value: 10 }
            ]
        }
    ]

    useEffect(() => {
        getCampaignData()
    }, [])

    useEffect(() => {
        if (Object.prototype.hasOwnProperty.call(campaignData, 'running')) {
            setLoading(false)
        }
    }, [campaignData])

    const getCampaignData = async () => {
        try {
            const response = await campaignStatics();
            if (response?.status === 200) {
                setCampaignData(response?.data)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    if (loading) return <p className='flex justify-center items-center h-screen'><span className='loader' /></p>

    return (
        <div className="w-full p-4 flex flex-col gap-4 overflow-auto h-screen">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-[#1E1E1E] font-[600] text-xl md:text-[24px]">{t("dashboard")}</h1>
            </div>
            {loading ? <div className='flex justify-center items-center h-[50vh]'><span className='loader' /></div> : <>

                {staticData.map((e) => (
                    <div key={e.header} className='border border-[#E1E4EA] bg-[#fff] p-4 flex flex-col gap-3 rounded-lg'>
                        <h1 className='text-[#1E1E1E] text-[18px] font-[600]'>{e.header}</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 w-full">
                            {e.list.map((each) => (
                                <div
                                    key={each.label}
                                    className={`flex flex-col gap-2 rounded-[10px] border bg-white border-[#e1e4ea]`}
                                >
                                    <h1 className="text-[#1E1E1E] p-2 bg-[#F1F1FF] rounded-t-[9px] text-[14px] font-[400]">
                                        {each.label}
                                    </h1>

                                    <div className='flex gap-2 p-3 items-center'>
                                        <p className="font-[600] text-[#1E1E1E] text-[24px]">
                                            {campaignData?.[each.key] ?? 0}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </>}
        </div>
    )
}

export default EmailDashboard
