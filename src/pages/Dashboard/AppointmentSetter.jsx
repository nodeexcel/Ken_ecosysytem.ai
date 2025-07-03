import React, { useState } from 'react'
import agents from '../../assets/svg/campaign_image2.svg'
import conversation from '../../assets/svg/conversation.svg'
import analytics from '../../assets/svg/analytics.svg'
import AgentsSeth from '../../components/AgentsSeth'
import Conversation from '../../components/Conversation'
import Analytics from '../../components/Analytics'
import DemoChat from '../../components/DemoChat'
import dashboardProfile from '../../assets/svg/dashboard_profile.svg'
import { AnalyticsIcon, ConversationIcon, LeftArrow, TeamMemberIcon } from '../../icons/icons'
import sethImg from "../../assets/svg/seth_logo.svg"
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

function AppointmentSetter() {
    const [activeSidebarItem, setActiveSidebarItem] = useState("agents")

    const { t } = useTranslation();

    const navigate = useNavigate()

    const sideMenuList = [
        { label: t("appointment.agents"), icon: <TeamMemberIcon status={activeSidebarItem == "agents"} />, hoverIcon: <TeamMemberIcon hover={true} />, path: "agents" },
        { label: t("appointment.conversations"), icon: <ConversationIcon status={activeSidebarItem == "conversations"} />, hoverIcon: <ConversationIcon hover={true} />, path: "conversations" },
        { label: t("appointment.analytics"), icon: <AnalyticsIcon status={activeSidebarItem == "analytics"} />, hoverIcon: <AnalyticsIcon hover={true} />, path: "analytics" },
        // { label: "Demo Chat", icon: <ConversationIcon status={activeSidebarItem == "demo"} />, path: "demo" },
    ]

    const renderMainContent = () => {
        switch (activeSidebarItem) {
            case "conversations":
                return <DemoChat />
            case "analytics":
                return <Analytics />;
            case "demo":
                return <DemoChat />;
            default:
                return <AgentsSeth />
        }

    }
    return (
        <div className="h-full w-full">
            <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full">
                {/* Sidebar */}
                <div className="flex flex-col bg-white gap-8 border-r border-[#E1E4EA] w-[272px] h-full">
                    <div className=''>
                        <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => navigate("/dashboard")}>
                            <div className="flex gap-4 pl-3 items-center h-[57px]">
                                {/* <LeftArrow /> */}
                                <h1 className="text-[20px] font-[600]">{t("appointment.appointment_setter")}</h1>
                            </div>
                        </div>
                        <hr className='text-[#E1E4EA]' />
                    </div>
                    <div className="flex flex-col w-full items-start gap-2 relative px-3">
                        <div className="bg-[#F7F7FF] border border-[#E9E8FF]  w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                            <div className="flex justify-center items-center">
                                <img src={sethImg} alt={"seth"} className="object-fit" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Seth</h1>
                                <p className="text-[#5A687C] text-[14px] font-[400]">{t("appointment.appointment_setter")}</p>
                            </div>
                        </div>
                        {sideMenuList.map((e, i) => <div
                            key={i}
                            onClick={() => setActiveSidebarItem(e.path)}
                            className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === `${e.path}` ? "bg-[#F0EFFF]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                }`}
                        >
                            {activeSidebarItem === `${e.path}` ? e.icon :
                                <div className="flex items-center gap-2"><div className='group-hover:hidden'>{e.icon}</div> <div className='hidden group-hover:block'>{e.hoverIcon}</div></div>}
                            <span className={`font-[400] text-[16px] ${activeSidebarItem === `${e.path}` ? "text-[#675FFF]" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                                {e.label}
                            </span>
                        </div>)}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full py-3 pr-4 overflow-x-hidden">
                    {renderMainContent()}
                </div>
            </div>
        </div>
    )
}

export default AppointmentSetter
