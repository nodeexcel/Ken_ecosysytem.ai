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
import { X, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react'
import dummy1 from '../../assets/images/dummy1.png'
import dummy2 from '../../assets/images/dummy2.png'
import chatInstance from '../../api/chatInstance'
import { useDispatch, useSelector } from 'react-redux'
import { discardSkillsData } from '../../store/agentSkillsSlice'
import ContentCreationCalender from '../../components/ContentCreationCalender'

function ContentCreation() {
    const [activeSidebarItem, setActiveSidebarItem] = useState("chat")
    const [showCreationStudioModal, setShowCreationStudioModal] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
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
    const newwebsocketurl = `${chatInstance}/new-content-creation-agent-chat`
    const websocketurl = `${chatInstance}/content-creation-agent`
    const initialMessage = "Hello! I’m Constance, your Content Creator.\nI’m here to support you across all your HR needs, from recruiting and screening candidates to onboarding, managing interviews, and beyond.\nI can also help you with day-to-day HR topics like policy clarification, employee onboarding support, FAQ responses, and internal coordination.\nJust tell me what you need, whether it's hiring your next top talent or streamlining your HR processes. and I’ll take care of it.\nReady to simplify your HR tasks and save time? Let’s get started 😊"

    const navigate = useNavigate()
    const { t } = useTranslation();
    const dispatch = useDispatch()

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown && !event.target.closest('.dropdown-container')) {
                setActiveDropdown(null);
            }
        };
        if (activeDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeDropdown]);

    const sideMenuList = [
        { label: `${t("seo.chat")}`, icon: <ConversationIcon status={activeSidebarItem == "chat"} />, hoverIcon: <ConversationIcon hover={true} />, path: "chat" },
        { label: `${t("constance.creation_studio")}`, icon: <CreationStudioIcon status={activeSidebarItem == "creation_studio"} />, hoverIcon: <CreationStudioIcon hover={true} />, path: "creation_studio" },
        { label: t("constance.scheduler"), icon: <CalenderIcon status={activeSidebarItem == "calender"} />, hoverIcon: <CalenderIcon hover={true} />, path: "calender" },
        { label: t("skills.constance_content1_header"), icon: <YoutubeIcon status={activeSidebarItem == "youtube"} />, hoverIcon: <YoutubeIcon hover={true} />, path: "youtube" },
        { label: t("skills.constance_content2_header"), icon: <LinkedInIcon status={activeSidebarItem == "linkedin"} />, hoverIcon: <LinkedInIcon hover={true} />, path: "linkedin" },
        { label: t("skills.constance_content3_header"), icon: <XIcon status={activeSidebarItem == "x_post"} />, hoverIcon: <XIcon hover={true} />, path: "x_post" },
    ]

    const activeTab = useSelector((state) => state.skills)

    useEffect(() => {
        if (activeTab.label !== null) {
            setActiveSidebarItem(activeTab.label)
        }
    }, [activeTab.loading])

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
            let content = isUser ? msg.user : msg.agent;
            let file_id = null;
            let filename = null;

            if (isUser && typeof content === "string") {
                try {
                    const parsed = JSON.parse(content);
                    if (parsed && typeof parsed === "object") {
                        if (parsed.message) content = parsed.message;
                        if (parsed.file_id) file_id = parsed.file_id;
                        if (parsed.filename) filename = parsed.filename;
                    }
                } catch (e) { }
            }

            return {
                id: uuidv4(),
                isUser,
                content,
                sender: isUser ? "User" : "Ecosystem.ai",
                time: msg?.message_at ? formatTimeAgo(msg?.message_at) : `${t("seo.just_now")}`,
                status: "Read",
                ...(file_id && { file_id }),
                ...(filename && { filename }),
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
                return (
                    <div className="px-6 py-6 w-full h-full flex flex-col gap-6">
                        {/* Header Section */}
                        <div className="flex items-start justify-between w-full">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-[#1E1E1E] text-[28px] font-[600]">
                                    {t("constance.creation_studio") || "Creation Studio"}
                                </h1>
                                <p className="text-[#5A687C] text-[16px] font-[400]">
                                    {"Create, manage, and schedule content effortlessly using AI-powered creativity."}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCreationStudioModal(true)}
                                className="flex items-center gap-2 bg-[#675FFF] cursor-pointer text-white px-5 py-2 rounded-lg font-[500] text-sm hover:bg-[#5a4fe6] transition-colors whitespace-nowrap"
                            >
                                <Plus size={18} />
                                <span>{t("constance.add_creation_studio") || "Add Creation Studio"}</span>
                            </button>
                        </div>

                        {/* Recent Creations Section */}
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="text-[#1E1E1E] text-[20px] font-[600]">Recent Creations</h2>

                            {/* Grid of Creation Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                                {[1, 2, 3, 4, 5, 6].map((item, index) => {
                                    const isEven = index % 2 === 0;
                                    const cardImage = isEven ? dummy1 : dummy2;
                                    const dropdownId = `dropdown-${index}`;

                                    return (
                                        <div
                                            key={index}
                                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            {/* Thumbnail Image with rounded top corners */}
                                            <div className="w-full min-h-[100px] overflow-hidden bg-gray-100 rounded-2xl">
                                                <img
                                                    src={cardImage}
                                                    alt="Creation thumbnail"
                                                    className="w-full h-full object-cover rounded-2xl p-2 bg-white"
                                                />
                                            </div>


                                            {/* Card Content - White background */}
                                            <div className="bg-white p-4 rounded-b-xl relative">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0 ">
                                                        <h3 className="text-[#1E1E1E] text-lg font-[500] mb-1.5 leading-tight py-2">
                                                            Summer Promo Video
                                                        </h3>
                                                        <p className="text-[#5A687C] text-[14px] font-[400]">
                                                            Reels • Video
                                                        </p>
                                                    </div>

                                                    {/* Three Dots Menu - Bottom Right */}
                                                    <div className="relative dropdown-container flex-shrink-0 border border-gray-200 rounded-xl">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
                                                            }}
                                                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                                        >
                                                            <MoreVertical className="w-5 h-5 text-gray-500" />
                                                        </button>

                                                        {/* Dropdown Menu */}
                                                        {activeDropdown === dropdownId && (
                                                            <div className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-50">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        console.log("Edit clicked for item", index);
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#F2F2F7] transition-colors text-left"
                                                                >
                                                                    <Edit className="w-4 h-4 text-gray-700" />
                                                                    <span className="text-sm text-gray-700">Edit</span>
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        console.log("Delete clicked for item", index);
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#F2F2F7] transition-colors text-left"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                                    <span className="text-sm text-red-600">Delete</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )
            case "calender":
                return <ContentCreationCalender />
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
            <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full mt-2">
                {/* Sidebar */}
                <div className="lg:flex hidden flex-col bg-white gap-4 border border-[#D6D6D6] min-w-[272px] rounded-r-2xl rounded-tl-none rounded-bl-none fixed h-[calc(100vh-89px)] mb-8 overflow-y-auto">
                    <div className=''>
                        <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => {
                            navigate("/dashboard")
                            stopTranscription()
                            dispatch(discardSkillsData())
                        }}>
                            {/* <div className="flex gap-4 pl-3 items-center h-[57px]"> */}
                            {/* <LeftArrow /> */}
                            {/* <h1 className="text-[20px] font-[600]">{t("constance.content_creation")}</h1>
                            </div> */}
                        </div>
                    </div>
                    <div className="flex flex-col w-full items-start gap-2 relative px-3">
                        <div className="bg-[#ffffff] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                            <div className="flex justify-center items-center">
                                <div className="w-10 h-10 rounded-full bg-[#FFE4C5] flex items-center justify-center">
                                    <img
                                        src={constanceImg}
                                        alt="constance"
                                        className="w-8 h-8 object-contain scale-115"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[#1E1E1E] text-[16px] font-[600]">
                                    {t("constance.constance")}
                                </h1>
                                <p className="text-[#5A687C] text-[14px] font-[400]">
                                    {t("constance.content_creation")}
                                </p>
                            </div>
                        </div>

                        {sideMenuList.map((e, i) => <div
                            key={i}
                            onClick={() => setActiveSidebarItem(e.path)}
                            className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === `${e.path}` ? "bg-[#E9E8F9]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
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
                <div className="w-full overflow-x-hidden pr-0 py-8 pl-3 lg:pl-[290px] lg:pr-4 lg:py-3">
                    {renderMainContent()}
                </div>
            </div>

            {/* Creation Studio Modal */}
            {showCreationStudioModal && (
                <CreationStudio onClose={() => setShowCreationStudioModal(false)} />
            )}
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
