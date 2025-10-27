import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PostNow, Preview, ThreeDots, Delete, Edit } from "../icons/icons";

function CalenderPostListView({ calenderData = [] }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const handleDropdownClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Pagination logic
  const totalPages = Math.ceil(calenderData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentData = calenderData.slice(startIdx, startIdx + rowsPerPage);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full p-4 flex flex-col gap-4 overflow-auto h-screen">
      <div className="overflow-auto w-full">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[#5A687C] text-[16px]">
              <th className="p-[14px]">Date</th>
              <th className="p-[14px]">Time</th>
              <th className="p-[14px]">Social Accounts</th>
              <th className="p-[14px]">{t("phone.status")}</th>
              <th className="p-[14px]">{t("phone.actions")}</th>
            </tr>
          </thead>

          <tbody className="border border-[#E1E4EA] w-full bg-white rounded-2xl p-3">

            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <span className="loader" />
                </td>
              </tr>
            ) : calenderData.length > 0 ? (
              calenderData.map((item, index) => {
                const statusClass =
                  item.scheduled_type === "publish"
                    ? "text-[#675FFF] bg-[#EDEAFF] border border-[#675FFF]"
                    : "text-[#00B871] bg-[#E8FFF3] border border-[#00B871]";

                return (
                  <tr key={item.scheduled_content_id} className={`${index !== calenderData.length - 1 ? "border-b border-[#E1E4EA]" : ""}`}>
                    <td className="p-[14px] font-medium text-gray-900">
                      {item.scheduled_date !== "None" ? item.scheduled_date : "--"}
                    </td>
                    <td className="p-[14px]">
                      {item.scheduled_time !== "None" ? item.scheduled_time : "--"}
                    </td>
                    <td className="p-[14px] capitalize">
                      {item.platform}
                    </td>
                    <td className="p-[14px]">
                      <span className={`px-3 py-[4px] rounded-full text-sm font-medium ${statusClass}`}>
                        {item.scheduled_type}
                      </span>
                    </td>

                    <td className="p-[14px] whitespace-nowrap relative">
                      <button className="p-2 rounded-lg" onClick={() => handleDropdownClick(index)}>
                        <div className='bg-[#F4F5F6] p-2 rounded-lg'>
                          <ThreeDots />
                        </div>

                        {activeDropdown === index && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 z-10">
                            <div className="py-1">
                              <button className="block w-full text-left group px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500] cursor-pointer">
                                <div className="flex items-center gap-2"><Preview /><span>Preview</span></div>
                              </button>
                              <button className="block w-full text-left group px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500] cursor-pointer">
                                <div className="flex items-center gap-2"><Edit /><span>{t("edit")}</span></div>
                              </button>
                              <button className="block w-full text-left group px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] hover:bg-[#F4F5F6] font-[500] cursor-pointer">
                                <div className="flex items-center gap-2"><PostNow /><span>Post Now</span></div>
                              </button>
                              <hr className="my-2 border-[#E6EAEE]" />
                              <button className="block w-full text-left px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6] font-[500] cursor-pointer">
                                <div className="flex items-center gap-2"><Delete /><span>{t("delete")}</span></div>
                              </button>
                            </div>
                          </div>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">Scheduler Not Listed</td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CalenderPostListView;
