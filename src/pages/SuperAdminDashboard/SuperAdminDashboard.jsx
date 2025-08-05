import React, { useState } from "react";
import {
  SuperAdminActiveAgents,
  SuperAdminDailyMessages,
  SuperAdminDailyEmails,
  SuperAdminDailyCalls,
  SuperAdminTotalusers,
  SuperAdminDailySubscription,
  SuperAdminProfileDeleteCount,
} from "../../icons/icons";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const staticData = [
  {
    list: [
      { label: "Total Users", icon: <SuperAdminTotalusers />, value: 1532 },
      { label: "Active Agents", icon: <SuperAdminActiveAgents />, value: 305 },
      {
        label: "Daily Messages",
        icon: <SuperAdminDailyMessages />,
        value: 1820,
      },
      { label: "Daily Emails", icon: <SuperAdminDailyEmails />, value: 1095 },
      { label: "Daily Calls", icon: <SuperAdminDailyCalls />, value: 568 },
      { label: "Daily Subscription", icon: <SuperAdminDailySubscription />, value: 500 },
      { label: "Profile Delete Count", icon: <SuperAdminProfileDeleteCount />, value: 10 },
    ],
  },
];

const Tableheaders = [
  { label: "Agent Type", value: "agentType" },
  { label: "Count", value: "count" },
];

const TableData = [
  { agentType: "Appointment", count: 120 },
  { agentType: "Emailing", count: 150 },
  { agentType: "Telephony", count: 35 },
];

const doughnutData = {
  labels: ["Failed Integrations", "Long response delays"],
  datasets: [
    {
      label: "Health Status",
      data: [5, 12, 11],
      backgroundColor: ["#FF3B30", "#34C759", "#F8F8F8"],
      borderWidth: 1,
    },
  ],
};
const doughnutOptions = {
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  cutout: "70%",
};

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <div className="m-0">
        <h1 className="w-full mt-0.5 border-b border-[#E1E4EA] font-medium p-2 ml-0 m-0 font-Semibold text-[#1E1E1E] text-[26px]">Dashboard</h1>
      </div>
    <div className="w-full p-4 flex flex-col gap-4">
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <span className="loader" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          {staticData.map((e, idx) => (
            <div key={idx} className="p-4 flex flex-col gap-3 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 w-full">
                {e.list.map((each) => (
                  <div
                    key={each.label}
                    className="flex flex-col gap-2 rounded-lg border shadow-shadows-shadow-xs transition bg-white border-[#e1e4ea]"
                  >
                    <h1 className="text-[#1E1E1E] p-2 bg-[#F2F2F7] text-[14px] font-[400]">
                      {each.label}
                    </h1>
                    <div className="flex gap-4 p-3 items-center">
                      {each.icon}
                      <p className="font-[600] text-[#1E1E1E] text-[24px]">
                        {each.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Active Agents & Health Indicators */}
          <div className="flex flex-col lg:flex-row gap-4 max-w-[1180px]">
            {/* Active Agents Table */}
            <div className="flex-1 border border-[#e1e4ea] bg-[#FFFFFF] rounded-lg p-6">
              <h1 className="text-[#1E1E1E] text-[20px] font-[600] mb-6 mt-1.5">
                Active Agents
              </h1>
              <table className="w-full table-auto overflow-hidden rounded-r">
                <thead>
                  <tr className="bg-[#F2F2F7]">
                    {Tableheaders.map((header, i) => (
                      <th
                        key={i}
                        className={`px-7 py-2 text-${
                          i === 0 ? "left" : "right"
                        } w-1/2 ${
                          i === 0 ? "rounded-[7px]" :
                          i === Tableheaders.length - 1 ? "rounded-[7px]" : ""
                        }`}
                      >
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TableData.map((row, index) => (
                    <tr key={index} className={index === 0 ? "" : "border-t border-[#e1e4ea]"}>
                      <td className="px-7 py-2 text-left">{row.agentType}</td>
                      <td className="px-7 py-2 text-right">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex-1 border border-[#e1e4ea] bg-[#FFFFFF] rounded-lg p-6">
              <h1 className="text-[#1E1E1E] text-[18px] font-[600] mb-4">
                Health Indicators
              </h1>
              <div className="flex items-start gap-15 ">
                <div className="w-45 h-45">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
                <div className="flex-1 w-full px-10 py-6">
                  <div className="flex flex-col rounded-lg border border-[#e1e4ea] w-full overflow-hidden">
                    {doughnutData.labels.map((label, index) => (
                      <div key={index}>
                        <div className="py-2 px-3">
                          <div className="text-[14px] text-[#5A687C] mb-1">
                            {label}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-6 h-6 rounded-lg"
                              style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[index] }}
                            />
                            <span className="text-[20px] font-bold text-[#000000]">
                              {doughnutData.datasets[0].data[index]}
                            </span>
                          </div>
                        </div>
                        {index < doughnutData.labels.length - 1 && (
                          <hr className="border-t border-[#e1e4ea] w-full m-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default SuperAdminDashboard;
