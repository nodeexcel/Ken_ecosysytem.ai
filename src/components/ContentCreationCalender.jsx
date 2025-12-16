import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CreatePost from "./CreatePost";
import CalendarPost from "./CalendarPost";
import CalendarPostListView from "./CalenderPostListView";
import calendar from "../assets/svg/calenderIcon.svg";
import list from "../assets/svg/listIcon.svg";
import { Plus } from "lucide-react";
import { getCalenderScheduledContent, getContentDetails } from "../api/contentCreationAgent";

function ContentCreationCalender() {
  const { t } = useTranslation();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const [calenderData, setCalenderData] = useState([]);
  const [editData, setEditData] = useState(null);


  const fetchScduledContent = async () => {
    try {
      const response = await getCalenderScheduledContent();
      if (response.status === 200) {
        const bots = response.data.content_details || [];
        setCalenderData(bots);
      } else {
        console.error("Failed to fetch calender data");
      }
    } catch (error) {
      console.error("Error fetching calender data:", error);
    }
  };

  const handleEdit = async (contentId) => {
    try {
      const res = await getContentDetails(contentId);
      if (res?.success) {
        setEditData(res.success);
        setShowCreatePost(true);
      } else {
        console.error("Invalid response from getContentDetails:", res);
      }
    } catch (error) {
      console.error("Error fetching content details:", error);
    }
  };

  useEffect(() => {
    fetchScduledContent();
  }, []);

  return (
    <div className="w-full p-2 sm:p-4 lg:p-12 flex flex-col gap-3 sm:gap-4 overflow-auto h-full rounded-xl">
      {!showCreatePost && (
        <>
          {/* Header Section */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between w-full gap-3 xl:gap-0 mb-3 sm:mb-4 lg:mb-5">
            {/* Left Side - Title and Description */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <h1 className="text-[#1E1E1E] text-[20px] sm:text-[24px] lg:text-[24px] font-[600]">
                {t("constance.scheduler") || "Scheduler"}
              </h1>
              <p className="text-[#5A687C] text-[14px] sm:text-[15px] lg:text-[16px] font-[400]">
                Plan, organize, and manage all your scheduled posts in a visual calendar.
              </p>
            </div>

            {/* Right Side - View Controls and Create Button - Hidden on lg and below, shown on xl+ */}
            <div className="hidden xl:flex flex-row items-center gap-3 w-auto">
              {/* View Controls */}
              <div className="flex bg-[#F2F2F3] border border-[#E0E0E0] rounded-lg h-[36px] p-0.5 w-auto">
                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`flex items-center justify-center gap-2 px-2.5 cursor-pointer rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "calendar"
                      ? "bg-white text-[#1E1E1E] shadow-sm"
                      : "text-[#5A687C] hover:text-[#1E1E1E]"
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setActiveTab("list")}
                  className={`flex items-center justify-center gap-2 px-2.5 cursor-pointer rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "list"
                      ? "bg-white text-[#1E1E1E] shadow-sm"
                      : "text-[#5A687C] hover:text-[#1E1E1E]"
                  }`}
                >
                  List View
                </button>
              </div>

              {/* Create Schedule Button */}
              <button
                onClick={() => {
                  setEditData(null);
                  setShowCreatePost(true);
                }}
                className="flex items-center justify-center cursor-pointer gap-2 bg-[#675FFF] text-white px-5 py-2 rounded-lg font-[500] text-sm hover:bg-[#5a4fe6] transition-colors whitespace-nowrap"
              >
                <Plus size={18} />
                <span>Create Schedule</span>
              </button>
            </div>
          </div>

          {/* Buttons Section - Shown on lg and below, hidden on xl+ */}
          <div className="flex xl:hidden flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full mb-3 sm:mb-4">
            {/* View Controls */}
            <div className="flex bg-[#F2F2F3] border border-[#E0E0E0] rounded-lg h-[32px] sm:h-[36px] p-0.5 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("calendar")}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 cursor-pointer rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
                  activeTab === "calendar"
                    ? "bg-white text-[#1E1E1E] shadow-sm"
                    : "text-[#5A687C] hover:text-[#1E1E1E]"
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab("list")}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 cursor-pointer rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
                  activeTab === "list"
                    ? "bg-white text-[#1E1E1E] shadow-sm"
                    : "text-[#5A687C] hover:text-[#1E1E1E]"
                }`}
              >
                List View
              </button>
            </div>

            {/* Create Schedule Button */}
            <button
              onClick={() => {
                setEditData(null);
                setShowCreatePost(true);
              }}
              className="flex items-center justify-center cursor-pointer gap-1.5 sm:gap-2 bg-[#675FFF] text-white px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-lg font-[500] text-xs sm:text-sm hover:bg-[#5a4fe6] transition-colors whitespace-nowrap w-full sm:w-auto"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Create Schedule</span>
            </button>
          </div>
        </>
      )}

      {showCreatePost ? (
        <CreatePost onClose={(status) => {
          setShowCreatePost(false);
          setEditData(null);
          if (status === 'success') setActiveTab('list');
          fetchScduledContent();
        }}
          editData={editData}
        />
      ) : activeTab === "calendar" ? (
        <CalendarPost
          status={false}
          calenderData={calenderData}
          onEdit={handleEdit}
        />
      ) : (
        <CalendarPostListView
          calenderData={calenderData}
          setCalenderData={setCalenderData}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default ContentCreationCalender;
