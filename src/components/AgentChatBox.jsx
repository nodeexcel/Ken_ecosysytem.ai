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
  Ellipsis,
} from "../icons/icons"
import PdfIcon from "../assets/svg/pdf.svg";
import { useSelector } from "react-redux"
import { formatTimeAgo } from "../utils/TimeFormat"
import { useTranslation } from "react-i18next"
import ChatInput from "./ChatInput"
import { useLocation } from "react-router-dom"
import { getContentCreationChats, deleteContentCreationChat, updateContentCreationChatName } from "../api/contentCreationAgent"
import ChatIdeaSvg from '../assets/svg/ChatBulb.svg'
import ChatFile from '../assets/svg/ChatFile.svg'
import ChatSearch from '../assets/svg/ChatSearch.svg'
import ChatIcon from '../assets/svg/ChatIcon.svg'
import EmptyChat from '../assets/svg/EmptyChat.svg'
import ToastModal from './ToastModal'

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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [historyChats, setHistoryChats] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [historySearchQuery, setHistorySearchQuery] = useState("")
  const [activeHistoryDropdown, setActiveHistoryDropdown] = useState(null)
  const historyDropdownRefs = useRef({})
  const location = useLocation();
  const [toast, setToast] = useState({ open: false, type: 'success', title: '', description: '', highlightText: '' })
  const isSavingRef = useRef(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
      // Check if click is outside any history dropdown
      const clickedOutsideAll = Object.values(historyDropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target)
      )
      if (clickedOutsideAll && activeHistoryDropdown) {
        setActiveHistoryDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [activeHistoryDropdown])

  const handleChange = (e) => {
    const { name, value } = e.target
    setName(value)
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Function to sort history chats in descending order (newest first, oldest last)
  const sortHistoryChatsDescending = (chats) => {
    return [...chats].sort((a, b) => {
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

      return dateB - dateA // Descending order (newest first, oldest last)
    })
  }

  // Function to refresh history chats with debouncing for automatic updates
  const refreshHistoryChatsRef = useRef(null)
  const isOpeningHistoryRef = useRef(false)
  const refreshHistoryChats = async (immediate = false) => {
    // Clear any pending refresh
    if (refreshHistoryChatsRef.current) {
      clearTimeout(refreshHistoryChatsRef.current)
      refreshHistoryChatsRef.current = null
    }

    const fetchHistory = async () => {
      try {
        const response = await getContentCreationChats()
        if (response?.status === 200) {
          const formatData = response?.data?.success || []
          // Sort history chats: newest at top, oldest at bottom
          const sortedData = sortHistoryChatsDescending(formatData)
          setHistoryChats(sortedData)
        } else {
          setHistoryChats([])
        }
      } catch (error) {
        console.error("Error fetching content creation chats:", error)
        setHistoryChats([])
      }
    }

    if (immediate) {
      // Fetch immediately (e.g., when opening sidebar)
      await fetchHistory()
    } else {
      // Debounce automatic refreshes to avoid too many calls
      refreshHistoryChatsRef.current = setTimeout(() => {
        fetchHistory()
        refreshHistoryChatsRef.current = null
      }, 200) // 200ms debounce for fast updates
    }
  }

  const handleHistoryClick = async () => {
    const newState = !isHistoryOpen
    setIsHistoryOpen(newState)
    if (newState) {
      // Set flag to prevent useEffect hooks from triggering during initial open
      isOpeningHistoryRef.current = true
      setLoadingHistory(true)
      await refreshHistoryChats(true) // Immediate fetch when opening
      setLoadingHistory(false)
      // Reset flag after a short delay to allow useEffect hooks to skip
      setTimeout(() => {
        isOpeningHistoryRef.current = false
      }, 100)
    }
  }

  const handleHistorySearchChange = (e) => {
    setHistorySearchQuery(e.target.value)
  }

  const handleHistoryRename = (conversation) => {
    setEditData({ chat_id: conversation.chat_id || conversation.id })
    setName(conversation.name || "")
    setActiveHistoryDropdown(null)
  }

  const handleHistoryDelete = async (chatId) => {
    try {
      // Get chat name before deleting for toast message
      const chatToDelete = historyChats.find(chat => (chat.chat_id || chat.id) === chatId)
      const chatName = chatToDelete?.name || 'conversation'

      const response = await deleteContentCreationChat(chatId)
      if (response?.status === 200) {
        // Refresh history list
        const historyResponse = await getContentCreationChats()
        if (historyResponse?.status === 200) {
          const formatData = historyResponse?.data?.success || []
          // Sort history chats: newest at top, oldest at bottom
          const sortedData = sortHistoryChatsDescending(formatData)
          setHistoryChats(sortedData)
        }
        // If deleted chat was active, clear it
        if (chatId === activeConversation) {
          setMessages([])
          setActiveConversation("")
        }
        // Also refresh main chat list
        if (handleGetAccountChats) {
          handleGetAccountChats()
        }
        // Show success toast
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
      console.error("Error deleting chat:", error)
      // Show error toast
      setToast({
        open: true,
        type: 'error',
        title: 'Delete Failed',
        description: 'We couldn\'t delete the conversation. Please try again.',
      })
    } finally {
      setActiveHistoryDropdown(null)
    }
  }

  // Filter and sort history chats: newest at top, oldest at bottom
  const filteredHistoryChats = historyChats?.filter((conversation) => {
    const searchTerm = historySearchQuery.toLowerCase()
    const conversationName = (conversation.name || t("account_chat")).toLowerCase()
    return conversationName.includes(searchTerm)
  })

  // Apply sorting: newest chats at top, oldest at bottom
  const sortedFilteredHistoryChats = filteredHistoryChats ? sortHistoryChatsDescending(filteredHistoryChats) : []

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
        // Refresh history if sidebar is open (new chat might have been created)
        if (isHistoryOpen) {
          setTimeout(() => refreshHistoryChats(), 300)
        }
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
        // Refresh history if sidebar is open
        if (isHistoryOpen) {
          setTimeout(() => refreshHistoryChats(), 300)
        }
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
      // Refresh history if sidebar is open (but not during initial open)
      if (isHistoryOpen && !isOpeningHistoryRef.current) {
        refreshHistoryChats()
      }
    }
  }, [messages, isHistoryOpen])

  // Refresh history when activeConversation changes (new chat created)
  useEffect(() => {
    if (activeConversation && isHistoryOpen && !isOpeningHistoryRef.current) {
      // Small delay to ensure backend has processed the new chat
      const timer = setTimeout(() => {
        refreshHistoryChats()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [activeConversation, isHistoryOpen])

  useEffect(() => {
    if (chatList?.length > 0) {
      setLoading(false)
      setLoadingChatsList(false)
      // Refresh history if sidebar is open and chat list updated (but not during initial open)
      if (isHistoryOpen && !isOpeningHistoryRef.current) {
        refreshHistoryChats()
      }
    }
  }, [chatList, isHistoryOpen])

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
    // Refresh history if sidebar is open
    if (isHistoryOpen) {
      refreshHistoryChats()
    }
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
    // Refresh history if sidebar is open
    if (isHistoryOpen) {
      refreshHistoryChats()
    }
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
      iconBg: "bg-[#A7ABB4]",
      key: staticSuggestions[0].key,
      agent_type: staticSuggestions[0].agent_type
    },
    {
      label: staticSuggestions[1].label,
      icon: ChatFile,
      iconBg: "bg-[#A7ABB4]",
      key: staticSuggestions[1].key,
      agent_type: staticSuggestions[1].agent_type
    },
    {
      label: staticSuggestions[2].label,
      icon: ChatSearch,
      iconBg: "bg-[#A7ABB4]",
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
    <div className="w-full h-[calc(100vh-80px)] px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 flex flex-col gap-2 sm:gap-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 px-2 sm:px-4 lg:px-6">
        <h1 className="text-[18px] sm:text-[20px] lg:text-[24px] font-[600] text-[#1E1E1E]">{t("seo.chat")}</h1>
        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={handleSelectNewChat}
            className="flex items-center gap-1 sm:gap-2 cursor-pointer bg-[#675FFF] text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg font-[500] text-xs sm:text-sm hover:bg-[#5a4fe6] transition-colors"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t("seo.new_chat")}</span>
          </button>
          <button
            onClick={handleHistoryClick}
            className="flex items-center gap-1 sm:gap-2 cursor-pointer bg-white text-[#1E1E1E] border border-[#E1E4EA] px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg font-[500] text-xs sm:text-sm hover:bg-[#F4F5F6] transition-colors"
          >
            {isHistoryOpen ? (
              <X size={14} className="sm:w-4 sm:h-4" />
            ) : (
              <RxHamburgerMenu size={14} className="sm:w-4 sm:h-4" />
            )}

            <span className="hidden sm:inline">
              {t("History") || "History"}
            </span>
          </button>
        </div>
      </div>
      <div className="h-full overflow-hidden flex pb-2 gap-4 relative">
        {/* Main Chat Area */}
        <div className={`h-full rounded-2xl transition-all duration-300 ${isHistoryOpen ? 'flex-1 min-w-0' : 'w-full'}`}>
          {/* Main Content */}
          {openChat ? (
            loadingChats ? (
              <div className="flex justify-center items-center w-full">
                <span className="loader" />{" "}
              </div>
            ) : (
              <div className="flex-1 h-full max-w-5xl mx-auto flex justify-between flex-col pt-2 sm:pt-3 lg:pt-4">
                {/* Messages */}
                <div ref={chatRef} className="flex-1 p-2 sm:p-3 lg:p-4 lg:pt-6 overflow-y-auto scrollbar-hide">
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                    {messages?.length > 0 ? (
                      messages.map((message) => (
                        <div key={message.id} className="flex flex-col">
                          <>
                            {message.id === "typing" ? (
                              <div className="pl-2 sm:pl-3 pt-2 sm:pt-3 flex ">
                                <span className="thinking" />
                              </div>
                            ) : (
                              <>
                                <div className={`flex items-start gap-1.5 sm:gap-2 ${message.isUser ? "justify-end" : ""}`}>
                                  {!message.isUser && (
                                    <div className="flex-shrink-0">
                                      <img
                                        src={agentLogo || "/placeholder.svg"}
                                        alt={agentName}
                                        className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 object-fit rounded-full"
                                      />
                                    </div>
                                  )}

                                  <div
                                    className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] w-fit text-[10px] sm:text-[11px] lg:text-[12px] font-[400] p-2 sm:p-2.5 lg:p-3 relative ${!message.isUser
                                      ? "my-1 bg-[#FFFFFF] text-[#5A687C] rounded-b-[8px] sm:rounded-b-[10px] rounded-r-[8px] sm:rounded-r-[10px]"
                                      : "my-1 bg-[#675FFF] text-[#fff] rounded-b-[8px] sm:rounded-b-[10px] rounded-l-[8px] sm:rounded-l-[10px]"
                                      }`}
                                  >
                                    <p
                                      className="text-[14px] sm:text-[15px] lg:text-[16px] !whitespace-pre-wrap"
                                      dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
                                    />

                                    {/* Attachment chip */}
                                    {(message.file_id || message.filename) && (
                                      <div
                                        className={`mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-sm border ${!message.isUser
                                          ? "bg-white border-[#E2E8F0] text-[#374151]"
                                          : "bg-[#41a7e2] border-transparent text-white"
                                          }`}
                                      >
                                        <img
                                          src={PdfIcon}
                                          alt="file"
                                          className={`w-4 h-4 sm:w-5 sm:h-5 ${message.isUser ? "opacity-90" : "opacity-80"}`}
                                        />
                                        <div className="flex-1 truncate">
                                          <span className="text-xs sm:text-sm font-medium truncate block">
                                            {message.filename || message.file_name || "attachment"}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {message.isUser && (
                                    <div className="flex-shrink-0">
                                      <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-blue-100 text-[9px] sm:text-[10px] lg:text-[11px] text-[#675FFF] font-[600]">
                                        {userDetails?.user?.firstName[0]}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {message.id !== "typing" && !message.isUser && (
                                  <div className="my-1 flex items-center ml-6 sm:ml-8 lg:ml-10 gap-0.5 sm:gap-1">
                                    <button
                                      title="Copy message"
                                      onClick={() => handleCopyMessage(message.content)}
                                      className="hover:bg-gray-200 p-0.5 sm:p-1 rounded cursor-pointer"
                                    >
                                      <Duplicate className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                      title="Like"
                                      onClick={() => handleLikeMessage(message.id)}
                                      className={`hover:bg-gray-200 p-0.5 sm:p-1 cursor-pointer rounded ${likedMessages[message.id] ? "text-green-600" : ""}`}
                                    >
                                      <LikeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                      title="Dislike"
                                      onClick={() => handleDislikeMessage(message.id)}
                                      className={`hover:bg-gray-200 p-0.5 sm:p-1 cursor-pointer rounded ${dislikedMessages[message.id] ? "text-red-600" : ""}`}
                                    >
                                      <DislikeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                      title="Speak"
                                      onClick={() => handleSpeakMessage(message.content)}
                                      className="hover:bg-gray-200 p-0.5 sm:p-1 rounded cursor-pointer"
                                    >
                                      <SpeakerIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                      title="Resend"
                                      onClick={() => handleResendMessage(message.content)}
                                      className="hover:bg-gray-200 p-0.5 sm:p-1 rounded cursor-pointer"
                                    >
                                      <SendIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4">
                        <div className="flex justify-center">
                          <div className="relative flex items-center justify-center">
                            <div className="absolute w-16 h-16 sm:w-20 sm:h-20 lg:w-20 lg:h-20 rounded-full bg-white -z-10"></div>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-[#FFE4C5] flex items-center justify-center overflow-hidden">
                              <img
                                src={agentLogo || "/placeholder.svg"}
                                alt={agentName}
                                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain rounded-full scale-120"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 sm:gap-3 text-center">
                          <h1 className="text-[#1E1E1E] text-[20px] sm:text-[24px] lg:text-[28px] font-[600] px-2">
                            {t("tara.how_can_i_help") || "How can I help you today?"}
                          </h1>
                          <p className="text-[#5A687C] text-[14px] sm:text-[15px] lg:text-[16px] font-[400] max-w-2xl px-2">
                            {t("tara.start_typing") || "Start typing your question or choose a suggested topic below."}
                          </p>
                        </div>

                        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 xl:gap-4 px-2">
                          {suggestionsChat.map((e, index) => (
                            <div
                              key={e.key}
                              onClick={() => handleSelectMessage(e.key)}
                              className="cursor-pointer w-full bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 flex flex-col gap-3 sm:gap-4"
                            >
                              <div className={`${e.iconBg} w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg sm:rounded-xl flex items-center justify-center`}>
                                <img src={e.icon} alt="" className="w-4 h-4 sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5 object-contain" />
                              </div>

                              <p className="text-[#1E1E1E] font-[400] text-[12px] sm:text-[13px] lg:text-[14px] leading-relaxed">{e.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input */}
                <div className="w-full mx-auto p-1 sm:p-1.5 lg:px-2">
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
            <h1 className="text-[#5A687C] text-[14px] sm:text-[16px] lg:text-[18px] font-[400] flex justify-center items-center w-full px-2">
              {t("welcome_to")} Ecosysteme.ai {t("chats")}
            </h1>
          )}
        </div>

        {errorMessage && (
          <div className="inter fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50 p-4">
            <div className="bg-white max-h-[300px] flex flex-col gap-3 sm:gap-4 w-full max-w-md rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 lg:p-6 relative">
              <button
                onClick={() => {
                  setErrorMessage("")
                }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-800"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="space-y-4 sm:space-y-5 lg:space-y-6 mt-4 sm:mt-5 lg:mt-6">
                <h2 className="text-[16px] sm:text-[18px] lg:text-[20px] font-[600] text-center text-[#292D32] px-2">{errorMessage}</h2>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    onClick={() => setErrorMessage("")}
                    className={`w-fit bg-[#675FFF] cursor-pointer text-white py-[6px] sm:py-[7px] px-[16px] sm:px-[20px] rounded-[6px] sm:rounded-[8px] text-sm sm:text-base font-semibold transition`}
                  >
                    {t("brain_ai.integrations.ok")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* History Sidebar */}
        {isHistoryOpen && (
          <>
            {/* Overlay for mobile */}
            <div
              className="fixed inset-0 z-40 sm:hidden transition-opacity duration-300"
              onClick={() => setIsHistoryOpen(false)}
            />
            <div className="fixed sm:relative right-0 top-[200px] md:top-0 
w-full sm:w-[260px]               /* smaller width on small screens */
lg:w-[300px] xl:w-[360px]         /* 1024px smaller, above it normal */
h-[calc(100vh-90px)] sm:h-full 
bg-white 
rounded-none sm:rounded-t-xl sm:rounded-b-2xl  /* top rounded on small */
border border-[#D6D6D6] 
flex flex-col overflow-hidden 
shadow-xl sm:shadow-none 
z-50 sm:z-auto 
transform transition-transform duration-300 ease-in-out">

              {/* Search Bar */}
              <div className="px-4 sm:px-6 pt-4 pb-2">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <SearchIcon className="w-5 h-5 text-[#5A687C]" />
                  </div>
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={handleHistorySearchChange}
                    placeholder={t("search_chat") || "Search Chat"}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E1E4EA] rounded-xl text-sm sm:text-md text-[#1E1E1E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#675FFF] transition-colors"
                  />
                </div>
              </div>

              {/* History List Container - Remove overflow from this div */}
              <div className="flex-1 px-3 sm:px-2 md:px-4 pb-4 relative overflow-y-auto" style={{ zIndex: 1 }}>
                {loadingHistory ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="loader" />
                  </div>
                ) : sortedFilteredHistoryChats && sortedFilteredHistoryChats.length > 0 ? (
                  <div className="flex flex-col gap-2 h-full overflow-y-auto" style={{ position: 'relative' }}>
                    {sortedFilteredHistoryChats.slice().reverse().map((conversation, index) => {
                      const chatId = conversation.chat_id || conversation.id
                      const isActive = activeConversation === chatId

                      // Calculate if this is one of the last few items
                      const isLastThree = index >= sortedFilteredHistoryChats.length - 3

                      return (
                        <div
                          key={chatId}
                          className={`relative p-3 rounded-lg transition-colors ${isActive
                            ? "bg-[#675FFF] text-black"
                            : "bg-white hover:bg-gray-200 text-[#1E1E1E]"
                            }`}
                        >
                          {editData?.chat_id === chatId ? (
                            // Inline Edit Mode
                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={handleChange}
                                className={`w-full bg-white p-2 rounded-lg border text-sm ${errors.name ? "border-red-500" : "border-[#675FFF]"} focus:outline-none focus:border-[#675FFF]`}
                                placeholder={t("tara.name_placeholder")}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    isSavingRef.current = true
                                    handleUpdateName()
                                  }
                                }}
                                onBlur={() => {
                                  // Cancel edit when clicking outside, but not if we're saving
                                  setTimeout(() => {
                                    if (!isSavingRef.current) {
                                      setEditData({})
                                      setName("")
                                    }
                                    isSavingRef.current = false
                                  }, 100)
                                }}
                              />
                              {errors.name && <p className="text-[11px] font-[400] text-red-500">{errors.name}</p>}
                            </div>
                          ) : (
                            <>
                              <div
                                onClick={() => {
                                  handleSelectChat(chatId)
                                  setIsHistoryOpen(false)
                                }}
                                className="cursor-pointer pr-8 sm:pr-8 touch-manipulation"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  {/* Use ChatIcon as img src */}
                                  <img
                                    src={ChatIcon}
                                    alt="chat"
                                    className={`w-4 h-4 ${isActive ? "filter brightness-0 invert" : ""}`}
                                  />
                                  <p className="text-sm font-medium truncate flex-1">
                                    {conversation.name || t("account_chat")}
                                  </p>
                                </div>
                                {conversation.updated_at && (
                                  <p className={`text-xs mt-1 ml-6 ${isActive
                                    ? "text-white/80"
                                    : "text-[#5A687C]"
                                    }`}>
                                    {formatTimeAgo(new Date(conversation.updated_at))}
                                  </p>
                                )}
                              </div>
                              {/* Ellipsis Button */}
                              <div
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                ref={(el) => {
                                  if (el) {
                                    historyDropdownRefs.current[chatId] = el
                                  } else {
                                    delete historyDropdownRefs.current[chatId]
                                  }
                                }}
                                style={{ zIndex: 100 }}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveHistoryDropdown(activeHistoryDropdown === chatId ? null : chatId)
                                  }}
                                  className={`p-1.5 rounded-lg hover:bg-opacity-20 transition-colors cursor-pointer ${isActive
                                    ? "hover:bg-white/20 text-white "
                                    : "hover:bg-[#675FFF]/10 text-[#5A687C]"
                                    }`}
                                >
                                  <Ellipsis className="w-4 h-4" color="black" />


                                </button>
                                {/* Dropdown Menu - Opens BELOW the button, above next card */}
                                {activeHistoryDropdown === chatId && (
                                  <div
                                    className="absolute right-0 sm:right-6 top-full mt-2 w-32 sm:w-32 bg-white rounded-lg shadow-xl border border-[#E1E4EA] overflow-hidden z-[9999]"
                                    style={{
                                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                                      zIndex: 9999
                                    }}
                                  >
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleHistoryRename(conversation)
                                        setActiveHistoryDropdown(null)
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-[#1E1E1E] hover:bg-[#F4F5F6] transition-colors flex items-center gap-2"
                                    >
                                      <EditIcon className="w-4 h-4" />
                                      {t("rename") || "Rename"}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleHistoryDelete(chatId)
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors flex items-center gap-2"
                                    >
                                      <Delete className="w-4 h-4" />
                                      {t("delete") || "Delete"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4 pb-16">
                    {/* Simplified Chat Bubble Icon */}
                    <div className="w-12 h-12 md:w-36 md:h-36 rounded-full bg-[#F4F5F6] flex items-center justify-center mb-2">
                      <img
                        src={EmptyChat}
                        alt="chat"
                        className={"w-36 h-36 pr-4 object-fill pt-6"}
                      />
                    </div>

                    {/* No Chat History Text */}
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[16px] sm:text-[18px] font-[600] text-[#1E1E1E]">
                        {t("no_chat_history") || "No chat history yet"}
                      </h3>
                      <p className="text-[13px] sm:text-[14px] font-[400] text-[#5A687C] max-w-[200px]">
                        {t("start_ask_question") || "Let's start ask question to our expert"}
                      </p>
                    </div>

                    {/* New Chat Button for Empty State */}
                    <button
                      onClick={() => {
                        handleSelectNewChat()
                        setIsHistoryOpen(false)
                      }}
                      className="mt-4 flex items-center justify-center gap-2 bg-[#ffffff]  border border-[#D6D6D6] text-black px-6 py-2.5 rounded-lg font-[500] text-md hover:bg-[#d2d1e0] transition-colors cursor-pointer"
                    >
                      <Plus size={18} />
                      <span>{t("seo.new_chat")}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
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

export default AgentChatBox
