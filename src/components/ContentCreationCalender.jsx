import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CreatePost from "./CreatePost";
import CalendarPost from "./CalendarPost";
import CalendarPostListView from './CalenderPostListView'
import calendar from "../assets/svg/calenderIcon.svg";
import list from "../assets/svg/listIcon.svg";
import { getCalenderScheduledContent } from "../api/contentCreationAgent";

function ContentCreationCalender() {
  const { t } = useTranslation();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const [calnderData, SetCalnderData] = useState([]);



  const fetchScduledContent = async () => {
    try {
      const response = await getCalenderScheduledContent();
      console.log(response,response.data.success,"response===========")
      if (response.status === 200) {
        const bots = response.data.content_details || [];
        SetCalnderData(bots)
        
      } else {
        console.error("Failed to fetch calender data");
      }
    } catch (error) {
      console.error("Error fetching calender data:", error);
    }
  };

    useEffect(() => {
      fetchScduledContent()
    }, [])

  return (
    <div className="w-full p-4 flex flex-col gap-4 overflow-auto h-screen">
      {!showCreatePost && (
        <>
          <div className="flex flex-row items-center justify-between mb-5">
            <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">
              {t("constance.scheduler")}
            </h1>
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-[92px] h-[38px] cursor-pointer bg-[#675FFF] rounded-[7px] border-[1.5px] border-[#5F58E8] px-[20px] py-[7px] flex items-center justify-center gap-[10px] text-white"
            >
              {t("brain_ai.create")}
            </button>
          </div>
          <div className="flex bg-[#F8F8FF] border border-[#E0E0E0] rounded-[10px]  w-[562px] h-[46px]">
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
          </div>
        </>
      )}
      {showCreatePost ? (
        <CreatePost onClose={() => setShowCreatePost(false)} />
      ) : activeTab === "calendar" ? (
        <CalendarPost status={false} calenderData={calnderData} />
      ): (
        <CalendarPostListView calenderData={calnderData} />
      )
      }
    </div >
  );
}

export default ContentCreationCalender;
