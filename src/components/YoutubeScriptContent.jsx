
import { useState, useEffect } from "react";
import CustomChat from "./CustomChat";
import constanceImg from "../assets/svg/constance_msg_logo.svg";
import youtubeImg from "../assets/svg/youtube_content.svg";
import { YoutubePostCreate, YoutubePostGet, YoutubePostUpdate } from "../api/contentCreationAgent";
import { v4 as uuidv4 } from 'uuid';
import { formatTimeAgo } from "../utils/TimeFormat";
import { useTranslation } from "react-i18next";

function YoutubeScriptContent() {
    const [messages, setMessages] = useState([]);
    const [loadingChats, setLoadingChats] = useState(false);
    const [resetForm, setResetForm] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({})
    const agentName = "Constance";
    const { t } = useTranslation()



    const validateForm = (formData) => {
        const newErrors = {};
        if (!formData?.additional_questions || formData.additional_questions.trim() === "") {
            newErrors.additional_questions = `${t("topic")} ${t("is_required")}`;
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
            created_at: new Date().toISOString()
        };
        try {
            const response = await YoutubePostCreate(payload);
            if (response?.status === 201) {
                fetchYoutubeScripts();
                setFormData({});
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
        header: t("skills.constance_content1_header"),
        label: t("skills.constance_content1_header"),
        description: t("constance.youtube_descrp"),
        form: {
            label_1: t("topic"),
            placeholder_1: t("topic_placeholder"),
            label_2: t("rima.custom_instructions"),
            placeholder_2: t("rima.custom_instructions_placeholder")
        },//"Anything you want to tell the AI",
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
        setFormReset: setResetForm,
        error, // Pass error to CustomChat
        setError, formData, setFormData // Pass setError to CustomChat
    };

    useEffect(() => {
        fetchYoutubeScripts();
    }, []);



    return <CustomChat listedProps={listedData} />;
}

export default YoutubeScriptContent;
