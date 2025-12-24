import { useEffect, useRef, useState } from 'react'
import { ArticleIcon, AuditIcon, AutomationIcon, ConversationIcon, LeftArrow } from '../../icons/icons'
import emileImg from "../../assets/svg/emile_logo.svg"
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from 'react-router-dom'
import sandroMsgLogo from '../../assets/svg/sandro_msg_logo.svg'
import HomeGrid from "../../assets/svg/DashboardGrey.svg"
import { v4 as uuidv4 } from 'uuid';
import { deleteSeoChat, getSeoChatById, getSeoChats, updateSeoChatName } from '../../api/seoAgent'
import SeoArticles from '../../components/SeoArticles'
import SeoAudit from '../../components/SeoAudit'
import SeoAutomation from '../../components/SeoAutomation'
import Product from '../../components/Product'
import CitationAnalytics from '../../components/CitationAnalytics'
import ContentAnalytics from '../../components/ContentAnalytics'
import PromptAnalytics from '../../components/PromptAnalytics'
import { formatTimeAgo } from '../../utils/TimeFormat'
import { Archive, X, BarChart3, AtSign, FileText, PieChart, ChevronUp, BarChartIcon, ChartColumnBig, ArrowUp, FolderDown, Upload, Search, EllipsisVertical } from 'lucide-react'
import ChatgptLogo from '../../assets/svg/Chatgpt.svg'
import GeminiLogo from '../../assets/svg/Gemini.svg'
import DeepseekLogo from '../../assets/svg/Deepseek.svg'
import PerplexityLogo from '../../assets/svg/Perplexity.svg'
import chatInstance from '../../api/chatInstance'
import { useDispatch, useSelector } from 'react-redux'
import { discardSkillsData } from '../../store/agentSkillsSlice'
import TutorialPlay from '../../assets/svg/WatchTutorialGrey.svg'
import ProductActive from '../../assets/svg/ProductActive.svg'
import DashboardActive from '../../assets/svg/Home Grid.svg'
import DashboardInactive from '../../assets/svg/DashboardGrey.svg'
import CitationActive from '../../assets/svg/CitationActive.svg'
import CitationInactive from '../../assets/svg/CitationInactive.svg'
import PromptActive from '../../assets/svg/PromptActive.svg'
import PromptInactive from '../../assets/svg/PromptInactive.svg'
import ContentActive from '../../assets/svg/ContentActive.svg'
import ContentInactive from '../../assets/svg/ContentInactive.svg'
import PromptsActive from '../../assets/svg/PromptsActive.svg'
import Prompts from '../../assets/svg/Prompts.svg'
import GeoAnalytics from '../../assets/svg/GeoAnalytics.svg'

