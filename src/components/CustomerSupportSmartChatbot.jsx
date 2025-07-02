import { useEffect, useRef, useState } from "react"
import { DateFormat } from "../utils/TimeFormat"
import { Delete, Edit, ThreeDots } from "../icons/icons"
import CustomerSupportChatBotForm from "./CustomerSupportChatBotForm"

const staticData = [
    {
        id: 1,
        bot_name: "Chat bot alpha",
        date: new Date(),
        tota_chats: 10,
    },
    {
        id: 2,
        bot_name: "Chat bot alpha",
        date: new Date(),
        tota_chats: 10,
    },
]
function SmartChatbot() {
    const [chatbotData, setChatbotData] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [chatBotFormStatus, setChatBotFormStatus] = useState(false)
    const moreActionsRef = useRef()

    useEffect(() => {
        setTimeout(() => {
            setChatbotData(staticData)
        }, 3000)
    }, [])

    useEffect(() => {
        if (chatbotData?.length > 0) {
            setLoading(false)
        }
    }, [chatbotData])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <>
            {!chatBotFormStatus ? <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 w-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-[24px] font-[600] text-[#1E1E1E]">Smart Chatbot </h1>
                    <button
                        onClick={() => setChatBotFormStatus(true)}
                        className="bg-[#675FFF] cursor-pointer border border-[#5F58E8] text-white font-medium rounded-lg px-5 py-2 flex items-center gap-2"
                    >
                        New Chatbot
                    </button>
                </div>
                <div>
                    <input placeholder="Search" className="max-w-[399px] bg-white focus:outline-none focus:border-[#675FFF] w-full rounded-[8px] border border-[#E1E4EA] py-[5px] px-[14px]" />
                </div>
                {/* Table */}
                <div className="w-full">
                    <table className="w-full">
                        <div className="px-5 w-full">
                            <thead>
                                <tr className="text-left text-[#5A687C] text-[16px]">
                                    <th className="px-[14px] py-[14px] min-w-[200px] max-w-[28%] w-full font-[400] whitespace-nowrap">Bot Name</th>
                                    <th className="px-[14px] py-[14px] min-w-[200px] max-w-[33%] w-full font-[400] whitespace-nowrap">Date & Time</th>
                                    <th className="px-[14px] py-[14px] min-w-[200px] max-w-[38%] w-full font-[400] whitespace-nowrap">Total Chat</th>
                                    <th className="py-[14px] w-full font-[400] whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                        </div>
                        <div className="border border-[#E1E4EA] w-full bg-white rounded-2xl p-3">
                            {loading ? <p className="flex justify-center items-center h-34"><span className="loader" /></p> :
                                chatbotData.length !== 0 ?
                                    <tbody className="w-full">
                                        {chatbotData.map((row, index) =>
                                            <tr
                                                key={row.id}
                                                className={`text-[16px] text-[#1E1E1E] ${index !== chatbotData?.length - 1 ? 'border-b border-[#E1E4EA]' : ''}`}
                                            >
                                                <td className="px-[14px] py-[14px] min-w-[200px] max-w-[32%] w-full font-[600] text-[#1E1E1E] whitespace-nowrap">{row.bot_name}</td>
                                                <td className="py-[14px] px-[14px] min-w-[200px] max-w-[38%] w-full text-[#5A687C] whitespace-nowrap">{DateFormat(row.date)}</td>
                                                <td className="py-[14px] px-[14px] min-w-[200px] max-w-[38%] w-full text-[#5A687C] whitespace-nowrap">{row.tota_chats}</td>
                                                <td ref={moreActionsRef} className="pr-[14px] relative">
                                                    <div className="flex items-center gap-2">
                                                        <button className="border-[1.5px] cursor-pointer border-[#5F58E8] text-[#675FFF] font-[500] text-[16px] py-[7px] px-[20px] rounded-[7px]">Open</button>
                                                        <div>
                                                            <button
                                                                onClick={() => handleDropdownClick(index)}
                                                                className="flex items-center">
                                                                <div className="bg-[#F4F5F6] cursor-pointer h-[34px] w-[34px] flex justify-center items-center rounded-[4px]"><ThreeDots /></div>
                                                            </button>
                                                            {activeDropdown === index && (
                                                                <div className="absolute right-6 px-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-[10]">
                                                                    <div className="py-1">
                                                                        <button
                                                                            className="block w-full group cursor-pointer text-left px-4 hover:rounded-lg py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                                                            onClick={() => {
                                                                                setActiveDropdown(null);
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>Edit</span> </div>
                                                                        </button>
                                                                        <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                                                                        <div className='py-2'>
                                                                            <button
                                                                                className="block w-full cursor-pointer text-left px-4 hover:rounded-lg py-2 text-sm text-red-600 hover:bg-[#F4F5F6] font-[500]"
                                                                                onClick={() => {
                                                                                    setActiveDropdown(null);
                                                                                }}
                                                                            >
                                                                                <div className="flex items-center gap-2">{<Delete />} <span>Delete</span> </div>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                            </tr>
                                        )}
                                    </tbody> : <p className="flex justify-center items-center h-34 text-[#1E1E1E]">No Chatbot Data Listed</p>}
                        </div>
                    </table>
                </div>
            </div> : <CustomerSupportChatBotForm />}
        </>
    )
}

export default SmartChatbot
