import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { PostNow, Preview, ThreeDots, Delete, Edit } from "../icons/icons";
import { getContentDetails, deleteContent, postContent } from "../api/contentCreationAgent";
import { Cross, X } from "lucide-react";
import InstagramIcon from "../assets/svg/instagram.svg";
import TwitterIcon from "../assets/svg/twitter.svg";
import LinkedinIcon from "../assets/svg/linkedin_hr.svg";

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

  // Pagination logic
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
      <div className="overflow-auto w-full">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[#5A687C] text-[16px]">
              <th className="p-[14px]">Date</th>
              <th className="p-[14px]">Time</th>
              <th className="p-[14px]">Social Accounts</th>
              <th className="p-[14px]">{t("phone.status")}</th>
              <th className="p-[14px]">{t("phone.actions")}</th>
            </tr>
          </thead>

          <tbody className="border border-[#E1E4EA] w-full bg-white rounded-2xl p-3">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-4"><span className="loader" /></td></tr>
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

                // ✅ Status Badge Color
                const statusClass =
                  isPublished
                    ? "text-[#675FFF] bg-[#EDEAFF] border border-[#675FFF]"
                    : "text-[#00B871] bg-[#E8FFF3] border border-[#00B871]";

                return (
                  <tr key={item.scheduled_content_id} className={`${index !== calenderData.length - 1 ? "border-b border-[#E1E4EA]" : ""}`}>

                    {/* ✅ Date */}
                    <td className="p-[14px] font-medium text-gray-900">
                      {displayDate}
                    </td>

                    {/* ✅ Time */}
                    <td className="p-[14px]">
                      {displayTime}
                    </td>

                    {/* ✅ Platform */}
                    <td className="p-[14px] capitalize">
                      {item.platform}
                    </td>

                    {/* ✅ Status Badge */}
                    <td className="p-[14px]">
                      <span className={`px-3 py-[4px] rounded-full text-sm font-medium ${statusClass}`}>
                        {item.scheduled_type}
                      </span>
                    </td>

                    {/* ✅ Actions Dropdown */}
                    <td className="p-[14px] whitespace-nowrap relative">
                      <button
                        className="p-2 rounded-lg"
                        onClick={(e) => handleDropdownClick(index, e)}
                      >
                        <div className='bg-[#F4F5F6] p-2 rounded-lg'>
                          <ThreeDots />
                        </div>
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
                              className="block w-full text-left group px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500]"
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

                                {/* 🚀 Post Now */}
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

                            {/* ✅ Always show Delete */}
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6] font-[500]"
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
              <tr><td colSpan="6" className="text-center py-4">Scheduler Not Listed</td></tr>
            )}
          </tbody>
        </table>
        {error && (
          <div className="text-center text-red-600 text-sm mt-2 bg-red-50 border border-red-200 p-2 rounded">
            {error}
          </div>
        )}
      </div>

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