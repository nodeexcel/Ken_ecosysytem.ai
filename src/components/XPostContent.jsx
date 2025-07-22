import { useState, useEffect } from "react";
import CustomChat from "./CustomChat";
import constanceImg from "../assets/svg/constance_msg_logo.svg";
import xImg from "../assets/svg/x_content.svg";
import { XPostCreate, XPostGet, XPostUpdate } from "../api/contentCreationAgent";
import { v4 as uuidv4 } from 'uuid';
import { formatTimeAgo } from "../utils/TimeFormat";

function XPostContent() {
    const [messages, setMessages] = useState([]);
    const [loadingChats, setLoadingChats] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({})
    const agentName = "Constance";


    const validateForm = (formData) => {
        const newErrors = {};
        if (!formData?.additional_questions || formData.additional_questions.trim() === "") {
            newErrors.additional_questions= "Topic is required.";
        }
        if (!formData?.purpose || formData.purpose.trim() === "") {
            newErrors.purpose= "Purpose is required.";
        }
        
        setError(newErrors);
        console.log(newErrors)
        return Object.keys(newErrors).length === 0;
    };

    const handleGenerate = async (formData) => {
        if (!validateForm(formData)) {
            return
        }
        setLoadingChats(true);
        const payload = {
            topic: formData?.additional_questions,
            custom_instructions: formData?.custom_instructions,
            purpose: formData?.purpose,
            created_at: new Date().toISOString()
        };
        try {
            const response = await XPostCreate(payload);
            if (response?.status === 201) {
                fetchXPosts();
                setFormData({}); 
                setError(null); // Clear error on success
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

    const fetchXPosts = async () => {
        setLoadingChats(true);
        try {
            const response = await XPostGet();
            if (response?.data?.x_posts?.length > 0) {
                setMessages(
                    response.data.x_posts.map(post => ({
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
                    content: "Failed to fetch X posts.",
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
            const response = await XPostUpdate(message.id, newContent);
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
        header: "X Post Generator",
        label: "X Post Generator",
        description: "Write creative posts for X.",
        form: {
            label_1: "Topic",
            placeholder_1: "Ex. AI Revolution in Digital Ma..",
            label_2: "Custom Instructions (Optional)",
            placeholder_2: "Anything you want to tell the AI",
            label_3: "Purpose",
            placeholder_3: "Ex. Make a funny post"
        },
        initialMessage: messages,
        agentName,
        agentImg: constanceImg,
        headerLogo: xImg,
        handleGenerate,
        handleUpdate,
        messages,
        setMessages,
        loadingChats,
        setLoadingChats,
        error, // Pass error to CustomChat
        setError,formData, setFormData // Pass setError to CustomChat
    };

    useEffect(() => {
        fetchXPosts();
    }, []);

    return <CustomChat listedProps={listedData} />;
}

export default XPostContent;
