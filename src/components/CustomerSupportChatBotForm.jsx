import { useRef, useState } from "react";
import { CheckIcon, FacebookIcon, RightArrowIcon, SlackIcon, UploadIcon, WebsiteIcon, WhatsAppIcon } from "../icons/icons";
import { SelectDropdown } from "./Dropdown";
import { useTranslation } from "react-i18next";
import CustomizeAgent from "./CustomizeAgent";

function CustomerSupportChatBotForm() {
    const [formData, setFormData] = useState({ bot_name: "", role: "", personality: "", prompt: "", transfer: "", file: [], free_text: "" })
    const [errors, setErrors] = useState({})
    const [step, setStep] = useState(1)
    const [statusSteps, setStatusSteps] = useState({ step1: false, step2: false, step3: false, step4: false })
    const [customStatus, setCustomStatus] = useState(false)
    const [customIntegartion, setCustomIntegartion] = useState({})

    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const { t } = useTranslation()

    const handleClick = () => {
        fileInputRef.current?.click();
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
            console.log('Selected file:', file);
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
            console.log('Dropped file:', file);
        }
    };


    const personalityOptions = [
        { label: `${t("calina.friendly")}`, key: "friendly" },
        { label: `${t("calina.professional")}`, key: "professional" },
        { label: `${t("calina.energetic")}`, key: "energetic" },
        { label: `${t("calina.relaxed")}`, key: "relaxed" },
        { label: `${t("calina.result_oriented")}`, key: "results_oriented" },
        { label:`${t("calina.direct")}`, key: "direct" },
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
        { label: `${t("calina.website")}`, icon: <WebsiteIcon />, content: `${t("calina.website_content")}`, is_active: true },
        { label: `${t("calina.messenger")}`, icon: <FacebookIcon />, content: `${t("calina.messenger_content")}`, is_active: false },
        { label: `${t("calina.whatsapp")}`, icon: <WhatsAppIcon />, content: `${t("calina.whatsapp_content")}`, is_active: false },
        { label: `${t("calina.slack")}`, icon: <SlackIcon />, content: `${t("calina.slack_content")}`, is_active: false }
    ]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const handleContinue = (nextStep) => {
        setStatusSteps((prev) => ({ ...prev, [`step${step}`]: true }))
        setStep(nextStep)
    }

    const handleCancel = (value) => {
        setStatusSteps({ step1: false, step2: false, step3: false, step4: false })
    }

    const handleSelectSteps = (selectStep) => {
        if (statusSteps[`step${selectStep}`]) {
            setStep(selectStep)
        } else if (!statusSteps.step1) {
            setStep(1)
        }
        else if (!statusSteps.step2) {
            setStep(2)
        }
        else if (!statusSteps.step3) {
            setStep(3)
        }
        else {
            setStep(selectStep)
        }
    }

    return (
        <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 w-full">
            <h1 className="text-[#1E1E1E] font-[600] text-[24px]">{t("calina.create_new_chatbot")}</h1>
            <div className="h-full flex flex-col gap-4 w-full">
                <div className="bg-white rounded-[14px] border border-[#E1E4EA] p-[17px] flex flex-col gap-3">
                    <div className="flex justify-between items-center" onClick={() => {
                        handleSelectSteps(1)
                    }}>
                        <div className='flex items-center gap-2'>
                            <p className={`${step === 1 ? 'bg-[#675FFF]' : statusSteps.step1 ? 'bg-[#34C759]' : 'bg-[#000000]'} h-[30px] w-[30px] flex justify-center items-center rounded-[10px] text-white`}>{statusSteps.step1 ? <CheckIcon /> : '1'}</p>
                            <p className={`text-[14px] font-[600] ${step === 1 ? 'text-[#675FFF]' : 'text-[#000000]'}`}>{t("calina.bot_details")}</p>
                        </div>
                        {step !== 1 && <RightArrowIcon />}
                    </div>
                    {step === 1 && <div className="flex flex-col gap-5">
                        <hr style={{ color: "#E1E4EA" }} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-sm font-medium text-[#1e1e1e]">
                                {t("calina.bot_name")}<span className="text-[#675fff]">*</span>
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
                                <label className="text-sm font-medium text-[#1e1e1e]">
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
                                    placeholder={t("select")}
                                    className=""
                                    errors={errors}
                                />
                                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-sm font-medium text-[#1e1e1e]">
                                    {t("calina.personality")}
                                </label>
                                <p className="text-[#5A687C] font-[400] text-[12px]">{t("calina.personality_description")}</p>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-sm font-medium text-[#1e1e1e]">
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
                                    placeholder={t("Select")}
                                    className=""
                                    errors={errors}
                                />
                                {errors.personality && <p className="text-red-500 text-sm mt-1">{errors.personality}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-sm font-medium text-[#1e1e1e]">
                            {t("calina.prompt")}
                            </label>
                            <textarea
                                name='prompt'
                                onChange={handleChange}
                                value={formData?.prompt}
                                rows={4}
                                className={`w-full bg-white p-2 rounded-lg border  ${errors.prompt ? 'border-red-500' : 'border-[#e1e4ea]'} resize-none focus:outline-none focus:border-[#675FFF]`}
                                placeholder={t("calina.prompt_hello")}
                            />
                            {errors.prompt && <p className="text-red-500 text-sm mt-1">{errors.prompt}</p>}
                        </div>

                        <hr style={{ color: "#E1E4EA" }} />

                        <div className="flex items-center gap-2">
                            <button onClick={() => {
                                handleContinue(2)
                            }} className="px-5 cursor-pointer rounded-[7px] w-[200px] py-[7px] text-center bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white">{t("continue")}</button>
                            <button onClick={() => handleCancel(1)} className="px-5 cursor-pointer rounded-[7px] w-[200px] py-[7px] text-center border-[1.5px] border-[#E1E4EA] text-[#5A687C]">{t("cancel")}</button>
                        </div>

                    </div>}
                </div>
                <div className="bg-white rounded-[14px] border border-[#E1E4EA] p-[17px] flex flex-col gap-3">
                    <div className="flex justify-between items-center" onClick={() => {
                        handleSelectSteps(2)
                    }}>
                        <div className='flex items-center gap-2'>
                            <p className={`${step === 2 ? 'bg-[#675FFF]' : statusSteps.step2 ? 'bg-[#34C759]' : 'bg-[#000000]'} h-[30px] w-[30px] flex justify-center items-center rounded-[10px] text-white`}>{statusSteps.step2 ? <CheckIcon /> : '2'}</p>
                            <p className={`text-[14px] font-[600] ${step === 2 ? 'text-[#675FFF]' : 'text-[#000000]'}`}>{t("calina.transfer_details")}</p>
                        </div>
                        {step !== 2 && <RightArrowIcon />}
                    </div>
                    {step === 2 && <div className="flex flex-col gap-5">
                        <hr style={{ color: "#E1E4EA" }} />
                        <div className="flex flex-col gap-1 w-full">
                            <p className="text-sm font-medium text-[#1e1e1e] pb-4">
                            {t("calina.transfer_optional")}<span className="text-[#5A687C] text-xs font-[400]">{t("calina.optional")}</span>
                            </p>
                            <label className="text-sm font-medium text-[#1e1e1e] pb-2">
                            {t("calina.end_the_conversation")}<span className="text-[#5A687C] text-xs font-[400]">{t("calina.main_condition")}</span>
                            </label>
                            <ul className="flex flex-col gap-2.5">
                                {transferOptions.map((each) => (
                                    <li
                                        key={each.key}
                                        onClick={() => setFormData((prev) => ({ ...prev, transfer: each.key }))}
                                        className={`border border-[#E1E4EA] rounded-[6px] p-[12px] cursor-pointer flex items-center hover:bg-[#F4F5F6] hover:rounded-lg text-[#1e1e1e] gap-2 ${formData?.transfer === (each.key)
                                            && 'bg-[#F4F5F6] rounded-lg text-[#675FFF]'
                                            }`}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded border flex items-center justify-center ${formData?.transfer === (each.key)
                                                ? 'border-[#675FFF] bg-[#675FFF]'
                                                : 'border-[#E1E4EA]'
                                                }`}
                                        >
                                            {formData?.transfer === (each.key) && (
                                                <span className="text-white text-xs">✓</span>
                                            )}
                                        </div>
                                        <span>{each.label}</span>
                                    </li>
                                ))}
                            </ul>
                            {errors.transfer && <p className="text-red-500 text-sm mt-1">{errors.transfer}</p>}
                        </div>

                        <hr style={{ color: "#E1E4EA" }} />

                        <div className="flex items-center gap-2">
                            <button onClick={() => {
                                handleContinue(3)
                            }} className="px-5 rounded-[7px] cursor-pointer w-[200px] py-[7px] text-center bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white">{t("continue")}</button>
                            <button onClick={() => handleCancel(2)} className="px-5 cursor-pointer rounded-[7px] w-[200px] py-[7px] text-center border-[1.5px] border-[#E1E4EA] text-[#5A687C]">{t("cancel")}</button>
                        </div>

                    </div>}
                </div>
                <div className="bg-white rounded-[14px] border border-[#E1E4EA] p-[17px] flex flex-col gap-3">
                    <div className="flex justify-between items-center" onClick={() => {
                        handleSelectSteps(3)
                    }}>
                        <div className='flex items-center gap-2'>
                            <p className={`${step === 3 ? 'bg-[#675FFF]' : statusSteps.step3 ? 'bg-[#34C759]' : 'bg-[#000000]'} h-[30px] w-[30px] flex justify-center items-center rounded-[10px] text-white`}>{statusSteps.step3 ? <CheckIcon /> : '3'}</p>
                            <p className={`text-[14px] font-[600] ${step === 3 ? 'text-[#675FFF]' : 'text-[#000000]'}`}>Add Resources</p>
                        </div>
                        {step !== 3 && <RightArrowIcon />}
                    </div>
                    {step === 3 && <div className="flex flex-col gap-5">
                        <hr style={{ color: "#E1E4EA" }} />
                        <div>
                            <label className="block text-sm font-medium mb-1">{t("my_file")}</label>
                            <div className="mt-2">
                                <div
                                    onClick={handleClick}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`flex flex-col items-center justify-center py-4 border-2 border-dashed rounded-md text-center cursor-pointer transition ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-[#335CFF80] bg-[#F5F7FF]'
                                        }`}
                                >
                                    <UploadIcon />
                                    <p className="text-[18px] font-[600] text-[#1E1E1E] mt-2">
                                        {t("brain_ai.upload_from_your_computer")}
                                    </p>
                                    <p className="text-[14px] font-[500] text-[#5A687C] mt-1">
                                        {t("brain_ai.or_drag_and_drop")}
                                    </p>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>

                                {selectedFile && (
                                    <div className="mt-3 text-sm text-gray-700">
                                        <strong>{t("brain_ai.selected_file")}</strong> {selectedFile.name}
                                    </div>
                                )}
                                {errors.file && <p className='my-1 text-[#FF3B30]'>{errors.file}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-sm font-medium text-[#1e1e1e]">
                                {t("free_text")}
                            </label>
                            <textarea
                                name='free_text'
                                onChange={handleChange}
                                value={formData?.free_text}
                                rows={4}
                                className={`w-full bg-white p-2 rounded-lg border  ${errors.free_text ? 'border-red-500' : 'border-[#e1e4ea]'} resize-none focus:outline-none focus:border-[#675FFF]`}
                                placeholder={t("calina.prompt_hello")}
                            />
                            {errors.free_text && <p className="text-red-500 text-sm mt-1">{errors.free_text}</p>}
                        </div>

                        <hr style={{ color: "#E1E4EA" }} />

                        <div className="flex items-center gap-2">
                            <button onClick={() => {
                                handleContinue(4)
                            }} className="px-5 rounded-[7px] cursor-pointer w-[200px] py-[7px] text-center bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white">{t("continue")}</button>
                            <button onClick={() => handleCancel(3)} className="px-5 cursor-pointer rounded-[7px] w-[200px] py-[7px] text-center border-[1.5px] border-[#E1E4EA] text-[#5A687C]">{t("cancel")}</button>
                        </div>

                    </div>}
                </div>
                <div className="bg-white rounded-[14px] border border-[#E1E4EA] p-[17px] flex flex-col gap-3">
                    <div className="flex justify-between items-center" onClick={() => {
                        handleSelectSteps(4)
                    }}>
                        <div className='flex items-center gap-2'>
                            <p className={`${step === 4 ? 'bg-[#675FFF]' : statusSteps.step4 ? 'bg-[#34C759]' : 'bg-[#000000]'} h-[30px] w-[30px] flex justify-center items-center rounded-[10px] text-white`}>{statusSteps.step4 ? <CheckIcon /> : '4'}</p>
                            <p className={`text-[14px] font-[600] ${step === 4 ? 'text-[#675FFF]' : 'text-[#000000]'}`}>{t("brain_ai.integrations.integrations")}</p>
                        </div>
                        {step !== 4 && <RightArrowIcon />}
                    </div>
                    {step === 4 && <div className="flex flex-col gap-5">
                        <hr style={{ color: "#E1E4EA" }} />
                        <div className="w-full flex flex-wrap gap-4">
                            {integrationsData.map((each) => (
                                <div key={each.label} className="flex w-full lg:w-[32%] flex-col gap-[10px] border-[0.5px] rounded-[8px] border-[#E1E4EA] p-[20px]">
                                    <div>{each.icon}</div>
                                    <h1 className="text-[#1E1E1E] text-[18px] font-[600]">{each.label}</h1>
                                    <p className="text-[#5A687C] text-[14px] font-[400]">{each.content}</p>
                                    <button onClick={() => {
                                        setCustomIntegartion(each)
                                        setCustomStatus(true)
                                    }}
                                        disabled={!each.is_active}
                                        className={`w-full px-[20px] py-[7px] border-[1.5px] font-[500] text-[16px] rounded-[7px] ${each.is_active ? 'bg-[#675FFF] border-[#5F58E8] text-[#fff] cursor-pointer' : 'border-[#E1E4EA] bg-[#E1E4EA] text-[#5A687C]'}`}>{each.is_active ? `${t("brain_ai.update")}` : `${t("coming_soon")}`}</button>
                                </div>
                            ))}
                        </div>

                        <hr style={{ color: "#E1E4EA" }} />

                        <div className="flex items-center gap-2">
                            <button onClick={() => {
                                handleContinue(4)
                            }} className="px-5 rounded-[7px] cursor-pointer w-[200px] py-[7px] text-center bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white">{t("continue")}</button>
                            <button onClick={() => handleCancel(3)} className="px-5 cursor-pointer rounded-[7px] w-[200px] py-[7px] text-center border-[1.5px] border-[#E1E4EA] text-[#5A687C]">{t("cancel")}</button>
                        </div>

                    </div>}
                </div>
            </div>
            {customStatus && <CustomizeAgent customIntegartion={customIntegartion} setCustomStatus={setCustomStatus} />}
        </div >
    )
}

export default CustomerSupportChatBotForm
