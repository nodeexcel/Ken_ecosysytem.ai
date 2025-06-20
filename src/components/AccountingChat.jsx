import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { GoDotFill } from "react-icons/go"
import { RiCheckDoubleLine } from "react-icons/ri"
import { FaRegSmile } from "react-icons/fa";
import { PiImageBold } from "react-icons/pi"
import { FiMic, FiPaperclip } from "react-icons/fi"
import { v4 as uuidv4 } from 'uuid';
import { getAccountingChatById, getAccountingChats } from "../api/account";
import { DateFormat } from "../utils/TimeFormat";


const AccountingChat = () => {
    const [activeConversation, setActiveConversation] = useState()
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [chatList, setChatList] = useState([]);
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false);
    const [loadingChats, setLoadingChats] = useState(false);
    const [agentEnabled, setAgentEnabled] = useState(false)
    const [loadingChatsList, setLoadingChatsList] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const chatRef = useRef()
    const socketRef = useRef(null)
    const socket2Ref = useRef(null)
    const [openChat, setOpenChat] = useState(false)

    const newwebsocketurl = "ws://116.202.210.102:8000/new-accounting-chat"
    const websocketurl = "ws://116.202.210.102:8000/accounting"


    const sendToSocket = () => {
        console.log(WebSocket.OPEN, WebSocket.CONNECTING)

        const messageToSend = input
        if (!messageToSend) return

        try {
            console.log(socketRef)
            if (socketRef.current?.readyState == WebSocket.OPEN) {
                socketRef.current.send(messageToSend)
            }
            else if (socketRef.current?.readyState == WebSocket.CONNECTING) {
                console.log("second timeeeeeeeeee")
                socketRef.current.onopen = () => {
                    socketRef.current.send(messageToSend)
                }
            }
            else {
                console.warn('Second WebSocket not ready to send')
            }

            const agentMessage = {
                id: uuidv4(),
                isUser: true,
                content: messageToSend,
                sender: "User",
                time: "Just now",
                status: "Read",
            };
            setMessages((prev) => [...prev, agentMessage]);

            socketRef.current.onmessage = async (event) => {
                const responseText = event.data
                console.log('💬 Bot:', responseText)

                const userMessage = {
                    id: uuidv4(),
                    isUser: false,
                    content: responseText,
                    sender: "Ecosystem.ai",
                    time: "Just now",
                    status: "Read",
                };

                setMessages((prev) => [...prev, userMessage]);
                handleGetAccountChats()
            }

        } catch (err) {
            console.error('Failed to send message to second socket:', err)
        }
    }

    const sendToSocket2 = () => {
        console.log(WebSocket.OPEN, WebSocket.CONNECTING)

        const messageToSend = input
        if (!messageToSend) return

        try {
            console.log(socket2Ref)
            if (socket2Ref.current?.readyState == WebSocket.OPEN) {
                socket2Ref.current.send(messageToSend)
            }
            else if (socket2Ref.current?.readyState == WebSocket.CONNECTING) {
                console.log("second timeeeeeeeeee")
                socket2Ref.current.onopen = () => {
                    socket2Ref.current.send(messageToSend)
                }
            }
            else {
                console.warn('Second WebSocket not ready to send')
            }

            const agentMessage = {
                id: uuidv4(),
                isUser: true,
                content: messageToSend,
                sender: "User",
                time: "Just now",
                status: "Read",
            };
            setMessages((prev) => [...prev, agentMessage]);

            socket2Ref.current.onmessage = async (event) => {
                const responseText = event.data
                console.log('💬 Bot:', responseText)

                const userMessage = {
                    id: uuidv4(),
                    isUser: false,
                    content: responseText,
                    sender: "Ecosystem.ai",
                    time: "Just now",
                    status: "Read",
                };

                setMessages((prev) => [...prev, userMessage]);
                handleGetAccountChats()
            }

        } catch (err) {
            console.error('Failed to send message to second socket:', err)
        }
    }


    const handleSend = () => {
        if (!input.trim()) return;
        if (activeConversation) {
            sendToSocket2()
        } else {
            sendToSocket()
        }
        setInput("")
    }


    useEffect(() => {
        handleGetAccountChats()
    }, [])

    useEffect(() => {
        if (chatList?.length > 0) {
            setLoading(false)
            setLoadingChatsList(false)
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


    const handleGetAccountChats = async () => {
        setLoadingChatsList(true)
        setMessage("")
        try {
            const response = await getAccountingChats()
            if (response?.status === 200) {
                if (response?.data?.success?.length === 0) {
                    setLoadingChatsList(false)
                } else {
                    const formatData = (response?.data?.success)
                    setChatList(formatData)
                    console.log(response?.data)

                }
            }
        } catch (error) {
            console.log(error)
            setLoadingChatsList(false)
        }
    }

    const handleChatHistoryId = async (id) => {
        setOpenChat(true)
        try {
            setLoadingChats(true)
            const response = await getAccountingChatById(id);
            console.log(response.data)
            if (response.status === 200) {
                const data = await transformApiMessages(response?.data?.success)
                setAgentEnabled(response?.data?.agent_is_enabled)
                setMessages(data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingChats(false)
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


    const handleSelectChat = async (chat_id) => {
        stopTranscription()
        socket2Ref.current = new WebSocket(`${websocketurl}/${chat_id}?token=${localStorage.getItem("token")}`)
        await handleChatHistoryId(chat_id)
        setActiveConversation(chat_id)
    }

    const handleSelectNewChat = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.close()
        }

        setOpenChat(true)
        setActiveConversation("")
        setMessages([])
        setMessage("")
        socketRef.current = new WebSocket(`${newwebsocketurl}?token=${localStorage.getItem("token")}`)
    }

    const stopTranscription = () => {
        if (socket2Ref.current && socket2Ref.current.readyState === WebSocket.OPEN) {
            socket2Ref.current.close()
        }

    }

    if (loading) return <p className='flex justify-center items-center h-[100vh]'><span className='loader' /></p>



    return (
        <div className="w-full py-4 pr-2 h-screen overflow-auto  flex flex-col gap-4 ">
            <div className="flex justify-between items-center">
                <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Accounting Chat</h1>
            </div>
            {message ? <p>{message}</p> : <div className="flex bg-white rounded-2xl shadow">
                {/* Sidebar */}
                <div className="w-[372px] bg-[#FFFFFF] rounded-l-2xl border-[#E1E4EA] border">
                    <div className="px-4 py-2">
                        <div className="mt-4">
                            <p className="text-[16px] font-[400] text-[#5A687C]">Ecosysteme.ai chats history</p>
                        </div>
                    </div>

                    <div className="w-[372px] mt-2 p-2 h-[460px] overflow-y-auto">
                        <div className="flex justify-center py-4">
                            <button onClick={handleSelectNewChat} className="border-[1.5px] hover:cursor-pointer border-[#675FFF] text-[#675FFF] px-3 py-2 rounded-lg">New Chat</button>
                        </div>
                        {loadingChatsList ? <div className="flex justify-center items-center w-full"><span className="loader" /> </div> : chatList?.length > 0 && chatList.map((conversation, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-3 my-1 p-3 cursor-pointer hover:bg-[#F6F6FF]  hover:rounded-2xl ${activeConversation === conversation.chat_id ? "bg-[#F6F6FF]  rounded-xl" : ""
                                    }`}
                                onClick={() => handleSelectChat(conversation.chat_id)}
                            >
                                <div className={`flex items-center bg-[#DFE3F7] justify-center w-10 h-10 rounded-xl`}>
                                    <span className="text-[16px] text-[#675FFF] font-[600]">C</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-[600] text-[14px] text-[#1E1E1E]">Chat {conversation.chat_id}</p>
                                    <p className="font-[600] text-[12px] text-gray-500">{DateFormat(conversation.created_at)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Main Content */}
                {openChat ?
                    <>{loadingChats ? <div className="flex justify-center items-center w-full"><span className="loader" /> </div> : <div className="flex-1 flex flex-col border border-[#E1E4EA] border-l-0 rounded-r-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4">
                            <div>
                                <h2 className="font-medium">{activeConversation ? `Chat ${activeConversation}` : 'New Chat'}</h2>
                            </div>
                        </div>
                        <hr style={{ color: "#E1E4EA" }} />

                        {/* Messages */}
                        <div ref={chatRef} className="flex-1 p-4 overflow-y-auto max-h-[380px]">
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
                                            className={`max-w-md w-fit text-[12px] font-[400] p-3 rounded-lg ${!message.isUser ? "my-1 bg-[#675FFF] text-white" : "ml-auto my-1 bg-[#F2F2F7] text-[#5A687C]"
                                                }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                        </div>}
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* Input */}
                        <div className="w-full max-w-3xl mx-auto p-2">
                            <div className="flex w-full flex-col items-center gap-2 p-2 rounded-2xl border border-gray-300 shadow-sm">
                                <input
                                    type="text"
                                    className="flex-1 w-full px-4 py-2 outline-none border-none text-sm"
                                    placeholder="Type your message here ...."
                                    disabled={agentEnabled}
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
                                    <button disabled={!input} onClick={handleSend} className={`${input ? 'bg-indigo-500' : 'bg-gray-500 cursor-not-allowed'} text-white px-4 py-2 rounded-md transition`}>
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>}</> : <h1 className="text-[#5A687C] text-[18px] font-[400] flex justify-center items-center w-full">Welcome, to Ecosysteme.ai Chats</h1>}
            </div>}

            {errorMessage && <div className="inter fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
                <div className="bg-white max-h-[300px] flex flex-col gap-4 w-full max-w-md rounded-2xl shadow-xl p-6 relative">
                    <button
                        onClick={() => {
                            setErrorMessage('')
                        }}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="space-y-6 mt-6">
                        <h2 className="text-[20px] font-[600] text-center text-[#292D32]">{errorMessage}</h2>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                onClick={() => setErrorMessage('')}
                                className={`w-fit bg-[#675FFF] cursor-pointer text-white py-[7px] px-[20px] rounded-[8px] font-semibold  transition`}
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default AccountingChat