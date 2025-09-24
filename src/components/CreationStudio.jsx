import { useEffect, useState } from "react"
import { SelectDropdown } from "./Dropdown"
import { useTranslation } from "react-i18next";
import { contentGenerationStatus, createContent } from "../api/contentCreationAgent";
import constanceImg from '../assets/svg/constance_logo.svg'
import Slider from "react-slick";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
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
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-2 z-50 border border-gray-200 w-full">
            <div className="flex gap-2 items-center w-full justify-center">
                {/* Hours column */}
                <div className="flex-1 min-w-[36px]">
                    <div ref={hoursRef} className="h-[72px] overflow-auto scrollbar-hide">
                        <div className="px-1">
                            {circularHours.map((hour, index) => (
                                <div
                                    key={`hour-${index}`}
                                    className={`h-[24px] flex items-center justify-center text-[15px] cursor-pointer select-none ${isSelected(hour, selectedHour) ? 'text-[#675FFF] font-semibold' : 'text-gray-500'}`}
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
                <span className="text-base font-bold">:</span>
                {/* Minutes column */}
                <div className="flex-1 min-w-[36px]">
                    <div ref={minutesRef} className="h-[72px] overflow-auto scrollbar-hide">
                        <div className="px-1">
                            {circularMinutes.map((minute, index) => (
                                <div
                                    key={`minute-${index}`}
                                    className={`h-[24px] flex items-center justify-center text-[15px] cursor-pointer select-none ${isSelected(minute, selectedMinute) ? 'text-[#675FFF] font-semibold' : 'text-gray-500'}`}
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
                <div className="flex flex-col justify-center ml-1">
                    <button
                        className={`px-1 py-0.5 rounded text-xs ${selectedAMPM === 'AM' ? 'bg-[#675FFF] text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setSelectedAMPM('AM')}
                    >AM</button>
                    <button
                        className={`px-1 py-0.5 rounded mt-1 text-xs ${selectedAMPM === 'PM' ? 'bg-[#675FFF] text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setSelectedAMPM('PM')}
                    >PM</button>
                </div>
            </div>
            <div className="flex justify-end w-full mt-1">
                <button className="text-[#675FFF] px-2 py-1 text-xs" onClick={onClose}>OK</button>
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
    const yearPickerRef = useRef(null);
    const currentYearRef = useRef(null);
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
    useEffect(() => {
        if (showYearPicker && currentYearRef.current && yearPickerRef.current) {
            currentYearRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [showYearPicker]);
    return (
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-2 z-50 border border-gray-200 w-full">
            <div className="mb-4 w-full flex flex-col items-center">
                <div
                    className="relative text-base font-semibold text-gray-500 cursor-pointer hover:text-gray-700 min-w-[40px] w-[40px] text-center"
                    onClick={() => setShowYearPicker(!showYearPicker)}
                >
                    {currentMonth.getFullYear()}
                    {showYearPicker && (
                        <div
                            ref={yearPickerRef}
                            className="absolute left-0 top-full z-10 mt-2 h-32 w-16 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
                        >
                            {years.map((year) => (
                                <div
                                    key={year}
                                    ref={year === currentMonth.getFullYear() ? currentYearRef : null}
                                    className={`cursor-pointer px-2 py-1 text-center text-sm hover:bg-gray-100 ${year === currentMonth.getFullYear() ? "bg-v0-purple text-white font-semibold" : ""}`}
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
                <div className="text-lg font-bold">{getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}</div>
            </div>
            <div className="mb-2 w-full">
                <div className="grid grid-cols-7 text-center text-xs font-medium bg-[#E1E4EA99] text-gray-500 border-gray-200 rounded-md overflow-hidden">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="py-1">{day}</div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm w-full">
                {calendarDays.map((dayInfo, index) => {
                    const isToday = isSameDay(dayInfo.date, today);
                    const isSelected = isSameDay(dayInfo.date, selectedDate);
                    const isFirstDayOfMonth = dayInfo.date.getDate() === 1;
                    const monthLabel = isFirstDayOfMonth ? getMonthName(dayInfo.date.getMonth()) : "";
                    return (
                        <div
                            key={index}
                            className={`h-7 w-7 cursor-pointer rounded-md transition-colors ${dayInfo.isOtherMonth ? "text-gray-400" : "text-gray-800"} ${isToday ? "bg-v0-purple text-white font-semibold" : ""} ${isSelected && !isToday ? "bg-[#675FFF] text-white" : ""} ${!isToday && !isSelected && !dayInfo.isOtherMonth ? "hover:bg-gray-100" : ""} ${monthLabel || isToday ? "flex flex-col items-center justify-center" : "flex items-center justify-center"}`}
                            onClick={() => handleDateClick(dayInfo.date)}
                        >
                            {(monthLabel || isToday) && (
                                <span className="text-[9px] font-medium leading-none">{isToday ? "Today" : monthLabel}</span>
                            )}
                            <span className={`${monthLabel || isToday ? "mt-0.5" : ""}`}>{dayInfo.date.getDate()}</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-end w-full mt-2">
                <button className="text-[#675FFF] px-2 py-1 text-sm" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

function CreationStudio() {
    const [formData, setFormData] = useState({ text: "", post_type: "", language: "", media_type: "", video_duration: "", author: "", created_at: new Date() })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation();
    const [generateContent, setGenerateContent] = useState({})
    const [loadingSteps, setLoadingSteps] = useState(0)
    const [contentId, setContentId] = useState("")
    const [showTimeDropdown, setShowTimeDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);

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

    useEffect(() => {
        let interval;
        if (contentId) {
            setLoadingSteps(0);
            interval = setInterval(async () => {
                const response = await getContentData()
                console.log(response)
                if (response?.status === "in_progress") {
                    setLoadingSteps(prev => {
                        if (prev >= 100) {
                            clearInterval(interval);
                            return 100;
                        }
                        return prev + 1;
                    });
                } else {
                    setGenerateContent(response)
                    setLoadingSteps(100);
                    clearInterval(interval);
                }
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [contentId]);

    const postTypeOptions = [{ label: `${t("constance.generic")}`, key: "generic" }, { label: `${t("constance.meme")}`, key: "meme" }, { label: `${t("constance.quoted")}`, key: "quotes" }]
    const mediaTypeOptions = [{ label: `${t("constance.single_image")}`, key: "single_image" }, { label: `${t("constance.carousel")}`, key: "carousel" }, { label: `${t("constance.video")}`, key: "video" }, { label: `${t("constance.reel")}`, key: "reel" }]
    const languageOptions = [{ label: `${t("constance.eng")}`, key: "english" }, { label: `${t("constance.fr")}`, key: "french" }]
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
        setLoading(true)
        try {
            // Remove empty keys from formData
            const cleanedPayload = Object.fromEntries(
                Object.entries(formData).filter(([_, value]) => value !== "" && value !== undefined && value !== null)
            );

            const response = await createContent(cleanedPayload)
            console.log(response,"FFffffffhfhfhfhfhfhfh")
            if (response?.status === 200) {
                console.log(response?.data)
                setContentId(response?.data?.content_id)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setFormData({ text: "", post_type: "", language: "", media_type: "", video_duration: "", author: "", created_at: new Date() });
        setErrors({});
    };

    return (
        <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-1 w-full">
            <p className="text-[#5A687C] text-[14px] font-[400]">{t("constance.content_creation")} {">"} {t("brain_ai.add_new")}</p>
            <h1 className="text-[#1E1E1E] font-[600] text-[24px]">{t("constance.add_creation_studio")}</h1>
            {!contentId ? <div className="h-full flex flex-col gap-4 w-full py-3">
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-[#1e1e1e]">
                        {t("constance.text")}(prompt)
                    </label>
                    <textarea
                        name='text'
                        onChange={handleChange}
                        value={formData?.text}
                        rows={4}
                        className={`w-full bg-white p-2 rounded-lg border  ${errors.text ? 'border-red-500' : 'border-[#e1e4ea]'} resize-none focus:outline-none focus:border-[#675FFF]`}
                        placeholder={t("constance.text_placeholder")}
                    />
                    {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-[#1e1e1e]">
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
                        />
                        {errors.post_type && <p className="text-red-500 text-sm mt-1">{errors.post_type}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-[#1e1e1e]">
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
                        />
                        {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-[#1e1e1e]">
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
                        {errors.media_type && <p className="text-red-500 text-sm mt-1">{errors.media_type}</p>}
                    </div>
                    {formData.media_type === "video" && <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-[#1e1e1e]">
                            {t("constance.video_duration")}
                        </label>
                        <input
                            type="text"
                            name="video_duration"
                            value={formData?.video_duration || ""}
                            onChange={handleChange}
                            className={`w-full bg-white p-2 rounded-lg border ${errors.video_duration ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                            placeholder={t("constance.video_duration_placeholder") || "Enter video duration (e.g., 30 seconds, 2 minutes)"}
                        />
                        {errors.video_duration && <p className="text-red-500 text-sm mt-1">{errors.video_duration}</p>}
                    </div>}
                    {/* Date Field */}
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-[#1e1e1e]">
                            {t("constance.date")}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="date"
                                value={formData?.date || ""}
                                readOnly
                                onClick={() => setShowDateDropdown(true)}
                                className="w-full bg-white p-2 rounded-lg border border-[#e1e4ea] focus:outline-none focus:border-[#675FFF] pr-10 cursor-pointer"
                                placeholder="dd/mm/yyyy"
                            />
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A687C] pointer-events-none" size={20} />
                            {showDateDropdown && (
                                <div className="absolute left-0 top-full mt-2 w-full z-50">
                                    <DateSelector
                                        value={formData?.date || ""}
                                        onChange={(val) => setFormData((prev) => ({ ...prev, date: val }))}
                                        onClose={() => setShowDateDropdown(false)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Time Field */}
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-[#1e1e1e]">
                              {t("constance.time")}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="time"
                                value={formData?.time || ""}
                                readOnly
                                onClick={() => setShowTimeDropdown(true)}
                                className="w-full bg-white p-2 rounded-lg border border-[#e1e4ea] focus:outline-none focus:border-[#675FFF] pr-10 cursor-pointer"
                                placeholder="hh:mm "
                            />
                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A687C] pointer-events-none" size={20} />
                            {showTimeDropdown && (
                                <div className="absolute left-0 top-full mt-2 w-full z-50">
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
                {formData.post_type === "quotes" && <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-[#1e1e1e]">
                        {t("constance.author")}
                    </label>
                    <input
                        type="text"
                        name='author'
                        value={formData?.author}
                        onChange={handleChange}
                        className={`w-full bg-white p-2 rounded-lg border ${errors.author ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                        placeholder={t("constance.author_placeholder")}
                    />
                    {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                </div>}
                <div className="flex items-center gap-2">
                    <button onClick={handleSubmit} className="px-5 rounded-[7px] cursor-pointer w-[200px] py-[7px] text-center bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white">{loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <p>{t("processing")}</p>
                            <span className="loader" />
                        </div>
                    ) : (
                        t("brain_ai.create")
                    )}</button>
                    <button onClick={handleCancel} className="px-5 rounded-[7px] cursor-pointer w-[200px] py-[7px] text-center border-[1.5px] border-[#E1E4EA] text-[#5A687C]">{t("cancel")}</button>
                </div>
            </div>
                : loadingSteps !== 100 ? <div className="border border-[#E1E4EA] bg-white p-[24px] justify-center items-center rounded-[10px] flex flex-col h-full">
                    <div className="flex flex-col gap-3 items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center">
                                <img src={constanceImg} alt={"constance"} className="object-fit" />
                            </div>
                            <p className="text-[#1E1E1E] text-[16px] font-[600]">{t("constance.loading_content")}</p>
                        </div>
                        <div className="w-[500px] h-[14px] rounded-[40px] bg-[#D7D4FF]">
                            <div style={{ width: `${loadingSteps}%` }} className={`${loadingSteps === 100 ? 'rounded-[40px]' : 'rounded-l-[40px]'}  h-[14px] leading-none bg-[#675FFF]`} ></div>
                        </div>
                        <p className="text-[#5A687C] text-[14px] font-[400]">{loadingSteps}% Completed </p>
                    </div>
                </div> : <div className="border border-[#E1E4EA] bg-white p-[24px] rounded-[10px] gap-[20px] flex flex-col">
                    <div className="flex items-center gap-2">
                        <div className="flex justify-center items-center">
                            <img src={constanceImg} alt={"constance"} className="object-fit" />
                        </div>
                        <p className="text-[#5A687C] text-[12px] font-[600]">{t("constance.processed")}</p>
                    </div>
                    {generateContent?.caption ? <>
                        <div className="flex items-center justify-between">
                            <p className="text-[#1E1E1E] text-[16px] font-[600]">{generateContent?.caption}</p>
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

                </div>}
        </div>
    )
}

export default CreationStudio
