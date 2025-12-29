import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import trigger from '../assets/svg/sequence_trigger.svg'
import delay from '../assets/svg/sequence_delay.svg'
import channel from '../assets/svg/sequence_channel.svg'
import template from '../assets/svg/sequence_template.svg'
import calendlyIcon from '../assets/svg/calendly.svg'
import googleCalendarIcon from '../assets/svg/google_calender.svg'
import whatsappIcon from '../assets/svg/whatsapp.svg'
import instagramIcon from '../assets/svg/instagram.svg'
import { ChevronDown, InfoIcon, X, Trash2, ChevronRight, Clock } from 'lucide-react';
import { LuRefreshCw } from 'react-icons/lu';
import { AddPlus, CheckedCheckbox, CrossDelete, EmptyCheckbox, RequestSend, CheckIcon, RightArrowIcon } from '../icons/icons'
import { appointmentSetter, getAppointmentSetterById, updateAppointmentSetter } from '../api/appointmentSetter'
import AgentPreviewModal from './AgentPreview'
import { getGoogleCalendarAccounts, getInstaAccounts, getWhatsappAccounts } from '../api/brainai'
import { SelectDropdown } from './Dropdown'
import { useTranslation } from 'react-i18next'
import bgback from '../assets/images/bgback.svg'

function CreateNewAgent({ editData, setOpen, setUpdateAgentStatus, updateAgentStatus }) {

    const [formData, setFormData] = useState({
        agent_name: "",
        gender: '',
        age: '',
        agent_language: [], agent_personality: "", business_description: "", your_business_offer: "",
        qualification_questions: [""],
        sequence: { trigger: 'systeme.io', delay: 5, channel: 'SMS', template: '' },
        objective_of_the_agent: '',
        calendar_choosed: '',
        // reply_min_time: 15,
        // reply_max_time: 60,
        is_followups_enabled: true,
        follow_up_details: { number_of_followups: '', wait_time_for_follow_up: 5 },
        emoji_frequency: 25,
        // directness: 2,a
        webpage_link: "",
        // webpage_type: "",
        whatsapp_number: '',
        platform_unique_id: '',
        calendar_id: '',
        // more_info_setter: '',
        silent_hours: [{ start: '', end: '' }],
    })

    const { t } = useTranslation();
    const [loadingStatus, setLoadingStatus] = useState(true)
    const [dataRenderStatus, setDataRenderStatus] = useState(true)

    const [updateAgent, setUpdateAgent] = useState(false);
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({});
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [previewAgent, setPreviewAgent] = useState(false)
    const [instagramData, setInstagramData] = useState([])
    const [whatsappData, setWhatsappData] = useState([])
    const [googleCalendarData, setGoogleCalendarData] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [step, setStep] = useState(1)
    const [statusSteps, setStatusSteps] = useState({ step1: false, step2: false, step3: false })
    const [isPersonalityDropdownOpen, setIsPersonalityDropdownOpen] = useState(false)
    const [personalityDropdownPosition, setPersonalityDropdownPosition] = useState({ top: 0, right: 0 })
    const [isTooltipVisible, setIsTooltipVisible] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
    const personalityDropdownRef = useRef(null)
    const personalityButtonRef = useRef(null)
    const tooltipIconRef = useRef(null)

    const handleInstagram = async () => {
        try {

            const response = await getInstaAccounts();
            if (response?.status === 200) {
                console.log(response?.data?.insta_account_info)
                const data = response?.data?.insta_account_info
                if (data?.length > 0) {
                    const updatedFormat = data.map((e) => ({
                        label: e.username,
                        key: e.instagram_user_id
                    }));
                    setInstagramData(updatedFormat)
                } else {
                    setInstagramData(data);
                }

            }

        } catch (error) {
            console.log(error)
        }
    }


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

    const handleGoogleCalender = async () => {
        try {
            const response = await getGoogleCalendarAccounts();
            if (response?.status === 200) {
                console.log(response?.data?.google_calendar_info)
                const data = response?.data?.google_calendar_info
                if (data?.length > 0) {
                    const updatedFormat = data.map((e) => ({
                        label: `${e.calendar_id.length > 30
                            ? `${e.calendar_id.slice(0, 30)}...`
                            : e.calendar_id}`,
                        key: e.calendar_id
                    }));
                    setGoogleCalendarData(updatedFormat)
                } else {
                    setGoogleCalendarData(data);
                }
            }

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        handleInstagram()
        handleWhatsapp()
        handleGoogleCalender()
    }, [])



    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLanguageSelector(false);
            }
            if (personalityButtonRef.current && !personalityButtonRef.current.contains(event.target) &&
                !event.target.closest('.personality-dropdown-portal')) {
                setIsPersonalityDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isPersonalityDropdownOpen && personalityButtonRef.current) {
            const buttonRect = personalityButtonRef.current.getBoundingClientRect();
            setPersonalityDropdownPosition({
                top: buttonRect.top,
                right: window.innerWidth - buttonRect.right
            });
        }
    }, [isPersonalityDropdownOpen]);

    useEffect(() => {
        if (isTooltipVisible && tooltipIconRef.current) {
            const iconRect = tooltipIconRef.current.getBoundingClientRect();
            setTooltipPosition({
                top: iconRect.top - 8,
                left: iconRect.left + iconRect.width / 2
            });
        }
    }, [isTooltipVisible]);

    useEffect(() => {
        if (editData) {
            getAppointementSetter()
        } else {
            setDataRenderStatus(false)
        }
    }, [editData])

    useEffect(() => {
        if (!loadingStatus) {
            setDataRenderStatus(false)
        }
    }, [loadingStatus])

    const validateForm = () => {
        const newErrors = {};

        console.log(step);

        if (step === 1) {
            if (!formData.agent_name.trim()) newErrors.agent_name = t("appointment.agent_name_validation");
            if (!formData.gender) newErrors.gender = t("appointment.gender_validation");
            // if (!formData.age) newErrors.age = t("appointment.age_validation"); // Commented out as per Figma design
            if (formData.agent_language.length === 0) newErrors.agent_language = t("appointment.agent_language_validation");
            if (!formData.agent_personality) newErrors.agent_personality = t("appointment.agent_personality_validation");
        }

        if (step === 3) {
            // if (!formData.prompt) newErrors.prompt = t("appointment.prompt_validation");
            // formData.qualification_questions.forEach((e, i) => {
            //     if (e === "") {
            //         newErrors[`qualification_questions[${i}]`] = t("appointment.prompt_validation");
            //     }
            // });

            console.log(formData);
            // Add validation for platform_unique_id when Instagram or Whatsapp is selected
            if (
                (formData.sequence.trigger === "Instagram" || formData.sequence.trigger === "Whatsapp") &&
                !formData.platform_unique_id
            ) {
                newErrors.platform_unique_id = t("appointment.account_msg");
            }
        }

        if (step === 2) {
            if (!formData.business_description.trim()) newErrors.business_description = t("appointment.business_des_validation");
            if (formData.business_description.trim().length > 1 && formData.business_description.length < 50) newErrors.business_description = t("appointment.min_char_validation");
            // if (!formData.your_business_offer.trim()) newErrors.your_business_offer = t("appointment.business_offer_validation");
            // if (formData.your_business_offer.trim().length > 1 && formData.your_business_offer.length < 50) newErrors.your_business_offer = t("appointment.min_char_validation");
            if (formData.objective_of_the_agent && formData.objective_of_the_agent === "book_call") {
                if (!formData.calendar_choosed) {
                    newErrors.calendar_choosed = t("appointment.choose_calendar_validation");
                }
                if (formData.calendar_choosed === "google_calendar") {
                    if (!formData.calendar_id) {
                        newErrors.calendar_id = t("appointment.calendar_validation");
                    }
                }
            }
            if (formData.objective_of_the_agent && formData.objective_of_the_agent === "whatsapp_number") {
                if (!formData.whatsapp_number) {
                    newErrors.whatsapp_number = t("appointment.whatsapp_no_validation");
                }
            }
            if (formData.objective_of_the_agent && formData.objective_of_the_agent === "web_page") {
                if (!formData.webpage_link.trim()) {
                    newErrors.webpage_link = t("appointment.website_link_validation");
                }
                // if (!formData.webpage_type.trim()) {
                //     newErrors.webpage_type = "Webpage type is required.";
                // }
            }
            if (formData.is_followups_enabled && (!formData.follow_up_details.number_of_followups)) {
                if (formData.follow_up_details.number_of_followups === 0) {
                    newErrors.number_of_followups = "";
                } else {
                    newErrors.number_of_followups = t("appointment.followup_validation");
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Data for sequence cards
    const sequenceCards = [
        {
            id: 1,
            title: t("appointment.trigger"),
            key: "trigger",
            iconSrc: trigger,
            iconColor: "bg-[#675FFF]",
            options: [
                // { label: "Systeme.io", key: "systeme.io" },
                //  { label: "Clickfunnels", key: "clickfunnels" },
                { label: "Whatsapp", key: "Whatsapp", icon: whatsappIcon },
                { label: "Instagram", key: "Instagram", icon: instagramIcon }],
            value: "systeme.io",
            selected: true,
        },
        {
            id: 2,
            title: t("appointment.delay"),
            key: "delay",
            iconSrc: delay,
            iconColor: "bg-orange-500",
            options: [{ label: "0", key: 0 }, { label: "1", key: 1 }, { label: "5", key: 5 }, { label: "10", key: 10 }, { label: "15", key: 15 }, { label: "20", key: 20 }, { label: "30", key: 30 }],
            value: 15,
            unit: "Min",
            selected: false,
        },
        {
            id: 3,
            title: t("appointment.channel"),
            key: "channel",
            iconSrc: channel,
            iconColor: "bg-blue-500",
            options: [{ label: "Whatsapp", key: "Whatsapp", icon: whatsappIcon }, { label: "Instagram", key: "Instagram", icon: instagramIcon }],
            options2: [{ label: "Whatsapp", key: "Whatsapp", icon: whatsappIcon }, { label: "Email", key: "email" }, { label: "SMS", key: "SMS" }],
            value: "Instagram",
            selected: true,
        },
        {
            id: 4,
            title: t("appointment.template"),
            key: "template",
            iconSrc: template,
            iconColor: "bg-green-500",
            options: [{ label: "Select", key: "Select" }, { label: "Select2", key: "Select2" }],
            value: "Select",
            selected: false,
        },
    ];

    // Data for number options
    const followupOptions = [
        { id: 1, value: 1 },
        { id: 2, value: 2 },
        { id: 3, value: 3 },
    ];

    const emojiOptions = [
        { id: 1, label: "No emoji", value: 0 },
        { id: 2, label: "25%", value: 25 },
        { id: 3, label: "50%", value: 50 },
        { id: 4, label: "100%", value: 100 },
    ];

    const objectiveAgent = [
        { label: t("appointment.book_call"), key: "book_call" },
        { label: t("appointment.send_to_web_page"), key: "web_page" },
        { label: t("appointment.sent_to_whatsapp"), key: "whatsapp_number" }

    ]

    const directnessOptions = [
        { id: 1, value: 0 },
        { id: 2, value: 2 },
        { id: 3, value: 4 },
        { id: 4, value: 6 },
        { id: 5, value: 8 },
        { id: 6, value: 10 },
    ];

    const messageTimeRange = [
        { label: t("appointment.no_of_days_followups"), key: "wait_time_for_follow_up", options: [{ label: "0", key: 0 }, { label: "5", key: 5 }, { label: "10", key: 10 }, { label: "15", key: 15 }, { label: "30", key: 30 }] }
    ];

    const globalMessageTimeRange = [
        { label: "Min. Message time range", key: "reply_min_time", options: [5, 10, 15, 30] },
        { label: "Max. Message time range", key: "reply_max_time", options: [30, 45, 60, 90] }
    ];

    const agentsPersonalityOptions = [
        { label: t("appointment.friendly"), key: "friendly" },
        { label: t("appointment.professional"), key: "professional" },
        { label: t("appointment.energetic"), key: "energetic" },
        { label: t("appointment.relaxed"), key: "relaxed" },
        { label: t("appointment.results_oriented"), key: "results_oriented" },
        { label: t("appointment.direct"), key: "direct" },
        { label: t("appointment.empathetic"), key: "emphatic" },
    ]

    const genderOptions = [
        { label: t("appointment.male"), key: "male" },
        { label: t("appointment.female"), key: "female" }
    ]

    const calendarOptions = [
        { label: "Calendly", key: "calendly", icon: calendlyIcon },
        { label: "Google Calendar", key: "google_calendar", icon: googleCalendarIcon }
    ]

    const handleContinue = (nextStep) => {
        if (!validateForm()) {
            return
        } else {
            setStatusSteps((prev) => ({ ...prev, [`step${step}`]: true }))
            setStep(nextStep)
        }
    }


    const handleCancel = (value) => {
        switch (value) {
            case 1:
                // Close the form and reset data
                setOpen(false);
                // Reset update agent status if we were editing
                if (updateAgentStatus) {
                    setUpdateAgentStatus(false);
                }
                setFormData({
                    agent_name: "",
                    gender: '',
                    age: '', // Commented out as per Figma design
                    agent_language: [], agent_personality: "", business_description: "", your_business_offer: "",
                    qualification_questions: [""],
                    sequence: { trigger: 'systeme.io', delay: 5, channel: 'SMS', template: '' },
                    objective_of_the_agent: '',
                    calendar_choosed: '',
                    // reply_min_time: 15,
                    // reply_max_time: 60,
                    is_followups_enabled: true,
                    follow_up_details: { number_of_followups: '', min_time: 15, max_time: 60 },
                    emoji_frequency: 25,
                    // directness: 2,a
                    webpage_link: "",
                    // webpage_type: "",
                    whatsapp_number: '',
                    platform_unique_id: '',
                    calendar_id: '',
                    prompt: '',
                    // more_info_setter: '',
                })
                setStatusSteps({ step1: false, step2: false, step3: false })
                break;
            case 2:
                setFormData((prev) => ({
                    ...prev, business_description: "", your_business_offer: "",
                    qualification_questions: [""],
                    sequence: { trigger: 'systeme.io', delay: 5, channel: 'SMS', template: '' },
                    objective_of_the_agent: '',
                    calendar_choosed: '',
                    is_followups_enabled: true,
                    follow_up_details: { number_of_followups: '', min_time: 15, max_time: 60 },
                    webpage_link: "",
                    whatsapp_number: '',
                    platform_unique_id: '',
                    calendar_id: '',
                    prompt: '',
                    // more_info_setter: '',
                }))
                setStep(1)
                setStatusSteps((prev) => ({ ...prev, step2: false, step3: false }))
                break;
            default:
                setFormData((prev) => ({
                    ...prev,
                    qualification_questions: [""],
                    sequence: { trigger: 'systeme.io', delay: 5, channel: 'SMS', template: '' },
                    platform_unique_id: '',
                    prompt: '',
                    // more_info_setter: '',
                }))
                setStep(2)
                setStatusSteps((prev) => ({ ...prev, step3: false }))
                break;
        }
    }

    useEffect(() => {
        if (errors.step1 || errors.step2) {
            setTimeout(() => {
                setErrors((prev) => ({ ...prev, step1: "", step2: "" }))
            }, 10000)
        }

    }, [errors])

    const handleSelectSteps = (selectStep) => {
        if (statusSteps[`step${selectStep}`]) {
            setStep(selectStep)
        } else if (!statusSteps.step1) {
            validateForm()
            setErrors((prev) => ({ ...prev, step1: t("appointment.first_form_validation") }))
            setStep(1)
        }
        else if (!statusSteps.step2) {
            validateForm()
            setErrors((prev) => ({ ...prev, step2: t("appointment.second_form_validation") }))
            setStep(2)
        } else {
            setStep(selectStep)
        }
    }

    const getAppointementSetter = async () => {
        try {
            const response = await getAppointmentSetterById(editData)
            console.log(response)
            if (response?.status === 200) {
                setLoadingStatus(false)
                const payload = {
                    ...response.data.agent,
                    objective_of_the_agent: response.data.agent.objective_of_the_agent 
                        ? (Array.isArray(response.data.agent.objective_of_the_agent) 
                            ? response.data.agent.objective_of_the_agent 
                            : [response.data.agent.objective_of_the_agent])
                        : [],
                    follow_up_details: response.data.agent.is_followups_enabled
                        ? response.data.agent.follow_up_details
                        : formData.follow_up_details,
                    // more_info_setter: response.data.agent.more_info_setter || '',
                };
                setFormData(payload)
                setStatusSteps({ step1: true, step2: true, step3: true })
            }

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if (formData.sequence.trigger) {
            switch (formData.sequence.trigger) {
                case "Whatsapp":
                    setFormData((prev) => ({
                        ...prev, sequence: {
                            ...prev.sequence,
                            channel: "Whatsapp"
                        }
                    }))
                    break;
                case "Instagram":
                    setFormData((prev) => ({
                        ...prev, sequence: {
                            ...prev.sequence,
                            channel: "Instagram"
                        }
                    }))
                    break;
                default:
                    break;
            }

        }

    }, [formData.sequence.trigger])

    const countWords = (text) => {
        if (!text || !text.trim()) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setErrors((prev) => ({
            ...prev, [name]: ""
        }))
        
        // Limit business_description to 80 words
        if (name === 'business_description') {
            const wordCount = countWords(value);
            if (wordCount > 80) {
                // Truncate to 80 words
                const words = value.trim().split(/\s+/);
                const truncated = words.slice(0, 80).join(' ');
                setFormData((prev) => ({
                    ...prev, [name]: truncated
                }))
                return;
            }
        }
        
        if (name.startsWith("qualification_questions[")) {
            const index = parseInt(name.match(/\[(\d+)\]/)[1]);
            const updatedQuestions = [...formData?.qualification_questions];
            updatedQuestions[index] = value;
            setFormData((prev) => ({
                ...prev,
                qualification_questions: updatedQuestions,
            }));
        } else {
            setFormData((prev) => ({
                ...prev, [name]: value
            }))
        }
    }

    const addQuestion = () => {
        setFormData((prev) => ({
            ...prev,
            qualification_questions: [...prev.qualification_questions, ""],
        }));
    };

    const deleteQuestion = (indexToRemove) => {
        const updated = [...formData.qualification_questions];
        updated.splice(indexToRemove, 1);

        setFormData((prev) => ({
            ...prev,
            qualification_questions: updated,
        }));
    };


    const handleUpdate = async () => {
        if (!validateForm()) {
            console.log("Form validation failed", errors);
            return;
        }
        const finalPayload = {
            ...formData,
            qualification_questions: formData.qualification_questions.filter(question => question.trim() !== ""),
            follow_up_details: formData.is_followups_enabled
                ? formData.follow_up_details
                : {},
            // more_info_setter: formData.more_info_setter || '',
        };
        console.log(finalPayload, "payload")
        try {
            setLoading(true)
            const response = await updateAppointmentSetter(finalPayload)
            console.log(response)
            if (response.status === 200) {
                setErrors((prev) => ({ ...prev, success: response?.data?.success }))
                setTimeout(() => {
                    setOpen(true)
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


    const handleSubmit = async () => {
        console.log(validateForm());
        if (!validateForm()) {
            console.log("Form validation failed", errors);
            return;
        }
        const finalPayload = {
            ...formData,
            qualification_questions: formData.qualification_questions.filter(question => question.trim() !== ""),
            follow_up_details: formData.is_followups_enabled
                ? formData.follow_up_details
                : {},
            // more_info_setter: formData.more_info_setter || '',
        };
        console.log(finalPayload, "payload")
        try {
            setLoading(true)
            const response = await appointmentSetter(finalPayload)
            console.log(response)
            if (response.status === 200) {
                setErrors((prev) => ({ ...prev, success: response?.data?.success }))
                setTimeout(() => {
                    setOpen(true)
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

    const languagesOptions = [{ label: 'ENG', key: "en" }, { label: 'FR', key: 'fr' }];

    const LanguageSelector = ({ value = [], onChange }) => {

        const toggleLanguage = (lang) => {
            const newSelection = value.includes(lang)
                ? value.filter((l) => l !== lang)
                : [...value, lang];
            onChange(newSelection);
            setErrors((prev) => ({ ...prev, agent_language: '' }))
        };

        return (
            <div className="bg-white rounded-lg shadow-lg">
                <div className="max-h-60 overflow-auto">
                    <ul className="py-1 px-2 flex flex-col gap-1 my-1">
                        {languagesOptions.map((lang) => (
                            <li
                                key={lang}
                                onClick={() => toggleLanguage(lang.key)}
                                className={`py-2 px-4 rounded-lg cursor-pointer flex items-center hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF] gap-2 ${value.includes(lang.key)
                                    ? 'bg-[#F4F5F6] rounded-lg text-[#675FFF]' : 'text-[#5A687C]'
                                    }`}
                            >
                                <div
                                    className={`w-4 h-4 rounded border flex items-center justify-center ${value.includes(lang.key)
                                        ? 'border-[#675FFF] bg-[#675FFF]'
                                        : 'border-[#E1E4EA]'
                                        }`}
                                >
                                    {value.includes(lang.key) && (
                                        <span className="text-white text-xs">✓</span>
                                    )}
                                </div>
                                <span>{lang.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };


    const renderOptions = (list) => {
        if ((formData.sequence.trigger === "systeme.io" || formData.sequence.trigger === "clickfunnels") && list.key === "channel") {
            return (
                list.options2
            )
        } else {
            return (
                list.options
            )
        }
    }

    const renderObjectiveAgent = () => {
        const objective = formData.objective_of_the_agent || '';
        const sections = [];

        if (objective === "book_call") {
            sections.push(
                <div key="book_call" className="flex items-start gap-3 w-full mt-2">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-col items-start gap-1.5">
                            <label className="font-medium text-[#1e1e1e] text-sm">{t("appointment.select_calender")}</label>
                            <SelectDropdown
                                name="calendar"
                                options={calendarOptions}
                                value={formData.calendar_choosed}
                                onChange={(updated) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        calendar_choosed: updated,
                                    }))
                                    setErrors((prev) => ({ ...prev, calendar_choosed: '' }))
                                }}
                                placeholder={t("appointment.select")}
                                className="w-full"
                                errors={errors}
                            />
                            {errors.calendar_choosed && <p className="text-red-500 text-sm mt-1">{errors.calendar_choosed}</p>}
                        </div>
                        {formData.calendar_choosed === "google_calendar" &&
                            <div className="flex flex-col items-start gap-1.5 max-w-[498px]">
                                <label className="font-medium text-[#1e1e1e] text-sm">{t("appointment.select_google_calendar")}</label>
                                <SelectDropdown
                                    name="calendar_id"
                                    options={googleCalendarData}
                                    value={formData.calendar_id}
                                    onChange={(updated) => {
                                        console.log(updated)
                                        setFormData((prev) => ({
                                            ...prev,
                                            calendar_id: updated,
                                        }))
                                        setErrors((prev) => ({ ...prev, calendar_id: '' }))
                                    }}
                                    placeholder={t("appointment.select")}
                                    className="w-full"
                                    errors={errors}
                                />
                                {errors.calendar_id && <p className="text-red-500 text-sm mt-1">{errors.calendar_id}</p>}
                            </div>
                        }
                    </div>
                </div>
            );
        }

        if (objective === "whatsapp_number") {
            sections.push(
                <div key="whatsapp_number" className="flex items-start gap-3 w-full mt-2">
                    <div className="flex-1">
                        <div className="flex flex-col items-start gap-1.5 max-w-[498px]">
                            <label className="text-sm font-medium text-[#1e1e1e]">
                                {t("appointment.whatsapp_number")}
                            </label>
                            <input
                                type="text"
                                name='whatsapp_number'
                                value={formData?.whatsapp_number}
                                onChange={handleChange}
                                className={`w-full p-2 rounded-lg border ${errors.whatsapp_number ? 'border-red-500' : 'border-[#e1e4ea]'} bg-white focus:outline-none focus:border-[#675FFF]`}
                                placeholder={t("appointment.input_whatsapp")}
                            />
                            {errors.whatsapp_number && <p className="text-red-500 text-sm mt-1">{errors.whatsapp_number}</p>}
                        </div>
                    </div>
                </div>
            );
        }

        if (objective === "web_page") {
            sections.push(
                <div key="web_page" className="grid grid-cols-1 gap-1 w-full mt-2">
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-[#1e1e1e]">
                            {t("appointment.webpage_link")}
                        </label>
                        <div className="flex items-center border rounded-lg overflow-hidden w-full bg-white focus-within:border-[#675FFF]
  border-[#e1e4ea] focus-within:ring-0">
                            <span className="pl-3 pr-2 text-[#4B5563] bg-white focus:outline-none  font-medium  border-r border-[#e1e4ea]">
                                http://
                            </span>
                            <input
                                type="text"
                                name="webpage_link"
                                value={formData?.webpage_link}
                                onChange={handleChange}
                                className="flex-1 p-2 px-3 text-[#4B5563] bg-white focus:outline-none"
                                placeholder={t("appointment.enter_link")}
                            />
                        </div>

                        {errors.webpage_link && <p className="text-red-500 text-sm mt-1">{errors.webpage_link}</p>}
                    </div>
                </div>
            );
        }

        if (sections.length === 0) {
            return null;
        }

        return (
            <div className="flex flex-col gap-3 w-full mt-2">
                {sections}
            </div>
        );
    }

    if (dataRenderStatus) return <p className='flex justify-center items-center h-[100vh]'><span className='loader' /></p>


    return (
        <>
            <div className="w-full px-12 py-11 flex flex-col gap-4 overflow-auto ">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-900 font-[500] text-md md:text-[22px] font-[500]">{t("appointment.create_new_agent")}</h1>
                    <div className='flex gap-2'>
                        <button
                            onClick={() => setPreviewAgent(true)}
                            className="px-3 py-2 bg-white cursor-pointer border border-[#E1E4EA] rounded-lg text-[14px] font-medium text-[#1E1E1E] hover:bg-[#F9FAFB] transition-colors"
                        >
                            Preview Agent
                        </button>
                        <button
                            onClick={updateAgentStatus ? () => handleUpdate() : () => handleSubmit()}
                            disabled={loading || step !== 3}
                            className="px-3 py-2 bg-[#675FFF] cursor-pointer border border-[#5F58E8] rounded-lg text-[14px] font-medium text-white hover:bg-[#5F58E8] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <p>{t("processing")}</p>
                                    <span className="loader" />
                                </div>
                        ) : (
                            updateAgentStatus ? t("appointment.update_agent") : t("appointment.create_agent")
                        )}
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-8 w-full">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="bg-white rounded-[14px] border border-[#E1E4EA] flex flex-col overflow-hidden">
                            <div className="flex justify-between cursor-pointer items-center px-[17px] py-4 border-b border-[#E1E4EA]" onClick={() => {
                                handleSelectSteps(1)
                            }}>
                                <div className='flex items-center gap-2'>
                                    <p className={`${step === 1 ? 'bg-[#675FFF]' : statusSteps.step1 ? 'bg-[#34C759]' : 'bg-[#000000]'} h-[30px] w-[30px] flex justify-center items-center rounded-[10px] text-white`}>{statusSteps.step1 ? <CheckIcon /> : '1'}</p>
                                    <p className={`text-md font-normal ${step === 1 ? 'text-[#000000]' : 'text-[#000000]'}`}>{t("appointment.identify")}</p>
                                </div>
                                {step !== 1 && <RightArrowIcon />}
                            </div>
                            {step === 1 && <div className="flex flex-col gap-5 p-[17px]">
                                {/* Agent Name */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <label className="text-sm font-[400] text-[#868C98]">
                                            {t("appointment.agent_name")}
                                        </label>
                                        <input
                                            type="text"
                                            name='agent_name'
                                            value={formData?.agent_name}
                                            onChange={handleChange}
                                            className={`w-full bg-white p-2 rounded-lg border ${errors.agent_name ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                            placeholder={t("appointment.agent_name_placeholder")}
                                        />
                                        {errors.agent_name && <p className="text-red-500 text-sm mt-1">{errors.agent_name}</p>}
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 w-full">
                                        <div className="flex flex-col gap-1.5 w-full md:w-1/2">
                                            <label className="text- font-[400] text-[#868C98]">
                                                {t("appointment.gender")}
                                            </label>
                                            {/* <select
                                        name='gender'
                                        value={formData?.gender}
                                        onChange={handleChange}
                                        className={`w-full bg-white p-2 rounded-lg border ${errors.gender ? 'border-red-500' : 'border-[#e1e4ea]'}`}>
                                        <option value="" disabled>Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select> */}
                                            <SelectDropdown
                                                name="gender"
                                                options={genderOptions}
                                                value={formData?.gender}
                                                onChange={(updated) => {
                                                    setFormData((prev) => ({
                                                        ...prev, gender: updated
                                                    }))
                                                    setErrors((prev) => ({
                                                        ...prev, gender: ""
                                                    }))
                                                }}
                                                placeholder={t("appointment.select")}
                                                className=""
                                                errors={errors}
                                            />
                                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                                        </div>
                                        <div className="flex flex-col gap-1.5 w-full md:w-1/2">
                                            <label className="text-sm font-[400] text-[#868C98]">
                                                {t("appointment.age")}
                                            </label>
                                            <input
                                                type="text"
                                                name='age'
                                                value={formData?.age}
                                                onChange={(e) => {
                                                    const { name, value } = e.target;
                                                    if (value === '' || /^\d+$/.test(value)) {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            [name]: value === '' ? '' : parseInt(value, 10)
                                                        }));
                                                        setErrors((prev) => ({ ...prev, [name]: '' }))
                                                    }
                                                }}
                                                className={`w-full bg-white p-2 rounded-lg border ${errors.age ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                                placeholder={t("appointment.agent_age_placeholder")}
                                            />
                                            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                                        </div>
                                    </div>
                                </div>


                                {/* Agent Personality and Language */}
                                <div className="flex flex-col md:flex-row  gap-4 w-full">
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <div className='flex justify-between items-center'>
                                            <label className="text-sm font-[400] text-[#868C98]">
                                                {t("appointment.agent_personality")}
                                            </label>

                                        </div>

                                        <div ref={personalityDropdownRef} className="relative">
                                            <button
                                                ref={personalityButtonRef}
                                                type="button"
                                                onClick={() => setIsPersonalityDropdownOpen(!isPersonalityDropdownOpen)}
                                                className={`flex justify-between items-center w-full border ${errors?.agent_personality ? 'border-red-500' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 bg-white text-left hover:cursor-pointer focus:outline-none focus:border-[#675FFF]`}
                                            >
                                                <span className={`block truncate ${!formData?.agent_personality ? 'text-[#9CA3AF]' : 'text-[#1E1E1E]'}`}>
                                                    {formData?.agent_personality ? agentsPersonalityOptions.find(opt => opt.key === formData.agent_personality)?.label : t("appointment.choose_your_personality_placeholder")}
                                                </span>
                                                <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${isPersonalityDropdownOpen ? '' : 'transform rotate-180'}`} />
                                            </button>
                                            {isPersonalityDropdownOpen && createPortal(
                                                <div
                                                    className="personality-dropdown-portal fixed w-[250px] rounded-lg bg-white shadow-lg border-2 border-solid border-[#E1E4EA] z-[9999] max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#675FFF] [&::-webkit-scrollbar-thumb]:rounded-full"
                                                    style={{
                                                        top: `${personalityDropdownPosition.top - 8}px`,
                                                        right: `${personalityDropdownPosition.right}px`,
                                                        transform: 'translateY(-100%)'
                                                    }}
                                                >
                                                    <ul className="py-2">
                                                        {agentsPersonalityOptions.map((option) => (
                                                            <li
                                                                key={option.key}
                                                                className={`cursor-pointer font-[400] select-none px-4 py-2 hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF] ${formData?.agent_personality === option.key ? 'text-[#675FFF] bg-[#F4F5F6]' : 'text-[#5A687C]'}`}
                                                                onClick={() => {
                                                                    setFormData((prev) => ({
                                                                        ...prev, agent_personality: option.key
                                                                    }))
                                                                    setErrors((prev) => ({
                                                                        ...prev, agent_personality: ""
                                                                    }))
                                                                    setIsPersonalityDropdownOpen(false)
                                                                }}
                                                            >
                                                                {option.label}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>,
                                                document.body
                                            )}
                                        </div>
                                        {errors.agent_personality && <p className="text-red-500 text-sm mt-1">{errors.agent_personality}</p>}
                                    </div>
                                    <div className='flex flex-col gap-1.5 flex-1'>
                                        <div className="relative" ref={dropdownRef}>
                                            <label className="text-sm font-[400] text-[#868C98]">
                                                {t("appointment.agent_language")}
                                            </label>
                                            <button
                                                onClick={() => setShowLanguageSelector((prev) => !prev)}
                                                className={`w-full flex justify-between items-center mt-1 bg-white border ${errors.agent_language ? 'border-red-500' : 'border-[#e1e4ea]'} rounded-lg px-3 py-[7.5px] cursor-pointer text-[#5A687C] focus:outline-none focus:border-[#675FFF]`}
                                            >
                                                <span className={`${formData.agent_language?.length > 0 ? 'text-[#1E1E1E]' : 'text-[#5A687C]'}`} >{formData.agent_language?.length > 0
                                                    ? formData.agent_language.map(lan => {
                                                        const found = languagesOptions?.length > 0 && languagesOptions.find(d => d.key === lan);
                                                        return found?.label;
                                                    }).join(', ')
                                                    : `${t("appointment.select") + " " + t("appointment.languages")}`}</span>
                                                <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${showLanguageSelector ? 'transform rotate-180' : ''}`} />
                                            </button>
                                            {showLanguageSelector && (
                                                <div className="absolute z-50 mt-1 w-full">
                                                    <LanguageSelector
                                                        value={formData.agent_language}
                                                        onChange={(updated) => {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                agent_language: updated,
                                                            }))
                                                            setShowLanguageSelector(false)
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {errors.agent_language && <p className="text-red-500 text-sm mt-1">{errors.agent_language}</p>}
                                    </div>

                                </div>

                                {/* Emoji Frequency */}
                                <div className="flex justify-between gap-3 p-2 w-full">
                                    <div className='flex gap-1'>
                                        <button
                                            onClick={() => setFormData((prev) => ({
                                                ...prev,
                                                emoji_frequency: formData.emoji_frequency == 25 ? 0 : 25
                                            }))}
                                            className={`relative cursor-pointer w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${formData.emoji_frequency ? "bg-[#675fff]" : "bg-gray-300"
                                                }`}
                                        >
                                            <span
                                                className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-300 ${formData.emoji_frequency ? "translate-x-5" : "translate-x-1"
                                                    }`}
                                            />
                                        </button>
                                        <div className="pl-2 text-sm font-[400] ">
                                            {t("appointment.emoji_freq")}
                                        </div>
                                        <div className="text-sm font-[400]">
                                            {t("appointment.pow_msg")}
                                        </div>
                                    </div>
                                    <div>
                                    </div>
                                </div>

                                <hr style={{ color: "#E1E4EA" }} />

                                <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => handleCancel(1)} className="px-3 py-2 cursor-pointer rounded-lg text-[14px] font-[500] text-center bg-white border-[1.5px] border-[#E1E4EA] text-[#1E1E1E]">{t("appointment.cancel")}</button>
                                    <button onClick={() => {
                                        handleContinue(2)
                                    }} className="px-3 py-2 cursor-pointer rounded-lg  text-[14px] font-[500] text-center bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white">{t("appointment.continue")}</button>
                                </div>

                            </div>}
                        </div>
                        {errors.step1 && <p className="text-red-500 text-sm mt-1">{errors.step1}</p>}

                        <div className="bg-white rounded-[14px] border border-[#E1E4EA] p-[17px] flex flex-col gap-3">
                            <div className="flex justify-between cursor-pointer items-center" onClick={() => {
                                handleSelectSteps(2)
                            }}>
                                <div className='flex items-center gap-2'>
                                    <p className={`${step === 2 ? 'bg-[#675FFF]' : statusSteps.step2 ? 'bg-[#34C759]' : 'bg-[#000000]'} h-[30px] w-[30px] flex justify-center items-center rounded-[10px] text-white`}>{statusSteps.step2 ? <CheckIcon /> : '2'}</p>
                                    <p className={`text-md font-normal ${step === 2 ? 'text-[#675FFF]' : 'text-[#000000]'}`}>{t("appointment.objective")}</p>
                                </div>
                                {step !== 2 && <RightArrowIcon />}
                            </div>
                            {step === 2 && <div className="flex flex-col gap-5 overflow-auto">
                                <hr style={{ color: "#E1E4EA" }} />

                                {/* Business Description and Offer */}
                                <div className="flex flex-col md:flex-row gap-4 w-full">
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <label className="text-sm font-[400] text-[#868C98] flex items-center gap-1">
                                            {t("appointment.business_description")}

                                            <div
                                                ref={tooltipIconRef}
                                                className="relative"
                                                onMouseEnter={() => setIsTooltipVisible(true)}
                                                onMouseLeave={() => setIsTooltipVisible(false)}
                                            >
                                                <InfoIcon className="w-4 h-4 cursor-pointer" />

                                                {/* Tooltip */}
                                                {isTooltipVisible && createPortal(
                                                    <div
                                                        className="fixed w-[450px] bg-black text-white text-xs rounded-md px-2 py-1 z-[10000] pointer-events-none"
                                                        style={{
                                                            top: `${tooltipPosition.top}px`,
                                                            left: `${tooltipPosition.left}px`,
                                                            transform: 'translate(-50%, -100%)',
                                                            marginTop: '-8px'
                                                        }}
                                                    >
                                                        Example: I’m a therapist specialized in stress management. I help anxious individuals regain calm and clarity through a blend of breathing techniques.
                                                    </div>,
                                                    document.body
                                                )}
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                name='business_description'
                                                onChange={handleChange}
                                                value={formData?.business_description}
                                                rows={4}
                                                className={`w-full bg-white text-black p-2 pb-8 rounded-lg border  ${errors.business_description ? 'border-red-500' : 'border-[#e1e4ea]'} resize-none focus:outline-none focus:border-[#675FFF]`}
                                                placeholder={t("appointment.business_description_placeholder")}
                                            />
                                            <div className="absolute bottom-2 right-2 text-[#868C98] text-xs">
                                                {countWords(formData?.business_description || '')}/80 Word
                                            </div>
                                        </div>
                                        {errors.business_description && <p className="text-red-500 text-sm mt-1">{errors.business_description}</p>}
                                    </div>
                                </div>

                                {/* Objective of the agent and Followup Options */}
                                <div className="flex flex-col md:flex-row gap-4 w-full">
                                    {/* Objective of the agent */}
                                    <div className="flex flex-col items-start gap-3 p-3.5 w-full md:w-1/2 bg-[#fff] border border-[#E1E4EA] rounded-[10px]">
                                        <div className="flex items-center gap-2.5 w-full">
                                            <div className="flex-1">
                                                <div className="font-[400] text-[#1e1e1e] text-base">{t("appointment.business_offer")}</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row items-start gap-4">
                                            {objectiveAgent.map((each) => (
                                            <div key={each.key} className="flex px-2 items-center gap-2 cursor-pointer" onClick={() => {
                                                setFormData((prev) => {
                                                    const currentObjective = prev.objective_of_the_agent || '';
                                                    const isSelected = currentObjective === each.key;
                                                    
                                                    // If clicking the same option, deselect it; otherwise select the new one
                                                    const newObjective = isSelected ? '' : each.key;
                                                    
                                                    // Clear related fields when changing or deselecting
                                                    const updates = { objective_of_the_agent: newObjective };
                                                    if (newObjective !== "web_page") {
                                                        updates.webpage_link = "";
                                                    }
                                                    if (newObjective !== "book_call") {
                                                        updates.calendar_choosed = '';
                                                        updates.calendar_id = '';
                                                    }
                                                    if (newObjective !== "whatsapp_number") {
                                                        updates.whatsapp_number = "";
                                                    }
                                                    
                                                    return { ...prev, ...updates };
                                                })
                                                setErrors((prev) => ({ ...prev, objective_of_the_agent: "" }))
                                            }}
                                            >
                                                <div>{formData.objective_of_the_agent && formData.objective_of_the_agent === each.key ? <CheckedCheckbox /> : <EmptyCheckbox />}</div>

                                                <span className="text-md text-gray-700">{each.label}</span>
                                            </div>
                                            ))}
                                        </div>
                                        {renderObjectiveAgent()}
                                    </div>

                                    {/* Followup Options */}
                                    <div className="flex flex-col gap-3 p-3.5 w-full md:w-1/2 bg-[#fff] border border-[#E1E4EA] rounded-[10px]">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-[400] text-base text-black">
                                                {t("appointment.enable_followup")}
                                            </span>
                                            <span className="text-sm text-[#868C98]">
                                                Customize total followup and number of the days.
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setFormData((prev) => ({
                                                ...prev,
                                                is_followups_enabled: !formData.is_followups_enabled
                                            }))}
                                            className={`relative cursor-pointer w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${formData.is_followups_enabled ? "bg-[#675fff]" : "bg-gray-300"
                                                }`}
                                        >
                                            <span
                                                className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-300 ${formData.is_followups_enabled ? "translate-x-5" : "translate-x-1"
                                                    }`}
                                            />
                                        </button>
                                    </div>


                                    <div className="flex flex-col gap-1.5 w-full">
                                        <label className="text-sm font-medium text-[#1e1e1e]">
                                            {
                                                t("appointment.number_followup")
                                            }
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            disabled={!formData.is_followups_enabled}
                                            name="number_of_followups"
                                            value={formData?.follow_up_details?.number_of_followups ?? ''}
                                            onChange={(e) => {
                                                const { name, value } = e.target;
                                                let parsedValue = parseInt(value);

                                                if (value === '') {
                                                    parsedValue = '';
                                                } else if (!isNaN(parsedValue)) {
                                                    parsedValue = Math.max(1, Math.min(10, parsedValue));
                                                }
                                                console.log(parsedValue)

                                                setFormData((prev) => ({
                                                    ...prev,
                                                    follow_up_details: {
                                                        ...prev.follow_up_details,
                                                        [name]: parsedValue
                                                    }
                                                }));

                                                // Clear error if value is valid (including 0)
                                                if (value === '' || isNaN(parsedValue)) {
                                                    setErrors((prev) => ({ ...prev, [name]: t("appointment.field_required") }));
                                                } else {
                                                    setErrors((prev) => ({ ...prev, [name]: '' }));
                                                }
                                            }}
                                            style={{ width: '100%' }}
                                            className={`p-2 bg-white rounded-lg border ${errors.number_of_followups ? 'border-red-500' : 'border-[#e1e4ea]'} no-spinner focus:outline-none focus:border-[#675FFF]`}
                                            placeholder={t("appointment.enter_number_between")}
                                        />

                                        {errors.number_of_followups && <p className="text-red-500 text-sm mt-1">{errors.number_of_followups}</p>}

                                    </div>

                                    <div className="flex flex-col gap-1.5 w-full">
                                        <label className="text-sm font-medium text-[#1e1e1e]">
                                            {t("appointment.no_of_days_followups")}
                                        </label>
                                        <div className="relative flex items-center w-full">
                                            <input
                                                type="number"
                                                name="wait_time_for_follow_up"
                                                value={formData?.follow_up_details?.wait_time_for_follow_up ?? ''}
                                                onChange={(e) => {
                                                    const { name, value } = e.target;
                                                    let parsedValue = parseInt(value);
                                                    
                                                    if (value === '') {
                                                        parsedValue = '';
                                                    } else if (!isNaN(parsedValue)) {
                                                        parsedValue = Math.max(0, parsedValue);
                                                    }
                                                    
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        follow_up_details: {
                                                            ...prev.follow_up_details,
                                                            [name]: parsedValue
                                                        }
                                                    }));
                                                    
                                                    if (value === '' || isNaN(parsedValue)) {
                                                        setErrors((prev) => ({ ...prev, [name]: t("appointment.field_required") }));
                                                    } else {
                                                        setErrors((prev) => ({ ...prev, [name]: '' }));
                                                    }
                                                }}
                                                disabled={!formData.is_followups_enabled}
                                                className={`w-full p-2 pr-16 rounded-lg border ${errors.wait_time_for_follow_up ? 'border-red-500' : 'border-[#e1e4ea]'} bg-white focus:outline-none focus:border-[#675FFF] no-spinner`}
                                                placeholder="15"
                                            />
                                            <span className="absolute right-3 text-[#868C98] text-sm pointer-events-none">
                                                {t("appointment.days")}
                                            </span>
                                        </div>
                                        {errors.wait_time_for_follow_up && <p className="text-red-500 text-sm mt-1">{errors.wait_time_for_follow_up}</p>}
                                    </div>
                                </div>
                                </div>

                                <hr style={{ color: "#E1E4EA" }} />

                                <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => handleCancel(2)} className="px-3 py-2 cursor-pointer rounded-lg text-[14px] font-[500] text-center bg-white border-[1.5px] border-[#E1E4EA] text-[#1E1E1E]">{t("appointment.cancel")}</button>
                                    <button onClick={() => {
                                        handleContinue(3)
                                    }} className="px-3 py-2 cursor-pointer rounded-lg text-[14px] font-[500] text-center bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white">{t("appointment.continue")}</button>
                                </div>
                            </div>}
                        </div>
                        {errors.step2 && <p className="text-red-500 text-sm mt-1">{errors.step2}</p>}

                        <div className="bg-white rounded-[14px] border border-[#E1E4EA] p-[17px] flex flex-col gap-3">
                            <div className="flex cursor-pointer justify-between items-center" onClick={() => {
                                handleSelectSteps(3)
                            }}>
                                <div className='flex items-center gap-2'>
                                    <p className={`${step === 3 ? 'bg-[#675FFF]' : statusSteps.step3 ? 'bg-[#34C759]' : 'bg-[#000000]'} h-[30px] w-[30px] flex justify-center items-center rounded-[10px] text-white`}>{statusSteps.step3 ? <CheckIcon /> : '3'}</p>
                                    <p className={`text-md font-normal ${step === 3 ? 'text-[#675FFF]' : 'text-[#000000]'}`}>{t("appointment.behavior")}</p>
                                </div>
                                {step !== 3 && <RightArrowIcon />}
                            </div>
                            {step === 3 && <div className="flex flex-col gap-5">
                                <hr style={{ color: "#E1E4EA" }} />

                                {/* Prompt Section */}
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-base font-[400] text-[#1e1e1e]">{t("appointment.prompt") || "Prompt"}</h3>
                                    
                                    <div className="flex flex-col md:flex-row gap-4 w-full">
                                        {/* Guidelines/Prompt */}
                                        <div className="flex flex-col gap-1.5 flex-1">
                                            <label className="text-sm font-[400] text-[#868C98]">
                                                {t("appointment.prompt_guild") || "Guidelines, instructions, or context to shape your AI agent's behavior."}
                                            </label>
                                            <textarea
                                                name='prompt'
                                                onChange={handleChange}
                                                value={formData?.prompt}
                                                rows={6}
                                                className={`w-full bg-white p-2 rounded-lg border ${errors.prompt ? 'border-red-500' : 'border-[#e1e4ea]'} resize-none focus:outline-none focus:border-[#675FFF]`}
                                                placeholder="Enter your prompt here"
                                            />
                                            {errors.prompt && <p className="text-red-500 text-sm mt-1">{errors.prompt}</p>}
                                        </div>
                                        
                                        
                                    </div>
                                </div>

                                {/* Qualification Questions */}
                                <div className="flex flex-col gap-4 w-full">
                                    <h3 className="text-base font-medium text-[#1e1e1e]">
                                        {t("appointment.qualification_questions") || "Qualifications questions"}
                                    </h3>
                                    
                                    <div className="flex flex-col gap-3">
                                        {formData.qualification_questions.map((question, index) => (
                                            <div key={index} className="flex items-center gap-3 w-full">
                                                <span className="text-base font-medium text-[#1e1e1e] flex-shrink-0">
                                                    {index + 1}.
                                                </span>
                                                <input
                                                    type="text"
                                                    name={`qualification_questions[${index}]`}
                                                    value={question}
                                                    onChange={handleChange}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            // If current question has content, add a new question
                                                            if (question.trim()) {
                                                                const currentLength = formData.qualification_questions.length;
                                                                addQuestion();
                                                                // Focus on the new input after state update
                                                                setTimeout(() => {
                                                                    const nextInput = document.querySelector(`input[name="qualification_questions[${currentLength}]"]`);
                                                                    if (nextInput) {
                                                                        nextInput.focus();
                                                                    }
                                                                }, 10);
                                                            }
                                                        }
                                                    }}
                                                    placeholder={t("appointment.enter_question") || "this is example content for my first questions and how the action look likes ?"}
                                                    className={`flex-1 bg-white p-2 rounded-lg border ${errors[`qualification_questions[${index}]`] ? "border-red-500" : "border-[#e1e4ea]"} focus:outline-none focus:border-[#675FFF]`}
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => deleteQuestion(index)}
                                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-[#e1e4ea] hover:bg-[#F4F5F6] transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        type="button" 
                                        onClick={addQuestion}
                                        className="flex items-center gap-1 text-[#675FFF] font-medium text-sm hover:text-[#5F58E8] transition-colors self-start"
                                    >
                                        <span className="text-[#675FFF]">+</span>
                                        <span>{t("appointment.add_new_questions") || "Add New Questions"}</span>
                                    </button>
                                </div>

                                {/* Sequence Section */}
                                <div className="p-3 w-full relative bg-white rounded-2xl border border-solid border-[#e1e4ea]" style={{ backgroundImage: `url(${bgback})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                    <div className="font-medium text-[#1e1e1e] text-base py-2">
                                        {t("appointment.sequence")}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        {sequenceCards.map((card, index) => (
                                            <React.Fragment key={card.id}>
                                                {index > 0 && (
                                                    <div className="flex items-center mx-2">
                                                        <svg width="36" height="18" viewBox="0 0 40 20" className="text-[#e1e4ea]">
                                                            <path
                                                                d="M 0 10 Q 15 0, 30 10 Q 35 15, 40 10"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                fill="none"
                                                                strokeLinecap="round"
                                                            />
                                                            <polygon
                                                                points="38,10 40,8 40,12"
                                                                fill="currentColor"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}

                                                <div
                                                    className={`flex flex-col w-[25%] items-center justify-center bg-white rounded-[11px] border ${card.selected ? "border-[#335bfb66]" : "border-[#e1e4ea]"
                                                        } overflow-hidden`}
                                                >
                                                    {/* Header with Icon */}
                                                    <div className="w-full flex items-center gap-2 px-3 py-2 bg-white">
                                                        <div className={`${card.iconColor || 'bg-[#675FFF]'} rounded-lg p-2 flex items-center justify-center`}>
                                                            <img
                                                                alt={card.title}
                                                                src={card.iconSrc}
                                                                className="w-5 h-5"
                                                            />
                                                        </div>
                                                        <div className="font-semibold text-[#1E1E1E] text-sm">
                                                            {card.title}
                                                        </div>
                                                    </div>

                                                    <div className="w-full p-3 flex flex-col gap-2">

                                                        <div className="relative w-full">
                                                            {/* <select
                                                                        name={card.key}
                                                                        className="w-full h-8 py-1 px-3 bg-white border border-[#e1e4ea] rounded-lg text-base text-[#1e1e1e] shadow-sm"
                                                                        value={formData.sequence[card.key]}
                                                                        onChange={(e) => {
                                                                            const { name, value } = e.target;
                                                                            setFormData((prev) => ({
                                                                                ...prev,
                                                                                // platform_unique_id:'',
                                                                                sequence: {
                                                                                    ...prev.sequence,
                                                                                    [name]: name === "delay" ? parseInt(value) : value,
                                                                                },
                                                                            }));
                                                                        }}
                                                                        disabled={(formData.sequence.trigger === "Whatsapp" || formData.sequence.trigger === "Instagram") && card.key === "channel"}
                                                                    >
                                                                        {renderOptions(card)}
                                                                    </select> */}
                                                            <SelectDropdown
                                                                name={card.key}
                                                                options={renderOptions(card)}
                                                                value={formData.sequence[card.key]}
                                                                onChange={(updated) => {
                                                                    console.log(updated)
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        platform_unique_id: '',
                                                                        sequence: {
                                                                            ...prev.sequence,
                                                                            [card.key]: card.key === "delay" ? parseInt(updated) : updated,
                                                                        },
                                                                    }));
                                                                }}
                                                                placeholder={t("appointment.select")}
                                                                className=""
                                                                errors={errors}
                                                                disabled={((formData.sequence.trigger === "Whatsapp" || formData.sequence.trigger === "Instagram") && card.key === "channel") || (formData.sequence.trigger === "Instagram" && card.key === "template")}
                                                            />
                                                            {((card.key === "trigger" || card.key === "channel") && (formData.sequence.trigger === "Instagram" || formData.sequence.trigger === "Whatsapp")) &&
                                                                <>
                                                                    <SelectDropdown
                                                                        name="platform_unique_id"
                                                                        options={
                                                                            formData.sequence.trigger === "Instagram"
                                                                                ? (Array.isArray(instagramData) ? instagramData : [])
                                                                                : (Array.isArray(whatsappData) ? whatsappData : [])
                                                                        }
                                                                        value={formData.platform_unique_id}
                                                                        onChange={(updated) => {
                                                                            setFormData((prev) => ({
                                                                                ...prev, platform_unique_id: updated
                                                                            }))
                                                                            setErrors((prev) => ({ ...prev, platform_unique_id: "" }))
                                                                        }}
                                                                        placeholder={t("appointment.account")}
                                                                        className="mt-2"
                                                                        errors={errors}
                                                                        disabled={false}
                                                                    />
                                                                    {errors.platform_unique_id && (
                                                                        <p className="text-red-500 text-sm mt-1">{errors.platform_unique_id}</p>
                                                                    )}
                                                                </>
                                                            }
                                                            {card.unit && (
                                                                <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-sm text-[#5A687C]">
                                                                    {card.unit}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                {/* Silent Hours Section (single, non-removable time range) */}
                                <div className="flex flex-col gap-1.5 w-full mt-4">
                                    <label className="text-sm font-medium text-[#1e1e1e]">
                                        {t("appointment.silent_hours")}
                                    </label>
                                    <div className="flex flex-row gap-4 w-full items-end">
                                        {/* Start Time */}
                                        <div className="flex flex-col gap-1.5 w-1/2">
                                            <label className="text-sm font-medium text-[#868C98]">
                                                {"Time Start"}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="time"
                                                    value={formData.silent_hours && formData.silent_hours[0] ? formData.silent_hours[0].start : ''}
                                                    onChange={e => {
                                                        const updated = [{
                                                            start: e.target.value,
                                                            end: formData.silent_hours && formData.silent_hours[0] ? formData.silent_hours[0].end : ''
                                                        }];
                                                        setFormData(prev => ({ ...prev, silent_hours: updated }));
                                                    }}
                                                    placeholder="Start"
                                                    className="w-full p-2 pl-4 rounded-xl border border-[#e1e4ea] focus:outline-none focus:border-[#675FFF] text-base text-[#1E1E1E] bg-white h-11"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Separator */}
                                        <div className="flex items-center pb-2">
                                            <span className="text-[#1E1E1E] text-lg">-</span>
                                        </div>
                                        
                                        {/* End Time */}
                                        <div className="flex flex-col gap-1.5 w-1/2">
                                            <label className="text-sm font-medium text-[#868C98]">
                                                {"Time End"}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="time"
                                                    value={formData.silent_hours && formData.silent_hours[0] ? formData.silent_hours[0].end : ''}
                                                    onChange={e => {
                                                        const updated = [{
                                                            start: formData.silent_hours && formData.silent_hours[0] ? formData.silent_hours[0].start : '',
                                                            end: e.target.value
                                                        }];
                                                        setFormData(prev => ({ ...prev, silent_hours: updated }));
                                                    }}
                                                    placeholder="End"
                                                    className="w-full p-2 pl-4 rounded-xl border border-[#e1e4ea] focus:outline-none focus:border-[#675FFF] text-base text-[#1E1E1E] bg-white h-11"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </div>
                        {errors.success && <p className="text-green-500 text-sm mt-1">{errors.success}</p>}
                        {errors.error && <p className="text-red-500 text-sm mt-1">{errors.error}</p>}

                    </div>
                </div>
                {updateAgent && (
                    <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
                        <div className="bg-white max-h-[547px] flex flex-col gap-3 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
                            <button
                                onClick={() => setUpdateAgent(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className='flex justify-between mt-5'>
                                <h2 className="text-[#1E1E1E] font-semibold text-[20px] mb-2">Test Sami</h2>
                                <div className="flex items-center px-3 gap-2 border border-[#E1E4EA] rounded-[8px] h-[38px]">
                                    <LuRefreshCw color="#5E54FF" />
                                    <button className="text-[16px] text-[#5A687C]">
                                        {
                                            t("appointment.reset")
                                        }
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block my-2 text-[14px] font-medium text-[#292D32]">Select Template</label>
                                    <div className="w-full flex items-center border border-gray-300 rounded-lg pb-1">
                                        <select
                                            name="channel"
                                            className="w-full bg-white px-4 py-2 rounded-lg "
                                        >
                                            <option value="" disabled>{t("appointment.select")}</option>
                                            <option value="email">Email</option>
                                            <option value="Member">Member</option>
                                            <option value="Guest">Guest</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[14px] font-medium text-[#292D32] my-2">{t("appointment.message")}</label>
                                    <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                                        <textarea
                                            type="text"
                                            name="message"
                                            placeholder={t("appointment.type_message")}
                                            rows={4}
                                            className="w-full focus:outline-none"
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="flex gap-2 mt-3">
                                <button onClick={() => setUpdateAgent(false)} className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                                    {t("appointment.test")}
                                </button>
                                <button onClick={() => {
                                    setUpdateAgentStatus(false)
                                    setOpen(true)
                                    console.log(formData, "formData")
                                }} className={`w-full text-[16px] text-white rounded-[8px] ${loading ? "bg-[#5f54ff98]" : " bg-[#5E54FF]"} h-[38px]`}>
                                    {loading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Send"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div >
            {previewAgent && <AgentPreviewModal setPreviewAgent={setPreviewAgent} formData={formData} agentsPersonalityOptions={agentsPersonalityOptions} languagesOptions={languagesOptions} />
            }
            {
                errorMessage && <div className="inter fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
                    <div className="bg-white max-h-[300px] flex flex-col gap-4 w-full max-w-md rounded-2xl shadow-xl p-6 relative">
                        <button
                            onClick={() => {
                                setErrorMessage('')
                            }}
                            className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-6 mt-6">
                            <h2 className="text-[20px] font-[600] text-center text-[#292D32]">{errorMessage}</h2>
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    onClick={() => setErrorMessage('')}
                                    className={`w-fit bg-[#675FFF] cursor-pointer text-white py-[7px] px-[20px] rounded-[8px] font-semibold  transition`}
                                >
                                    {t("appointment.ok")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default CreateNewAgent

