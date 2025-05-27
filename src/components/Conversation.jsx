import { useState } from "react"
import { Search } from "lucide-react"
import { GoDotFill } from "react-icons/go"
import { RiCheckDoubleLine } from "react-icons/ri"
import { FaRegSmile } from "react-icons/fa";
import { PiImageBold } from "react-icons/pi"
import { FiMic, FiPaperclip } from "react-icons/fi"


const Conversation = () => {
    const [activeConversation, setActiveConversation] = useState()
    const [message, setMessage] = useState("");

    const conversations = [
        {
            id: 0,
            name: "Autumn Phillips",
            initials: "AP",
            message: "Ok super, tu peux réserver un appel avec...",
        },
        {
            id: 1,
            name: "Kathy Pacheco",
            initials: "KP",
            message: "Ok super, tu peux réserver un appel avec...",
        },
        {
            id: 2,
            name: "Robert Downey",
            initials: "RD",
            message: "Ok super, tu peux réserver un appel avec...",
        },
        {
            id: 3,
            name: "Paula Mora",
            initials: "PM",
            message: "Ok super, tu peux réserver un appel avec...",
        },
        {
            id: 4,
            name: "Stephanie Nicol",
            initials: "SN",
            message: "Ok super, tu peux réserver un appel avec...",
        },
        {
            id: 5,
            name: "Joshua Jones",
            initials: "JJ",
            message: "Ok super, tu peux réserver un appel avec...",
        },
    ]

    const messages = [
        {
            id: 1,
            sender: "Robert",
            time: "5 min ago",
            status: "Read",
            content:
                "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500",
            isUser: false,
        },
        {
            id: 2,
            sender: "Ecosystem.ai",
            time: "5 min ago",
            status: "Read",
            content:
                "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500",
            isUser: true,
        },
        {
            id: 3,
            sender: "Robert",
            time: "5 min ago",
            status: "Read",
            content:
                "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500",
            isUser: false,
        },
    ]

    return (
        <div className="w-full py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 ">
            <div className="flex justify-between items-center">
                <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Conversation</h1>
            </div>
            <div className="flex bg-white rounded-2xl shadow">
                {/* Sidebar */}
                <div className="w-80 bg-[#F2F2F7]">
                    <div className="px-4 py-2">
                        <div className="mt-4">
                            <p className="text-[16px] font-[400] text-[#5A687C]">Explore conversation with your leads</p>

                            <div className="flex items-center gap-2 mt-3">
                                <select className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#335BFB] bg-white shadow rounded-md">
                                    <option value="positive" className="text-[#5A687C]">Positive</option>
                                    <option value="engaged" className="text-[#5A687C]">Engaged</option>
                                    <option value="no_answer" className="text-[#5A687C]">No Answer</option>
                                    <option value="negative" className="text-[#5A687C]">Negative</option>
                                </select>
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input type="text" placeholder="Search" className="w-full pl-9 pr-3 py-[7px] text-sm shadow bg-white rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 p-2 max-h-[460px] overflow-y-auto">
                        {conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={`flex items-center gap-3 my-1 p-4 cursor-pointer hover:bg-white hover:rounded-2xl ${activeConversation === conversation.id ? "bg-white rounded-2xl" : ""
                                    }`}
                                onClick={() => setActiveConversation(conversation.id)}
                            >
                                <div className={`flex items-center bg-[#DFE3F7] justify-center w-10 h-10 rounded-xl`}>
                                    <span className="text-[16px] text-[#675FFF] font-[600]">{conversation.initials}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900">{conversation.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{conversation.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Main Content */}
                {activeConversation>=0?
                <div className="flex-1 flex flex-col shadow rounded-r-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4">
                        <div>
                            <h2 className="font-medium">{conversations?.[activeConversation]?.name}</h2>
                            <p className="text-sm text-gray-500">+596696451206</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Agent enabled</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-400 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#675FFF]"></div>
                            </label>
                        </div>
                    </div>
                    <hr style={{ color: "#E1E4EA" }} />

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto max-h-[400px]">
                        <div className="space-y-6">
                            {messages.map((message) => (
                                <div key={message.id} className="flex flex-col">
                                    {!message.isUser && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] font-[600] text-[#675FFF]">R</div>
                                            <span className="text-sm font-medium">{message.sender}</span>
                                            <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                                {message.time}</span>
                                            <span className="text-[12px] text-[#5A687C] ml-1 flex items-center gap-1"> <RiCheckDoubleLine />{message.status}</span>
                                        </div>
                                    )}


                                    {message.isUser && (
                                        <div className="flex items-center gap-1 mt-1 ml-auto">
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] text-[#675FFF] font-[600]">E</div>
                                            <span className="text-xs text-gray-500">{message.sender}</span>
                                            <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                                {message.time}</span>
                                            <span className="text-[12px] text-[#5A687C] ml-1 flex items-center gap-1"> <RiCheckDoubleLine />{message.status}</span>
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-md text-[12px] font-[400] p-3 rounded-lg ${message.isUser ? "ml-auto my-1 bg-[#675FFF] text-white" : "bg-[#F2F2F7] text-[#5A687C]"
                                            }`}
                                    >
                                        <p className="text-sm">{message.content}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="text-xs text-[#5A687C] gap-1 text-center flex justify-between items-center"><hr style={{ color: "#E1E4EA", height: "10px", width: "40%" }} /><span className="pb-2 text-[#5A687C] text-[12px] font-[400]">Unread messages</span><hr style={{ color: "#E1E4EA", height: "10px", width: "40%" }} /></div>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="w-full max-w-3xl mx-auto p-2">
                        <div className="flex w-full flex-col items-center gap-2 p-2 rounded-2xl border border-gray-300 shadow-sm">
                            <input
                                type="text"
                                className="flex-1 w-full px-4 py-2 outline-none border-none text-sm"
                                placeholder="Type your message here ...."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            {/* Left Icons */}
                            <div className="flex w-full justify-between">
                                <div className="flex items-center gap-2 px-2 text-gray-500">
                                    <FaRegSmile className="cursor-pointer hover:text-gray-700" color="#5A687C" size={18} />
                                    <div className="bg-gray-100 p-1 rounded-full">
                                        <PiImageBold className="cursor-pointer hover:text-gray-700" color="#5A687C" size={18}/>
                                    </div>
                                    <FiPaperclip className="cursor-pointer hover:text-gray-700" color="#5A687C" size={18}/>
                                    <FiMic className="cursor-pointer hover:text-gray-700" color="#5A687C" size={18}/>
                                </div>

                                {/* Text Input */}

                                {/* Send Button */}
                                <button className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>:<h1 className="text-[#5A687C] text-[18px] font-[400] flex justify-center items-center w-full">No conversation selected</h1>}
            </div>
        </div>
    )
}

export default Conversation