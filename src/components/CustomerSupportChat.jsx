import { useState } from "react"
import DatePicker from "react-datepicker"
import { LuCalendarDays } from "react-icons/lu"
import { SelectDropdown } from "./Dropdown"
import { useTranslation } from "react-i18next"
import calinaImg from "../assets/svg/calina_logo.svg"

function CustomerSupportChat() {
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [dropDown1, setDropDown1] = useState("all")
    const [dropDown2, setDropDown2] = useState("all")
    const { t } = useTranslation()

    const options = [{ label: "All", key: "all" }, { label: "Select 1", key: "select_1" }, { label: "Select 2", key: "select_2" }]
    return (
        <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 w-full">
            <h1 className="text-[24px] font-[600] text-[#1E1E1E]">Chats</h1>
            <p className="text-[14px] font-[400] text-[#5A687C] py-1">View all chats handled by your chatbot here, with filters by date, integration, or tag.</p>

            <div className='flex flex-wrap gap-2'>
                <div className="relative">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        customInput={
                            <button className="flex items-center cursor-pointer gap-2 px-4 py-[8px] bg-white text-[#5A687C] border border-[#E1E4EA] rounded-lg text-[16px]  focus:border-[#675FFF] focus:outline-none">
                                {
                                    t("phone.start_date")
                                }
                                <LuCalendarDays className="text-[16px]" />
                            </button>
                        }
                    />
                </div>
                <div className="relative">
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        customInput={
                            <button className="flex items-center cursor-pointer gap-2 px-4 py-[8px] bg-white text-[#5A687C] border border-[#E1E4EA] rounded-lg text-[16px]  focus:border-[#675FFF] focus:outline-none">
                                {
                                    t("phone.end_date")
                                }
                                <LuCalendarDays className="text-[16px]" />
                            </button>
                        }
                    />
                </div>
                <div className="w-38">
                    <SelectDropdown
                        name="dropDown1"
                        options={options}
                        placeholder={t("emailings.campaign")}
                        value={dropDown1}
                        onChange={(value) => setDropDown1(value)}
                    />
                </div>
                <div className="w-38">
                    <SelectDropdown
                        name="dropDown1"
                        options={options}
                        placeholder={t("emailings.campaign")}
                        value={dropDown2}
                        onChange={(value) => setDropDown2(value)}
                    />
                </div>
            </div>
            <div className="border border-[#E1E4EA] bg-white p-[24px] justify-center items-center rounded-[10px] flex flex-col h-full">
                <div className="flex flex-col gap-3 items-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex justify-center items-center">
                            <img src={calinaImg} alt={"calina"} className="object-fit" />
                        </div>
                        <p className="text-[#1E1E1E] text-[18px] font-[600]">No chats at the moment</p>
                        <p className="text-[#5A687C] text-[14px] font-[400]">Your chatbot conversations will appear here</p>
                        <div className="pt-2">
                            <button className="border-[1.5px] text-[#fff] rounded-[7px] bg-[#675FFF] px-[20px] py-[7px] border-[#5F58E8]">Refresh</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerSupportChat
