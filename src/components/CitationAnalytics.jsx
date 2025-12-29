import { useState } from 'react'
import { ArrowUp, Search, ChevronDown } from 'lucide-react'
import ChatgptLogo from '../assets/svg/Chatgpt.svg'
import GeminiLogo from '../assets/svg/Gemini.svg'
import { useTranslation } from 'react-i18next'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

function CitationAnalytics() {
    const { t } = useTranslation()
    const [selectedCategory, setSelectedCategory] = useState(t("geo.categories"))
    const [selectedContentType, setSelectedContentType] = useState(t("geo.content_type"))
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [selectedRows, setSelectedRows] = useState([])

    // Dummy data
    const tableData = [
        {
            id: 1,
            citedSource: 'https://www.youtube.com/watch',
            citedModels: ['ChatGPT', 'Gemini'],
            category: 'Social Media',
            categoryColor: 'bg-[#22C55E]',
            contentType: '',
            contentTypeColor: '',
            prompts: 15,
            citations: 32,
            creationDate: '27 Mar 2025'
        },
        {
            id: 2,
            citedSource: 'https://evaboot.com/fr/blog/meil...',
            citedModels: ['ChatGPT', 'Gemini'],
            category: 'Blogs',
            categoryColor: 'bg-[#A855F7]',
            contentType: 'Listicle',
            contentTypeColor: 'bg-[#A855F7]',
            prompts: 15,
            citations: 32,
            creationDate: '26 Mar 2025'
        },
        {
            id: 3,
            citedSource: 'https://www.snaplogic.com/fr/bl...',
            citedModels: ['ChatGPT', 'Gemini'],
            category: 'Blogs',
            categoryColor: 'bg-[#A855F7]',
            contentType: 'How To',
            contentTypeColor: 'bg-[#3B82F6]',
            prompts: 15,
            citations: 32,
            creationDate: '20 Mar 2025'
        },
        {
            id: 4,
            citedSource: 'https://landingi.com/fr/lead-gen...',
            citedModels: ['ChatGPT', 'Gemini'],
            category: 'Blogs',
            categoryColor: 'bg-[#A855F7]',
            contentType: 'Listicle',
            contentTypeColor: 'bg-[#A855F7]',
            prompts: 15,
            citations: 32,
            creationDate: '18 Mar 2025'
        },
        {
            id: 5,
            citedSource: 'https://www.monsieurlead.io/blo...',
            citedModels: ['ChatGPT', 'Gemini'],
            category: 'Blogs',
            categoryColor: 'bg-[#A855F7]',
            contentType: 'How To',
            contentTypeColor: 'bg-[#3B82F6]',
            prompts: 15,
            citations: 32,
            creationDate: '16 Mar 2025'
        },
        {
            id: 6,
            citedSource: 'https://www.monsieurlead.io/blo...',
            citedModels: ['ChatGPT', 'Gemini'],
            category: 'Blogs',
            categoryColor: 'bg-[#A855F7]',
            contentType: 'How To',
            contentTypeColor: 'bg-[#3B82F6]',
            prompts: 15,
            citations: 32,
            creationDate: '16 Mar 2025'
        }
    ]

    const totalPages = Math.ceil(tableData.length / rowsPerPage)
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    const currentData = tableData.slice(startIndex, endIndex)

    // Reset to page 1 when rows per page changes
    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage)
        setCurrentPage(1)
    }

    // Chart data for Cited Categories
    const categoriesChartData = {
        labels: [''],
        datasets: [
            {
                label: 'Social Media',
                data: [30],
                backgroundColor: '#6D1972', // deep purple
                borderRadius: 50,
                barThickness: 12,
            },
            {
                label: 'Competitors',
                data: [25],
                backgroundColor: '#9B3FB6', // mid purple
                borderRadius: 50,
                barThickness: 12,
            },
            {
                label: 'Blogs',
                data: [45],
                backgroundColor: '#E756E6', // pink
                borderRadius: 50,
                barThickness: 12,
            },
        ],
    };



    const categoriesChartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: { left: 0, right: 0 },
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                align: 'start',
                labels: {
                    boxWidth: 10,
                    boxHeight: 10,
                    usePointStyle: false,
                    padding: 12,
                    font: { size: 12 },
                    color: '#5A687C',
                },
            },
            tooltip: { enabled: false },
        },
        scales: {
            x: {
                stacked: true,
                display: false,
                grid: { display: false },
                max: 100,
            },
            y: {
                stacked: true,
                display: false,
                grid: { display: false },
            },
        },
    }

    // Chart data for Cited Content Types
    const contentTypesChartData = {
        labels: [''],
        datasets: [
            {
                label: 'Listicle',
                data: [12],
                backgroundColor: '#0B2C48',
                borderRadius: 50,
                barThickness: 10,
            },
            {
                label: 'How-to',
                data: [15],
                backgroundColor: '#1A70A6',
                borderRadius: 50,
                barThickness: 10,
            },
            {
                label: 'Landing Page',
                data: [12],
                backgroundColor: '#2A9CC7',
                borderRadius: 50,
                barThickness: 10,
            },
            {
                label: 'Comparison',
                data: [11],
                backgroundColor: '#42BDE6',
                borderRadius: 50,
                barThickness: 10,
            },
            {
                label: 'Wiki',
                data: [9],
                backgroundColor: '#6BC8E8',
                borderRadius: 50,
                barThickness: 10,
            },
            {
                label: 'Review',
                data: [5],
                backgroundColor: '#8FD7F0',
                borderRadius: 50,
                barThickness: 10,
            },
            {
                label: 'Unknown',
                data: [6],
                backgroundColor: '#B3E5F8',
                borderRadius: 50,
                barThickness: 10,
            },
            {
                label: 'Announcement',
                data: [8],
                backgroundColor: '#D1EEFB',
                borderRadius: 50,
                barThickness: 10,
            },
            {
                label: 'Case Study',
                data: [6],
                backgroundColor: '#D6F1FC',
                borderRadius: 50,
                barThickness: 10,
            },
            {
                label: 'Opinion',
                data: [5],
                backgroundColor: '#DDF4FD',
                borderRadius: 50,
                barThickness: 10,
            },
            {
                label: 'Research Report',
                data: [4],
                backgroundColor: '#E4F7FE',
                borderRadius: 50,
                barThickness: 10,
            },
            {
                label: 'Q&A',
                data: [3],
                backgroundColor: '#EAF9FF',
                borderRadius: 50,
                barThickness: 10,
            },
        ],
    }

    const contentTypesChartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: { left: 0, right: 0 },
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                align: 'start',
                labels: {
                    boxWidth: 10,
                    boxHeight: 10,
                    usePointStyle: false,
                    padding: 10,
                    font: { size: 11 },
                    color: '#5A687C',
                },
            },
            tooltip: { enabled: false },
        },
        scales: {
            x: {
                stacked: true,
                display: false,
                grid: { display: false },
                max: 100,
            },
            y: {
                stacked: true,
                display: false,
                grid: { display: false },
            },
        },
    }

    const handleSelectRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        )
    }

    const handleSelectAll = () => {
        if (selectedRows.length === currentData.length) {
            setSelectedRows([])
        } else {
            setSelectedRows(currentData.map(row => row.id))
        }
    }

    const allSelected = selectedRows.length === currentData.length && currentData.length > 0

    const modelLogos = {
        'ChatGPT': ChatgptLogo,
        'Gemini': GeminiLogo
    }

    return (
        <div className="p-12 h-full overflow-auto flex flex-col gap-6 w-full">
            {/* Header Section */}
            <div className="flex items-start justify-between w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-[500] text-[#1E1E1E]">
                    {t("geo.citation_analytics")}
                    </h1>
                    <p className="text-[14px] font-[400] text-[#5A687C]">
                        {t("geo.see_urls_used_in_ai_answer")}
                    </p>
                </div>
                
                {/* Export All Button */}
                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-1.5 bg-white border border-[#E1E4EA] rounded-lg hover:bg-[#F8F9FB] transition-colors cursor-pointer"
                >
                    <ArrowUp className="w-4 h-4 text-[#5A687C]" />
                    <span className="text-sm font-[500] text-[#5A687C]">
                        {t("geo.export_all")}
                    </span>
                </button>
            </div>

            {/* Analytics Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Cited Categories Chart */}
                <div className="bg-white border border-[#D6D6D6] rounded-2xl p-6">
                    <h2 className="text-[20px] font-[500] text-[#1E1E1E] mb-4">
                        {t("geo.cited_categories")}
                    </h2>
                    <div className="h-[80px] mb-4 px-2">
                        <Bar data={categoriesChartData} options={categoriesChartOptions} />
                    </div>
                </div>

                {/* Citied Content Types Chart */}
                <div className="bg-white border border-[#D6D6D6] rounded-2xl p-6">
                    <h2 className="text-[20px] font-[500] text-[#1E1E1E] mb-4">
                        {t("geo.cited_content_types")}
                    </h2>
                    <div className="h-[90px] mb-4 w-full px-2">
                        <Bar data={contentTypesChartData} options={contentTypesChartOptions} />
                    </div>
                </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Left: Categories + Content Type */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-sm text-[#1E1E1E] hover:bg-[#F8F9FB] transition-colors cursor-pointer whitespace-nowrap"
                    >
                        <span>{selectedCategory}</span>
                        <ChevronDown className="w-4 h-4 text-[#5A687C]" />
                    </button>

                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-sm text-[#1E1E1E] hover:bg-[#F8F9FB] transition-colors cursor-pointer whitespace-nowrap"
                    >
                        <span>{selectedContentType}</span>
                        <ChevronDown className="w-4 h-4 text-[#5A687C]" />
                    </button>
                </div>

                {/* Right: Search + View All */}
                <div className="flex items-center gap-3 flex-1 sm:flex-none sm:w-auto">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A687C] w-4 h-4" />
                        <input
                            type="text"
                            placeholder={t("geo.search_name_or_phone_number")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[#E1E4EA] rounded-lg bg-white focus:outline-none focus:border-[#675FFF] text-sm text-[#1E1E1E]"
                        />
                    </div>

                    <button
                        type="button"
                        className="px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg text-sm font-[500] text-[#1E1E1E] hover:bg-[#F8F9FB] transition-colors cursor-pointer whitespace-nowrap"
                    >
                        {t("geo.view_all")}
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-2xl border border-[#D6D6D6] overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-[#F7F7F8]">
                            <tr>
                                <th className="px-6 py-3 text-left text-[16px] font-[400] text-[#5A687C]">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 border border-[#D6D6D6] rounded cursor-pointer"
                                        />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-[14px] font-[400] text-[#5A687C]">{t("geo.cited_sources")}</th>
                                <th className="px-6 py-3 text-left text-[14px] font-[400] text-[#5A687C]">{t("geo.cited_models")}</th>
                                <th className="px-6 py-3 text-left text-[14px] font-[400] text-[#5A687C]">{t("geo.categories")}</th>
                                <th className="px-6 py-3 text-left text-[14px] font-[400] text-[#5A687C]">{t("geo.content_type")}</th>
                                <th className="px-6 py-3 text-left text-[14px] font-[400] text-[#5A687C]">{t("geo.prompts")}</th>
                                <th className="px-6 py-3 text-left text-[14px] font-[400] text-[#5A687C]">{t("geo.citations")}</th>
                                <th className="px-6 py-3 text-left text-[14px] font-[400] text-[#5A687C]">{t("geo.creation_date")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E1E4EA]">
                            {currentData.map((row) => (
                                <tr key={row.id} className="hover:bg-[#F8F9FB] transition-colors">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(row.id)}
                                            onChange={() => handleSelectRow(row.id)}
                                            className="w-4 h-4 border border-[#D6D6D6] rounded cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-[14px] text-[#1E1E1E]">{row.citedSource}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {row.citedModels.map((model, idx) => (
                                                <img
                                                    key={idx}
                                                    src={modelLogos[model]}
                                                    alt={model}
                                                    className="w-5 h-5"
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.category && (
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-[500] text-white ${row.categoryColor}`}>
                                                {row.category}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.contentType && (
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-[500] text-white ${row.contentTypeColor}`}>
                                                {row.contentType}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-[14px] text-[#1E1E1E]">{row.prompts} {t("geo.prompts")}</td>
                                    <td className="px-6 py-4 text-[14px] text-[#1E1E1E]">{row.citations} {t("geo.citations")}</td>
                                    <td className="px-6 py-4 text-[14px] text-[#1E1E1E]">{row.creationDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between bg-[#F7F7F8] px-4 py-3">
                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        ‹ {t("geo.prev")}
                    </button>
                    {/* Page Numbers */}
                    {totalPages > 0 && (
                        <>
                            <button
                                onClick={() => setCurrentPage(1)}
                                className={`rounded-lg px-3 py-1 text-sm min-w-[36px] ${
                                    1 === currentPage
                                        ? 'bg-[#675FFF] text-white'
                                        : 'border border-[#D6D6D6] text-[#000000] bg-white hover:bg-gray-50 cursor-pointer'
                                }`}
                            >
                                1
                            </button>
                            {currentPage > 3 && <span className="text-[#000000] text-sm">…</span>}
                            {currentPage > 2 && currentPage < totalPages && (
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white hover:bg-gray-50 cursor-pointer"
                                >
                                    {currentPage - 1}
                                </button>
                            )}
                            {currentPage > 1 && currentPage < totalPages && (
                                <button
                                    className="bg-[#675FFF] text-white rounded-lg px-3 py-1 text-sm min-w-[36px]"
                                >
                                    {currentPage}
                                </button>
                            )}
                            {currentPage < totalPages - 1 && (
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white hover:bg-gray-50 cursor-pointer"
                                >
                                    {currentPage + 1}
                                </button>
                            )}
                            {currentPage < totalPages - 2 && <span className="text-[#000000] text-sm">…</span>}
                            {totalPages > 1 && (
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={`rounded-lg px-3 py-1 text-sm min-w-[36px] ${
                                        currentPage === totalPages
                                            ? 'bg-[#675FFF] text-white'
                                            : 'border border-[#D6D6D6] text-[#000000] bg-white hover:bg-gray-50 cursor-pointer'
                                    }`}
                                >
                                    {totalPages}
                                </button>
                            )}
                        </>
                    )}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        {t("geo.next")} ›
                    </button>
                </div>

                {/* Rows per page */}
                <div className="flex items-center gap-2 text-sm text-[#5A687C]">
                    <span>{rowsPerPage} {t("geo.rows")}</span>
                    <button
                        onClick={() => handleRowsPerPageChange(10)}
                        className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] ${
                            rowsPerPage === 10 ? 'bg-white' : 'bg-transparent hover:bg-white'
                        } cursor-pointer`}
                    >
                        10
                    </button>
                    <button
                        onClick={() => handleRowsPerPageChange(20)}
                        className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] ${
                            rowsPerPage === 20 ? 'bg-white' : 'bg-transparent hover:bg-white'
                        } cursor-pointer`}
                    >
                        20
                    </button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default CitationAnalytics

