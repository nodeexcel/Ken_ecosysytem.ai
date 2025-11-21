import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { PostNow, Preview, Delete, Edit } from "../icons/icons";
import { getContentDetails, deleteContent, postContent } from "../api/contentCreationAgent";
import { ChevronDown, ChevronLeft, ChevronRight, Cross, X } from "lucide-react";
import InstagramIcon from "../assets/svg/instagram.svg";
import TwitterIcon from "../assets/svg/twitter.svg";
import LinkedinIcon from "../assets/svg/linkedin_hr.svg";
import Search from "../assets/svg/search, magnifying glass.svg"
import ThreeDots from "../assets/svg/Icon.svg"
import i18n from "i18next";

function normalizeDate(dateStr) {
  if (!dateStr || dateStr === "--" || dateStr === "None") return null;

  // Case: DD/MM/YYYY (already ideal)
  if (dateStr.includes("/")) {
    const [dd, mm, yyyy] = dateStr.split("/");
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  }

  // Case: ISO or YYYY-MM-DD
  if (dateStr.includes("-")) {
    const d = new Date(dateStr);
    return isNaN(d) ? null : d;
  }

  return null;
}

function normalizeTime(timeStr) {
  if (!timeStr || timeStr === "None" || timeStr === "--") return null;

  // Remove spaces
  timeStr = timeStr.replace(/\s+/g, "");

  // If contains seconds or ms → strip them
  if (timeStr.includes(".")) timeStr = timeStr.split(".")[0];
  if (timeStr.split(":").length > 2) timeStr = timeStr.substring(0, 5);

  // Validate HH:MM
  const [h, m] = timeStr.split(":");
  if (!h || !m) return null;

  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}



