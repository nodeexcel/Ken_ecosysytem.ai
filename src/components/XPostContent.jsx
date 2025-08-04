import { useState, useEffect } from "react";
import CustomChat from "./CustomChat";
import constanceImg from "../assets/svg/constance_msg_logo.svg";
import xImg from "../assets/svg/x_content.svg";
import { XPostCreate, XPostGet, XPostUpdate } from "../api/contentCreationAgent";
import { v4 as uuidv4 } from 'uuid';
import { formatTimeAgo } from "../utils/TimeFormat";
import { useTranslation } from "react-i18next";

function XPostContent() {
    const [messages, setMessages] = useState([]);
    const [loadingChats, setLoadingChats] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({})
    const agentName = "Constance";
    const { t } = useTranslation()


    const validateForm = (formData) => {
        const newErrors = {};
        if (!formData?.additional_questions || formData.additional_questions.trim() === "") {
            newErrors.additional_questions = `${t("topic")} ${t("is_required")}`;
        }
        if (!formData?.purpose || formData.purpose.trim() === "") {
            newErrors.purpose = `${t("purpose")} ${t("is_required")}`;
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
        header: t("skills.constance_content3_header"),
        label: t("skills.constance_content3_header"),
        description: t("constance.x_descrp"),
        form: {
            label_1: t("topic"),
            placeholder_1: t("topic_placeholder"),
            label_2: t("rima.custom_instructions"),
            placeholder_2: t("rima.custom_instructions_placeholder"),
            label_3: t("purpose"),
            placeholder_3: t("purpose_placeholder")
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
        setError, formData, setFormData // Pass setError to CustomChat
    };

    useEffect(() => {
        fetchXPosts();
    }, []);

    return <CustomChat listedProps={listedData} />;
}

export default XPostContent;
