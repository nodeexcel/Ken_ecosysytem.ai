import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { GoDotFill } from "react-icons/go"
import { RiCheckDoubleLine } from "react-icons/ri"
import { FaRegSmile } from "react-icons/fa";
import { PiImageBold } from "react-icons/pi"
import { FiMic, FiPaperclip } from "react-icons/fi"
import { agentStatusChat, chatAgent, getAppointmentSetter, getChatHistory, getChats } from "../api/appointmentSetter";
import { v4 as uuidv4 } from 'uuid';
import { SelectDropdown } from "./Dropdown";

const options = [
    { label: "Positive", key: "positive" },
    { label: "Engaged", key: "engaged" },
    { label: "No Answer", key: "no_answer" },
    { label: "Negative", key: "negative" }
]


const WebsocketComp = () => {
    const [activeConversation, setActiveConversation] = useState()
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [chatList, setChatList] = useState([]);
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false);
    const [loadingChats, setLoadingChats] = useState(false);
    const [agentId, setAgentId] = useState();
    const [agentEnabled, setAgentEnabled] = useState(false)
    const [leadStatus, setLeadStatus] = useState("positive")
    const [loadingChatsList, setLoadingChatsList] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const chatRef = useRef()
    const socket2Ref = useRef(null)

    useEffect(() => {
        // startTranscription()
    }, [])

    const websocketurl = "ws://116.202.210.102:8000/accounting/lihugyftcf"


    const sendToSocket2 = () => {
        console.log(WebSocket.OPEN, WebSocket.CONNECTING)

        const messageToSend = input
        if (!messageToSend) return

        const payload = JSON.stringify({ text: messageToSend })

        try {
            console.log(socket2Ref)
            if (socket2Ref.current?.readyState == WebSocket.OPEN) {
                socket2Ref.current.send(payload)
            }
            else if (socket2Ref.current?.readyState == WebSocket.CONNECTING) {
                console.log("second timeeeeeeeeee")
                socket2Ref.current.open = () => {
                    socket2Ref.current.send(payload)
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
            }

        } catch (err) {
            console.error('Failed to send message to second socket:', err)
        }
    }





    const startTranscription = async () => {


        try {

            socket2Ref.current.onopen = () => {
                console.log('Second WebSocket connected')
            }

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
            }

            socket2Ref.current.onclose = () => {
                console.log('Second WebSocket closed')
            }

            socket2Ref.current.onerror = (error) => {
                console.error('Second WebSocket error:', error)
            }

        } catch (error) {
            console.error('Microphone access denied or error:', error)
        }
    }


    useEffect(() => {
        handleGetAgents()
    }, [])

    useEffect(() => {
        // handleChatBox()
    }, [leadStatus])

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
            setLoadingChatsList(true)
            const response = await getChats(leadStatus);
            console.log(response.data)
            if (response.status === 200) {
                setChatList(response.data.success)
                if (response.data.success.length == 0) {
                    setLoadingChatsList(false)
                    setLoading(false)
                }
            }
        } catch (error) {
            console.log(error)
            setLoadingChatsList(false)
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


    const agentStatus = async (id) => {
        try {
            const response = await agentStatusChat(id)
            if (response?.status === 200) {
                setAgentEnabled(!agentEnabled)
            }

        } catch (error) {
            console.log(error)
        }
    }


    const handleChatById = async (id) => {
        setLoadingChats(true)
        try {
            const response = await getChatHistory(id);
            console.log(response.data)
            if (response.status === 200) {
                const data = await transformApiMessages(response?.data?.chat)
                setAgentEnabled(response?.data?.agent_is_enabled)
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
            isUser: false,
            content: input,
            sender: "Ecosystem.ai",
            time: "Just now",
            status: "Read",
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // const typingMessage = {
        //     id: "typing",
        //     isUser: false,
        //     content: "...",
        //     sender: "Ecosystem.ai",
        //     time: "Typing...",
        //     status: "",
        // };
        // setMessages((prev) => [...prev, typingMessage]);

        try {
            const payload = { message: input };
            const response = await chatAgent(payload, activeConversation);
            console.log(response.data);

            if (response?.status === 400) {
                if (response?.response?.data?.error) {
                    setErrorMessage(response?.response?.data?.error)
                }
            }
            // if (response.status === 200) {
            //     const agentMessage = {
            //         id: uuidv4(),
            //         isUser: false,
            //         content: response?.data?.success?.agent,
            //         sender: "Ecosystem.ai",
            //         time: "Just now",
            //         status: "Read",
            //     };

            //     setMessages((prev) =>
            //         prev.map((msg) =>
            //             msg.id === "typing" ? agentMessage : msg
            //         )
            //     );
            // } else {
            //     setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
            // }

        } catch (error) {
            console.log(error);
            setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
        }
    };


    const handleSelectChat = async (id) => {
        await handleChatById(id)
        setActiveConversation(id)
    }

    const stopTranscription = () => {

        if (socket2Ref.current && socket2Ref.current.readyState === WebSocket.OPEN) {
            socket2Ref.current.close()
        }

        socket2Ref.current.onclose = () => {
            console.log('Second WebSocket closed')
        }
    }

    if (loading) return <p className='flex justify-center items-center h-[100vh]'><span className='loader' /></p>



    return (
        <div className="w-full py-4 pr-2 h-screen overflow-auto  flex flex-col gap-4 ">
            <div className="flex justify-between items-center">
                <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Conversation</h1>
            </div>
            {message ? <p>{message}</p> : <div className="flex bg-white rounded-2xl shadow">
                {/* Sidebar */}
                <div className="w-[372px] bg-[#FFFFFF] rounded-l-2xl border-[#E1E4EA] border">
                    <div className="px-4 py-2">
                        <div className="mt-4">
                            <p className="text-[16px] font-[400] text-[#5A687C]">Explore conversation with your leads</p>

                            <div className="flex items-center gap-2 mt-3">
                                <SelectDropdown
                                    name="lead_status"
                                    options={options}
                                    value={leadStatus}
                                    onChange={(updated) => {
                                        setLeadStatus(updated)
                                        setActiveConversation("")
                                    }}
                                    placeholder="Select"
                                    className="w-[40%]"
                                />
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input type="text" placeholder="Search" className="w-full pl-9 pr-3 py-[10px] text-sm border border-[#E1E4EA] bg-white focus:outline-none focus:border-[#675FFF] rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-[372px] mt-2 p-2 h-[460px] overflow-y-auto">
                        <div className="flex justify-center">
                            <button onClick={() => {
                                setActiveConversation("hbgb")
                                socket2Ref.current = new WebSocket(websocketurl)
                            }} className="bg-green-200 p-3">New Chat</button>
                            <button onClick={() => {
                                setActiveConversation("")
                                stopTranscription()
                                setMessages([])
                                setMessage("")
                            }} className="bg-red-200 p-3 ml-3">End</button>
                        </div>
                        {loadingChatsList ? <div className="flex justify-center items-center w-full"><span className="loader" /> </div> : chatList?.length > 0 && chatList.map((conversation, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-3 my-1 p-3 cursor-pointer hover:bg-[#F6F6FF]  hover:rounded-2xl ${activeConversation === conversation ? "bg-[#F6F6FF]  rounded-xl" : ""
                                    }`}
                                onClick={() => handleSelectChat(conversation)}
                            >
                                <div className={`flex items-center bg-[#DFE3F7] justify-center w-10 h-10 rounded-xl`}>
                                    <span className="text-[16px] text-[#675FFF] font-[600]">U</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-[600] text-[14px] text-[#1E1E1E]">User {conversation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Main Content */}
                {activeConversation ?
                    <>{loadingChats ? <div className="flex justify-center items-center w-full"><span className="loader" /> </div> : <div className="flex-1 flex flex-col border border-[#E1E4EA] border-l-0 rounded-r-2xl">
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
                                        checked={agentEnabled}
                                        onChange={() => agentStatus(activeConversation)}
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
                                            <div className="flex items-center gap-2 mb-1 ml-auto">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] font-[600] text-[#675FFF]">E</div>
                                                <span className="text-sm font-medium">{message.sender}</span>
                                                <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                                    {message.time}</span>
                                                <span className="text-[12px] text-[#5A687C] ml-1 flex items-center gap-1"> <RiCheckDoubleLine />{message.status}</span>
                                            </div>
                                        )}


                                        {message.isUser && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] text-[#675FFF] font-[600]">U</div>
                                                <span className="text-xs text-gray-500">{message.sender}</span>
                                                <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                                    {message.time}</span>
                                                <span className="text-[12px] text-[#5A687C] ml-1 flex items-center gap-1"> <RiCheckDoubleLine />{message.status}</span>
                                            </div>
                                        )}
                                        {message.id === "typing" ? <div className="pl-[50px] pt-3 flex "><span className="three-dots" /></div> : <div
                                            className={`max-w-md w-fit text-[12px] font-[400] p-3 rounded-lg ${!message.isUser ? "ml-auto my-1 bg-[#675FFF] text-white" : "my-1 bg-[#F2F2F7] text-[#5A687C]"
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
                                    <button onClick={sendToSocket2} className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition">
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>}</> : <h1 className="text-[#5A687C] text-[18px] font-[400] flex justify-center items-center w-full">No conversation selected</h1>}
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

export default WebsocketComp


// import React, { useState, useRef, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'

// const DeepgramTranscriber = () => {
//     const [status, setStatus] = useState('Not Connected')
//     const [transcript, setTranscript] = useState([])
//     const [currentTranscript, setCurrentTranscript] = useState('')
//     const [isRecording, setIsRecording] = useState(false)
//     const [isClient, setIsClient] = useState(false)

//     const [loadingStatus, setLoadingStatus] = useState(true)
//     const token = localStorage.getItem("token")

//     const navigate = useNavigate()


//     useEffect(() => {
//         if (!token && loadingStatus) {
//             navigate("/")
//         } else {
//             setLoadingStatus(false)
//         }

//     }, [token, loadingStatus])

//     const socketRef = useRef(null)
//     const socket2Ref = useRef(null)
//     const mediaRecorderRef = useRef(null)
//     const streamRef = useRef(null)
//     const interimRef = useRef('')

//     const deepgramApiKey = import.meta.env.VITE_DEEPGRAM_KEY
//     const websocketurl = import.meta.env.VITE_BACKEND_WEBSOCKET_URL
//     const elevenLabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
//     const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID

//     useEffect(() => {
//         setIsClient(true)
//     }, [])

//     const sendToSocket2 = () => {
//         const messageToSend = currentTranscript.trim()
//         if (!messageToSend) return

//         const payload = JSON.stringify({ text: messageToSend })

//         try {
//             if (socket2Ref.current?.readyState === WebSocket.OPEN) {
//                 socket2Ref.current.send(payload)
//             } else if (socket2Ref.current?.readyState === WebSocket.CONNECTING) {
//                 socket2Ref.current.onopen = () => {
//                     socket2Ref.current.send(payload)
//                 }
//             } else {
//                 console.warn('Second WebSocket not ready to send')
//             }

//             setTranscript(prev => [...prev, { sender: 'user', text: messageToSend }])
//             setCurrentTranscript('')
//         } catch (err) {
//             console.error('Failed to send message to second socket:', err)
//         }
//     }

//     const startTranscription = async () => {
//         setStatus('Connecting...')
//         setTranscript([])
//         setCurrentTranscript('')
//         interimRef.current = ''

//         try {
//             socket2Ref.current = new WebSocket(`${websocketurl}ws?token=${token}`)

//             socket2Ref.current.onopen = () => {
//                 console.log('Second WebSocket connected')
//             }

//             socket2Ref.current.onmessage = async (event) => {
//                 const responseText = event.data
//                 console.log('💬 Bot:', responseText)

//                 setTranscript(prev => [...prev, { sender: 'bot', text: '' }])
//                 await streamSpeech(responseText)
//             }

//             socket2Ref.current.onclose = () => {
//                 console.log('Second WebSocket closed')
//                 setStatus('Disconnected from second server')
//             }

//             socket2Ref.current.onerror = (error) => {
//                 console.error('Second WebSocket error:', error)
//                 setStatus('Error with second WebSocket')
//             }

//         } catch (error) {
//             console.error('Microphone access denied or error:', error)
//         }
//     }


//     if (!isClient) return null

//     return (
//         <>
//             {!token && loadingStatus ? <div className='h-screen flex justify-center items-center'><p>Loading....</p></div> :
//                 <div className="max-w-xl mx-auto p-4 font-sans">
//                     <h2 className="text-2xl font-bold mb-4">🧠 Deepgram Live Transcription</h2>

//                     <div className="flex justify-between mb-4">
//                         {!isRecording ? (
//                             <button
//                                 onClick={startTranscription}
//                                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                             >
//                                 Start Interview Call
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={stopTranscription}
//                                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                             >
//                                 End Interview Call
//                             </button>
//                         )}
//                     </div>

//                     <p className="text-sm text-gray-600 mb-2"><strong>Status:</strong> {status}</p>

//                     <div className="bg-gray-100 h-96 overflow-y-auto p-4 rounded-lg mb-4 space-y-2 flex flex-col">
//                         {transcript.map((msg, index) => (
//                             <div
//                                 key={index}
//                                 className={`max-w-xs p-2 rounded-lg text-sm ${msg.sender === 'user'
//                                     ? 'bg-blue-100 self-end ml-auto text-right'
//                                     : 'bg-green-100 self-start mr-auto'
//                                     }`}
//                             >
//                                 <span className="block whitespace-pre-wrap">{msg.text}</span>
//                             </div>
//                         ))}
//                         {(currentTranscript || interimRef.current) && (
//                             <div className="bg-yellow-100 p-2 rounded-lg text-sm self-end max-w-xs ml-auto text-right">
//                                 {currentTranscript + (interimRef.current ? ' ' + interimRef.current : '')}
//                             </div>
//                         )}
//                     </div>

//                     <div className="flex items-center">
//                         <button
//                             onClick={sendToSocket2}
//                             disabled={!currentTranscript.trim()}
//                             className={`${currentTranscript.trim() ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'
//                                 } text-white px-6 py-2 rounded-full ml-auto`}
//                         >
//                             Send
//                         </button>
//                     </div>
//                 </div>
//             }</>
//     )
// }

// export default DeepgramTranscriber