import { useEffect, useRef, useState } from "react"
import { DateFormat } from "../utils/TimeFormat"
import { Delete, DownloadIcon, EyeIcon, Ellipsis } from "../icons/icons"
import GenerateSeoArticle from "./GenerateSeoArticle"
import { useTranslation } from "react-i18next";
import DailyPromptIcon from "../assets/svg/DailyPromptIcon.svg"
import { ChevronDown, Info, Plus, X, Sparkles, FileText } from "lucide-react"
import { useSelector } from "react-redux"
import ChatgptLogo from '../assets/svg/Chatgpt.svg'
import GeminiLogo from '../assets/svg/Gemini.svg'
import DeepseekLogo from '../assets/svg/Deepseek.svg'
import PerplexityLogo from '../assets/svg/Perplexity.svg'
import ClaudeLogo from '../assets/svg/Claude.svg'
import ChatFileIcon from '../assets/svg/ChatFile.svg'


import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);


function SeoArticles() {
    const [articleData, setArticleData] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [generateSeoArticleOpen, setGenerateSeoArticleOpen] = useState(false)
    const [showBanner, setShowBanner] = useState(true)
    const [selectedLanguage] = useState("English")
    const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days")
    const [selectedView, setSelectedView] = useState("Overall")
    const [activeTab, setActiveTab] = useState("prompts")
    const [showAddPromptModal, setShowAddPromptModal] = useState(false)
    const [promptText, setPromptText] = useState("")
    const [selectedPersona, setSelectedPersona] = useState("Default User")
    const [selectedModel, setSelectedModel] = useState("")
    const [allConversations, setAllConversations] = useState(false)
    const [percentage, setPercentage] =  useState(0)
    const [shareOfVoiceData, setShareOfVoiceData] = useState([]);
    const moreActionsRef = useRef()

    // Model logo mapping
    const modelLogos = {
        'Chatgpt': ChatgptLogo,
        'Gemini': GeminiLogo,
        'Deepseek': DeepseekLogo,
        'Perplexity': PerplexityLogo,
        'Claude Code': ClaudeLogo,
        'Gemini CLI': GeminiLogo,
        'Claude': ClaudeLogo,
    }

    // Dummy prompts data
    const promptsData = [
        {
            id: 1,
            prompt: "How can I automate lead generation inside my CRM without writing any code?",
            models: ['Chatgpt', 'Gemini', 'Deepseek'],
            creationDate: "27 Mar 2025"
        },
        {
            id: 2,
            prompt: "How can I automate lead generation inside my CRM without writing any code?",
            models: ['Chatgpt', 'Gemini', 'Deepseek'],
            creationDate: "26 Mar 2025"
        },
        {
            id: 3,
            prompt: "How can I automate lead generation inside my CRM without writing any code?",
            models: ['Chatgpt', 'Gemini', 'Deepseek'],
            creationDate: "20 Mar 2025"
        },
        {
            id: 4,
            prompt: "How can I automate lead generation inside my CRM without writing any code?",
            models: ['Chatgpt', 'Gemini', 'Deepseek'],
            creationDate: "18 Mar 2025"
        },
        {
            id: 5,
            prompt: "How can I automate lead generation inside my CRM without writing any code?",
            models: ['Chatgpt', 'Gemini', 'Deepseek'],
            creationDate: "16 Mar 2025"
        }
    ]

    // Dummy citations data
    const newCitedContent = [
        {
            id: 1,
            title: "19+ Lead Generation Tools for 2025",
            firstSeen: "20/11/2025",
            citedCount: 32,
            chatCount: 19
        },
        {
            id: 2,
            title: "Automating Lead Capture: Practical Guide",
            firstSeen: "20/11/2025",
            citedCount: 32,
            chatCount: 19
        },
        {
            id: 3,
            title: "20 Tools to Scale Prospecting Efficiently",
            firstSeen: "20/11/2025",
            citedCount: 32,
            chatCount: 19
        },
        {
            id: 4,
            title: "Prospecting Automation: Complete Guide",
            firstSeen: "20/11/2025",
            citedCount: 32,
            chatCount: 19
        }
    ]

    const topCitedContent = [
        { url: "youtube.com/watch...", count: 32 },
        { url: "evaboot.com/...lead-generation-leads", count: 28 },
        { url: "snaplogic.com/...maximize-full-potential", count: 26 },
        { url: "landingi.com/...specialists-marketing", count: 24 },
        { url: "monsieurlazare.blog/...prospecting-guide", count: 22 },
        { url: "purpleplanet.com/...automation", count: 19 },
        { url: "leadaffy.com/...cold-email-deep-dive", count: 14 }
    ]
    const { t } = useTranslation();
    const userDetails = useSelector((state) => state.profile)

    const staticData = [
        {
            id: 1,
            article_title: `${t("sandro.ethical_changes")}`,
            date: new Date(),
        },
        {
            id: 2,
            article_title: `${t("sandro.ethical_changes")}`,
            date: new Date(),
        }
    ]
    useEffect(() => {
        setTimeout(() => {
            setArticleData(staticData)
        }, 3000)
    }, [])

    useEffect(() => {
        if (articleData?.length > 0) {
            setLoading(false)
        }
    }, [articleData])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const START_DATE = new Date("2025-12-10");
        const now = new Date();
    
        const diffInMs = now - START_DATE;
        const weeksPassed = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    
        const cappedWeeks = Math.min(weeksPassed, 9);
    
        setPercentage(Math.min(weeksPassed, 100));
    
        const generatedData = Array.from({ length: 9 }, (_, index) =>
            index < cappedWeeks ? index + 1 : 0
        );
    
        setShareOfVoiceData(generatedData);
    }, []);


    // Dummy data for Share of Voice chart - Overall view
    const overallChartData = {
        labels: ['1/3', '2/3', '3/3', '4/3', '5/3', '6/3', '7/3', '8/3', '9/3'],
        datasets: [
            {
                label: t("geo.share_of_voice"),
                data: shareOfVoiceData,
                borderColor: '#675FFF',
                backgroundColor: 'rgba(103, 95, 255, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointBackgroundColor: '#675FFF',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    };

    // Dummy data for Share of Voice chart - Per engine view
    const perEngineChartData = {
        labels: ['1/3', '2/3', '3/3', '4/3', '5/3', '6/3', '7/3', '8/3', '9/3'],
        datasets: [
            {
                label: t("geo.chatgpt"),
                data: shareOfVoiceData,
                borderColor: '#22C55E', // Green
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: false,
                tension: 0.4,
                pointRadius: 0,
                pointBackgroundColor: '#22C55E',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
            {
                label: t("geo.deepseek"),
                data: [28, 26, 24, 26, 30, 32, 30, 28, 26],
                borderColor: '#3B82F6', // Blue
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4,
                pointRadius: 0,
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
            {
                label: t("geo.gemini"),
                data: [14, 10, 12, 18, 16, 14, 18, 20, 18],
                borderColor: '#06B6D4', // Cyan/Light blue
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                fill: false,
                tension: 0.4,
                pointRadius: 0,
                pointBackgroundColor: '#06B6D4',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
            {
                label: t("geo.perplexity"),
                data: [6, 5, 4, 5, 6, 7, 6, 5, 5],
                borderColor: '#F97316', // Orange
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                fill: false,
                tension: 0.4,
                pointRadius: 0,
                pointBackgroundColor: '#F97316',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    };

    // Use appropriate chart data based on selected view
    const chartData = selectedView === t("geo.per_engine") ? perEngineChartData : overallChartData;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: selectedView === t("geo.per_engine"),
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        size: 12,
                        weight: 400,
                    },
                    color: '#5A687C',
                },
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#1E1E1E',
                bodyColor: '#5A687C',
                borderColor: '#E1E4EA',
                borderWidth: 1,
                padding: 12,
                displayColors: selectedView === t("geo.per_engine"),
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#5A687C',
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                grid: {
                    color: '#F0F0F0',
                },
                ticks: {
                    color: '#5A687C',
                    font: {
                        size: 12,
                    },
                },
                beginAtZero: true,
            },
        },
    };

    // Dummy data for Industry Ranking
    const industryRanking = [
        { id: 1, name: 'HubSpot', percentage: 63.6, badgeColor: '#FF7A59' },
        { id: 2, name: 'Zapier', percentage: 56.1, badgeColor: '#FF4A00' },
        { id: 3, name: 'Salesforce', percentage: 55.1, badgeColor: '#00A1E0' },
        { id: 4, name: 'Pipedrive', percentage: 46.7, badgeColor: '#2BBF6A' },
        { id: 5, name: 'Mailchimp', percentage: 42.3, badgeColor: '#FFE01B' },

    ];


    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <>
            {!generateSeoArticleOpen ? <div className="p-12 h-full overflow-auto flex flex-col gap-4 w-full">
                {/* Daily prompt header banner */}
                {showBanner && (
                    <div className="bg-white border border-[#E1E4EA] rounded-2xl px-4 sm:px-5 py-3 sm:py-4 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[#675FFF] flex-shrink-0">
                                <img
                                    src={DailyPromptIcon}
                                    alt="Daily Prompt"
                                    className="w-5 h-5 object-contain"
                                    style={{ filter: 'brightness(0) invert(1)' }}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div>
                                    <h1 className="text-[22px] font-[500] text-[#1E1E1E]">
                                        {t("geo.daily_prompt_generation")}
                                    </h1>
                                    <p className="mt-1 text-[14px] font-[400] text-[#5A687C]">
                                        {t("geo.daily_prompt_description")}
                                    </p>
                                </div>
                                <div className="mt-3 flex items-center gap-3">
                                    <span className="text-sm font-medium text-[#808591]">
                                        {t("geo.language")}
                                    </span>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E1E4EA] bg-white text-xs sm:text-sm text-[#1E1E1E] hover:bg-[#F8F9FB] cursor-pointer shadow-sm"
                                    >
                                        <span className="text-base">🌐</span>
                                        <span>{selectedLanguage}</span>
                                        <ChevronDown className="w-3 h-3 text-[#5A687C]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowBanner(false)}
                            className="mt-1 text-[#9CA3AF] hover:text-[#4B5563] text-base cursor-pointer flex-shrink-0"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Greeting below banner */}
                <div className="flex flex-col text-start gap-1 pt-2 px-4">
                    <h2 className="text-[22px] font-[500] text-[#1E1E1E]">
                        {t("geo.hi")}{" "}
                        <span className="text-[#020202]">
                            {userDetails?.user?.firstName}
                        </span>
                    </h2>
                    <p className="text-[14px] font-[400] text-[#5A687C]">
                        {t("geo.see_how_ecosystem")}
                    </p>
                </div>

                {/* Line Chart + Industry Ranking row */}
                <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-3 pt-4 ">
                    {/* Share of Voice Overtime Chart */}
                    <div className="bg-white border border-[#D6D6D6] rounded-2xl p-6 h-[420px]">
                        <div className="mb-4">
                            <div className="flex items-start justify-between gap-4">
                                {/* Left: value + subtitle */}
                                <div>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <h2 className="text-[20px] font-[500] text-[#1E1E1E]">{percentage}%</h2>
                                        <Info className="w-4 h-4 text-[#5A687C]" />
                                    </div>
                                    <p className="text-[14px] text-[#5A687C]">
                                        {t("geo.showing_share_of_voice")}
                                    </p>
                                </div>

                                {/* Right: chart controls */}
                                <div className="flex items-center gap-3 flex-nowrap">
                                    <div className="relative">
                                        <select
                                            value={selectedPeriod}
                                            onChange={(e) => setSelectedPeriod(e.target.value)}
                                            className="appearance-none bg-white border border-[#E1E4EA] rounded-lg px-4 py-2 pr-8 text-sm text-[#1E1E1E] cursor-pointer focus:outline-none focus:border-[#675FFF]"
                                        >
                                            <option>{t("geo.last_30_days")}</option>
                                            <option>{t("geo.last_7_days")}</option>
                                            <option>{t("geo.last_90_days")}</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#5A687C] pointer-events-none" />
                                    </div>
                                    {/* Toggle slider for Overall / Per engine */}
                                    <div className="inline-flex items-center bg-[#F3F4F6] rounded-lg p-1 ">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedView(t("geo.overall"))}
                                            className={`px-4 py-1.5 rounded-lg text-sm font-[600] cursor-pointer transition-all ${selectedView === t("geo.overall")
                                                ? "bg-white text-[#111827] shadow-sm"
                                                : "bg-transparent text-[#9CA3AF]"
                                                }`}
                                        >
                                            {t("geo.overall")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedView(t("geo.per_engine"))}
                                            className={`px-4 py-1.5 rounded-lg text-sm font-[500] cursor-pointer transition-all ${selectedView === t("geo.per_engine")
                                                ? "bg-white text-[#111827] shadow-sm"
                                                : "bg-transparent text-[#9CA3AF]"
                                                }`}
                                        >
                                            {t("geo.per_engine")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="h-[300px]">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Industry Ranking */}
                    <div className="bg-white border border-[#D6D6D6] rounded-2xl p-6 h-[420px]">
                        <div className="mb-4">
                            <h2 className="text-[20px] font-[500] text-[#1E1E1E] mb-1">{t("geo.industry_ranking")}</h2>
                            <p className="text-[14px] font-[400] text-[#5A687C] mb-4">
                                {t("geo.top_mentioned_brands")}
                            </p>
                        </div>

                        {/* Ranking List */}
                        <div className="">
                            {industryRanking.map((brand) => (
                                <div
                                    key={brand.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8F9FB] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: brand.badgeColor }}
                                        />
                                        <span className="text-[16px] font-[500] text-[#1E1E1E]">
                                            {brand.name}
                                        </span>
                                    </div>
                                    <span className="text-[16px] font-[500] text-[#1E1E1E]">
                                        {brand.percentage}%
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#E1E4EA]">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="border border-[#D6D6D6] text-[#000000] rounded-lg bg-white opacity-50 cursor-not-allowed flex items-center gap-1 px-2 py-1 text-sm"
                                >
                                    <span className="text-sm">‹</span>
                                    <span className="text-sm">{t("geo.prev")}</span>
                                </button>

                                <button
                                    type="button"
                                    className="bg-[#675FFF] text-white rounded-lg px-3 py-1 text-sm cursor-pointer"
                                >
                                    1
                                </button>
                                <button 
                                    type="button"
                                    className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer"
                                >
                                    2
                                </button>

                                <span className="text-[#000000] text-sm">…</span>
                                <button
                                    type="button"
                                    className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer"
                                >
                                    10
                                </button>
                                <button
                                    type="button"
                                    className="border border-[#D6D6D6] text-[#000000] rounded-lg bg-white opacity-50 cursor-not-allowed flex items-center gap-1 px-2 py-1 text-sm"
                                >

                                    <span className="text-sm">{t("geo.next")}</span>
                                    <span className="text-sm">›</span>
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Prompts/Citations Section */}
                <div className="pt-4">
                    {/* Tabs – slider switch style */}
                    <div className="flex mb-6">
                        <div className="inline-flex items-center  bg-[#F2F2F3]  border border-[#E6E6E7] rounded-lg p-0.5">
                            <button
                                type="button"
                                onClick={() => setActiveTab("prompts")}
                                className={`px-4 py-1.5 rounded-lg text-sm font-[600] transition-all cursor-pointer ${activeTab === "prompts"
                                        ? "bg-white text-[#111827] shadow-sm border cursor-pointer border-[#D6D6D6]"
                                        : "bg-transparent text-[#9CA3AF]"
                                    }`}
                            >
                                {t("geo.prompts")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("citations")}
                                className={`px-4 py-1.5 rounded-lg text-sm font-[500] transition-all cursor-pointer ${activeTab === "citations"
                                        ? "bg-white text-[#111827] shadow-sm border  border-[#D6D6D6]"
                                        : "bg-transparent text-[#9CA3AF]"
                                    }`}
                            >
                                {t("geo.citations")}
                            </button>
                        </div>
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === "prompts" ? (
                        /* Prompts Table Section */
                        <div className="">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <h2 className="text-[20px] font-[500] text-[#1E1E1E] mb-1">
                                        {t("geo.industry_ranking")}
                                    </h2>
                                    <p className="text-[14px] font-[400] text-[#5A687C]">
                                        {t("geo.prompts_description")}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] font-[500] text-sm hover:bg-[#F8F9FB] transition-colors cursor-pointer">
                                        {t("geo.view_all")}
                                    </button>
                                    <button
                                        onClick={() => setShowAddPromptModal(true)}
                                        className="flex items-center gap-2 px-3 py-2 bg-[#675FFF] rounded-lg text-white font-[500] text-sm hover:bg-[#5A4FE6] transition-colors cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>{t("geo.add_prompt")}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Prompts Table */}
                            <div className="rounded-2xl border border-[#D6D6D6] overflow-auto mb-2 w-full">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-separate border-spacing-0">
                                        <thead className="bg-[#F7F7F8]">
                                            <tr className="text-[#5A687C]">
                                                <th className="px-6 text-start py-2 text-[14px] font-[400]">{t("geo.prompts")}</th>
                                                <th className="px-3 text-start py-2 text-[14px] font-[400]">{t("geo.model")}</th>
                                                <th className="px-3 text-start py-2 text-[14px] font-[400]">{t("geo.creation_date")}</th>
                                                <th className="px-6 text-center py-2 text-[14px] font-[400]">{t("geo.action")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">

                                            {promptsData.map((prompt) => (
                                                <tr key={prompt.id} className="text-[16px] text-[#1E1E1E]">
                                                    <td className="px-6 py-2 text-[14px] text-[#1E1E1E] font-[400] text-start">
                                                        {prompt.prompt}
                                                    </td>
                                                    <td className="px-3 py-2 text-[16px] text-start">
                                                        <div className="flex items-center gap-1">
                                                            {prompt.models.map((model, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={modelLogos[model]}
                                                                    alt={model}
                                                                    className="w-5 h-5 rounded-full"
                                                                />
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 text-[14px] text-start font-[400]">
                                                        {prompt.creationDate}
                                                    </td>
                                                    <td className="px-6 py-2 text-center whitespace-nowrap">
                                                        <div className='flex items-center justify-center'>
                                                            <button className="p-2 rounded-lg relative">
                                                                <div className='bg-white cursor-pointer border border-[#D6D6D6] shadow-sm p-1.5 rounded-xl'><Ellipsis /></div>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-between bg-[#F7F7F8] px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white opacity-50 cursor-not-allowed">
                                            ‹ {t("geo.prev")}
                                        </button>
                                        <button className="bg-[#675FFF] text-white rounded-lg px-3 py-1 text-sm cursor-pointer">
                                            1
                                        </button>
                                        <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer">
                                            2
                                        </button>
                                        <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer">
                                            3
                                        </button>
                                        <span className="text-[#000000] text-sm">…</span>
                                        <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm hover:bg-white cursor-pointer">
                                            10
                                        </button>
                                        <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer">
                                            {t("geo.next")} ›
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#5A687C]">
                                        <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] bg-white cursor-pointer">5 {t("geo.rows")}</button>
                                        <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] hover:bg-white cursor-pointer">10</button>
                                        <button className="border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] hover:bg-white cursor-pointer">20</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Citations Section */
                        <div className="">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white border border-[#D6D6D6] rounded-2xl overflow-hidden">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-[#E1E4EA]">
                                        <div>
                                            <h2 className="text-xl font-[500] text-[#1E1E1E] mb-1">
                                                {t("geo.new_cited_content")}
                                            </h2>
                                            <p className="text-sm text-[#5A687C]">
                                                {t("geo.new_cited_content_description")}
                                            </p>
                                        </div>
                                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] font-[500] text-sm hover:bg-[#F8F9FB] transition-colors cursor-pointer">
                                            {t("geo.view_all")}
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        {newCitedContent.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F8F9FB] transition-colors"
                                            >
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <img src={ChatFileIcon} alt="File" className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">


                                                    {/* Row 1: Items + Cited Count */}
                                                    <div className="flex justify-between text-xs text-[#5A687C] mb-1">
                                                        <h3 className="text-[14px] font-[500] text-[#1E1E1E] mb-1">
                                                            {item.title}
                                                        </h3>
                                                        <span className="text-[14px] font-[500] text-black">{item.citedCount}</span>
                                                    </div>

                                                    {/* Row 2: First Seen + Chat Count */}
                                                    <div className="flex justify-between text-xs text-[#5A687C]">
                                                        <span className="text-[14px] font-[500]">{t("geo.first_seen")} {item.firstSeen}</span>
                                                        <span className="text-[14px] font-[500]">{item.chatCount} {t("geo.chats")}</span>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>


                                <div className="bg-white border border-[#D6D6D6] rounded-2xl overflow-hidden">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-[#E1E4EA]">
                                        <div>
                                            <h2 className="text-xl font-[500] text-[#1E1E1E] mb-1">
                                                {t("geo.top_cited_content")}
                                            </h2>
                                            <p className="text-sm text-[#5A687C]">
                                                {t("geo.top_cited_content_description")}
                                            </p>
                                        </div>
                                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E1E4EA] rounded-xl text-[#1E1E1E] font-[500] text-sm hover:bg-[#F8F9FB] transition-colors cursor-pointer">
                                            {t("geo.view_all")}
                                        </button>
                                    </div>

                                    {/* Bars */}
                                    <div className="p-6 space-y-3">
                                        {topCitedContent.map((item, index) => {
                                            const maxCount = Math.max(...topCitedContent.map((i) => i.count));
                                            const percentage = (item.count / maxCount) * 100;

                                            return (
                                                <div key={index} className="w-full flex items-center gap-3">
                                                    <div
                                                        className="bg-[#22C55E] rounded-lg px-4 py-2 text-white"
                                                        style={{ width: `${percentage}%` }}
                                                    >
                                                        <span className="text-[14px] truncate">
                                                            {item.url}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-[600] text-[#111827]">
                                                        {item.count}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div> :
                <GenerateSeoArticle setGenerateSeoArticleOpen={setGenerateSeoArticleOpen} />
            }

            {/* Add Prompt Modal */}
            {showAddPromptModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-4">
                    <div className="bg-white rounded-2xl w-full max-w-[600px] relative shadow-lg my-auto max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#E1E4EA]">
                            <h2 className="text-[20px] font-[500] text-[#1E1E1E]">{t("geo.add_creation_studio")}</h2>
                            <button
                                onClick={() => setShowAddPromptModal(false)}
                                className="text-[#5A687C] hover:text-[#1E1E1E] cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="px-6 py-4">

                            {/* Prompts Section */}
                            <div className="">
                                <div className="flex items-center gap-2 mb-4 bg-[#F7F7F8] border border-[#D6D6D6] rounded-md">
                                    <button className="px-3 py-1.5 text-[#1E1E1E] rounded-lg text-sm font-[500] flex items-center gap-2">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.375 3.75L4.6875 5.0625L3.375 6.375M6 6.375H7.5M0.75 0.75H13.125V13.125H0.75V0.75Z" stroke="#070707" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{t("geo.prompts_label")} 1</span>
                                    </button>
                                </div>
                                <div className="">
                                    <label className="text-sm font-[500] text-[#1E1E1E] mb-2 flex items-center gap-2">
                                        <span>{t("geo.prompts_label")}</span>
                                    </label>
                                    <div className="relative border border-[#E1E4EA] rounded-lg focus-within:border-[#675FFF]">
                                        <textarea
                                            value={promptText}
                                            onChange={(e) => setPromptText(e.target.value)}
                                            placeholder={t("geo.prompts_placeholder")}
                                            className="w-full px-4 py-3 pb-12 rounded-lg resize-none focus:outline-none text-sm min-h-[80px]"
                                        />
                                        <div className="absolute bottom-3 left-3">
                                            <button className="flex items-center gap-1.5 px-1 text-[#675FFF] font-[500] text-sm hover:bg-[#F1EEFF] rounded-lg transition-colors cursor-pointer">
                                                <Sparkles className="w-4 h-4" />
                                                <span>{t("geo.generate")}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Persona Section */}
                            <div className="mb-3">
                                <label className="block text-sm font-[500] text-[#1E1E1E] mb-2">
                                    {t("geo.persona")}
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedPersona}
                                        onChange={(e) => setSelectedPersona(e.target.value)}
                                        className="appearance-none w-full px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-sm text-[#1E1E1E] cursor-pointer focus:outline-none focus:border-[#675FFF]"
                                    >
                                        <option>{t("geo.default_user")}</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#5A687C] pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex gap-3 mb-4">

                                <button className="flex items-center gap-2 px-2 py-1.5 bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] font-[500] text-sm hover:bg-[#F8F9FB] transition-colors cursor-pointer">
                                    <Plus className="w-4 h-4" />
                                    <span>{t("geo.add_prompt_button")}</span>
                                </button>
                            </div>

                            {/* Model Section */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3 bg-[#F7F7F8] border border-[#D6D6D6] py-1.5 px-2 rounded-md">
                                    <Sparkles className="w-4 h-4 text-[#000000]" />
                                    <label className="block text-sm font-[500] text-[#1E1E1E]">{t("geo.model")}</label>

                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['Chatgpt', 'Gemini', 'Deepseek', 'Perplexity', 'Claude Code', 'Gemini CLI', 'Claude'].map((model) => (
                                        <button
                                            key={model}
                                            type="button"
                                            onClick={() => setSelectedModel(model)}
                                            className={`flex items-center cursor-pointer gap-2 px-3 py-1.5 rounded-2xl border border-[#D6D6D6] text-sm font-[500] transition-colors ${selectedModel === model
                                                    ? 'bg-[#675FFF] text-white'
                                                    : 'bg-white border border-[#E1E4EA] text-[#1E1E1E] hover:bg-[#F8F9FB]'
                                                }`}
                                        >
                                            <img
                                                src={modelLogos[model]}
                                                alt={model}
                                                className="w-4 h-4"
                                            />
                                            <span>{model}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* All Conversations Section */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between border border-[#D6D6D6] rounded-xl p-2">
                                    <div>
                                        <label className="block text-sm font-[500] text-[#1E1E1E] mb-1 ">
                                            {t("geo.all_conversations")}
                                        </label>
                                        <p className="text-xs text-[#5A687C]">
                                            {t("geo.all_conversations_description")}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAllConversations(!allConversations)}
                                        className={`w-10 h-5 rounded-full relative transition-colors duration-300 cursor-pointer ${allConversations ? "bg-[#675FFF]" : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`block w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${allConversations ? "translate-x-5" : "translate-x-0.5"
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-[#E1E4EA]">
                                <button
                                    onClick={() => setShowAddPromptModal(false)}
                                    className="px-4 py-1.5 font-[500] text-[14px] bg-white border border-[#E1E4EA] rounded-lg text-[#1E1E1E] hover:bg-[#F8F9FB] cursor-pointer"
                                >
                                    {t("geo.cancel")}
                                </button>
                                <button
                                    onClick={() => {
                                        // Handle save logic here
                                        setShowAddPromptModal(false);
                                    }}
                                    className="px-4 py-1.5 font-[500] text-[14px] bg-[#675FFF] rounded-lg text-white hover:bg-[#5A4FE6] cursor-pointer"
                                >
                                    {t("geo.save_prompts")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SeoArticles
