import { useState, useEffect, useRef } from 'react';
import { Delete, Notes, ThreeDots, UploadIcon } from '../icons/icons';
import { ChevronDown, Info, X } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { createEmailCampaign, getEmailCampaignById, updateEmailCampaign } from '../api/emailCampaign';
import { getLists } from '../api/brainai';



const TimeSelector = ({ onSave, onCancel, initialTime, start_date }) => {
    const parseInitialTime = () => {
        if (!initialTime) {
            const now = new Date();
            const selectedDate = new Date(start_date);
            const isToday =
                now.getFullYear() === selectedDate.getFullYear() &&
                now.getMonth() === selectedDate.getMonth() &&
                now.getDate() === selectedDate.getDate();

            let baseTime = new Date(now);

            if (isToday) {

                baseTime.setMinutes(baseTime.getMinutes() + 30);
            }
            let hours = baseTime.getHours();
            const minutes = String(baseTime.getMinutes()).padStart(2, '0');
            const period = hours >= 12 ? 'PM' : 'AM';

            // Convert to 12-hour format
            hours = hours % 12 || 12;
            const hour = String(hours).padStart(2, '0');

            return { hour, minute: minutes, period };
        }
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
    const isTimeBeforeMinAllowed = (hour, minute, period) => {
        const now = new Date();
        const selectedDate = new Date(start_date);
        const isToday =
            now.getFullYear() === selectedDate.getFullYear() &&
            now.getMonth() === selectedDate.getMonth() &&
            now.getDate() === selectedDate.getDate();

        if (!isToday) return false;

        const minTime = new Date();
        minTime.setMinutes(minTime.getMinutes() + 30);

        const h24 = parseInt(hour, 10) % 12 + (period === 'PM' ? 12 : 0);
        const candidate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            h24,
            parseInt(minute, 10),
            0
        );

        return candidate < minTime;
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

    const circularHours = [...hours, ...hours, ...hours];
    const circularMinutes = [...minutes, ...minutes, ...minutes];
    const paddedPeriods = ['', '', ...periods, '', ''];

    const itemHeight = 36;

    const handleSave = () => onSave(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);
    const handleCircularScroll = (ref, originalItems, circularItems, setValue) => {
        if (!ref.current) return;

        const scrollTop = ref.current.scrollTop;
        const itemsLength = originalItems.length;
        const centerPosition = scrollTop + 72;
        const centerIndex = Math.round(centerPosition / itemHeight);
        const actualIndex = centerIndex % itemsLength;
        const selectedItem = originalItems[actualIndex];
        setValue(selectedItem);
        const totalItems = circularItems.length;
        const threshold = itemHeight * 2;
        if (scrollTop < threshold) {
            ref.current.scrollTop = itemsLength * itemHeight + (scrollTop % (itemsLength * itemHeight));
        }
        else if (scrollTop > (totalItems - itemsLength - 2) * itemHeight) {
            ref.current.scrollTop = itemsLength * itemHeight + (scrollTop % (itemsLength * itemHeight));
        }
    };

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

    const scrollToItem = (ref, items, value, height = itemHeight, isCircular = false) => {
        if (!ref.current) return;

        if (isCircular) {
            const index = items.indexOf(value);
            if (index !== -1) {
                const centerOffset = 2;
                ref.current.scrollTop = (items.length + index - centerOffset) * height;
            }
        } else {
            const index = items.indexOf(value);
            if (index !== -1) {
                const paddedIndex = index + 2;
                const centerOffset = 2;
                ref.current.scrollTop = (paddedIndex - centerOffset) * height;
            }
        }
    };

    useEffect(() => {
        if (hoursRef.current && minutesRef.current && periodRef.current) {
            scrollToItem(hoursRef, hours, selectedHour, itemHeight, true);
            scrollToItem(minutesRef, minutes, selectedMinute, itemHeight, true);
            scrollToItem(periodRef, periods, selectedPeriod);
        }
    }, []);

    const setupScrollEndDetection = (ref, items, setValue, height = itemHeight, isCircular = false, circularItems = null) => {
        if (!ref.current) return;

        let timeout;
        const handleScrollEnd = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (!ref.current) return;

                if (isCircular && circularItems) {
                    handleCircularScroll(ref, items, circularItems, setValue);
                } else {
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
                        ref.current.scrollTop = index * height;
                    }
                }
            }, 50);
        };

        const handleScroll = () => {
            if (isCircular && circularItems) {
                handleCircularScroll(ref, items, circularItems, setValue);
            }
        };

        ref.current.addEventListener('scroll', handleScrollEnd);
        ref.current.addEventListener('scroll', handleScroll);

        return () => {
            if (ref.current) {
                ref.current.removeEventListener('scroll', handleScrollEnd);
                ref.current.removeEventListener('scroll', handleScroll);
            }
        };
    };

    useEffect(() => {
        const setupTimer = setTimeout(() => {
            const cleanupHours = setupScrollEndDetection(hoursRef, hours, setSelectedHour, itemHeight, true, circularHours);
            const cleanupMinutes = setupScrollEndDetection(minutesRef, minutes, setSelectedMinute, itemHeight, true, circularMinutes);
            const cleanupPeriod = setupScrollEndDetection(periodRef, periods, setSelectedPeriod);

            return () => {
                cleanupHours();
                cleanupMinutes();
                cleanupPeriod();
            };
        }, 50);

        return () => clearTimeout(setupTimer);
    }, []);

    const handlePeriodScroll = () => {
        if (!periodRef.current) return;
        const scrollTop = periodRef.current.scrollTop;
        const index = Math.round(scrollTop / itemHeight);

        if (index >= 0 && index < periods.length) {
            setSelectedPeriod(periods[index]);
        }
    };

    const isSelected = (item, selectedItem) => {
        return item === selectedItem;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 w-full">
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
                        >
                            <div className="px-2">
                                {circularHours.map((hour, index) => (
                                    <div
                                        key={`hour-${index}`}
                                        className={`h-[36px] flex items-center justify-center text-[14px]
                                            ${isSelected(hour, selectedHour) ? 'text-[#675FFF] font-semibold' : 'text-gray-500'}
                                            ${isTimeBeforeMinAllowed(hour, selectedMinute, selectedPeriod) ? 'text-gray-300' : ''}`}
                                        onClick={() => {
                                            if (hour && !isTimeBeforeMinAllowed(hour, selectedMinute, selectedPeriod)) {
                                                setSelectedHour(hour);
                                                scrollToItem(hoursRef, hours, hour, itemHeight, true);
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
                        >
                            <div className="px-2">
                                {circularMinutes.map((minute, index) => (
                                    <div
                                        key={`minute-${index}`}
                                        className={`h-[36px] flex items-center justify-center text-[14px]
                                            ${isSelected(minute, selectedMinute) ? 'text-[#675FFF] font-semibold' : 'text-gray-500'}
                                            ${isTimeBeforeMinAllowed(selectedHour, minute, selectedPeriod) ? 'text-gray-300' : ''}`}
                                        onClick={() => {
                                            if (minute && !isTimeBeforeMinAllowed(selectedHour, minute, selectedPeriod)) {
                                                setSelectedMinute(minute);
                                                scrollToItem(minutesRef, minutes, minute, itemHeight, true);
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
                                            ${isSelected(period, selectedPeriod) ? 'text-[#675FFF] font-semibold' : 'text-gray-500'}
                                            ${isTimeBeforeMinAllowed(selectedHour, selectedMinute, period) ? 'text-gray-300' : ''}`}
                                        onClick={() => {
                                            if (period && !isTimeBeforeMinAllowed(selectedHour, selectedMinute, period)) {
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
                    disabled={isTimeBeforeMinAllowed(selectedHour, selectedMinute, selectedPeriod)}
                    onClick={handleSave}
                    className={`flex-1 bg-[#675FFF] text-white py-2 px-4 rounded hover:bg-[#5648ff] ${isTimeBeforeMinAllowed(selectedHour, selectedMinute, selectedPeriod) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        </div>
    );
};


const CustomSelector = ({ options, setShowSelector, value = [], onChange, ref }) => {

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowSelector(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleChange = (e) => {
        const newSelection = value.includes(e)
            ? value.filter((d) => d !== e)
            : [...value, e];
        onChange(newSelection);
    };
    return (
        <div className="bg-white rounded-lg shadow-lg">
            <div className="max-h-60 overflow-auto">
                <ul className="py-1 px-2 flex flex-col gap-1 my-1">
                    {options?.length > 0 && options.map((e) => (
                        <li
                            key={e.key}
                            onClick={() => toggleChange(e.key)}
                            className={`py-2 px-4 rounded-lg cursor-pointer flex items-center hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF] gap-2 ${value.includes(e.key)
                                ? 'bg-[#F4F5F6] rounded-lg text-[#675FFF]' : 'text-[#5A687C]'
                                }`}
                        >
                            <div
                                className={`w-4 h-4 rounded border flex items-center justify-center ${value.includes(e.key)
                                    ? 'border-[#675FFF] bg-[#675FFF]'
                                    : 'border-[#E1E4EA]'
                                    }`}
                            >
                                {value.includes(e.key) && (
                                    <span className="text-white text-xs">✓</span>
                                )}
                            </div>
                            <span>{e.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};





function CampaignsTable({ isEdit, setNewCampaignStatus, setIsEdit }) {
    const [campaignData, setCampaignData] = useState([
        { name: 'Campaign', opened: '-', clicked: '-', bounced: '', status: "Issue Detected" },
        { name: 'Campaign', opened: '-', clicked: '-', bounced: '', status: "Planned" }
    ]);

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showTimeSelector, setShowTimeSelector] = useState(false);
    const [showWeekSelector, setShowWeekSelector] = useState(false);
    const [showListTargetSelector, setShowListTargetSelector] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(false)
    const [updateStatus, setUpdateStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saveDraftStatus, setSaveDraftStatus] = useState(false);
    const [updateSaveDraftStatus, setUpdateSaveDraftStatus] = useState(false)
    const [contactLists, setContactLists] = useState([]);
    const targetListRef = useRef()
    const frequencyDaysRef = useRef()

    const [formData, setFormData] = useState({
        campaign_title: "",
        campaign_objective: "",
        campaign_objective_other: "",
        main_subject: "", cta_type: "", calender_choosed: "", url: "", file: "", list_of_target: [], desired_tone: "", language: "",
        send_time_window: "", start_date: "", frequency: [], include_branding: false, include_brainai: false,
        custom_prompt: "", text_length: "", product_or_service_feature: "", review: false, is_draft: false
    });

    const [errors, setErrors] = useState({});


    const campaignObjectiveOptions = [{ label: "Promote an offer", key: "promote_an_offer" }, { label: "Inform / Educate", key: "inform_educate" }, { label: "Re-engage leads", key: "re_engage_leads" }, { label: "Announce a new feature", key: "announce_a_new_feature" }, { label: "Other", key: "other" }]

    const ctaTypeOptions = [{ label: "Book a Meeting", key: "book_a_meeting" }, { label: "Purchase", key: "purchase" },
    { label: "Visit a Page", key: "visit_a_page" }, { label: "Reply", key: "reply" }, { label: "Download", key: "download" }];

    const toneOptions = [{ label: "Professional", key: "professional" }, { label: "Friendly", key: "friendly" }, { label: "Storytelling", key: "storytelling" }, { label: "Provocation", key: "provocation" },
    { label: "Educational", key: "educational" }, { label: "Inspiring", key: "inspiring" }];

    const calendarOptions = [{ label: "Calendly", key: "calendly" }, { label: "Google Calendar", key: "google_calendar" }]


    const languageOptions = [{ label: "EN", key: "en" }, { label: "FR", key: "fr" }];

    const wordOptions = [{ label: "50 - 100 words", key: "50_to_100_words" }, { label: "100 - 200 words", key: "100_to_200_words" }, { label: "200 - 400 words", key: "200_to_400_words" }, { label: "400 - 800 words", key: "400_to_800_words" }];

    const listOfTargetOptions = [{ label: "Segment A", key: "segment_a" }, { label: "Segment B", key: "segment_b" }]

    const daysOptions = [{ label: 'Monday', key: 'monday' }, { label: "Tuesday", key: "tuesday" }, { label: "Wednesday", key: "wednesday" }, { label: "Thursday", key: "thursday" }, { label: "Friday", key: "friday" }, { label: "Saturday", key: "saturday" }, { label: "Sunday", key: "sunday" }];


    const validateForm = () => {
        const newErrors = {};

        if (!formData.campaign_title.trim()) newErrors.campaign_title = "Campaign title is required.";
        if (!formData.campaign_objective) newErrors.campaign_objective = "Campaign objective is required.";

        if (formData.campaign_objective === 'other' && !formData.campaign_objective_other.trim()) {
            newErrors.campaign_objective_other = "Please specify the objective.";
        }

        if (!formData.main_subject.trim()) newErrors.main_subject = "Main subject is required.";
        if (!formData.cta_type) newErrors.cta_type = "CTA type is required.";
        if (formData.cta_type === "book_a_meeting") {
            if (!formData.calender_choosed) newErrors.calender_choosed = "Meeting Link is required.";
        } else if (formData.cta_type === "purchase" || formData.cta_type === "visit_a_page") {
            if (!formData.url.trim()) {
                newErrors.url = "URL is required.";
            } else if (!/^https?:\/\/\S+$/.test(formData.url)) {
                newErrors.url = "Enter a valid URL (http:// or https://).";
            }
        } else if (formData.cta_type === "download") {
            newErrors.file = "Upload a file is required."
        }

        if (!formData.desired_tone) newErrors.desired_tone = "Desired tone is required.";
        if (!formData.language) newErrors.language = "Language is required.";
        if (!formData.send_time_window) newErrors.send_time_window = "Send time window is required.";

        if (!formData.start_date) {
            newErrors.start_date = "Start date is required.";
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.start_date)) {
            newErrors.start_date = "Start date must be in YYYY-MM-DD format.";
        }

        if (!Array.isArray(formData.frequency) || formData.frequency.length === 0) {
            newErrors.frequency = "At least one frequency option must be selected.";
        }

        if (!Array.isArray(formData.list_of_target) || formData.list_of_target.length === 0) {
            newErrors.list_of_target = "At least one Target option must be selected.";
        }

        if (!formData.text_length) newErrors.text_length = "Text length is required.";
        if (!formData.product_or_service_feature.trim()) newErrors.product_or_service_feature = "Product/service to feature is required.";
        if (!formData.custom_prompt.trim()) newErrors.custom_prompt = "Custom prompt is required when using AI brain.";

        return newErrors;
    };

    useEffect(() => {
        if (isEdit) {
            getEmailCampaigndData()
        }
    }, [isEdit])

    useEffect(() => {
        handleGetListsContacts()
    }, [])

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
        setErrors((prev) => ({ ...prev, send_time_window: "" }))
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
        setErrors((prev) => ({ ...prev, file: "" }))
        if (file && file.type !== "application/pdf") {
            setErrors((prev) => ({ ...prev, file: "Only PDF files are allowed." }));
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
            setErrors((prev) => ({ ...prev, file: "Only PDF files are allowed." }));
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

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev, [name]: value
        }))
        setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    const getEmailCampaigndData = async () => {
        setLoading(true)
        try {
            const response = await getEmailCampaignById(isEdit)
            if (response.status === 200) {
                console.log(response?.data)
                const campaign = response?.data?.campaign;
                const isCustomObjective = !campaignObjectiveOptions.some(
                    (e) => e.key === campaign.campaign_objective
                );
                setFormData({
                    ...campaign,
                    campaign_objective: isCustomObjective ? 'other' : campaign.campaign_objective,
                    campaign_objective_other: isCustomObjective ? campaign.campaign_objective : '',
                });
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleGetListsContacts = async () => {
        try {
            const response = await getLists("all", '');
            if (response?.status === 200) {
                console.log(response?.data?.lists)
                const data = response?.data?.lists
                if (data?.length > 0) {
                    const formatData = data.map((e) => ({
                        label: e.listName,
                        key: e.id
                    }))
                    setContactLists(formatData)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (status) => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log("Validation errors:", validationErrors);
            return;
        }

        console.log(formData, "formData")
        { status ? setSaveDraftStatus(true) : setSubmitStatus(true) }
        try {
            let payload = { ...formData };

            if (formData.campaign_objective_other?.trim()) {
                payload.campaign_objective = formData.campaign_objective_other;
            }
            if (status) {
                payload.is_draft = status
            }

            delete payload.campaign_objective_other;

            const response = await createEmailCampaign(payload);
            if (response.status === 201) {
                console.log(response.data)
                setNewCampaignStatus(false)
            }

        } catch (error) {
            console.log(error)
        } finally {
            { status ? setSaveDraftStatus(false) : setSubmitStatus(false) }
        }
    }


    const handleUpdate = async (status) => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log("Validation errors:", validationErrors);
            return;
        }

        console.log(formData, "formData")
        { status ? setUpdateSaveDraftStatus(true) : setUpdateStatus(true) }
        try {
            let payload = { ...formData };

            if (formData.campaign_objective_other?.trim()) {
                payload.campaign_objective = formData.campaign_objective_other;
            }
            if (status) {
                payload.is_draft = status
            }

            delete payload.campaign_objective_other;
            const response = await updateEmailCampaign(payload, isEdit);
            if (response.status === 200) {
                console.log(response.data)
                setNewCampaignStatus(false)
            }

        } catch (error) {
            console.log(error)
        } finally {
            { status ? setUpdateSaveDraftStatus(false) : setUpdateStatus(false) }
        }
    }

    // Dropdown Component
    const Dropdown = ({ name, options, placeholder = 'Select', value, onChange, className = '' }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [openUpward, setOpenUpward] = useState(false);
        const dropdownRef = useRef(null);
        const buttonRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        useEffect(() => {
            if (isOpen && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const dropdownHeight = 240;
                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;
                if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                    setOpenUpward(true);
                } else {
                    setOpenUpward(false);
                }
            }
        }, [isOpen]);

        const handleSelect = (option) => {
            onChange(option);
            setIsOpen(false);
        };

        const optionLabel = value && options.find((e) => e.key === value)

        return (
            <div ref={dropdownRef} className={`relative w-full ${className}`}>
                <button ref={buttonRef} type="button" onClick={() => setIsOpen(!isOpen)} className={`flex justify-between items-center w-full border ${errors[name] ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 bg-white text-left focus:outline-none focus:border-[#675FFF]`}>
                    <span className={`block truncate ${!optionLabel ? 'text-[#5A687C]' : 'text-[#1E1E1E]'}`}>{optionLabel.label || placeholder}</span>
                    <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className={`absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto ${openUpward ? 'bottom-full mb-1' : 'mt-1'}`}>
                        <ul className="py-1 px-2 flex flex-col gap-1 my-1">
                            {options.map((option) => (
                                <li key={option.key} className={`cursor-pointer select-none relative px-4 py-2 hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF] ${value === option.key ? 'text-[#675FFF] bg-[#F4F5F6] rounded-lg' : 'text-[#5A687C]'}`} onClick={() => handleSelect(option.key)}>{option.label}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };


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
                        <label className="block text-sm font-medium mb-1">Meeting Link</label>
                        {/* <Dropdown
                            name="calender_choosed"
                            options={calendarOptions}
                            value={formData.calender_choosed}
                            onChange={(updated) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    calender_choosed: updated,
                                }))
                                setErrors((prev) => ({ ...prev, calender_choosed: "" }))
                            }
                            }
                            placeholder="Select"
                        /> */}
                        <input type="text" value={formData.calender_choosed} name='calender_choosed' onChange={handleChange} placeholder="Enter Meeting Link" className={`w-full border ${errors.calender_choosed ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 focus:outline-none focus:border-[#675FFF] bg-white`} />
                        {errors.calender_choosed && <p className='my-1 text-[#FF3B30]'>{errors.calender_choosed}</p>}
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
                                    accept="application/pdf"
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
                            {errors.file && <p className='my-1 text-[#FF3B30]'>{errors.file}</p>}
                        </div>
                    </div>
                );
            case "visit_a_page":
                return (
                    <div>
                        <label className="block text-sm font-medium mb-1">URL</label>
                        <input type="text" value={formData.url} name='url' onChange={handleChange} placeholder="http:// Enter URL" className={`w-full border ${errors.url ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 focus:outline-none focus:border-[#675FFF] bg-white`} />
                        {errors.url && <p className='my-1 text-[#FF3B30]'>{errors.url}</p>}
                    </div>
                )
            case "purchase":
                return (
                    <div>
                        <label className="block text-sm font-medium mb-1">URL</label>
                        <input type="text" value={formData.url} name='url' onChange={handleChange} placeholder="http:// Enter URL" className={`w-full border ${errors.url ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 focus:outline-none focus:border-[#675FFF] bg-white`} />
                        {errors.url && <p className='my-1 text-[#FF3B30]'>{errors.url}</p>}
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

    if (loading) return <p className='flex justify-center items-center h-[100vh]'><span className='loader' /></p>

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
            <div className="w-full pt-4 pb-6 pr-4 flex flex-col justify-center">
                <h1 onClick={() => {
                    setNewCampaignStatus(false)
                    setIsEdit("")
                }} className="text-[#5A687C] hover:text-[#5a687cdc] cursor-pointer font-[400] text-[14px]">{`Campaigns > `}{isEdit ? `${formData.campaign_title}` : 'New Campaign'}</h1>
                <h1 className="text-[#1E1E1E] font-[600] text-[24px] mt-2 my-4">{isEdit ? 'Update' : 'Add'} New Campaign</h1>

                <div className="w-full relative overflow-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Campaign Title</label>
                            <input type="text" onChange={handleChange} name='campaign_title' value={formData.campaign_title} placeholder="Enter campaign title" className={`w-full border bg-white ${errors.campaign_title ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 focus:outline-none focus:border-[#675FFF]`} />
                            {errors.campaign_title && <p className='my-1 text-[#FF3B30]'>{errors.campaign_title}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Campaign Objective</label>
                                <Dropdown
                                    name="campaign_objective"
                                    options={campaignObjectiveOptions}
                                    value={formData.campaign_objective}
                                    onChange={(updated) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            campaign_objective: updated,
                                            campaign_objective_other: ""
                                        }))
                                        setErrors((prev) => ({ ...prev, campaign_objective: "" }))
                                    }
                                    }
                                    placeholder="Select"
                                />
                                {errors.campaign_objective && <p className='my-1 text-[#FF3B30]'>{errors.campaign_objective}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Main Subject</label>
                                <input type="text" placeholder="Enter main subject" value={formData.main_subject} name='main_subject' onChange={handleChange} className={`w-full border bg-white ${errors.main_subject ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 focus:outline-none focus:border-[#675FFF]`} />
                                {errors.main_subject && <p className='my-1 text-[#FF3B30]'>{errors.main_subject}</p>}
                            </div>
                        </div>

                        {formData.campaign_objective === "other" && <div>
                            <label className="block text-sm font-medium mb-1">Other</label>
                            <input type="text" placeholder="Enter Campaign Objective Other" value={formData.campaign_objective_other} name='campaign_objective_other' onChange={handleChange} className={`w-full bg-white border ${errors.campaign_objective_other ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 focus:outline-none focus:border-[#675FFF]`} />
                            {errors.campaign_objective_other && <p className='my-1 text-[#FF3B30]'>{errors.campaign_objective_other}</p>}
                        </div>}

                        <div>
                            <label className="block text-sm font-medium mb-1">CTA Type</label>
                            <Dropdown
                                name="cta_type"
                                options={ctaTypeOptions}
                                value={formData.cta_type}
                                onChange={(updated) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        cta_type: updated,
                                        url: "",
                                        calender_choosed: "",
                                        file: ""
                                    }))
                                    setErrors((prev) => ({ ...prev, cta_type: "" }))
                                }
                                }
                                placeholder="Select"
                            />
                            {errors.cta_type && <p className='my-1 text-[#FF3B30]'>{errors.cta_type}</p>}
                        </div>
                        {renderCTAField()}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative" ref={targetListRef}>
                                <label className="block text-sm font-medium mb-1">List Of Target</label>
                                <button
                                    onClick={() => setShowListTargetSelector((prev) => !prev)}
                                    className={`w-full flex items-center justify-between focus:outline-none focus:border-[#675FFF] bg-white border ${errors.list_of_target ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 cursor-pointer`}
                                >
                                    <span className={`truncate ${formData.list_of_target?.length > 0 ? 'text-[#1E1E1E]' : 'text-[#5A687C]'}`}>{formData.list_of_target?.length > 0
                                        ? formData.list_of_target.map(dayKey => {
                                            const found = contactLists?.length > 0 && contactLists.find(d => d.key === dayKey);
                                            return found?.label;
                                        }).join(', ')
                                        : 'Select'}</span>
                                    <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${showListTargetSelector ? 'transform rotate-180' : ''}`} />
                                </button>
                                {showListTargetSelector && (
                                    <div className="absolute z-50 mt-1 w-full">
                                        <CustomSelector
                                            options={contactLists?.length > 0 && contactLists}
                                            setShowSelector={setShowListTargetSelector}
                                            value={formData.list_of_target}
                                            onChange={(updated) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    list_of_target: updated,
                                                }))
                                                setErrors((prev) => ({ ...prev, list_of_target: "" }))
                                            }
                                            }
                                            ref={targetListRef}
                                        />
                                    </div>
                                )}
                                {errors.list_of_target && <p className='my-1 text-[#FF3B30]'>{errors.list_of_target}</p>}
                                <p className="text-sm mt-1 ">Estimated Segment Size: 12</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Desired Tone</label>
                                <Dropdown
                                    name="desired_tone"
                                    options={toneOptions}
                                    value={formData.desired_tone}
                                    onChange={(updated) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            desired_tone: updated,
                                        }))
                                        setErrors((prev) => ({ ...prev, desired_tone: "" }))
                                    }
                                    }
                                    placeholder="Select"
                                />
                                {errors.desired_tone && <p className='my-1 text-[#FF3B30]'>{errors.desired_tone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Language</label>
                                <Dropdown
                                    name="language"
                                    options={languageOptions}
                                    value={formData.language}
                                    onChange={(updated) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            language: updated,
                                        }))
                                        setErrors((prev) => ({ ...prev, language: "" }))
                                    }
                                    }
                                    placeholder="Select"
                                />
                                {errors.language && <p className='my-1 text-[#FF3B30]'>{errors.language}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">Send Time Window</label>
                                <button
                                    onClick={() => setShowTimeSelector((prev) => !prev)}
                                    className={`w-full flex justify-between items-center bg-white focus:border-[#675FFF] border ${errors.send_time_window ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 cursor-pointer`}
                                >
                                    <span  className={`${formData.send_time_window ? 'text-[#1E1E1E]' : 'text-[#5A687C]'}`}>{formData.send_time_window || "Select Time"}</span>
                                    <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${showTimeSelector ? 'transform rotate-180' : ''}`} />
                                </button>
                                {showTimeSelector && (
                                    <div className="absolute z-50 mt-1 w-full">
                                        <TimeSelector
                                            initialTime={formData.send_time_window}
                                            onSave={handleTimeSelect}
                                            onCancel={() => setShowTimeSelector(false)}
                                            start_date={formData.start_date}
                                        />
                                    </div>
                                )}
                                {errors.send_time_window && <p className='my-1 text-[#FF3B30]'>{errors.send_time_window}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Date</label>
                                <input
                                    type="date"
                                    min={format(new Date(), 'yyyy-MM-dd')}
                                    value={formData.start_date}
                                    onChange={(e) => {
                                        const selectedDate = new Date(e.target.value);
                                        if (isValid(selectedDate)) {
                                            setFormData((prev) => ({
                                                ...prev, start_date: format(selectedDate, 'yyyy-MM-dd'),
                                                send_time_window: ""
                                            }))
                                            setErrors((prev) => ({ ...prev, start_date: "" }))
                                        } else {
                                            setFormData((prev) => ({ ...prev, start_date: "" }))
                                        }

                                    }
                                    }
                                    className={`w-full ${formData.start_date ? 'text-[#1E1E1E]' : 'text-[#5A687C]'} bg-white border ${errors.start_date ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 focus:outline-none focus:border-[#675FFF]`}
                                />
                                {errors.start_date && <p className='my-1 text-[#FF3B30]'>{errors.start_date}</p>}
                            </div>
                            <div className="relative" ref={frequencyDaysRef}>
                                <label className="block text-sm font-medium mb-1">Frequency</label>
                                <button
                                    onClick={() => setShowWeekSelector((prev) => !prev)}
                                    className={`w-full flex justify-between items-center bg-white border truncate ${errors.frequency ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:border-[#675FFF]`}
                                >
                                    <span className={`truncate ${formData.frequency?.length > 0 ? 'text-[#1E1E1E]' : 'text-[#5A687C]'}`}>{formData.frequency?.length > 0
                                        ? formData.frequency.map(dayKey => {
                                            const found = daysOptions.find(d => d.key === dayKey);
                                            return found?.label;
                                        }).join(', ')
                                        : 'Select Days'}</span>
                                    <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${showWeekSelector ? 'transform rotate-180' : ''}`} />
                                </button>
                                {showWeekSelector && (
                                    <div className="absolute z-50 mt-1 w-full">
                                        <CustomSelector
                                            options={daysOptions}
                                            setShowSelector={setShowWeekSelector}
                                            value={formData.frequency}
                                            onChange={(updated) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    frequency: updated,
                                                }))
                                                setErrors((prev) => ({ ...prev, frequency: "" }))
                                            }
                                            }
                                            ref={frequencyDaysRef}
                                        />
                                    </div>
                                )}
                                {errors.frequency && <p className='my-1 text-[#FF3B30]'>{errors.frequency}</p>}
                            </div>
                        </div>

                        <div className='flex flex-col gap-5'>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Include branding (Brain AI)?</label>
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
                                    onClick={() => setFormData((prev) => ({ ...prev, include_brainai: !formData.include_brainai }))}
                                    className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${formData.include_brainai ? "bg-[#7065F0]" : "bg-[#E1E4EA]"}`}
                                >
                                    <span
                                        className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${formData.include_brainai ? "translate-x-5" : "translate-x-0.5"}`}
                                    ></span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Custom prompt for AI</label>
                            <textarea value={formData.custom_prompt} name='custom_prompt' onChange={handleChange} placeholder="e.g. Write a re-engagement email for cold leads about my AI training offer" className={`w-full bg-white border ${errors.custom_prompt ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded px-3 py-2 resize-none focus:outline-none focus:border-[#675FFF]`} rows={3}></textarea>
                            {errors.custom_prompt && <p className='my-1 text-[#FF3B30]'>{errors.custom_prompt}</p>}
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
                                    name="text_length"
                                    options={wordOptions}
                                    value={formData.text_length}
                                    onChange={(updated) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            text_length: updated,
                                        }))
                                        setErrors((prev) => ({ ...prev, text_length: "" }))
                                    }
                                    }
                                    placeholder="Select"
                                />
                                {errors.text_length && <p className='my-1 text-[#FF3B30]'>{errors.text_length}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Products/Service to feature</label>
                                <input type="text" value={formData.product_or_service_feature} name='product_or_service_feature' onChange={handleChange} placeholder="Enter Products/Service to feature" className={`w-full bg-white border ${errors.product_or_service_feature ? 'border-[#FF3B30]' : 'border-[#E1E4EA]'} rounded-lg px-3 py-2 focus:outline-none focus:border-[#675FFF]`} />
                                {errors.product_or_service_feature && <p className='my-1 text-[#FF3B30]'>{errors.product_or_service_feature}</p>}
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
                                onClick={() => setFormData((prev) => ({ ...prev, review: !formData.review }))}
                                className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${formData.review ? "bg-[#7065F0]" : "bg-[#E1E4EA]"}`}
                            >
                                <span
                                    className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${formData.review ? "translate-x-5" : "translate-x-0.5"}`}
                                ></span>
                            </button>
                        </div>
                        {/* <p className='text-sm text-gray-500 -mt-4'>You receive a notification 24h before sending to review and approve the email.</p>

                        <div className="bg-orange-100 text-sm text-black rounded-md px-4 py-2">
                            You'll be able to review and edit each email 24 hours before it's sent, directly from your calendar.
                        </div> */}

                        <div className="flex gap-4 pt-4">
                            {isEdit ? <button disabled={updateStatus} className="px-4 font-[500] w-[200px] py-2 bg-[#675FFF] text-white rounded-lg" onClick={() => handleUpdate(false)}>{updateStatus ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Update Campaign"}</button> :
                                <button disabled={submitStatus} className="px-4 font-[500] w-[200px] py-2 bg-[#675FFF] text-white rounded-lg" onClick={() => handleSubmit(false)}>{submitStatus ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Launch Campaign"}</button>}
                            {isEdit ? <button disabled={updateSaveDraftStatus} className="px-4 font-[500] w-[200px] py-2 border text-[#5A687C] border-[#E1E4EA] rounded-lg" onClick={() => handleUpdate(true)}>{updateSaveDraftStatus ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Save As Draft"}</button> :
                                <button disabled={saveDraftStatus} className="px-4 font-[500] w-[200px] py-2 border text-[#5A687C] border-[#E1E4EA] rounded-lg" onClick={() => handleSubmit(true)}>{saveDraftStatus ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Save As Draft"}</button>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CampaignsTable;