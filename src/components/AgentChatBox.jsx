import { useEffect, useRef, useState } from "react"
import { X, Plus } from "lucide-react"
import { GoDotFill } from "react-icons/go"
import { RxHamburgerMenu } from 'react-icons/rx'
import { v4 as uuidv4 } from "uuid"
import {
  BulbIcon,
  Delete,
  DislikeIcon,
  Duplicate,
  Edit,
  EditIcon,
  EmojiIcon,
  ImageChatIcon,
  LikeIcon,
  MicChatIcon,
  PaperClipChatIcon,
  SearchChatIcon,
  SearchIcon,
  SendIcon,
  SpeakerIcon,
  ThreeDots,
} from "../icons/icons"
import PdfIcon from "../assets/svg/pdf.svg";
import { useSelector } from "react-redux"
import { formatTimeAgo } from "../utils/TimeFormat"
import { useTranslation } from "react-i18next"
import ChatInput from "./ChatInput"
import { useLocation } from "react-router-dom"
import { getContentCreationChats } from "../api/contentCreationAgent"
import ChatIdeaSvg from '../assets/svg/ChatBulb.svg'
import ChatFile from '../assets/svg/ChatFile.svg'
import ChatSearch from '../assets/svg/ChatSearch.svg'

const AgentChatBox = ({ listedProps }) => {
  const {
    agentLogo,
    agentName,
    initialMessage,
    setActiveConversation,
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
    socket2Ref,
    staticSuggestions,
    nameColor,
  } = listedProps
  const [errorMessage, setErrorMessage] = useState("")
  const [activeDropdown, setActiveDropdown] = useState(null)
  const chatRef = useRef()
  const moreActionsRef = useRef()
  const userDetails = useSelector((state) => state.profile)
  const authState = useSelector((state) => state.auth)
  const userToken = authState?.token || localStorage.getItem("token") || ""
  const { t } = useTranslation()
  const [likedMessages, setLikedMessages] = useState({})
  const [dislikedMessages, setDislikedMessages] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setName(value)
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleHistoryClick = async () => {
    try {
      const response = await getContentCreationChats();
      console.log("Content creation chats:", response);
    } catch (error) {
      console.error("Error fetching content creation chats:", error);
    }
  }

  const filteredChatList = chatList?.filter((conversation) => {
    const searchTerm = searchQuery.toLowerCase()
    const conversationName = (conversation.name || t("account_chat")).toLowerCase()
    return conversationName.includes(searchTerm)
  })

  const sendToSocket = (msgObject) => {
    console.log(WebSocket.OPEN, WebSocket.CONNECTING)
    // const messageToSend = input
    const directValue = ({ message: input })
    const messageToSend = msgObject ? JSON.stringify(msgObject) : JSON.stringify(directValue)
    if (!messageToSend) return

    try {
      console.log(socketRef)
      if (socketRef.current === null) {
        socketRef.current = new WebSocket(`${newwebsocketurl}?token=${localStorage.getItem("token")}`)
      }
      if (socketRef.current?.readyState == WebSocket.OPEN) {
        socketRef.current.send(messageToSend)
      } else if (socketRef.current?.readyState == WebSocket.CONNECTING) {
        console.log("second timeeeeeeeeee")
        socketRef.current.onopen = () => {
          socketRef.current.send(messageToSend)
        }
      } else {
        socketRef.current = new WebSocket(`${newwebsocketurl}?token=${localStorage.getItem("token")}`)
        socketRef.current.onopen = () => {
          socketRef.current.send(messageToSend)
        }
        console.warn("Second WebSocket not ready to send")
      }

      const agentMessage = {
        id: uuidv4(),
        isUser: true,
        content: msgObject ? msgObject.message : directValue.message,
        sender: "User",
        time: formatTimeAgo(new Date()),
        status: "Read",
        ...(msgObject?.file_id && { file_id: msgObject.file_id }),
        ...(msgObject?.filename && { filename: msgObject.filename }),
      }
      setMessages((prev) => [...prev, agentMessage])

      const typingMessage = {
        id: "typing",
        isUser: false,
        content: "...",
        sender: "Ecosystem.ai",
        time: "",
        status: "",
      }
      setMessages((prev) => [...prev, typingMessage])

      socketRef.current.onmessage = async (event) => {
        const responseText = event.data
        console.log("💬 Bot:", responseText)
        const parsedMessage = JSON.parse(responseText)

        // extract possible file metadata from parsed message
        const fileIdFromParsed = parsedMessage?.file_id || parsedMessage?.message?.file_id || parsedMessage?.message?.file?.file_id || parsedMessage?.attachment?.file_id || parsedMessage?.message?.attachment?.file_id || null;
        const filenameFromParsed = parsedMessage?.filename || parsedMessage?.message?.filename || parsedMessage?.message?.file?.filename || parsedMessage?.attachment?.filename || parsedMessage?.message?.attachment?.filename || null;

        const messageTimestamp = parsedMessage?.message_at ? new Date(parsedMessage.message_at) : new Date();
        const userMessage = {
          id: uuidv4(),
          isUser: false,
          content: parsedMessage?.agent,
          sender: "Ecosystem.ai",
          time: formatTimeAgo(messageTimestamp),
          timestamp: messageTimestamp, // Store original timestamp
          status: "Read",
          ...(fileIdFromParsed && { file_id: fileIdFromParsed }),
          ...(filenameFromParsed && { filename: filenameFromParsed }),
        }

        setMessages((prev) => prev.map((msg) => (msg.id === "typing" ? userMessage : msg)))

        // setMessages((prev) => [...prev, userMessage]);
        // handleGetAccountChats()
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.close()
        }
      }
    } catch (err) {
      console.error("Failed to send message to second socket:", err)
    }
  }

  const sendToSocket2 = (msgObject) => {
    console.log(WebSocket.OPEN, WebSocket.CONNECTING)
    const directValue = ({ message: input })
    const messageToSend = msgObject ? JSON.stringify(msgObject) : JSON.stringify(directValue)
    if (!messageToSend) return
    try {
      console.log(socket2Ref)
      if (socket2Ref.current?.readyState == WebSocket.OPEN) {
        socket2Ref.current.send(messageToSend)
      } else if (socket2Ref.current?.readyState == WebSocket.CONNECTING) {
        console.log("second timeeeeeeeeee")
        socket2Ref.current.onopen = () => {
          socket2Ref.current.send(messageToSend)
        }
      } else {
        console.warn("Second WebSocket not ready to send")
        socket2Ref.current = new WebSocket(
          `${websocketurl}/${activeConversation}?token=${localStorage.getItem("token")}`,
        )
        socket2Ref.current.onopen = () => {
          socket2Ref.current.send(messageToSend)
        }
      }

      const agentMessage = {
        id: uuidv4(),
        isUser: true,
        content: msgObject ? msgObject.message : directValue.message,
        sender: "User",
        time: formatTimeAgo(new Date()),
        status: "Read",
        ...(msgObject?.file_id && { file_id: msgObject.file_id }),
        ...(msgObject?.filename && { filename: msgObject.filename }),
      }
      setMessages((prev) => [...prev, agentMessage])

      const typingMessage = {
        id: "typing",
        isUser: false,
        content: "...",
        sender: "Ecosystem.ai",
        time: "",
        status: "",
      }
      setMessages((prev) => [...prev, typingMessage])

      socket2Ref.current.onmessage = async (event) => {
        const responseText = event.data
        const parsedMessage = JSON.parse(responseText)
        console.log("💬 Bot:", parsedMessage)

        // extract possible file metadata from parsed message
        const fileIdFromParsed2 = parsedMessage?.file_id || parsedMessage?.message?.file_id || parsedMessage?.message?.file?.file_id || parsedMessage?.attachment?.file_id || parsedMessage?.message?.attachment?.file_id || null;
        const filenameFromParsed2 = parsedMessage?.filename || parsedMessage?.message?.filename || parsedMessage?.message?.file?.filename || parsedMessage?.attachment?.filename || parsedMessage?.message?.attachment?.filename || null;

        const messageTimestamp = parsedMessage?.message_at ? new Date(parsedMessage.message_at) : new Date();
        const userMessage = {
          id: uuidv4(),
          isUser: false,
          content: parsedMessage?.agent ?? parsedMessage?.error,
          sender: "Ecosystem.ai",
          time: formatTimeAgo(messageTimestamp),
          timestamp: messageTimestamp, // Store original timestamp
          status: "Read",
          ...(fileIdFromParsed2 && { file_id: fileIdFromParsed2 }),
          ...(filenameFromParsed2 && { filename: filenameFromParsed2 }),
        }
        setMessages((prev) => prev.map((msg) => (msg.id === "typing" ? userMessage : msg)))

        // setMessages((prev) => [...prev, userMessage]);
        // handleGetAccountChats()
      }
    } catch (err) {
      console.error("Failed to send message to second socket:", err)
    }
  }

  const handleSend = (eOrFile) => {
    // Support being called either as form submit event or with selectedFile object
    if (eOrFile && typeof eOrFile.preventDefault === "function") {
      eOrFile.preventDefault()
    }
    const selectedFile = eOrFile && !eOrFile.preventDefault ? eOrFile : undefined
    if (!input.trim()) return
    const msgObject = {
      message: input,
      ...(selectedFile?.id && { file_id: selectedFile.id, filename: selectedFile.name }),
      ...(agentName && { agent_name: agentName }),
    }
    if (activeConversation) {
      sendToSocket2(msgObject)
    } else {
      sendToSocket(msgObject)
    }
    setInput("")
  }

  useEffect(() => {
    handleGetAccountChats()
  }, [])

  useEffect(() => {
    if (
      messages?.length > 0 &&
      !messages?.[messages.length - 1].isUser &&
      messages?.[messages.length - 1].id !== "typing"
    ) {
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
        behavior: "smooth",
      })
    }
  }, [messages])

  const handleDropdownClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

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
    const userMessage = [
      {
        id: uuidv4(),
        isUser: false,
        content: initialMessage,
        sender: "Ecosystem.ai",
        time: formatTimeAgo(new Date()),
        status: "Read",
      },
    ]
    setMessages([])
  }

  const stopTranscription = () => {
    if (socket2Ref.current && socket2Ref.current.readyState === WebSocket.OPEN) {
      socket2Ref.current.close()
    }
  }

  const handleSelectMessage = (value) => {
    setInput(value);

    if (location.pathname === "/dashboard/hr" || location.pathname === "/dashboard/customer-support") {
      const matchedSuggestion = suggestionsChat.find((item) => item.key === value);
      const msgObject = {
        message: value,
        ...(matchedSuggestion?.agent_type && { agent_type: matchedSuggestion.agent_type }),
      };

      sendToSocket(msgObject);
      setInput("");
    }
  };

  const parseMarkdown = (text) => {
    // ensure we always operate on a string to avoid type errors
    const str = typeof text === "string" ? text : text == null ? "" : String(text);

    return str
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3><strong>$1</strong></h3>")
      .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
  }

  const formatMessageTime = (timeStr) => {
    if (!timeStr) return "";
    
    // If it contains "at", extract the time part (e.g., "Today at 4:32 PM" -> "4:32 PM")
    if (timeStr.includes("at")) {
      return timeStr.split("at")[1]?.trim() || timeStr;
    }
    
    // For "just now" or "X mins ago", show current time
    if (timeStr.toLowerCase().includes("just now") || timeStr.includes("min")) {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    
    return timeStr;
  }

  const suggestionsChat = [
    {
      label: staticSuggestions[0].label,
      icon: ChatIdeaSvg,
      iconBg: "bg-[#2D9F75]",
      key: staticSuggestions[0].key,
      agent_type: staticSuggestions[0].agent_type
    },
    {
      label: staticSuggestions[1].label,
      icon: ChatFile,
      iconBg: "bg-[#4D6FFB]",
      key: staticSuggestions[1].key,
      agent_type: staticSuggestions[1].agent_type
    },
    {
      label: staticSuggestions[2].label,
      icon: ChatSearch,
      iconBg: "bg-[#37BAE9]",
      key: staticSuggestions[2].key,
      agent_type: staticSuggestions[2].agent_type
    },
  ];



  if (loading)
    return (
      <p className="flex justify-center items-center h-[100vh]">
        <span className="loader" />
      </p>
    )

  const handleCopyMessage = (content) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content)
    }
  }

  const handleLikeMessage = (messageId) => {
    setLikedMessages((prev) => ({ ...prev, [messageId]: !prev[messageId] }))
    setDislikedMessages((prev) => ({ ...prev, [messageId]: false }))
  }

  const handleDislikeMessage = (messageId) => {
    setDislikedMessages((prev) => ({ ...prev, [messageId]: !prev[messageId] }))
    setLikedMessages((prev) => ({ ...prev, [messageId]: false }))
  }

  const handleSpeakMessage = (content) => {
    if ("speechSynthesis" in window) {
      const utterance = new window.SpeechSynthesisUtterance(content)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleResendMessage = (content) => {
    setInput(content)
  }

  return (
    <div className="w-full h-[calc(100vh-90px)] px-6 py-6 flex flex-col gap-3">
      <div className="flex items-center justify-between px-6">
        <h1 className="text-[24px] font-[600] text-[#1E1E1E]">{t("seo.chat")}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectNewChat}
            className="flex items-center gap-2 cursor-pointer bg-[#675FFF] text-white px-4 py-2 rounded-lg font-[500] text-sm hover:bg-[#5a4fe6] transition-colors"
          >
            <Plus size={16} />
            <span>{t("seo.new_chat")}</span>
          </button>
          <button
            onClick={handleHistoryClick}
            className="flex items-center gap-2 cursor-pointer bg-white text-[#1E1E1E] border border-[#E1E4EA] px-4 py-2 rounded-lg font-[500] text-sm hover:bg-[#F4F5F6] transition-colors"
          >
            <RxHamburgerMenu size={16} />
            <span>{t("History") || "History"}</span>
          </button>
        </div>
      </div>
      <div className="h-full overflow-auto flex pb-2 flex-col">
        <div className="h-full rounded-2xl">
          {/* Main Content */}
          {openChat ? (
            loadingChats ? (
              <div className="flex justify-center items-center w-full">
                <span className="loader" />{" "}
              </div>
            ) : (
              <div className="flex-1 h-full max-w-5xl mx-auto flex justify-between flex-col pt-4">
                {/* Messages */}
                <div ref={chatRef} className="flex-1 p-4 overflow-y-auto scrollbar-hide">
                  <div className="space-y-6">
                    {messages?.length > 0 ? (
                      messages.map((message) => (
                        <div key={message.id} className="flex flex-col">
                          <>
                            {message.id === "typing" ? (
                              <div className="pl-3 pt-3 flex ">
                                <span className="thinking" />
                              </div>
                            ) : (
                              <>
                                <div className={`flex items-start gap-2 ${message.isUser ? "justify-end" : ""}`}>
                                  {!message.isUser && (
                                    <div className="flex-shrink-0">
                                      <img
                                        src={agentLogo || "/placeholder.svg"}
                                        alt={agentName}
                                        className="w-8 h-8 object-fit rounded-full"
                                      />
                                    </div>
                                  )}

                                  <div
                                    className={`max-w-[70%] w-fit text-[12px] font-[400] p-3 relative ${!message.isUser
                                      ? "my-1 bg-[#FFFFFF] text-[#5A687C] rounded-b-[10px] rounded-r-[10px]"
                                      : "my-1 bg-[#675FFF] text-[#fff] rounded-b-[10px] rounded-l-[10px]"
                                      }`}
                                  >
                                  <p
                                    className="text-[16px] !whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
                                  />

                                  {/* Attachment chip */}
                                  {(message.file_id || message.filename) && (
                                    <div
                                      className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl shadow-sm border ${!message.isUser
                                        ? "bg-white border-[#E2E8F0] text-[#374151]"
                                        : "bg-[#41a7e2] border-transparent text-white"
                                        }`}
                                    >
                                      <img
                                        src={PdfIcon}
                                        alt="file"
                                        className={`w-5 h-5 ${message.isUser ? "opacity-90" : "opacity-80"}`}
                                      />
                                      <div className="flex-1 truncate">
                                        <span className="text-sm font-medium truncate block">
                                          {message.filename || message.file_name || "attachment"}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  </div>

                                  {message.isUser && (
                                    <div className="flex-shrink-0">
                                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-[11px] text-[#675FFF] font-[600]">
                                        {userDetails?.user?.firstName[0]}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {message.id !== "typing" && !message.isUser && (
                                  <div className="my-1 flex items-center ml-10 ">
                                    <button
                                      title="Copy message"
                                      onClick={() => handleCopyMessage(message.content)}
                                      className="hover:bg-gray-200 p-1 rounded cursor-pointer"
                                    >
                                      <Duplicate />
                                    </button>
                                    <button
                                      title="Like"
                                      onClick={() => handleLikeMessage(message.id)}
                                      className={`hover:bg-gray-200 p-1 cursor-pointer rounded ${likedMessages[message.id] ? "text-green-600" : ""}`}
                                    >
                                      <LikeIcon />
                                    </button>
                                    <button
                                      title="Dislike"
                                      onClick={() => handleDislikeMessage(message.id)}
                                      className={`hover:bg-gray-200 p-1 cursor-pointer rounded ${dislikedMessages[message.id] ? "text-red-600" : ""}`}
                                    >
                                      <DislikeIcon />
                                    </button>
                                    <button
                                      title="Speak"
                                      onClick={() => handleSpeakMessage(message.content)}
                                      className="hover:bg-gray-200 p-1 rounded cursor-pointer"
                                    >
                                      <SpeakerIcon />
                                    </button>
                                    <button
                                      title="Resend"
                                      onClick={() => handleResendMessage(message.content)}
                                      className="hover:bg-gray-200 p-1 rounded cursor-pointer"
                                    >
                                      <SendIcon />
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
                        {/* Agent Avatar */}
                        <div className="flex justify-center">
                          <div className="relative flex items-center justify-center">
                            <div className="absolute w-20 h-20 rounded-full bg-white -z-10"></div>
                            <div className="w-18 h-18 rounded-full bg-[#FFE4C5] flex items-center justify-center overflow-hidden">
                              <img
                                src={agentLogo || "/placeholder.svg"}
                                alt={agentName}
                                className="w-16 h-16 object-contain rounded-full scale-120"
                              />
                            </div>
                          </div>
                        </div>


                        {/* Welcome Text */}
                        <div className="flex flex-col items-center gap-3 text-center">
                          <h1 className="text-[#1E1E1E] text-[28px] font-[600]">
                            {t("tara.how_can_i_help") || "How can I help you today?"}
                          </h1>
                          <p className="text-[#5A687C] text-[16px] font-[400] max-w-2xl">
                            {t("tara.start_typing") || "Start typing your question or choose a suggested topic below."}
                          </p>
                        </div>

                        {/* Suggestions */}
                        <div className="w-full max-w-5xl flex flex-wrap justify-center gap-4">
                          {suggestionsChat.map((e, index) => (
                            <div
                              key={e.key}
                              onClick={() => handleSelectMessage(e.key)}
                              className="cursor-pointer w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] bg-white rounded-xl shadow-sm hover:shadow-md transition-all px-6 py-4 flex flex-col gap-4"
                            >
                              {/* Icon with colored square background */}
                              <div className={`${e.iconBg} w-8 h-8 rounded-xl flex items-center justify-center`}>
                                <img src={e.icon} alt="" className="w-5 h-5 object-contain" />
                              </div>

                              {/* Question text */}
                              <p className="text-[#1E1E1E] font-[400] text-[14px] leading-relaxed">{e.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input */}
                <div className="w-full mx-auto p-2">
                  <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    userToken={userToken}
                    agentName={agentName}
                    sendLabel={t("send")}
                    placeholder={t("type_message")}
                  />
                </div>
              </div>
            )
          ) : (
            <h1 className="text-[#5A687C] text-[18px] font-[400] flex justify-center items-center w-full">
              {t("welcome_to")} Ecosysteme.ai {t("chats")}
            </h1>
          )}
        </div>

        {errorMessage && (
          <div className="inter fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
            <div className="bg-white max-h-[300px] flex flex-col gap-4 w-full max-w-md rounded-2xl shadow-xl p-6 relative">
              <button
                onClick={() => {
                  setErrorMessage("")
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
                    onClick={() => setErrorMessage("")}
                    className={`w-fit bg-[#675FFF] cursor-pointer text-white py-[7px] px-[20px] rounded-[8px] font-semibold  transition`}
                  >
                    {t("brain_ai.integrations.ok")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                <h2 className="text-[20px] font-semibold text-[#1E1E1E] mb-4">{t("tara.update_chat_name")}</h2>
                <div>
                  <label className="text-sm font-medium text-[#1e1e1e]">{t("brain_ai.name")}</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    className={`w-full bg-white p-2 rounded-lg border ${errors.name ? "border-red-500" : "border-[#e1e4ea]"} focus:outline-none focus:border-[#675FFF]`}
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
                    {updateNameLoading ? (
                      <p className="flex items-center justify-center gap-1">
                        {t("processing_normal")}
                        <span className="loader" />
                      </p>
                    ) : (
                      `${t("brain_ai.update")}`
                    )}
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
