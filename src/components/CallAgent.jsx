import React from "react";
import { MoreHorizontal } from "lucide-react";

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
    <div className="w-full min-h-screen px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-black">Call Agents</h1>
        <button className="bg-[#7065F0] hover:bg-[#5a4ae0] text-white font-medium px-5 py-2 rounded-xl shadow-sm">
          New Agent
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {["Country", "Language", "Voice"].map((label) => (
          <select
            key={label}
            className="px-4 py-2 w-48 bg-white text-black border border-gray-300 rounded-xl shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%23333%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:1rem_1rem]"
          >
            <option>{label}</option>
          </select>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="text-gray-500 font-medium text-left">
              <th className="px-6 py-4">Agent Name</th>
              <th className="px-6 py-4">Language</th>
              <th className="px-6 py-4">Voice</th>
              <th className="px-6 py-4">Phone No</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} className="border-t border-transparent hover:bg-gray-50">
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
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreHorizontal size={18} className="text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
