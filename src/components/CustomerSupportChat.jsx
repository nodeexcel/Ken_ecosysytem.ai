import { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import { LuCalendarDays } from "react-icons/lu";
import { FaTrashAlt, FaDownload } from "react-icons/fa";
import { SelectDropdown } from "./Dropdown";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import calinaImg from "../assets/svg/calina_logo.svg";
import botAvatar from "../assets/svg/calina_logo.svg";
import { deleteSmartBotChatById, getSmartbotChatByAgentId, getSmartbotchatByChatId } from "../api/customerSupport";
import { Delete } from "../icons/icons";
import emptyChatbotImg from "../assets/svg/EmptyChat.svg";

function CustomerSupportChat({ agentId }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dropDown1, setDropDown1] = useState("all");
  const [dropDown2, setDropDown2] = useState("all");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [chatMessage, setchatMessage] = useState([]);
  const [deleteChat, setDeleteChat] = useState(false);
  const [chatId, setChatId] = useState(false);

  const [isChatVisible, setIsChatVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const options = [
    { label: t("brain_ai.all"), key: "all" },
    { label: "Select 1", key: "select_1" },
    { label: "Select 2", key: "select_2" },
  ];

  const fetchSmartBotsByAgentId = async () => {
    try {
      setLoading(true);
      const response = await getSmartbotChatByAgentId(agentId);
      if (response.status === 200 && response.data?.success) {
        setChatData(response.data.success);
      }
    } catch (error) {
      console.error("Error fetching smart bots:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSmartBotChatByChatId = async (chat_id) => {
    setChatId(chat_id)
    try {
      const response = await getSmartbotchatByChatId(chat_id);
      if (response.status === 200 && response.data?.chat) {
        setchatMessage(response.data.chat);
        setSelectedChat((prev) => ({
          ...prev,
          avatar_url: response.data.avatar_url || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching smart bot chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteSmartBotChatById(chatId)
      if (response?.status === 200) {
        fetchSmartBotsByAgentId()
        setDeleteChat(false);
        setIsChatVisible(false);
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetchSmartBotsByAgentId();
  }, []);

  useEffect(() => {
    const container = document.querySelector(".chat-scroll");
    if (container) container.scrollTop = container.scrollHeight;
  }, [chatMessage]);

  // Format date range for display
  const dateRangeDisplay = useMemo(() => {
    if (startDate && endDate) {
      const startFormatted = format(startDate, 'd MMM');
      const endFormatted = format(endDate, 'd MMM yyyy');
      return `${startFormatted} - ${endFormatted}`;
    } else if (startDate) {
      return `${format(startDate, 'd MMM')} - ...`;
    }
    return "Select date range";
  }, [startDate, endDate]);


  return (
    <div className="p-12 h-screen overflow-auto flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-[500] text-[#1E1E1E]">Chatbot Alpha</h1>
        <p className="text-[14px] font-[400] text-[#5A687C]">
          {t("calina.chats_descrp")}
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <DatePicker
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            onChange={(dates) => {
              const [start, end] = dates;
              if (start) setStartDate(start);
              if (end) setEndDate(end);
              // Reset if both are null
              if (!start && !end) {
                setStartDate(new Date());
                setEndDate(new Date());
              }
            }}
            dateFormat="d MMM"
            customInput={
              <button className="flex items-center cursor-pointer gap-2 px-4 py-[8px] bg-white text-[#5A687C] border border-[#E1E4EA] rounded-lg text-[16px] focus:border-[#675FFF] focus:outline-none">
                {dateRangeDisplay}
                <LuCalendarDays className="text-[16px]" />
              </button>
            }
          />
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center gap-2">
          <div className="w-38">
            <SelectDropdown
              name="dropDown1"
              options={options}
              placeholder="Sort By"
              value={dropDown1}
              onChange={(value) => setDropDown1(value)}
            />
          </div>
          <div className="w-38">
            <SelectDropdown
              name="dropDown2"
              options={options}
              placeholder="Status"
              value={dropDown2}
              onChange={(value) => setDropDown2(value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto overflow-y-auto h-[calc(100vh-200px)]">
        <div
          className={` p-[24px] rounded-[10px] mt-20 flex flex-col min-w-[720px] ${isChatVisible ? "flex-shrink-0" : "w-full"
            } transition-all duration-300`}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <span className="loader" />
            </div>
          ) : chatData.length > 0 ? (
            <div className="overflow-auto w-full">
              <table className="w-full">
                <thead className="border border-[#E1E4EA] rounded-2xl bg-[#F8F9FA]">
                  <tr className="text-left text-[#5A687C] text-[16px]">
                    <th className="p-[14px]">Name</th>
                    <th className="p-[14px]">Integration</th>
                    <th className="p-[14px]">Created On</th>
                  </tr>
                </thead>
                <tbody className="border border-[#E1E4EA] w-full bg-white rounded-2xl p-3">
                  {chatData.map((item, index) => (
                    <tr
                      key={item.chat_id}
                      className={`cursor-pointer hover:bg-[#F4F6FB] ${index !== chatData.length - 1
                        ? "border-b border-[#E1E4EA]"
                        : ""
                        } ${selectedChat?.chat_id === item.chat_id
                          ? "bg-[#EAF2FF]"
                          : ""
                        }`}
                      onClick={() => {
                        setSelectedChat(item);
                        setIsChatVisible(true);
                        fetchSmartBotChatByChatId(item.chat_id)
                      }}
                    >
                      <td className="p-[14px] font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="p-[14px] capitalize">{item.integration}</td>
                      <td className="p-[14px]">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col gap-3 items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-[#F1F1F1] rounded-full p-4 flex items-center justify-center">
                  <img src={emptyChatbotImg} alt="calina" className="object-fit h-25 w-25 mt-2 mr-2" />
                </div>
                <p className="text-[#1E1E1E] text-[18px] font-[600]">
                  {t("calina.no_charts_appear")}
                </p>
                <p className="text-[#5A687C] text-md font-[400]">
                  {t("calina.your_charts_conversations")}
                </p>
              </div>
            </div>
          )}
        </div>

        {isChatVisible && (
          <div className="border border-[#E1E4EA] bg-white rounded-[10px] min-w-[400px] max-w-[400px] flex flex-col flex-shrink-0">
            <div className="flex justify-between items-center border-b border-[#E1E4EA] px-4 py-3">
              <h2 className="text-[18px] font-semibold text-[#1E1E1E]">
                {selectedChat?.name || "Chat"}
              </h2>
              <div className="flex text-[#5A687C]">
                <button
                  className="block w-full cursor-pointer text-left px-2 hover:rounded-lg py-2 text-sm text-red-600 hover:bg-[#F4F5F6] font-[500]"
                  onClick={() => {
                    setDeleteChat(true);
                  }}
                >
                  <div className="flex items-center gap-2">{<Delete />}</div>
                </button>
                <button
                  className="block w-full cursor-pointer text-left px-2 hover:rounded-lg py-2 text-sm text-red-600 hover:bg-[#F4F5F6] font-[500]"
                >
                  <div className="flex items-center gap-2"><FaDownload className="cursor-pointer hover:text-[#675FFF]" /></div>
                </button>
              </div>
            </div>

            <div className="chat-scroll flex flex-col gap-4 p-4 overflow-y-auto h-[70vh]">
              {chatMessage && chatMessage.length > 0 ? (
                chatMessage.map((chat, idx) => (
                  <div key={idx} className="flex flex-col gap-3">
                    {chat.user?.message && (
                      <div className="flex justify-end gap-2">
                        <div className="max-w-[80%] px-4 py-2 bg-[#675FFF] text-white rounded-2xl rounded-br-none">
                          {chat.user.message}
                        </div>
                      </div>
                    )}
                    {chat.ai?.response && (
                      <div className="flex justify-start gap-2 items-start">
                        <img
                          src={selectedChat?.avatar_url || botAvatar}
                          alt="bot avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="max-w-[80%] px-4 py-2 bg-[#F3F4F6] text-[#1E1E1E] rounded-2xl rounded-bl-none">
                          {chat.ai.response}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-[#5A687C] text-[14px]">No messages yet.</div>
              )}
            </div>
            {
              deleteChat && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                  <div className="bg-white rounded-2xl w-[400px] p-6 relative shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Smart Bot Chat</h2>
                    <p className="text-gray-500 mb-4">Are you sure you want to delete this Smart Bot Chat?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeleteChat(false)}
                        className="w-full text-[16px] cursor-pointer text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
                      >
                        {t("phone.cancel")}
                      </button>
                      <button
                        onClick={() => {
                          handleDelete();

                        }}
                        className="w-full text-[16px] cursor-pointer text-white rounded-[8px] bg-red-500 h-[38px] flex justify-center items-center gap-2 relative"
                      >
                        {
                          t("brain_ai.delete")
                        }
                      </button>
                    </div>
                  </div>
                </div>
              )
            }

          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerSupportChat;
