import { useState } from "react"
import { X } from "lucide-react"
import sethImg from "../assets/svg/seth.svg"


const staticData = [{ label: "Agent Name", key: "agent_name", value: "Seth" }, { label: "Personality", key: "personality", value: "Friendly" }, { label: "Language(s)", key: "language", value: "English, French" },
{ label: "Emoji Frequency", key: "emoji_frequency", value: '25%' }, { label: "Business Offer", key: "business_offer", value: "Assist with booking appointments" }, { label: "Prompt Summary", key: "prompt_summary", value: "[Excerpt of the prompt]" },
{ label: "Trigger & Channel", key: "trigger_and_channel", value: "Systeme.io → Instagram" }, { label: "Delay", key: "delay", value: "15 Min" }, { label: "Calendar Integration", key: "calendar_integration", value: "Enabled" }
]

export default function AgentPreviewModal({ setPreviewAgent }) {
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([
        { sender: "agent", text: "I'm Seth, your appointment setter. How can I assist you today?" }
    ]);


    const closeModal = () => {
        setPreviewAgent(false)
    }

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { sender: "user", text: message }]);
            setMessage("");
        }
    };



    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[80vh] overflow-auto shadow-xl">
                <div className="p-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Preview Agent</h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <div className="px-6 pb-6 flex gap-6">
                    <div className="w-2/5 h-[466px] relative border border-[#E1E4EA] rounded-lg">
                        <div className="bg-[#F5F7FF] rounded-y-lg rounded-t-lg p-2 mb-4 flex items-center gap-3">
                            <div className="w-[45px] h-[45px] rounded-full bg-[#fff] flex items-center justify-center">
                                <img src={sethImg} alt="seth" className="w-[26.18px] h-[33.53px] object-contain" />
                            </div>
                            <div className="font-[600] text-[18px] text-[#1E1E1E]">Seth (AI Agent)</div>
                        </div>
                        <div className="flex flex-col justify-between h-full">
                            <div className="px-4 overflow-auto max-h-[300px] mb-2">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg mb-2 w-fit max-w-[80%] ${msg.sender === "agent" ? "bg-[#F1F1FF] mr-auto" : "bg-[#E7F9ED] ml-auto"
                                            }`}
                                    >
                                        <p className="text-[14px] text-[#1E1E1E]">{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-auto p-4 flex gap-2 bg-[#F0EFFF] rounded-b-lg absolute bottom-0">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="flex w-full border bg-white border-[#E1E4EA] rounded-lg px-4 py-2 text-[#5A687C]"
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

                    <div className="w-3/5 h-[466px] border rounded-[10px] border-[#E1E4EA] p-6">
                        <div className="space-y-2">
                            {staticData.map((e, i) => (
                                <div key={e.key} className={`flex ${staticData?.length - 1 !== i ? 'border-b border-[#E1E4EA] py-2' : ''} `}>
                                    <div className="w-1/3 text-[16px] font-[600] text-[#1E1E1E]">{e.label}:</div>
                                    <div className="w-2/3 text-[16px] font-[400] text-[#5A687C]">{e.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6 flex justify-end gap-4">
                    <button
                        onClick={closeModal}
                        className="px-6 py-2 font-[500] text-[16px] border-[1.5px] border-[#E1E4EA] rounded-lg text-[#5A687C]"
                    >
                        Back to Edit
                    </button>
                    <button className="px-6 py-2 font-[500] text-[16px] bg-[#675FFF] border-[1.5px] border-[#5F58E8]  text-white rounded-lg">
                        Create Agent
                    </button>
                </div>
            </div>
        </div>
    )
}
