import { useEffect, useState } from "react"
import { SelectDropdown } from "./Dropdown"
import { useTranslation } from "react-i18next";
import { contentGenerationStatus, createContent } from "../api/contentCreationAgent";
import constanceImg from '../assets/svg/constance_logo.svg'
import Slider from "react-slick";

function CreationStudio() {
    const [formData, setFormData] = useState({ text: "", post_type: "", language: "", media_type: "", video_duration: "", author: "", created_at: new Date() })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation();
    const [generateContent, setGenerateContent] = useState({})
    const [loadingSteps, setLoadingSteps] = useState(0)
    const [contentId, setContentId] = useState("")

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
    const mediaTypeOptions = [{ label: `${t("constance.single_image")}`, key: "single_image" }, { label: `${t("constance.carousel")}`, key: "carousel" }, { label: `${t("constance.video")}`, key: "video" }]
    const languageOptions = [{ label: `${t("constance.eng")}`, key: "english" }, { label: `${t("constance.fr")}`, key: "french" }]
    const videoDurationOptions = [{ label: t("constance.short"), key: "short" }, { label: t("constance.long"), key: "long" }]


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
            const response = await createContent(formData)
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
                        <SelectDropdown
                            name="video_duration"
                            options={videoDurationOptions}
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
                        {errors.video_duration && <p className="text-red-500 text-sm mt-1">{errors.video_duration}</p>}
                    </div>}
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
                        t("continue")
                    )}</button>
                    <button className="px-5 rounded-[7px] cursor-pointer w-[200px] py-[7px] text-center border-[1.5px] border-[#E1E4EA] text-[#5A687C]">{t("cancel")}</button>
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
