import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { GoDotFill } from "react-icons/go"
import { v4 as uuidv4 } from "uuid"
import {
  BulbIcon,
  Delete,
  DislikeIcon,
  Duplicate,
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
} from "../icons/icons"
import PdfIcon from "../assets/svg/pdf.svg";
import { useSelector } from "react-redux"
import { formatTimeAgo } from "../utils/TimeFormat"
import { useTranslation } from "react-i18next"
import ChatInput from "./ChatInput"
import { useLocation } from "react-router-dom"
import Edit from "../assets/svg/edit-01.svg"
import chat from "../assets/svg/bubble 2, message.svg"
import ThreeDots from "../assets/svg/Icon.svg"

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
  const [showModal , setShowModal] = useState(false);

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

  const filteredChatList = chatList?.filter((conversation) => {
    const searchTerm = searchQuery.toLowerCase()
    const conversationName = (conversation.name || t("account_chat")).toLowerCase()
    return conversationName.includes(searchTerm)
  })

  const sendToSocket = (msgObject) => {
    console.log(WebSocket.OPEN, WebSocket.CONNECTING)
    // const messageToSend = input
    const directValue = ({message:input})
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

        const userMessage = {
          id: uuidv4(),
          isUser: false,
          content: parsedMessage?.agent,
          sender: "Ecosystem.ai",
          time: formatTimeAgo(parsedMessage?.message_at),
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

        const userMessage = {
          id: uuidv4(),
          isUser: false,
          content: parsedMessage?.agent ?? parsedMessage?.error,
          sender: "Ecosystem.ai",
          time: formatTimeAgo(parsedMessage?.message_at),
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

  const suggestionsChat = [
    { label: staticSuggestions[0].label, icon: <BulbIcon />, key: staticSuggestions[0].key, agent_type: staticSuggestions[0].agent_type },
    { label: staticSuggestions[1].label, icon: <EditIcon />, key: staticSuggestions[1].key, agent_type: staticSuggestions[1].agent_type },
    { label: staticSuggestions[2].label, icon: <SearchChatIcon />, key: staticSuggestions[2].key, agent_type: staticSuggestions[2].agent_type },
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
    <div className="w-full h-[calc(100vh-90px)] pr-2 flex flex-col gap-3">
      <h1 className="text-[24px] font-[600] text-[#1E1E1E]">{t("seo.chat")}</h1>
      <div className="h-full overflow-auto flex pb-2 flex-col">
        <div className="flex bg-white h-full rounded-2xl border-[#E1E4EA] border">
          {/* Sidebar */}
          <div className={`${showModal ? "w-[67px]" : "w-[257px]"}  px-4 pt-4 pb-6 bg-[#FFFFFF] h-full flex flex-col gap-2 rounded-l-2xl border-[#00000029] border-r-[0.5px]`}>
            <div className={`max-h-[32px] flex ${showModal ? "flex-col mt-4" :"flex-row"} justify-center gap-[16px]`}>
              <button 
              onClick={() => setShowModal(!showModal)}
              className="w-[32px] h-full rounded-[8px] py-[6px] justify-center align-center gap-[6px] px-[6px] border-[0.5px] border-[#00000029] cursor-pointer">
                <Menu className="w-[16px] h-[16px]" />
              </button>
              <div
                className={`
    relative flex flex-row items-center
    ${showModal ? "w-[32px]" : "w-[177px]"} h-[32px]
    bg-white rounded-[8px]
    border border-[#00000029]
    px-[8px] pr-[6px] py-[6px]
                `}
                onClick={() => setShowModal(false)}
              >
                <SearchIcon className="text-[#5A687C] w-4 h-4 "/>

            { !showModal &&   <input
                  type="text"
                  placeholder={t("seo.search_chat_placeholder")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="
      ml-2 w-full bg-transparent outline-none
      text-[#5A687C] text-[13px] placeholder:text-[#5A687C] leading-none"
                />
                }
              </div>
            </div>

              <button
                className={`flex py-[6px] ${showModal ? "w-[32px] mt-8 px-[6px]" : "w-[225px] px-[10px] "} h-8 rounded-[8px] gap-[6px] border-[0.5px] border-[#00000029] justify-center align-center flex-row text-[13px] cursor-pointer`}
                onClick={handleSelectNewChat}>
                  <img src={Edit}  className="w-[16px] h-[16px]" chat={true} />{!showModal && <span>{t("seo.new_chat")}</span>}
              </button>

            <hr className={`mx-auto w-full  ${showModal ? "max-w-[32px]" : "max-w-[225px]"} border-[#E2E4E9] border-[0.5px]`}/>


        {!showModal  && 
            <div className="w-[240px] h-full max-h-[90%] overflow-y-auto">
              {/* <div className="flex px-4 pb-4">
                <button
                  onClick={handleSelectNewChat}
                  className="text-[#0A0D14] font-[500] px-[10px] border-[0.5px] border-[#00000029] rounded-[8px] cursor-pointer py-[6px] w-full text-[13px] flex  justify-center gap-[6px]"
                >
                  <Edit chat={true} /> <span>{t("seo.new_chat")}</span>
                </button>
              </div> */}
              {/* <hr style={{ color: "#E1E4EA" }} /> */}
              {/* <div ref={moreActionsRef} className="px-4 py-3">
                {loadingChatsList ? (
                  <div className="flex justify-center p-4 items-center w-full">
                    <span className="loader" />{" "}
                  </div>
                ) : filteredChatList?.length > 0 ? (
                  filteredChatList?.slice().reverse().map((conversation, index) => (
                    <div key={index} className="flex relative items-center">
                      <div
                        className={`flex w-full justify-between group items-center gap-3 my-1 py-[6px] px-4 cursor-pointer ${activeConversation === conversation.chat_id
                          ? "bg-[#F0EFFF] text-[#1E1E1E] rounded-lg"
                          : "hover:bg-[#F0EFFF]  hover:rounded-lg "
                          }`}
                        onClick={() => {
                          handleSelectChat(conversation.chat_id)
                          setActiveDropdown(null)
                        }}
                      >
                        <p
                          className={`text-[14px] truncate font-[400] group-hover:text-[#1E1E1E] ${activeConversation === conversation.chat_id ? "text-[#1E1E1E]" : "text-[#5A687C]"}`}
                        >
                          {conversation.name === null ? `${t("account_chat")}` : conversation.name}
                        </p>
                      </div>
                    </div>
                  ))
                ) : searchQuery ? (
                  <p className="text-[#5A687C] font-[400] text-[12px] text-center pt-8">{t("tara.no_chat_history")}</p>
                ) : (
                  <p className="text-[#5A687C] font-[400] text-[12px] text-center pt-8">{t("tara.no_chat_history")}</p>
                )}
              </div> */}
              
              <div ref={moreActionsRef} className="px-1 py-3">

  {loadingChatsList ? (
    <div className="flex justify-center p-4 items-center w-full">
      <span className="loader" />
    </div>
  ) : filteredChatList?.length > 0 ? (

    filteredChatList
      ?.slice()
      .reverse()
      .map((conversation, index) => (
        
        <div
          key={index}
          className={`flex items-center justify-between
                     w-[225px] h-[32px]
                     px-3 py-2
                     gap-2
                     cursor-pointer mb-2
                     ${activeConversation === conversation.chat_id
                          ? "bg-[#F0EFFF] text-[#1E1E1E] rounded-full"
                          : "hover:bg-[#F0EFFF]  hover:rounded-full "
                          }
                        `}
          onClick={() => {
            handleSelectChat(conversation.chat_id);
            setActiveDropdown(null);
          }}
        >
          {/* Chat icon + text */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={chat}
              alt="chat"
              className="w-4 h-4"
            />

            <p
              className="truncate text-[12px] 
                         font-medium leading-[140%]
                         tracking-[-0.02em] text-[#1E1E1E]"
            >
              {conversation.name === null
                ? t("account_chat")
                : conversation.name}
            </p>
          </div>

          {/* Three dots */}
                        <button
                          onClick={() => handleDropdownClick(index)}
                    className="p-1 rounded">
            <img src={ThreeDots} alt="menu" className="w-4 h-4" />
                        </button>
                        {activeDropdown === index && (
                          <div className="relative top-full right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 z-[99999]">
                            <div>
                              <button
                                className="flex w-full group text-left cursor-pointer px-1 py-2 text-[13px] justify-center text-[#5A687C] font-[500]"
                                onClick={() => {
                                  setEditData(conversation)
                                  setName(conversation?.name !== null ? conversation?.name : "Accounting Chat")
                                  setActiveDropdown(null)
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="group-hover:hidden">
                                    <img src={Edit} className="w-[16px] h-[16px]" />
                                  </div>{" "}
                                  <div className="hidden group-hover:block">
            <img src={Edit}  className="w-[16px] h-[16px]" status={true} />
                                  </div>{" "}
                                  <span>{t("rename")}</span>{" "}
                                </div>
                              </button>
                              <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
      <button
        className="flex w-full cursor-pointer text-left px-1 py-2 
                   text-[13px] justify-center  text-red-600 font-[500]"
                                  onClick={async () => {
                                    await handleDelete(conversation.chat_id)
                                    setActiveDropdown(null)
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    {<Delete />} <span>{t("delete")}</span>{" "}
                                  </div>
                                </button>
                            </div>
                          </div>
                        )}
                      </div>

                  ))
                ) : searchQuery ? (
                  <p className="text-[#5A687C] font-[400] text-[12px] text-center pt-8">{t("tara.no_chat_history")}</p>
                ) : (
                  <p className="text-[#5A687C] font-[400] text-[12px] text-center pt-8">{t("tara.no_chat_history")}</p>
                )}
              </div>
            </div>
            }
          </div>
          {/* Main Content */}
          {openChat ? (
            loadingChats ? (
              <div className="flex justify-center items-center w-full">
                <span className="loader" />{" "}
              </div>
            ) : (
              <div className="flex-1 h-full max-w-[80%] mx-auto flex justify-between flex-col pt-2">
                {/* Messages */}
                <div ref={chatRef} className="flex-1 p-4 overflow-y-auto">
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
                                {!message.isUser && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <div>
                                      <img
                                        src={agentLogo || "/placeholder.svg"}
                                        alt={agentName}
                                        className="object-fit"
                                      />
                                    </div>
                                    <p className="text-[12px] font-[600] text-[#5A687C]">{agentName}</p>
                                    <span className="text-[12px] text-[#5A687C] flex items-center gap-1">
                                      <GoDotFill color="#E1E4EA" className="flex-shrink-0" />
                                      {message.time}
                                    </span>
                                  </div>
                                )}

                                {message.isUser && (
                                  <div className="flex items-center gap-1 mt-1 ml-auto">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] text-[#675FFF] font-[600]">
                                      {userDetails?.user?.firstName[0]}
                                    </div>
                                    <div className="text-[12px] font-[600] text-[#5A687C]">
                                      {userDetails?.user?.firstName}
                                    </div>
                                    <span className="text-[12px] text-[#5A687C] flex items-center gap-1">
                                      <GoDotFill color="#E1E4EA" />
                                      {message.time}
                                    </span>
                                  </div>
                                )}

                                <div
                                  className={`max-w-[70%] w-fit text-[12px] font-[400] p-3 ${!message.isUser
                                      ? "my-1 bg-[#F2F2F7] text-[#5A687C] rounded-b-[10px] rounded-r-[10px]"
                                      : "ml-auto my-1 bg-[#675FFF] text-[#fff] rounded-b-[10px] rounded-l-[10px]"
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

                                {message.id !== "typing" && !message.isUser && (
                                  <div className="my-1 flex items-center gap-1">
                                    <button
                                      title="Copy message"
                                      onClick={() => handleCopyMessage(message.content)}
                                      className="hover:bg-gray-200 p-1 rounded"
                                    >
                                      <Duplicate />
                                    </button>
                                    <button
                                      title="Like"
                                      onClick={() => handleLikeMessage(message.id)}
                                      className={`hover:bg-gray-200 p-1 rounded ${likedMessages[message.id] ? "text-green-600" : ""}`}
                                    >
                                      <LikeIcon />
                                    </button>
                                    <button
                                      title="Dislike"
                                      onClick={() => handleDislikeMessage(message.id)}
                                      className={`hover:bg-gray-200 p-1 rounded ${dislikedMessages[message.id] ? "text-red-600" : ""}`}
                                    >
                                      <DislikeIcon />
                                    </button>
                                    <button
                                      title="Speak"
                                      onClick={() => handleSpeakMessage(message.content)}
                                      className="hover:bg-gray-200 p-1 rounded"
                                    >
                                      <SpeakerIcon />
                                    </button>
                                    <button
                                      title="Resend"
                                      onClick={() => handleResendMessage(message.content)}
                                      className="hover:bg-gray-200 p-1 rounded"
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
                      <div className="flex flex-col gap-6 p-5">
                        <div className="text-[#000000] text-[24px] font-[400]">
                          <h1>
                            {t("tara.hey")} <span style={{ color: nameColor }}>{agentName}</span>
                          </h1>
                          <h1>{t("tara.help_you")}</h1>
                        </div>
                        <div className="w-full flex flex-wrap gap-2">
                          {suggestionsChat.map((e) => (
                            <div
                              key={e.key}
                              onClick={() => handleSelectMessage(e.key)}
                              className="border cursor-pointer w-full md:w-[45%] lg:w-[32%] flex items-center gap-[12px] border-[#E1E4EA] p-[14px] rounded-[7px]"
                            >
                              <div>{e.icon}</div>
                              <p className="text-[#000000] font-[400] text-[14px]">{e.label}</p>
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
