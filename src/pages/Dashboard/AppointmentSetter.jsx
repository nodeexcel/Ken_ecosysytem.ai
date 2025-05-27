import React, { useState } from 'react'
import agents from '../../assets/svg/campaign_image2.svg'
import conversation from '../../assets/svg/conversation.svg'
import analytics from '../../assets/svg/analytics.svg'
import AgentsSeth from '../../components/AgentsSeth'
import Conversation from '../../components/Conversation'
import Analytics from '../../components/Analytics'
import DemoChat from '../../components/DemoChat'
import dashboardProfile from '../../assets/svg/dashboard_profile.svg'
import { AnalyticsIcon, ConversationIcon, TeamMemberIcon } from '../../icons/icons'
import sethImg from "../../assets/svg/seth_logo.svg"
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

function AppointmentSetter() {
    const [activeSidebarItem, setActiveSidebarItem] = useState("agents")

    const navigate = useNavigate()

    const sideMenuList = [
        { label: "Agents", icon: <TeamMemberIcon status={activeSidebarItem == "agents"} />, path: "agents" },
        { label: "Conversations", icon: <ConversationIcon status={activeSidebarItem == "conversations"} />, path: "conversations" },
        { label: "Analytics", icon: <AnalyticsIcon status={activeSidebarItem == "analytics"} />, path: "analytics" },
        { label: "Demo Chat", icon: <ConversationIcon status={activeSidebarItem == "demo"} />, path: "demo" },
    ]

    const renderMainContent = () => {
        switch (activeSidebarItem) {
            case "conversations":
                return <Conversation />
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
                            <div className="flex gap-2 items-center h-[57px]">
                                <MdOutlineKeyboardArrowLeft size={25} />
                                <h1 className="text-[20px] font-[600]">Appointment Setter</h1>
                            </div>
                        </div>
                        <hr className='text-[#E1E4EA]' />
                    </div>
                    <div className="flex flex-col w-full items-start gap-2 relative px-2">
                        <div className="bg-[#F0EFFF]  w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                            <div className="w-[35px] h-[45px] flex justify-center items-center">
                                <img src={sethImg} alt={"seth"} className="object-fit" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Seth</h1>
                                <p className="text-[#5A687C] text-[14px] font-[400]">Appointment Setter</p>
                            </div>
                        </div>
                        {sideMenuList.map((e, i) => <div
                            key={i}
                            onClick={() => setActiveSidebarItem(e.path)}
                            className={`flex justify-center md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === `${e.path}` ? "bg-[#EDF3FF]" : ""
                                }`}
                        >
                            {e.icon}
                            <div className={`relative w-fit mt-[-1.00px] font-normal text-sm tracking-[-0.28px] leading-5 whitespace-nowrap ${activeSidebarItem === `${e.path}` ? "text-black" : "text-[#5A687C] "
                                }`}>
                                {e.label}
                            </div>
                        </div>)}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full overflow-x-hidden">
                    {renderMainContent()}
                </div>
            </div>
        </div>
    )
}

export default AppointmentSetter
