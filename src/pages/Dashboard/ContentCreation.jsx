import { useEffect, useRef, useState } from 'react'
import { CalenderIcon, ConversationIcon, CreationStudioIcon, LeftArrow, LinkedInIcon, XIcon, YoutubeIcon } from '../../icons/icons'
import constanceImg from "../../assets/svg/constance_logo.svg"
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import constanceMsgLogo from '../../assets/svg/ConstanceChat.svg'
import { v4 as uuidv4 } from 'uuid';
import { deleteContentCreationChat, getContentCreationChatById, getContentCreationChats, updateContentCreationChatName } from '../../api/contentCreationAgent'
import AgentChatBox from '../../components/AgentChatBox'
import { formatTimeAgo } from '../../utils/TimeFormat'
import CreationStudio from '../../components/CreationStudio'
import GeneratedResultsView from '../../components/GeneratedResultsView'
import { useTranslation } from "react-i18next";
import Calendar from '../../components/Calendar'
import YoutubeScriptContent from '../../components/YoutubeScriptContent'
import LinkedInNukeContent from '../../components/LinkedInNukeContent'
import XPostContent from '../../components/XPostContent'
import TutorialPlay from '../../assets/svg/WatchTutorialGrey.svg'
import { X, Plus, MoreVertical, Edit, Trash2, Play } from 'lucide-react'
import dummy1 from '../../assets/images/dummy1.png'
import dummy2 from '../../assets/images/dummy2.png'
import chatInstance from '../../api/chatInstance'
import { useDispatch, useSelector } from 'react-redux'
import { discardSkillsData } from '../../store/agentSkillsSlice'
import ContentCreationCalender from '../../components/ContentCreationCalender'
import ToastModal from '../../components/ToastModal'
import ChatActive from '../../assets/svg/ChatActive.svg'
import ChatInactive from '../../assets/svg/ChatInactive.svg'
import CreationStudioActive from '../../assets/svg/CreationStudioActive.svg'
import CreationStudioInactive from '../../assets/svg/CreationStudioInactive.svg'
import StudioActive from '../../assets/svg/StudioActive.svg'
import StudioInactive from '../../assets/svg/StudioInactive.svg'

