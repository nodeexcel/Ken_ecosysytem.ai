import React, { useState } from 'react'
import Calendar from './Calendar'
import { useTranslation } from "react-i18next";
import CreatePost from './CreatePost';

function ContentCreationCalender() {
  const { t } = useTranslation();
  const [showCreatePost, setShowCreatePost] = useState(false);
  return (
    <div className="w-full p-4 flex flex-col gap-4 overflow-auto h-screen">
      {!showCreatePost && (
        <div className="flex flex-row items-center justify-between mb-5">
          <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">Scheduler</h1>
          <button onClick={() => setShowCreatePost(true)} className="w-[92px] h-[38px] bg-[#675FFF] rounded-[7px] border-[1.5px] border-[#5F58E8] px-[20px] py-[7px] flex items-center justify-center gap-[10px] text-white">Create</button>
        </div>
      )}
      {showCreatePost ? (
        <CreatePost onClose={() => setShowCreatePost(false)} />
      ) : (
        <Calendar status={false}/>
      )}
    </div>
  )
}

export default ContentCreationCalender