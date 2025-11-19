import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CreatePost from "./CreatePost";
import CalendarPost from "./CalendarPost";
import CalendarPostListView from "./CalenderPostListView";
import calendar from "../assets/svg/calenderIcon.svg";
import list from "../assets/svg/listIcon.svg";
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
    <div className="w-full p-4 flex flex-col gap-4 overflow-auto h-screen">
      {!showCreatePost && (
        <>
          {/* <div className="flex flex-row items-center justify-between mb-5">
            <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">
              {t("constance.scheduler")}
            </h1>
             <button
              onClick={() => {
                setEditData(null);
                setShowCreatePost(true);
              }}
              className="w-[92px] h-[38px] cursor-pointer bg-[#675FFF] rounded-[7px] border-[1.5px] border-[#5F58E8] px-[20px] py-[7px] flex items-center justify-center gap-[10px] text-white"
            >
              {t("brain_ai.create_schedule")}
            </button>
          </div> */}
          <div className="flex flex-row justify-between gap-[10px] w-full max-h-[59px]">
            <div className="flex flex-col gap-[10px]">
              <h1 className="text-[#1E1E1E] text-[24px] leading-tight font-medium">
                {t("constance.scheduler")}
              </h1>
              <p className="font-[400] text-[16px] leading-tight text-[#5A687C]">
                {t("constance.scheduler_para")}    </p>
            </div>
            <div className="flex flex-row gap-[10px] h-[34px]">
              <div className="w-[158px] h-full rounded-[8px] border border-[#0000000D] flex p-[1px] gap-[4px] bg-[#F2F2F3]">
                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`
      flex-1 h-full flex items-center justify-center text-[13px] rounded-[8px]
      ${activeTab === "calendar"
                      ? "bg-[#FFFFFF] text-[#0A0D14]"
                      : "text-[#868C98]"
                    }
    `}
                >
                  {t("constance.calendar")}
                </button>

                <button
                  onClick={() => setActiveTab("list")}
                  className={`
      flex-1 h-full flex items-center justify-center text-[13px] rounded-[8px]
      ${activeTab === "list"
                      ? "bg-[#FFFFFF] text-[#0A0D14]"
                      : "text-[#868C98]"
                    }
    `}
                >
                  {t("constance.list_view")}
                </button>
              </div>

              <button
                onClick={() => {
                  setEditData(null);
                  setShowCreatePost(true);
                }}
                className="w-[146px] h-full cursor-pointer bg-[#675FFF] rounded-[8px] border-[1px] border-[#5F58E8] px-[10px] py-[6px] flex flex-row items-center justify-center gap-[8px] text-white whitespace-nowrap"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.99996 4.6665V7.99984M7.99996 7.99984V11.3332M7.99996 7.99984H4.66663M7.99996 7.99984H11.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[13px] font-medium leading-none">{t("brain_ai.create_schedule")}</span>
              </button>
            </div>
          </div>
          {/* <div className="flex bg-[#F8F8FF] border border-[#E0E0E0] rounded-[10px] w-[562px] h-[46px]">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center gap-2 px-4 py-4 rounded-[8px] text-sm font-medium w-[277px] ${activeTab === "calendar"
                  ? "bg-white text-[#1E1E1E] m-1"
                  : "text-[#5A687C]"
                }`}
            >
              <img src={calendar} alt="Calendar" className="w-4 h-4" />
              Calendar View
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex items-center gap-2 px-4 py-4 rounded-[8px] text-sm font-medium w-[277px] ${activeTab === "list"
                  ? "bg-white text-[#1E1E1E] m-1"
                  : "text-[#5A687C]"
                }`}
            >
              <img src={list} alt="List" className="w-4 h-4" />
              List View
            </button>
          </div> */}
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
