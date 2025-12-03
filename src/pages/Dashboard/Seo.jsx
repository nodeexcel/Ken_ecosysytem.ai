import { useEffect, useRef, useState } from 'react'
import { ArticleIcon, AuditIcon, AutomationIcon, ConversationIcon, LeftArrow } from '../../icons/icons'
import sandroImg from "../../assets/svg/sandro_logo.svg"
import { useNavigate } from 'react-router-dom'
import sandroMsgLogo from '../../assets/svg/sandro_msg_logo.svg'
import HomeGrid from "../../assets/svg/Home Grid.svg"
import { v4 as uuidv4 } from 'uuid';
import { deleteSeoChat, getSeoChatById, getSeoChats, updateSeoChatName } from '../../api/seoAgent'
import SeoArticles from '../../components/SeoArticles'
import SeoAudit from '../../components/SeoAudit'
import SeoAutomation from '../../components/SeoAutomation'
import { formatTimeAgo } from '../../utils/TimeFormat'
import { useTranslation } from "react-i18next";
import { BsThreeDots } from 'react-icons/bs'
import { X } from 'lucide-react'
import chatInstance from '../../api/chatInstance'
import { useDispatch, useSelector } from 'react-redux'
import { discardSkillsData } from '../../store/agentSkillsSlice'
import TutorialPlay from '../../assets/svg/WatchTutorial.svg'

function Seo() {
    // Default sidebar tab set to articles (shown as Dashboard in UI)
    const [activeSidebarItem, setActiveSidebarItem] = useState("articles")
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
    const newwebsocketurl = `${chatInstance}/new-seo-agent-chat`
    const websocketurl = `${chatInstance}/seo-agent`
    const initialMessage = "Hi there! I’m Sandro, your SEO Expert. \nI’m here to help you boost your website’s visibility, generate high-quality traffic, and improve your search engine rankings — all automatically. \nI can research keywords, optimize blog posts, create SEO-friendly content, and publish directly to your CMS like WordPress, Wix, or Shopify. \nWant to start ranking higher on Google without lifting a finger? Just tell me your goal, and I’ll take it from there. \nReady to grow your traffic? 🚀"
    const { t } = useTranslation();
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const sideMenuList = [
        // First tab: Dashboard (uses articles view)
        {
            label: t("dashboard") || "Dashboard",
            icon: <img src={HomeGrid} alt="dashboard" className="w-4 h-4" />,
            hoverIcon: <img src={HomeGrid} alt="dashboard" className="w-4 h-4" />,
            path: "articles"
        },
        // { label: `${t("seo.start_seo_automation")}`, icon: <AutomationIcon status={activeSidebarItem == "automation"} />, hoverIcon: <AutomationIcon hover={true} />, path: "automation" },
        // { label: `${t("seo.seo_audit")}`, icon: <AuditIcon status={activeSidebarItem == "audit"} />, hoverIcon: <AuditIcon hover={true} />, path: "audit" },
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
            const response = await getSeoChats()
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
            const response = await deleteSeoChat(id)
            if (response?.status === 200) {
                handleGetAccountChats(id)
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
            const response = await updateSeoChatName(editData?.chat_id, { name })
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
            const response = await getSeoChatById(id);
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

    const staticSuggestions = [{ label: `${t("seo.how_to_analyze")}`, key: `${t("seo.how_to_analyze_key")}` },
    { label: `${t("seo.need_a_template")}`, key: `${t("seo.need_a_template_key")}` },
    { label: `${t("seo.most_relevent_keyword")}`, key: `${t("seo.most_relevent_keyword_key")}` }
    ]

    const listedProps = {
        agentLogo: sandroMsgLogo,
        agentName: "Sandro",
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
        nameColor: "#C76FFF"
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
            case "articles":
                // Articles view used as Dashboard
                return <SeoArticles />
            case "audit":
                return <SeoAudit />
            case "automation":
                return <SeoAutomation />
            default:
                return <SeoArticles />
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
                            {/* <h1 className="text-[20px] font-[600]">{t("seo.seo_heading")}</h1>
                            </div> */}
                        </div>
                    </div>
                    <div className="flex flex-col w-full items-start gap-2 relative px-3">
                        <div className="bg-[#ffffff] w-full min-w-[232px] flex gap-3 p-[12px] rounded-[9px]">
                            <div className="flex justify-center items-center">
                                <div className="w-10 h-10 rounded-full bg-[#FFE4C5] flex items-center justify-center">
                                    <img
                                        src={sandroImg}
                                        alt="sandro"
                                        className="w-8 h-8 object-contain scale-115"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[#1E1E1E] text-[16px] font-[600]">
                                    {t("seo.georgio")}
                                </h1>
                                <p className="text-[#5A687C] text-[14px] font-[400]">
                                    {t("seo.seo_heading")}
                                </p>
                            </div>
                        </div>

                        {/* Watch Tutorial Button */}
                        <button
                            onClick={() => {
                                console.log("Watch Tutorial clicked");
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-[#E1E4EA] rounded-xl text-[#1E1E1E] font-[600] text-sm hover:bg-[#F8F9FB] transition-colors cursor-pointer mb-2"
                        >
                            <img src={TutorialPlay} className="w-5 h-5" />
                            <span>{t("watch_tutorial") || "Watch Tutorial"}</span>
                        </button>

                        {sideMenuList.map((e, i) => <div
                            key={i}
                            onClick={() => setActiveSidebarItem(e.path)}
                            className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === `${e.path}` ? "bg-[#E9E8F9]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                }`}
                        >
                            {activeSidebarItem === `${e.path}` ? e.icon :
                                <div className="flex items-center gap-2"><div className='group-hover:hidden'>{e.icon}</div> <div className='hidden group-hover:block'>{e.hoverIcon}</div></div>}
                            <span className={`font-[400] text-[16px] ${activeSidebarItem === `${e.path}` ? "text-[#000000]" : "text-[#000000] group-hover:text-[#1E1E1E]"}`}>
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
                                    <h1 className="text-[20px] font-[600]">{t("seo.seo_heading")}</h1>
                                </div>
                            </div>
                            <hr className='text-[#E1E4EA]' />
                        </div>
                        <div className="flex flex-col w-full items-start gap-2 relative px-5">
                            <div className="bg-[#ffffff] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                                <div className="flex justify-center items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#FFE4C5] flex items-center justify-center">
                                        <img
                                            src={sandroImg}
                                            alt="sandro"
                                            className="w-8 h-8 object-contain scale-115"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-[#1E1E1E] text-[16px] font-[600]">
                                        {t("seo.sandro")}
                                    </h1>
                                    <p className="text-[#5A687C] text-[14px] font-[400]">
                                        {t("seo.seo_heading")}
                                    </p>
                                </div>
                            </div>

                            {/* Watch Tutorial Button */}
                            <button
                                onClick={() => {
                                    console.log("Watch Tutorial clicked");
                                    setSideBarStatus(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-[#E1E4EA] rounded-xl text-[#1E1E1E] font-[600] text-sm hover:bg-[#F8F9FB] transition-colors cursor-pointer mb-2"
                            >
                                <div className="w-0 h-0 border-l-[6px] border-l-[#675FFF] border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
                                <span>{t("watch_tutorial") || "Watch Tutorial"}</span>
                            </button>

                            {sideMenuList.map((e, i) => <div
                                key={i}
                                onClick={() => {
                                    setActiveSidebarItem(e.path)
                                    setSideBarStatus(false)
                                }}
                                className={`flex group justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === `${e.path}` ? "bg-[#E9E8F9]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
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

export default Seo
