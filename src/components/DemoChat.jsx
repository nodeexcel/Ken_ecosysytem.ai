import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import { GoDotFill } from "react-icons/go"
import { RiCheckDoubleLine } from "react-icons/ri"
import { FaRegSmile } from "react-icons/fa";
import { PiImageBold } from "react-icons/pi"
import { FiMic, FiPaperclip } from "react-icons/fi"
import { chatAgent, getAppointmentSetter, getChatHistory, getChats } from "../api/appointmentSetter";
import { v4 as uuidv4 } from 'uuid';


const DemoChat = () => {
    const [activeConversation, setActiveConversation] = useState()
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [chatList, setChatList] = useState();
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false);
    const [loadingChats, setLoadingChats] = useState(false);
    const [agentId, setAgentId] = useState();
    const chatRef = useRef()

    useEffect(() => {
        handleChatBox()
        handleGetAgents()
    }, [])

    useEffect(() => {
        if (chatList?.length > 0) {
            setLoading(false)
        }
    }, [chatList])

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);


    const handleGetAgents = async () => {
        setLoading(true)
        setMessage("")
        try {
            const response = await getAppointmentSetter()
            if (response?.status === 200) {
                if (response?.data?.agent?.length === 0) {
                    setMessage("Please create an Agent")
                } else {
                    setAgentId(response?.data?.agent?.[0].agent_id)
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleChatBox = async () => {
        try {
            const response = await getChats();
            console.log(response.data)
            if (response.status === 200) {
                setChatList(response.data.success)
                // if (response.data.success.length == 0) {

                // }
            } else if (response?.status === 404) {
                setChatList([])
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const transformApiMessages = (apiMessages) => {
        return apiMessages.map((msg) => {
            const isUser = !!msg.user;
            const content = isUser ? msg.user : msg.agent;

            return {
                id: uuidv4(),
                isUser,
                content,
                sender: isUser ? "User" : "Ecosystem.ai",
                time: "Just now",
                status: "Read"
            };
        });
    };


    const handleChatById = async (id) => {
        setLoadingChats(true)
        try {
            const response = await getChatHistory(id);
            console.log(response.data)
            if (response.status === 200) {
                const data = await transformApiMessages(response?.data?.success)
                setMessages(data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingChats(false)
        }
    }

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            id: uuidv4(),
            isUser: true,
            content: input,
            sender: "User",
            time: "Just now",
            status: "Read",
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        const typingMessage = {
            id: "typing",
            isUser: false,
            content: "...",
            sender: "Ecosystem.ai",
            time: "Typing...",
            status: "",
        };
        setMessages((prev) => [...prev, typingMessage]);

        try {
            const payload = { message: input };
            const response = await chatAgent(payload, agentId);
            console.log(response.data);

            if (response.status === 200) {
                const agentMessage = {
                    id: uuidv4(),
                    isUser: false,
                    content: response?.data?.success?.agent,
                    sender: "Ecosystem.ai",
                    time: "Just now",
                    status: "Read",
                };

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === "typing" ? agentMessage : msg
                    )
                );
            } else {
                setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
            }

        } catch (error) {
            console.log(error);
            setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
        }
    };


    const handleSelectChat = async (id) => {
        await handleChatById(id)
        setActiveConversation(id)
    }



    return (
        <div className="w-full py-4 pr-2 h-screen overflow-auto  flex flex-col gap-4 ">
            <div className="flex justify-between items-center">
                <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Conversation</h1>
            </div>
            {loading ? <div className="flex justify-center items-center"><span className="loader" /></div> : message ? <p>{message}</p> : chatList?.length === 0 ? <div className="flex flex-col h-[450px] shadow rounded-r-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4">
                    <div>
                        <h2 className="font-medium">User {activeConversation}</h2>
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
                <div ref={chatRef} className="flex-1 p-4 overflow-y-auto max-h-[400px]">
                    <div className="space-y-6">
                        {messages.map((message) => (
                            <div key={message.id} className="flex flex-col">
                                {!message.isUser && (
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] font-[600] text-[#675FFF]">E</div>
                                        <span className="text-sm font-medium">{message.sender}</span>
                                        <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                            {message.time}</span>
                                        <span className="text-[12px] text-[#5A687C] ml-1 flex items-center gap-1"> <RiCheckDoubleLine />{message.status}</span>
                                    </div>
                                )}


                                {message.isUser && (
                                    <div className="flex items-center gap-1 mt-1 ml-auto">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] text-[#675FFF] font-[600]">U</div>
                                        <span className="text-xs text-gray-500">{message.sender}</span>
                                        <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                            {message.time}</span>
                                        <span className="text-[12px] text-[#5A687C] ml-1 flex items-center gap-1"> <RiCheckDoubleLine />{message.status}</span>
                                    </div>
                                )}
                                {message.id === "typing" ? <div className="pl-[50px] pt-3 flex "><span className="three-dots" /></div> : <div
                                    className={`max-w-md text-[12px] font-[400] p-3 rounded-lg ${message.isUser ? "ml-auto my-1 bg-[#675FFF] text-white" : "bg-[#F2F2F7] text-[#5A687C]"
                                        }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                </div>}
                            </div>
                        ))}

                        {/* <div className="text-xs text-[#5A687C] gap-1 text-center flex justify-between items-center"><hr style={{ color: "#E1E4EA", height: "10px", width: "40%" }} /><span className="pb-2 text-[#5A687C] text-[12px] font-[400]">Unread messages</span><hr style={{ color: "#E1E4EA", height: "10px", width: "40%" }} /></div> */}
                    </div>
                </div>

                {/* Input */}
                <div className="w-full mx-auto p-2">
                    <div className="flex w-full flex-col items-center gap-2 p-2 rounded-2xl border border-gray-300 shadow-sm">
                        <input
                            type="text"
                            className="flex-1 w-full px-4 py-2 outline-none border-none text-sm"
                            placeholder="Type your message here ...."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        {/* Left Icons */}
                        <div className="flex w-full justify-between">
                            <div className="flex items-center gap-2 px-2 text-gray-500">
                                <FaRegSmile className="cursor-pointer hover:text-gray-700" color="#5A687C" size={18} />
                                <div className="bg-gray-100 p-1 rounded-full">
                                    <PiImageBold className="cursor-pointer hover:text-gray-700" color="#5A687C" size={18} />
                                </div>
                                <FiPaperclip className="cursor-pointer hover:text-gray-700" color="#5A687C" size={18} />
                                <FiMic className="cursor-pointer hover:text-gray-700" color="#5A687C" size={18} />
                            </div>

                            {/* Text Input */}

                            {/* Send Button */}
                            <button onClick={handleSendMessage} className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div> : <div className="flex bg-white rounded-2xl shadow">
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

                    <div className="mt-2 p-2 h-[460px] overflow-y-auto">
                        {chatList?.length > 0 && chatList.map((conversation, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-3 my-1 p-4 cursor-pointer hover:bg-white hover:rounded-2xl ${activeConversation === conversation ? "bg-white rounded-2xl" : ""
                                    }`}
                                onClick={() => handleSelectChat(conversation)}
                            >
                                <div className={`flex items-center bg-[#DFE3F7] justify-center w-10 h-10 rounded-xl`}>
                                    <span className="text-[16px] text-[#675FFF] font-[600]">U</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900">User {conversation}</p>
                                    {/* <p className="text-sm text-gray-500 truncate">{conversation.message}</p> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Main Content */}
                {activeConversation ?
                    <>{loadingChats ? <div className="flex justify-center items-center w-full"><span className="loader" /> </div> : <div className="flex-1 flex flex-col shadow rounded-r-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4">
                            <div>
                                <h2 className="font-medium">User {activeConversation}</h2>
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
                        <div ref={chatRef} className="flex-1 p-4 overflow-y-auto max-h-[400px]">
                            <div className="space-y-6">
                                {messages.map((message) => (
                                    <div key={message.id} className="flex flex-col">
                                        {!message.isUser && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] font-[600] text-[#675FFF]">E</div>
                                                <span className="text-sm font-medium">{message.sender}</span>
                                                <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                                    {message.time}</span>
                                                <span className="text-[12px] text-[#5A687C] ml-1 flex items-center gap-1"> <RiCheckDoubleLine />{message.status}</span>
                                            </div>
                                        )}


                                        {message.isUser && (
                                            <div className="flex items-center gap-1 mt-1 ml-auto">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] text-[#675FFF] font-[600]">U</div>
                                                <span className="text-xs text-gray-500">{message.sender}</span>
                                                <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                                    {message.time}</span>
                                                <span className="text-[12px] text-[#5A687C] ml-1 flex items-center gap-1"> <RiCheckDoubleLine />{message.status}</span>
                                            </div>
                                        )}
                                        {message.id === "typing" ? <div className="pl-[50px] pt-3 flex "><span className="three-dots" /></div> : <div
                                            className={`max-w-md text-[12px] font-[400] p-3 rounded-lg ${message.isUser ? "ml-auto my-1 bg-[#675FFF] text-white" : "bg-[#F2F2F7] text-[#5A687C]"
                                                }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                        </div>}
                                    </div>
                                ))}

                                {/* <div className="text-xs text-[#5A687C] gap-1 text-center flex justify-between items-center"><hr style={{ color: "#E1E4EA", height: "10px", width: "40%" }} /><span className="pb-2 text-[#5A687C] text-[12px] font-[400]">Unread messages</span><hr style={{ color: "#E1E4EA", height: "10px", width: "40%" }} /></div> */}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="w-full max-w-3xl mx-auto p-2">
                            <div className="flex w-full flex-col items-center gap-2 p-2 rounded-2xl border border-gray-300 shadow-sm">
                                <input
                                    type="text"
                                    className="flex-1 w-full px-4 py-2 outline-none border-none text-sm"
                                    placeholder="Type your message here ...."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                {/* Left Icons */}
                                <div className="flex w-full justify-between">
                                    <div className="flex items-center gap-2 px-2 text-gray-500">
                                        <FaRegSmile className="cursor-pointer hover:text-gray-700" color="#5A687C" size={18} />
                                        <div className="bg-gray-100 p-1 rounded-full">
                                            <PiImageBold className="cursor-pointer hover:text-gray-700" color="#5A687C" size={18} />
                                        </div>
                                        <FiPaperclip className="cursor-pointer hover:text-gray-700" color="#5A687C" size={18} />
                                        <FiMic className="cursor-pointer hover:text-gray-700" color="#5A687C" size={18} />
                                    </div>

                                    {/* Text Input */}

                                    {/* Send Button */}
                                    <button onClick={handleSendMessage} className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition">
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>}</> : <h1 className="text-[#5A687C] text-[18px] font-[400] flex justify-center items-center w-full">No conversation selected</h1>}
            </div>}
        </div>
    )
}

export default DemoChat