function Seo() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { t } = useTranslation();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    // Get tab from URL query param, default to "product"
    const tabFromUrl = searchParams.get('tab') || 'product'
    // Default sidebar tab set to product
    const [activeSidebarItem, setActiveSidebarItem] = useState(tabFromUrl)
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
    const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(true)
    const [promptSearchQuery, setPromptSearchQuery] = useState('')
    const [selectedPromptRows, setSelectedPromptRows] = useState([])
    const socketRef = useRef(null)
    const socket2Ref = useRef(null)
    const newwebsocketurl = `${chatInstance}/new-seo-agent-chat`
    const websocketurl = `${chatInstance}/seo-agent`
    const initialMessage = "Hi there! I'm Sandro, your SEO Expert. \nI'm here to help you boost your website's visibility, generate high-quality traffic, and improve your search engine rankings — all automatically. \nI can research keywords, optimize blog posts, create SEO-friendly content, and publish directly to your CMS like WordPress, Wix, or Shopify. \nWant to start ranking higher on Google without lifting a finger? Just tell me your goal, and I'll take it from there. \nReady to grow your traffic? 🚀"

    // Model logo mapping
    const modelLogos = {
        'Chatgpt': ChatgptLogo,
        'Gemini': GeminiLogo,
        'Deepseek': DeepseekLogo,
        'Perplexity': PerplexityLogo,
    };

    // Dummy prompts data
    const prompts = [
        {
            id: 1,
            text: 'Comment puis-je automatiser la prospection et le suivi des leads en intégrant mes outils existants...',
            models: ['Chatgpt', 'Gemini', 'Perplexity'],
            created: '27 Mar 2025'
        },
        {
            id: 2,
            text: 'Comment puis-je automatiser la génération de leads, la prospection et l\'envoi d\'emails en intégran...',
            models: ['Chatgpt', 'Gemini', 'Perplexity'],
            created: '26 Mar 2025'
        },
        {
            id: 3,
            text: 'Comment puis-je automatiser la prospection, la génération de leads et la création de contenu en I...',
            models: ['Chatgpt', 'Gemini', 'Perplexity'],
            created: '20 Mar 2025'
        },
        {
            id: 4,
            text: 'Comment puis-je automatiser la prospection et le suivi des leads en intégrant mes outils existants...',
            models: ['Chatgpt', 'Gemini', 'Perplexity'],
            created: '18 Mar 2025'
        },
        {
            id: 5,
            text: 'Comment puis-je automatiser la génération de leads, la prospection et l\'envoi d\'emails en intégran...',
            models: ['Chatgpt', 'Gemini', 'Perplexity'],
            created: '16 Mar 2025'
        },
        {
            id: 6,
            text: 'Comment puis-je automatiser la prospection, la génération de leads et la création de contenu en I...',
            models: ['Chatgpt', 'Gemini', 'Perplexity'],
            created: '16 Mar 2025'
        },
        {
            id: 7,
            text: 'Comment puis-je automatiser la prospection et le suivi des leads en intégrant mes outils existants...',
            models: ['Chatgpt', 'Gemini', 'Perplexity'],
            created: '16 Mar 2025'
        },
        {
            id: 8,
            text: 'Comment puis-je automatiser la génération de leads, la prospection et l\'envoi d\'emails en intégran...',
            models: ['Chatgpt', 'Gemini', 'Perplexity'],
            created: '16 Mar 2025'
        },
        {
            id: 9,
            text: 'Comment puis-je automatiser la prospection, la génération de leads et la création de contenu en I...',
            models: ['Chatgpt', 'Gemini', 'Perplexity'],
            created: '16 Mar 2025'
        }
    ];

    const handleSelectPromptRow = (id) => {
        setSelectedPromptRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const handleSelectAllPrompts = () => {
        if (selectedPromptRows.length === prompts.length) {
            setSelectedPromptRows([]);
        } else {
            setSelectedPromptRows(prompts.map((p) => p.id));
        }
    };

    const allPromptsSelected = prompts.length > 0 && selectedPromptRows.length === prompts.length;

    const sideMenuList = [
        // First tab Product
        {
            label: t("product") || "Product",
            path: "product",
            iconActive: <img src={ProductActive} alt="Product" className="w-5 h-5" />,
            iconInactive: <img src={ProductActive} alt="Product" className="w-5 h-5" />,
        },
        // Second tab Dashboard
        {
            label: t("dashboard") || "Dashboard",
            path: "articles",
            iconActive: <img src={DashboardActive} alt="Dashboard" className="w-5 h-5" />,
            iconInactive: <img src={DashboardInactive} alt="Dashboard" className="w-5 h-5"/>,
        },
    ]


    const activeTab = useSelector((state) => state.skills)

    // Helper to update URL param for active tab (state follows URL)
    const handleTabChange = (tabPath) => {
        setSearchParams({ tab: tabPath }, { replace: true });
    };

    // Initialize URL with default tab if not present on mount
    useEffect(() => {
        if (!searchParams.get("tab")) {
            setSearchParams({ tab: "product" }, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync active tab with URL query param when URL changes (URL is source of truth)
    useEffect(() => {
        const tabFromUrl = searchParams.get("tab") || "product";
        if (tabFromUrl === 'product' || tabFromUrl === 'articles' || tabFromUrl === 'prompts' || tabFromUrl === 'citation-analytics' || tabFromUrl === 'prompt-analytics' || tabFromUrl === 'content-analytics') {
            setActiveSidebarItem(tabFromUrl);
            // Auto-expand Analytics if one of its tabs is active
            if (tabFromUrl === 'citation-analytics' || tabFromUrl === 'prompt-analytics' || tabFromUrl === 'content-analytics') {
                setIsAnalyticsExpanded(true);
            }
        }
    }, [searchParams]);

    // Handle Redux activeTab changes (only on initial load or when URL has no tab)
    useEffect(() => {
        // Only sync from Redux if URL doesn't have a tab param (initial load scenario)
        const currentTab = searchParams.get('tab')
        if (!currentTab && activeTab.label !== null && (activeTab.label === 'product' || activeTab.label === 'articles' || activeTab.label === 'prompts' || activeTab.label === 'citation-analytics' || activeTab.label === 'prompt-analytics' || activeTab.label === 'content-analytics')) {
            setSearchParams({ tab: activeTab.label }, { replace: true })
        }
    }, [activeTab.loading, activeTab.label, searchParams, setSearchParams])

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
            case "product":
                return <Product />
            case "articles":
                return <SeoArticles />
            case "prompts":
                return (
                    <div className="p-12 flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-2xl font-[600] text-[#1E1E1E]">{t("geo.prompts")}</h2>
                                <p className="text-sm text-[#5A687C]">
                                    {t("geo.simulate_conversations_with_ai_models_across_different_platforms")}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-sm font-[500] text-[#1E1E1E] hover:bg-[#F8F9FB] transition-colors cursor-pointer">
                                    <Upload className="w-4 h-4" />
                                    {t("geo.export_all")}
                                </button>
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-sm font-[500] text-[#1E1E1E] hover:bg-[#F8F9FB] transition-colors cursor-pointer">
                                    <FolderDown className="w-4 h-4" />
                                    {t("geo.import")}
                                </button>
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#675FFF] text-white rounded-lg text-sm font-[400] hover:bg-[#594edb] transition-colors cursor-pointer">
                                    <span className="text-lg leading-none">+</span>
                                    {t("geo.add_prompt")}
                                </button>
                            </div>
                        </div>
                        
                        {/* Search and Sort Section */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#F7F7F8] px-4 pt-4 rounded-lg">
                            <p className="text-sm text-[#5A687C]">{t("geo.sorted_by_created_date_newest_first")}</p>
                            <div className="relative w-full sm:w-auto sm:min-w-[270px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A687C] w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder={t("geo.search_name_or_phone_number")}
                                    value={promptSearchQuery}
                                    onChange={(e) => setPromptSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-[#E1E4EA] rounded-lg bg-white focus:outline-none focus:border-[#675FFF] text-sm text-[#1E1E1E] placeholder:text-[#5A687C]"
                                />
                            </div>
                        </div>

                        {/* Prompts Table */}
                        <div className="rounded-2xl border border-[#D6D6D6] overflow-auto mb-2 w-full">
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-separate border-spacing-0">
                                    <thead className="bg-[#F7F7F8]">
                                        <tr className="text-[#5A687C]">
                                            <th className="px-6 text-start py-2 text-[16px] font-[400]">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={allPromptsSelected}
                                                        onChange={handleSelectAllPrompts}
                                                        className="w-4 h-4 border border-[#D6D6D6] rounded cursor-pointer"
                                                    />
                                                    <span>{t("geo.cited_sources")}</span>
                                                </div>
                                            </th>
                                            <th className="px-3 text-start py-2 text-[16px] font-[400]">{t("geo.models")}</th>
                                            <th className="px-3 text-start py-2 text-[16px] font-[400]">{t("geo.created")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">
                                        {prompts.map((prompt) => (
                                            <tr key={prompt.id} className="text-[16px] text-[#1E1E1E]">
                                                <td className="px-6 py-2 text-[16px] text-[#1E1E1E] text-start">
                                                    <div className="flex items-start gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPromptRows.includes(prompt.id)}
                                                            onChange={() => handleSelectPromptRow(prompt.id)}
                                                            className="mt-1 w-4 h-4 border border-[#D6D6D6] rounded cursor-pointer flex-shrink-0"
                                                        />
                                                        <span className="text-[#1E1E1E]">{prompt.text}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-[16px] text-start">
                                                    <div className="flex items-center gap-1">
                                                        {prompt.models.map((model, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={modelLogos[model]}
                                                                alt={model}
                                                                className="w-5 h-5 rounded-full"
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-[16px] text-start">{prompt.created}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between bg-[#F7F7F8] px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white opacity-50 cursor-not-allowed">
                                        ‹ {t("geo.prev")}
                                    </button>
                                    <button className="bg-[#675FFF] text-white rounded-lg px-3 py-1 text-sm cursor-pointer">
                                        1
                                    </button>
                                    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer">
                                        2
                                    </button>
                                    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer">
                                        3
                                    </button>
                                    <span className="text-[#000000] text-sm">…</span>
                                    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer">
                                        10
                                    </button>
                                    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer">
                                        {t("geo.next")} ›
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#5A687C]">
                                    <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] bg-white cursor-pointer">5 {t("geo.rows")}</button>
                                    <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] hover:bg-white cursor-pointer">10</button>
                                    <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] hover:bg-white cursor-pointer">20</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "citation-analytics":
                return <CitationAnalytics />
            case "prompt-analytics":
                return <PromptAnalytics />
            case "content-analytics":
                return <ContentAnalytics />
            case "audit":
                return <SeoAudit />
            case "automation":
                return <SeoAutomation />
            default:
                return <Product />
        }
    }
    return (
        <div className="h-full w-full relative">
            <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} ><EllipsisVertical size={24} color='#1e1e1e' /></div>
            <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full mt-2">
                {/* Sidebar */}
                <div className="lg:flex hidden flex-col bg-white gap-4 border-t border-r border-b border-l border-[#D6D6D6] min-w-[272px] rounded-r-2xl rounded-tl-none rounded-bl-none fixed h-[calc(100vh-89px)] mb-8 overflow-y-auto">
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
                        <div className="bg-[#ffffff] lg:w-[232px] w-full mb-2 flex flex-col gap-3 px-[12px] py-[10px] border-b border-gray-200">
                            <div className="flex gap-3">
                                <div className="flex justify-center items-center">
                                    <div className="w-12 h-12 rounded-full bg-[#FFE4C5] flex items-center justify-center">
                                        <img
                                            src={emileImg}
                                            alt="georgio"
                                            className="w-10 h-10 object-contain scale-115"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-[#1E1E1E] text-[16px] font-[600]">
                                        {t("seo.georgio")}
                                    </h1>
                                    <p className="text-[#5A687C] text-[14px] font-[400]">
                                        GEO
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
                                    onClick={() => handleTabChange(e.path)}
                                    className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${isActive ? "bg-[#E9E8F9]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                        }`}
                                >
                                    {isActive ? (
                                        e.iconActive
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className='group-hover:hidden'>{e.iconInactive}</div>
                                            <div className='hidden group-hover:block'>{e.iconActive}</div>
                                        </div>
                                    )}
                                    <span className={`font-[400] text-[16px] ${isActive ? "text-[#000000]" : "text-[#000000] group-hover:text-[#1E1E1E]"}`}>
                                        {e.label}
                                    </span>
                                </div>
                            )
                        })}

                        {/* Analytics Section */}
                        <div className="w-full">
                            {/* Analytics Header */}
                            <div
                                onClick={() => setIsAnalyticsExpanded(!isAnalyticsExpanded)}
                                className="flex justify-between items-center px-2 py-2 cursor-pointer hover:bg-[#F9F8FF] rounded-2xl transition-colors"
                            >
                                <div className="flex items-center gap-1.5">
                                    <img 
                                        src={GeoAnalytics} 
                                        alt="Analytics" 
                                        className="w-5 h-5"
                                    />
                                    <span className="font-[400] text-[16px] text-[#000000]">
                                        {t("seo.analytics")}
                                    </span>
                                </div>
                                <ChevronUp 
                                    className={`w-4 h-4 text-[#5A687C] transition-transform duration-200 ${isAnalyticsExpanded ? '' : 'rotate-180'}`} 
                                />
                            </div>

                            {/* Analytics Sub-tabs */}
                            {isAnalyticsExpanded && (
                                <div className="ml-6 mt-1 space-y-1">
                                    {/* Citation Analytics */}
                                    <div
                                        onClick={() => handleTabChange('citation-analytics')}
                                        className={`flex items-center gap-1.5 px-2 py-2 rounded-xl cursor-pointer transition-colors ${
                                            activeSidebarItem === 'citation-analytics'
                                                ? 'bg-[#E9E8F9]'
                                                : 'hover:bg-[#F9F8FF]'
                                        }`}
                                    >
                                        {activeSidebarItem === 'citation-analytics' ? (
                                            <img src={CitationActive} alt="Citation Analytics" className="w-5 h-5" />
                                        ) : (
                                            <img src={CitationInactive} alt="Citation Analytics" className="w-5 h-5" />
                                        )}
                                        <span className={`font-[400] text-[16px] ${activeSidebarItem === 'citation-analytics' ? 'text-[#000000]' : 'text-[#000000]'}`}>
                                            {t("seo.citation_analytics")}
                                        </span>
                                    </div>

                                    {/* Prompt Analytics */}
                                    <div
                                        onClick={() => handleTabChange('prompt-analytics')}
                                        className={`flex items-center gap-1.5 px-2 py-2 rounded-xl cursor-pointer transition-colors ${
                                            activeSidebarItem === 'prompt-analytics'
                                                ? 'bg-[#E9E8F9]'
                                                : 'hover:bg-[#F9F8FF]'
                                        }`}
                                    >
                                        {activeSidebarItem === 'prompt-analytics' ? (
                                            <img src={PromptActive} alt="Prompt Analytics" className="w-5 h-5" />
                                        ) : (
                                            <img src={PromptInactive} alt="Prompt Analytics" className="w-5 h-5" />
                                        )}
                                        <span className={`font-[400] text-[16px] ${activeSidebarItem === 'prompt-analytics' ? 'text-[#000000]' : 'text-[#000000]'}`}>
                                            {t("seo.prompt_analytics")}
                                        </span>
                                    </div>

                                    {/* Content Analytics */}
                                    <div
                                        onClick={() => handleTabChange('content-analytics')}
                                        className={`flex items-center gap-1.5 px-2 py-2 rounded-xl cursor-pointer transition-colors ${
                                            activeSidebarItem === 'content-analytics'
                                                ? 'bg-[#E9E8F9]'
                                                : 'hover:bg-[#F9F8FF]'
                                        }`}
                                    >
                                        {activeSidebarItem === 'content-analytics' ? (
                                            <img src={ContentActive} alt="Content Analytics" className="w-5 h-5" />
                                        ) : (
                                            <img src={ContentInactive} alt="Content Analytics" className="w-5 h-5" />
                                        )}
                                        <span className={`font-[400] text-[16px] ${activeSidebarItem === 'content-analytics' ? 'text-[#000000]' : 'text-[#000000]'}`}>
                                            {t("seo.content_analytics")}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Prompts Tab */}
                        <div
                            onClick={() => handleTabChange('prompts')}
                            className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === 'prompts' ? "bg-[#E9E8F9]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                }`}
                        >
                            {activeSidebarItem === 'prompts' ? (
                                <img src={PromptsActive} alt="Prompts" className="w-5 h-5" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className='group-hover:hidden'>
                                        <img src={Prompts} alt="Prompts" className="w-5 h-5" />
                                    </div>
                                    <div className='hidden group-hover:block'>
                                        <img src={PromptsActive} alt="Prompts" className="w-5 h-5" />
                                    </div>
                                </div>
                            )}
                            <span className={`font-[400] text-[16px] ${activeSidebarItem === 'prompts' ? "text-[#000000]" : "text-[#000000] group-hover:text-[#1E1E1E]"}`}>
                                {t("seo.prompts")}
                            </span>
                        </div>
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
                            <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-full min-w-[232px] flex flex-col gap-3 mb-5 p-[12px] rounded-[9px]">
                                <div className="flex gap-3">
                                    <div className="flex justify-center items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#FFE4C5] flex items-center justify-center">
                                            <img
                                                src={emileImg}
                                                alt="georgio"
                                                className="w-8 h-8 object-contain scale-115"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-[#1E1E1E] text-[16px] font-[600]">
                                            {t("seo.georgio")}
                                        </h1>
                                        <p className="text-[#5A687C] text-[14px] font-[400]">
                                            GEO
                                        </p>
                                    </div>
                                </div>
                                {/* Watch Tutorial Button */}
                                <button
                                    onClick={() => {
                                        console.log("Watch Tutorial clicked");
                                        setSideBarStatus(false);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-2 py-2 bg-white border border-[#E1E4EA] rounded-xl text-[#1E1E1E] font-[600] text-sm hover:bg-[#F8F9FB] transition-colors cursor-pointer"
                                >
                                    <img src={TutorialPlay} className="w-4 h-5" />
                                    <span className='text-md font-md'>{t("watch_tutorial") || "Watch Tutorial"}</span>
                                </button>
                            </div>

                            {sideMenuList.map((e, i) => {
                                const isActive = activeSidebarItem === e.path;
                                return (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            handleTabChange(e.path)
                                            setSideBarStatus(false)
                                        }}
                                        className={`flex group justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${isActive ? "bg-[#E9E8F9]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                            }`}
                                    >
                                        {isActive ? (
                                            e.iconActive
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className='group-hover:hidden'>{e.iconInactive}</div>
                                                <div className='hidden group-hover:block'>{e.iconActive}</div>
                                            </div>
                                        )}
                                        <span className={`font-[400] text-[16px] ${isActive ? "text-[#675FFF]" : "text-[#5A687C] group-hover:text-[#1E1E1E]"}`}>
                                            {e.label}
                                        </span>
                                    </div>
                                )
                            })}

                            {/* Analytics Section - Mobile */}
                            <div className="w-full mt-2">
                                {/* Analytics Header */}
                                <div
                                    onClick={() => setIsAnalyticsExpanded(!isAnalyticsExpanded)}
                                    className="flex justify-between items-center px-2 py-2 cursor-pointer hover:bg-[#F9F8FF] rounded-2xl transition-colors"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <img 
                                            src={GeoAnalytics} 
                                            alt="Analytics" 
                                            className="w-5 h-5"
                                        />
                                        <span className="font-[400] text-[16px] text-[#000000]">
                                            Analytics
                                        </span>
                                    </div>
                                    <ChevronUp 
                                        className={`w-4 h-4 text-[#5A687C] transition-transform duration-200 ${isAnalyticsExpanded ? '' : 'rotate-180'}`} 
                                    />
                                </div>

                                {/* Analytics Sub-tabs */}
                                {isAnalyticsExpanded && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {/* Citation Analytics */}
                                        <div
                                            onClick={() => {
                                                handleTabChange('citation-analytics')
                                                setSideBarStatus(false)
                                            }}
                                            className={`flex items-center gap-1.5 px-2 py-2 rounded-xl cursor-pointer transition-colors ${
                                                activeSidebarItem === 'citation-analytics'
                                                    ? 'bg-[#E9E8F9]'
                                                    : 'hover:bg-[#F9F8FF]'
                                            }`}
                                        >
                                            {activeSidebarItem === 'citation-analytics' ? (
                                                <img src={CitationActive} alt="Citation Analytics" className="w-5 h-5" />
                                            ) : (
                                                <img src={CitationInactive} alt="Citation Analytics" className="w-5 h-5" />
                                            )}
                                            <span className={`font-[400] text-[16px] ${activeSidebarItem === 'citation-analytics' ? 'text-[#675FFF]' : 'text-[#5A687C]'}`}>
                                                Citation Analytics
                                            </span>
                                        </div>

                                        {/* Prompt Analytics */}
                                        <div
                                            onClick={() => {
                                                handleTabChange('prompt-analytics')
                                                setSideBarStatus(false)
                                            }}
                                            className={`flex items-center gap-1.5 px-2 py-2 rounded-xl cursor-pointer transition-colors ${
                                                activeSidebarItem === 'prompt-analytics'
                                                    ? 'bg-[#E9E8F9]'
                                                    : 'hover:bg-[#F9F8FF]'
                                            }`}
                                        >
                                            {activeSidebarItem === 'prompt-analytics' ? (
                                                <img src={PromptActive} alt="Prompt Analytics" className="w-5 h-5" />
                                            ) : (
                                                <img src={PromptInactive} alt="Prompt Analytics" className="w-5 h-5" />
                                            )}
                                            <span className={`font-[400] text-[16px] ${activeSidebarItem === 'prompt-analytics' ? 'text-[#675FFF]' : 'text-[#5A687C]'}`}>
                                                Prompt Analytics
                                            </span>
                                        </div>

                                        {/* Content Analytics */}
                                        <div
                                            onClick={() => {
                                                handleTabChange('content-analytics')
                                                setSideBarStatus(false)
                                            }}
                                            className={`flex items-center gap-1.5 px-2 py-2 rounded-xl cursor-pointer transition-colors ${
                                                activeSidebarItem === 'content-analytics'
                                                    ? 'bg-[#E9E8F9]'
                                                    : 'hover:bg-[#F9F8FF]'
                                            }`}
                                        >
                                            {activeSidebarItem === 'content-analytics' ? (
                                                <img src={ContentActive} alt="Content Analytics" className="w-5 h-5" />
                                            ) : (
                                                <img src={ContentInactive} alt="Content Analytics" className="w-5 h-5" />
                                            )}
                                            <span className={`font-[400] text-[16px] ${activeSidebarItem === 'content-analytics' ? 'text-[#675FFF]' : 'text-[#5A687C]'}`}>
                                                Content Analytics
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Prompts Tab - Mobile */}
                            <div
                                onClick={() => {
                                    handleTabChange('prompts')
                                    setSideBarStatus(false)
                                }}
                                className={`flex items-center gap-1.5 px-2 py-2 rounded-xl cursor-pointer transition-colors mt-2 ${
                                    activeSidebarItem === 'prompts'
                                        ? 'bg-[#E9E8F9]'
                                        : 'hover:bg-[#F9F8FF]'
                                }`}
                            >
                                {activeSidebarItem === 'prompts' ? (
                                    <img src={PromptsActive} alt="Prompts" className="w-5 h-5" />
                                ) : (
                                    <img src={Prompts} alt="Prompts" className="w-5 h-5" />
                                )}
                                <span className={`font-[400] text-[16px] ${activeSidebarItem === 'prompts' ? 'text-[#675FFF]' : 'text-[#5A687C]'}`}>
                                    {t("seo.prompts")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Seo
