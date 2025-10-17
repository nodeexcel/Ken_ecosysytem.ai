import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PostNow, Preview, ThreeDots, Delete, Edit } from "../icons/icons";

function CalenderPostListView() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [agents] = useState([
    { id: 1, agent_name: "12Th sep,Fri", language: "english", voice: "Male - Deep", phone_numbers: "+1 (555) 123-4567", status: "Scheduled" },
    { id: 2, agent_name: "12Th sep,Fri", language: "hindi", voice: "Female - Soft", phone_numbers: "+91 98765-43210", status: "Scheduled" },
    { id: 3, agent_name: "12Th sep,Fri", language: "spanish", voice: "Male - Energetic", phone_numbers: "+34 612 345 678", status: "On Draft" },
    { id: 4, agent_name: "12Th sep,Fri", language: "japanese", voice: "Female - Calm", phone_numbers: "+81 90-1234-5678", status: "On Draft" },
    // ... add more if needed
  ]);

  const handleDropdownClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Pagination logic
  const totalPages = Math.ceil(agents.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentData = agents.slice(startIdx, startIdx + rowsPerPage);

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
              <th className="p-[14px]">Content</th>
              <th className="p-[14px]">{t("phone.status")}</th>
              <th className="p-[14px]">{t("phone.actions")}</th>
            </tr>
          </thead>

          <tbody className="border border-[#E1E4EA] w-full bg-white rounded-2xl p-3">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-4"><span className="loader" /></td></tr>
            ) : currentData.length > 0 ? (
              currentData.map((agent, index) => (
                <tr key={agent.id} className={`${index !== currentData.length - 1 ? "border-b border-[#E1E4EA]" : ""}`}>
                  <td className="p-[14px] font-medium text-gray-900">{agent.agent_name}</td>
                  <td className="p-[14px]">{agent.language.charAt(0).toUpperCase() + agent.language.slice(1)}</td>
                  <td className="p-[14px]">{agent.voice}</td>
                  <td className="p-[14px]">{agent.phone_numbers}</td>
                  <td className="p-[14px]">
                    <span className={`px-3 py-[4px] rounded-full text-sm font-medium ${agent.status === "Scheduled"
                      ? "text-[#00B871] bg-[#E8FFF3] border border-[#00B871]"
                      : "text-[#5A687C] bg-[#F4F5F6] border border-[#E1E4EA]"
                      }`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="p-[14px] whitespace-nowrap relative">
                    <button className="p-2 rounded-lg" onClick={() => handleDropdownClick(index)}>
                      <div className='bg-[#F4F5F6] p-2 rounded-lg'><ThreeDots /></div>
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
              ))
            ) : (
              <tr><td colSpan="6" className="text-center py-4">{t("phone.no_call_agents")}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-between items-center border-t border-[#E1E4EA] pt-3 text-[#5A687C] text-sm">
        <span>
          Show {startIdx + 1}-{Math.min(startIdx + rowsPerPage, agents.length)} of {agents.length}
        </span>

        <div className="flex items-center gap-2">
          <span>Row per page</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-[#E1E4EA] rounded-md px-2 py-1 focus:outline-none"
          >
            {[5, 10, 20].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>

          <div className="flex items-center ml-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded-md disabled:opacity-40"
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
                className={`mx-1 px-3 py-1 rounded-md ${currentPage === idx + 1
                  ? "bg-[#675FFF] text-white"
                  : "bg-white border border-[#E1E4EA] text-[#5A687C]"
                  }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded-md disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalenderPostListView;
