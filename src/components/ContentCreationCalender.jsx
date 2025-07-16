import React from 'react'
import Calendar from './Calendar'
import { useTranslation } from "react-i18next";

function ContentCreationCalender() {
  const { t } = useTranslation();
  return (
    <div className="w-full p-4 flex flex-col gap-4 overflow-auto h-screen">
      <div className="flex flex-row items-center justify-between mb-5">
        <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">{t("emailings.calendar")}</h1>
        <button className="w-[92px] h-[38px] bg-[#675FFF] rounded-[7px] border-[1.5px] border-[#5F58E8] px-[20px] py-[7px] flex items-center justify-center gap-[10px] text-white">Create</button>
      </div>
      <Calendar status={false}/>
    </div>
  )
}

export default ContentCreationCalender