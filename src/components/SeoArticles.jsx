import { useEffect, useRef, useState } from "react"
import { DateFormat } from "../utils/TimeFormat"
import { Delete, DownloadIcon, EyeIcon, ThreeDots } from "../icons/icons"
import GenerateSeoArticle from "./GenerateSeoArticle"
import { useTranslation } from "react-i18next";
import DailyPromptIcon from "../assets/svg/DailyPromptIcon.svg"
import { ChevronDown } from "lucide-react"
import { useSelector } from "react-redux"


function SeoArticles() {
    const [articleData, setArticleData] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [generateSeoArticleOpen, setGenerateSeoArticleOpen] = useState(false)
    const [showBanner, setShowBanner] = useState(true)
    const [selectedLanguage] = useState("English")
    const moreActionsRef = useRef()
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


    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <>
            {!generateSeoArticleOpen ? <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 w-full">
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
                                    <h1 className="text-base md:text-xl font-[600] text-[#1E1E1E]">
                                        Daily prompt generation
                                    </h1>
                                    <p className="mt-1 text-sm sm:text-[16px] text-[#5A687C]">
                                        We&apos;ll automatically generate personalized prompts every day. Set your preferred language below to get started.
                                    </p>
                                </div>
                                <div className="mt-3 flex items-center gap-3">
                                    <span className="text-sm font-medium text-[#808591]">
                                        Language
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
                    <h2 className="font-[600] text-lg sm:text-2xl text-[#1E1E1E]">
                        Hi,{" "}
                        <span className="text-[#020202]">
                            {userDetails?.user?.firstName}
                        </span>
                    </h2>
                    <p className="font-[400] text-[13px] sm:text-[16px] text-[#5A687C]">
                        See how ecosystem.ai platform in AI conversations
                    </p>
                </div>
            </div> :
                <GenerateSeoArticle setGenerateSeoArticleOpen={setGenerateSeoArticleOpen} />
            }
        </>
    )
}

export default SeoArticles