function ContentCreation() {
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { t } = useTranslation();
    const dispatch = useDispatch()

    // Get tab from URL query param, default to "chat"
    const tabFromUrl = searchParams.get('tab') || 'chat'
    const [activeSidebarItem, setActiveSidebarItem] = useState(tabFromUrl)

    // Initialize URL with default tab if not present
    useEffect(() => {
        if (!searchParams.get('tab')) {
            setSearchParams({ tab: 'chat' }, { replace: true })
        }
    }, [])

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
    const [showGeneratedResults, setShowGeneratedResults] = useState(false)
    const [generatedContentData, setGeneratedContentData] = useState(null)
    const [toast, setToast] = useState({ open: false, type: 'success', title: '', description: '', highlightText: '' })
    const socketRef = useRef(null)
    const socket2Ref = useRef(null)
    const newwebsocketurl = `${chatInstance}/new-content-creation-agent-chat`
    const websocketurl = `${chatInstance}/content-creation-agent`
    const initialMessage = "Hello! I'm Constance, your Content Creator.\nI'm here to support you across all your HR needs, from recruiting and screening candidates to onboarding, managing interviews, and beyond.\nI can also help you with day-to-day HR topics like policy clarification, employee onboarding support, FAQ responses, and internal coordination.\nJust tell me what you need, whether it's hiring your next top talent or streamlining your HR processes. and I'll take care of it.\nReady to simplify your HR tasks and save time? Let's get started 😊"

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
        {
            label: `${t("seo.chat")}`,
            path: "chat",
            iconActive: <img src={ChatActive} alt="Chat" className="w-5 h-5" />,
            iconInactive: <img src={ChatInactive} alt="Chat" className="w-5 h-5" />,
        },
        {
            label: `${t("constance.creation_studio")}`,
            path: "creation_studio",
            iconActive: <img src={CreationStudioActive} alt="Creation Studio" className="w-5 h-5" />,
            iconInactive: <img src={CreationStudioInactive} alt="Creation Studio" className="w-5 h-5" />,
        },
        {
            label: t("constance.scheduler"),
            path: "scheduler",
            iconActive: <img src={StudioActive} alt="Scheduler" className="w-5 h-5" />,
            iconInactive: <img src={StudioInactive} alt="Scheduler" className="w-5 h-5" />,
        },
        // { label: t("skills.constance_content1_header"), icon: <YoutubeIcon status={activeSidebarItem == "youtube"} />, hoverIcon: <YoutubeIcon hover={true} />, path: "youtube" },
        // { label: t("skills.constance_content2_header"), icon: <LinkedInIcon status={activeSidebarItem == "linkedin"} />, hoverIcon: <LinkedInIcon hover={true} />, path: "linkedin" },
        // { label: t("skills.constance_content3_header"), icon: <XIcon status={activeSidebarItem == "x_post"} />, hoverIcon: <XIcon hover={true} />, path: "x_post" },
    ]

    const activeTab = useSelector((state) => state.skills)

    // Initialize URL with default tab if not present on mount
    useEffect(() => {
        if (!searchParams.get('tab')) {
            setSearchParams({ tab: 'chat' }, { replace: true })
        }
    }, [])

    // Sync active tab with URL query param when URL changes
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab') || 'chat'
        if (tabFromUrl !== activeSidebarItem) {
            setActiveSidebarItem(tabFromUrl)
        }
    }, [searchParams])

    // Update URL when tab changes
    const handleTabChange = (tabPath) => {
        setActiveSidebarItem(tabPath)
        setShowGeneratedResults(false)
        setGeneratedContentData(null)
        // Update URL query param
        if (tabPath === 'chat') {
            // For default tab, remove query param or set it explicitly
            setSearchParams({ tab: 'chat' }, { replace: true })
        } else {
            setSearchParams({ tab: tabPath }, { replace: true })
        }
    }

    useEffect(() => {
        if (activeTab.label !== null) {
            handleTabChange(activeTab.label)
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
                    // Sort by updated_at in ascending order (oldest first) for main chat list
                    const sortedData = [...formatData].sort((a, b) => {
                        // Use updated_at first, fallback to created_at if not available
                        const dateAStr = a.updated_at || a.created_at || null
                        const dateBStr = b.updated_at || b.created_at || null

                        if (!dateAStr && !dateBStr) return 0 // Both have no date, maintain order
                        if (!dateAStr) return 1 // A has no date, put it at bottom
                        if (!dateBStr) return -1 // B has no date, put it at bottom

                        const dateA = new Date(dateAStr).getTime()
                        const dateB = new Date(dateBStr).getTime()

                        // Check for invalid dates
                        if (isNaN(dateA) && isNaN(dateB)) return 0
                        if (isNaN(dateA)) return 1 // Invalid date goes to bottom
                        if (isNaN(dateB)) return -1 // Invalid date goes to bottom

                        return dateA - dateB // Ascending order (oldest first)
                    })
                    if (!activeConversation && openChat) {
                        const newChatActive = sortedData.filter(element => {
                            return !chatList.some(chat => chat.chat_id === element.chat_id);
                        });
                        if (newChatActive?.length > 0 && messages?.length > 0) {
                            setActiveConversation(newChatActive[0].chat_id)
                        }
                    }
                    setChatList(sortedData)
                    console.log(response?.data)
                }
            }
        } catch (error) {
            console.log(error)
            setLoadingChatsList(false)
        }
    }

    const transformApiMessages = (apiMessages) => {
        if (!apiMessages || !Array.isArray(apiMessages)) {
            return [];
        }

        return apiMessages.map((msg, index) => {
            const isUser = !!msg.user;
            let content = isUser ? msg.user : msg.agent;
            let file_id = null;
            let filename = null;
            let file_name = null;

            // Handle user message content - could be string or JSON
            if (isUser && typeof content === "string") {
                try {
                    const parsed = JSON.parse(content);
                    if (parsed && typeof parsed === "object") {
                        if (parsed.message) content = parsed.message;
                        if (parsed.file_id) file_id = parsed.file_id;
                        if (parsed.filename) filename = parsed.filename;
                        if (parsed.file_name) file_name = parsed.file_name;
                    }
                } catch (e) {
                    // If parsing fails, content is already a string, use it as is
                }
            }

            // Preserve original message structure and add display fields
            return {
                // Original API fields
                ...msg,
                // Display fields
                id: msg.id || msg.message_id || uuidv4(),
                isUser,
                content: content || "",
                sender: isUser ? "User" : "Ecosystem.ai",
                time: msg?.message_at ? formatTimeAgo(new Date(msg.message_at)) : (msg?.created_at ? formatTimeAgo(new Date(msg.created_at)) : `${t("seo.just_now")}`),
                timestamp: msg?.message_at ? new Date(msg.message_at) : (msg?.created_at ? new Date(msg.created_at) : new Date()),
                status: "Read",
                // File attachments
                ...(file_id && { file_id }),
                ...(filename && { filename }),
                ...(file_name && { file_name }),
                ...(msg.file_id && { file_id: msg.file_id }),
                ...(msg.filename && { filename: msg.filename }),
                ...(msg.file_name && { file_name: msg.file_name }),
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
                // Show success toast
                const deletedChat = chatList.find(chat => chat.id === id || chat.chat_id === id)
                const chatName = deletedChat?.name || 'conversation'
                setToast({
                    open: true,
                    type: 'success',
                    title: 'Conversation Deleted Successfully',
                    description: `Your conversation "${chatName}" has been deleted.`,
                    highlightText: chatName
                })
            } else {
                // Show error toast
                setToast({
                    open: true,
                    type: 'error',
                    title: 'Delete Failed',
                    description: 'We couldn\'t delete the conversation. Please try again.',
                })
            }
        } catch (error) {
            console.log(error)
            // Show error toast
            setToast({
                open: true,
                type: 'error',
                title: 'Delete Failed',
                description: 'We couldn\'t delete the conversation. Please try again.',
            })
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
            console.log("API Response:", response.data)
            if (response.status === 200) {
                const apiMessages = response?.data?.success || response?.data || [];
                console.log("Raw API Messages:", apiMessages)
                const data = transformApiMessages(apiMessages)
                console.log("Transformed Messages:", data)
                setMessages(data)
            } else {
                console.error("Failed to fetch chat history:", response)
                setMessages([])
            }
        } catch (error) {
            console.error("Error fetching chat history:", error)
            setMessages([])
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
        // Show Generated Results if flag is set
        if (showGeneratedResults && generatedContentData) {
            return (
                <GeneratedResultsView
                    generatedContent={generatedContentData}
                    onCancel={() => {
                        setShowGeneratedResults(false);
                        setGeneratedContentData(null);
                        setActiveSidebarItem("creation_studio");
                    }}
                />
            );
        }

        switch (activeSidebarItem) {
            case "creation_studio":
                return (
                    <div className="p-12 w-full h-full flex flex-col gap-3 sm:gap-4 lg:gap-6">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0">
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <h1 className="text-[#1E1E1E] text-[20px] sm:text-[24px] lg:text-[24px] font-[600]">
                                    {t("constance.creation_studio") || "Creation Studio"}
                                </h1>
                                <p className="text-[#5A687C] text-[14px] sm:text-[15px] lg:text-[16px] font-[400]">
                                    {"Create, manage, and schedule content effortlessly using AI-powered creativity."}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCreationStudioModal(true)}
                                className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-[#675FFF] cursor-pointer text-white px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-lg font-[500] text-xs sm:text-sm hover:bg-[#5a4fe6] transition-colors whitespace-nowrap w-full sm:w-auto"
                            >
                                <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span>{t("constance.add_creation_studio") || "Add Creation Studio"}</span>
                            </button>
                        </div>

                        {/* Recent Creations Section */}
                        <div className="flex flex-col gap-3 sm:gap-4 w-full">
                            <h2 className="text-[#1E1E1E] text-[18px] sm:text-[19px] lg:text-[20px] font-[600]">Recent Creations</h2>

                            {/* Grid of Creation Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
                                {[1, 2, 3, 4, 5, 6].map((item, index) => {
                                    const isEven = index % 2 === 0;
                                    const cardImage = isEven ? dummy1 : dummy2;
                                    const dropdownId = `dropdown-${index}`;

                                    return (
                                        <div
                                            key={index}
                                            className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            {/* Thumbnail Image with rounded top corners */}
                                            <div className="w-full min-h-[80px] sm:min-h-[100px] overflow-hidden bg-gray-100 rounded-xl sm:rounded-2xl">
                                                <img
                                                    src={cardImage}
                                                    alt="Creation thumbnail"
                                                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl p-1.5 sm:p-2 bg-white"
                                                />
                                            </div>


                                            {/* Card Content - White background */}
                                            <div className="bg-white p-3 sm:p-4 rounded-b-lg sm:rounded-b-xl relative">
                                                <div className="flex items-start justify-between gap-2 sm:gap-3">
                                                    <div className="flex-1 min-w-0 ">
                                                        <h3 className="text-[#1E1E1E] text-base sm:text-lg font-[500] mb-1 sm:mb-1.5 leading-tight py-1 sm:py-2">
                                                            Summer Promo Video
                                                        </h3>
                                                        <p className="text-[#5A687C] text-[12px] sm:text-[13px] lg:text-[14px] font-[400]">
                                                            Reels • Video
                                                        </p>
                                                    </div>

                                                    {/* Three Dots Menu - Bottom Right */}
                                                    <div className="relative dropdown-container flex-shrink-0 border border-gray-200 rounded-lg sm:rounded-xl">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
                                                            }}
                                                            className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors cursor-pointer"
                                                        >
                                                            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                                        </button>

                                                        {/* Dropdown Menu */}
                                                        {activeDropdown === dropdownId && (
                                                            <div className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[100px] sm:min-w-[120px] z-50">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        console.log("Edit clicked for item", index);
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                    className="w-full flex cursor-pointer items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-[#F2F2F7] transition-colors text-left"
                                                                >
                                                                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                                                                    <span className="text-xs sm:text-sm text-gray-700">Edit</span>
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        console.log("Delete clicked for item", index);
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                    className="w-full flex cursor-pointer items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-[#F2F2F7] transition-colors text-left"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                                                                    <span className="text-xs sm:text-sm text-red-600">Delete</span>
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
            case "scheduler":
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
            <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} ><MoreVertical size={24} color='#1e1e1e' /></div>
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
                        <div className="bg-[#ffffff] lg:w-[232px] w-full mb-2 flex flex-col gap-3 px-[12px] py-[10px] border-b border-gray-200">
                        <div className="flex gap-3">
                            <div className="flex justify-center items-center">
                                <div className="w-12 h-12 rounded-full bg-[#FFE4C5] flex items-center justify-center">
                                    <img
                                        src={constanceImg}
                                        alt="constance"
                                        className="w-10 h-10 object-contain scale-115"
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

                        {/* Watch Tutorial Button */}
                        <button
                            onClick={() => {
                                console.log("Watch Tutorial clicked");
                            }}
                                className="w-full flex items-center justify-center gap-2 px-2 py-2 bg-white border border-[#E1E4EA] rounded-xl text-[#1E1E1E] font-[600] text-sm hover:bg-[#F8F9FB] transition-colors cursor-pointer"
                        >
                            <img src={TutorialPlay} className="w-4 h-4" />
                            <span className='text-md font-md'>{t("watch_tutorial") || "Watch Tutorial"}</span>
                        </button>

                            <hr className='border border-transparent w-full' />
                        </div>

                        {sideMenuList.map((e, i) => {
                            const isActive = activeSidebarItem === e.path;
                            return (
                                <div
                                    key={i}
                                    onClick={() => {
                                        handleTabChange(e.path);
                                    }}
                                    className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${isActive ? "bg-[#E9E8F9]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                        }`}
                                >
                                    {isActive ? (
                                        e.iconActive
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="group-hover:hidden">{e.iconInactive}</div>
                                            <div className="hidden group-hover:block">{e.iconActive}</div>
                                        </div>
                                    )}
                                    <span className={`font-[400] text-[16px] ${isActive ? "text-[#000000]" : "text-[#000000] group-hover:text-[#1E1E1E]"}`}>
                                        {e.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full overflow-x-hidden pr-0 py-8 pl-3 lg:pl-[290px] lg:pr-4 lg:py-3">
                    {renderMainContent()}
                </div>
            </div>

            {/* Creation Studio Modal */}
            {showCreationStudioModal && (
                <CreationStudio
                    onClose={() => setShowCreationStudioModal(false)}
                    onGenerateContent={(contentData) => {
                        setGeneratedContentData(contentData);
                        setShowGeneratedResults(true);
                        setShowCreationStudioModal(false);
                        setActiveSidebarItem("creation_studio");
                    }}
                />
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
                            {sideMenuList.map((e, i) => {
                                const isActive = activeSidebarItem === e.path;
                                return (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            handleTabChange(e.path);
                                            setSideBarStatus(false);
                                        }}
                                        className={`flex group justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded cursor-pointer ${isActive ? "bg-[#F0EFFF]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                            }`}
                                    >
                                        {isActive ? (
                                            e.iconActive
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="group-hover:hidden">{e.iconInactive}</div>
                                                <div className="hidden group-hover:block">{e.iconActive}</div>
                                            </div>
                                        )}
                                        <span className={`font-[400] text-[16px] ${isActive ? "text-[#675FFF]" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                                            {e.label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
            {/* Toast Modal */}
            <ToastModal
                open={toast.open}
                type={toast.type}
                title={toast.title}
                description={toast.description}
                highlightText={toast.highlightText}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </div>
    )
}

export default ContentCreation
