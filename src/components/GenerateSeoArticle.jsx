import { useEffect, useState } from "react";
import { SelectDropdown } from "./Dropdown";
import sandroImg from "../assets/svg/sandro_logo.svg"
import articleImg from "../assets/svg/seo_article_img.svg"
import { DislikeIcon, Duplicate, LikeIcon, SendIcon, SpeakerIcon } from "../icons/icons";

const articleStaticData = [
    {
        label: "Short article",
        content: "600 words: A quick, focused format idea/ for answering a specific question or targeting long-tail keyword searches."
    }, {
        label: "Medium article",
        content: "1200 words: A balanced format that allows you to dive deeper into a topic while staying accessible and SEO-friendly."
    }, {
        label: "Long article",
        content: "2000+ words- An expert-level format designed to rank on competitive topics and boost your site's authority."
    }
]

function GenerateSeoArticle({ setGenerateSeoArticleOpen }) {
    const [formData, setFormData] = useState({ article_language: '', no_of_images: 0, size_of_your_blog_post: "", keyword: "", writing_instructions: "" })
    const [errors, setErrors] = useState({})
    const [generateArticle, setGenerateArticle] = useState(false)
    const [loadingStatus, setLoadingStatus] = useState(0)

    useEffect(() => {
        let interval;
        if (generateArticle) {
            setLoadingStatus(0);
            interval = setInterval(() => {
                setLoadingStatus(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 30);
        }
        return () => clearInterval(interval);
    }, [generateArticle]);

    const languageOptions = [{ label: "English", key: "english" }, { label: "French", key: "french" }, { label: "Spanish", key: "spanish" }]
    const imageNumbersOptions = [0, 1, 2, 3, 4, 5].map((e) => ({
        label: e,
        key: e
    }))
    const blogPostOptions = [{ label: "Short article", key: "short_article" }, { label: "Medium article", key: "medium_article" }, { label: "Long article", key: "long_article" }]

    return (
        <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-3 w-full">
            <h1 className="text-[24px] font-[600] text-[#1E1E1E]">Generate an article </h1>
            <p className="text-[14px] font-[400] text-[#5A687C]">Write engaging articles effortlessly with artificial intelligence. Generate SEO-optimized content, ready to publish. </p>
            {!generateArticle ? <div div className="border border-[#E1E4EA] bg-white p-[24px] rounded-[10px] flex flex-col gap-[20px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-sm font-medium text-[#1e1e1e]">
                            Article language
                        </label>
                        <SelectDropdown
                            name="article_language"
                            options={languageOptions}
                            value={formData?.article_language}
                            onChange={(updated) => {
                                setFormData((prev) => ({
                                    ...prev, article_language: updated
                                }))
                                setErrors((prev) => ({
                                    ...prev, article_language: ""
                                }))
                            }}
                            placeholder="Select"
                            className=""
                            errors={errors}
                        />
                        {errors.article_language && <p className="text-red-500 text-sm mt-1">{errors.article_language}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-[#1e1e1e]">
                            Number Of images
                        </label>
                        <SelectDropdown
                            name="no_of_images"
                            options={imageNumbersOptions}
                            value={formData?.no_of_images}
                            onChange={(updated) => {
                                setFormData((prev) => ({
                                    ...prev, no_of_images: updated
                                }))
                                setErrors((prev) => ({
                                    ...prev, no_of_images: ""
                                }))
                            }}
                            placeholder="Select"
                            className=""
                            errors={errors}
                        />
                        {errors.no_of_images && <p className="text-red-500 text-sm mt-1">{errors.no_of_images}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-[#1e1e1e]">
                            Size of your blog post
                        </label>
                        <ul className="flex gap-[12px]">
                            {blogPostOptions.map((e) => (
                                <li key={e.key} onClick={() => setFormData((prev) => ({
                                    ...prev, size_of_your_blog_post: e.key
                                }))} className={`text-[14px] cursor-pointer font-[500] rounded-[4px] px-[20px] h-[40px] flex justify-center items-center border ${formData.size_of_your_blog_post === e.key ? 'text-[#675FFF] border-[#335CFF] bg-[#F5F7FF]' : 'border-[#E1E4EA] text-[#344054]'}`}>
                                    {e.label}
                                </li>
                            ))}
                        </ul>
                        {errors.keyword && <p className="text-red-500 text-sm mt-1">{errors.keyword}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-[#1e1e1e]">
                            Keywords
                        </label>
                        <input
                            value={formData.keyword}
                            name="keyword"
                            placeholder="Keywords"
                            className={`w-full text-[#1e1e1e] px-[12px] py-[8px] border bg-white rounded-[8px] focus:outline-none focus:border-[#675FFF] ${errors.keyword ? 'border-red-500' : 'border-[#E1E4EA]'}`}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev, article_language: e.target.value
                                }))
                                setErrors((prev) => ({
                                    ...prev, article_language: ""
                                }))
                            }}
                        />
                        {errors.keyword && <p className="text-red-500 text-sm mt-1">{errors.keyword}</p>}
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-[#1e1e1e]">
                        Here's what can help you choose the right article length:
                    </label>
                    <ul className="flex flex-col gap-1">
                        {articleStaticData.map((e) => (
                            <li key={e.label} className=" text-[16px] font-[400] text-[#5A687C]">
                                <span className="text-[#1E1E1E] underline">{e.label}</span> — {e.content}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-[#1e1e1e]">
                        Writing instructions
                    </label>
                    <textarea
                        rows={10}
                        placeholder="For example, ask Lou to write an SEO article that targets professionals, while keeping the tone accessible:

• Tone: professional but easy to read
• Structure: an introduction, 3 to 5 sections, and a conclusion
• Style: clear, concise, and free of unnecessary jargon
• Length: around 700 to 900 words
• Ending: include a call-to-action to encourage readers to learn more or contact the company"
                        value={formData.writing_instructions}
                        className={`w-full text-[#1e1e1e] px-[12px] py-[8px] resize-none border bg-white rounded-[8px] focus:outline-none focus:border-[#675FFF] ${errors.writing_instructions ? 'border-red-500' : 'border-[#E1E4EA]'}`}
                        onChange={(e) => {
                            setFormData((prev) => ({ ...prev, writing_instructions: e.target.value }))
                            setErrors((prev) => ({ ...prev, writing_instructions: '' }))
                        }}
                    />
                    {errors.writing_instructions && <p className="text-red-500 text-sm mt-1">{errors.writing_instructions}</p>}
                </div>
                <div>
                    <button
                        onClick={() => setGenerateArticle(true)}
                        className="bg-[#675FFF] cursor-pointer border border-[#5F58E8] text-white font-medium rounded-lg px-5 py-2 flex items-center gap-2"
                    >
                        Generate An Article
                    </button>
                </div>
            </div>
                : loadingStatus === 100 ? <div className="border border-[#E1E4EA] bg-white p-[24px] rounded-[10px] gap-[20px] flex flex-col">
                    <div className="flex items-center gap-2">
                        <div className="flex justify-center items-center">
                            <img src={sandroImg} alt={"sandro"} className="object-fit" />
                        </div>
                        <p className="text-[#5A687C] text-[12px] font-[600]">Here is your article</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[#1E1E1E] text-[24px] font-[600]">Les défis éthiques de Iiintelligence artificielle</p>
                        <div className="flex items-center gap-1">  <Duplicate />
                            <LikeIcon />
                            <DislikeIcon />
                            <SpeakerIcon />
                            <SendIcon /></div>
                    </div>
                    <div className="flex">
                        <img src={articleImg} alt={"article"} className="object-fit" />
                    </div>

                </div> : <div className="border border-[#E1E4EA] bg-white p-[24px] justify-center items-center rounded-[10px] flex flex-col h-full">
                    <div className="flex flex-col gap-3 items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center">
                                <img src={sandroImg} alt={"sandro"} className="object-fit" />
                            </div>
                            <p className="text-[#1E1E1E] text-[16px] font-[600]">Sandro is preparing your article...</p>
                        </div>
                        <div className="w-[500px] h-[14px] rounded-[40px] bg-[#D7D4FF]">
                            <div style={{ width: `${loadingStatus}%` }} className={`${loadingStatus === 100 ? 'rounded-[40px]' : 'rounded-l-[40px]'}  h-[14px] leading-none bg-[#675FFF]`} ></div>
                        </div>
                        <p className="text-[#5A687C] text-[14px] font-[400]">{loadingStatus}% Completed </p>
                    </div>
                </div>
            }

        </div >
    )
}

export default GenerateSeoArticle
