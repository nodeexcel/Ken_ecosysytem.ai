import { useEffect, useState } from 'react'
import trigger from '../assets/svg/sequence_trigger.svg'
import delay from '../assets/svg/sequence_delay.svg'
import channel from '../assets/svg/sequence_channel.svg'
import template from '../assets/svg/sequence_template.svg'
import { X } from 'lucide-react';
import { LuRefreshCw } from 'react-icons/lu';
import { AddPlus, CheckedCheckbox, CrossDelete, EmptyCheckbox } from '../icons/icons'
import { appointmentSetter, getAppointmentSetterById, updateAppointmentSetter } from '../api/appointmentSetter'

function CreateNewAgent({ editData, setOpen, setUpdateAgentStatus, updateAgentStatus }) {
    const [formData, setFormData] = useState({
        agent_name: "",
        agent_language: "english", agent_personality: "", business_description: "", your_business_offer: "",
        qualification_questions: [""],
        sequence: { trigger: 'systeme.io', delay: 5, channel: 'SMS', template: '' },
        objective_of_the_agent: '',
        calendar_choosed: '',
        reply_min_time: 15,
        reply_max_time: 60,
        is_followups_enabled: true,
        follow_up_details: { number_of_followups: 2, min_time: 15, max_time: 60 },
        emoji_frequency: 25,
        directness: 2,
        webpage_link: "",
        webpage_type: ""
    })
    const [loadingStatus, setLoadingStatus] = useState(true)
    const [dataRenderStatus, setDataRenderStatus] = useState(true)

    const [updateAgent, setUpdateAgent] = useState(false);
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({});

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

        if (!formData.agent_name.trim()) newErrors.agent_name = "Agent name is required.";
        if (!formData.agent_personality) newErrors.agent_personality = "Agent personality is required.";
        if (!formData.business_description.trim()) newErrors.business_description = "Business description is required.";
        if (formData.business_description.trim().length > 1 && formData.business_description.length < 50) newErrors.business_description = "Min 50 characters are required.";
        if (!formData.your_business_offer.trim()) newErrors.your_business_offer = "Business offer is required.";
        if (formData.your_business_offer.trim().length > 1 && formData.your_business_offer.length < 50) newErrors.your_business_offer = "Min 50 characters are required.";
        if (!formData.objective_of_the_agent.trim()) newErrors.objective_of_the_agent = "Objective of the agent is required.";

        if (formData.objective_of_the_agent === "book_call") {
            if (!formData.calendar_choosed) {
                newErrors.calendar_choosed = "Calendar must be chosen when objective is 'book_call'.";
            }
        }

        if (formData.objective_of_the_agent === "web_page") {
            if (!formData.webpage_link.trim()) {
                newErrors.webpage_link = "Webpage link is required when objective is 'web_page'.";
            }
            if (!formData.webpage_type.trim()) {
                newErrors.webpage_type = "Webpage type is required when objective is 'web_page'.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Data for sequence cards
    const sequenceCards = [
        {
            id: 1,
            title: "Trigger",
            key: "trigger",
            iconSrc: trigger,
            options: [{ label: "Systeme.io", key: "systeme.io" }, { label: "Clickfunnels", key: "clickfunnels" }, { label: "Whatsapp", key: "Whatsapp" }, { label: "Instagram", key: "Instagram" }],
            value: "systeme.io",
            selected: true,
        },
        {
            id: 2,
            title: "Delay",
            key: "delay",
            iconSrc: delay,
            options: [{ label: "5", key: 5 }, { label: "10", key: 10 }, { label: "15", key: 15 }, { label: "20", key: 20 }, { label: "30", key: 30 }],
            value: 15,
            unit: "Min",
            selected: false,
        },
        {
            id: 3,
            title: "Channel",
            key: "channel",
            iconSrc: channel,
            options: [{ label: "Whatsapp", key: "Whatsapp" }, { label: "Instagram", key: "Instagram" }],
            options2: [{ label: "Whatsapp", key: "Whatsapp" }, { label: "Email", key: "email" }, { label: "SMS", key: "SMS" }],
            value: "Instagram",
            selected: true,
        },
        {
            id: 4,
            title: "Template",
            key: "template",
            iconSrc: template,
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
        { label: "Book a Call", key: "book_call" },
        { label: "Send to a web page", key: "web_page" },

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
        { label: "Min. Message time range", key: "min_time", options: [5, 10, 15, 30] },
        { label: "Max. Message time range", key: "max_time", options: [30, 45, 60, 90] }
    ];

    const globalMessageTimeRange = [
        { label: "Min. Message time range", key: "reply_min_time", options: [5, 10, 15, 30] },
        { label: "Max. Message time range", key: "reply_max_time", options: [30, 45, 60, 90] }
    ];

    const getAppointementSetter = async () => {
        try {
            const response = await getAppointmentSetterById(editData)
            console.log(response)
            if (response?.status === 200) {
                setLoadingStatus(false)
                const payload = {
                    ...response.data.agent,
                    follow_up_details: response.data.agent.is_followups_enabled
                        ? response.data.agent.follow_up_details
                        : formData.follow_up_details,
                };
                setFormData(payload)
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

    const handleChange = (e) => {
        const { name, value } = e.target
        setErrors((prev) => ({
            ...prev, [name]: ""
        }))
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
            follow_up_details: formData.is_followups_enabled
                ? formData.follow_up_details
                : {},
        };
        console.log(finalPayload, "payload")
        try {
            setLoading(true)
            const response = await updateAppointmentSetter(finalPayload)
            console.log(response)
            if (response.status === 200) {
                setOpen(true)
            } else {
                setLoading(false)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    const handleSubmit = async () => {
        if (!validateForm()) {
            console.log("Form validation failed", errors);
            return;
        }
        const finalPayload = {
            ...formData,
            follow_up_details: formData.is_followups_enabled
                ? formData.follow_up_details
                : {},
        };
        console.log(finalPayload, "payload")
        try {
            setLoading(true)
            const response = await appointmentSetter(finalPayload)
            console.log(response)
            if (response.status === 200) {
                setOpen(true)
            } else {
                setLoading(false)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const renderOptions = (list) => {
        if ((formData.sequence.trigger === "systeme.io" || formData.sequence.trigger === "clickfunnels") && list.key === "channel") {
            return (
                list.options2.map((e) => (
                    <option key={e.key} value={e.key}>
                        {e.label}
                    </option>
                ))
            )
        } else {
            return (
                list.options.map((e) => (
                    <option key={e.key} value={e.key}>
                        {e.label}
                    </option>
                ))
            )
        }
    }

    const renderObjectiveAgent = () => {
        switch (formData.objective_of_the_agent) {
            case "web_page":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 w-full">
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-sm font-medium text-[#1e1e1e]">
                                Webpage Link
                            </label>
                            <input
                                type="text"
                                name='webpage_link'
                                value={formData?.webpage_link}
                                onChange={handleChange}
                                className={`w-full p-2 rounded-lg border ${errors.webpage_link ? 'border-red-500' : 'border-[#e1e4ea]'} bg-white`}
                                placeholder="http://  Enter link"
                            />
                            {errors.webpage_link && <p className="text-red-500 text-sm mt-1">{errors.webpage_link}</p>}
                        </div>
                        <div className="flex flex-col items-start gap-1.5 w-full">
                            <label className="font-medium text-[#1e1e1e] text-sm">Send to a web page for</label>
                            <select
                                name="calendar"
                                value={formData.webpage_type}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        webpage_type: e.target.value,
                                    }))
                                    setErrors((prev) => ({ ...prev, webpage_type: '' }))
                                }
                                }
                                className={`w-full py-[9px] px-2 bg-white border ${errors.webpage_type ? 'border-red-500' : 'border-[#e1e4ea]'} rounded-lg text-base text-[#1e1e1e]`}
                            >
                                <option disabled value="">Select</option>
                                <option value="sales">Sales</option>
                                <option value="ebook">ebook</option>
                            </select>
                            {errors.webpage_type && <p className="text-red-500 text-sm mt-1">{errors.webpage_type}</p>}
                        </div>
                    </div>
                )
            default:
                return (
                    <div className="flex items-start gap-3 w-full mt-2">
                        <div className="flex-1">
                            <div className="flex flex-col items-start gap-1.5 max-w-[498px]">
                                <label className="font-medium text-[#1e1e1e] text-sm">Select Calendar</label>
                                <select
                                    name="calendar"
                                    value={formData.calendar_choosed}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            calendar_choosed: e.target.value,
                                        }))
                                        setErrors((prev) => ({ ...prev, calendar_choosed: '' }))
                                    }
                                    }
                                    className={`w-full p-2 bg-white border ${errors.calendar_choosed ? 'border-red-500' : 'border-[#e1e4ea]'} rounded-lg text-base text-[#1e1e1e]`}
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="calendly">Calendly</option>
                                    <option value="google_calendar">Google Calendar</option>
                                </select>
                                {errors.calendar_choosed && <p className="text-red-500 text-sm mt-1">{errors.calendar_choosed}</p>}
                            </div>
                        </div>
                    </div>
                )
        }
    }

    if (dataRenderStatus) return <p className='flex justify-center items-center h-[70vh]'><span className='loader' /></p>


    return (
        <div className="w-full p-4 flex flex-col gap-4 onest ">
            <div className="flex justify-between items-center">
                <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Create New Agent</h1>
                <div className='flex gap-2'>
                    <button className="bg-white text-[16px] font-[500] text-[#5A687C] border border-[#5A687C] rounded-md text-sm md:text-base px-4 py-2">
                        Preview Agent
                    </button>
                    <button disabled={loading} onClick={updateAgentStatus ? () => handleUpdate() : () => handleSubmit()} className="bg-[#675FFF] text-[16px] font-[500] text-white rounded-md text-sm md:text-base px-4 py-2">
                        {loading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : updateAgentStatus ? "Update Agent" : " Create Agent"}
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-8 p-6 w-full bg-white rounded-[10px] border border-[#e1e4ea]">
                <header className="flex flex-col gap-[11px]">
                    <h1 className="font-semibold text-text-black text-xl leading-7">
                        Configure your agent
                    </h1>
                    <p className="font-medium text-text-black text-sm leading-5">
                        Adjust agent conversation behavior based on your need
                    </p>
                </header>
                <div className="flex flex-col gap-8 p-6 w-full bg-white rounded-[10px] border border-[#e1e4ea]">
                    {/* Agent Name */}
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-[#1e1e1e]">
                            Agent Name<span className="text-[#675fff]">*</span>
                        </label>
                        <input
                            type="text"
                            name='agent_name'
                            value={formData?.agent_name}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-lg border ${errors.agent_name ? 'border-red-500' : 'border-[#e1e4ea]'} shadow`}
                            placeholder="Enter your agent name"
                        />
                        {errors.agent_name && <p className="text-red-500 text-sm mt-1">{errors.agent_name}</p>}
                    </div>

                    {/* Agent Personality and Language */}
                    <div className="flex flex-col md:flex-row  gap-4 w-full">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-sm font-medium text-[#1e1e1e]">
                                Agent personality<span className="text-[#675fff]">*</span>
                            </label>
                            <select
                                name='agent_personality'
                                value={formData?.agent_personality}
                                onChange={handleChange}
                                className={`w-full p-2 rounded-lg border ${errors.agent_personality ? 'border-red-500' : 'border-[#e1e4ea]'} shadow`}>
                                <option disabled value="">Choose your agent personality</option>
                                <option value="friendly">Friendly</option>
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                            </select>
                            {errors.agent_personality && <p className="text-red-500 text-sm mt-1">{errors.agent_personality}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-sm font-medium text-[#1e1e1e]">
                                Agent Language<span className="text-[#675fff]">*</span>
                            </label>
                            <select
                                name='agent_language'
                                value={formData?.agent_language}
                                onChange={handleChange}
                                className="w-full p-2 rounded-lg border border-[#e1e4ea] shadow">
                                <option value="english">English</option>
                                <option value="spanish">Spanish</option>
                                <option value="french">French</option>
                            </select>
                        </div>
                    </div>

                    {/* Business Description and Offer */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-sm font-medium text-[#1e1e1e]">
                                Business description in 1 sentence
                                <span className="text-[#675fff]">*</span>
                            </label>
                            <textarea
                                name='business_description'
                                onChange={handleChange}
                                value={formData?.business_description}
                                rows={4}
                                className={`w-full p-2 rounded-lg border  ${errors.business_description ? 'border-red-500' : 'border-[#e1e4ea]'} shadow resize-none`}
                                placeholder="Enter your business description"
                            />
                            {errors.business_description && <p className="text-red-500 text-sm mt-1">{errors.business_description}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-sm font-medium text-[#1e1e1e]">
                                Your business offer<span className="text-[#675fff]">*</span>
                            </label>
                            <textarea
                                name='your_business_offer'
                                onChange={handleChange}
                                value={formData?.your_business_offer}
                                rows={4}
                                className={`w-full p-2 rounded-lg border  ${errors.your_business_offer ? 'border-red-500' : 'border-[#e1e4ea]'} shadow resize-none`}
                                placeholder="Share everything you want the AI to know about your offer"
                            />
                            {errors.your_business_offer && <p className="text-red-500 text-sm mt-1">{errors.your_business_offer}</p>}
                        </div>
                    </div>

                    {/* Qualification Questions */}
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-[#1e1e1e]">
                            Qualification questions<span className="text-[#675fff]">*</span>
                        </label>
                        {formData.qualification_questions.map((question, index) => (
                            <div key={index} className="flex items-center gap-2 w-full">
                                <input
                                    type="text"
                                    name={`qualification_questions[${index}]`}
                                    value={question}
                                    onChange={handleChange}
                                    placeholder="Enter your question"
                                    className={`flex-1 p-2 rounded-lg border  shadow`}                                />
                                {index === formData.qualification_questions.length - 1 ? (
                                    <button type="button" onClick={addQuestion}>
                                        <AddPlus />
                                    </button>
                                ) : (
                                    <button type="button" onClick={() =>
                                        deleteQuestion(index)
                                    }>
                                        <CrossDelete />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Sequence Section */}

                    <div className="flex flex-col items-start gap-3 w-full">
                        <div className="flex items-start gap-[30px] w-full">
                            <div className="flex-1 bg-white rounded-2xl overflow-hidden border border-solid border-[#e1e4ea]">
                                <div className="relative w-full h-full">
                                    {/* <div className="absolute w-full h-full top-0 left-0 opacity-40">
                                        <img
                                            className="w-full h-full object-cover"
                                            alt="Light grey dots"
                                            src="/light-grey-dots-background-6.png"
                                        />
                                    </div> */}

                                    <div className="p-3 h-full flex flex-col relative z-10">
                                        <div className="flex items-center mb-2">
                                            <div className="font-medium text-[#1e1e1e] text-base">
                                                Sequence
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 overflow-x-auto">
                                            {sequenceCards.map((card, index) => (
                                                <div key={card.id} className="flex items-center gap-3">
                                                    {index > 0 && (
                                                        <div className="h-[2px] w-[25px] bg-[#e1e4ea]" />
                                                    )}

                                                    <div
                                                        className={`flex flex-col w-[206px] items-center justify-center gap-2.5 p-2 bg-[#f9fafb] rounded-[11px] border ${card.selected ? "border-[#335bfb66]" : "border-[#e1e4ea]"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2 w-full">
                                                            <div
                                                                className={`flex items-center gap-2.5 p-[7px] rounded-[10px]`}
                                                            >
                                                                <img
                                                                    alt={card.title}
                                                                    src={card.iconSrc}
                                                                />

                                                            </div>
                                                            <div className="font-semibold text-[#1e1e1e] text-base">
                                                                {card.title}
                                                            </div>
                                                        </div>

                                                        <div className="w-full h-px bg-[#e1e4ea]" />

                                                        <div className="flex items-center gap-2 w-full">
                                                            <div className="relative w-full">
                                                                <select
                                                                    name={card.key}
                                                                    className="w-full h-8 py-1 px-3 bg-white border border-[#e1e4ea] rounded-lg text-base text-[#1e1e1e] shadow-sm"
                                                                    value={formData.sequence[card.key]}
                                                                    onChange={(e) => {
                                                                        const { name, value } = e.target;
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            sequence: {
                                                                                ...prev.sequence,
                                                                                [name]: name === "delay" ? parseInt(value) : value,
                                                                            },
                                                                        }));
                                                                    }}
                                                                    disabled={(formData.sequence.trigger === "Whatsapp" || formData.sequence.trigger === "Instagram") && card.key === "channel"}
                                                                >
                                                                    {renderOptions(card)}
                                                                </select>

                                                                {card.unit && (
                                                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                                                                        {card.unit}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Objective of the agent */}
                    <div className="flex flex-col items-start gap-3 p-3.5 w-full bg-[#f3f4f6] rounded-[10px]">
                        <div className="flex items-center gap-2.5 w-full">
                            <div className="flex-1">
                                <div className="font-medium text-[#1e1e1e] text-base">Objective of the agent</div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-4">
                            {objectiveAgent.map((each) => (
                                <div key={each.key} className="flex items-center gap-2 cursor-pointer" onClick={() => {
                                    setFormData((prev) => ({
                                        ...prev, objective_of_the_agent: each.key,
                                        webpage_link: "",
                                        webpage_type: "",
                                        calendar_choosed: ''
                                    }))
                                    setErrors((prev) => ({ ...prev, objective_of_the_agent: "" }))
                                }}
                                >
                                    {/* <input
                                        type="radio"
                                        name="objective_type"
                                        value={each.key}
                                        checked={formData.objective_of_the_agent === each.key}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                objective_of_the_agent: e.target.value,
                                            }))
                                        }
                                    /> */}
                                    <div>{formData.objective_of_the_agent === each.key ? <CheckedCheckbox /> : <EmptyCheckbox />}</div>

                                    <span className="text-sm font-medium text-gray-700">{each.label}</span>
                                </div>
                            ))}
                        </div>
                        {errors.objective_of_the_agent && <p className="text-red-500 text-sm mt-1">{errors.objective_of_the_agent}</p>}
                        {renderObjectiveAgent()}
                    </div>


                    {/* Message Time Range */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {globalMessageTimeRange.map((each) => (
                            <div key={each.key} className="flex flex-col items-start gap-1.5 w-full">
                                <label className="font-medium text-[#1e1e1e] text-sm">
                                    {each.label}<span className="text-[#675fff]">*</span>
                                </label>
                                <div className="flex items-center w-full">
                                    <div className="flex items-center justify-between w-full bg-white rounded-lg border border-[#e1e4ea] shadow-shadows-shadow-xs px-3 py-2">
                                        <select
                                            className="flex-1 bg-transparent text-text-black text-base focus:outline-none appearance-none"
                                            name={each.key}
                                            value={formData[each.key]}
                                            onChange={(e) => {
                                                const { name, value } = e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    [name]: parseInt(value),
                                                }));
                                            }}
                                        >
                                            {each.options.map((e) => (
                                                <option key={e} value={e}>{e}</option>
                                            ))}
                                        </select>
                                        <span className="text-text-grey text-base">Minutes</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>


                    {/* Followup Options */}
                    <div className="flex flex-col gap-3 p-3.5 bg-[#F2F2F7] rounded-[10px] w-full">
                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => setFormData((prev) => ({
                                    ...prev,
                                    is_followups_enabled: !formData.is_followups_enabled
                                }))}
                                className={`relative w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${formData.is_followups_enabled ? "bg-[#675fff]" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-300 ${formData.is_followups_enabled ? "translate-x-5" : "translate-x-1"
                                        }`}
                                />
                            </button>
                            <span className="font-medium text-base text-black">
                                Enable followups
                            </span>
                        </div>


                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-sm font-medium text-[#1e1e1e]">
                                Number of followups
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                {followupOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        className={`p-2 cursor-pointer text-center rounded-lg border  ${formData.follow_up_details.number_of_followups === option.value ? "bg-[#335bfb1a] border-[#675fff]" : "bg-white border-[#e1e4ea]"
                                            } shadow`}
                                        onClick={() =>
                                            formData.is_followups_enabled &&
                                            setFormData((prev) => ({
                                                ...prev,
                                                follow_up_details: {
                                                    ...prev.follow_up_details,
                                                    number_of_followups: option.value
                                                },
                                            }))
                                        }
                                    >
                                        {option.value === 2 ? `${option.value} (Recommended)` : option.value}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {messageTimeRange.map((each) => (
                                <div key={each.key} className="flex flex-col items-start gap-1.5 w-full">
                                    <label className="font-medium text-[#1e1e1e] text-sm">
                                        {each.label}<span className="text-[#675fff]">*</span>
                                    </label>
                                    <div className="flex items-center w-full">
                                        <div className="flex items-center justify-between w-full bg-white rounded-lg border border-[#e1e4ea] shadow-shadows-shadow-xs px-3 py-2">
                                            <select
                                                className="flex-1 bg-transparent text-text-black text-base focus:outline-none appearance-none"
                                                name={each.key}
                                                value={formData.follow_up_details[each.key]}
                                                disabled={!formData.is_followups_enabled}
                                                onChange={(e) => {
                                                    const { name, value } = e.target;
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        follow_up_details: {
                                                            ...prev.follow_up_details,
                                                            [name]: parseInt(value),
                                                        },
                                                    }));
                                                }}
                                            >
                                                {each.options.map((e) => (
                                                    <option key={e} value={e}>{e}</option>
                                                ))}
                                            </select>
                                            <span className="text-text-grey text-base">Minutes</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>


                    </div>

                    {/* Emoji Frequency */}
                    <div className="flex flex-col gap-3 p-3.5 bg-[#F2F2F7] rounded-[10px] w-full">
                        <div className="text-base font-medium text-[#1e1e1e]">
                            Emoji Frequency<span className="text-[#675fff]">*</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            (100% is implemented on every message)
                        </div>

                        {/* Using grid layout */}
                        <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
                            {emojiOptions.map((option) => (
                                <div
                                    key={option.id}
                                    value={formData.emoji_frequency}
                                    className={`p-2 cursor-pointer  text-center rounded-lg border  ${formData.emoji_frequency === option.value
                                        ? "bg-[#335bfb1a] border-[#675fff]"
                                        : "bg-white border-[#e1e4ea]"
                                        } shadow`}
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            emoji_frequency: option.value,
                                        }))
                                    }
                                >
                                    {option.label === "25%" ? `${option.label} (Recommended)` : option.label}

                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Directness */}
                    <div className="flex flex-col items-start gap-3 p-3.5 w-full bg-[#F2F2F7] rounded-[10px] overflow-hidden">
                        {/* Label Section */}
                        <div className="flex items-center gap-2.5 w-full">
                            <div className="flex items-center gap-[5px] flex-1">
                                <div className="font-medium text-[#1e1e1e] text-base">
                                    Directness<span className="text-[#675fff]">*</span>
                                </div>
                                <div className="font-normal text-text-grey text-xs">
                                    (0 = empathetic, 10 = highly direct for more calls)
                                </div>
                            </div>
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                            {directnessOptions.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            directness: option.value,
                                        }))
                                    }
                                    className={`text-center cursor-pointer rounded-lg border px-3 py-2 shadow transition
        ${formData.directness === option.value ? "bg-[#335bfb1a] border-[#675fff]" : "bg-white border-[#e1e4ea]"}`}
                                >
                                    <span className="font-normal text-text-black text-base">
                                        {option.value === 2 ? `${option.value} (Recommended)` : option.value}
                                    </span>
                                </div>
                            ))}
                        </div>


                    </div>

                </div>
            </div>
            {updateAgent && (
                <div className="onest fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
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
                                    Reset
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
                                        <option value="" disabled>Select</option>
                                        <option value="email">Email</option>
                                        <option value="Member">Member</option>
                                        <option value="Guest">Guest</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[14px] font-medium text-[#292D32] my-2">Message</label>
                                <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                                    <textarea
                                        type="text"
                                        name="message"
                                        placeholder="Type message"
                                        rows={4}
                                        className="w-full focus:outline-none"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="flex gap-2 mt-3">
                            <button onClick={() => setUpdateAgent(false)} className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                                Cancel
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
        </div>
    )
}

export default CreateNewAgent

