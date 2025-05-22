import React, { useState, useEffect, useRef } from 'react';
import { Delete, Notes, ThreeDots, UploadIcon } from '../icons/icons';
import { ChevronDown, Info, X } from 'lucide-react';
import { format } from 'date-fns';



const TimeSelector = ({ onSave, onCancel, initialTime }) => {
    const parseInitialTime = () => {
        if (!initialTime) return { hour: '11', minute: '01', period: 'PM' };

        try {
            const matches = initialTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
            if (matches) {
                return {
                    hour: matches[1].padStart(2, '0'),
                    minute: matches[2],
                    period: matches[3].toUpperCase()
                };
            }
        } catch (e) {
            console.error('Error parsing initial time:', e);
        }

        return { hour: '11', minute: '01', period: 'PM' };
    };

    const { hour, minute, period } = parseInitialTime();

    const [selectedHour, setSelectedHour] = useState(hour);
    const [selectedMinute, setSelectedMinute] = useState(minute);
    const [selectedPeriod, setSelectedPeriod] = useState(period);

    const hoursRef = useRef(null);
    const minutesRef = useRef(null);
    const periodRef = useRef(null);

    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
    const periods = ['AM', 'PM'];
    const paddedHours = ['', '', ...hours, '', ''];
    const paddedMinutes = ['', '', ...minutes, '', ''];
    const paddedPeriods = ['', '', ...periods, '', ''];

    const itemHeight = 36;

    const handleSave = () => onSave(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);

    const handleScroll = (ref, items, setValue, height = itemHeight) => {
        if (!ref.current) return;

        const scrollTop = ref.current.scrollTop;
        const index = Math.round(scrollTop / height);

        if (index < 0) {
            ref.current.scrollTop = 0;
            setValue(items[0]);
            return;
        }

        if (index >= items.length) {
            ref.current.scrollTop = (items.length - 1) * height;
            setValue(items[items.length - 1]);
            return;
        }

        if (index >= 0 && index < items.length) {
            setValue(items[index]);
        }
    };

    const scrollToItem = (ref, items, value, height = itemHeight) => {
        if (!ref.current) return;

        const index = items.indexOf(value);
        if (index !== -1) {
            ref.current.scrollTop = index * height;
        }
    };

    useEffect(() => {
        scrollToItem(hoursRef, hours, selectedHour);
        scrollToItem(minutesRef, minutes, selectedMinute);
        scrollToItem(periodRef, periods, selectedPeriod);
    }, []);

    const setupScrollEndDetection = (ref, items, setValue, height = itemHeight) => {
        if (!ref.current) return;

        let timeout;
        const handleScrollEnd = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (!ref.current) return;

                const scrollTop = ref.current.scrollTop;
                const index = Math.round(scrollTop / height);

                // Prevent scrolling past limits
                if (index < 0) {
                    ref.current.scrollTop = 0;
                    setValue(items[0]);
                    return;
                }

                if (index >= items.length) {
                    ref.current.scrollTop = (items.length - 1) * height;
                    setValue(items[items.length - 1]);
                    return;
                }

                if (index >= 0 && index < items.length) {
                    setValue(items[index]);
                    ref.current.scrollTop = index * height;
                }
            }, 100);
        };

        ref.current.addEventListener('scroll', handleScrollEnd);
        return () => {
            if (ref.current) {
                ref.current.removeEventListener('scroll', handleScrollEnd);
            }
        };
    };

    useEffect(() => {
        const cleanupHours = setupScrollEndDetection(hoursRef, hours, setSelectedHour);
        const cleanupMinutes = setupScrollEndDetection(minutesRef, minutes, setSelectedMinute);
        const cleanupPeriod = setupScrollEndDetection(periodRef, periods, setSelectedPeriod);

        return () => {
            cleanupHours();
            cleanupMinutes();
            cleanupPeriod();
        };
    }, []);

    // AM/PM scrolling
    const handlePeriodScroll = () => {
        if (!periodRef.current) return;
        const scrollTop = periodRef.current.scrollTop;
        const index = Math.round(scrollTop / itemHeight);

        // Ensure index is within bounds
        if (index >= 0 && index < periods.length) {
            setSelectedPeriod(periods[index]);
        }
    };

    const isSelected = (item, selectedItem) => {
        return item === selectedItem;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 w-64">
            <div className="relative mb-4">
                <div className="absolute w-full h-[170px] pointer-events-none">
                    <div className="absolute top-[72px] left-0 right-0 h-[36px] bg-[#F0EFFF] rounded-md z-0"></div>
                </div>

                <div className="flex justify-between h-[170px] relative z-10">
                    {/* Hours column */}
                    <div className="flex-1">
                        <div
                            ref={hoursRef}
                            className="h-full overflow-auto scrollbar-hide gap-19"
                            onScroll={() => handleScroll(hoursRef, hours, setSelectedHour)}
                        >
                            <div className="px-2">
                                {paddedHours.map((hour, index) => (
                                    <div
                                        key={`hour-${index}`}
                                        className={`h-[36px] flex items-center justify-center text-[14px]
                                            ${isSelected(hour, selectedHour) ? 'text-[#675FFF] font-semibold' : 'text-gray-500'}`}
                                        onClick={() => {
                                            if (hour) {
                                                setSelectedHour(hour);
                                                scrollToItem(hoursRef, hours, hour);
                                            }
                                        }}
                                    >
                                        {hour}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="flex items-center justify-center px-1">
                        <span className="text-[14px] text-gray-500">:</span>
                    </div>

                    {/* Minutes column */}
                    <div className="flex-1">
                        <div
                            ref={minutesRef}
                            className="h-full overflow-auto scrollbar-hide"
                            onScroll={() => handleScroll(minutesRef, minutes, setSelectedMinute)}
                        >
                            <div className="px-2">
                                {paddedMinutes.map((minute, index) => (
                                    <div
                                        key={`minute-${index}`}
                                        className={`h-[36px] flex items-center justify-center text-[14px]
                                            ${isSelected(minute, selectedMinute) ? 'text-[#675FFF] font-semibold' : 'text-gray-500'}`}
                                        onClick={() => {
                                            if (minute) {
                                                setSelectedMinute(minute);
                                                scrollToItem(minutesRef, minutes, minute);
                                            }
                                        }}
                                    >
                                        {minute}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AM/PM column */}
                    <div className="flex-1 ml-2">
                        <div
                            ref={periodRef}
                            className="h-full overflow-auto scrollbar-hide"
                            onScroll={handlePeriodScroll}
                        >
                            <div className="px-2">
                                {paddedPeriods.map((period, index) => (
                                    <div
                                        key={`period-${index}`}
                                        className={`h-[36px] flex items-center justify-center text-[14px]
                                            ${isSelected(period, selectedPeriod) ? 'text-[#675FFF] font-semibold' : 'text-gray-500'}`}
                                        onClick={() => {
                                            if (period) {
                                                setSelectedPeriod(period);
                                                scrollToItem(periodRef, periods, period);
                                            }
                                        }}
                                    >
                                        {period}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between gap-2">
                <button
                    onClick={handleSave}
                    className="flex-1 bg-[#675FFF] text-white py-2 px-4 rounded hover:bg-[#5648ff]"
                >
                    Save
                </button>
                <button
                    onClick={onCancel}
                    className="flex-1 border border-[#E1E4EA] py-2 px-4 rounded hover:bg-gray-50"
                >
                    Cancel
                </button>
            </div>

            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};



// WeekSelector Component
const WeekSelector = ({ setShowWeekSelector, value = [], onChange }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const dropdownWeekRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownWeekRef.current && !dropdownWeekRef.current.contains(event.target)) {
                setShowWeekSelector(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleLanguage = (day) => {
        const newSelection = value.includes(day)
            ? value.filter((d) => d !== day)
            : [...value, day];
        onChange(newSelection);
    };
    return (
        <div ref={dropdownWeekRef} className="bg-white rounded-lg shadow-lg p-4">
            <div className="space-y-2">
                {days.map((day) => (
                    <div
                        key={day}
                        onClick={() => toggleLanguage(day)}
                        className={`p-2 rounded-lg cursor-pointer flex items-center gap-2 ${value.includes(day)
                            ? 'bg-[#F0EFFF] text-[#675FFF]'
                            : 'hover:bg-gray-50'
                            }`}
                    >
                        <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${value.includes(day)
                                ? 'border-[#675FFF] bg-[#675FFF]'
                                : 'border-[#E1E4EA]'
                                }`}
                        >
                            {value.includes(day) && (
                                <span className="text-white text-xs">✓</span>
                            )}
                        </div>
                        <span>{day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Dropdown Component
const Dropdown = ({ options, placeholder = 'Select', value, onChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    const optionLabel = value && options.find((e) => e.key === value)

    return (
        <div ref={dropdownRef} className={`relative w-full ${className}`}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full border border-[#E1E4EA] rounded-lg px-3 py-2 bg-white text-left focus:outline-none focus:ring-1 focus:ring-[#675FFF]">
                <span className={`block truncate ${!optionLabel ? 'text-gray-500' : 'text-gray-900'}`}>{optionLabel.label || placeholder}</span>
                <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto">
                    <ul className="py-1">
                        {options.map((option) => (
                            <li key={option.key} className={`cursor-pointer select-none relative px-4 py-2 hover:bg-[#F4F5F6] ${value === option.key ? 'text-[#675FFF]' : 'text-gray-900'}`} onClick={() => handleSelect(option.key)}>{option.label}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};






function CampaignsTable() {
    const [campaignData, setCampaignData] = useState([
        { name: 'Campaign', opened: '-', clicked: '-', bounced: '', status: "Issue Detected" },
        { name: 'Campaign', opened: '-', clicked: '-', bounced: '', status: "Planned" }
    ]);

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [showTimeSelector, setShowTimeSelector] = useState(false);
    const [showWeekSelector, setShowWeekSelector] = useState(false);

    const [formData, setFormData] = useState({
        campaign_title: "",
        campaign_objective: "",
        campaign_objective_other: "",
        main_subject: "", cta_type: "", calendar_type: "", url: "", file: "", list_of_target: "", desired_tone: "", language: "",
        send_time_window: "", start_date: "", frequency: [], include_branding: false, use_ai_brain_for_email: false,
        custom_prompt: "", text_length: "", product_service_to_feature: "", review_before_sending: false
    })

    const campaignObjectiveOptions = [{ label: "Promote an offer", key: "promote_an_offer" }, { label: "Inform / Educate", key: "inform_educate" }, { label: "Re-engage leads", key: "re_engage_leads" }, { label: "Announce a new feature", key: "announce_a_new_feature" }, { label: "Other", key: "other" }]

    const ctaTypeOptions = [{ label: "Book a Meeting", key: "book_a_meeting" }, { label: "Purchase", key: "purchase" },
    { label: "Visit a Page", key: "visit_a_page" }, { label: "Reply", key: "reply" }, { label: "Download", key: "download" }];

    const toneOptions = [{ label: "Professional", key: "professional" }, { label: "Friendly", key: "friendly" }, { label: "Storytelling", key: "storytelling" }, { label: "Provocation", key: "provocation" },
    { label: "Educational", key: "educational" }, { label: "Inspiring", key: "inspiring" }];

    const calendarOptions = [{ label: "Calendly", key: "calendly" }, { label: "Google Calendar", key: "google_calendar" }]


    const languageOptions = [{ label: "EN", key: "en" }, { label: "FR", key: "fr" }];

    const wordOptions = [{ label: "50 - 100 words", key: "50_to_100_words" }, { label: "100 - 200 words", key: "100_to_200_words" }, { label: "200 - 400 words", key: "200_to_400_words" }, { label: "400 - 800 words", key: "400_to_800_words" }];

    const listOfTargetOptions = [{ label: "Segment A", key: "segment_a" }, { label: "Segment B", key: "segment_b" }]

    const deleteRow = (index) => {
        const updated = [...campaignData];
        updated.splice(index, 1);
        setCampaignData(updated);
    };

    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const handleTimeSelect = (time) => {
        setFormData((prev) => ({
            ...prev,
            send_time_window: time,
        }))
        setShowTimeSelector(false);
    };

    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
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
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFormData((prev) => ({
                ...prev,
                file: file,
            }))
            console.log('Dropped file:', file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev, [name]: value
        }))
    }

    const handleSubmit = () => {
        console.log(formData, "formData")
    }

    const renderColor = (text) => {
        switch (text) {
            case "Issue Detected":
                return `text-[#B32318] bg-[#FEF3F2] border-[#FECDC9]`;
            case "Running":
                return `text-[#067647] bg-[#ECFDF3] border-[#AAEFC6]`;
            case "Planned":
                return `text-[#675FFF] bg-[#F0EFFF] border-[#675FFF]`;
            default:
                return `text-[#344054] bg-[#fff] border-[#EAECF0]`;
        }
    };

    const renderCTAField = () => {
        switch (formData.cta_type) {
            case "book_a_meeting":
                return (
                    <div>
                        <label className="block text-sm font-medium mb-1">Calendars</label>
                        <Dropdown
                            options={calendarOptions}
                            value={formData.calendar_type}
                            onChange={(updated) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    calendar_type: updated,
                                }))
                            }
                            placeholder="Select"
                        />
                    </div>
                );
            case "download":
                return (
                    <div>
                        <label className="block text-sm font-medium mb-1">Import File</label>
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
                                    Upload from your computer
                                </p>
                                <p className="text-[14px] font-[500] text-[#5A687C] mt-1">
                                    or drag and drop
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>

                            {selectedFile && (
                                <div className="mt-3 text-sm text-gray-700">
                                    <strong>Selected File:</strong> {selectedFile.name}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case "visit_a_page":
                return (
                    <div>
                        <label className="block text-sm font-medium mb-1">URL</label>
                        <input type="text" value={formData.url} name='url' onChange={handleChange} placeholder="http:// Enter URL" className="w-full border border-[#E1E4EA] rounded-lg px-3 py-2" />
                    </div>
                )
            case "purchase":
                return (
                    <div>
                        <label className="block text-sm font-medium mb-1">URL</label>
                        <input type="text" value={formData.url} name='url' onChange={handleChange} placeholder="http:// Enter URL" className="w-full border border-[#E1E4EA] rounded-lg px-3 py-2" />
                    </div>
                )
            default:
                return (
                    <div>
                        <button className="text-[#675FFF] text-md ">+ Call to action link</button>
                    </div>
                )
        }
    }

    return (
        <>
            {/* <div className="w-full p-4 flex flex-col gap-4 onest">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-900 font-semibold text-xl md:text-2xl">Campaigns</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#675FFF] text-white rounded-md text-sm md:text-base px-4 py-2"
                    >
                        Campaigns
                    </button>
                </div>

                <div className="overflow-auto w-full rounded-lg">
                    <table className="w-full rounded-2xl">
                        <thead>
                            <tr className="text-left text-[#5A687C]">
                                <th className="px-6 py-3 text-[16px] font-medium">Name</th>
                                <th className="px-6 py-3 text-[16px] font-medium">Opened</th>
                                <th className="px-6 py-3 text-[16px] font-medium">Clicked</th>
                                <th className="px-6 py-3 text-[16px] font-medium">Bounced</th>
                                <th className="px-6 py-3 text-[16px] font-medium">Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className='bg-white border border-[#E1E4EA]'>
                            {campaignData.map((item, index) => (
                                <tr key={index} className={`${index !== campaignData.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                    <td className="px-6 py-4 text-sm text-[#1E1E1E] font-[600]">{item.name}</td>
                                    <td className="px-6 py-4 text-sm text-[#1E1E1E]">{item.opened}</td>
                                    <td className="px-6 py-4 text-sm text-[#1E1E1E]">{item.clicked}</td>
                                    <td className="px-6 py-4 text-sm text-[#1E1E1E]">{item.bounced}</td>
                                    <td className="px-6 py-4 text-sm text-[#1E1E1E]"><div className={`px-2 py-1 w-fit border rounded-2xl ${renderColor(item.status)}`}>{item.status}</div></td>
                                    <td className="px-6 py-4 text-sm text-[#1E1E1E]">
                                        <button onClick={() => handleDropdownClick(index)} className="p-2 rounded-lg">
                                            <div className='bg-[#F4F5F6] p-2 rounded-lg'><ThreeDots /></div>
                                        </button>
                                        {activeDropdown === index && (
                                            <div className="absolute right-6  w-48 rounded-md shadow-lg bg-white ring-1 ring-[#E1E4EA] ring-opacity-5 z-10">
                                                <div className="py-1">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6]"
                                                        onClick={() => {
                                                            // Handle delete action
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">{<Notes />} <span className="hover:text-[#675FFF]">View Report</span> </div>
                                                    </button>
                                                    <hr style={{ color: "#E6EAEE" }} />
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6]"
                                                        onClick={() => {
                                                            // Handle delete action
                                                            deleteRow(index);
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">{<Delete />} <span>Delete</span> </div>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> */}

            {/* Modal Overlay */}
            <div className="w-full p-4 flex flex-col justify-center">
                <h1 className="text-[#5A687C] font-[400] text-[14px]">{`Campaigns > New Campaign`}</h1>
                <h1 className="text-[#1E1E1E] font-[600] text-[24px] mt-2 my-4">Add New Campaign</h1>

                <div className="bg-white max-w-[848px] w-full rounded-xl border border-[#E1E4EA] p-6 relative overflow-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Campaign Title</label>
                            <input type="text" onChange={handleChange} name='campaign_title' value={formData.campaign_title} placeholder="Enter campaign title" className="w-full border border-[#E1E4EA] rounded-lg px-3 py-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Campaign Objective</label>
                                <Dropdown
                                    options={campaignObjectiveOptions}
                                    value={formData.campaign_objective}
                                    onChange={(updated) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            campaign_objective: updated,
                                        }))
                                    }
                                    placeholder="Select"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Main Subject</label>
                                <input type="text" placeholder="Enter main subject" value={formData.main_subject} name='main_subject' onChange={handleChange} className="w-full border border-[#E1E4EA] rounded-lg px-3 py-2" />
                            </div>
                        </div>

                        {formData.campaign_objective === "other" && <div>
                            <label className="block text-sm font-medium mb-1">Other</label>
                            <input type="text" placeholder="Enter Campaign Objective Other" value={formData.campaign_objective_other} name='campaign_objective_other' onChange={handleChange} className="w-full border border-[#E1E4EA] rounded-lg px-3 py-2" />
                        </div>}

                        <div>
                            <label className="block text-sm font-medium mb-1">CTA Type</label>
                            <Dropdown
                                options={ctaTypeOptions}
                                value={formData.cta_type}
                                onChange={(updated) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        cta_type: updated,
                                        url: "",
                                        calendar_type: "",
                                        file: ""
                                    }))
                                }
                                placeholder="Select"
                            />
                        </div>
                        {renderCTAField()}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">List Of Target</label>
                                <Dropdown
                                    options={listOfTargetOptions}
                                    value={formData.list_of_target}
                                    onChange={(updated) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            list_of_target: updated,
                                        }))
                                    }
                                    placeholder="Select"
                                />
                                <p className="text-sm mt-1 ">Estimated Segment Size: 12</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Desired Tone</label>
                                <Dropdown
                                    options={toneOptions}
                                    value={formData.desired_tone}
                                    onChange={(updated) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            desired_tone: updated,
                                        }))
                                    }
                                    placeholder="Select"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Language</label>
                                <Dropdown
                                    options={languageOptions}
                                    value={formData.language}
                                    onChange={(updated) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            language: updated,
                                        }))
                                    }
                                    placeholder="Select"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">Send Time Window</label>
                                <div
                                    onClick={() => setShowTimeSelector(true)}
                                    className="w-full border border-[#E1E4EA] rounded-lg px-3 py-2 cursor-pointer"
                                >
                                    {formData.send_time_window || "Select Time"}
                                </div>
                                {showTimeSelector && (
                                    <div className="absolute z-50 mt-1">
                                        <TimeSelector
                                            initialTime={formData.send_time_window}
                                            onSave={handleTimeSelect}
                                            onCancel={() => setShowTimeSelector(false)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value)
                                        setFormData((prev) => ({
                                            ...prev, start_date: format(e.target.value, 'yyyy-MM-dd')
                                        }))
                                    }}
                                    className="w-full border border-[#E1E4EA] rounded-lg px-3 py-2"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">Frequency</label>
                                <div
                                    onClick={() => setShowWeekSelector((prev) => !prev)}
                                    className="w-full border border-[#E1E4EA] rounded-lg px-3 py-2 cursor-pointer"
                                >
                                    {formData.frequency?.length > 0
                                        ? formData.frequency.join(', ')
                                        : 'Select Days'}
                                </div>
                                {showWeekSelector && (
                                    <div className="absolute z-50 mt-1 w-full">
                                        <WeekSelector
                                            setShowWeekSelector={setShowWeekSelector}
                                            value={formData.frequency}
                                            onChange={(updated) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    frequency: updated,
                                                }))
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='flex flex-col gap-5'>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Include branding (Brain A1)?</label>
                                <div className='flex items-center gap-6'>
                                    {/* <div className='relative group'>
                                        <Info className="text-gray-500 cursor-pointer" size={16} />
                                        <div className="absolute bottom-full mb-1 w-60 -right-50 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 hidden group-hover:flex transition-opacity duration-200 z-10">
                                            Continue in the same spirit, format, tone, style, and overall vibe as your previous emails. To enable this, integrate your email platform or upload your past emails as a PDF in the "AI Brain
                                        </div>
                                    </div> */}

                                    <button
                                        onClick={() => setFormData((prev) => ({ ...prev, include_branding: !formData.include_branding }))}
                                        className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${formData.include_branding ? "bg-[#7065F0]" : "bg-[#E1E4EA]"}`}
                                    >
                                        <span
                                            className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${formData.include_branding ? "translate-x-5" : "translate-x-0.5"}`}
                                        ></span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium mb-1 flex items-center gap-2">
                                    <p>Use AI Brain as the reference for your emails</p>
                                    <div className="relative group">
                                        <Info className="text-gray-500 cursor-pointer" size={16} />
                                        <div className="absolute bottom-full flex-col mb-1 gap-1 w-60 left-3 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 hidden group-hover:flex transition-opacity duration-200 z-10">
                                            {` Continue in the same spirit, format, tone, style, and overall vibe as your previous emails. To enable this, integrate your email platform or upload your past emails as a PDF in the “AI Brain > Files`}
                                        </div>
                                    </div>
                                </label>
                                <button
                                    onClick={() => setFormData((prev) => ({ ...prev, use_ai_brain_for_email: !formData.use_ai_brain_for_email }))}
                                    className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${formData.use_ai_brain_for_email ? "bg-[#7065F0]" : "bg-[#E1E4EA]"}`}
                                >
                                    <span
                                        className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${formData.use_ai_brain_for_email ? "translate-x-5" : "translate-x-0.5"}`}
                                    ></span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Custom prompt for A1</label>
                            <textarea value={formData.custom_prompt} name='custom_prompt' onChange={handleChange} placeholder="e.g. Write a re-engagement email for cold leads about my A1 training offer" className="w-full border border-[#E1E4EA] rounded px-3 py-2 resize-none" rows={3}></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 flex items-center gap-2">
                                    <p>Text Length</p>
                                    <div className="relative group">
                                        <Info className="text-gray-500 cursor-pointer" size={16} />
                                        <div className="absolute bottom-full mb-1 w-60 left-3 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 hidden group-hover:flex transition-opacity duration-200 z-10">
                                            Choose the optimal length for your emails — see industry benchmarks in our Help Center.
                                        </div>
                                    </div>
                                </label>
                                <Dropdown
                                    options={wordOptions}
                                    value={formData.text_length}
                                    onChange={(updated) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            text_length: updated,
                                        }))
                                    }
                                    placeholder="Select"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Products/Service to feature</label>
                                <input type="text" value={formData.product_service_to_feature} name='product_service_to_feature' onChange={handleChange} placeholder="Enter Products/Service to feature" className="w-full border border-[#E1E4EA] rounded-lg px-3 py-2" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            {/* <label className="text-sm font-medium"></label> */}
                            <label className="text-sm font-medium mb-1 flex items-center gap-2">
                                <p>Review before sending</p>
                                <div className="relative group">
                                    <Info className="text-gray-500 cursor-pointer" size={16} />
                                    <div className="absolute bottom-full flex-col mb-1 gap-1 w-60 left-3 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 hidden group-hover:flex transition-opacity duration-200 z-10">
                                        <p className='font-[700]'>ON – <span className='font-[500] text-[#E1E4EA]'>You’ll get a notification 24 h before each scheduled email. The email stays on hold until you approve it in the calendar.</span></p>
                                        <p className='font-[700]'>OFF –  <span className='font-[500] text-[#E1E4EA]'>The email is sent automatically at the scheduled time.</span></p>
                                        <p className='font-[500] text-[#fff]'>In both cases, you can still open the calendar at any moment and review or edit any email up to 24 h before it goes out.</p>
                                    </div>
                                </div>
                            </label>
                            <button
                                onClick={() => setFormData((prev) => ({ ...prev, review_before_sending: !formData.review_before_sending }))}
                                className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${formData.review_before_sending ? "bg-[#7065F0]" : "bg-[#E1E4EA]"}`}
                            >
                                <span
                                    className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${formData.review_before_sending ? "translate-x-5" : "translate-x-0.5"}`}
                                ></span>
                            </button>
                        </div>
                        {/* <p className='text-sm text-gray-500 -mt-4'>You receive a notification 24h before sending to review and approve the email.</p>

                        <div className="bg-orange-100 text-sm text-black rounded-md px-4 py-2">
                            You'll be able to review and edit each email 24 hours before it's sent, directly from your calendar.
                        </div> */}

                        <div className="flex justify-between gap-4 pt-4">
                            <button className="px-4 font-[500] w-full py-2 bg-[#675FFF] text-white rounded" onClick={handleSubmit}>Launch Campaign</button>
                            <button className="px-4 font-[500] w-full py-2 border text-[#5A687C] border-[#E1E4EA] rounded">Save As Draft</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CampaignsTable;