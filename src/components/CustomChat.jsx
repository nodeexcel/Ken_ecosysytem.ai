import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { GoDotFill } from "react-icons/go"
import { v4 as uuidv4 } from 'uuid';
import { BulbIcon, Delete, DislikeIcon, Duplicate, Edit, EditIcon, FlashIcon, ImageChatIcon, LikeIcon, MicChatIcon, PaperClipChatIcon, SearchChatIcon, SearchIcon, SendIcon, SpeakerIcon, StarsIcon, ThreeDots, WebSearchChatIcon } from "../icons/icons";
import { useSelector } from "react-redux";
import { formatTimeAgo } from "../utils/TimeFormat";
import { SelectDropdown } from "./Dropdown";
import { useTranslation } from "react-i18next";


const CustomChat = ({ listedProps }) => {
    const { t } = useTranslation();
    console.log(listedProps)
    const { header, label, description,
        form,
        initialMessage,
        agentName,
        agentImg,
        headerLogo } = listedProps

    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState({})
    const [messages, setMessages] = useState([])
    const [loadingChats, setLoadingChats] = useState(false)


    const handleChange = (e) => {
        const { name, value } = e.target;
    }

    const sendToSocket = () => {
        console.log(WebSocket.OPEN, WebSocket.CONNECTING)

        const messageToSend = input
        if (!messageToSend) return

        try {
            console.log(socketRef)
            if (socketRef.current === null) {
                socketRef.current = new WebSocket(`${newwebsocketurl}?token=${localStorage.getItem("token")}`)
            }
            if (socketRef.current?.readyState == WebSocket.OPEN) {
                socketRef.current.send(messageToSend)
            }
            else if (socketRef.current?.readyState == WebSocket.CONNECTING) {
                console.log("second timeeeeeeeeee")
                socketRef.current.onopen = () => {
                    socketRef.current.send(messageToSend)
                }
            }
            else {
                socketRef.current = new WebSocket(`${newwebsocketurl}?token=${localStorage.getItem("token")}`)
                socketRef.current.onopen = () => {
                    socketRef.current.send(messageToSend)
                }
                console.warn('Second WebSocket not ready to send')
            }

            const agentMessage = {
                id: uuidv4(),
                isUser: true,
                content: messageToSend,
                sender: "User",
                time: formatTimeAgo(new Date()),
                status: "Read",
            };
            setMessages((prev) => [...prev, agentMessage]);

            socketRef.current.onmessage = async (event) => {
                const responseText = event.data
                console.log('💬 Bot:', responseText)
                const parsedMessage = JSON.parse(responseText);
                console.log('💬 Bot:', parsedMessage)

                const userMessage = {
                    id: uuidv4(),
                    isUser: false,
                    content: parsedMessage?.agent,
                    sender: "Ecosystem.ai",
                    time: formatTimeAgo(parsedMessage?.message_at),
                    status: "Read",
                };

                setMessages((prev) => [...prev, userMessage]);
                // handleGetAccountChats()
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.close()
                }
            }

        } catch (err) {
            console.error('Failed to send message to second socket:', err)
        }
    }

    const sendToSocket2 = () => {
        console.log(WebSocket.OPEN, WebSocket.CONNECTING)

        const messageToSend = input
        if (!messageToSend) return

        try {
            console.log(socket2Ref)
            if (socket2Ref.current?.readyState == WebSocket.OPEN) {
                socket2Ref.current.send(messageToSend)
            }
            else if (socket2Ref.current?.readyState == WebSocket.CONNECTING) {
                console.log("second timeeeeeeeeee")
                socket2Ref.current.onopen = () => {
                    socket2Ref.current.send(messageToSend)
                }
            }
            else {
                console.warn('Second WebSocket not ready to send')
                socket2Ref.current = new WebSocket(`${websocketurl}/${activeConversation}?token=${localStorage.getItem("token")}`)
                socket2Ref.current.onopen = () => {
                    socket2Ref.current.send(messageToSend)
                }
            }

            const agentMessage = {
                id: uuidv4(),
                isUser: true,
                content: messageToSend,
                sender: "User",
                time: formatTimeAgo(new Date()),
                status: "Read",
            };
            setMessages((prev) => [...prev, agentMessage]);

            socket2Ref.current.onmessage = async (event) => {
                const responseText = event.data
                console.log('💬 Bot:', responseText)
                const parsedMessage = JSON.parse(responseText);
                console.log('💬 Bot:', parsedMessage)

                const userMessage = {
                    id: uuidv4(),
                    isUser: false,
                    content: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
                    sender: "Ecosystem.ai",
                    time: formatTimeAgo(parsedMessage?.message_at),
                    status: "Read",
                };

                setMessages((prev) => [...prev, userMessage]);
                // handleGetAccountChats()
            }

        } catch (err) {
            console.error('Failed to send message to second socket:', err)
        }
    }

    useEffect(() => {
        const userMessage = {
            id: uuidv4(),
            isUser: false,
            content: initialMessage,
            sender: "Ecosystem.ai",
            time: formatTimeAgo(new Date()),
            status: "Read",
        };
        setMessages([userMessage])

    }, [initialMessage])


    const handleSend = (e) => {
        e.preventDefault()
        setInput("")
    }


    // if (loading) return <p className='flex justify-center items-center h-[100vh]'><span className='loader' /></p>



    return (
        <div className="w-full py-4 h-screen pr-2 flex flex-col gap-3">
            <h1 className="text-[24px] font-[600] text-[#1E1E1E]">{header}</h1>
            <div className="h-full overflow-auto flex pb-2 flex-col">
                <div className="flex bg-white h-full rounded-2xl border-[#E1E4EA] border">
                    {/* Sidebar */}
                    <div className="w-[300px] overflow-auto bg-[#FFFFFF] h-full flex flex-col gap-2 rounded-l-2xl border-[#E1E4EA] border-r">
                        <div className="flex flex-col text-center justify-center items-center gap-2 p-[25px]">
                            <div className="bg-[#F0EFFF] rounded-[10px] h-[75px] w-[75px] flex items-center justify-center">
                                <img src={headerLogo} alt={header} className="object-fit" />
                            </div>
                            <h1 className="text-[#000000] pt-2 font-[600] text-[16px]">{label}</h1>
                            <h1 className="text-[#1E1E1E] font-[400] text-[14px]">{description}</h1>
                        </div>
                        <hr style={{ color: "#E1E4EA" }} />
                        <div className="flex flex-col gap-4 px-5 py-3">
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-sm font-medium text-[#1e1e1e]">
                                    {form.label_1}
                                </label>
                                <input
                                    type="text"
                                    name='additional_questions'
                                    value={formData?.additional_questions}
                                    onChange={handleChange}
                                    className={`w-full bg-white p-2 rounded-lg border ${errors.additional_questions ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                    placeholder={form.placeholder_1}
                                />
                                {errors.additional_questions && <p className="text-red-500 text-sm mt-1">{errors.additional_questions}</p>}
                            </div>
                            {(form?.label_3 && !form?.options) &&
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label className="text-sm font-medium text-[#1e1e1e]">
                                        {form.label_3}
                                    </label>
                                    <input
                                        type="text"
                                        name='purpose'
                                        value={formData?.purpose}
                                        onChange={handleChange}
                                        className={`w-full bg-white p-2 rounded-lg border ${errors.purpose ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                        placeholder={form.placeholder_3}
                                    />
                                    {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
                                </div>
                            }
                            {form?.options &&
                                <div className="flex flex-col items-start gap-1.5 max-w-[498px]">
                                    <label className="font-medium text-[#1e1e1e] text-sm">{form.label_3}</label>
                                    <SelectDropdown
                                        name="tone"
                                        options={form.options}
                                        value={formData?.tone}
                                        onChange={(updated) => {
                                            console.log(updated)
                                            setFormData((prev) => ({
                                                ...prev,
                                                tone: updated,
                                            }))
                                            setErrors((prev) => ({ ...prev, tone: '' }))
                                        }}
                                        placeholder={form.placeholder_3}
                                        className="w-full"
                                        errors={errors}
                                    />
                                    {errors.tone && <p className="text-red-500 text-sm mt-1">{errors.tone}</p>}
                                </div>
                            }
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-sm font-medium text-[#1e1e1e]">
                                    {form.label_2}
                                </label>
                                <textarea
                                    name='custom_instructions'
                                    onChange={handleChange}
                                    value={formData?.custom_instructions}
                                    rows={4}
                                    className={`w-full bg-white p-2 rounded-lg border  ${errors.custom_instructions ? 'border-red-500' : 'border-[#e1e4ea]'} resize-none focus:outline-none focus:border-[#675FFF]`}
                                    placeholder={form.label_2}
                                />
                                {errors.custom_instructions && <p className="text-red-500 text-sm mt-1">{errors.custom_instructions}</p>}
                            </div>
                            <button className="px-5 cursor-pointer rounded-[7px] py-[7px] text-center bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white">{t("rima.generate")}</button>
                        </div>
                    </div>
                    {/* Main Content */}
                    {loadingChats ? <div className="flex justify-center items-center w-full"><span className="loader" /> </div> : <div className="flex-1 h-full max-w-[80%] mx-auto flex justify-between flex-col pt-2">
                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-6">
                                {messages?.length > 0 && messages.map((message) => (
                                    <div key={message.id} className="flex flex-col">
                                        {!message.isUser && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <div>
                                                    <img src={agentImg} alt={agentName} className="object-fit" />
                                                </div>
                                                <p className="text-[12px] font-[600] text-[#5A687C]">{agentName}</p>
                                                <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                                    {message.time}</span>
                                            </div>
                                        )}

                                        {message.isUser && (
                                            <div className="flex items-center gap-1 mt-1 ml-auto">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] text-[#675FFF] font-[600]">{userDetails?.user?.firstName[0]}</div>
                                                <div className="text-[12px] font-[600] text-[#5A687C]">{userDetails?.user?.firstName}</div>
                                                <span className="text-[12px] text-[#5A687C] flex items-center gap-1"><GoDotFill color="#E1E4EA" />
                                                    {message.time}</span>
                                            </div>
                                        )}

                                        {message.id === "typing" ? <div className="pl-[50px] pt-3 flex "><span className="three-dots" /></div> : <div
                                            className={`max-w-[70%] w-fit text-[12px] font-[400] p-3 ${!message.isUser ? "my-1 bg-[#F2F2F7] text-[#5A687C] rounded-b-[10px] rounded-r-[10px]" : "ml-auto my-1 bg-[#675FFF] text-[#fff] rounded-b-[10px] rounded-l-[10px]"
                                                }`}
                                        >
                                            <p className="text-[16px] !whitespace-pre-wrap">{message.content}</p>
                                        </div>}
                                        {message.id !== "typing" && !message.isUser && <div className="my-1 flex items-center gap-2">
                                            <StarsIcon />
                                            <Duplicate />
                                            <Edit />
                                        </div>}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center w-full gap-2 pt-5">
                                <hr style={{ width: "40%", color: "#E1E4EA" }} />
                                <p className="text-[#5A687C] text-[12px] whitespace-nowrap font-[400]">{t("rima.previous_generation")}</p>
                                <hr style={{ width: "40%", color: "#E1E4EA" }} />
                            </div>

                            <div className="flex items-center justify-center pt-10 gap-1.5">
                                <FlashIcon />
                                <p className="text-[#1E1E1E] text-[12px] font-[400]">{t("rima.generations_appear")}</p>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default CustomChat