import React, { useState } from 'react'
import agents from '../../assets/svg/campaign_image2.svg'
import conversation from '../../assets/svg/conversation.svg'
import analytics from '../../assets/svg/analytics.svg'
import AgentsSeth from '../../components/AgentsSeth'
import Conversation from '../../components/Conversation'
import Analytics from '../../components/Analytics'

const sideMenuList = [
    { label: "Agents", icon: agents, path: "agents" },
    { label: "Conversations", icon: conversation, path: "conversations" },
    { label: "Analytics", icon: analytics, path: "analytics" },

]


function AppointmentSetter() {
    const [activeSidebarItem, setActiveSidebarItem] = useState("agents")
    const renderMainContent = () => {
        switch (activeSidebarItem) {
            case "conversations":
                return <Conversation />
            case "analytics":
                return <Analytics />;
            default:
                return <AgentsSeth />
        }

    }
    return (
        <div className="h-full w-full bg-[#F6F7F9]">
            <div className="flex flex-col md:flex-row items-start gap-8 relative pl-4 py-3 w-full">
                <div className="flex flex-col w-full md:w-[180px] items-start gap-2 relative">
                    <div className='bg-[#E1E4EA] rounded-lg w-[153px] h-[153px]'>
                        {/* <img
                            src=
                        /> */}
                    </div>
                    {sideMenuList.map((e, i) => <div
                        key={i}
                        onClick={() => setActiveSidebarItem(e.path)}
                        className={`flex justify-center md:justify-start items-center gap-1.5 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === `${e.path}` ? "bg-[#e1e5ea]" : ""
                            }`}
                    >
                        <img src={e.icon} alt={`${e.path}`} />
                        <div className={`relative w-fit mt-[-1.00px] onest font-normal text-sm tracking-[-0.28px] leading-5 whitespace-nowrap ${activeSidebarItem === `${e.path}` ? "text-black" : "text-[#5A687C] "
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
