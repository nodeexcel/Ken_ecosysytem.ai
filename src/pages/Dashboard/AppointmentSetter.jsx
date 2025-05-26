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
import sethImg from "../../assets/svg/seth.svg"

function AppointmentSetter() {
    const [activeSidebarItem, setActiveSidebarItem] = useState("agents")

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
        <div className="h-full w-full bg-[#F6F7F9]">
            <div className="flex flex-col md:flex-row items-start gap-8 relative pl-4 py-3 w-full">
                <div className="flex flex-col w-full md:w-[180px] items-start gap-2 relative">
                    <div className="w-[153px] h-[153px] flex justify-center items-center">
                        <img src={sethImg} alt={"seth"} className="object-fit" />
                    </div>
                    {sideMenuList.map((e, i) => <div
                        key={i}
                        onClick={() => setActiveSidebarItem(e.path)}
                        className={`flex justify-center md:justify-start items-center gap-1.5 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === `${e.path}` ? "bg-[#e1e5ea]" : ""
                            }`}
                    >
                        {e.icon}
                        <div className={`relative w-fit mt-[-1.00px] font-normal text-sm tracking-[-0.28px] leading-5 whitespace-nowrap ${activeSidebarItem === `${e.path}` ? "text-black" : "text-[#5A687C] "
                            }`}>
                            {e.label}
                        </div>
                    </div>)}
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
