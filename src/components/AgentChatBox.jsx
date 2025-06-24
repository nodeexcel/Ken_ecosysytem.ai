import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { GoDotFill } from "react-icons/go"
import { FaRegSmile } from "react-icons/fa";
import { PiImageBold } from "react-icons/pi"
import { FiMic, FiPaperclip } from "react-icons/fi"
import { v4 as uuidv4 } from 'uuid';
import { deleteChat, getAccountingChatById, getAccountingChats, updateChatName } from "../api/account";
import { Delete, DislikeIcon, Duplicate, Edit, LikeIcon, SearchIcon, SendIcon, SpeakerIcon, ThreeDots } from "../icons/icons";


const AgentChatBox = ({ listedProps }) => {
    const { agentLogo, agentName, initialMessage, setActiveConversation,
        activeConversation,
        setMessages,
        messages,
        setInput,
        input,
        chatList,
        setLoading,
        loading,
        setErrors,
        errors,
        setOpenChat,
        openChat,
        loadingChats,
        setLoadingChatsList,
        loadingChatsList,
        setName,
        name,
        updateNameLoading,
        setEditData,
        editData,
        newwebsocketurl,
        websocketurl,
        handleGetAccountChats,
        handleDelete,
        handleUpdateName,
        handleChatHistoryId,
        socketRef,
        socket2Ref } = listedProps
    const [errorMessage, setErrorMessage] = useState("")
    const [activeDropdown, setActiveDropdown] = useState(null);
    const chatRef = useRef()
    const moreActionsRef = useRef()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setName(value.trim())
        setErrors((prev) => ({ ...prev, [name]: "" }))
    }

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

    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
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
        const userMessage = [{
            id: uuidv4(),
            isUser: false,
            content: initialMessage,
            sender: "Ecosystem.ai",
            time: "Just now",
            status: "Read",
        }];
        setMessages(userMessage)
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
                <h1 className="text-[#1E1E1E] font-semibold text-xl md:text-2xl">Chat</h1>
            </div>
            <div className="flex bg-white rounded-2xl shadow">
                {/* Sidebar */}
                <div className="w-[240px] bg-[#FFFFFF] rounded-l-2xl border-[#E1E4EA] border">
                    <div className="px-4 py-2">
                        <div className="relative flex-1">
                            <div className="absolute left-3 top-[25%]">
                                <SearchIcon />
                            </div>
                            <input type="text" placeholder="Search Chat" className="w-full text-[#5A687C] pl-9 pr-3 py-[6px] text-sm border border-[#E1E4EA] bg-white focus:outline-none focus:border-[#675FFF] rounded-md" />
                        </div>
                    </div>

                    <div className="w-[240px] mt-2 h-[460px] overflow-y-auto">
                        <div className="flex px-4 pb-4">
                            <button onClick={handleSelectNewChat} className="text-[#1E1E1E] font-[400] text-[14px] flex items-center gap-2">
                                <Edit chat={true} /> <span>New Chat</span>
                            </button>
                        </div>
                        <hr style={{ color: "#E1E4EA" }} />
                        <div ref={moreActionsRef} className="px-4 py-3">
                            {loadingChatsList ? <div className="flex justify-center p-4 items-center w-full"><span className="loader" /> </div> : chatList?.length > 0 && chatList.map((conversation, index) => (
                                <div
                                    key={index}
                                    className={`flex justify-between group items-center gap-3 my-1 py-1 px-4 cursor-pointer ${activeConversation === conversation.chat_id ? "bg-[#F0EFFF] text-[#1E1E1E] rounded-lg" : "hover:bg-[#F0EFFF]  hover:rounded-lg "
                                        }`}
                                    onClick={() => handleSelectChat(conversation.chat_id)}
                                >
                                    <p className={`text-[12px] font-[400] group-hover:text-[#1E1E1E] ${activeConversation === conversation.chat_id ? 'text-[#1E1E1E]' : 'text-[#5A687C]'}`}>{conversation.name === null ? `Accounting Chat` : conversation.name}</p>
                                    <div>
                                        <button
                                            onClick={() => handleDropdownClick(index)}
                                            className={`py-1 px-1 relative hover:bg-[#fff] hover:rounded-sm ${activeDropdown && 'bg-[#fff] rounded-sm'}`}>
                                            <ThreeDots />
                                            {activeDropdown === index && (
                                                <div className="absolute right-0 mt-2 px-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-[99999]">
                                                    <div className="py-1">
                                                        <button
                                                            className="flex w-full group text-left cursor-pointer px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg font-[500]"
                                                            onClick={() => {
                                                                setEditData(conversation)
                                                                setName(conversation?.name !== null ? conversation?.name : 'Accounting Chat')
                                                                setActiveDropdown(null);
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>Rename</span> </div>
                                                        </button>
                                                        <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                                                        <div className='py-2'>
                                                            <button
                                                                className="flex w-full cursor-pointer text-left px-4 hover:rounded-lg py-2 text-sm text-red-600 hover:bg-[#F4F5F6] font-[500]"
                                                                onClick={() => {
                                                                    handleDelete(conversation.chat_id)
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2">{<Delete />} <span>Delete</span> </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                {openChat ?
                    <>{loadingChats ? <div className="flex justify-center items-center w-full"><span className="loader" /> </div> : <div className="flex-1 flex flex-col border pt-2 border-[#E1E4EA] border-l-0 rounded-r-2xl">
                        {/* Messages */}
                        <div ref={chatRef} className="flex-1 p-4 overflow-y-auto max-h-[380px]">
                            <div className="space-y-6">
                                {messages.map((message) => (
                                    <div key={message.id} className="flex flex-col">
                                        {!message.isUser && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <div>
                                                    <img src={agentLogo} alt={agentName} className="object-fit" />
                                                </div>
                                                <p className="text-[12px] font-[600] text-[#5A687C]">{agentName}</p>
                                                <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                                    {message.time}</span>
                                            </div>
                                        )}

                                        {message.isUser && (
                                            <div className="flex items-center gap-1 mt-1 ml-auto">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] text-[#675FFF] font-[600]">R</div>
                                                <div className="text-[12px] font-[600] text-[#5A687C]">Robert</div>
                                                <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                                    {message.time}</span>
                                            </div>
                                        )}

                                        {message.id === "typing" ? <div className="pl-[50px] pt-3 flex "><span className="three-dots" /></div> : <div
                                            className={`max-w-md w-fit text-[12px] font-[400] p-3 ${!message.isUser ? "my-1 bg-[#F2F2F7] text-[#5A687C] rounded-b-[10px] rounded-r-[10px]" : "ml-auto my-1 bg-[#675FFF] text-[#fff] rounded-b-[10px] rounded-l-[10px]"
                                                }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                        </div>}
                                        {message.id !== "typing" && !message.isUser && <div className="my-1 flex items-center gap-1">
                                            <Duplicate />
                                            <LikeIcon />
                                            <DislikeIcon />
                                            <SpeakerIcon />
                                            <SendIcon />
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
            </div>

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

            {editData?.chat_id && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-[514px] p-6 relative shadow-lg">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                setEditData({})
                            }}
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col gap-3">
                            <h2 className="text-[20px] font-semibold text-[#1E1E1E] mb-4">
                                Update the Chat Name
                            </h2>
                            <div>
                                <label className="text-sm font-medium text-[#1e1e1e]">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name='name'
                                    value={name}
                                    onChange={handleChange}
                                    className={`w-full bg-white p-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                    placeholder="Enter name"
                                />
                                {errors.name && <p className="text-[12px] font-[400] text-red-500 my-3">{errors.name}</p>}
                            </div>
                            <div className="flex gap-4 mt-2 w-full">
                                <button
                                    className="w-full bg-[#675FFF] text-white px-5 py-2 font-[500] test-[16px]  rounded-lg"
                                    onClick={handleUpdateName}
                                    disabled={updateNameLoading}
                                >
                                    {updateNameLoading ? <p className="flex items-center justify-center gap-1">Processing<span className="loader" /></p> : 'Update'}
                                </button>
                                <button
                                    className="w-full bg-white text-[#5A687C] border-[1.5px] border-[#E1E4EA] font-[500] test-[16px] px-5 py-2 rounded-lg"
                                    onClick={() => setEditData({})}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AgentChatBox