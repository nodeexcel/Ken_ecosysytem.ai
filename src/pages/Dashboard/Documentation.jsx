import React, { useState } from 'react'
import image1 from '../../assets/svg/campaign_image1.svg'
import image2 from '../../assets/svg/campaign_image2.svg'
import image3 from '../../assets/svg/campaign_image3.svg'
import image4 from '../../assets/svg/campaign_image4.svg'
import CampaignDashboard from '../../components/CampaignDashboard'

const sideMenuList = [
    { label: "Dashboard", icon: image1, path: "dashboard" },
    { label: "Contacts", icon: image2, path: "contact" },
    { label: "Campaigns", icon: image3, path: "campaign" },
    { label: "Leads", icon: image2, path: "lead" },
    { label: "Messages", icon: image1, path: "message" },
    { label: "Schedule", icon: image4, path: "schedule" },

]


function Documentation() {
    const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard")
    const renderMainContent = () => {
        switch (activeSidebarItem) {
            case "dashboard":
                return <CampaignDashboard />
            default:
                break;
        }

    }
    return (
        <div className="h-full w-full bg-[#F6F7F9]">
            <div className="flex flex-col md:flex-row items-start gap-8 relative pl-4 py-3 w-full">
                <div className="flex flex-col w-full md:w-[180px] items-start gap-2 relative">
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

export default Documentation
