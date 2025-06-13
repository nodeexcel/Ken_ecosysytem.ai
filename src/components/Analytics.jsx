import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { LuCalendarDays, LuRefreshCw } from 'react-icons/lu'
import positive from '../assets/svg/analytics_positive.svg'
import negative from '../assets/svg/analytics_negative.svg'
import engaged from '../assets/svg/analytics_updated_engaged.svg'
import noanswer from '../assets/svg/analytics_updated_noanswer.svg'
import total_lead from '../assets/svg/analytics_total_lead.svg'
import total_responded from '../assets/svg/analytics_total_responded.svg'
import total_positives from '../assets/svg/analytics_total_positives.svg'
import total_negatives from '../assets/svg/analytics_total_negatives.svg'
import response_rate from '../assets/svg/analytics_response_rate.svg'
import positive_rate from '../assets/svg/analytics_positive_rate.svg'
import { getAppointmentSetter, getLeadAnalytics } from '../api/appointmentSetter'
import { format } from 'date-fns'
import { SelectDropdown } from './Dropdown'


const staticData1 = [
    {
        icon: positive,
        label: "Positive",
        key: "positive",
        value: "0"
    },
    {
        icon: negative,
        label: "Negative",
        key: "negative",
        value: "0"
    },
    {
        icon: engaged,
        label: "Engaged",
        key: "engaged",
        value: "0"
    },
    {
        icon: noanswer,
        label: "No Answer",
        key: "no_answer",
        value: "0"
    },
]

const staticData2 = [
    // {
    //     icon: total_lead,
    //     label: "Total Leads",
    //     value: "0 Leads"
    // },
    // {
    //     icon: total_responded,
    //     label: "Total Responded",
    //     value: "0 Leads"
    // },
    // {
    //     icon: total_positives,
    //     label: "Total Positives",
    //     value: "0 Leads"
    // },
    // {
    //     icon: total_negatives,
    //     label: "Total Negatives",
    //     value: "0 Negatives"
    // },
    {
        icon: response_rate,
        label: "Response Rate",
        key: "responded_rate",
        value: "0.0"
    },
    {
        icon: positive_rate,
        label: "Positive Rate",
        key: "positive_rate",
        value: "0.0"
    },
]

function Analytics() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [leadAnalytics, setLeadAnalytics] = useState({});
    const [agentSelect, setAgentSelect] = useState("all");
    const [agentsList, setAgentList] = useState([{ label: "All", key: "all" }]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        handleAgentList()
    }, [])

    useEffect(() => {
        handleLeadAnalytics(`?date=${format(selectedDate, 'yyyy-MM-dd')}&agent_id=${agentSelect}`)
    }, [selectedDate, agentSelect])

    const handleLeadAnalytics = async (path) => {
        setLoading(true)
        try {
            const response = await getLeadAnalytics(path);
            if (response.status === 200) {
                setLeadAnalytics(response.data)
                console.log(response?.data)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAgentList = async (path) => {
        try {
            const response = await getAppointmentSetter();
            if (response.status === 200) {
                if (response?.data?.agent?.length > 0) {
                    const updatedData = response.data.agent.map((e) => ({
                        label: e.agent_name,
                        key: e.agent_id
                    }))
                    setAgentList([{ label: "All", key: "all" }, ...updatedData]);
                }
                console.log(response?.data)
            }

        } catch (error) {
            console.log(error)
        }
    }

    // const selectedAgentName =
    //     agentSelect === "all"
    //         ? "All"
    //         : agentsList?.length > 0 && agentsList.find((a) => a.agent_id == agentSelect)?.agent_name || "";


    return (
        <div className="w-full  py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 ">
            <div className="flex justify-between items-center">
                <div className='flex flex-col gap-2'>
                    <h1 className="text-[#1E1E1E] font-[600] text-xl md:text-[24px]">Analytics</h1>
                    <p className="text-[#1E1E1E] font-[400] text-[14px]">Here is what happened recently</p>
                </div>
                <div className='flex w-fit gap-2'>
                    <div className="relative w-fit">
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            customInput={
                                <button className="flex w-full items-center gap-2 px-2 py-[10px] bg-white text-[#5A687C] border border-[#E1E4EA] rounded-lg text-[14px]">

                                    {format(selectedDate, 'yyyy-MM-dd')}
                                    <LuCalendarDays className="text-[16px]" />
                                </button>
                            }
                            className='w-full'
                        />
                    </div>
                    {/* <select
                        value={agentSelect}
                        onChange={(e) => {
                            setAgentSelect(e.target.value);
                        }}
                        className="w-fit bg-white border text-[#5A687C] text-[16px] font-[400] border-[#E1E4EA] px-3 py-2 rounded-lg "
                    >
                        <option value={agentSelect} disabled>
                            Agent: {selectedAgentName}
                        </option>
                        <option value="all" className={`${agentSelect == "all" && 'hidden'}`}>All</option>
                        {agentsList?.length > 0 &&
                            agentsList.map((e) => (
                                <option className={`${agentSelect == e.agent_id && 'hidden'}`} key={e.agent_id} value={e.agent_id}>
                                    {e.agent_name}
                                </option>
                            ))}
                    </select> */}

                    <SelectDropdown
                        name="analytics"
                        options={agentsList}
                        value={agentSelect}
                        onChange={(updated) => {
                            setAgentSelect(updated)
                        }}
                        placeholder="Select"
                        className="w-[187px]"
                        extraName="Agent"
                    />


                    <div onClick={() => handleLeadAnalytics(`?date=${format(selectedDate, 'yyyy-MM-dd')}&agent_id=${agentSelect}`)} className="flex items-center px-3 gap-2 cursor-pointer bg-white border border-[#E1E4EA] rounded-[8px] h-[40px]">
                        <LuRefreshCw color="#5E54FF" />
                        <button className="text-[16px] cursor-pointer text-[#5A687C]">
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
            <hr style={{ color: "#E1E4EA" }} />
            {loading ? <div className='flex justify-center items-center h-[50vh]'><span className='loader' /></div> : <>
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
                                    {leadAnalytics[each.key] ?? 0} Leads
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
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
                                    {leadAnalytics[each.key] ?? "0.0"} %
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </>}
        </div>
    )
}

export default Analytics
