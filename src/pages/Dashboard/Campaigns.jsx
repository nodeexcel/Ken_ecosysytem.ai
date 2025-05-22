import React, { useState } from "react";
import { CalenderIcon, FourBox, PhoneCampaign } from "../../icons/icons";
import CampaignDashboard from "../../components/CampaignDashboard";
import CampaignsTable from "../../components/Campaigns";
import Calendar from "../../components/Calendar";
import dashboardProfile from '../../assets/svg/dashboard_profile.svg'


const Campaigns = () => {
    const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
    const [isEdit, setIsEdit] = useState()

    const sideMenuList = [
        { label: "Dashboard", icon: <FourBox status={activeSidebarItem == "dashboard"} />, path: "dashboard" },
        { label: "Campaigns", icon: <PhoneCampaign status={activeSidebarItem == "campaigns"} />, path: "campaigns" },
        { label: "Calendar", icon: <CalenderIcon status={activeSidebarItem == "calendar"} />, path: "calendar" },
    ];

    const renderMainContent = () => {
        switch (activeSidebarItem) {
            case "campaigns":
                return <CampaignsTable isEdit={isEdit} setActiveSidebarItem={setActiveSidebarItem}/>;
            case "calendar":
                return <Calendar />
            default:
                return <CampaignDashboard setActiveSidebarItem={setActiveSidebarItem} setIsEdit={setIsEdit} />;
        }
    };

    return (
        <div className="h-full w-full bg-[#F6F7F9]">
            <div className="flex flex-col md:flex-row items-start gap-8 relative pl-4 py-3 w-full">
                {/* Sidebar */}
                <div className="flex flex-col w-full md:w-[153px] items-start gap-2 relative">
                    <div>
                        <img
                            src={dashboardProfile} alt='profile'
                        />
                    </div>
                    {sideMenuList.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setActiveSidebarItem(item.path)
                                setIsEdit("")
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer w-full ${activeSidebarItem === item.path
                                ? "bg-[#E1E5EA] text-black"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {item.icon}
                            <span className="text-[14px] font-[400]">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="w-full overflow-x-hidden">{renderMainContent()}</div>
            </div>
        </div>
    );
};

export default Campaigns;
