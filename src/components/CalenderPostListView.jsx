import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { PostNow, Preview, Ellipsis, Delete, Edit } from "../icons/icons";
import { getContentDetails, deleteContent, postContent } from "../api/contentCreationAgent";
import { Cross, X, Search, ChevronDown, MoreVertical } from "lucide-react";
import InstagramIcon from "../assets/svg/instagram.svg";
import TwitterIcon from "../assets/svg/twitter.svg";
import LinkedinIcon from "../assets/svg/linkedin_hr.svg";
import { SelectDropdown } from "./Dropdown";

function CalenderPostListView({ calenderData = [], setCalenderData, onEdit }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const [previewModalStatus, setPreviewModalStatus] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownDirection, setDropdownDirection] = useState('down');
  const [postNowLoading, setPostNowLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("1 Aug - 31 Aug");
  const [campaignFilter, setCampaignFilter] = useState("Campaign");
  const dropdownRef = useRef(null);

  const handleDropdownClick = (index, event, isLastTwo = false) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isSmallScreen = window.innerWidth < 640; // sm breakpoint

    // On small screens, open downward unless it's one of the last two items
    if (isSmallScreen) {
      setDropdownDirection(isLastTwo ? 'up' : 'down');
    } else {
      // For larger screens, check if it's last two items or if there's not enough space below
      const shouldOpenUp = isLastTwo || rect.bottom + 260 > windowHeight;
      setDropdownDirection(shouldOpenUp ? 'up' : 'down');
    }

    setActiveDropdown(activeDropdown === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // Open Preview Modal and fetch content details
  const handlePreview = async (item) => {
    setSelectedItem(item);
    setPreviewLoading(true);
    setError(null);
    setPreviewModalStatus(true);
    setActiveDropdown(null);
    console.log("Fetching preview for item:", item);

    try {
      const contentDetails = await getContentDetails(item.scheduled_content_id);
      setPreviewContent(contentDetails.success);
    } catch (err) {
      console.error("Error fetching content details:", err);
      setError("Failed to load preview content");
      setPreviewContent(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Open Delete Modal
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteModalStatus(true);
    setActiveDropdown(null);
  };

  // Handle actual deletion
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setDeleteLoading(true);
    setError(null);

    try {
      await deleteContent(selectedItem.scheduled_content_id);

      setCalenderData(prev =>
        prev.filter(x => x.scheduled_content_id !== selectedItem.scheduled_content_id)
      );

      setDeleteModalStatus(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete content. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle "Post Now" click
  const handlePostNowClick = async (item) => {
    setPostNowLoading(true);
    setError(null);
    setActiveDropdown(null);

    try {
      const response = await postContent(item.scheduled_content_id);

      if (response?.success) {
        // Optionally update local data to reflect the post
        setCalenderData((prevData) =>
          prevData.map((x) =>
            x.scheduled_content_id === item.scheduled_content_id
              ? { ...x, scheduled_type: "publish" }
              : x
          )
        );
        alert("Post published successfully!");
      } else {
        setError("Failed to post content. Please try again.");
      }
    } catch (err) {
      console.error("Post now failed:", err);
      setError("An error occurred while posting the content.");
    } finally {
      setPostNowLoading(false);
    }
  };

  // Close modals
  const closeModals = () => {
    setDeleteModalStatus(false);
    setPreviewModalStatus(false);
    setSelectedItem(null);
    setPreviewContent(null);
    setError(null);
  };

  const getPlatformDetails = (platform) => {
    switch (platform?.toLowerCase()) {
      case "instagram":
        return { icon: InstagramIcon, name: "Instagram" };
      case "twitter":
        return { icon: TwitterIcon, name: "Twitter" };
      case "linkedin":
        return { icon: LinkedinIcon, name: "LinkedIn" };
      default:
        return { icon: null, name: "Unknown Platform" };
    }
  };

  // Filter data based on search query
  const filteredData = calenderData.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const contentText = item.text || "";
    const platform = item.platform || "";
    return (
      contentText.toLowerCase().includes(searchLower) ||
      platform.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIdx, startIdx + rowsPerPage);

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(Number(rows));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Format date and time
  const formatDateTime = (item) => {
    let dateStr = "--";
    let timeStr = "--";

    if (item.scheduled_type === "publish" && item.published_time) {
      const [datePart, timePart] = item.published_time.split(" ");
      dateStr = datePart;
      timeStr = timePart?.split(".")[0] || "--";
    } else {
      dateStr = item.scheduled_date && item.scheduled_date !== "None" ? item.scheduled_date : "--";
      timeStr = item.scheduled_time && item.scheduled_time !== "None" ? item.scheduled_time : "--";
    }

    if (dateStr !== "--") {
      try {
        let date;
        if (dateStr.includes("-")) {
          date = new Date(dateStr);
        } else if (dateStr.includes("/")) {
          const parts = dateStr.split("/");
          date = new Date(parts[2], parts[1] - 1, parts[0]);
        } else {
          date = new Date(dateStr);
        }
        
        if (!isNaN(date.getTime())) {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const day = date.getDate();
          const month = months[date.getMonth()];
          const year = date.getFullYear();
          dateStr = `${day} ${month} ${year}`;
        }
      } catch (e) {
        // Keep original format if parsing fails
      }
    }

    // Format time: "15:30"
    if (timeStr !== "--" && timeStr.includes(":")) {
      const parts = timeStr.split(":");
      const hours = parts[0]?.padStart(2, "0") || "00";
      const minutes = parts[1]?.padStart(2, "0") || "00";
      timeStr = `${hours}:${minutes}`;
    }

    return { dateStr, timeStr };
  };

  // Get content text (truncate if too long)
  const getContentText = (item) => {
    // Try different possible field names for content text
    const text = item.text || item.content || item.content_text || item.post_text || "";
    if (!text) {
      return "No content available";
    }
    return text.length > 60 ? text.substring(0, 60) + "..." : text;
  };

  // Date range options
  const dateRangeOptions = [
    { label: "1 Aug - 31 Aug", key: "1 Aug - 31 Aug" },
    { label: "1 Sep - 30 Sep", key: "1 Sep - 30 Sep" },
    { label: "1 Oct - 31 Oct", key: "1 Oct - 31 Oct" },
  ];

  // Campaign options
  const campaignOptions = [
    { label: "Campaign", key: "Campaign" },
    { label: "All Campaigns", key: "All Campaigns" },
  ];

  return (
    <div className="w-full p-2 sm:p-3 lg:p-4 flex flex-col gap-3 sm:gap-4 overflow-auto h-screen">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 md:flex-initial md:w-auto md:max-w-md bg-white rounded-lg sm:rounded-xl">
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-[#5A687C] w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 sm:pl-8 pr-6 sm:pr-8 py-1.5 sm:py-2 border whitespace-nowrap border-[#E1E4EA] rounded-lg focus:outline-none focus:border-[#675FFF] text-xs sm:text-sm"
          />
        </div>

        {/* Date Range and Campaign Dropdowns */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SelectDropdown
            name="dateRange"
            options={dateRangeOptions}
            value={dateRange}
            onChange={(val) => setDateRange(val)}
            placeholder="1 Aug - 31 Aug"
            className="w-[140px] sm:w-[160px]"
          />
          <SelectDropdown
            name="campaign"
            options={campaignOptions}
            value={campaignFilter}
            onChange={(val) => setCampaignFilter(val)}
            placeholder="Campaign"
            className="w-[120px] sm:w-[140px]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg sm:rounded-xl lg:rounded-2xl border border-[#D6D6D6] overflow-auto mb-2">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-[#F7F7F8]">
              <tr className="text-[#5A687C]">
                <th className="px-3 sm:px-4 md:px-6 text-start py-3 text-xs sm:text-sm md:text-[16px] font-[400] whitespace-nowrap">Date time</th>
                <th className="px-2 sm:px-3 md:px-6 text-start py-3 text-xs sm:text-sm md:text-[16px] font-[400] whitespace-nowrap">Social Accounts</th>
                <th className="px-2 sm:px-3 md:px-6 text-start py-3 text-xs sm:text-sm md:text-[16px] font-[400] whitespace-nowrap">Content</th>
                <th className="px-2 sm:px-3 md:px-6 text-start py-3 text-xs sm:text-sm md:text-[16px] font-[400] whitespace-nowrap">Status</th>
                <th className="px-3 sm:px-4 md:px-12 text-center py-3 text-xs sm:text-sm md:text-[16px] font-[400] whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <span className="loader" />
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                currentData.map((item, index) => {
                  const isScheduled = item.scheduled_type?.toLowerCase() === "schedule" || item.scheduled_type?.toLowerCase() === "scheduled";
                  const isDraft = item.scheduled_type?.toLowerCase() === "draft";
                  const { dateStr, timeStr } = formatDateTime(item);
                  const platformDetails = getPlatformDetails(item.platform);

                  return (
                    <tr key={item.scheduled_content_id} className="text-sm sm:text-base md:text-[16px] text-[#1E1E1E]">
                      {/* Date time */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-4 text-xs sm:text-sm md:text-[14px] text-[#1E1E1E] font-[400] text-start">
                        <span className="text-[#1E1E1E]">
                          {dateStr !== "--" && timeStr !== "--" ? `${dateStr} · ${timeStr}` : "--"}
                        </span>
                      </td>

                      {/* Social Accounts */}
                      <td className="px-2 sm:px-3 md:px-6 py-3 sm:py-4 md:py-4 text-xs sm:text-sm md:text-[14px] text-[#1E1E1E] font-[400] text-start">
                        <div className="flex items-center gap-2">
                          {platformDetails.icon && (
                            <img src={platformDetails.icon} alt={platformDetails.name} className="w-5 h-5 flex-shrink-0" />
                          )}
                          <span className="text-[#1E1E1E]">@{item.platform || "Ecosysteme"}</span>
                        </div>
                      </td>

                      {/* Content */}
                      <td className="px-2 sm:px-3 md:px-6 py-3 sm:py-4 md:py-4 text-xs sm:text-sm md:text-[14px] text-[#1E1E1E] font-[400] text-start break-words">
                        <span className="text-[#1E1E1E]">{getContentText(item)}</span>
                      </td>

                      {/* Status */}
                      <td className="px-2 sm:px-3 md:px-6 py-3 sm:py-4 md:py-4 text-xs sm:text-sm md:text-[14px]">
                        {isScheduled ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-[#E8FFF3] border-[#34C759]">
                            <div className="w-2 h-2 rounded-full bg-[#34C759]"></div>
                            <span className="text-xs sm:text-sm font-[500] text-[#34C759]">
                              Scheduled
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-gray-50 border-gray-300">
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                            <span className="text-xs sm:text-sm font-[500] text-[#5A687C]">
                              {isDraft ? "Draft" : item.scheduled_type || "Draft"}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-4 text-center relative overflow-visible">
                        <button
                          className="p-2 bg-[#ffffff] shadow-sm cursor-pointer hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors"
                          onClick={(e) => {
                            const isLastTwo = index >= currentData.length - 2;
                            handleDropdownClick(index, e, isLastTwo);
                          }}
                        >
                          <MoreVertical className="w-5 h-5 text-[#1E1E1E]" />
                        </button>

                        {activeDropdown === index && (
                          <div
                            ref={dropdownRef}
                            className={`absolute right-0 w-40 mx-1 rounded-md shadow-lg bg-white ring-1 ring-gray-300 z-50 ${dropdownDirection === "up" ? "bottom-full mb-2" : "mt-2"
                              }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              {/* Always show Preview */}
                              <button
                                className="block w-full text-left group cursor-pointer px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePreview(item);
                                }}
                              >
                                <div className="flex items-center gap-2"><Preview /><span>Preview</span></div>
                              </button>

                              {["schedule", "draft"].includes(item.scheduled_type?.toLowerCase()) && (
                                <>
                                  <button
                                    className="block w-full text-left group px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveDropdown(null);
                                      setSelectedItem(item);
                                      if (typeof onEdit === "function") {
                                        onEdit(item.scheduled_content_id);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Edit />
                                      <span>{t("edit")}</span>
                                    </div>
                                  </button>

                                  {/* Post Now */}
                                  <button
                                    className="block w-full text-left group px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500] cursor-pointer disabled:opacity-50"
                                    disabled={postNowLoading}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePostNowClick(item);
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <PostNow />
                                      <span>{postNowLoading ? "Posting..." : "Post Now"}</span>
                                    </div>
                                  </button>
                                </>
                              )}

                              <hr className="my-2 border-[#E6EAEE]" />

                              {/* Always show Delete */}
                              <button
                                className="block w-full text-left px-4 py-2 cursor-pointer text-sm text-[#FF3B30] hover:bg-[#F4F5F6] font-[500]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(item);
                                }}
                              >
                                <div className="flex items-center gap-2"><Delete /><span>{t("delete")}</span></div>
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-xs sm:text-sm md:text-[16px] text-[#5A687C]">
                    No scheduled posts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-[#F7F7F8] px-4 sm:px-6 py-3 gap-4 sm:gap-0">
            {/* Page Navigation Buttons */}
            <div className="flex items-center gap-1 md:gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide py-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border border-[#D6D6D6] text-[#000000] rounded-lg px-2 py-1 text-xs sm:text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                ‹ Prev
              </button>

              {/* Always show page 1 */}
              <button
                onClick={() => handlePageChange(1)}
                className={`border rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer min-w-[32px] sm:min-w-[36px] transition-colors whitespace-nowrap ${
                  currentPage === 1
                    ? "bg-[#675FFF] text-white border-[#675FFF] hover:bg-[#5E54FF]"
                    : "border-[#D6D6D6] text-[#000000] hover:bg-gray-50"
                }`}
              >
                1
              </button>

              {/* Show page 2 if totalPages > 1 */}
              {totalPages > 1 && (
                <button
                  onClick={() => handlePageChange(2)}
                  className={`border rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer min-w-[32px] sm:min-w-[36px] transition-colors whitespace-nowrap ${
                    currentPage === 2
                      ? "bg-[#675FFF] text-white border-[#675FFF] hover:bg-[#5E54FF]"
                      : "border-[#D6D6D6] text-[#000000] hover:bg-gray-50"
                  }`}
                >
                  2
                </button>
              )}

              {/* Show page 3 if totalPages > 2 */}
              {totalPages > 2 && (
                <button
                  onClick={() => handlePageChange(3)}
                  className={`border rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer min-w-[32px] sm:min-w-[36px] transition-colors whitespace-nowrap ${
                    currentPage === 3
                      ? "bg-[#675FFF] text-white border-[#675FFF] hover:bg-[#5E54FF]"
                      : "border-[#D6D6D6] text-[#000000] hover:bg-gray-50"
                  }`}
                >
                  3
                </button>
              )}

              {/* Show ellipsis if totalPages > 3 */}
              {totalPages > 3 && <span className="text-[#000000] text-xs sm:text-sm px-1 whitespace-nowrap">…</span>}

              {/* Show last page if totalPages > 3 */}
              {totalPages > 3 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`border rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer min-w-[32px] sm:min-w-[36px] transition-colors whitespace-nowrap ${
                    currentPage === totalPages
                      ? "bg-[#675FFF] text-white border-[#675FFF] hover:bg-[#5E54FF]"
                      : "border-[#D6D6D6] text-[#000000] hover:bg-gray-50"
                  }`}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border border-[#D6D6D6] text-[#000000] rounded-lg px-2 py-1 text-xs sm:text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Next ›
              </button>
            </div>

            {/* Rows per page */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5A687C] w-full sm:w-auto justify-center sm:justify-end">
              <span>Rows per page:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleRowsPerPageChange(5)}
                  className={`border rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer transition-colors whitespace-nowrap ${
                    rowsPerPage === 5
                      ? "bg-white border-[#D6D6D6] text-[#000000]"
                      : "bg-transparent border-[#D6D6D6] text-[#5A687C] hover:bg-white"
                  }`}
                >
                  5 rows
                </button>
                <button
                  onClick={() => handleRowsPerPageChange(10)}
                  className={`border rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer transition-colors whitespace-nowrap ${
                    rowsPerPage === 10
                      ? "bg-white border-[#D6D6D6] text-[#000000]"
                      : "bg-transparent border-[#D6D6D6] text-[#5A687C] hover:bg-white"
                  }`}
                >
                  10
                </button>
                <button
                  onClick={() => handleRowsPerPageChange(20)}
                  className={`border rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer transition-colors whitespace-nowrap ${
                    rowsPerPage === 20
                      ? "bg-white border-[#D6D6D6] text-[#000000]"
                      : "bg-transparent border-[#D6D6D6] text-[#5A687C] hover:bg-white"
                  }`}
                >
                  20
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-center text-red-600 text-sm mt-2 bg-red-50 border border-red-200 p-2 rounded">
          {error}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-[514px] p-6 relative shadow-lg">
            <button
              className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModals}
              disabled={deleteLoading}
            >
              <X size={20} />
            </button>

            <div className="flex flex-col justify-around h-[150px] text-center">
              <h2 className="text-[20px] font-semibold text-[#1E1E1E] mb-4">
                {t("settings.tab_1_list.delete_header")}
              </h2>
              <p className="text-[#5A687C] mb-4">
                Are you sure you want to delete this scheduled post? This action cannot be undone.
              </p>

              {error && (
                <div className="mb-1 p-1 text-xs bg-red-100 border border-red-300 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-4 mt-2 w-full">
                <button
                  className="w-full cursor-pointer bg-[#FF3B30] text-white px-5 py-2 font-[500] test-[16px] rounded-lg hover:bg-[#ff2b20] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : t("settings.tab_1_list.confirm_delete")}
                </button>
                <button
                  className="w-full cursor-pointer bg-white text-[#5A687C] border-[1.5px] border-[#E1E4EA] font-[500] test-[16px] px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  onClick={closeModals}
                  disabled={deleteLoading}
                >
                  {t("settings.tab_1_list.cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 relative shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModals}
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h2 className="text-[20px] font-semibold text-[#1E1E1E]">Preview</h2>
              <p className="text-[#5A687C] text-sm mt-1">
                Preview of scheduled content
              </p>
            </div>

            {previewLoading ? (
              <div className="flex justify-center items-center py-12">
                <span className="loader"></span>
                <span className="ml-2">Loading preview...</span>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : previewContent ? (
              <div className="border border-[#E1E4EA] rounded-lg p-4 bg-gray-50">
                <div className="space-y-4">

                  {/* Platform */}
                  {previewContent.platform && (
                    <div className="flex items-center gap-3 bg-white p-3 rounded border">
                      <img
                        src={getPlatformDetails(previewContent.platform).icon}
                        alt={previewContent.platform}
                        className="w-6 h-6"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-700">
                          {getPlatformDetails(previewContent.platform).name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Text */}
                  {previewContent.text && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Text</h3>
                      <p className="text-gray-600 bg-white p-3 rounded border whitespace-pre-wrap">
                        {previewContent.text}
                      </p>
                    </div>
                  )}

                  {/* Media */}
                  {previewContent.document && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Media</h3>
                      <div className="bg-white p-2 rounded border">
                        <div className="relative w-full h-64 rounded-md overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200">
                          {previewContent.media_type === 'image' ? (
                            <img
                              src={
                                previewContent.document?.includes("amazonaws.comcontent-document")
                                  ? previewContent.document.replace("amazonaws.comcontent-document", "amazonaws.com/content-document")
                                  : previewContent.document
                              }
                              alt="Content preview"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <embed
                              src={previewContent.document}
                              type="application/pdf"
                              className="w-full h-full"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No content details available
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default CalenderPostListView;