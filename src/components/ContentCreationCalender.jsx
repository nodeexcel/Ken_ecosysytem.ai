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
    <div className="w-full p-6 flex flex-col gap-4 overflow-auto h-screen">
      {!showCreatePost && (
        <>
          {/* Header Section */}
          <div className="flex items-start justify-between w-full mb-5">
            {/* Left Side - Title and Description */}
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1E1E1E] text-[28px] font-[600]">
                {t("constance.scheduler") || "Scheduler"}
              </h1>
              <p className="text-[#5A687C] text-[16px] font-[400]">
                Plan, organize, and manage all your scheduled posts in a visual calendar.
              </p>
            </div>

            {/* Right Side - View Controls and Create Button */}
            <div className="flex items-center gap-3">
              {/* View Controls */}
              <div className="flex bg-[#F2F2F3] border border-[#E0E0E0] rounded-lg h-[36px] p-0.5">
                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`flex items-center gap-2 px-2.5 cursor-pointer rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "calendar"
                      ? "bg-white text-[#1E1E1E] shadow-sm"
                      : "text-[#5A687C] hover:text-[#1E1E1E]"
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setActiveTab("list")}
                  className={`flex items-center gap-2 px-2.5 cursor-pointer rounded-lg text-sm font-medium transition-colors ${
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
                className="flex items-center cursor-pointer gap-2 bg-[#675FFF] text-white px-5 py-2 rounded-lg font-[500] text-sm hover:bg-[#5a4fe6] transition-colors whitespace-nowrap"
              >
                <Plus size={18} />
                <span>Create Schedule</span>
              </button>
            </div>
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
