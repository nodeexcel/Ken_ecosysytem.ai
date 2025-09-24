import { useState, useEffect } from "react";
import CustomChat from "./CustomChat"
import constanceImg from "../assets/svg/constance_msg_logo.svg"
import linkedinImg from "../assets/svg/linkedin_hr.svg";
import { linkedinPostCreate, linkedinPostGet, linkedinPostUpdate } from "../api/contentCreationAgent";
import { v4 as uuidv4 } from 'uuid';
import { formatTimeAgo } from "../utils/TimeFormat";
import { useTranslation } from "react-i18next";

function LinkedInNukeContent() {
    const [messages, setMessages] = useState([]);
    const [loadingChats, setLoadingChats] = useState(false);
    const [error, setError] = useState({});
    const [formData, setFormData] = useState({})
    const { t } = useTranslation()

    const options = [
        { label: `${t("chat_options.professional") + `🤵`}`, key: "professional" },
        { label: `${t("chat_options.casual") + `😎`}`, key: "casual" },
        { label: `${t("chat_options.friendly") + `😊`}`, key: "friendly" },
        { label: `${t("chat_options.formal") + `🎩`}`, key: "formal" },
        { label: `${t("chat_options.inspirational") + `🌟`}`, key: "inspirational" },
        { label: `${t("chat_options.humorous") + `😅`}`, key: "humorous" }
    ];

    const agentName = "Constance";


    const validateForm = (formData) => {
        const newErrors = {};
        if (!formData?.additional_questions || formData.additional_questions.trim() === "") {
            newErrors.additional_questions = `${t("topic")} ${t("is_required")}`;
        }
        if (!formData?.tone || formData.tone.trim() === "") {
            newErrors.tone = `${t("tone")} ${t("is_required")}`;
        }

        setError(newErrors);
        console.log(newErrors)
        return Object.keys(newErrors).length === 0;
    };


    const handleGenerate = async (formData) => {

        if (!validateForm(formData)) {
            return
        }
        // Validation: Topic is required
        setLoadingChats(true);
        const payload = {
            topic: formData?.additional_questions,
            custom_instructions: formData?.custom_instructions,
            tone: formData?.tone,
            created_at: new Date().toISOString()
        };
        try {
            const response = await linkedinPostCreate(payload);
            if (response?.status === 201) {
                fetchLinkedInPosts();
                setFormData({}); // Clear form data on success
                setError({}); // Clear error on success
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
        header: t("skills.constance_content2_header"),
        label: t("skills.constance_content2_header"),
        description: t("constance.linkedin_descrp"),
        form: {
            label_1: t("topic"),
            placeholder_1: t("topic_placeholder"),
            label_2: t("rima.custom_instructions"),
            placeholder_2: t("rima.custom_instructions_placeholder"),
            label_3: t("tone"),
            placeholder_3: t("tone_placeholder"),
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
        error, // Pass error to CustomChat
        setError, formData, setFormData // Pass setError to CustomChat
    };
    useEffect(() => {
        fetchLinkedInPosts();
    }, []);


    return (
        <CustomChat listedProps={listedData} />
    );
}

export default LinkedInNukeContent
