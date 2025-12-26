import { useEffect, useRef, useState } from "react";
import { CheckIcon, FacebookIcon, RightArrowIcon, SlackIcon, UploadIcon, WebsiteIcon, WhatsAppIcon } from "../icons/icons";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { SelectDropdown } from "./Dropdown";
import { useTranslation } from "react-i18next";
import CustomizeAgent from "./CustomizeAgent";
import { createSmartBot, intregateWebsiteChatById, intregrateWhatsapp, updateSmartbot, getConnectedPlatform } from "../api/customerSupport";
import { getWhatsappAccounts } from "../api/brainai";
import StatusModal from "./StatusModal";

function CustomerSupportChatBotForm({ onCancel, editData, editDataId }) {
    const [formData, setFormData] = useState({ 
        bot_name: "", 
        role: "", 
        personality: "", 
        prompt: "", 
        transfer: "", 
        file: [], 
        reference_text: "", 
        transfer_case: {}, 
        transfer_conditions: {
            user_requested: false,
            x_attempts: false,
            x_attempts_value: "",
            keyword_detection: false,
            keywords: []
        },
        include_brainai: false 
    })
    const [keywordInput, setKeywordInput] = useState("")
    // const [errors, setErrors] = useState({})
    const [whatsappFormData, SetWhatsappFormData] = useState({
        platform_unique_id: "",
        whatsapp_type: "Business"
    })
    const [step, setStep] = useState(1)
    const [statusSteps, setStatusSteps] = useState({ step1: false, step2: false, step3: false, step4: false })
    const [customStatus, setCustomStatus] = useState(false)
    const [openWhatsappModal, SetopenWhatsappModal] = useState(false)
    const [customIntegartion, setCustomIntegartion] = useState({})
    const [loading, setLoading] = useState(false)
    const [agentId, setAgentId] = useState(null);
    const [smartBotData, setSmartBotData] = useState(null);
    const [whatsappData, setWhatsappData] = useState([])
    const [connectedPlatforms, setConnectedPlatforms] = useState(null)
    const [statusModal, setStatusModal] = useState({ open: false, type: 'error', title: '', description: '', primaryButtonText: 'OK', onPrimaryClick: null });


    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showUploadProgress, setShowUploadProgress] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const uploadTimerRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const { t } = useTranslation()

    const handleClick = () => {
        fileInputRef.current?.click();
    };


    const [errors, setErrors] = useState({
        bot_name: "", role: "", personality: "", prompt: "", transfer: "", file: [], reference_text: "", transfer_case: {}
    });

    const validateForm = () => {
        const newErrors = {};

        if (!formData.bot_name.trim()) newErrors.bot_name = `${t("calina.bot_name_required")}`;
        // if (!formData.prompt.trim()) newErrors.prompt = `${t("calina.prompt_required")}`;
        if (!formData.role) newErrors.role = `${t("calina.role_required")}`;
        if (!formData.personality) newErrors.personality = `${t("calina.personality_required")}`;
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setErrors((prev) => ({ ...prev, file: "" }))
        if (file && file.type !== "application/pdf") {
            setErrors((prev) => ({ ...prev, file: `${t("brain_ai.knowledge.only_pdf_files_allowed")}` }));
            e.target.files = '';
            return;
        }
        else if (file) {
            setSelectedFile(file);
            setFormData((prev) => ({
                ...prev,
                file: file,
            }))
            setUploadProgress(0);
            setIsUploading(true);
            setShowUploadProgress(true);
            if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
            uploadTimerRef.current = setInterval(() => {
                setUploadProgress((prev) => {
                    const next = Math.min(prev + Math.floor(Math.random() * 15) + 6, 100);
                    if (next >= 100) {
                        clearInterval(uploadTimerRef.current);
                        uploadTimerRef.current = null;
                        setIsUploading(false);
                        setShowUploadProgress(false);
                    }
                    return next;
                });
            }, 200);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setErrors((prev) => ({ ...prev, file: "" }))
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type !== "application/pdf") {
            setErrors((prev) => ({ ...prev, file: `${t("brain_ai.knowledge.only_pdf_files_allowed")}` }));
            e.target.files = '';
            return;
        }
        else if (file) {
            setSelectedFile(file);
            setFormData((prev) => ({
                ...prev,
                file: file,
            }))
            setUploadProgress(0);
            setIsUploading(true);
            setShowUploadProgress(true);
            if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
            uploadTimerRef.current = setInterval(() => {
                setUploadProgress((prev) => {
                    const next = Math.min(prev + Math.floor(Math.random() * 12) + 6, 100);
                    if (next >= 100) {
                        clearInterval(uploadTimerRef.current);
                        uploadTimerRef.current = null;
                        setIsUploading(false);
                        setShowUploadProgress(false);
                    }
                    return next;
                });
            }, 200);
        }
    };


    const personalityOptions = [
        { label: `${t("calina.friendly")}`, key: "friendly" },
        { label: `${t("calina.professional")}`, key: "professional" },
        { label: `${t("calina.energetic")}`, key: "energetic" },
        { label: `${t("calina.relaxed")}`, key: "relaxed" },
        { label: `${t("calina.result_oriented")}`, key: "results_oriented" },
        { label: `${t("calina.direct")}`, key: "direct" },
        { label: `${t("calina.empathic")}`, key: "emphatic" },
    ]

    const roleOptions = [
        { label: `${t("calina.all")}`, key: "all" },
        { label: `${t("calina.professional")}`, key: "professional" },
        { label: `${t("calina.energetic")}`, key: "energetic" },
    ]

    const transferOptions = [
        { label: `${t("calina.user_requested")}`, key: "the_user_requests_to_be_contacted" },
        { label: `${t("calina.request_after_x_attempt")}`, key: "the_AI_doesn't_understand_the_request_after_X_attempts" },
        { label: `${t("calina.detect_keyword")}`, key: `the_AI_detects_a_keyword` }
    ]

    const integrationsData = [
        { key: "whatsapp", label: `${t("calina.whatsapp")}`, icon: <WhatsAppIcon />, content: `${t("calina.whatsapp_content")}`, is_active: true },
        { key: "website", label: `${t("calina.website")}`, icon: <WebsiteIcon />, content: `${t("calina.website_content")}`, is_active: true },
        { key: "messenger", label: `${t("calina.messenger")}`, icon: <FacebookIcon />, content: `${t("calina.messenger_content")}`, is_active: false },
        { key: "slack", label: `${t("calina.slack")}`, icon: <SlackIcon />, content: `${t("calina.slack_content")}`, is_active: false }
    ]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    useEffect(() => {
        // Cleanup progress timer on unmount
        return () => {
            if (uploadTimerRef.current) {
                clearInterval(uploadTimerRef.current);
                uploadTimerRef.current = null;
            }
        }
    }, [])

    const handleContinue = (nextStep) => {
        if (!validateForm()) {
            return;
        }
        setStatusSteps((prev) => ({ ...prev, [`step${step}`]: true }))
        setStep(nextStep)
    }

    const handleCancel = (value) => {
        // Reset all form state
        setFormData({ 
            bot_name: "", 
            role: "", 
            personality: "", 
            prompt: "", 
            transfer_case: {}, 
            transfer_conditions: {
                user_requested: false,
                x_attempts: false,
                x_attempts_value: "",
                keyword_detection: false,
                keywords: []
            },
            file: [], 
            reference_text: "", 
            include_brainai: false 
        });
        setKeywordInput("");
        setErrors({});
        setStep(1);
        setStatusSteps({ step1: false, step2: false, step3: false, step4: false });
        setSelectedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
        setShowUploadProgress(false);
        if (uploadTimerRef.current) {
            clearInterval(uploadTimerRef.current);
            uploadTimerRef.current = null;
        }
        setCustomStatus(false);
        setCustomIntegartion({});
        setDragActive(false);

        // Clear file input reference
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Call the parent's cancel callback to return to chatbot list
        if (onCancel) {
            onCancel();
        }
    }

    const handleSelectSteps = async (selectStep) => {
        if (!editData && selectStep === 4 && !statusSteps.step3) {
            return;
        }
        if (statusSteps[`step${selectStep}`]) {
            setStep(selectStep)
        } else if (!statusSteps.step1) {
            setStep(1)
        }
        else if (!statusSteps.step2) {
            setStep(2)
        }
        // else if (!statusSteps.step3) {
        //     setStep(3)
        // }
        else {
            setStep(selectStep)
        }
        if (selectStep === 4 && editDataId) {
            await handleGetConnectedPlatforms();
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            console.log("Form validation failed", errors);
            return;
        }
        const finalPayload = {
            ...formData
        };

        console.log(editData, editDataId, "payload")
        try {
            setLoading(true)
            let response;
            if (editData) {
                response = await updateSmartbot(editDataId, finalPayload);
            } else {
                response = await createSmartBot(finalPayload);
            }
            console.log(response)
            if (response.status === 201) {
                const successData = response?.data;
                if (successData?.agent_id) {
                    setAgentId(successData.agent_id);
                }
                // Reset upload UI on successful creation
                setShowUploadProgress(false);
                setIsUploading(false);
                setUploadProgress(0);
                setStatusSteps((prev) => ({
                    ...prev,
                    step3: true,
                    step4: true
                }));
                setStep(4);
                setErrors((prev) => ({ ...prev, success: response?.data?.success }))
                setTimeout(() => {
                    // setOpen(true)
                    setErrors({})
                }, 3000)
            } else {
                setLoading(false)
                if (response?.response?.data?.error) {
                    setErrorMessage(response?.response?.data?.error)
                }
            }
        } catch (error) {
            setErrors((prev) => ({ ...prev, error: 'Network Error' }))
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        handleWhatsapp();
        if (editData) {
            setFormData({
                bot_name: editData.bot_name || "",
                role: editData.role || "",
                personality: editData.personality || "",
                prompt: editData.prompt || "",
                transfer: editData.transfer || "",
                file: editData.file || [],
                reference_text: editData.reference_text || "",
                transfer_case: editData.transfer_case || {},
                transfer_conditions: editData.transfer_conditions || {
                    user_requested: false,
                    x_attempts: false,
                    x_attempts_value: "",
                    keyword_detection: false,
                    keywords: []
                },
                include_brainai: editData.include_brainai || false
            });

            setStatusSteps({
                step1: true,
                step2: true,
                step3: true,
                step4: true
            });
        }
    }, [editData]);

    useEffect(() => {
        if (step === 4 && editDataId) {
            handleGetConnectedPlatforms();
        }
    }, [step, editDataId]);

    const handleGetWebsiteLink = async () => {
        if (editDataId) {
            try {
                const response = await intregateWebsiteChatById(editDataId);
                if (response.status === 200 && response?.data?.success) {
                    setSmartBotData(response?.data?.success);
                }
            } catch (error) {
                console.log(error);
            } finally {
                // setLoadingChats(false);
            }
        } else {
            console.log("error")
        }

    };

    const handleGetConnectedPlatforms = async () => {
        const id = editDataId;
        if (!id) return null;
        try {
            const response = await getConnectedPlatform(id);
            if (response?.status === 200) {
                const platformsData = response?.data?.platforms || [];
                setConnectedPlatforms({ platforms: platformsData });
                return { platforms: platformsData };
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    };

    // Helper function to get platform data by platform name
    const getPlatformData = (platformName) => {
        if (!connectedPlatforms?.platforms || !Array.isArray(connectedPlatforms.platforms)) {
            return null;
        }
        return connectedPlatforms.platforms.find(
            (platform) => platform?.integration_platform?.toLowerCase() === platformName.toLowerCase() ||
                         platform?.platform_name?.toLowerCase() === platformName.toLowerCase()
        );
    };


    const handleWhatsapp = async () => {
        try {

            const response = await getWhatsappAccounts();
            if (response?.status === 200) {
                console.log(response?.data?.whatsapp_account_info)
                const data = response?.data?.whatsapp_account_info
                if (data?.length > 0) {
                    const updatedFormat = data.map((e) => ({
                        label: e.username,
                        key: e.whatsapp_phone_id
                    }));
                    setWhatsappData(updatedFormat)
                } else {
                    setWhatsappData(data);
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    const whatsappIntregrate = async () => {
        if (!whatsappFormData.platform_unique_id) {
            return;
        }

        const payload = {
            integration_platform: "Whatsapp",
            platform_id: whatsappFormData.platform_unique_id,
        };
        const agent_id = agentId || editDataId || "";
        try {
            const response = await intregrateWhatsapp(agent_id, payload);
            console.log("WhatsApp integration response:", response);
            
            // Check if response is an error (axios errors have response.response property)
            if (response?.response || (response?.status && response.status >= 400)) {
                // Handle error response (API returns error object instead of throwing)
                const errorMessage = response?.response?.data?.error || response?.data?.error || response?.message || 'Failed to connect WhatsApp account';
                
                if (errorMessage === "Account is already connected" || errorMessage.includes("already connected")) {
                    setStatusModal({
                        open: true,
                        type: 'error',
                        title: 'Connection Failed',
                        description: 'Account is already connected',
                        primaryButtonText: 'OK',
                        onPrimaryClick: () => setStatusModal({ ...statusModal, open: false })
                    });
                } else {
                    setStatusModal({
                        open: true,
                        type: 'error',
                        title: 'Connection Failed',
                        description: errorMessage,
                        primaryButtonText: 'OK',
                        onPrimaryClick: () => setStatusModal({ ...statusModal, open: false })
                    });
                }
            } else if (response && (response.status === 201 || response.status === 200)) {
                // Success case
                SetWhatsappFormData({ platform_unique_id: "", whatsapp_type: "Business" });
                SetopenWhatsappModal(false);
                handleCancel();
            }
        } catch (error) {
            console.error("Error integrating WhatsApp:", error);
            // Fallback error handling
            const errorMessage = error?.response?.data?.error || error?.data?.error || error?.message || 'Failed to connect WhatsApp account';
            
            setStatusModal({
                open: true,
                type: 'error',
                title: 'Connection Failed',
                description: errorMessage === "Account is already connected" || errorMessage.includes("already connected") 
                    ? 'Account is already connected' 
                    : errorMessage,
                primaryButtonText: 'OK',
                onPrimaryClick: () => setStatusModal({ ...statusModal, open: false })
            });
        }
    }

        return (
            <div className="p-12 h-screen overflow-auto flex flex-col gap-4 w-full">
                {/* Header */}
                <div className="flex justify-between items-center">
                <h1 className="text-[#1E1E1E] font-[500] text-[22px]">{editData ? t("calina.edit_new_chatbot") : t("calina.create_new_chatbot")}</h1>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleCancel}
                        className="px-4 py-2 bg-white text-[#1E1E1E] border border-[#E1E4EA] rounded-lg text-[16px] font-medium hover:bg-gray-50 focus:outline-none focus:border-[#675FFF]"
                    >
                        {t("cancel")}
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading || step !== 3}
                        className={`px-4 py-2 rounded-lg text-[16px] font-medium focus:outline-none ${
                            loading || step !== 3 
                                ? 'bg-[#E1E4EA] text-[#5A687C] cursor-not-allowed' 
                                : 'bg-[#E1E4EA] text-[#5A687C] hover:bg-[#D1D5DB] cursor-pointer'
                        }`}
                    >
                        {editData ? t("brain_ai.update") : "Create Chatbot"}
                    </button>
                </div>
            </div>
            <div className="h-full flex flex-col gap-4 w-full">
                <div className="bg-white rounded-[14px] border border-[#E1E4EA] p-[17px] flex flex-col gap-3">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => {
                        handleSelectSteps(1)
                    }}>
                        <div className='flex items-center gap-3'>
                            <div className={`${step === 1 ? 'bg-[#675FFF]' : statusSteps.step1 ? 'bg-[#34C759]' : 'bg-[#9CA3AF]'} h-[30px] w-[30px] flex justify-center items-center rounded-lg text-white font-semibold`}>
                                {'1'}
                            </div>
                            <p className={`text-md font-normal ${step === 1 ? 'text-[#1E1E1E]' : 'text-[#000000]'}`}>{t("calina.bot_details")}</p>
                        </div>
                        {step === 1 && <ChevronUp className="w-5 h-5 text-[#5A687C]" />}
                        {step !== 1 && <RightArrowIcon />}
                    </div>
                    {step === 1 && <div className="flex flex-col gap-5">
                        <hr style={{ color: "#E1E4EA" }} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-sm font-[400] text-[#868C98]">
                                    {t("calina.bot_name")}
                                </label>
                                <input
                                    type="text"
                                    name='bot_name'
                                    value={formData?.bot_name}
                                    onChange={handleChange}
                                    className={`w-full bg-white p-2 rounded-lg border ${errors.bot_name ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                    placeholder={t("calina.bot_name_placeholder")}
                                />
                                {errors.bot_name && <p className="text-red-500 text-sm mt-1">{errors.bot_name}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-sm font-[400] text-[#868C98]">
                                    {t("calina.role")}
                                </label>
                                <SelectDropdown
                                    name="role"
                                    options={roleOptions}
                                    value={formData?.role}
                                    onChange={(updated) => {
                                        setFormData((prev) => ({
                                            ...prev, role: updated
                                        }))
                                        setErrors((prev) => ({
                                            ...prev, role: ""
                                        }))
                                    }}
                                    placeholder="Select Role"
                                    className=""
                                    errors={errors}
                                />
                                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-sm font-[400] text-[#868C98]">
                                    {t("calina.bot_language")}
                                </label>
                                <p className="text-[#5A687C] font-[400] text-[14px]">{t("calina.bot_language_description")}</p>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-sm font-[400] text-[#868C98]">
                                    {t("calina.personality")}
                                </label>
                                <SelectDropdown
                                    name="personality"
                                    options={personalityOptions}
                                    value={formData?.personality}
                                    onChange={(updated) => {
                                        setFormData((prev) => ({
                                            ...prev, personality: updated
                                        }))
                                        setErrors((prev) => ({
                                            ...prev, personality: ""
                                        }))
                                    }}
                                    placeholder={t("calina.select_personality")}
                                    className=""
                                    errors={errors}
                                />
                                {errors.personality && <p className="text-red-500 text-sm mt-1">{errors.personality}</p>}
                            </div>
                        </div>
                        {/* <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-sm font-[400] text-[#868C98]">
                                {t("calina.prompt")}
                            </label>
                            <textarea
                                name='prompt'
                                onChange={handleChange}
                                value={formData?.prompt}
                                rows={4}
                                className={`w-full bg-white p-2 rounded-lg border  ${errors.prompt ? 'border-red-500' : 'border-[#e1e4ea]'} resize-none focus:outline-none focus:border-[#675FFF]`}
                                placeholder={t("calina.enter_your_prompt_here")}
                            />
                            {errors.prompt && <p className="text-red-500 text-sm mt-1">{errors.prompt}</p>}
                        </div> */}

                        <hr style={{ color: "#E1E4EA" }} />

                        <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleCancel(1)} className="px-5 cursor-pointer rounded-lg py-2 text-center bg-white border border-[#E1E4EA] text-[#1E1E1E] font-medium hover:bg-gray-50 focus:outline-none">{t("cancel")}</button>
                            <button onClick={() => {
                                handleContinue(2)
                            }} className="px-5 cursor-pointer rounded-lg py-2 text-center bg-[#675FFF] text-white font-medium hover:bg-[#5A52E5] focus:outline-none">{t("continue")}</button>
                        </div>

                    </div>}
                </div>
                <div className="bg-white rounded-[14px] border border-[#E1E4EA] p-[17px] flex flex-col gap-3">
                    <div className="flex justify-between items-center" onClick={() => {
                        handleSelectSteps(2)
                    }}>
                        <div className='flex items-center gap-2'>
                            <div className={`${step === 2 ? 'bg-[#675FFF]' : statusSteps.step2 ? 'bg-[#34C759]' : 'bg-[#9CA3AF]'} h-[30px] w-[30px] flex justify-center items-center rounded-[10px] text-white font-semibold`}>{'2'}</div>
                            <p className={`text-md font-normal ${step === 2 ? 'text-[#000000]' : 'text-[#000000]'}`}>{t("calina.transfer_details")}</p>
                        </div>
                        {step !== 2 && <RightArrowIcon />}
                    </div>
                    {step === 2 && <div className="flex flex-col gap-5">
                        <hr style={{ color: "#E1E4EA" }} />
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-[14px] font-[400] text-[#000000] pb-2">
                                {t("calina.end_the_conversation")}<br/><span className="text-[#5A687C] text-[12px   ] font-[400]">{t("calina.main_condition")}</span>
                            </label>
                            <div className="flex flex-col gap-2.5">
                                {/* Condition 1: User requests to be contacted */}
                                <div className="flex flex-col gap-2">
                                    <div
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                transfer_conditions: {
                                                    ...prev.transfer_conditions,
                                                    user_requested: !prev.transfer_conditions.user_requested
                                                }
                                            }))
                                        }
                                        className="border border-[#E1E4EA] rounded-lg p-[12px] cursor-pointer flex items-center hover:bg-[#F4F5F6] hover:rounded-lg text-[#1e1e1e] gap-2 text-[14px]"
                                    >
                                        <div
                                            className={`w-4 h-4 border flex items-center justify-center ${formData?.transfer_conditions?.user_requested
                                                ? "border-[#675FFF] bg-[#675FFF]"
                                                : "border-[#E1E4EA]"
                                                }`}
                                        >
                                            {formData?.transfer_conditions?.user_requested && (
                                                <span className="text-white text-xs">✓</span>
                                            )}
                                        </div>
                                        <span className={formData?.transfer_conditions?.user_requested ? "text-black" : "text-[#1e1e1e]"}>
                                            {transferOptions[0].label}
                                        </span>
                                    </div>
                                </div>

                                {/* Condition 2: AI doesn't understand after X attempts */}
                                <div className="flex flex-col gap-2">
                                    <div
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                transfer_conditions: {
                                                    ...prev.transfer_conditions,
                                                    x_attempts: !prev.transfer_conditions.x_attempts,
                                                    x_attempts_value: !prev.transfer_conditions.x_attempts ? prev.transfer_conditions.x_attempts_value : ""
                                                }
                                            }))
                                        }
                                        className="border border-[#E1E4EA] rounded-lg p-[12px] cursor-pointer flex items-center hover:bg-[#F4F5F6] hover:rounded-lg text-[#1e1e1e] gap-2 text-[14px]"
                                    >
                                        <div
                                            className={`w-4 h-4 border flex items-center justify-center ${formData?.transfer_conditions?.x_attempts
                                                ? "border-[#675FFF] bg-[#675FFF]"
                                                : "border-[#E1E4EA]"
                                                }`}
                                        >
                                            {formData?.transfer_conditions?.x_attempts && (
                                                <span className="text-white text-xs">✓</span>
                                            )}
                                        </div>
                                        <span className={formData?.transfer_conditions?.x_attempts ? "text-black" : "text-[#1e1e1e]"}>
                                            {transferOptions[1].label}
                                        </span>
                                    </div>
                                    {formData?.transfer_conditions?.x_attempts && (
                                        <div className="ml-6">
                                            <input
                                                type="number"
                                                placeholder="Input number"
                                                value={formData.transfer_conditions.x_attempts_value}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        transfer_conditions: {
                                                            ...prev.transfer_conditions,
                                                            x_attempts_value: e.target.value
                                                        }
                                                    }))
                                                }
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full px-3 py-2 border border-[#E1E4EA] rounded-lg text-sm text-[#1e1e1e] placeholder:text-[#868C98] focus:outline-none focus:border-[#675FFF]"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Condition 3: AI detects a keyword */}
                                <div className="flex flex-col gap-2">
                                    <div
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                transfer_conditions: {
                                                    ...prev.transfer_conditions,
                                                    keyword_detection: !prev.transfer_conditions.keyword_detection
                                                }
                                            }))
                                        }
                                        className="border border-[#E1E4EA] rounded-[6px] p-[12px] cursor-pointer flex items-center hover:bg-[#F4F5F6] hover:rounded-lg text-[#1e1e1e] gap-2 text-[14px]"
                                    >
                                        <div
                                            className={`w-4 h-4 border flex items-center justify-center ${formData?.transfer_conditions?.keyword_detection
                                                ? "border-[#675FFF] bg-[#675FFF]"
                                                : "border-[#E1E4EA]"
                                                }`}
                                        >
                                            {formData?.transfer_conditions?.keyword_detection && (
                                                <span className="text-white text-xs">✓</span>
                                            )}
                                        </div>
                                        <span className={formData?.transfer_conditions?.keyword_detection ? "text-black" : "text-[#1e1e1e]"}>
                                            {transferOptions[2].label}
                                        </span>
                                    </div>
                                    {formData?.transfer_conditions?.keyword_detection && (
                                        <div className="ml-6 flex flex-col gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add Keyword"
                                                value={keywordInput}
                                                onChange={(e) => setKeywordInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && keywordInput.trim()) {
                                                        e.preventDefault();
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            transfer_conditions: {
                                                                ...prev.transfer_conditions,
                                                                keywords: [...prev.transfer_conditions.keywords, keywordInput.trim()]
                                                            }
                                                        }));
                                                        setKeywordInput("");
                                                    }
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full px-3 py-2 border border-[#E1E4EA] rounded-lg text-sm text-[#1e1e1e] placeholder:text-[#868C98] focus:outline-none focus:border-[#675FFF]"
                                            />
                                            {formData.transfer_conditions.keywords.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.transfer_conditions.keywords.map((keyword, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-1.5 px-2 py-1 bg-[#F4F5F6] rounded-[4px] text-sm text-black"
                                                        >
                                                            <span>{keyword}</span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        transfer_conditions: {
                                                                            ...prev.transfer_conditions,
                                                                            keywords: prev.transfer_conditions.keywords.filter((_, i) => i !== index)
                                                                        }
                                                                    }));
                                                                }}
                                                                className="text-[#868C98] hover:text-[#1e1e1e] cursor-pointer"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* {errors.transfer_case && <p className="text-red-500 text-sm mt-1">{errors.transfer_case}</p>} */}
                        </div>

                        <hr style={{ color: "#E1E4EA" }} />

                        <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleCancel(2)} className="px-5 cursor-pointer rounded-lg py-2 text-center bg-white border border-[#E1E4EA] text-[#1E1E1E] font-medium hover:bg-gray-50 focus:outline-none">{t("cancel")}</button>
                            <button onClick={() => {
                                handleContinue(3)
                            }} className="px-5 cursor-pointer rounded-lg py-2 text-center bg-[#675FFF] text-white font-medium hover:bg-[#5A52E5] focus:outline-none">{t("continue")}</button>
                        </div>

                    </div>}
                </div>
                <div className="bg-white rounded-[14px] border border-[#E1E4EA] p-[17px] flex flex-col gap-3">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => {
                        handleSelectSteps(3)
                    }}>
                        <div className='flex items-center gap-3'>
                            <div className={`${step === 3 ? 'bg-[#675FFF]' : statusSteps.step3 ? 'bg-[#34C759]' : 'bg-[#9CA3AF]'} h-[30px] w-[30px] flex justify-center items-center rounded-lg text-white font-semibold`}>{'3'}</div>
                            <p className={`text-md font-normal ${step === 3 ? 'text-[#1E1E1E]' : 'text-[#000000]'}`}>{t("calina.add_resources")}</p>
                        </div>
                        {step === 3 && <ChevronUp className="w-5 h-5 text-[#5A687C]" />}
                        {step !== 3 && <RightArrowIcon />}
                    </div>
                    {step === 3 && <div className="flex flex-col gap-5">
                        <hr style={{ color: "#E1E4EA" }} />
                        
                        {/* Toggle at the top */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setFormData((prev) => ({ ...prev, include_brainai: !formData.include_brainai }));
                                   
                                    if (formData.include_brainai) {
                                        setErrors((prev) => ({ ...prev, custom_prompt: "" }));
                                    }
                                }}
                                className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${formData.include_brainai ? "bg-[#675FFF]" : "bg-[#E1E4EA]"}`}
                            >
                                <span
                                    className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${formData.include_brainai ? "translate-x-5" : "translate-x-0.5"}`}
                                ></span>
                            </button>
                            <label className="text-sm font-[400] text-[#868C98]">
                                {t("calina.take_ressources_form_ai_brain")}
                            </label>
                        </div>

                        {/* Two-column layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column - Upload File */}
                            <div className="flex flex-col gap-2 h-full">
                                <label className="text-sm font-[400] text-[#868C98]">{t("calina.upload_file")}</label>
                                <div
                                    onClick={handleClick}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition h-full ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-[#E1E4EA] bg-white'
                                        }`}
                                >
                                    <div className="text-[#675FFF] mb-3">
                                        <UploadIcon />
                                    </div>
                                    <p className="text-[14px] font-[400] text-[#1E1E1E] mb-4">
                                        {t("calina.choose_a_file_or_drag_and_drop_it_here")}
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClick();
                                        }}
                                        className="px-4 py-2 bg-white border border-[#E1E4EA] text-[#1E1E1E] rounded-lg text-sm font-medium hover:bg-gray-50"
                                    >
                                        {t("calina.browse_file")}
                                    </button>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>

                                {!isUploading && selectedFile && (
                                    <div className="mt-2 text-sm text-gray-700">
                                        <strong>{t("brain_ai.selected_file")}</strong> {selectedFile.name}
                                        <p className="text-green-500">{t("calina.file_uploaded_successfully")}</p>
                                    </div>
                                )}
                                {showUploadProgress && isUploading && (
                                    <div className="mt-2 w-full">
                                        <div className="w-full h-[14px] rounded-[40px] bg-[#D7D4FF]">
                                            <div className={`h-[14px] bg-[#675FFF] ${uploadProgress >= 100 ? 'rounded-[40px]' : 'rounded-l-[40px]'}`} style={{ width: `${uploadProgress}%` }}></div>
                                        </div>
                                        <p className="text-[#5A687C] text-[12px] mt-1">{uploadProgress}% {t("calina.uploading")}...</p>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Description */}
                            <div className="flex flex-col gap-2 h-full">
                                <label className="text-sm font-[400] text-[#868C98]">{t("calina.description")}</label>
                                <textarea
                                    name="reference_text"
                                    onChange={handleChange}
                                    value={formData?.reference_text}
                                    rows={8}
                                    className={`w-full bg-white p-3 rounded-lg border h-full 
                                    ${errors.reference_text ? 'border-red-500' : 'border-[#e1e4ea]'} 
                                    resize-none focus:outline-none focus:border-[#675FFF]
                                    placeholder:font-[300] text-[14px] placeholder:text-gray-600`}
                                    placeholder={t("calina.enter_description_here")}
                                    />
                                {errors.reference_text && <p className="text-red-500 text-sm mt-1">{errors.reference_text}</p>}
                            </div>
                        </div>

                        <hr style={{ color: "#E1E4EA" }} />

                        <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleCancel(3)} className="px-5 cursor-pointer rounded-lg py-2 text-center bg-white border border-[#E1E4EA] text-[#1E1E1E] font-medium hover:bg-gray-50 focus:outline-none">{t("cancel")}</button>
                            <button onClick={
                                handleSubmit
                            } className="px-5 cursor-pointer rounded-lg py-2 text-center bg-[#675FFF] text-white font-medium hover:bg-[#5A52E5] focus:outline-none">{editData ? t("brain_ai.update") : t("brain_ai.create")}</button>
                        </div>

                    </div>}
                </div>
                <div className="bg-white rounded-[14px] border border-[#E1E4EA] p-[17px] flex flex-col gap-3">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => {
                        handleSelectSteps(4)
                    }}>
                        <div className='flex items-center gap-3'>
                            <div className={`${step === 4 ? 'bg-[#675FFF]' : statusSteps.step4 ? 'bg-[#34C759]' : 'bg-[#9CA3AF]'} h-[30px] w-[30px] flex justify-center items-center rounded-lg text-white font-semibold`}>{'4'}</div>
                            <p className={`text-md font-normal ${step === 4 ? 'text-[#1E1E1E]' : 'text-[#000000]'}`}>{t("brain_ai.integrations.integrations")}</p>
                        </div>
                        {step === 4 && <ChevronDown className="w-5 h-5 text-[#5A687C]" />}
                        {step !== 4 && <RightArrowIcon />}
                    </div>
                    {step === 4 && <div className="flex flex-col gap-5">
                        <hr style={{ color: "#E1E4EA" }} />
                        <p className="text-[#5A687C] text-[14px] font-[400]">{t("calina.connect_your_chatbot_to_instagram_and_let_it_respond_to_your_customers_messages")}</p>
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            {integrationsData.map((each) => {
                                const isConnected = editDataId && connectedPlatforms?.platforms?.some(
                                    (platform) => platform?.integration_platform?.toLowerCase() === each.label.toLowerCase() ||
                                                 platform?.platform_name?.toLowerCase() === each.label.toLowerCase()
                                );
                                const buttonText = !each.is_active 
                                    ? t("coming_soon") 
                                    : isConnected 
                                        ? t("brain_ai.update") 
                                        : "Connect";
                                
                                return (
                                <div key={each.label} className="flex items-center justify-between gap-4 border-[0.5px] rounded-[8px] border-[#E1E4EA] p-4">
                                    <div className="flex items-center gap-3">
                                        <div>{each.icon}</div>
                                        <h1 className="text-[#1E1E1E] text-[16px] font-[500]">{each.label}</h1>
                                    </div>
                                    <button onClick={async () => {
                                        setCustomIntegartion(each)
                                        handleGetWebsiteLink()
                                        
                                        if (each.key === "whatsapp") {
                                            if (!connectedPlatforms && editDataId) {
                                                await handleGetConnectedPlatforms();
                                            }
                                            
                                            if (editDataId) {
                                                const whatsappPlatform = getPlatformData("whatsapp");
                                                if (whatsappPlatform) {
                                                    const prefillId = whatsappPlatform?.platform_id || 
                                                                     whatsappPlatform?.whatsapp_phone_id || 
                                                                     whatsappPlatform?.platform?.id || 
                                                                     whatsappPlatform?.whatsapp?.platform_id;
                                                    if (prefillId) {
                                                        SetWhatsappFormData((prev) => ({
                                                            ...prev,
                                                            platform_unique_id: prefillId
                                                        }));
                                                    }
                                                }
                                            }
                                            SetopenWhatsappModal(true);
                                        } else if (each.key === "website") {
                                            if (!connectedPlatforms && editDataId) {
                                                await handleGetConnectedPlatforms();
                                            }
                                            
                                            if (editDataId) {
                                                const websitePlatform = getPlatformData("website");
                                                if (websitePlatform) {
                                                    console.log("Website platform data:", websitePlatform);
                                                }
                                            }
                                            setCustomStatus(true);
                                        } else if (each.key === "messenger") {
                                            if (!connectedPlatforms && editDataId) {
                                                await handleGetConnectedPlatforms();
                                            }
                                            
                                            if (editDataId) {
                                                const messengerPlatform = getPlatformData("messenger");
                                                if (messengerPlatform) {
                                                    console.log("Messenger platform data:", messengerPlatform);
                                                }
                                            }
                                        } else if (each.key === "slack") {
                                            if (!connectedPlatforms && editDataId) {
                                                await handleGetConnectedPlatforms();
                                            }
                                            
                                            if (editDataId) {
                                                const slackPlatform = getPlatformData("slack");
                                                if (slackPlatform) {
                                                    console.log("Slack platform data:", slackPlatform);
                                                }
                                            }
                                        }
                                    }}
                                        disabled={!each.is_active}
                                        className={`px-4 py-2 font-[500] text-[14px] rounded-lg whitespace-nowrap ${
                                            !each.is_active 
                                                ? 'bg-[#E1E4EA] text-[#5A687C] cursor-not-allowed' 
                                                : isConnected
                                                    ? 'bg-[#E1E4EA] text-[#1E1E1E] border border-[#E1E4EA] hover:bg-gray-100 cursor-pointer'
                                                    : 'bg-[#675FFF] text-white hover:bg-[#5A52E5] cursor-pointer'
                                        }`}
                                    >
                                        {buttonText}
                                    </button>
                                </div>
                                );
                            })}
                        </div>

                        <hr style={{ color: "#E1E4EA" }} />

                    </div>}
                </div>
            </div>
            {customStatus && <CustomizeAgent customIntegartion={customIntegartion} setCustomStatus={setCustomStatus} agentId={agentId} editDataId={editDataId} websiteData={smartBotData} />}

            {
                openWhatsappModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                        <div className="bg-white rounded-2xl w-[600px] p-6 relative shadow-lg">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="text-green-500">
                                        <WhatsAppIcon />
                                    </div>
                                    <h2 className="text-xl font-semibold text-[#1E1E1E]">{t("calina.connect_whatsapp")}</h2>
                                </div>
                                <button
                                    onClick={() => SetopenWhatsappModal(false)}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-4 mb-6">
                                {/* WhatsApp type field */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[#5A687C]">{t("calina.whatsapp_type")}</label>
                                    <div className="w-full bg-gray-200 p-3 rounded-lg border border-[#E1E4EA] text-[#1E1E1E]">
                                        {whatsappFormData.whatsapp_type}
                                    </div>
                                </div>

                                {/* Account field */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[#5A687C]">{t("calina.account")}</label>
                                    <SelectDropdown
                                        name="platform_unique_id"
                                        options={Array.isArray(whatsappData) ? whatsappData : []}
                                        value={whatsappFormData.platform_unique_id}
                                        onChange={(updated) => {
                                            console.log("Selected value:", updated);
                                            SetWhatsappFormData((prev) => ({
                                                ...prev,
                                                platform_unique_id: updated
                                            }));
                                        }}
                                        placeholder={t("calina.select_account")}
                                        className=""
                                        errors={errors}
                                        disabled={false}
                                    />
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => SetopenWhatsappModal(false)}
                                    className="px-4 py-2 text-[16px] cursor-pointer text-[#1E1E1E] bg-white border border-[#E1E4EA] rounded-lg hover:bg-gray-50 focus:outline-none"
                                >
                                    {t("calina.cancel")}
                                </button>
                                <button
                                    onClick={() => {
                                        whatsappIntregrate();
                                    }}
                                    className="px-4 py-2 text-[16px] cursor-pointer text-white bg-[#675FFF] rounded-lg hover:bg-[#5A52E5] focus:outline-none"
                                >
                                    {t("calina.connect")}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Status Modal for Error Messages */}
            <StatusModal
                isOpen={statusModal.open}
                onClose={() => setStatusModal({ ...statusModal, open: false })}
                type={statusModal.type}
                title={statusModal.title}
                description={statusModal.description}
                primaryButtonText={statusModal.primaryButtonText}
                onPrimaryClick={statusModal.onPrimaryClick || (() => setStatusModal({ ...statusModal, open: false }))}
            />
        </div >
    )
}

export default CustomerSupportChatBotForm
