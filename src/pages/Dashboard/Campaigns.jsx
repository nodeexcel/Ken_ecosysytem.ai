import { useState } from "react";
import { CalenderIcon, FourBox, LeftArrow, PhoneCampaign } from "../../icons/icons";
import CampaignDashboard from "../../components/CampaignDashboard";
import Calendar from "../../components/Calendar";
import dashboardProfile from '../../assets/svg/dashboard_profile.svg'
import EmailDashboard from "../../components/EmailDashboard";
import emileImg from "../../assets/svg/emile_logo.svg"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const Campaigns = () => {
    const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");

    const navigate = useNavigate()

    const sideMenuList = [
        { label: "Dashboard", icon: <FourBox status={activeSidebarItem == "dashboard"} />, path: "dashboard" },
        { label: "Campaigns", icon: <PhoneCampaign status={activeSidebarItem == "campaigns"} />, path: "campaigns" },
        { label: "Calendar", icon: <CalenderIcon status={activeSidebarItem == "calendar"} />, path: "calendar" },
    ];

    const renderMainContent = () => {
        switch (activeSidebarItem) {
            case "campaigns":
                return <CampaignDashboard />;
            case "calendar":
                return <Calendar />
            default:
                return <EmailDashboard />
        }
    };

    return (
        <div className="h-full w-full">
            <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full">
                {/* Sidebar */}
                <div className="flex flex-col bg-white gap-8 border-r border-[#E1E4EA] w-[272px] h-full">
                    <div className=''>
                        <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => navigate("/dashboard")}>
                            <div className="flex gap-4 pl-5 items-center h-[57px]">
                                <LeftArrow/>
                                <h1 className="text-[20px] font-[600]">Emailing</h1>
                            </div>
                        </div>
                        <hr className='text-[#E1E4EA]' />
                    </div>
                    <div className="flex flex-col w-full items-start gap-2 relative px-2">
                        <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                            <div className="w-[35px] h-[45px] flex justify-center items-center">
                                <img src={emileImg} alt={"emile"} className="object-fit" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Emile</h1>
                                <p className="text-[#5A687C] text-[14px] font-[400]">Newsletter</p>
                            </div>
                        </div>
                        {sideMenuList.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => {
                                    setActiveSidebarItem(item.path)
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer w-full ${activeSidebarItem === item.path
                                    ? "bg-[#F0EFFF] text-[#675FFF]"
                                    : "text-[#5A687C]"
                                    }`}
                            >
                                {item.icon}
                                <span className="text-[16px] font-[400]">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full py-3 pr-4 overflow-x-hidden">{renderMainContent()}</div>
            </div>
        </div>
    );
};

export default Campaigns;
