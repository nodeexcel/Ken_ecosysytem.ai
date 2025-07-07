import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { SketchPicker } from "react-color"
import tara from '../assets/svg/tara_logo.svg'
import constance from '../assets/svg/constance_logo.svg'
import tom from '../assets/svg/tom_logo.svg'
import seth from '../assets/svg/seth_logo.svg'
import calina from '../assets/svg/calina_logo.svg'
import rebecca from '../assets/svg/rebecca_logo.svg'
import emile from '../assets/svg/emile_logo.svg'
import rima from '../assets/svg/rima_logo.svg'
import finn from '../assets/svg/finn_logo.svg'
import sandro from '../assets/svg/sandro_logo.svg'
import { DeleteIcon, UploadIcon } from "../icons/icons"
import { testAgentChat } from "../api/appointmentSetter"
import { v4 as uuidv4 } from 'uuid';

function CustomizeAgent({ customIntegartion, setCustomStatus }) {
    const [activeTab, setActiveTab] = useState("customize")
    const [formData, setFormData] = useState({ display_name: "", color: "#F1F1F1", avatar: "constance", introduction_to_chat: "", domains_name: "" })
    const [errors, setErrors] = useState({})
    const [colorPickerStatus, setColorPickerStatus] = useState(false)
    const colorPickerRef = useRef()

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([]);
    const [chat_id, setChatId] = useState("")
    const [chatbotIntegrate, setChatbotIntegrate] = useState("chat_bubble")
    const [code, setCode] = useState("")

    const agentChatRef = useRef()

    useEffect(() => {
        if (formData.avatar) {
            setMessages([
                { id: uuidv4(), sender: "agent", isUser: false, text: `I'm ${(formData.avatar.slice(0, 1).toUpperCase()) + formData.avatar.slice(1)}, your appointment setter. How can I assist you today?` }
            ])
        }


    }, [formData])

    useEffect(() => {
        setChatId(uuidv4())
    }, [])

    useEffect(() => {
        if (agentChatRef.current) {
            agentChatRef.current.scrollTo({
                top: agentChatRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);


    const closeModal = () => {
        setPreviewAgent("")
    }
    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = { id: uuidv4(), sender: "user", isUser: true, text: message };
        setMessages(prev => [...prev, userMessage]);
        setMessage("");

        const typingMessage = {
            id: 'typing', sender: "agent", isUser: false, text: "..."
        };
        setMessages((prev) => [...prev, typingMessage]);

        try {
            const payload = { message, chat_id };
            const response = await testAgentChat(payload, previewAgent);
            if (response?.status === 200 && response?.data?.response) {
                const agentMessage = {
                    id: uuidv4(),
                    isUser: false,
                    sender: "agent",
                    text: response.data.response
                };

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === "typing" ? agentMessage : msg
                    )
                );
            } else {
                setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
            }
        } catch (error) {
            console.error(error);
            setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
        }
    };



    const avatarMap = {
        tara, constance,
        tom,
        seth, calina, rebecca, emile, rima, finn, sandro
    };


    const tabs = [{ label: "Customize", key: "customize" }, { label: "Share", key: "share" }]

    const avatarList = [
        { key: "tara", icon: tara }, { key: "constance", icon: constance }, { key: "rebecca", icon: rebecca },
        { key: "emile", icon: emile }, { key: "rima", icon: rima }, { key: "calina", icon: calina },
        { key: "seth", icon: seth }, { key: "tom", icon: tom }, { key: "finn", icon: finn }, { key: "sandro", icon: sandro }
    ]

    const chatbotOptions = [{
        key: "chat_bubble", label: "Display a chat bubble", content: "Add a floating chat icon at the bottom of your site, perfect for a discreet and always-accessible chatbot.", is_recommended: true
    }, {
        key: "iframe", label: "Integrate via iframe", content: "Embed the chatbot directly on a page of your site, always visible without needing to click on a bubble.", is_recommended: false
    }]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const handleChangeColor = (e) => {
        setFormData((prev) => ({ ...prev, color: e.hex }))
        setErrors((prev) => ({ ...prev, color: '' }))
        console.log(e, "color")
        setColorPickerStatus(false)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setColorPickerStatus(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-[80%] h-full max-h-[80%] overflow-auto p-6 relative shadow-lg">
                <button
                    className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                        setCustomStatus(false)
                    }}
                >
                    <X size={20} />
                </button>

                <div className='flex flex-col gap-6 py-4'>
                    <div className="flex items-center gap-3">
                        <div className="rounded-[12px] p-[10px] bg-[#EBEFFF]">
                            {customIntegartion.icon}
                        </div>
                        <h1 className="text-[#1E1E1E] text-[20px] font-[600]">Website</h1>
                        <div className="bg-[#F2F2F7] p-[4px] flex rounded-[13px]">
                            {tabs.map((each) => (
                                <p key={each.key} onClick={() => setActiveTab(each.key)} className={`py-[7px] cursor-pointer text-[16px] font-[500] px-[20px] ${activeTab === each.key ? 'bg-[#fff] rounded-[10px] text-[#1E1E1E]' : 'text-[#5A687C]'}`}>{each.label}</p>
                            ))}
                        </div>
                    </div>
                    {activeTab === "customize" ? <div className="w-full flex gap-5">
                        <div className="w-[60%]">
                            <h1 className="text-[#1E1E1E] font-[600] text-[16px] pb-4">Personalize your Chatbot</h1>
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <label className="text-sm font-medium text-[#1e1e1e]">
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            name='display_name'
                                            value={formData?.display_name}
                                            onChange={handleChange}
                                            className={`w-full bg-white p-2 rounded-lg border ${errors.display_name ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                            placeholder="Finn"
                                        />
                                        {errors.display_name && <p className="text-red-500 text-sm mt-1">{errors.display_name}</p>}
                                    </div>
                                    <div ref={colorPickerRef} className="flex flex-col gap-1.5 w-full">
                                        <label className="text-sm font-medium text-[#1e1e1e]">
                                            Color
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name='color'
                                                value={formData?.color.slice(1)}
                                                onFocus={() => setColorPickerStatus(true)}
                                                className={`w-full bg-white py-2 px-14 cursor-pointer rounded-lg border ${errors.color ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                                placeholder="ffffff"
                                            />
                                            <div className={`w-[22px] h-[22px] top-2 absolute left-2 rounded-[4px]`} style={{ backgroundColor: formData?.color }}></div>
                                            <hr style={{ color: "#E1E4EA", width: "17px", transform: "rotate(-90deg)", position: "absolute", top: 19, left: 35 }} />
                                            {colorPickerStatus && <div className="absolute z-[9999]"><SketchPicker onChange={handleChangeColor} /></div>}
                                        </div>
                                        {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label className="text-sm font-medium text-[#1e1e1e]">
                                        Avatar
                                    </label>
                                    <div className="flex items-center gap-5">
                                        <div className="border border-[#E1E4EA] justify-around flex flex-col items-center w-[148px] h-[148px] p-[10px] rounded-[10px]">
                                            <div className="rounded-full h-[63px] w-[63px] flex justify-center items-center bg-[#F0EFFF]">
                                                <img src={avatarMap[formData.avatar]} alt={formData.avatar} className="object-fit" />
                                            </div>
                                            <DeleteIcon />
                                        </div>
                                        <div className="h-[148px] border-r border-[#E1E4EA]"></div>
                                        <div className="flex gap-2 flex-wrap">
                                            {avatarList.map((each) => (
                                                <div key={each.key} onClick={() => setFormData((prev) => ({ ...prev, avatar: each.key }))} className={`rounded-full h-[63px] w-[63px] cursor-pointer ${formData.avatar === each.key && 'border-2 border-[#675FFF]'} flex justify-center items-center bg-[#F0EFFF]`}>
                                                    <img src={each.icon} alt={each.key} className="object-fit" />
                                                </div>
                                            ))}
                                            <div className="rounded-full h-[63px] w-[63px] flex justify-center items-center bg-[#F0EFFF]">
                                                <UploadIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label className="text-sm font-medium text-[#1e1e1e]">
                                        Introduction to Chat
                                    </label>
                                    <textarea
                                        name='introduction_to_chat'
                                        onChange={handleChange}
                                        value={formData?.introduction_to_chat}
                                        rows={4}
                                        className={`w-full bg-white p-2 rounded-lg border  ${errors.introduction_to_chat ? 'border-red-500' : 'border-[#e1e4ea]'} resize-none focus:outline-none focus:border-[#675FFF]`}
                                        placeholder="Hello"
                                    />
                                    {errors.introduction_to_chat && <p className="text-red-500 text-sm mt-1">{errors.introduction_to_chat}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label className="text-sm font-medium text-[#1e1e1e]">
                                        Domains name
                                    </label>
                                    <input
                                        type="text"
                                        name='domain_name'
                                        value={formData?.domain_name}
                                        onChange={handleChange}
                                        className={`w-full bg-white p-2 rounded-lg border ${errors.domain_name ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                        placeholder="Enter domain name"
                                    />
                                    {errors.domain_name && <p className="text-red-500 text-sm mt-1">{errors.domain_name}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="w-[40%]">
                            <h1 className="text-[#1E1E1E] font-[600] text-[16px]">Preview</h1>
                            <div className="py-6 flex gap-6 w-full">
                                <div className="h-[466px] relative border border-[#E1E4EA] rounded-lg">
                                    <div className="bg-[#F5F7FF] rounded-y-lg rounded-t-lg p-2 mb-4 flex items-center gap-3">
                                        <div className="w-[45px] h-[45px] rounded-full bg-[#fff] flex items-center justify-center">
                                            <img src={avatarMap[formData.avatar]} alt={formData.avatar} className="object-fit" />
                                        </div>
                                        <div className="font-[600] text-[18px] text-[#1E1E1E]">{`${(formData.avatar.slice(0, 1).toUpperCase()) + formData.avatar.slice(1)} `} (AI Agent)</div>
                                    </div>
                                    <div className="flex flex-col justify-between h-full">
                                        <div ref={agentChatRef} className="px-4 overflow-auto max-h-[300px] mb-2">
                                            {messages.map((msg,) => (
                                                <div key={msg.id} className="flex flex-col">
                                                    {!msg.isUser && (
                                                        <div className="flex items-center gap-2 mb-1 mr-auto w-fit max-w-[80%]">
                                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] font-[600] text-[#675FFF]">E</div>
                                                            <span className="text-sm font-medium">Ecosystem.ai</span>
                                                        </div>
                                                    )}
                                                    {msg.isUser && (
                                                        <div className="flex items-center gap-1 mt-1 ml-auto w-fit max-w-[80%]">
                                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[11px] text-[#675FFF] font-[600]">U</div>
                                                            <span className="text-xs text-gray-500">User</span>
                                                        </div>
                                                    )}
                                                    {msg.id === "typing" ? <div className="pl-[40px] pt-3 flex "><span className="three-dots" /></div> : <div
                                                        className={`w-fit max-w-[80%] text-[12px] font-[400] p-3 rounded-lg ${!msg.isUser ? "mr-auto my-1 bg-[#F2F2F7] text-[#5A687C]" : "my-1 ml-auto bg-[#675FFF] text-white"
                                                            }`}
                                                    >
                                                        <p className="text-sm">{msg.text}</p>
                                                    </div>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-auto p-4 flex gap-2 bg-[#F0EFFF] rounded-b-lg absolute bottom-0">
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Type your message here..."
                                                className="flex w-full border bg-white border-[#E1E4EA] focus:outline-none focus:border-[#675FFF] rounded-lg px-4 py-2 text-[#5A687C]"
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                className="px-6 py-2 font-[500] text-[16px] bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white rounded-lg"
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div> :
                        <div className="w-full flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h1 className="text-[#1E1E1E] font-[600] text-[16px] pb-4">Integrate your chatbot into your website</h1>
                                <p className="text-[#FF9500] font-[400] text-[16px]">Action required from you</p>
                            </div>
                            <ul className="flex w-full gap-2">
                                {chatbotOptions.map((each) => (
                                    <li key={each.key} className={`border w-[50%] ${each.key === chatbotIntegrate ? 'border-[#675FFF]' : 'border-[#E1E4EA]'} bg-[#fff] flex cursor-pointer gap-3 p-[12px] rounded-[12px]`} onClick={() => setChatbotIntegrate(each.key)}>
                                        <div className="flex gap-3 pl-2">
                                            <div className="pt-5">
                                                <input style={{ accentColor: "#675FFF", width: "20px", height: "20px" }} className="" type="radio" checked={each.key === chatbotIntegrate} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between py-1">
                                                    <h2 className="text-[#1E1E1E] text-[16px] font-[500]">{each.label}</h2>
                                                    {each.is_recommended && <p className="text-[#1E1E1E] font-[400] text-[14px] rounded-[40px] py-[8px] px-[12px] bg-[#F0EFFF]">Recommended</p>}
                                                </div>
                                                <p className="text-[#5A687C] text-[14px] font-[400]">{each.content}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col gap-3">
                                <h1 className="text-[#1E1E1E] font-[600] text-[16px]">Configuration</h1>
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-[#1E1E1E] font-[600] text-[14px]">Install the following code on your site</h2>
                                    <p className="text-[#5A687C] font-[400] text-[12px]">Place the code just before the closing tag on any page where you want to activate the chatbot.</p>
                                </div>
                                <>
                                    <div className="flex items-center justify-between pb-1">
                                        <p className="text-[#1E1E1E] font-[500] text-[14px]">Add Code Here</p>
                                        <button className="border-[1.5px] cursor-pointer rounded-[7px] py-[4px] px-[14px] border-[#5F58E8] text-[#675FFF] text-[16px] font-[500]">Copy</button>
                                    </div>
                                    <textarea
                                        name='code'
                                        onChange={(e) => setCode(e.target.value)}
                                        value={code}
                                        rows={8}
                                        className={`w-full text-[16px] font-[400] bg-white p-2 rounded-lg border border-[#e1e4ea] resize-none focus:outline-none focus:border-[#675FFF]`}
                                        placeholder={`<script>document.addEventListener("DOMContentLoaded", ( ) { var e = document.createElement("iframe"); e.src =
"https://applimova.ai/embededChatbot?id=6863d9859ecd340a75d9b215"; const i = innerWidth < 768, o = i ? "90%" : "420px", t = i ?
"calc(lOOvh - 100px)" : "600px"; Object.assign(e.style, { position: "fixed", bottom: right: i ? "5%" "30px", border: "none", zlndex: "1000",
width: o, height: t, borderRadius: "IOpx" }); document.body.appendChild(e); window.addEventListener("message", n { const d =
n.data; if (d && typeof d === "object") { if (d.chatbotOpen === true) { e.style.width = o, e.style.height = t } else if (d.chatbotOpen
=== false) { e.style.width = "50px", e.style.height = "70px" } } }) });
< /script>`}
                                    />
                                </>
                            </div>
                        </div>}
                </div>
            </div>
        </div >
    )
}

export default CustomizeAgent
