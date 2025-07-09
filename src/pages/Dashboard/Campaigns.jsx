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
import { useTranslation } from "react-i18next";
import { BsThreeDots } from "react-icons/bs";
import { X } from "lucide-react";


const Campaigns = () => {
    const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
    const [sidebarStatus, setSideBarStatus] = useState(false)
    const { t } = useTranslation();

    const navigate = useNavigate()

    const sideMenuList = [
        { label: `${t("dashboard")}`, icon: <FourBox status={activeSidebarItem == "dashboard"} />, hoverIcon: <FourBox hover={true} />, path: "dashboard" },
        { label: `${t("emailings.campaigns")}`, icon: <PhoneCampaign status={activeSidebarItem == "campaigns"} />, hoverIcon: <PhoneCampaign hover={true} />, path: "campaigns" },
        { label: `${t("emailings.calendar")}`, icon: <CalenderIcon status={activeSidebarItem == "calendar"} />, hoverIcon: <CalenderIcon hover={true} />, path: "calendar" },
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
        <div className="h-full w-full relative">
            <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} ><BsThreeDots size={24} color='#1e1e1e' /></div>
            <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full">
                {/* Sidebar */}
                <div className="lg:flex hidden flex-col bg-white gap-8 border-r border-[#E1E4EA] min-w-[272px] h-full">
                    <div className=''>
                        <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => navigate("/dashboard")}>
                            <div className="flex gap-4 pl-3 items-center h-[57px]">
                                {/* <LeftArrow /> */}
                                <h1 className="text-[20px] font-[600]">Emailing</h1>
                            </div>
                        </div>
                        <hr className='text-[#E1E4EA]' />
                    </div>
                    <div className="flex flex-col w-full items-start gap-2 relative px-3">
                        <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                            <div className="flex justify-center items-center">
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
                                className={`flex items-center group gap-2 px-3 py-2 rounded-md cursor-pointer w-full ${activeSidebarItem === item.path
                                    ? "bg-[#F0EFFF] text-[#675FFF]"
                                    : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                    }`}
                            >
                                {activeSidebarItem === item.path ? item.icon :
                                    <div className="flex items-center gap-2"><div className='group-hover:hidden'>{item.icon}</div> <div className='hidden group-hover:block'>{item.hoverIcon}</div></div>}
                                <span className={`text-[16px] font-[400] ${activeSidebarItem !== item.path && 'group-hover:text-[#1E1E1E]'}`}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full overflow-x-hidden pr-0 py-8 pl-3 lg:pr-4 lg:py-3 lg:pl-0">{renderMainContent()}</div>
            </div>
            {
                sidebarStatus &&
                <div className="lg:hidden fixed inset-0 bg-black/20 flex items-end z-50">
                    <div className="flex relative flex-col bg-white gap-8 rounded-t-[8px] w-full">
                        <button
                            className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                setSideBarStatus(false)
                            }}
                        >
                            <X size={20} />
                        </button>
                        <div className=''>
                            <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => navigate("/dashboard")}>
                                <div className="flex gap-4 pl-3 items-center h-[57px]">
                                    {/* <LeftArrow /> */}
                                    <h1 className="text-[20px] font-[600]">Emailing</h1>
                                </div>
                            </div>
                            <hr className='text-[#E1E4EA]' />
                        </div>
                        <div className="flex flex-col w-full items-start gap-2 relative p-3">
                            <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                                <div className="flex justify-center items-center">
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
                                        setSideBarStatus(false)
                                    }}
                                    className={`flex items-center group gap-2 px-3 py-2 rounded-md cursor-pointer w-full ${activeSidebarItem === item.path
                                        ? "bg-[#F0EFFF] text-[#675FFF]"
                                        : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                        }`}
                                >
                                    {activeSidebarItem === item.path ? item.icon :
                                        <div className="flex items-center gap-2"><div className='group-hover:hidden'>{item.icon}</div> <div className='hidden group-hover:block'>{item.hoverIcon}</div></div>}
                                    <span className={`text-[16px] font-[400] ${activeSidebarItem !== item.path && 'group-hover:text-[#1E1E1E]'}`}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            }
        </div>
    );
};

export default Campaigns;
