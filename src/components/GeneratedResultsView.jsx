import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FileText, MoreVertical, Copy, Share2, Wand2, MoreHorizontal, Sparkles } from "lucide-react";

const GeneratedResultsView = ({ generatedContent, onCancel }) => {
    const { t } = useTranslation();
    const [activeDropdown, setActiveDropdown] = useState(null);

    const resultsCount = generatedContent?.results?.length || 0;

    const handleSaveDraft = () => {
        // TODO: Implement save as draft functionality
        console.log("Save as draft");
    };

    const handleSchedule = () => {
        // TODO: Implement schedule functionality
        console.log("Schedule");
    };

    const handleCopy = (content) => {
        navigator.clipboard.writeText(content);
        // TODO: Show toast notification
    };

    const handleShare = (result) => {
        // TODO: Implement share functionality
        console.log("Share", result);
    };

    const handleEdit = (result) => {
        // TODO: Implement edit functionality
        console.log("Edit", result);
    };

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown && !event.target.closest('.dropdown-container')) {
                setActiveDropdown(null);
            }
        };

        if (activeDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeDropdown]);

    return (
        <div className="p-12 w-full h-full flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex items-start justify-between w-full">
                <h1 className="text-[#1E1E1E] text-3xl font-[500]">
                    Generated Results
                </h1>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2.5 rounded-lg cursor-pointer text-center bg-white border border-gray-300 text-[#1E1E1E] font-[500] text-sm hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveDraft}
                        className="px-4 py-2.5 rounded-lg cursor-pointer text-center bg-white border border-gray-300 text-[#1E1E1E] font-[500] text-sm hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={handleSchedule}
                        className="px-4 py-2.5 rounded-lg cursor-pointer text-center bg-[#675FFF] text-white font-[500] text-sm hover:bg-[#5a4fe6] transition-colors shadow-sm"
                    >
                        Schedule
                    </button>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-4 w-full bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between w-full border-b border-[#dcd6d6] pb-2">
                    <h2 className="text-[#1E1E1E] text-[20px] font-[600]">Results</h2>
                    <span className="text-[#5A687C] text-[16px] font-[400]">
                        {resultsCount} {resultsCount === 1 ? "Result" : "Results"} Generated
                    </span>
                </div>

                {/* Results Cards */}
                <div className="flex flex-col gap-4 w-full">
                    {generatedContent?.results?.map((result, index) => {
                        const dropdownId = `dropdown-${result.id}`;

                        return (
                            <div
                                key={result.id}
                                className="bg-white rounded-xl border border-[#E1E4EA] p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                <FileText className="w-5 h-5 text-[#5A687C]" />
                                            </div>
                                            <h3 className="text-[#1E1E1E] text-[16px] font-[600]">
                                                {result.title}
                                            </h3>
                                        </div>

                                        <div className="relative dropdown-container flex-shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <MoreHorizontal className="w-5 h-5 text-[#5A687C]" />
                                            </button>

                                            {activeDropdown === dropdownId && (
                                                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[150px] z-50">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(result);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#F2F2F7]"
                                                    >
                                                        <span className="text-sm text-gray-700">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCopy(result.content);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#F2F2F7]"
                                                    >
                                                        <span className="text-sm text-gray-700">Copy</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleShare(result);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#F2F2F7]"
                                                    >
                                                        <span className="text-sm text-gray-700">Share</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <p className="flex-1 text-[#1E1E1E] text-[14px] font-[400] leading-relaxed">
                                            {result.content}
                                        </p>

                                        {result.images && result.images.length > 0 && (
                                            <div className="flex gap-2 flex-shrink-0">
                                                {result.images.map((image, imgIndex) => (
                                                    <div
                                                        key={imgIndex}
                                                        className="w-full h-95 rounded-lg overflow-hidden border border-gray-200"
                                                    >
                                                        <img
                                                            src={image}
                                                            className="w-full h-full object-cover"
                                                            alt={`Generated image ${imgIndex + 1}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Action Icons at Bottom */}
                <div className="flex items-center gap-4 mt-4 pt-4 pl-6">
                    <button
                        onClick={() => {
                            const allContent = generatedContent?.results?.map(r => r.content).join('\n\n');
                            handleCopy(allContent);
                        }}
                        className="flex items-center justify-center text-[#5A687C] hover:text-[#675FFF] transition-colors cursor-pointer"
                        title="Copy All"
                    >
                        <Copy className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            // TODO: Implement share all functionality
                            console.log("Share all");
                        }}
                        className="flex items-center justify-center text-[#5A687C] hover:text-[#675FFF] transition-colors cursor-pointer"
                        title="Share All"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            // TODO: Implement enhance/edit all functionality
                            console.log("Enhance all");
                        }}
                        className="flex items-center justify-center text-[#5A687C] hover:text-[#675FFF] transition-colors cursor-pointer"
                        title="Enhance All"
                    >
                        <Sparkles className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneratedResultsView;

