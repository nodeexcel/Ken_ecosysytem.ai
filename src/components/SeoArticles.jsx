import { useEffect, useRef, useState } from "react"
import { DateFormat } from "../utils/TimeFormat"
import { Delete, DownloadIcon, EyeIcon, ThreeDots } from "../icons/icons"
import GenerateSeoArticle from "./GenerateSeoArticle"
import { useTranslation } from "react-i18next";


function SeoArticles() {
    const [articleData, setArticleData] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [generateSeoArticleOpen, setGenerateSeoArticleOpen] = useState(false)
    const moreActionsRef = useRef()
    const { t } = useTranslation();

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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-[24px] font-[600] text-[#1E1E1E]">{t("seo.articles")} </h1>
                    <button
                        onClick={() => setGenerateSeoArticleOpen(true)}
                        className="bg-[#675FFF] cursor-pointer border border-[#5F58E8] text-white font-medium rounded-lg px-5 py-2 flex items-center gap-2"
                    >
                        {t("sandro.generate_article")}
                    </button>
                </div>
                <div>
                    <input placeholder="Search" className="max-w-[399px] bg-white focus:outline-none focus:border-[#675FFF] w-full rounded-[8px] border border-[#E1E4EA] py-[5px] px-[14px]" />
                </div>
                {/* Table */}
                <div className="w-full">
                    <table className="w-full">
                        <div className="px-5 w-full">
                            <thead>
                                <tr className="text-left text-[#5A687C] text-[16px]">
                                    <th className="px-[14px] py-[14px] min-w-[200px] max-w-[50%] w-full font-[400] whitespace-nowrap">{t("seo.article_title")}</th>
                                    <th className="px-[14px] py-[14px] min-w-[200px] max-w-[50%] w-full font-[400] whitespace-nowrap">{t("brain_ai.date")}</th>
                                    <th className="py-[14px] w-full font-[400] whitespace-nowrap">{t("brain_ai.actions")}</th>
                                </tr>
                            </thead>
                        </div>
                        <div className="border border-[#E1E4EA] w-full bg-white rounded-2xl p-3">
                            {loading ? <p className="flex justify-center items-center h-34"><span className="loader" /></p> :
                                articleData.length !== 0 ?
                                    <tbody className="w-full">
                                        {articleData.map((row, index) =>
                                            <tr
                                                key={row.id}
                                                className={`text-[16px] text-[#1E1E1E] ${index !== articleData?.length - 1 ? 'border-b border-[#E1E4EA]' : ''}`}
                                            >
                                                <td className="px-[14px] py-[14px] min-w-[200px] max-w-[50%] w-full font-[600] text-[#1E1E1E] whitespace-nowrap">{row.article_title}</td>
                                                <td className="py-[14px] min-w-[200px] max-w-[50%] w-full text-[#5A687C] whitespace-nowrap">{DateFormat(row.date)}</td>
                                                <td ref={moreActionsRef} className="pr-[14px] relative">
                                                    <button
                                                        onClick={() => handleDropdownClick(index)}
                                                        className="flex items-center">
                                                        <div className="bg-[#F4F5F6] h-[34px] w-[34px] flex justify-center items-center rounded-[4px]"><ThreeDots /></div>
                                                    </button>
                                                    {activeDropdown === index && (
                                                        <div className="absolute right-6 px-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-[10]">
                                                            <div className="py-1">
                                                                <button
                                                                    className="block w-full group text-left px-4 hover:rounded-lg py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                                                    onClick={() => {
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                >
                                                                    <div className="flex items-center gap-2"><div className='group-hover:hidden'><EyeIcon /></div> <div className='hidden group-hover:block'><EyeIcon status={true} /></div> <span>{t("view")}</span> </div>
                                                                </button>
                                                                <button
                                                                    className="block w-full group text-left hover:rounded-lg pr-4 pl-[14px] py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                                                    onClick={() => {
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                >
                                                                    <div className="flex items-center gap-2"><div className='group-hover:hidden'><DownloadIcon /></div> <div className='hidden group-hover:block'><DownloadIcon status={true} /></div> <span>{t("download_html_file")}</span> </div>
                                                                </button>
                                                                <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                                                                <div className='py-2'>
                                                                    <button
                                                                        className="block w-full text-left px-4 hover:rounded-lg py-2 text-sm text-red-600 hover:bg-[#F4F5F6] font-[500]"
                                                                        onClick={() => {
                                                                            setActiveDropdown(null);
                                                                        }}
                                                                    >
                                                                        <div className="flex items-center gap-2">{<Delete />} <span>{t("delete")}</span> </div>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>

                                            </tr>
                                        )}
                                    </tbody> : <p className="flex justify-center items-center h-34 text-[#1E1E1E]">{t("tara.no_article_listed")}</p>}
                        </div>
                    </table>
                </div>
            </div> :
                <GenerateSeoArticle setGenerateSeoArticleOpen={setGenerateSeoArticleOpen} />
            }
        </>
    )
}

export default SeoArticles
