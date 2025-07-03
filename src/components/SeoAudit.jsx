import { useEffect, useState } from 'react'
import sandroImg from "../assets/svg/sandro_logo.svg"
import pdfFile from '../assets/file/eco_systeme.ai_dummy_seo_audit.pdf'
import { useTranslation } from "react-i18next";

function SeoAudit() {
    const [website, setWebsite] = useState("")
    const [errors, setErrors] = useState({})
    const [generateSeoAudit, setGenerateSeoAudit] = useState(false)
    const [loadingStatus, setLoadingStatus] = useState(0)
    const { t } = useTranslation();

    useEffect(() => {
        let interval;
        if (generateSeoAudit) {
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
    }, [generateSeoAudit]);

    const handleSubmit = async () => {
        if (!website.trim()) {
            setErrors((prev) => ({ ...prev, website: `${t("seo_website_url_is_required")}` }))
            return
        } else if (!/^https?:\/\/\S+$/.test(website)) {
            setErrors((prev) => ({ ...prev, website: `${t("seo.enter_valid_url_website")}` }))
            return
        }
        setGenerateSeoAudit(true)
    }

    return (
        <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-3 w-full">
            <h1 className="text-[24px] font-[600] text-[#1E1E1E]">{t("seo.seo_analyze")}</h1>
            <p className="text-[14px] font-[400] text-[#5A687C]">{t("seo.smart_seo")}</p>
            {!generateSeoAudit ? <div className="border border-[#E1E4EA] bg-white p-[24px] rounded-[10px] flex flex-col gap-[20px]">
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-[#1e1e1e]">
                    {t("seo.analyze_website")}
                    </label>
                    <input
                        value={website}
                        name="website"
                        placeholder="https://www.example.com"
                        className={`w-full text-[#1e1e1e] px-[12px] py-[8px] border bg-white rounded-[8px] focus:outline-none focus:border-[#675FFF] ${errors.website ? 'border-red-500' : 'border-[#E1E4EA]'}`}
                        onChange={(e) => {
                            setWebsite(e.target.value)
                            setErrors((prev) => ({
                                ...prev, website: ""
                            }))
                        }}
                    />
                    {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                </div>
                <div>
                    <button
                        onClick={handleSubmit}
                        className="bg-[#675FFF] cursor-pointer border border-[#5F58E8] text-white font-medium rounded-lg px-5 py-2 flex items-center gap-2"
                    >
                        {t("seo.generate_an_seo_audit")}
                    </button>
                </div>
            </div> : loadingStatus === 100 ? <div className="border border-[#E1E4EA] bg-white p-[24px] rounded-[10px] gap-[20px] flex flex-col h-full">
                <div className="flex items-center gap-2">
                    <div className="flex justify-center items-center">
                        <img src={sandroImg} alt={"sandro"} className="object-fit" />
                    </div>
                    <p className="text-[#5A687C] text-[12px] font-[600]">{t("seo.here_seo_report")}</p>
                </div>
                <div className="flex h-full">
                    <iframe
                        src={pdfFile}
                        title="PDF Viewer"
                        width="100%"
                        minHeight="600px"
                        maxHeight="100%"
                        className="object-fit rounded-lg"
                    ></iframe>
                </div>

            </div> : <div className="border border-[#E1E4EA] bg-white p-[24px] justify-center items-center rounded-[10px] flex flex-col h-full">
                <div className="flex flex-col gap-3 items-center">
                    <div className="flex items-center gap-2">
                        <div className="flex justify-center items-center">
                            <img src={sandroImg} alt={"sandro"} className="object-fit" />
                        </div>
                        <p className="text-[#1E1E1E] text-[16px] font-[600]">{t("seo.sandro_generated_report")}</p>
                    </div>
                    <div className="w-[500px] h-[14px] rounded-[40px] bg-[#D7D4FF]">
                        <div style={{ width: `${loadingStatus}%` }} className={`${loadingStatus === 100 ? 'rounded-[40px]' : 'rounded-l-[40px]'}  h-[14px] leading-none bg-[#675FFF]`} ></div>
                    </div>
                    <p className="text-[#5A687C] text-[14px] font-[400]">{loadingStatus}% Completed </p>
                </div>
            </div>}
        </div>
    )
}

export default SeoAudit
