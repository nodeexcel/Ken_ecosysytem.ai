import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { GoDotFill } from "react-icons/go"
import { v4 as uuidv4 } from 'uuid';
import { BulbIcon, Delete, DislikeIcon, Duplicate, Edit, EditIcon, ImageChatIcon, LikeIcon, MicChatIcon, PaperClipChatIcon, SearchChatIcon, SearchIcon, SendIcon, SpeakerIcon, ThreeDots, WebSearchChatIcon } from "../icons/icons";
import { useSelector } from "react-redux";
import { formatTimeAgo } from "../utils/TimeFormat";
import { useTranslation } from "react-i18next";


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
        // setOpenChat,
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
        socket2Ref, staticSuggestions, nameColor } = listedProps
    const [errorMessage, setErrorMessage] = useState("")
    const [activeDropdown, setActiveDropdown] = useState(null);
    const chatRef = useRef()
    const moreActionsRef = useRef()
    const userDetails = useSelector((state) => state.profile);
    const { t } = useTranslation();

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
        setName(value)
        setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    const sendToSocket = () => {
        console.log(WebSocket.OPEN, WebSocket.CONNECTING)

        const messageToSend = input
        if (!messageToSend) return

        try {
            console.log(socketRef)
            if (socketRef.current === null) {
                socketRef.current = new WebSocket(`${newwebsocketurl}?token=${localStorage.getItem("token")}`)
            }
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
                socketRef.current = new WebSocket(`${newwebsocketurl}?token=${localStorage.getItem("token")}`)
                socketRef.current.onopen = () => {
                    socketRef.current.send(messageToSend)
                }
                console.warn('Second WebSocket not ready to send')
            }

            const agentMessage = {
                id: uuidv4(),
                isUser: true,
                content: messageToSend,
                sender: "User",
                time: formatTimeAgo(new Date()),
                status: "Read",
            };
            setMessages((prev) => [...prev, agentMessage]);

            socketRef.current.onmessage = async (event) => {
                const responseText = event.data
                console.log('💬 Bot:', responseText)
                const parsedMessage = JSON.parse(responseText);
                console.log('💬 Bot:', parsedMessage)

                const userMessage = {
                    id: uuidv4(),
                    isUser: false,
                    content: parsedMessage?.agent,
                    sender: "Ecosystem.ai",
                    time: formatTimeAgo(parsedMessage?.message_at),
                    status: "Read",
                };

                setMessages((prev) => [...prev, userMessage]);
                // handleGetAccountChats()
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.close()
                }
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
                socket2Ref.current = new WebSocket(`${websocketurl}/${activeConversation}?token=${localStorage.getItem("token")}`)
                socket2Ref.current.onopen = () => {
                    socket2Ref.current.send(messageToSend)
                }
            }

            const agentMessage = {
                id: uuidv4(),
                isUser: true,
                content: messageToSend,
                sender: "User",
                time: formatTimeAgo(new Date()),
                status: "Read",
            };
            setMessages((prev) => [...prev, agentMessage]);

            socket2Ref.current.onmessage = async (event) => {
                const responseText = event.data
                console.log('💬 Bot:', responseText)
                const parsedMessage = JSON.parse(responseText);
                console.log('💬 Bot:', parsedMessage)

                const userMessage = {
                    id: uuidv4(),
                    isUser: false,
                    content: parsedMessage?.agent ?? parsedMessage?.error,
                    sender: "Ecosystem.ai",
                    time: formatTimeAgo(parsedMessage?.message_at),
                    status: "Read",
                };

                setMessages((prev) => [...prev, userMessage]);
                // handleGetAccountChats()
            }

        } catch (err) {
            console.error('Failed to send message to second socket:', err)
        }
    }


    const handleSend = (e) => {
        e.preventDefault()
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
        if (messages?.length > 0 && !messages?.[messages.length - 1].isUser) {
            handleGetAccountChats()
        }
    }, [messages])

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
        // socket2Ref.current = new WebSocket(`${websocketurl}/${chat_id}?token=${localStorage.getItem("token")}`)
        await handleChatHistoryId(chat_id)
        setActiveConversation(chat_id)
    }

    const handleSelectNewChat = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.close()
        }

        // setOpenChat(true)
        setActiveConversation("")
        const userMessage = [{
            id: uuidv4(),
            isUser: false,
            content: initialMessage,
            sender: "Ecosystem.ai",
            time: formatTimeAgo(new Date()),
            status: "Read",
        }];
        setMessages([])
    }

    const stopTranscription = () => {
        if (socket2Ref.current && socket2Ref.current.readyState === WebSocket.OPEN) {
            socket2Ref.current.close()
        }

    }

    const handleSelectMessage = (value) => {
        setInput(value)
    }

    const suggestionsChat = [{ label: staticSuggestions[0].label, icon: <BulbIcon />, key: staticSuggestions[0].key },
    { label: staticSuggestions[1].label, icon: <EditIcon />, key: staticSuggestions[1].key },
    { label: staticSuggestions[2].label, icon: <SearchChatIcon />, key: staticSuggestions[2].key }
    ]

    const searchIcons = [{ key: "image", icon: <ImageChatIcon /> }, { key: "pin", icon: <PaperClipChatIcon /> },
    { key: "mic", icon: <MicChatIcon /> }, { key: "web_search", icon: <WebSearchChatIcon /> }
    ]

    if (loading) return <p className='flex justify-center items-center h-[100vh]'><span className='loader' /></p>



    return (
        <div className="w-full py-4 h-screen pr-2 flex flex-col gap-3">
            <h1 className="text-[24px] font-[600] text-[#1E1E1E]">{t("seo.chat")}</h1>
            <div className="h-full overflow-auto flex pb-2 flex-col">
                <div className="flex bg-white h-full rounded-2xl border-[#E1E4EA] border">
                    {/* Sidebar */}
                    <div className="w-[240px] bg-[#FFFFFF] h-full flex flex-col gap-2 rounded-l-2xl border-[#E1E4EA] border-r">
                        <div className="px-4 py-2">
                            <div className="relative flex-1">
                                <div className="absolute left-3 top-[25%]">
                                    <SearchIcon />
                                </div>
                                <input type="text" placeholder={t("seo.search_chat_placeholder")} className="w-full text-[#5A687C] pl-9 pr-3 py-[6px] text-sm border border-[#E1E4EA] bg-white focus:outline-none focus:border-[#675FFF] rounded-md" />
                            </div>
                        </div>

                        <div className="w-[240px] h-full max-h-[90%] overflow-y-auto">
                            <div className="flex px-4 pb-4">
                                <button onClick={handleSelectNewChat} className="text-[#1E1E1E] font-[400] px-1 cursor-pointer py-[6px] w-full text-[14px] flex items-center gap-2 hover:bg-[#F0EFFF] hover:rounded-lg">
                                    <Edit chat={true} /> <span>{t("seo.new_chat")}</span>
                                </button>
                            </div>
                            <hr style={{ color: "#E1E4EA" }} />
                            <div ref={moreActionsRef} className="px-4 py-3">
                                {loadingChatsList ? <div className="flex justify-center p-4 items-center w-full"><span className="loader" /> </div> : chatList?.length > 0 ? chatList.map((conversation, index) => (
                                    <div key={index} className="flex relative items-center">
                                        <div

                                            className={`flex w-full justify-between group items-center gap-3 my-1 py-[6px] px-4 cursor-pointer ${activeConversation === conversation.chat_id ? "bg-[#F0EFFF] text-[#1E1E1E] rounded-lg" : "hover:bg-[#F0EFFF]  hover:rounded-lg "
                                                }`}
                                            onClick={() => {
                                                handleSelectChat(conversation.chat_id)
                                                setActiveDropdown(null)
                                            }}
                                        >
                                            <p className={`text-[14px] truncate font-[400] group-hover:text-[#1E1E1E] ${activeConversation === conversation.chat_id ? 'text-[#1E1E1E]' : 'text-[#5A687C]'}`}>{conversation.name === null ? `${t("account_chat")}` : conversation.name}</p>
                                        </div>
                                        <div className="absolute right-2">
                                            <button
                                                onClick={() => handleDropdownClick(index)}
                                                className={`py-1 px-1 cursor-pointer relative hover:bg-[#fff] hover:rounded-sm ${activeConversation === conversation.chat_id && 'bg-[#fff] rounded-sm'}`}>
                                                <ThreeDots />
                                            </button>
                                            {activeDropdown === index && (
                                                <div className="absolute right-0 px-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-[99999]">
                                                    <div className="py-1">
                                                        <button
                                                            className="flex w-full group text-left cursor-pointer px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] hover:rounded-lg font-[500]"
                                                            onClick={() => {
                                                                setEditData(conversation)
                                                                setName(conversation?.name !== null ? conversation?.name : 'Accounting Chat')
                                                                setActiveDropdown(null);
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>{t("rename")}</span> </div>
                                                        </button>
                                                        <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                                                        <div className='py-2'>
                                                            <button
                                                                className="flex w-full cursor-pointer text-left px-4 hover:rounded-lg py-2 text-sm text-red-600 hover:bg-[#F4F5F6] font-[500]"
                                                                onClick={async () => {
                                                                    await handleDelete(conversation.chat_id)
                                                                    setActiveDropdown(null);
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2">{<Delete />} <span>{t("delete")}</span> </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )) : <p className="text-[#5A687C] font-[400] text-[12px] text-center pt-8">{t("tara.no_chat_history")}</p>}
                            </div>
                        </div>
                    </div>
                    {/* Main Content */}
                    {openChat ?
                        loadingChats ? <div className="flex justify-center items-center w-full"><span className="loader" /> </div> : <div className="flex-1 h-full max-w-[80%] mx-auto flex justify-between flex-col pt-2">
                            {/* Messages */}
                            <div ref={chatRef} className="flex-1 p-4 overflow-y-auto">
                                <div className="space-y-6">
                                    {messages?.length > 0 ? messages.map((message) => (
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
                                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] text-[#675FFF] font-[600]">{userDetails?.user?.firstName[0]}</div>
                                                    <div className="text-[12px] font-[600] text-[#5A687C]">{userDetails?.user?.firstName}</div>
                                                    <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                                        {message.time}</span>
                                                </div>
                                            )}

                                            {message.id === "typing" ? <div className="pl-[50px] pt-3 flex "><span className="three-dots" /></div> : <div
                                                className={`max-w-[70%] w-fit text-[12px] font-[400] p-3 ${!message.isUser ? "my-1 bg-[#F2F2F7] text-[#5A687C] rounded-b-[10px] rounded-r-[10px]" : "ml-auto my-1 bg-[#675FFF] text-[#fff] rounded-b-[10px] rounded-l-[10px]"
                                                    }`}
                                            >
                                                <p className="text-[16px] !whitespace-pre-wrap">{message.content}</p>
                                            </div>}
                                            {message.id !== "typing" && !message.isUser && <div className="my-1 flex items-center gap-1">
                                                <Duplicate />
                                                <LikeIcon />
                                                <DislikeIcon />
                                                <SpeakerIcon />
                                                <SendIcon />
                                            </div>}
                                        </div>
                                    )) : <div className="flex flex-col gap-6 p-5">
                                        <div className="text-[#000000] text-[24px] font-[400]">
                                            <h1>{t("tara.hey")} <span style={{ color: nameColor }}>{agentName}</span></h1>
                                            <h1>{t("tara.help_you")}</h1>
                                        </div>
                                        <div className="w-full flex flex-wrap gap-2">
                                            {suggestionsChat.map((e) => (
                                                <div key={e.key} onClick={() => handleSelectMessage(e.key)} className="border cursor-pointer w-full md:w-[45%] lg:w-[32%] flex items-center gap-[12px] border-[#E1E4EA] p-[14px] rounded-[7px]">
                                                    <div>{e.icon}</div>
                                                    <p className="text-[#000000] font-[400] text-[14px]">{e.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>}

                                </div>

                            </div>

                            {/* Input */}
                            <div className="w-full mx-auto p-2">
                                <form onSubmit={handleSend} className="flex w-full flex-col items-center gap-2 p-2 rounded-2xl border border-gray-300 shadow-sm">
                                    <input
                                        type="text"
                                        className="flex-1 w-full px-4 py-2 outline-none border-none text-sm"
                                        placeholder={t("type_message")}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                    {/* Left Icons */}
                                    <div className="flex w-full justify-between px-2">
                                        <div className="flex items-center">
                                            {searchIcons.map((e) => (
                                                <div key={e.key} className="p-[10px] cursor-pointer hover:bg-[#F2F2F7] hover:rounded-[11px]">
                                                    {e.icon}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Text Input */}

                                        {/* Send Button */}
                                        <button disabled={!input} type="submit" className={`${input ? 'bg-indigo-500 cursor-pointer' : 'bg-gray-500 cursor-not-allowed'} text-white px-4 py-2 rounded-md transition`}>
                                            {t("send")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div> : <h1 className="text-[#5A687C] text-[18px] font-[400] flex justify-center items-center w-full">{t("welcome_to")} Ecosysteme.ai {t("chats")}</h1>}
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
                                    {t("brain_ai.integrations.ok")}
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
                                    {t("tara.update_chat_name")}
                                </h2>
                                <div>
                                    <label className="text-sm font-medium text-[#1e1e1e]">
                                        {t("brain_ai.name")}
                                    </label>
                                    <input
                                        type="text"
                                        name='name'
                                        value={name}
                                        onChange={handleChange}
                                        className={`w-full bg-white p-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                        placeholder={t("tara.name_placeholder")}
                                    />
                                    {errors.name && <p className="text-[12px] font-[400] text-red-500 my-3">{errors.name}</p>}
                                </div>
                                <div className="flex gap-4 mt-2 w-full">
                                    <button
                                        className="w-full bg-[#675FFF] text-white px-5 py-2 font-[500] test-[16px]  rounded-lg"
                                        onClick={handleUpdateName}
                                        disabled={updateNameLoading}
                                    >
                                        {updateNameLoading ? <p className="flex items-center justify-center gap-1">{t("processing_normal")}<span className="loader" /></p> : `${t("brain_ai.update")}`}
                                    </button>
                                    <button
                                        className="w-full bg-white text-[#5A687C] border-[1.5px] border-[#E1E4EA] font-[500] test-[16px] px-5 py-2 rounded-lg"
                                        onClick={() => setEditData({})}
                                    >
                                        {t("cancel")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AgentChatBox