import { useEffect, useRef, useState } from 'react'
import { CalenderIcon, ConversationIcon, CreationStudioIcon, LeftArrow, LinkedInIcon, XIcon, YoutubeIcon } from '../../icons/icons'
import constanceImg from "../../assets/svg/constance_logo.svg"
import { useNavigate } from 'react-router-dom'
import constanceMsgLogo from '../../assets/svg/constance_msg_logo.svg'
import { v4 as uuidv4 } from 'uuid';
import { deleteContentCreationChat, getContentCreationChatById, getContentCreationChats, updateContentCreationChatName } from '../../api/contentCreationAgent'
import AgentChatBox from '../../components/AgentChatBox'
import { formatTimeAgo } from '../../utils/TimeFormat'
import CreationStudio from '../../components/CreationStudio'
import { useTranslation } from "react-i18next";
import Calendar from '../../components/Calendar'
import YoutubeScriptContent from '../../components/YoutubeScriptContent'
import LinkedInNukeContent from '../../components/LinkedInNukeContent'
import XPostContent from '../../components/XPostContent'
import { BsThreeDots } from 'react-icons/bs'
import { X } from 'lucide-react'

function ContentCreation() {
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
    const newwebsocketurl = "ws://agents.ecosysteme.ai/new-content-creation-agent-chat"
    const websocketurl = "ws://agents.ecosysteme.ai/content-creation-agent"
    const initialMessage = "Hello! I’m Constance, your Content Creator.\nI’m here to support you across all your HR needs, from recruiting and screening candidates to onboarding, managing interviews, and beyond.\nI can also help you with day-to-day HR topics like policy clarification, employee onboarding support, FAQ responses, and internal coordination.\nJust tell me what you need, whether it's hiring your next top talent or streamlining your HR processes. and I’ll take care of it.\nReady to simplify your HR tasks and save time? Let’s get started 😊"

    const navigate = useNavigate()
    const { t } = useTranslation();

    const sideMenuList = [
        { label: `${t("seo.chat")}`, icon: <ConversationIcon status={activeSidebarItem == "chat"} />, hoverIcon: <ConversationIcon hover={true} />, path: "chat" },
        { label: `${t("constance.creation_studio")}`, icon: <CreationStudioIcon status={activeSidebarItem == "creation_studio"} />, hoverIcon: <CreationStudioIcon hover={true} />, path: "creation_studio" },
        { label: `${t("emailings.calendar")}`, icon: <CalenderIcon status={activeSidebarItem == "calender"} />, hoverIcon: <CalenderIcon hover={true} />, path: "calender" },
        { label: `YouTube Script Writer`, icon: <YoutubeIcon status={activeSidebarItem == "youtube"} />, hoverIcon: <YoutubeIcon hover={true} />, path: "youtube" },
        { label: `LinkedIn Nuke`, icon: <LinkedInIcon status={activeSidebarItem == "linkedin"} />, hoverIcon: <LinkedInIcon hover={true} />, path: "linkedin" },
        { label: `X Post Generator`, icon: <XIcon status={activeSidebarItem == "x_post"} />, hoverIcon: <XIcon hover={true} />, path: "x_post" },
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
            const response = await getContentCreationChats()
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
                time: msg?.message_at ? formatTimeAgo(msg?.message_at) : `${t("seo.just_now")}`,
                status: "Read"
            };
        });
    };

    const handleDelete = async (id) => {
        try {
            const response = await deleteContentCreationChat(id)
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
            setErrors((prev) => ({ ...prev, name: `${t("seo.enter_name")}` }))
            return
        }
        try {
            setUpdateNameLoading(true)
            const response = await updateContentCreationChatName(editData?.chat_id, { name })
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
            const response = await getContentCreationChatById(id);
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

    const staticSuggestions = [{ label: `${t("constance.last_campaign")}`, key: `${t("constance.last_campaign_key")}` },
    { label: `${t("constance.marketing_campaign")}`, key: `${t("constance.marketing_campaign_key")}` },
    { label: `${t("constance.income_efficiently")}`, key: `${t("constance.income_efficiently_key")}` }
    ]

    const listedProps = {
        agentLogo: constanceMsgLogo,
        agentName: "Constance",
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
        nameColor: "#FF8FFF"
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
            case "creation_studio":
                return <CreationStudio />
            case "calender":
                return <Calendar />
            case "youtube":
                return <YoutubeScriptContent />
            case "linkedin":
                return <LinkedInNukeContent />
            case "x_post":
                return <XPostContent />
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
                                <h1 className="text-[20px] font-[600]">{t("constance.content_creation")}</h1>
                            </div>
                        </div>
                        <hr className='text-[#E1E4EA]' />
                    </div>
                    <div className="flex flex-col w-full items-start gap-2 relative px-3">
                        <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                            <div className="flex justify-center items-center">
                                <img src={constanceImg} alt={"constance"} className="object-fit" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[#1E1E1E] text-[16px] font-[600]">{t("constance.constance")}</h1>
                                <p className="text-[#5A687C] text-[14px] font-[400]">{t("constance.content_creation")}</p>
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
                                    <h1 className="text-[20px] font-[600]">{t("constance.content_creation")}</h1>
                                </div>
                            </div>
                            <hr className='text-[#E1E4EA]' />
                        </div>
                        <div className="flex flex-col w-full items-start gap-2 relative px-5">
                            <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                                <div className="flex justify-center items-center">
                                    <img src={constanceImg} alt={"constance"} className="object-fit" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-[#1E1E1E] text-[16px] font-[600]">{t("constance.constance")}</h1>
                                    <p className="text-[#5A687C] text-[14px] font-[400]">{t("constance.content_creation")}</p>
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

export default ContentCreation
