import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Edit, Delete, Ellipsis } from '../icons/icons'
import { useTranslation } from 'react-i18next'
function ContentAnalytics() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('cited_content')
    const [searchQuery, setSearchQuery] = useState('')
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [dropdownPosition, setDropdownPosition] = useState('bottom')
    const dropdownRef = useRef(null)

    const tabs = [
        { key: 'cited_content', label: t("geo.cited_content") },
        { key: 'tracked_urls', label: t("geo.tracked_urls") },
        { key: 'ai_traffic', label: t("geo.ai_traffic") }
    ]

    // Summary cards data
    const summaryCards = [
        {
            title: 'Total cited',
            value: '0',
            description: 'URLS with citations'
        },
        {
            title: 'Citation rate',
            value: '0%',
            description: 'Of tracked URLS'
        },
        {
            title: 'Top category',
            value: '-',
            description: 'Most cited'
        },
        {
            title: 'Total citations',
            value: '0',
            description: 'All time'
        }
    ]

    // Table data
    const tableData = []

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleDropdownClick = (index, event) => {
        if (activeDropdown === index) {
            setActiveDropdown(null)
            return
        }

        // Check if dropdown would be cut off at bottom
        const button = event.currentTarget
        const buttonRect = button.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const estimatedDropdownHeight = 120 // Approximate height of dropdown
        
        // Find the scrollable container (table wrapper or main content area)
        const tableWrapper = button.closest('.rounded-2xl')?.parentElement
        const scrollableContainer = tableWrapper || document.querySelector('.h-full.overflow-auto') || document.body
        
        const containerRect = scrollableContainer.getBoundingClientRect()
        
        // Calculate available space relative to the container
        const spaceBelow = containerRect.bottom - buttonRect.bottom
        const spaceAbove = buttonRect.top - containerRect.top
        
        // Also check viewport space as fallback
        const viewportSpaceBelow = viewportHeight - buttonRect.bottom
        const viewportSpaceAbove = buttonRect.top
        
        // Use the smaller of container or viewport space
        const availableSpaceBelow = Math.min(spaceBelow, viewportSpaceBelow)
        const availableSpaceAbove = Math.min(spaceAbove, viewportSpaceAbove)
        
        // Position above if not enough space below but enough space above
        // Add a buffer of 20px for better UX
        if (availableSpaceBelow < estimatedDropdownHeight + 20 && availableSpaceAbove >= estimatedDropdownHeight) {
            setDropdownPosition('top')
        } else {
            setDropdownPosition('bottom')
        }

        setActiveDropdown(index)
    }

    return (
        <div className="p-12 h-full overflow-auto flex flex-col gap-6 w-full">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-[22px] font-[500] text-[#1E1E1E]">
                    {t("geo.content_analytics")}
                </h1>
                <p className="text-[14px] font-[400] text-[#5A687C]">
                    {t("geo.monitor_your_content_citations_tracked_urls_and_ai_traffic")}
                </p>
            </div>

            {/* Navigation Tabs - slider style */}
            <div className="inline-flex items-center gap-1 bg-[#F3F4F6] rounded-lg p-0.5 w-fit border border-[#E1E4EA]">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-lg text-[14px] font-[500] transition-all ${
                                isActive
                                    ? 'bg-white text-[#111827] shadow-sm border border-[#D6D6D6]'
                                    : 'bg-transparent text-[#5A687C]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white border border-[#D6D6D6] rounded-xl p-4"
                    >
                        <p className="text-[14px] font-[400] text-[#5A687C] mb-1">{card.title}</p>
                        <p className="text-2xl font-[600] text-[#1E1E1E] mb-1">
                            {card.value}
                        </p>
                        <p className="text-xs text-[#5A687C]">{card.description}</p>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="flex justify-end">
                <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A687C] w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search URLs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#E1E4EA] rounded-lg bg-white focus:outline-none focus:border-[#675FFF] text-sm text-[#1E1E1E]"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-2xl border border-[#D6D6D6] overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-[#F7F7F8]">
                            <tr>
                                <th className="px-6 py-3 text-left text-[16px] font-[400] text-[#5A687C]">
                                    {t("geo.source_urls")}
                                </th>
                                <th className="px-6 py-3 text-left text-[16px] font-[400] text-[#5A687C]">
                                    {t("geo.categories")}
                                </th>
                                <th className="px-6 py-3 text-left text-[16px] font-[400] text-[#5A687C]">
                                    {t("geo.created")}
                                </th>
                                <th className="px-6 py-3 text-left text-[16px] font-[400] text-[#5A687C]">
                                    {t("geo.citations")}
                                </th>
                                <th className="px-6 py-3 text-center text-[16px] font-[400] text-[#5A687C]">
                                    {t("geo.action")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E1E4EA]">
                            {tableData.length > 0 ? (
                                tableData.map((row, index) => (
                                    <tr key={row.id} className="hover:bg-[#F8F9FB] transition-colors">
                                        <td className="px-6 py-4 text-[16px] text-[#1E1E1E]">
                                            {row.sourceUrl}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-[500] bg-[#F3E8FF] text-[#A855F7]">
                                                {row.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[16px] text-[#1E1E1E]">
                                            {row.created}
                                        </td>
                                        <td className="px-6 py-4 text-[16px] text-[#1E1E1E]">
                                            {row.citations}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div ref={dropdownRef} className="relative inline-block">
                                                <button
                                                    onClick={(e) => handleDropdownClick(index, e)}
                                                    className="p-2 rounded-lg relative cursor-pointer"
                                                >
                                                    <div className="bg-[#F4F5F6] p-2 rounded-lg">
                                                        <Ellipsis />
                                                    </div>
                                                </button>
                                                {activeDropdown === index && (
                                                    <div className={`dropdown-menu absolute right-0 px-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10 ${
                                                        dropdownPosition === 'top' 
                                                            ? 'bottom-full mt-5' 
                                                            : 'top-full mt-2'
                                                    }`}>
                                                        <div className="py-1">
                                                            <button
                                                                className="block group w-full hover:rounded-lg text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] font-[500] hover:bg-[#F4F5F6] cursor-pointer"
                                                                onClick={() => {
                                                                    // Handle edit action
                                                                    setActiveDropdown(null)
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className="group-hover:hidden">
                                                                        <Edit />
                                                                    </div>
                                                                    <div className="hidden group-hover:block">
                                                                        <Edit status={true} />
                                                                    </div>
                                                                    <span>Edit</span>
                                                                </div>
                                                            </button>
                                                            <button
                                                                className="block w-full hover:rounded-lg text-left px-4 py-2 text-sm text-red-600 hover:bg-[#F4F5F6] font-[500] cursor-pointer"
                                                                onClick={() => {
                                                                    // Handle delete action
                                                                    setActiveDropdown(null)
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Delete />
                                                                    <span>Delete</span>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12">
                                        <div className="flex items-center justify-center text-[#5A687C] text-sm bg-white min-h-[220px] rounded-b-2xl">
                                            No cited content yet
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ContentAnalytics

