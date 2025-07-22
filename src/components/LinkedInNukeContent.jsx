import { useState, useEffect } from "react";
import CustomChat from "./CustomChat"
import constanceImg from "../assets/svg/constance_msg_logo.svg"
import linkedinImg from "../assets/svg/linkedin_hr.svg";
import { linkedinPostCreate, linkedinPostGet , linkedinPostUpdate } from "../api/contentCreationAgent";
import { v4 as uuidv4 } from 'uuid';
import { formatTimeAgo } from "../utils/TimeFormat";

function LinkedInNukeContent() {
    const [messages, setMessages] = useState([]);
    const [loadingChats, setLoadingChats] = useState(false);

    const options = [
        { label: "Professional 🤵", key: "professional" },
        { label: "Casual 😎", key: "casual" },
        { label: "Friendly 😊", key: "friendly" },
        { label: "Formal 🎩", key: "formal" },
        { label: "Inspirational 🌟", key: "inspirational" },
        { label: "Humorous 😅", key: "humorous" }
    ];

    const agentName = "Constance";

    const handleGenerate = async (formData) => {
        setLoadingChats(true);
        const payload = {
            topic: formData?.additional_questions,
            custom_instructions: formData?.custom_instructions,
            tone: formData?.tone,
            created_at: new Date().toISOString()
        };
        try {
            const response = await linkedinPostCreate(payload);
            if(response?.status === 201) {
                fetchLinkedInPosts();
            }
            
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    id: uuidv4(),
                    isUser: false,
                    content: "Failed to generate post.",
                    sender: agentName,
                    time: formatTimeAgo(new Date()),
                    status: "Read",
                }
            ]);
        }
        setLoadingChats(false);
    };

    const fetchLinkedInPosts = async () => {
        setLoadingChats(true);
        try {
            const response = await linkedinPostGet();
            if (response?.data?.linkedin_posts?.length > 0) {
                setMessages(
                    response.data.linkedin_posts.map(post => ({
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
                    content: "Failed to fetch LinkedIn posts.",
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
            const response = await linkedinPostUpdate(message.id, newContent);

            if (response?.status === 200) {
                console.log("Post updated successfully");
            } else {
                console.log("Failed to update post:", response);
            }
        } catch (err) {
            console.error("Update failed:", err);
        }
        setLoadingChats(false);
    };

    const listedData = {
        header: "LinkedIn Nuke",
        label: "LinkedIn Nuke",
        description: "Create engaging LinkedIn posts.",
        form: {
            label_1: "Topic",
            placeholder_1: "Ex. AI Revolution in Digital Ma..",
            label_2: "Custom Instructions (Optional)",
            placeholder_2: "Anything you want to tell the AI",
            label_3: "Tone",
            placeholder_3: "Select tone",
            options: options
        },
        // initialMessage: "Unable to generate a balance sheet: The uploaded document is not a bank statement; it is an eBook or informational guide related to health and wellness. No financial data available for extraction. Please upload an actual bank statement for accurate balance sheet creation",
        initialMessage: messages,
        agentName,
        agentImg: constanceImg,
        headerLogo: linkedinImg,
        handleGenerate, 
        handleUpdate,
        messages,
        setMessages,
        loadingChats,
        setLoadingChats,


    };
    useEffect(() => {
        fetchLinkedInPosts();
    }, []);


    return (
        <CustomChat listedProps={listedData} />
    );
}

export default LinkedInNukeContent
