import { useState } from "react"
import { SelectDropdown } from "./Dropdown"
import { useTranslation } from "react-i18next";

function CreationStudio() {
    const [formData, setFormData] = useState({ text_prompt: "", post_type: "", language: "", media_type: "", video_duration: "", author: "" })
    const [errors, setErrors] = useState({})
    const { t } = useTranslation();

    const postTypeOptions = [{ label: `${t("constance.generic")}`, key: "generic" }, { label: `${t("constance.meme")}`, key: "meme" }, { label: `${t("constance.quoted")}`, key: "quotes" }]
    const mediaTypeOptions = [{ label: `${t("constance.single_image")}`, key: "single_image" }, { label:`${t("constance.carousel")}`, key: "carousel" }, { label: `${t("constance.video")}`, key: "video" }]
    const languageOptions = [{ label: `${t("constance.eng")}`, key: "english" }, { label: `${t("constance.fr")}`, key: "french" }]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    return (
        <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-1 w-full">
            <p className="text-[#5A687C] text-[14px] font-[400]">{t("constance.content_creation")} {">"} {t("brain_ai.add_new")}</p>
            <h1 className="text-[#1E1E1E] font-[600] text-[24px]">{t("constance.add_creation_studio")}</h1>
            <div className="h-full flex flex-col gap-4 w-full py-3">
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-[#1e1e1e]">
                    {t("constance.text")}(prompt)
                    </label>
                    <textarea
                        name='text_prompt'
                        onChange={handleChange}
                        value={formData?.text_prompt}
                        rows={4}
                        className={`w-full bg-white p-2 rounded-lg border  ${errors.text_prompt ? 'border-red-500' : 'border-[#e1e4ea]'} resize-none focus:outline-none focus:border-[#675FFF]`}
                        placeholder={t("constance.text_placeholder")}
                    />
                    {errors.text_prompt && <p className="text-red-500 text-sm mt-1">{errors.text_prompt}</p>}
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
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-[#1e1e1e]">
                        {t("constance.video_duration")}
                        </label>
                        <input
                            type="text"
                            name='video_duration'
                            value={formData?.video_duration}
                            onChange={handleChange}
                            className={`w-full bg-white p-2 rounded-lg border ${errors.video_duration ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                            placeholder={t("constance.video_duration_placeholder")}
                        />
                        {errors.video_duration && <p className="text-red-500 text-sm mt-1">{errors.video_duration}</p>}
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
                    <button className="px-5 rounded-[7px] cursor-pointer w-[200px] py-[7px] text-center bg-[#675FFF] border-[1.5px] border-[#5F58E8] text-white">{t("continue")}</button>
                    <button className="px-5 rounded-[7px] cursor-pointer w-[200px] py-[7px] text-center border-[1.5px] border-[#E1E4EA] text-[#5A687C]">{t("cancel")}</button>
                </div>
            </div>
        </div>
    )
}

export default CreationStudio
