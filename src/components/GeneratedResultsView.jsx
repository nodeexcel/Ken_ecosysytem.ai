import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FileText, MoreVertical, Copy, Share2, Wand2, MoreHorizontal, Sparkles, Video, Image as ImageIcon, Layers, ChevronLeft, ChevronRight } from "lucide-react";

const GeneratedResultsView = ({ generatedContent, onCancel }) => {
    const { t } = useTranslation();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [carouselIndices, setCarouselIndices] = useState({});
    const videoRefs = useRef({});

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

    // Get media type from result
    const getMediaType = (result) => {
        return result.media_type || result.type || 'text';
    };

    // Get media URLs (videos or images)
    const getMediaUrls = (result) => {
        if (result.videos && result.videos.length > 0) {
            return result.videos;
        }
        if (result.images && result.images.length > 0) {
            return result.images;
        }
        if (result.media_urls && Array.isArray(result.media_urls)) {
            return result.media_urls.map(media => typeof media === 'string' ? media : media.url);
        }
        return [];
    };

    // Get icon based on media type
    const getMediaIcon = (mediaType) => {
        switch (mediaType) {
            case 'video':
            case 'reel':
                return <Video className="w-5 h-5 text-[#5A687C]" />;
            case 'carousel':
                return <Layers className="w-5 h-5 text-[#5A687C]" />;
            case 'image':
            case 'single_image':
                return <ImageIcon className="w-5 h-5 text-[#5A687C]" />;
            default:
                return <FileText className="w-5 h-5 text-[#5A687C]" />;
        }
    };

    // Carousel navigation handlers
    const handleCarouselNext = (resultId, totalItems) => {
        setCarouselIndices(prev => ({
            ...prev,
            [resultId]: ((prev[resultId] || 0) + 1) % totalItems
        }));
    };

    const handleCarouselPrev = (resultId, totalItems) => {
        setCarouselIndices(prev => ({
            ...prev,
            [resultId]: ((prev[resultId] || 0) - 1 + totalItems) % totalItems
        }));
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
                    {t("geo.generated_results")}
                </h1>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2.5 rounded-lg cursor-pointer text-center bg-white border border-gray-300 text-[#1E1E1E] font-[500] text-sm hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        {t("geo.cancel")}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-4 w-full bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between w-full border-b border-[#dcd6d6] pb-2">
                    <h2 className="text-[#1E1E1E] text-[20px] font-[600]">{t("geo.results")}</h2>
                    <span className="text-[#5A687C] text-[16px] font-[400]">
                        {resultsCount} {resultsCount === 1 ? t("geo.result") : t("geo.results")} {t("geo.generated")}
                    </span>
                </div>

                {/* Results Cards */}
                <div className="flex flex-col gap-4 w-full">
                    {generatedContent?.results?.map((result, index) => {
                        const dropdownId = `dropdown-${result.id}`;
                        const mediaType = getMediaType(result);
                        const mediaUrls = getMediaUrls(result);
                        const currentCarouselIndex = carouselIndices[result.id] || 0;

                        return (
                            <div
                                key={result.id}
                                className="bg-white rounded-xl border border-[#E1E4EA] p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                {getMediaIcon(mediaType)}
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
                                                        <span className="text-sm text-gray-700">{t("geo.edit")}</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCopy(result.content || '');
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#F2F2F7]"
                                                    >
                                                        <span className="text-sm text-gray-700">{t("geo.copy")}</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleShare(result);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#F2F2F7]"
                                                    >
                                                        <span className="text-sm text-gray-700">{t("geo.share")}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Text */}
                                    {result.content && (
                                        <p className="text-[#1E1E1E] text-[14px] font-[400] leading-relaxed">
                                            {result.content}
                                        </p>
                                    )}

                                    {/* Media Display */}
                                    {mediaUrls.length > 0 && (
                                        <div className="w-full">
                                            {/* Video */}
                                            {(mediaType === 'video' || mediaType === 'reel') && (
                                                <div className="relative w-full max-w-2xl rounded-lg overflow-hidden border border-gray-200 bg-black">
                                                    <video
                                                        ref={(el) => videoRefs.current[result.id] = el}
                                                        src={mediaUrls[0]}
                                                        controls
                                                        className="w-full h-auto max-h-[600px] object-contain"
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            )}

                                            {/* Single Image */}
                                            {(mediaType === 'image' || mediaType === 'single_image') && (
                                                <div className="flex gap-2 flex-wrap">
                                                    {mediaUrls.map((image, imgIndex) => (
                                                        <div
                                                            key={imgIndex}
                                                            className="max-w-md rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                                                        >
                                                            <img
                                                                src={image}
                                                                className="w-full h-auto object-contain"
                                                                alt={`Generated image ${imgIndex + 1}`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Carousel */}
                                            {mediaType === 'carousel' && mediaUrls.length > 0 && (
                                                <div className="relative w-full max-w-2xl rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                                    <div className="relative">
                                                        <img
                                                            src={mediaUrls[currentCarouselIndex]}
                                                            className="w-full h-auto max-h-[600px] object-contain"
                                                            alt={`Carousel image ${currentCarouselIndex + 1}`}
                                                        />
                                                        
                                                        {/* Navigation Buttons */}
                                                        {mediaUrls.length > 1 && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleCarouselPrev(result.id, mediaUrls.length)}
                                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                                                    aria-label="Previous"
                                                                >
                                                                    <ChevronLeft className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCarouselNext(result.id, mediaUrls.length)}
                                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                                                    aria-label="Next"
                                                                >
                                                                    <ChevronRight className="w-5 h-5" />
                                                                </button>
                                                            </>
                                                        )}

                                                        {/* Indicators */}
                                                        {mediaUrls.length > 1 && (
                                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                                {mediaUrls.map((_, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => setCarouselIndices(prev => ({ ...prev, [result.id]: idx }))}
                                                                        className={`w-2 h-2 rounded-full transition-colors ${
                                                                            idx === currentCarouselIndex ? 'bg-white' : 'bg-white/50'
                                                                        }`}
                                                                        aria-label={`Go to slide ${idx + 1}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                            </div>
                                        )}
                                    </div>
                                    )}
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

