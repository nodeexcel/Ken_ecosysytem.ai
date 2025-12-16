import { useEffect, useState } from "react"
import { SelectDropdown } from "./Dropdown"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { contentGenerationStatus, createContent } from "../api/contentCreationAgent";
import constanceImg from '../assets/svg/constance_logo.svg'
import Slider from "react-slick";
import { Calendar as CalendarIcon, Clock, X, Plus } from "lucide-react";
import { useRef } from "react";


function TimeSelector12({ value, onChange, onClose }) {
    // value: "hh:mm AM/PM"
    const parseInitial = () => {
        let [time, ampm] = value.split(" ");
        let [h, m] = (time || "").split(":").map((v) => v.trim());
        h = h ? h.padStart(2, "0") : "12";
        m = m ? m.padStart(2, "0") : "00";
        ampm = ampm || "AM";
        return { hour: h, minute: m, ampm };
    };
    const { hour, minute, ampm } = parseInitial();
    const [selectedHour, setSelectedHour] = useState(hour);
    const [selectedMinute, setSelectedMinute] = useState(minute);
    const [selectedAMPM, setSelectedAMPM] = useState(ampm);
    const hoursRef = useRef(null);
    const minutesRef = useRef(null);
    const itemHeight = 36;
    const hours = Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i).padStart(2, "0"));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
    const circularHours = [...hours, ...hours, ...hours];
    const circularMinutes = [...minutes, ...minutes, ...minutes];
    useEffect(() => {
        if (hoursRef.current && minutesRef.current) {
            const scrollToItem = (ref, items, value) => {
                const index = items.indexOf(value);
                if (index !== -1) {
                    const centerOffset = 2;
                    ref.current.scrollTop = (items.length + index - centerOffset) * itemHeight;
                }
            };
            scrollToItem(hoursRef, hours, selectedHour);
            scrollToItem(minutesRef, minutes, selectedMinute);
        }
    }, []);
    useEffect(() => {
        onChange(`${selectedHour}:${selectedMinute} ${selectedAMPM}`);
    }, [selectedHour, selectedMinute, selectedAMPM]);
    const isSelected = (item, selectedItem) => item === selectedItem;
    return (
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg px-3 sm:px-4 py-1 z-50 border border-gray-200 w-full">
            <div className="flex gap-1.5 sm:gap-2 items-center w-full justify-center">
                {/* Hours column */}
                <div className="flex-1 min-w-[32px] sm:min-w-[36px]">
                    <div ref={hoursRef} className="h-[60px] sm:h-[72px] overflow-auto scrollbar-hide">
                        <div className="px-0.5 sm:px-1">
                            {circularHours.map((hour, index) => (
                                <div
                                    key={`hour-${index}`}
                                    className={`h-[20px] sm:h-[24px] flex items-center justify-center text-[13px] sm:text-[15px] cursor-pointer select-none ${isSelected(hour, selectedHour) ? 'text-[#675FFF] font-semibold' : 'text-gray-500'}`}
                                    onClick={() => {
                                        setSelectedHour(hour);
                                    }}
                                >
                                    {hour}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <span className="text-sm sm:text-base font-bold">:</span>
                {/* Minutes column */}
                <div className="flex-1 min-w-[32px] sm:min-w-[36px]">
                    <div ref={minutesRef} className="h-[60px] sm:h-[72px] overflow-auto scrollbar-hide">
                        <div className="px-0.5 sm:px-1">
                            {circularMinutes.map((minute, index) => (
                                <div
                                    key={`minute-${index}`}
                                    className={`h-[20px] sm:h-[24px] flex items-center justify-center text-[13px] sm:text-[15px] cursor-pointer select-none ${isSelected(minute, selectedMinute) ? 'text-[#675FFF] font-semibold' : 'text-gray-500'}`}
                                    onClick={() => {
                                        setSelectedMinute(minute);
                                    }}
                                >
                                    {minute}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* AM/PM toggle */}
                <div className="flex flex-col justify-center ml-0.5 sm:ml-1">
                    <button
                        className={`px-1 py-0.5 rounded text-[10px] sm:text-xs ${selectedAMPM === 'AM' ? 'bg-[#675FFF] text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setSelectedAMPM('AM')}
                    >AM</button>
                    <button
                        className={`px-1 py-0.5 rounded mt-0.5 sm:mt-1 text-[10px] sm:text-xs ${selectedAMPM === 'PM' ? 'bg-[#675FFF] text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setSelectedAMPM('PM')}
                    >PM</button>
                </div>
            </div>
            <div className="flex justify-end w-full mt-1">
                <button className="text-[#675FFF] px-2 py-1 text-[10px] sm:text-xs cursor-pointer hover:text-blue-600" onClick={onClose}>OK</button>
            </div>
        </div>
    );
}

function DateSelector({ value, onChange, onClose }) {
    // value: "dd/mm/yyyy"
    const parseInitial = () => {
        if (!value) return new Date();
        const [day, month, year] = value.split("/").map(Number);
        if (!day || !month || !year) return new Date();
        return new Date(year, month - 1, day);
    };
    const [currentMonth, setCurrentMonth] = useState(() => {
        const d = parseInitial();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });
    const [selectedDate, setSelectedDate] = useState(parseInitial());
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const yearPickerRef = useRef(null);
    const currentYearRef = useRef(null);
    const monthPickerRef = useRef(null);
    const currentMonthRef = useRef(null);
    const yearTriggerRef = useRef(null);
    const monthTriggerRef = useRef(null);
    const today = new Date();
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const years = (() => {
        const currentYear = currentMonth.getFullYear();
        const startYear = currentYear - 10;
        const endYear = currentYear + 10;
        const yearList = [];
        for (let year = startYear; year <= endYear; year++) {
            yearList.push(year);
        }
        return yearList;
    })();
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }
    function getFirstDayOfMonth(year, month) {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    }
    function isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    }
    function getMonthName(monthIndex) {
        const date = new Date(2000, monthIndex, 1);
        return date.toLocaleString("en-US", { month: "short" });
    }
    const months = Array.from({ length: 12 }, (_, i) => ({
        index: i,
        name: getMonthName(i)
    }));
    function formatDate(date) {
        if (!date || isNaN(date.getTime())) return "";
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    // Calendar grid
    const calendarDays = (() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDayOfMonth = getFirstDayOfMonth(year, month);
        const daysInMonth = getDaysInMonth(year, month);
        const prevMonthYear = month === 0 ? year - 1 : year;
        const prevMonth = month === 0 ? 11 : month - 1;
        const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
        const days = [];
        for (let i = firstDayOfMonth; i > 0; i--) {
            days.push({ date: new Date(prevMonthYear, prevMonth, daysInPrevMonth - i + 1), isOtherMonth: true });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ date: new Date(year, month, i), isOtherMonth: false });
        }
        const nextMonthYear = month === 11 ? year + 1 : year;
        const nextMonth = month === 11 ? 0 : month + 1;
        let dayCounter = 1;
        while (days.length < 42) {
            days.push({ date: new Date(nextMonthYear, nextMonth, dayCounter), isOtherMonth: true });
            dayCounter++;
        }
        return days;
    })();
    // Handlers
    const handleDateClick = (date) => {
        setSelectedDate(date);
        onChange(formatDate(date));
        if (onClose) onClose();
    };
    const handleYearClick = (year) => {
        setCurrentMonth((prev) => new Date(year, prev.getMonth(), 1));
        setShowYearPicker(false);
    };
    const handleMonthClick = (monthIndex) => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), monthIndex, 1));
        setShowMonthPicker(false);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showYearPicker &&
                yearPickerRef.current &&
                !yearPickerRef.current.contains(event.target) &&
                yearTriggerRef.current &&
                !yearTriggerRef.current.contains(event.target)) {
                setShowYearPicker(false);
            }
            if (showMonthPicker &&
                monthPickerRef.current &&
                !monthPickerRef.current.contains(event.target) &&
                monthTriggerRef.current &&
                !monthTriggerRef.current.contains(event.target)) {
                setShowMonthPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showYearPicker, showMonthPicker]);
    useEffect(() => {
        if (showYearPicker && currentYearRef.current && yearPickerRef.current) {
            currentYearRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [showYearPicker]);
    useEffect(() => {
        if (showMonthPicker && currentMonthRef.current && monthPickerRef.current) {
            currentMonthRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [showMonthPicker]);
    return (
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-1.5 sm:p-2 z-50 border border-gray-200 w-full">
            <div className="mb-3 sm:mb-4 w-full flex flex-col items-center">
                <div
                    ref={yearTriggerRef}
                    className="relative text-sm sm:text-base font-semibold text-gray-500 cursor-pointer min-w-[36px] sm:min-w-[40px] w-[36px] sm:w-[40px] text-center"
                    onClick={() => {
                        setShowYearPicker(!showYearPicker);
                        setShowMonthPicker(false);
                    }}
                >
                    {currentMonth.getFullYear()}
                    {showYearPicker && (
                        <div
                            ref={yearPickerRef}
                            className="absolute left-0 top-full z-10 mt-2 h-28 sm:h-32 w-14 sm:w-16 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
                        >
                            {years.map((year) => (
                                <div
                                    key={year}
                                    ref={year === currentMonth.getFullYear() ? currentYearRef : null}
                                    className={`cursor-pointer px-1.5 sm:px-2 py-0.5 sm:py-1 text-center text-xs sm:text-sm hover:bg-gray-100 
                        ${year === currentMonth.getFullYear() ? "bg-v0-purple text-black font-semibold" : ""}
                    `}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleYearClick(year);
                                    }}
                                >
                                    {year}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="relative">
                    <div
                        ref={monthTriggerRef}
                        className="text-base sm:text-lg font-bold cursor-pointer hover:text-[#675FFF] transition-colors"
                        onClick={() => {
                            setShowMonthPicker(!showMonthPicker);
                            setShowYearPicker(false);
                        }}
                    >
                        {getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}
                    </div>
                    {showMonthPicker && (
                        <div
                            ref={monthPickerRef}
                            className="absolute left-1/2 -translate-x-1/2 top-full z-10 mt-2 h-40 sm:h-48 w-20 sm:w-24 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
                        >
                            {months.map((month) => {
                                const isActive = month.index === currentMonth.getMonth();

                                return (
                                    <div
                                        key={month.index}
                                        ref={isActive ? currentMonthRef : null}
                                        className={`cursor-pointer px-1.5 sm:px-2 py-0.5 sm:py-1 text-center text-xs sm:text-sm
                ${isActive
                                                ? "bg-[#675FFF] text-white font-semibold"
                                                : "text-black hover:bg-gray-100 hover:text-black"
                                            }
            `}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMonthClick(month.index);
                                        }}
                                    >
                                        {month.name}
                                    </div>
                                );
                            })}

                        </div>
                    )}
                </div>
            </div>
            <div className="mb-1.5 sm:mb-2 w-full">
                <div className="grid grid-cols-7 text-center text-[10px] sm:text-xs font-medium bg-[#E1E4EA99] text-gray-500 border-gray-200 rounded-md overflow-hidden">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="py-0.5 sm:py-1">{day}</div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-xs sm:text-sm w-full">
                {calendarDays.map((dayInfo, index) => {
                    const isToday = isSameDay(dayInfo.date, today);
                    const isSelected = isSameDay(dayInfo.date, selectedDate);
                    const isFirstDayOfMonth = dayInfo.date.getDate() === 1;
                    const monthLabel = isFirstDayOfMonth ? getMonthName(dayInfo.date.getMonth()) : "";
                    return (
                        <div
                            key={index}
                            className={`h-6 w-6 sm:h-7 sm:w-7 cursor-pointer rounded-md transition-colors ${dayInfo.isOtherMonth ? "text-gray-400" : "text-gray-800"} ${isToday ? "bg-v0-purple text-white font-semibold" : ""} ${isSelected && !isToday ? "bg-[#675FFF] text-white" : ""} ${!isToday && !isSelected && !dayInfo.isOtherMonth ? "hover:bg-gray-100" : ""} ${monthLabel || isToday ? "flex flex-col items-center justify-center" : "flex items-center justify-center"}`}
                            onClick={() => handleDateClick(dayInfo.date)}
                        >
                            {(monthLabel || isToday) && (
                                <span className="text-[8px] sm:text-[9px] font-medium leading-none">{isToday ? "Today" : monthLabel}</span>
                            )}
                            <span className={`${monthLabel || isToday ? "mt-0.5" : ""}`}>{dayInfo.date.getDate()}</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-end w-full mt-1.5 sm:mt-2">
                <button className="text-[#675FFF] px-2 py-1 text-xs sm:text-sm cursor-pointer hover:text-blue-600" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

function CreationStudio({ onClose, onGenerateContent }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ text: "", post_type: "", language: "", media_type: "", video_duration: "", author: "", created_at: new Date() })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation();
    const [generateContent, setGenerateContent] = useState({})
    const [loadingSteps, setLoadingSteps] = useState(0)
    const [contentId, setContentId] = useState("")
    const [showTimeDropdown, setShowTimeDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showGeneratedContent, setShowGeneratedContent] = useState(false)

    const settings = {
        dots: true,
        infinite: true,
        speed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: "linear",
        pauseOnHover: false,
    };

    // Commented out API polling - will uncomment later
    // useEffect(() => {
    //     let interval;
    //     if (contentId) {
    //         setLoadingSteps(0);
    //         interval = setInterval(async () => {
    //             const response = await getContentData()
    //             console.log(response)
    //             if (response?.status === "in_progress") {
    //                 setLoadingSteps(prev => {
    //                     if (prev >= 100) {
    //                         clearInterval(interval);
    //                         return 100;
    //                     }
    //                     return prev + 1;
    //                 });
    //             } else {
    //                 setGenerateContent(response)
    //                 setLoadingSteps(100);
    //                 clearInterval(interval);
    //             }
    //         }, 2000);
    //     }
    //     return () => clearInterval(interval);
    // }, [contentId]);

    const postTypeOptions = [{ label: `${t("constance.generic")}`, key: "generic" }, { label: `${t("constance.meme")}`, key: "meme" }, { label: `${t("constance.quoted")}`, key: "quotes" }]
    const mediaTypeOptions = [{ label: `${t("constance.single_image")}`, key: "single_image" }, { label: `${t("constance.carousel")}`, key: "carousel" }, { label: `${t("constance.video")}`, key: "video" }, { label: `${t("constance.reel")}`, key: "reel" }]
    const languageOptions = [{ label: `${t("constance.eng")}`, key: "english" }, { label: `${t("constance.fr")}`, key: "french" }]
    const VideoOptions = [{ label: `${t("constance.video_type_first")}`, key: "short" }, { label: `${t("constance.video_type_second")}`, key: "long" }]
    // Removed videoDurationOptions as we're changing to free text input


    const validateForm = () => {
        const newErrors = {};
        if (!formData.text.trim()) newErrors.text = `${t("constance.text") + " " + t("is_required")}`;
        if (formData.text && formData.text.length < 30) newErrors.text = t("constance.text_min");
        if (!formData.post_type) newErrors.post_type = `${t("constance.post_type") + " " + t("is_required")}`;
        if (!formData.language) newErrors.language = `${t("constance.lang") + " " + t("is_required")}`;
        if (!formData.media_type) newErrors.media_type = `${t("constance.media_type") + " " + t("is_required")}`;
        if (formData.media_type === "video") {
            if (!formData.video_duration) newErrors.video_duration = `${t("constance.video_duration") + " " + t("is_required")}`;
        }
        if (formData.post_type === "quotes") {
            if (!formData.author) newErrors.author = `${t("constance.author") + " " + t("is_required")}`;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const getContentData = async () => {
        try {
            const response = await contentGenerationStatus(contentId)
            if (response?.status === 200) {
                return response?.data
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return
        }
        // Skip API call and progress bar - prepare generated content data
        // Prepare mock generated content data (replace with actual API response later)
        const mockGeneratedContent = {
            results: [
                {
                    id: 1,
                    title: "Post 1 (Text Only Post)",
                    type: "text_only",
                    content: generateContent?.caption || formData.text || "✨ Ready to elevate your productivity? Meet our brand-new AI Writing Assistant — designed to help you write faster, clearer, and smarter. ✨ Say goodbye to writer's block and hello to seamless creativity. #AIWriting #ProductivityBoost #NextGenTools",
                    images: generateContent?.media_type === "single_image" && generateContent?.media_urls?.[0]?.url ? [generateContent.media_urls[0].url] : []
                },
                {
                    id: 2,
                    title: "Result 2 (Image + Text Post)",
                    type: "image_text",
                    content: "🧠 Need content ideas in seconds? Our AI Writing Assistant generates blogs, captions, and email copy instantly. 🚀 Perfect for creators, marketers, and fast-moving teams. #ContentCreation #MarketingTools #AIPowered",
                    images: generateContent?.media_type === "carousel" && generateContent?.media_urls ? generateContent.media_urls.map(m => m.url).slice(0, 2) : ["dummy1", "dummy2"]
                },
                {
                    id: 3,
                    title: "Post 3 (Text Only Post)",
                    type: "text_only",
                    content: generateContent?.caption || formData.text || "✨ Ready to elevate your productivity? Meet our brand-new AI Writing Assistant — designed to help you write faster, clearer, and smarter. ✨ Say goodbye to writer's block and hello to seamless creativity. #AIWriting #ProductivityBoost #NextGenTools",
                    images: []
                }
            ]
        };

        // If onGenerateContent callback is provided, use it (for ContentCreation integration)
        if (onGenerateContent) {
            onGenerateContent(mockGeneratedContent);
        } else {
            // Otherwise, navigate to standalone Generated Results page
            navigate("/dashboard/generated-results", {
                state: {
                    generatedContent: mockGeneratedContent,
                    formData: formData
                }
            });
        }

        // Close modal if onClose is provided
        if (onClose) {
            onClose();
        }
        
        // Commented out API call - will uncomment later
        // setLoading(true)
        // try {
        //     // Remove empty keys from formData
        //     const cleanedPayload = Object.fromEntries(
        //         Object.entries(formData).filter(([_, value]) => value !== "" && value !== undefined && value !== null)
        //     );

        //     const response = await createContent(cleanedPayload)
        //     if (response?.status === 200) {
        //         console.log(response?.data)
        //         setContentId(response?.data?.content_id)
        //     }
        // } catch (error) {
        //     console.log(error)
        // } finally {
        //     setLoading(false)
        // }
    }

    const handleCancel = () => {
        setFormData({ text: "", post_type: "", language: "", media_type: "", video_duration: "", author: "", created_at: new Date() });
        setErrors({});
        setShowTimeDropdown(false);
        setShowDateDropdown(false);
        setShowGeneratedContent(false);
        setContentId("");
        if (onClose) {
            onClose();
        }
    };

    const modalRef = useRef(null);

    // Handle click outside to close modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Ignore clicks coming from dropdown portals
            if (event.target.closest('.select-dropdown-portal')) {
                return;
            }

            if (modalRef.current && !modalRef.current.contains(event.target)) {
                if (onClose) {
                    onClose();
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4">
            <div ref={modalRef} className="bg-white rounded-xl sm:rounded-2xl w-full max-w-xl max-h-[95vh] sm:max-h-[90vh] overflow-auto shadow-lg relative">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                    <h1 className="text-[#1E1E1E] font-[600] text-[18px] sm:text-[20px] lg:text-[24px]">{t("constance.add_creation_studio")}</h1>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        >
                            <X size={20} className="sm:w-6 sm:h-6" />
                        </button>
                    )}
                </div>

                {/* Modal Content */}
                <div className="px-3 sm:px-4 lg:px-6 py-2">
                    {!showGeneratedContent ? <div className="h-full flex flex-col gap-3 sm:gap-4 w-full py-2 sm:py-3">
                        <div className="flex flex-col gap-1 sm:gap-1.5 w-full">
                            <label className="text-xs sm:text-sm font-medium text-[#808591]">
                                {t("constance.text")}(prompt)
                            </label>
                            <textarea
                                name='text'
                                onChange={handleChange}
                                value={formData?.text}
                                rows={4}
                                className={`w-full bg-white p-2 rounded-lg border text-sm sm:text-base ${errors.text ? 'border-red-500' : 'border-[#e1e4ea]'} resize-none focus:outline-none focus:border-[#675FFF]`}
                                placeholder={t("constance.text_placeholder")}
                            />
                            {errors.text && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.text}</p>}
                        </div>
                        <div className="flex flex-col gap-1 sm:gap-1.5 flex-1 col-span-1 md:col-span-2">
                                <label className="text-xs sm:text-sm font-medium text-[#808591]">
                                    {t("constance.media_type")}
                                </label>
                                <SelectDropdown
                                    name="media_type"
                                    options={mediaTypeOptions}
                                    value={formData?.media_type}
                                    onChange={(updated) => {
                                        setFormData((prev) => ({
                                            ...prev, media_type: updated
                                        }))
                                        setErrors((prev) => ({
                                            ...prev, media_type: ""
                                        }))
                                    }}
                                    placeholder={t("select")}
                                    className=""
                                    errors={errors}
                                />
                                {errors.media_type && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.media_type}</p>}
                            </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
                            <div className="flex flex-col gap-1 sm:gap-1.5 flex-1">
                                <label className="text-xs sm:text-sm font-medium text-[#808591]">
                                    {t("constance.post_type")}
                                </label>
                                <SelectDropdown
                                    name="post_type"
                                    options={postTypeOptions}
                                    value={formData?.post_type}
                                    onChange={(updated) => {
                                        setFormData((prev) => ({
                                            ...prev, post_type: updated
                                        }))
                                        setErrors((prev) => ({
                                            ...prev, post_type: ""
                                        }))
                                    }}
                                    placeholder={t("select")}
                                    className=""
                                    errors={errors}
                                    forceUpward={true}
                                />
                                {errors.post_type && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.post_type}</p>}
                            </div>
                            <div className="flex flex-col gap-1 sm:gap-1.5 flex-1">
                                <label className="text-xs sm:text-sm font-medium text-[#808591]">
                                    {t("constance.lang")}
                                </label>
                                <SelectDropdown
                                    name="language"
                                    options={languageOptions}
                                    value={formData?.language}
                                    onChange={(updated) => {
                                        setFormData((prev) => ({
                                            ...prev, language: updated
                                        }))
                                        setErrors((prev) => ({
                                            ...prev, language: ""
                                        }))
                                    }}
                                    placeholder={t("select")}
                                    className=""
                                    errors={errors}
                                    forceUpward={true}
                                />
                                {errors.language && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.language}</p>}
                            </div>
                            
                            {formData.media_type === "video" && <div className="flex flex-col gap-1 sm:gap-1.5 w-full">
                                <label className="text-xs sm:text-sm font-medium text-[#808591]">
                                    {t("constance.video_duration")}
                                </label>
                                <SelectDropdown
                                    name="video_duration"
                                    options={VideoOptions}
                                    value={formData?.video_duration}
                                    onChange={(updated) => {
                                        setFormData((prev) => ({
                                            ...prev, video_duration: updated
                                        }))
                                        setErrors((prev) => ({
                                            ...prev, video_duration: ""
                                        }))
                                    }}
                                    placeholder={t("select")}
                                    className=""
                                    errors={errors}
                                />
                                {errors.video_duration && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.video_duration}</p>}
                            </div>}
                            {/* Date Field */}
                            <div className="flex flex-col gap-1 sm:gap-1.5 flex-1">
                                <label className="text-xs sm:text-sm font-medium text-[#808591]">
                                    {t("constance.date")}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="date"
                                        value={formData?.date || ""}
                                        readOnly
                                        onClick={() => setShowDateDropdown(true)}
                                        className="w-full bg-white p-2 rounded-lg border border-[#e1e4ea] focus:outline-none focus:border-[#675FFF] pr-8 sm:pr-10 cursor-pointer text-sm sm:text-base"
                                        placeholder="dd/mm/yyyy"
                                    />
                                    <CalendarIcon className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[#5A687C] pointer-events-none w-4 h-4 sm:w-5 sm:h-5" />
                                    {showDateDropdown && (
                                        <div
                                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2 sm:px-4"
                                            onClick={() => setShowDateDropdown(false)}
                                        >
                                            <div
                                                className="rounded-lg sm:rounded-xl p-2 sm:p-4 w-full max-w-md max-h-[85vh] sm:max-h-[80vh] md:max-w-lg md:max-h-[85vh] lg:max-w-xl lg:max-h-[90vh] overflow-y-auto"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <DateSelector
                                                    value={formData?.date || ""}
                                                    onChange={(val) =>
                                                        setFormData((prev) => ({ ...prev, date: val }))
                                                    }
                                                    onClose={() => setShowDateDropdown(false)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                            {/* Time Field */}
                            <div className="flex flex-col gap-1 sm:gap-1.5 flex-1">
                                <label className="text-xs sm:text-sm font-medium text-[#808591]">
                                    {t("constance.time")}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="time"
                                        value={formData?.time || ""}
                                        readOnly
                                        onClick={() => setShowTimeDropdown(true)}
                                        className="w-full bg-white p-2 rounded-lg border border-[#e1e4ea] focus:outline-none focus:border-[#675FFF] pr-8 sm:pr-10 cursor-pointer text-sm sm:text-base"
                                        placeholder="hh:mm "
                                    />
                                    <Clock className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[#5A687C] pointer-events-none w-4 h-4 sm:w-5 sm:h-5" />
                                    {showTimeDropdown && (
                                        <div className="absolute left-0 bottom-full mb-2 w-full z-50">
                                            <TimeSelector12
                                                value={formData?.time || ""}
                                                onChange={(val) => setFormData((prev) => ({ ...prev, time: val }))}
                                                onClose={() => setShowTimeDropdown(false)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {formData.post_type === "quotes" && <div className="flex flex-col gap-1 sm:gap-1.5 w-full">
                            <label className="text-xs sm:text-sm font-medium text-[#1e1e1e]">
                                {t("constance.author")}
                            </label>
                            <input
                                type="text"
                                name='author'
                                value={formData?.author}
                                onChange={handleChange}
                                className={`w-full bg-white p-2 rounded-lg border text-sm sm:text-base ${errors.author ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                                placeholder={t("constance.author_placeholder")}
                            />
                            {errors.author && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.author}</p>}
                        </div>}
                    </div>
                        : (
                            // Commented out progress bar section - will uncomment later
                            // loadingSteps !== 100 ? <div className="border border-[#E1E4EA] bg-white p-[24px] justify-center items-center rounded-[10px] flex flex-col h-full">
                            //     <div className="flex flex-col gap-3 items-center">
                            //         <div className="flex items-center gap-2">
                            //             <div className="flex justify-center items-center">
                            //                 <img src={constanceImg} alt={"constance"} className="object-fit" />
                            //             </div>
                            //             <p className="text-[#1E1E1E] text-[16px] font-[600]">{t("constance.loading_content")}</p>
                            //         </div>
                            //         <div className="w-[500px] h-[14px] rounded-[40px] bg-[#D7D4FF]">
                            //             <div style={{ width: `${loadingSteps}%` }} className={`${loadingSteps === 100 ? 'rounded-[40px]' : 'rounded-l-[40px]'}  h-[14px] leading-none bg-[#675FFF]`} ></div>
                            //         </div>
                            //         <p className="text-[#5A687C] text-[14px] font-[400]">{loadingSteps}% Completed </p>
                            //     </div>
                            // </div> : 
                            <div className="border border-[#E1E4EA] bg-white p-4 sm:p-6 lg:p-[24px] rounded-lg sm:rounded-[10px] gap-4 sm:gap-5 lg:gap-[20px] flex flex-col">
                            <div className="flex items-center gap-2">
                                <div className="flex justify-center items-center">
                                    <img src={constanceImg} alt={"constance"} className="object-fit w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <p className="text-[#5A687C] text-[11px] sm:text-[12px] font-[600]">{t("constance.processed")}</p>
                            </div>
                            {generateContent?.caption ? <>
                                <div className="flex items-center justify-between">
                                    <p className="text-[#1E1E1E] text-[14px] sm:text-[15px] lg:text-[16px] font-[600]">{generateContent?.caption}</p>
                                </div>
                                <div className="flex">
                                    {generateContent?.media_type === "single_image" && <img src={generateContent?.media_urls[0]?.url} alt={"article"} className="object-fit" />}
                                    {generateContent?.media_type === "video" && <video
                                        src={generateContent?.media_urls[0]?.url}
                                        className="object-fit"
                                        controls
                                        autoPlay
                                        muted
                                    >
                                    </video>}
                                    {generateContent?.media_type === "carousel" && <div className="max-w-3xl mx-auto px-4">
                                        <Slider {...settings}>
                                            {generateContent?.media_urls?.map((media, index) => (
                                                <div key={index} className="!mx-1">
                                                    <img
                                                        src={media.url}
                                                        className="w-full rounded-lg object-cover max-h-[300px] mx-auto"
                                                        autoPlay
                                                    />
                                                </div>
                                            ))}
                                        </Slider>
                                    </div>}
                                </div>
                            </> : <p>Failed to Load</p>}

                        </div>
                        )}
                </div>

                {/* Modal Footer with Buttons - Full Width Border */}
                {!showGeneratedContent && (
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 z-10">
                        <button
                            onClick={handleCancel}
                            className="w-full sm:w-auto px-4 sm:px-5 rounded-lg cursor-pointer py-2 sm:py-2.5 text-center bg-white border border-gray-300 text-[#1E1E1E] font-[500] text-xs sm:text-sm hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            {t("cancel")}
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="w-full sm:w-auto px-4 sm:px-5 rounded-lg cursor-pointer py-2 sm:py-2.5 text-center bg-[#675FFF] text-white font-[500] text-xs sm:text-sm hover:bg-[#5a4fe6] transition-colors shadow-sm"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <p className="text-xs sm:text-sm">{t("processing")}</p>
                                    <span className="loader" />
                                </div>
                            ) : (
                                "Add Creation"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreationStudio
