import { useState } from 'react'
import { AutomationIcon, CallAgent, EmailIcon, HelpIcon, LeftArrow, } from '../../icons/icons'
import calinaImg from "../../assets/svg/calina_logo.svg"
import { useNavigate } from 'react-router-dom'
import SmartChatbot from '../../components/CustomerSupportSmartChatbot'
import FaqCustomerSupport from '../../components/FaqCustomerSupport'
import UserGuideCustomerSupport from '../../components/UserGuideCustomerSupport'
import EmailCustomerSupport from '../../components/EmailCustomerSupport'
import { BsThreeDots } from 'react-icons/bs'
import { X } from 'lucide-react'

function CustomerSupport() {
    const [activeSidebarItem, setActiveSidebarItem] = useState("smart_bot")
    const [sidebarStatus, setSideBarStatus] = useState(false)

    const navigate = useNavigate()

    const sideMenuList = [
        { label: "Smart Chatbot", icon: <AutomationIcon status={activeSidebarItem == "smart_bot"} />, hoverIcon: <AutomationIcon hover={true} />, path: "smart_bot" },
        { label: "FAQ Generator", icon: <HelpIcon status={activeSidebarItem == "faq_generator"} />, hoverIcon: <HelpIcon hover={true} />, path: "faq_generator" },
        { label: "User Guide Generator", icon: <CallAgent status={activeSidebarItem == "user_guide"} />, hoverIcon: <CallAgent hover={true} />, path: "user_guide" },
        { label: "Customer Email Responder", icon: <EmailIcon status={activeSidebarItem == "email"} />, hoverIcon: <EmailIcon hover={true} />, path: "email" },
    ]

    const renderMainContent = () => {
        switch (activeSidebarItem) {
            case "faq_generator":
                return <FaqCustomerSupport />;
            case "user_guide":
                return <UserGuideCustomerSupport />;
            case "email":
                return <EmailCustomerSupport />;
            default:
                return <SmartChatbot />
        }

    }
    return (
        <div className="h-full w-full relative">
            <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} ><BsThreeDots size={24} color='#1e1e1e' /></div>
            <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full">
                {/* Sidebar */}
                <div className="lg:flex hidden flex-col bg-white gap-8 border-r border-[#E1E4EA] min-w-[272px] h-full">
                    <div className=''>
                        <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => {
                            navigate("/dashboard")
                            stopTranscription()
                        }}>
                            <div className="flex gap-4 pl-3 items-center h-[57px]">
                                {/* <LeftArrow /> */}
                                <h1 className="text-[20px] font-[600]">Customer Support</h1>
                            </div>
                        </div>
                        <hr className='text-[#E1E4EA]' />
                    </div>
                    <div className="flex flex-col w-full items-start gap-2 relative px-3">
                        <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                            <div className="flex justify-center items-center">
                                <img src={calinaImg} alt={"calina"} className="object-fit" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Calina</h1>
                                <p className="text-[#5A687C] text-[14px] font-[400]">Customer Support</p>
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
                <div className="w-full overflow-x-hidden pr-0 py-8 pl-3 lg:pl-0 lg:pr-4 lg:py-3">
                    {renderMainContent()}
                </div>
            </div>
            {sidebarStatus &&
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
                            <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => {
                                navigate("/dashboard")
                                stopTranscription()
                            }}>
                                <div className="flex gap-4 pl-3 items-center h-[57px]">
                                    {/* <LeftArrow /> */}
                                    <h1 className="text-[20px] font-[600]">Customer Support</h1>
                                </div>
                            </div>
                            <hr className='text-[#E1E4EA]' />
                        </div>
                        <div className="flex flex-col w-full items-start gap-2 relative p-3">
                            <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                                <div className="flex justify-center items-center">
                                    <img src={calinaImg} alt={"calina"} className="object-fit" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Calina</h1>
                                    <p className="text-[#5A687C] text-[14px] font-[400]">Customer Support</p>
                                </div>
                            </div>
                            {sideMenuList.map((e, i) => <div
                                key={i}
                                onClick={() => {
                                    setActiveSidebarItem(e.path)
                                    setSideBarStatus(false)
                                }}
                                className={`flex group justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === `${e.path}` ? "bg-[#F0EFFF]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
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
                </div>
            }
        </div>
    )
}

export default CustomerSupport
