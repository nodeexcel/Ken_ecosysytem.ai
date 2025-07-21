// import CustomChat from "./CustomChat"
// import constanceImg from "../assets/svg/constance_msg_logo.svg"
// import youtubeImg from "../assets/svg/youtube_content.svg";

// function YoutubeScriptContent() {
//     const listedData = {
//         header: "YouTube Script Writer", label: "YouTube Script Writer", description: "Generate a YouTube video script.",
//         form: { label_1: "Topic", placeholder_1: "Ex. AI Revolution in Digital Ma..", label_2: "Custom Instructions (Optional)", placeholder_2: "Anything you want to tell the AI" },
//         initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
//         agentName: "Constance",
//         agentImg: constanceImg,
//         headerLogo: youtubeImg
//     }
//     return (
//         <CustomChat listedProps={listedData} />
//     )
// }

// export default YoutubeScriptContent

import { useState, useEffect } from "react";
import CustomChat from "./CustomChat";
import constanceImg from "../assets/svg/constance_msg_logo.svg";
import youtubeImg from "../assets/svg/youtube_content.svg";
import { YoutubePostCreate, YoutubePostGet, YoutubePostUpdate } from "../api/contentCreationAgent";
import { v4 as uuidv4 } from 'uuid';
import { formatTimeAgo } from "../utils/TimeFormat";

function YoutubeScriptContent() {
    const [messages, setMessages] = useState([]);
    const [loadingChats, setLoadingChats] = useState(false);
    const [resetForm, setResetForm] = useState(null);
    const agentName = "Constance";

    const handleGenerate = async (formData) => {
        setLoadingChats(true);
        const payload = {
            topic: formData.additional_questions || "",
            custom_instructions: formData.custom_instructions || "",
            created_at: new Date().toISOString()
        };
        try {
            const response = await YoutubePostCreate(payload);
            if (response?.status === 201) {
                fetchYoutubeScripts();
                if (resetForm) resetForm(); 
            }
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    id: uuidv4(),
                    isUser: false,
                    content: "Failed to generate YouTube script.",
                    sender: agentName,
                    time: formatTimeAgo(new Date()),
                    status: "Read",
                }
            ]);
        }
        setLoadingChats(false);
    };

    const fetchYoutubeScripts = async () => {
        setLoadingChats(true);
        try {
            const response = await YoutubePostGet();
            if (response?.data?.youtube_scripts?.length > 0) {
                setMessages(
                    response.data.youtube_scripts.map(post => ({
                        id: post.id,
                        isUser: false,
                        content: post?.generated_content,
                        sender: "Ecosystem.ai",
                        time: formatTimeAgo(post?.created_at),
                        status: "Read",
                    }))
                );
            }
        } catch (error) {
            setMessages([
                {
                    id: uuidv4(),
                    isUser: false,
                    content: "Failed to fetch YouTube scripts.",
                    sender: agentName,
                    time: formatTimeAgo(new Date()),
                    status: "Read",
                }
            ]);
        }
        setLoadingChats(false);
    };

    const handleUpdate = async (message, newContent) => {
        setLoadingChats(true);
        try {
            const response = await YoutubePostUpdate(message.id, newContent);
            if (response?.status === 200) {
                console.log("Script updated successfully");
            } else {
                console.log("Failed to update script:", response);
            }
        } catch (err) {
            console.error("Update failed:", err);
        }
        setLoadingChats(false);
    };

    const listedData = {
        header: "YouTube Script Writer",
        label: "YouTube Script Writer",
        description: "Generate a YouTube video script.",
        form: {
            label_1: "Topic",
            placeholder_1: "Ex. AI Revolution in Digital Ma..",
            label_2: "Custom Instructions (Optional)",
            placeholder_2: "Anything you want to tell the AI"
        },
        initialMessage: messages,
        agentName,
        agentImg: constanceImg,
        headerLogo: youtubeImg,
        handleGenerate,
        handleUpdate,
        messages,
        setMessages,
        loadingChats,
        setLoadingChats,
        setFormReset: setResetForm 
    };

    useEffect(() => {
        fetchYoutubeScripts();
    }, []);

    return <CustomChat listedProps={listedData} />;
}

export default YoutubeScriptContent;
