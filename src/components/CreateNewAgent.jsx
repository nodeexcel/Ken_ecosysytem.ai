import React, { useState } from 'react'
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from 'react-icons/io';
import trigger from '../assets/svg/sequence_trigger.svg'
import delay from '../assets/svg/sequence_delay.svg'
import channel from '../assets/svg/sequence_channel.svg'
import template from '../assets/svg/sequence_template.svg'
import { X } from 'lucide-react';
import { LuRefreshCw } from 'react-icons/lu';

function CreateNewAgent({ setOpen, setUpdateAgentStatus, updateAgentStatus }) {

    const [followupsEnabled, setFollowupsEnabled] = useState(true);
    const [updateAgent, setUpdateAgent] = useState(false);
    const [loading, setLoading] = useState(false)

    const qualificationQuestions = [
        { id: 1, placeholder: "Enter your Question" },
        { id: 2, placeholder: "Enter your Question" },
    ];

    // Data for sequence cards
    const sequenceCards = [
        {
            id: 1,
            title: "Trigger",
            iconSrc: trigger,
            value: "Systeme.io",
            selected: true,
        },
        {
            id: 2,
            title: "Delay",
            iconSrc: delay,
            value: "15",
            unit: "Min",
            selected: false,
        },
        {
            id: 3,
            title: "Channel",
            iconSrc: channel,
            value: "Instagram",
            selected: true,
        },
        {
            id: 4,
            title: "Template",
            iconSrc: template,
            value: "Select",
            selected: false,
        },
    ];

    // Data for number options
    const followupOptions = [
        { id: 1, value: "1", selected: false },
        { id: 2, value: "2 (Recommended)", selected: true },
        { id: 3, value: "3", selected: false },
    ];

    const emojiOptions = [
        { id: 1, value: "No emoji", selected: false },
        { id: 2, value: "25% (Recommended)", selected: true },
        { id: 3, value: "50%", selected: false },
        { id: 4, value: "100%", selected: false },
    ];

    const [directnessOptions, setDirectnessOptions] = useState([
        { id: 1, value: "0", selected: false },
        { id: 2, value: "2 (Recommended)", selected: true },
        { id: 3, value: "4", selected: false },
        { id: 4, value: "6", selected: false },
        { id: 5, value: "8", selected: false },
        { id: 6, value: "10", selected: false },
    ]);
    const handleDirectnessChange = (id) => {
        setDirectnessOptions((prev) =>
            prev.map((opt) => ({
                ...opt,
                selected: opt.id === id,
            }))
        );
    };



    return (
        <div className="w-full p-4 flex flex-col gap-4 onest ">
            <div className="flex justify-between items-center">
                <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Create New Agent</h1>
                <div className='flex gap-2'>
                    <button className="bg-white text-[16px] font-[500] text-[#5A687C] border border-[#5A687C] rounded-md text-sm md:text-base px-4 py-2">
                        Preview Agent
                    </button>
                    <button onClick={() => setUpdateAgent(true)} className="bg-[#675FFF] text-[16px] font-[500] text-white rounded-md text-sm md:text-base px-4 py-2">
                        {updateAgentStatus ? "Update Agent" : " Create Agent"}
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
                            className="w-full p-2 rounded-lg border border-[#e1e4ea] shadow"
                            placeholder="Enter your agent name"
                        />
                    </div>

                    {/* Agent Personality and Language */}
                    <div className="flex flex-col md:flex-row  gap-4 w-full">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-sm font-medium text-[#1e1e1e]">
                                Agent personality<span className="text-[#675fff]">*</span>
                            </label>
                            <select className="w-full p-2 rounded-lg border border-[#e1e4ea] shadow">
                                <option>Choose your agent personality</option>
                                <option value="friendly">Friendly</option>
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-sm font-medium text-[#1e1e1e]">
                                Agent Language<span className="text-[#675fff]">*</span>
                            </label>
                            <select className="w-full p-2 rounded-lg border border-[#e1e4ea] shadow">
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
                                className="w-full p-2 rounded-lg border border-[#e1e4ea] shadow resize-none"
                                placeholder="Enter your business description"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-sm font-medium text-[#1e1e1e]">
                                Your business offer<span className="text-[#675fff]">*</span>
                            </label>
                            <textarea
                                className="w-full p-2 rounded-lg border border-[#e1e4ea] shadow resize-none"
                                placeholder="Share everything you want the AI to know about your offer"
                            />
                        </div>
                    </div>

                    {/* Qualification Questions */}
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-[#1e1e1e]">
                            Qualification questions<span className="text-[#675fff]">*</span>
                        </label>
                        <div className="flex flex-col gap-3 w-full">
                            {qualificationQuestions.map((q, i) => (
                                <div key={q.id} className="flex items-center gap-2 w-full">
                                    <input
                                        type="text"
                                        placeholder={q.placeholder}
                                        className="flex-1 p-2 rounded-lg border border-[#e1e4ea] shadow"
                                    />
                                    {qualificationQuestions.length - 1 === i ? <IoIosAddCircleOutline />
                                        : <IoIosCloseCircleOutline />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sequence Section */}

                    <div className="flex flex-col h-[191px] items-start gap-3 w-full">
                        <div className="flex h-[191px] items-start gap-[30px] w-full">
                            <div className="flex-1 h-[191px] bg-white rounded-2xl overflow-hidden border border-solid border-[#e1e4ea]">
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
                                                                <select className="w-full h-8 py-1 px-3 bg-white border border-[#e1e4ea] rounded-lg text-base text-[#1e1e1e] shadow-sm">
                                                                    <option value={card.value}>{card.value}</option>
                                                                    <option value="option1">Option 1</option>
                                                                    <option value="option2">Option 2</option>
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
                                <div className="font-medium text-[#1e1e1e] text-base">
                                    Objective of the agent
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-4">
                            <label className="flex w-[124px] items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked
                                    className=""
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-700 text-sm">
                                        Book a Call
                                    </div>
                                </div>
                            </label>

                            <label className="flex w-[344px] items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={false}
                                    className=""
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-700 text-sm">
                                        Send to a web page
                                    </div>
                                </div>
                            </label>
                        </div>


                        <div className="flex items-start gap-3 w-full">
                            <div className="flex-1">
                                <div className="flex flex-col items-start gap-1.5 w-full">
                                    <label className="font-medium text-[#1e1e1e] text-sm">
                                        Select Calendar
                                    </label>
                                    <select className="w-full h-8 py-1 px-3 bg-white border border-[#e1e4ea] rounded-lg text-base text-[#1e1e1e] shadow-sm">
                                        <option value="calendly">Calendly</option>
                                        <option value="option1">Option 1</option>
                                        <option value="option2">Option 2</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message Time Range */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {/* Min. Message time range */}
                        <div className="flex flex-col items-start gap-1.5 w-full">
                            <label className="font-medium text-[#1e1e1e] text-sm">
                                Min. Message time range<span className="text-[#675fff]">*</span>
                            </label>
                            <div className="flex items-center w-full">
                                <div className="flex items-center justify-between w-full bg-white rounded-lg border border-[#e1e4ea] shadow-shadows-shadow-xs px-3 py-2">
                                    <select
                                        className="flex-1 bg-transparent text-text-black text-base focus:outline-none appearance-none"
                                        defaultValue="15"
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                    </select>
                                    <span className="text-text-grey text-base">Minutes</span>
                                </div>
                            </div>
                        </div>

                        {/* Max. Message time range */}
                        <div className="flex flex-col items-start gap-1.5 w-full">
                            <label className="font-medium text-[#1e1e1e] text-sm">
                                Max. Message time range<span className="text-[#675fff]">*</span>
                            </label>
                            <div className="flex items-center w-full">
                                <div className="flex items-center justify-between w-full bg-white rounded-lg border border-[#e1e4ea] shadow-shadows-shadow-xs px-3 py-2">
                                    <select
                                        className="flex-1 bg-transparent text-text-black text-base focus:outline-none appearance-none"
                                        defaultValue="60"
                                    >
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                        <option value="60">60</option>
                                        <option value="90">90</option>
                                    </select>
                                    <span className="text-text-grey text-base">Minutes</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Followup Options */}
                    <div className="flex flex-col gap-3 p-3.5 bg-[#F2F2F7] rounded-[10px] w-full">
                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => setFollowupsEnabled(!followupsEnabled)}
                                className={`relative w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${followupsEnabled ? "bg-[#675fff]" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-300 ${followupsEnabled ? "translate-x-5" : "translate-x-1"
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
                                        className={`p-2 text-center rounded-lg border ${option.selected ? "bg-[#335bfb1a] border-[#675fff]" : "bg-white border-[#e1e4ea]"
                                            } shadow`}
                                    >
                                        {option.value}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {/* Min. Message time range */}
                            <div className="flex flex-col items-start gap-1.5 w-full">
                                <label className="font-medium text-[#1e1e1e] text-sm">
                                    Min. Message time range<span className="text-[#675fff]">*</span>
                                </label>
                                <div className="flex items-center w-full">
                                    <div className="flex items-center justify-between w-full bg-white rounded-lg border border-[#e1e4ea] shadow-shadows-shadow-xs px-3 py-2">
                                        <select
                                            className="flex-1 bg-transparent text-text-black text-base focus:outline-none appearance-none"
                                            defaultValue="15"
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                            <option value="30">30</option>
                                        </select>
                                        <span className="text-text-grey text-base">Minutes</span>
                                    </div>
                                </div>
                            </div>

                            {/* Max. Message time range */}
                            <div className="flex flex-col items-start gap-1.5 w-full">
                                <label className="font-medium text-[#1e1e1e] text-sm">
                                    Max. Message time range<span className="text-[#675fff]">*</span>
                                </label>
                                <div className="flex items-center w-full">
                                    <div className="flex items-center justify-between w-full bg-white rounded-lg border border-[#e1e4ea] shadow-shadows-shadow-xs px-3 py-2">
                                        <select
                                            className="flex-1 bg-transparent text-text-black text-base focus:outline-none appearance-none"
                                            defaultValue="60"
                                        >
                                            <option value="30">30</option>
                                            <option value="45">45</option>
                                            <option value="60">60</option>
                                            <option value="90">90</option>
                                        </select>
                                        <span className="text-text-grey text-base">Minutes</span>
                                    </div>
                                </div>
                            </div>
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
                                    className={`p-2  text-center rounded-lg border ${option.selected
                                        ? "bg-[#335bfb1a] border-[#675fff]"
                                        : "bg-white border-[#e1e4ea]"
                                        } shadow`}
                                >
                                    {option.value}
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
                                    className={`text-center cursor-pointer rounded-lg border px-3 py-2 shadow-shadows-shadow-xs transition
        ${option.selected ? "bg-[#335bfb1a] border-[#675fff]" : "bg-white border-[#e1e4ea]"}`}
                                    onClick={() => handleDirectnessChange(option.id)}
                                >
                                    <span className="font-normal text-text-black text-base">
                                        {option.value}
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

