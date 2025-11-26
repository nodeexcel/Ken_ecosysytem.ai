import { useEffect, useRef, useState } from 'react'
import { AutomationIcon, CallAgent, ConversationIcon, EmailIcon, HelpIcon, LeftArrow, } from '../../icons/icons'
import calinaImg from "../../assets/svg/calina_logo.svg"
import { useNavigate } from 'react-router-dom'
import SmartChatbot from '../../components/CustomerSupportSmartChatbot'
// import FaqCustomerSupport from '../../components/FaqCustomerSupport'
// import UserGuideCustomerSupport from '../../components/UserGuideCustomerSupport'
// import EmailCustomerSupport from '../../components/EmailCustomerSupport'
import { BsThreeDots } from 'react-icons/bs'
import { X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { discardSkillsData } from '../../store/agentSkillsSlice'
import { useTranslation } from 'react-i18next'
import AgentChatBox from '../../components/AgentChatBox'
import rimaMsgLogo from '../../assets/svg/rima_msg_logo.svg'
import chatInstance from '../../api/chatInstance'
import { deleteCustomerSupportChat, getCustomerSupportChatById, getCustomerSupportChats, updateCustomerSupportChatName } from '../../api/customerSupport'
import { v4 as uuidv4 } from 'uuid';
import { formatTimeAgo } from '../../utils/TimeFormat'

function CustomerSupport() {
    const [activeSidebarItem, setActiveSidebarItem] = useState("chat")
    const [sidebarStatus, setSideBarStatus] = useState(false)
    const dispatch = useDispatch()
    const { t } = useTranslation()
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
    const socketRef = useRef(null)
    const socket2Ref = useRef(null)
    const newwebsocketurl = `${chatInstance}/new-customer-support-agent-chat`
    const websocketurl = `${chatInstance}/customer-support-agent`
    

    const navigate = useNavigate()
    const initialMessage = "Hello! I’m Calina, your Customer Support assistant. \nI’m here to support you across all your HR needs, from recruiting and screening candidates to onboarding, managing interviews, and beyond.\nI can also help you with day-to-day HR topics like policy clarification, employee onboarding support, FAQ responses, and internal coordination.\nJust tell me what you need, whether it's hiring your next top talent or streamlining your HR processes. and I’ll take care of it. \nReady to simplify your HR tasks and save time? Let’s get started 😊"
    const sideMenuList = [
         { label: `${t("seo.chat")}`, icon: <ConversationIcon status={activeSidebarItem == "chat"} />, hoverIcon: <ConversationIcon hover={true} />, path: "chat" },
        { label: t("calina.smart_chartbot"), icon: <AutomationIcon status={activeSidebarItem == "smart_bot"} />, hoverIcon: <AutomationIcon hover={true} />, path: "smart_bot" },
        // { label: t("skills.calina_content2_header"), icon: <HelpIcon status={activeSidebarItem == "faq_generator"} />, hoverIcon: <HelpIcon hover={true} />, path: "faq_generator" },
        // { label: t("skills.calina_content3_header"), icon: <CallAgent status={activeSidebarItem == "user_guide"} />, hoverIcon: <CallAgent hover={true} />, path: "user_guide" },
        // { label: t("skills.calina_content4_header"), icon: <EmailIcon status={activeSidebarItem == "email"} />, hoverIcon: <EmailIcon hover={true} />, path: "email" },
    ]

    const staticSuggestions = [{ label: `${t("calina.faq_generator")}`, key: `${t("calina.faq_generator_key")}`, agent_type:"faq_generator" },
    { label: `${t("calina.user_guide_prompt")}`, key: `${t("calina.user_guide_prompt_key")}` , agent_type:"user_guide" },
    { label: `${t("calina.quick_email_responder")}`, key: `${t("calina.quick_email_responder_key")}`, agent_type:"email_responder" }
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

    const handleGetAccountChats = async () => {
            setLoadingChatsList(true)
            try {
                const response = await getCustomerSupportChats()
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

    const handleDelete = async (id) => {
            try {
                const response = await deleteCustomerSupportChat(id)
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
                const response = await updateCustomerSupportChatName(editData?.chat_id, { name })
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
                const response = await getCustomerSupportChatById(id);
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

        const listedProps = {
            agentLogo: rimaMsgLogo,
            agentName: "Calina",
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
            nameColor: "#18A8D5"
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
            case "smart_bot":
                return <SmartChatbot />;
            // case "user_guide":
            //     return <UserGuideCustomerSupport />;
            // case "email":
            //     return <EmailCustomerSupport />;
            default:
                return <AgentChatBox listedProps={listedProps} />
                // return <EmailCustomerSupport />;
        }

        }

    return (
        <div className="h-full w-full relative">
            <div className="lg:hidden flex absolute top-4 right-4 z-[9999] cursor-pointer" onClick={() => setSideBarStatus(true)} ><BsThreeDots size={24} color='#1e1e1e' /></div>
            <div className="flex h-screen flex-col md:flex-row items-start gap-8 relative w-full mt-2">
                {/* Sidebar */}
                <div className="lg:flex hidden flex-col bg-white gap-4 border border-[#D6D6D6] min-w-[272px] rounded-r-2xl fixed h-[calc(100vh-86px)] mb-8 overflow-y-auto">
                    <div className=''>
                        <div className='flex justify-between items-center cursor-pointer w-fit' onClick={() => {
                            navigate("/dashboard")
                            stopTranscription()
                            dispatch(discardSkillsData())
                        }}>
                            {/* <div className="flex gap-4 pl-3 items-center h-[57px]"> */}
                                {/* <LeftArrow /> */}
                                {/* <h1 className="text-[20px] font-[600]">Customer Support</h1>
                            </div> */}
                        </div>
                    </div>
                    <div className="flex flex-col w-full items-start gap-2 relative px-3">
                        <div className="bg-[#ffffff] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                            <div className="flex justify-center items-center">
                                <img src={calinaImg} alt={"calina"} className="object-fit" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Calina</h1>
                                <p className="text-[#5A687C] text-[14px] font-[400]">Customer Support</p>
                            </div>
                        </div>
                        {sideMenuList.map((e, i) => <div
                            key={i}
                            onClick={() => setActiveSidebarItem(e.path)}
                            className={`flex justify-center group md:justify-start items-center gap-1.5 px-2 py-2 relative self-stretch w-full flex-[0_0_auto] rounded-2xl cursor-pointer ${activeSidebarItem === `${e.path}` ? "bg-[#E9E8F9]" : "text-[#5A687C] hover:bg-[#F9F8FF]"
                                }`}
                        >
                            {activeSidebarItem === `${e.path}` ? e.icon :
                                <div className="flex items-center gap-2 "><div className='group-hover:hidden'>{e.icon}</div> <div className='hidden group-hover:block '>{e.hoverIcon}</div></div>}
                            <span className={`font-[400] text-[16px] ${activeSidebarItem === `${e.path}` ? "text-[#675FFF]" : "text-[#5A687C] group-hover:text-[#1E1E1E] "}`}>
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
                                    <h1 className="text-[20px] font-[600]">Customer Support</h1>
                                </div>
                            </div>
                            <hr className='text-[#E1E4EA]' />
                        </div>
                        <div className="flex flex-col w-full items-start gap-2 relative px-5">
                            <div className="bg-[#F7F7FF] border border-[#E9E8FF] w-full min-w-[232px] flex gap-3 mb-5 p-[12px] rounded-[9px]">
                                <div className="flex justify-center items-center">
                                    <img src={calinaImg} alt={"calina"} className="object-fit" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-[#1E1E1E] text-[16px] font-[600]">Calina</h1>
                                    <p className="text-[#5A687C] text-[14px] font-[400]">Customer Support</p>
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

export default CustomerSupport
