import { useState } from 'react'
import { ConversationIcon, LeftArrow } from '../../icons/icons'
import taraImg from "../../assets/svg/tara_logo.svg"
import { useNavigate } from 'react-router-dom'
import AccountingChat from '../../components/AccountingChat'
import taraMsgLogo from '../../assets/svg/tara_msg_logo.svg'

function Coo() {
    const [activeSidebarItem, setActiveSidebarItem] = useState("chat")

    const navigate = useNavigate()

    const sideMenuList = [
        { label: "Chat", icon: <ConversationIcon status={activeSidebarItem == "chat"} />, hoverIcon: <ConversationIcon hover={true} />, path: "chat" },
    ]

    const renderMainContent = () => {
        switch (activeSidebarItem) {
            default:
                return <AccountingChat agentLogo={taraMsgLogo} agentName={"Tara"} />
        }

    }
    return (
        <div className="h-full w-full">
            <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full">
                {/* Sidebar */}
                <div className="flex flex-col bg-white gap-8 border-r border-[#E1E4EA] w-[272px] h-full">
                    <div className=''>
                        <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => navigate("/dashboard")}>
                            <div className="flex gap-4 pl-5 items-center h-[57px]">
                                <LeftArrow />
                                <h1 className="text-[20px] font-[600]">COO</h1>
                            </div>
                        </div>
                        <hr className='text-[#E1E4EA]' />
                    </div>
                    <div className="flex flex-col w-full items-start gap-2 relative px-2">
                        <div className="bg-[#F7F7FF] border border-[#E9E8FF]  w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                            <div className="flex justify-center items-center">
                                <img src={taraImg} alt={"tara"} className="object-fit" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Tara</h1>
                                <p className="text-[#5A687C] text-[14px] font-[400]">COO</p>
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
                <div className="w-full py-3 pr-4 overflow-x-hidden">
                    {renderMainContent()}
                </div>
            </div>
        </div>
    )
}

export default Coo
