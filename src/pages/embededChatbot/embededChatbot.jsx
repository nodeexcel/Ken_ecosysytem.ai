import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { chatWithChatId, createConversationByAgentId, getChatByChatId, getEmbededChatbotByAgentId } from "../../api/embededChatbot";

const EmbededChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loadingChats, setLoadingChats] = useState(false);
    const [response, setResponse] = useState(false);
    const [chatId, setChatId] = useState(null);
    const chatEndRef = useRef(null);
    const [searchParams] = useSearchParams();
    const agent_id = searchParams.get("id");
    const [botAvatar, setBotAvatar] = useState();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const getChatbotInfo = async (agent_id) => {
        try {
            setLoadingChats(true);
            const response = await getEmbededChatbotByAgentId(agent_id);

            if (response.status === 200) {
                const info = response.data.info;
                setResponse(info);
                const avatarUrl = info?.selected_avatar_url?.startsWith("http")
                    ? info.selected_avatar_url
                    : "https://cdn-icons-png.flaticon.com/512/4712/4712100.png";

                setBotAvatar(avatarUrl);
                setMessages((prev) => {
                    const alreadyHasGreeting = prev.some(
                        (m) => m.text === info.first_message && m.from === "bot"
                    );
                    if (!alreadyHasGreeting) {
                        return [
                            { text: info.first_message, from: "bot", isGreeting: true },
                            ...prev,
                        ];
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingChats(false);
        }
    };


    useEffect(() => {
        if (agent_id) {
            getChatbotInfo(agent_id);
        }
    }, [agent_id]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, from: "user" };
        setMessages((prev) => [...prev, userMessage]);
        const payload = { message: input };
        setInput("");

        try {
            setLoadingChats(true);

            let botResponse;

            if (!chatId) {
                const chatData = await createConversationByAgentId(
                    response.agent_id,
                    response.session_id,
                    payload
                );

                if (chatData.status === 201 && chatData.data) {
                    botResponse = chatData.data;
                    const newChatId = chatData.data.chat_id;
                    setChatId(newChatId);
                    localStorage.setItem("chatConversationId", newChatId);
                } else {
                    throw new Error("Failed to create new conversation.");
                }

            } else {
                const chatData = await chatWithChatId(chatId, payload);

                if (chatData.status === 201 && chatData.data) {
                    botResponse = chatData.data;
                } else {
                    throw new Error("Failed to send message with chatId.");
                }
            }

            if (botResponse?.ai_response) {
                const botMessage = {
                    text: botResponse.ai_response,
                    from: "bot",
                };
                setMessages((prev) => [...prev, botMessage]);
            }

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                { text: "⚠️ Failed to get a response from the bot.", from: "bot" },
            ]);
        } finally {
            setLoadingChats(false);
        }
    };

    const fetchExistingChats = async (id) => {
        try {
            setLoadingChats(true);
            const res = await getChatByChatId(id);

            if (res.status === 200 && Array.isArray(res.data.success)) {
                const formattedMessages = [];

                res.data.success.forEach((msgPair) => {
                    if (msgPair.user?.message) {
                        formattedMessages.push({
                            text: msgPair.user.message,
                            from: "user",
                        });
                    }
                    if (msgPair.ai?.response) {
                        formattedMessages.push({
                            text: msgPair.ai.response,
                            from: "bot",
                        });
                    }
                });
                setMessages((prev) => {
                    const greeting = prev.filter((m) => m.isGreeting);
                    return [...greeting, ...formattedMessages];
                });
            }
        } catch (error) {
            console.error("Error fetching existing chats:", error);
        } finally {
            setLoadingChats(false);
        }
    };


    useEffect(() => {
        const savedChatId = localStorage.getItem("chatConversationId");
        if (savedChatId) {
            setChatId(savedChatId);
            fetchExistingChats(savedChatId);
        }
    }, []);


    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="relative flex flex-col w-full h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 pt-2">
            <div className="mb-4 h-full mr-8">
                <main className="flex-1 overflow-y-auto px-2 md:px-4 py-6 flex flex-col gap-4 h-[77%]">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex items-end gap-2 ${msg.from === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {msg.from === "bot" && (
                                <img
                                    src={botAvatar}
                                    alt="Bot Avatar"
                                    className="w-10 h-10 rounded-full border border-gray-300"
                                />
                            )}
                            <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm transition-all duration-300 ${msg.from === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </main>

                <footer className="border-t border-gray-200 bg-white p-4 md:p-6 flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSend}
                        className="px-5 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
                    >
                        Send
                    </button>
                </footer>

            </div>
            <div className="absolute bottom-6 right-6">
                <img
                    src={botAvatar}
                    alt="Bot Avatar"
                    className="w-14 h-14 rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform cursor-pointer"
                />
            </div>
        </div>
    );
};

export default EmbededChatbot;
