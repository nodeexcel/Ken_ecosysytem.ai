import React from "react";
import { MoreHorizontal } from "lucide-react";
import { ThreeDots } from "../icons/icons";

const agents = [
  {
    id: 1,
    name: "Sami",
    language: "02-05-2024",
    voice: "Francais",
    calls: "184 Calls",
    status: "Completed",
  },
  {
    id: 2,
    name: "Sami",
    language: "02-05-2024",
    voice: "Francais",
    calls: "184 Calls",
    status: "Completed",
  },
  {
    id: 3,
    name: "Sami",
    language: "02-05-2024",
    voice: "Francais",
    calls: "184 Calls",
    status: "Completed",
  },
];

export default function CallAgentsPage() {
  return (
    <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-semibold text-black">Call Agents</h1>
        <button className="bg-[#7065F0] text-white font-medium px-5 py-2 rounded-lg shadow">
          New Agent
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-3">
        {["Country", "Language", "Voice"].map((label) => (
          <select
            key={label}
            className="px-4 py-2 w-48 bg-white text-[#5A687C] border border-gray-300 rounded-lg shadow appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%23333%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:1rem_1rem]"
          >
            <option>{label}</option>
          </select>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-auto w-full rounded-2xl">
        <table className="w-full rounded-2xl">
          <thead>
            <tr className="text-left text-[#5a687c] text-[16px]">
              <th className="px-6 py-3 font-medium whitespace-nowrap">Agent Name</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Language</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Voice</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Phone No</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Status</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white border border-[#E1E4EA] p-3">
            {agents.map((agent, index) => (
              <tr
                key={agent.id}
                className={`hover:bg-gray-50 ${index !== agents.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">{agent.name}</td>
                <td className="px-6 py-4">{agent.language}</td>
                <td className="px-6 py-4">{agent.voice}</td>
                <td className="px-6 py-4">{agent.calls}</td>
                <td className="px-6 py-4">
                  <span className="inline-block border border-green-500 text-green-600 text-sm font-medium px-3 py-1 rounded-full">
                    {agent.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className='flex items-center gap-2'>
                    <button className='text-[#5A687C] px-2 py-1 border-2 text-[16px] font-[500] border-[#E1E4EA] rounded-lg'>
                      View Report
                    </button>
                    <button className="p-2 rounded-lg">
                      <div className='bg-[#F4F5F6] p-2 rounded-lg'><ThreeDots /></div>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
