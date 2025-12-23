import React, { useEffect, useState } from 'react'
import AgentsSeth from '../../components/AgentsSeth'
import Analytics from '../../components/Analytics'
import DemoChat from '../../components/DemoChat'
import dashboardProfile from '../../assets/svg/dashboard_profile.svg'
import { AnalyticsIcon, ConversationIcon, LeftArrow, TeamMemberIcon } from '../../icons/icons'
import sethImg from "../../assets/svg/SethSidebar.svg"
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { X, EllipsisVertical } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { discardSkillsData } from '../../store/agentSkillsSlice'
import TutorialPlay from '../../assets/svg/WatchTutorialGrey.svg'
import ActiveAgent from '../../assets/svg/ActiveAgent.svg'
import InactiveAgent from '../../assets/svg/InactiveAgent.svg'
import InactiveConversation from '../../assets/svg/InactiveConversation.svg'
import InactiveAnalytics from '../../assets/svg/InactiveAnalytics.svg'

function AppointmentSetter() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [activeSidebarItem, setActiveSidebarItem] = useState("agents")
    const [sidebarStatus, setSideBarStatus] = useState(false)

    const { t } = useTranslation();
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const sideMenuList = [
        {
            label: t("appointment.agents"),
            path: "agents",
            iconActive: <img src={ActiveAgent} alt="Agents" className="w-5 h-5" />,
            iconInactive: <img src={InactiveAgent} alt="Agents" className="w-5 h-5" />,
        },
        {
            label: t("appointment.conversations"),
            path: "conversations",
            // No explicit active SVG provided; use conversation.svg for active and InactiveConversation for inactive
            iconActive: (
                <img
                  src={InactiveConversation}
                  alt="Conversations"
                  className="w-5 h-5"
                  style={{
                    filter:
                      "invert(35%) sepia(98%) saturate(2580%) hue-rotate(236deg) brightness(99%) contrast(101%)",
                  }}
                />
              ),
              iconInactive: (
                <img
                  src={InactiveConversation}
                  alt="Conversations"
                  className="w-5 h-5"
                />
              ),
        },
        {
            label: t("appointment.analytics"),
            path: "analytics",
            // No explicit active SVG provided; tint InactiveAnalytics for active
            iconActive: (
                <img
                  src={InactiveAnalytics}
                  alt="Analytics"
                  className="w-5 h-5"
                  style={{
                    filter:
                      "invert(35%) sepia(98%) saturate(2580%) hue-rotate(236deg) brightness(99%) contrast(101%)",
                  }}
                />
              ),
              iconInactive: (
                <img
                  src={InactiveAnalytics}
                  alt="Analytics"
                  className="w-5 h-5"
                />
              ),
        },
        // { label: "Demo Chat", path: "demo", iconActive: <ConversationIcon status={true} />, iconInactive: <ConversationIcon status={false} /> },
    ]

    // Initialize URL with default tab if not present on mount
    useEffect(() => {
        if (!searchParams.get("tab")) {
            setSearchParams({ tab: "agents" }, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync active tab with URL query param when URL changes
    useEffect(() => {
        const tabFromUrl = searchParams.get("tab") || "agents";
        setActiveSidebarItem(tabFromUrl);
    }, [searchParams]);

    // Helper to update URL param for active tab
    const handleTabChange = (tabPath) => {
        setSearchParams({ tab: tabPath }, { replace: true });
    };

    const activeTab = useSelector((state) => state.skills)

    useEffect(() => {
        if (activeTab.label !== null) {
            handleTabChange(activeTab.label)
        }
    }, [activeTab.loading])

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
        <div className="h-400px w-full relative">
            <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} ><EllipsisVertical size={24} color='#1e1e1e' /></div>
            <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full">
                {/* Sidebar */}
                <div className="lg:flex hidden flex-col bg-white gap-4 border border-[#D6D6D6] min-w-[272px] rounded-r-2xl rounded-tl-none rounded-bl-none fixed h-[calc(100vh-89px)] mt-2 mb-8 overflow-y-auto">
                    <div className=''>
                        <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => {
                            navigate("/dashboard")
                            dispatch(discardSkillsData())
                        }}>

                        </div>
                    </div>
                    <div className="flex flex-col w-full items-start relative px-3">
                        <div className="bg-[#ffffff] lg:w-[232px] w-full mb-2 flex flex-col gap-3 px-[12px] py-[10px] border-b border-gray-200">
                            <div className="flex gap-3">
                                <div className="flex justify-center items-center">
                                    <div className="w-12 h-12 rounded-full bg-[#FFE4C5] flex items-center justify-center">
                                        <img
                                            src={sethImg}
                                            alt="Seth"
                                            className="w-10 h-10 object-contain scale-115"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Seth</h1>
                                    <p className="text-[#5A687C] text-[14px] font-[400]">{t("appointment.appointment_setter")}</p>
                                </div>
                            </div>
                            {/* Watch Tutorial Button */}
                            <button
                                onClick={() => {
                                    console.log("Watch Tutorial clicked");
                                }}
                                className="w-full flex items-center justify-center gap-2 px-2 py-2 bg-white border border-[#E1E4EA] rounded-xl text-[#1E1E1E] font-[600] text-sm hover:bg-[#F8F9FB] transition-colors cursor-pointer"
                            >
                                <img src={TutorialPlay} className="w-5 h-5" />
                                <span className='text-md font-md'>{t("watch_tutorial") || "Watch Tutorial"}</span>
                            </button>
                            <hr className='border border-transparent w-full' />
                        </div>
                        {sideMenuList.map((e, i) => {
                            const isActive = activeSidebarItem === e.path;
                            return (
                                <div
                                    key={i}
                                    onClick={() => handleTabChange(e.path)}
                                    className={`flex justify-center group md:justify-start items-center gap-2 px-2 py-2 mb-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${isActive ? "bg-[#E9E8F9]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                        }`}
                                >
                                    {isActive ? (
                                        e.iconActive
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className='group-hover:hidden'>{e.iconInactive}</div>
                                            <div className='hidden group-hover:block'>{e.iconActive}</div>
                                        </div>
                                    )}
                                    <span className={`font-[400] text-[16px] ${isActive ? "text-[#000000]" : "text-[#0c0c0c] group-hover:text-[#1E1E1E]"}`}>
                                        {e.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full lg:ml-[280px] overflow-hidden pr-0 py-8 pl-3 lg:pl-0 lg:pr-4 lg:py-3">
                    {renderMainContent()}
                </div>

            </div>
            {sidebarStatus &&
                <div className="lg:hidden fixed inset-0 bg-black/20 flex items-end z-50">
                    <div className="flex relative flex-col bg-white gap-8 rounded-t-[20px] w-full max-h-[80%] overflow-auto py-8">
                        <button
                            className="absolute top-4 cursor-pointer right-4 text-[#1e1e1e]"
                            onClick={() => {
                                setSideBarStatus(false)
                            }}
                        >
                            <X size={20} />
                        </button>
                        <div className=''>
                            <div className='flex justify-center items-center cursor-pointer' onClick={() => navigate("/dashboard")}>
                                <div className="flex gap-4 pl-3 items-center h-[57px]">
                                    {/* <LeftArrow /> */}
                                    <h1 className="text-[20px] font-[600]">{t("appointment.appointment_setter")}</h1>
                                </div>
                            </div>
                            <hr className='text-[#E1E4EA]' />
                        </div>
                        <div className="flex flex-col w-full items-start gap-2 relative px-5">
                            <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-full min-w-[232px] flex flex-col gap-3 mb-5 p-[12px] rounded-[9px]">
                                <div className="flex gap-3">
                                    <div className="flex justify-center items-center">
                                        <img src={sethImg} alt={"seth"} className="object-fit" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Seth</h1>
                                        <p className="text-[#5A687C] text-[14px] font-[400]">{t("appointment.appointment_setter")}</p>
                                    </div>
                                </div>
                                {/* Watch Tutorial Button */}
                                <button
                                    onClick={() => {
                                        console.log("Watch Tutorial clicked");
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-2 py-2 bg-white border border-[#E1E4EA] rounded-xl text-[#1E1E1E] font-[600] text-sm hover:bg-[#F8F9FB] transition-colors cursor-pointer"
                                >
                                    <img src={TutorialPlay} className="w-4 h-4" />
                                    <span className='text-md font-md'>{t("watch_tutorial") || "Watch Tutorial"}</span>
                                </button>
                            </div>
                            {sideMenuList.map((e, i) => {
                                const isActive = activeSidebarItem === e.path;
                                return (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            handleTabChange(e.path)
                                            setSideBarStatus(false)
                                        }}
                                        className={`flex group justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${isActive ? "bg-[#F0EFFF]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                            }`}
                                    >
                                        {isActive ? (
                                            e.iconActive
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className='group-hover:hidden'>{e.iconInactive}</div>
                                                <div className='hidden group-hover:block'>{e.iconActive}</div>
                                            </div>
                                        )}
                                        <span className={`font-[400] text-[16px] ${isActive ? "text-[#675FFF]" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                                            {e.label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default AppointmentSetter