function formatDisplayDateTime(dateStr, timeStr) {
  const locale = i18n.language === "fr" ? "fr-FR" : "en-US";

  const dateObj = normalizeDate(dateStr);
  if (!dateObj) return "--";

  const dateFormatted = dateObj.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timeFormatted = normalizeTime(timeStr, locale);

  return timeFormatted
    ? `${dateFormatted} · ${timeFormatted}`
    : dateFormatted;
}




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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const handleDropdownClick = (index, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // If dropdown would go below viewport, open upwards
    const shouldOpenUp = rect.bottom + 200 > windowHeight; // 200 = dropdown height estimate
    setDropdownDirection(shouldOpenUp ? 'up' : 'down');

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

  const totalPages = Math.ceil(calenderData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentData = calenderData.slice(startIdx, startIdx + rowsPerPage);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full p-4 flex flex-col gap-4 overflow-auto h-screen">
      <div className="justify-between max-h-[32px] flex flex-row">
        <div className="w-[240px] h-[32px] rounded-[8px] border-[0.5px] bg-white border-[#00000029] 
                flex flex-row items-center gap-[6px] px-[8px]">

          <img src={Search} className="w-[14px] h-[14px]" alt="search" />

          <input
            type="search"
            placeholder={t("brain_ai.search_here")}
            className="flex-1 bg-transparent outline-none border-none text-[13px] text-[#8C8C8C] font-[400]"
          />
        </div>

        <div className="flex flex-row gap-[10px] h-[32px] w-full max-w-[245px]">

          {/* Date Range Filter */}
          <div
            className="flex flex-row items-center justify-between 
               px-[10px] py-[6px] gap-[6px] 
               border-[0.5px] border-[#00000029] rounded-[8px]
               text-[13px] font-medium 
               h-full w-full flex-1 bg-white"
          >
            <span className="truncate">1 Aug - 31 Aug</span>
            <ChevronDown className="shrink-0 w-[13px]" />
          </div>

          {/* Campaign Filter */}
          <div
            className="flex flex-row items-center justify-between 
               px-[10px] py-[6px] gap-[6px] 
               border-[0.5px] border-[#00000029] rounded-[8px]
               text-[13px] font-medium 
               h-full w-full flex-1 bg-white"
          >
            <span className="truncate">Campaign</span>
            <ChevronDown className="w-[13px]" />
          </div>

        </div>

      </div>
      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        <div className="border border-[#D6D6D6] rounded-2xl overflow-hidden">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-[#F7F7F8]">
              <tr className="text-[#868C98]">
                <th className="px-6 text-start py-3 text-[13px] font-medium">{t("constance.date")} {t("constance.time")}</th>
                <th className="px-3 text-start py-3 text-[13px] font-medium">{t("Social_Accounts")}</th>
                <th className="px-3 text-start py-3 text-[13px] font-medium">{t("content")}</th>
                <th className="text-center py-3 text-[13px] font-medium">{t("phone.status")}</th>
                <th className="px-6 text-center py-3 text-[13px] font-medium">{t("phone.actions")}</th>
              </tr>
            </thead>

            <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#E1E4EA]">
              {loading ? (
                <tr className='h-34'>
                  <td></td>
                  <td></td>
                  <td className="text-center py-4"><span className="loader" /></td>
                  <td></td>
                  <td></td>
                </tr>
              ) : calenderData.length > 0 ? (
                calenderData?.slice().reverse().map((item, index) => {
                  const isPublished = item.scheduled_type === "publish";
                  const isDraft = item.scheduled_type === "draft";

                  // ✅ Date & Time Logic
                  let displayDate = "--";
                  let displayTime = "--";

                  if (isPublished && item.published_time) {
                    const [datePart, timePart] = item.published_time.split(" ");
                    displayDate = datePart;
                    displayTime = timePart?.split(".")[0] || "--";
                  } else {
                    displayDate = item.scheduled_date !== "None" ? item.scheduled_date : "--";
                    displayTime = item.scheduled_time !== "None" ? item.scheduled_time : "--";
                  }

                  let statusClass = "";
                  let dotClass = "";

                  const type = item.scheduled_type?.toLowerCase();

                  if (type === "publish") {
                    statusClass = "text-[#675FFF] bg-[#EDEAFF] border border-[#675FFF]";
                    dotClass = "bg-[#675FFF]";
                  } else if (type === "schedule") {
                    statusClass = "text-[#00B871] bg-[#E8FFF3] border border-[#00B871]";
                    dotClass = "bg-[#00B871]";
                  } else if (type === "draft") {
                    statusClass = "text-[#6B6B6B] bg-[#F0F0F0] border border-[#C9C9C9]";
                    dotClass = "bg-[#6B6B6B]";
                  }

                  return (
                    <tr key={item.scheduled_content_id} className="text-center">
                      {/* ✅ Date */}
                      <td className="px-4 py-4 text-[14px] text-[#1E1E1E] font-medium text-start">
                        {formatDisplayDateTime(displayDate, displayTime)}
                      </td>

                      {/* ✅ Platform */}
                      <td className="px-4 py-4 text-[14px] text-[#1E1E1E] font-medium text-start">
                        {(() => {
                          const { icon, name } = getPlatformDetails(item.platform);
                          return (
                            <div className="flex items-center gap-2">
                              {icon && (
                                <img
                                  src={icon}
                                  alt={name}
                                  className="w-[24px] h-[24px] object-contain"
                                />
                              )}
                              <span>{item?.account || ''}</span>
                            </div>
                          );
                        })()}
                      </td>

                      {/* ✅ Content */}
                      <td className="px-4 py-4 text-[14px] text-[#1E1E1E] font-medium text-start">
                        {item?.content || ''}
                      </td>

                      {/* ✅ Status Badge */}
                      <td className="py-4 text-[14px] text-center align-middle">
                        <div className="flex justify-center items-center">
                          <span className={`py-[8px] w-fit px-[12px] h-[26px] rounded-full flex items-center gap-2 text-sm font-medium ${statusClass}`}>
                            <span className={`w-1 h-1 rounded-full ${dotClass}`} />
                            <span>
                              {t(`${item.scheduled_type?.toLowerCase()}`)}
                            </span>

                          </span>
                        </div>
                      </td>

                      {/* ✅ Actions Dropdown */}
                      <td className="relative bg-[#FFFFFF] px-4 py-4 justify-center">
                        <div ref={dropdownRef} className="relative inline-block text-left">
                          <button
                            onClick={(e) => handleDropdownClick(index, e)}
                            className="text-gray-500 hover:text-gray-700  border  cursor-pointer border-[#00000029] rounded-[8px] p-2 bg-white"
                          >
                            <img src={ThreeDots} className="w-[16px] h-[16px] object-contain" />
                          </button>

                          {activeDropdown === index && (
                            <div
                              ref={dropdownRef} // move ref here, only wraps the actual dropdown
                              className={`absolute right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 z-10 ${dropdownDirection === "up" ? "bottom-full mb-2" : "mt-2"
                                }`}
                              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                            >
                              <div className="py-1">
                                {/* Always show Preview */}
                                <button
                                  className="block w-full text-left group px-4 py-2 cursor-pointer text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreview(item);
                                  }}
                                >
                                  <div className="flex items-center gap-2"><Preview /><span>{t("calina.preview")}</span></div>
                                </button>

                                {["schedule", "draft"].includes(item.scheduled_type?.toLowerCase()) && (
                                  <>
                                    <button
                                      className="block w-full text-left group px-4 py-2 cursor-pointer text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
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

                                    {/* 🚀 Post Now */}
                                    <button
                                      className="block w-full text-left group px-4 py-2 text-sm cursor-pointer text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500] cursor-pointer disabled:opacity-50"
                                      disabled={postNowLoading}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePostNowClick(item);
                                      }}
                                    >
                                      <div className="flex items-center gap-2">
                                        <PostNow />
                                        <span>{postNowLoading ? "Posting..." : `${t("calina.post_now")}`}</span>
                                      </div>
                                    </button>
                                  </>
                                )}


                                <hr className="my-2 border-[#E6EAEE]" />

                                {/* ✅ Always show Delete */}
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-[#FF3B30] cursor-pointer hover:bg-[#F4F5F6] font-[500]"
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
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className='h-34'>
                  <td></td>
                  <td></td>
                  <td className="text-center py-4">Scheduler Not Listed</td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between max-h-[36px] bg-[#F7F7F8] px-1 py-[2px]">
            {/* pagination + row controls */}
            <div className="flex items-center gap-2 ml-2">
              <button className="border-[0.5px] border-[#00000029] text-[#000000]  h-[28px] w-fit rounded-[8px] px-2 py-1 text-[13px] bg-white cursor-pointer">
                ‹ {t("prev")}
              </button>
              <button className="bg-[#675FFF] text-white rounded-[8px] w-7 h-7 mx-auto  text-[13px] cursor-pointer">
                1
              </button>
              <button className="border border-[#D6D6D6] text-[#000000] rounded-[8px] w-7 h-7 mx-auto  text-[13px] cursor-pointer">
                2
              </button>
              <button className="border border-[#D6D6D6] text-[#000000] rounded-[8px] w-7 h-7 mx-auto  text-[13px] cursor-pointer">
                3
              </button>
              <span className="text-[#000000] text-sm">…</span>
              <button className="border border-[#D6D6D6] text-[#000000] rounded-[8px] w-7 h-7 mx-auto  text-[13px] cursor-pointer">
                10
              </button>
              <button className="border-[0.5px] border-[#00000029] text-[#000000]  h-[28px] w-fit rounded-[8px] px-2 py-1 text-[13px] bg-white cursor-pointer">
                {t("next")} ›
              </button>
            </div>

            {/* Right side – rows per page */}
            <div className="flex items-center gap-2 text-[13px] text-[#5A687C] mr-2">

              <button className="border border-[#D6D6D6] rounded-[8px] px-2 py-1 text-[#000000] bg-white cursor-pointer">5 {t("brain_ai.rows")}</button>
              <button className="text-[#000000] hover:bg-white cursor-pointer">10</button>
              <button className=" text-[#000000] hover:bg-white cursor-pointer">20</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalStatus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-[460px] p-8 relative shadow-xl">

            <button
              className="absolute top-5 right-5 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={closeModals}
              disabled={deleteLoading}
            >
              <X size={22} />
            </button>

            <div className="flex flex-col items-center text-center gap-5">

              <h2 className="text-[22px] font-semibold text-[#1E1E1E]">
                {t("settings.tab_1_list.delete_header")}
              </h2>

              <p className="text-[#5A687C] text-[15px] leading-relaxed px-2">
                Are you sure you want to delete this scheduled post?
                This action cannot be undone.
              </p>

              {error && (
                <div className="w-full p-2 text-xs bg-red-100 border border-red-300 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-4 w-full pt-2">
                <button
                  className="w-full cursor-pointer bg-[#FF3B30] text-white px-5 py-3 font-[500] text-[16px] rounded-lg hover:bg-[#ff2b20] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : t("settings.tab_1_list.confirm_delete")}
                </button>

                <button
                  className="w-full cursor-pointer bg-white text-[#5A687C] border-[1.5px] border-[#E1E4EA] font-[500] text-[16px] px-5 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
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