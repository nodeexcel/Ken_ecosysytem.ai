import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { LuCalendarDays, LuRefreshCw } from 'react-icons/lu'
import positive from '../assets/svg/analytics_positive.svg'
import negative from '../assets/svg/analytics_negative.svg'
import engaged from '../assets/svg/analytics_engaged.svg'
import noanswer from '../assets/svg/analytics_noanswer.svg'
import total_lead from '../assets/svg/analytics_total_lead.svg'
import total_responded from '../assets/svg/analytics_total_responded.svg'
import total_positives from '../assets/svg/analytics_total_positives.svg'
import total_negatives from '../assets/svg/analytics_total_negatives.svg'
import response_rate from '../assets/svg/analytics_response_rate.svg'
import positive_rate from '../assets/svg/analytics_positive_rate.svg'


const staticData1 = [
    {
        icon: positive,
        label: "Positive",
        value: "0 Leads"
    },
    {
        icon: negative,
        label: "Negative",
        value: "0 Leads"
    },
    {
        icon: engaged,
        label: "Engaged",
        value: "0 Leads"
    },
    {
        icon: noanswer,
        label: "No Answer",
        value: "0 Leads"
    },
]

const staticData2 = [
    {
        icon: total_lead,
        label: "Total Leads",
        value: "0 Leads"
    },
    {
        icon: total_responded,
        label: "Total Responded",
        value: "0 Leads"
    },
    {
        icon: total_positives,
        label: "Total Positives",
        value: "0 Leads"
    },
    {
        icon: total_negatives,
        label: "Total Negatives",
        value: "0 Negatives"
    },
    {
        icon: response_rate,
        label: "Response Rate",
        value: "0.0%"
    },
    {
        icon: positive_rate,
        label: "Positive Rate",
        value: "0.0%"
    },
]

function Analytics() {
    const [selectedDate, setSelectedDate] = useState(new Date())
    return (
        <div className="w-full p-4 flex flex-col gap-4 ">
            <div className="flex justify-between items-center">
                <div className='flex flex-col gap-2'>
                    <h1 className="text-[#1E1E1E] font-[600] text-xl md:text-[24px]">Analytics</h1>
                    <p className="text-[#1E1E1E] font-[400] text-[14px]">Here is what happened recently</p>
                </div>
                <div className='flex gap-2'>
                    <div className="relative">
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            customInput={
                                <button className="flex items-center gap-2 px-4 py-[8px] bg-white text-[#5A687C] border border-[#E1E4EA] rounded-lg text-[14px]">
                                    Today
                                    <LuCalendarDays className="text-[16px]" />
                                </button>
                            }
                        />
                    </div>
                    <select
                        value={""}
                        className="w-full bg-white border text-[#5A687C] text-[16px] font-[400] border-[#E1E4EA] px-4 py-2 rounded-lg "
                    >
                        <option value="" disabled>Sequence: All</option>
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="guest">Guest</option>
                    </select>
                    <div className="flex items-center px-3 gap-2 bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                        <LuRefreshCw color="#5E54FF" />
                        <button className="text-[16px] text-[#5A687C]">
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
            <hr style={{ color: "#E1E4EA" }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full">
                {staticData1.map((each) => (
                    <div
                        key={each.label}
                        className={`flex gap-2 rounded-lg border p-3 shadow-shadows-shadow-xs transition bg-white border-[#e1e4ea]`}
                    >
                        <div>
                            <img src={each.icon} alt={each.label} />
                        </div>
                        <div className='flex flex-col'>
                            <h1 className="text-[#5A687C] text-[14px] font-[400]">
                                {each.label}
                            </h1>
                            <p className="font-[600] text-[#1E1E1E] text-[24px]">
                                {each.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
                {staticData2.map((each) => (
                    <div
                        key={each.label}
                        className={`flex flex-col gap-2 rounded-lg border shadow-shadows-shadow-xs transition bg-white border-[#e1e4ea]`}
                    >
                        <h1 className="text-[#1E1E1E] p-2 bg-[#F2F2F7] text-[14px] font-[400]">
                            {each.label}
                        </h1>

                        <div className='flex gap-2 p-3 items-center'>
                            <div>
                                <img src={each.icon} alt={each.label} />
                            </div>
                            <p className="font-[600] text-[#1E1E1E] text-[24px]">
                                {each.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Analytics
