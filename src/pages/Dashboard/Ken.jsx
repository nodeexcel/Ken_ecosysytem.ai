import { useEffect, useState } from 'react'
import tomImg from '../../assets/svg/KenNewLogo.svg'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import TutorialPlay from '../../assets/svg/WatchTutorialGrey.svg'
import { X, MoreVertical } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { discardSkillsData } from '../../store/agentSkillsSlice'
import KenOverview from '../../components/KenOverview'
import KenSearchProspects from '../../components/KenSearchProspects'

function Ken() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const { t } = useTranslation();
    const dispatch = useDispatch()

    // Get tab from URL query param, default to "overview"
    const [activeSidebarItem, setActiveSidebarItem] = useState('overview')
    const [sidebarStatus, setSideBarStatus] = useState(false)

    // Initialize URL with default tab if not present
    useEffect(() => {
        if (!searchParams.get('tab')) {
            setSearchParams({ tab: 'overview' }, { replace: true })
        }
    }, [])

    // Sync active tab with URL query param when URL changes
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab') || 'overview'
        if (tabFromUrl !== activeSidebarItem) {
            setActiveSidebarItem(tabFromUrl)
        }
    }, [searchParams])

    // Update URL when tab changes
    const handleTabChange = (tabPath) => {
        setSearchParams({ tab: tabPath }, { replace: true });
    }

    const sideMenuList = [
        {
            label: t("ken_overview.overview") || "Overview",
            path: "overview",
        },
        {
            label: t("ken_overview.search_for_prospects") || "Search for Prospects",
            path: "search-prospects",
        },
    ]

    const renderMainContent = () => {
        switch (activeSidebarItem) {
            case "overview":
                return <KenOverview />
            case "search-prospects":
                return <KenSearchProspects />
            case "campaigns":
                return (
                    <div className="flex items-center justify-center h-full w-full">
                        <div className="text-center">
                            <p className="text-gray-500 text-lg"></p>
                        </div>
                    </div>
                )
            default:
                return (
                    <div className="flex items-center justify-center h-full w-full">
                        <div className="text-center">
                            <p className="text-gray-500 text-lg"></p>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="h-full w-full relative">
            <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} >
                <MoreVertical size={24} color='#1e1e1e' />
            </div>
            <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full mt-4">
                {/* Sidebar */}
                <div className="lg:flex hidden flex-col bg-white gap-4 border border-[#D6D6D6] min-w-[272px] ml-2 rounded-r-2xl rounded-tl-none rounded-bl-none fixed h-[calc(100vh-105px)] mb-8 overflow-y-auto">
                    <div className=''>
                        <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => {
                            navigate("/dashboard")
                            dispatch(discardSkillsData())
                        }}>
                        </div>
                    </div>
                    <div className="flex flex-col w-full items-start gap-2 relative px-3">
                        <div className="bg-[#ffffff] lg:w-[232px] w-full mb-2 flex flex-col gap-3 px-[12px] py-[10px] border-b border-gray-200">
                            <div className="flex gap-3">
                                <div className="flex justify-center items-center">
                                    <div className="w-12 h-12 rounded-full bg-[#DBE5FF] flex items-center justify-center">
                                        <img
                                            src={tomImg}
                                            alt="ken"
                                            className="w-10 h-10 object-contain scale-115"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-[#1E1E1E] text-[15px] font-[400]">
                                        Ken
                                    </h1>
                                    <p className="text-[#5A687C] text-[13px] font-[300]">
                                        {t("receptionist")}
                                    </p>
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
                                <span className='text-13 font-[300]'>{t("watch_tutorial") || "Watch Tutorial"}</span>
                            </button>

                            <hr className='border border-transparent w-full' />
                        </div>

                        {sideMenuList.map((e, i) => {
                            const isActive = activeSidebarItem === e.path;
                            return (
                                <div
                                    key={i}
                                    onClick={() => {
                                        handleTabChange(e.path);
                                    }}
                                    className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${isActive ? "bg-[#E9E8F9]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                        }`}
                                >
                                    <span className={`font-[400] text-[14px] ml-3 ${isActive ? "text-[#000000]" : "text-grey-200 group-hover:text-[#1E1E1E]"}`}>
                                        {e.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full overflow-x-hidden pr-0 py-8 pl-3 lg:pl-[290px] lg:pr-4 lg:py-3">
                    {renderMainContent()}
                </div>
            </div>

            {/* Mobile Sidebar */}
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
                            <div className='flex justify-center items-center cursor-pointer' onClick={() => {
                                navigate("/dashboard")
                                dispatch(discardSkillsData())
                            }}>
                                <div className="flex gap-4 pl-3 items-center h-[57px]">
                                    <h1 className="text-[20px] font-[600]">{t("receptionist")}</h1>
                                </div>
                            </div>
                            <hr className='text-[#E1E4EA]' />
                        </div>
                        <div className="flex flex-col w-full items-start gap-2 relative px-5">
                            <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                                <div className="flex justify-center items-center">
                                    <img src={tomImg} alt={"ken"} className="object-fit" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Ken</h1>
                                    <p className="text-[#5A687C] text-[14px] font-[400]">{t("receptionist")}</p>
                                </div>
                            </div>
                            {sideMenuList.map((e, i) => {
                                const isActive = activeSidebarItem === e.path;
                                return (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            handleTabChange(e.path);
                                            setSideBarStatus(false);
                                        }}
                                        className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${isActive ? "bg-[#E9E8F9]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                            }`}
                                    >
                                        <span className={`font-[400] text-[14px] ml-3 ${isActive ? "text-[#000000]" : "text-grey-200 group-hover:text-[#1E1E1E]"}`}>
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

export default Ken

