import { useEffect, useRef, useState } from 'react'
import { AutomationIcon, ConversationIcon, LeftArrow, MeetingNotesIcon, WhatsappIcon } from '../../icons/icons'
import taraImg from "../../assets/svg/tara_logo.svg"
import { useNavigate } from 'react-router-dom'
import taraMsgLogo from '../../assets/svg/tara_msg_logo.svg'
import { v4 as uuidv4 } from 'uuid';
import { deleteCooChat, getCooChatById, getCooChats, updateCooChatName } from '../../api/cooAgent'
import AgentChatBox from '../../components/AgentChatBox'
import CooPresentations from '../../components/CooPresentations'
import CooConnectWhatsapp from '../../components/CooConnectWhatsapp'
import { useTranslation } from "react-i18next";
import { formatTimeAgo } from '../../utils/TimeFormat'
import MeetingNotesCoo from '../../components/MeetingNotesCoo'
import { BsThreeDots } from 'react-icons/bs'
import { X } from 'lucide-react'

function Coo() {
    const [activeSidebarItem, setActiveSidebarItem] = useState("chat")
    const [activeConversation, setActiveConversation] = useState()
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({})
    const [openChat, setOpenChat] = useState(true)
    const [loadingChats, setLoadingChats] = useState(false);
    const [loadingChatsList, setLoadingChatsList] = useState(false)
    const [name, setName] = useState("")
    const [updateNameLoading, setUpdateNameLoading] = useState(false)
    const [editData, setEditData] = useState({})
    const [sidebarStatus, setSideBarStatus] = useState(false)
    const socketRef = useRef(null)
    const socket2Ref = useRef(null)
    const { t } = useTranslation();
    const newwebsocketurl = "ws://agents.ecosysteme.ai/new-coo-agent-chat"
    const websocketurl = "ws://agents.ecosysteme.ai/coo-agent"
    const initialMessage = `${t("tara_coo.coo_auto_generated")}`

    const navigate = useNavigate()

    const sideMenuList = [
        { label: `${t("tara.chat")}`, icon: <ConversationIcon status={activeSidebarItem == "chat"} />, hoverIcon: <ConversationIcon hover={true} />, path: "chat" },
        { label: `${t("tara.presentation")}`, icon: <AutomationIcon status={activeSidebarItem == "presentations"} />, hoverIcon: <AutomationIcon hover={true} />, path: "presentations" },
        { label: `${t("tara.meeting_notes")}`, icon: <MeetingNotesIcon status={activeSidebarItem == "meeting_notes"} />, hoverIcon: <MeetingNotesIcon hover={true} />, path: "meeting_notes" },
        { label: `${t("tara.connect_whatsapp")}`, icon: <WhatsappIcon status={activeSidebarItem == "connect_whatsApp"} />, hoverIcon: <WhatsappIcon hover={true} />, path: "connect_whatsApp" },
    ]

    useEffect(() => {
        if (chatList?.length > 0) {
            setLoading(false)
            setLoadingChatsList(false)
        }
    }, [chatList])

    const handleGetAccountChats = async () => {
        setLoadingChatsList(true)
        try {
            const response = await getCooChats()
            if (response?.status === 200) {
                if (response?.data?.success?.length === 0) {
                    setLoadingChatsList(false)
                    setChatList([])
                    // setOpenChat(false)
                } else {
                    const formatData = (response?.data?.success)
                    if (!activeConversation && openChat) {
                        const newChatActive = formatData.filter(element => {
                            return !chatList.some(chat => chat.chat_id === element.chat_id);
                        });
                        if (newChatActive?.length > 0 && messages?.length > 0) {
                            setActiveConversation(newChatActive[0].chat_id)
                        }
                    }
                    setChatList(formatData)
                    console.log(response?.data)

                }
            }
        } catch (error) {
            console.log(error)
            setLoadingChatsList(false)
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
                time: msg?.message_at ? formatTimeAgo(msg?.message_at) : "Just now",
                status: "Read"
            };
        });
    };

    const handleDelete = async (id) => {
        try {
            const response = await deleteCooChat(id)
            if (response?.status === 200) {
                handleGetAccountChats()
                if (id === activeConversation) {
                    // setOpenChat(false)
                    setMessages([])
                    setActiveConversation("")
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleUpdateName = async () => {
        if (!name) {
            setErrors((prev) => ({ ...prev, name: "Enter the name" }))
            return
        }
        try {
            setUpdateNameLoading(true)
            const response = await updateCooChatName(editData?.chat_id, { name })
            if (response?.status === 200) {
                setEditData({})
                handleGetAccountChats()
            }

        } catch (error) {
            console.log(error)
        } finally {
            setUpdateNameLoading(false)
        }
    }

    const handleChatHistoryId = async (id) => {
        // setOpenChat(true)
        try {
            setLoadingChats(true)
            const response = await getCooChatById(id);
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

    const staticSuggestions = [{ label: `${t("tara.optimizing")}`, key: `${t("tara.optimizing_key")}` },
    { label: `${t("tara.forecast_budget")}`, key: `${t("tara.forecast_budget_key")}` },
    { label: `${t("tara.efficiently")}`, key: `${t("tara.efficiently_key")}` }
    ]

    const listedProps = {
        agentLogo: taraMsgLogo,
        agentName: "Tara",
        initialMessage: initialMessage,
        setActiveConversation: setActiveConversation,
        activeConversation: activeConversation,
        setMessages: setMessages,
        messages: messages,
        setInput: setInput,
        input: input,
        chatList: chatList,
        setLoading: setLoading,
        loading: loading,
        setErrors: setErrors,
        errors: errors,
        setOpenChat: setOpenChat,
        openChat: openChat,
        loadingChats: loadingChats,
        setLoadingChatsList: setLoadingChatsList,
        loadingChatsList: loadingChatsList,
        setName: setName,
        name: name,
        updateNameLoading: updateNameLoading,
        setEditData: setEditData,
        editData: editData,
        newwebsocketurl: newwebsocketurl,
        websocketurl: websocketurl,
        handleGetAccountChats: handleGetAccountChats,
        handleDelete: handleDelete,
        handleUpdateName: handleUpdateName,
        handleChatHistoryId: handleChatHistoryId,
        socketRef: socketRef,
        socket2Ref: socket2Ref,
        staticSuggestions: staticSuggestions,
        nameColor: "#8A84FF"
    }

    const stopTranscription = () => {
        if (socket2Ref.current && socket2Ref.current.readyState === WebSocket.OPEN) {
            socket2Ref.current.close()
        }
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.close()
        }
    }

    const renderMainContent = () => {
        switch (activeSidebarItem) {
            case "presentations":
                return <CooPresentations />
            case "meeting_notes":
                return <MeetingNotesCoo />
            case "connect_whatsApp":
                return <CooConnectWhatsapp />
            default:
                return <AgentChatBox listedProps={listedProps} />
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
                                <h1 className="text-[20px] font-[600]">COO</h1>
                            </div>
                        </div>
                        <hr className='text-[#E1E4EA]' />
                    </div>
                    <div className="flex flex-col w-full items-start gap-2 relative px-3">
                        <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
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
                            {activeSidebarItem === `${e.path}` ? <div>{e.icon}</div> :
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
                                stopTranscription()
                            }}>
                                <div className="flex gap-4 pl-3 items-center h-[57px]">
                                    {/* <LeftArrow /> */}
                                    <h1 className="text-[20px] font-[600]">COO</h1>
                                </div>
                            </div>
                            <hr className='text-[#E1E4EA]' />
                        </div>
                        <div className="flex flex-col w-full items-start gap-2 relative px-5">
                            <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
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
                                onClick={() => {
                                    setActiveSidebarItem(e.path)
                                    setSideBarStatus(false)
                                }}
                                className={`flex group justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${activeSidebarItem === `${e.path}` ? "bg-[#F0EFFF]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                    }`}
                            >
                                {activeSidebarItem === `${e.path}` ? <div>{e.icon}</div> :
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

export default Coo
