// Full-featured modal with pixel-perfect layout, click-outside-to-close, and toggle logic.
import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, X } from "lucide-react";

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
    id: 1,
    name: "Sami",
    language: "02-05-2024",
    voice: "Francais",
    calls: "184 Calls",
    status: "Completed",
  },
  {
    id: 1,
    name: "Sami",
    language: "02-05-2024",
    voice: "Francais",
    calls: "184 Calls",
    status: "Completed",
  },
  {
    id: 1,
    name: "Sami",
    language: "02-05-2024",
    voice: "Francais",
    calls: "184 Calls",
    status: "Completed",
  },
  {
    id: 1,
    name: "Sami",
    language: "02-05-2024",
    voice: "Francais",
    calls: "184 Calls",
    status: "Completed",
  },
  {
    id: 1,
    name: "Sami",
    language: "02-05-2024",
    voice: "Francais",
    calls: "184 Calls",
    status: "Completed",
  }
];

export default function CallCampaign() {
  const [showModal, setShowModal] = useState(false);
  const [toggleTom, setToggleTom] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }
    if (showModal) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  return (
    <div className="w-full px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-black">Call Campaign</h1>
        <button
          className="bg-[#7065F0] hover:bg-[#5a4ae0] text-white font-medium px-5 py-2 rounded-xl shadow-sm"
          onClick={() => setShowModal(true)}
        >
          Add Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {['Country', 'Language', 'Voice'].map((label) => (
          <select
            key={label}
            className="px-4 py-2 w-48 bg-white text-black border border-gray-300 rounded-lg shadow-sm"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-30 bg-opacity-30 flex items-center justify-center">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl z-40 w-full max-w-2xl p-6 relative h-[90vh] overflow-y-auto"
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-6">Add New Campaign</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  placeholder="Enter campaign name"
                  className="w-full px-4 py-2 border rounded-xl border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Language</label>
                  <select className="w-full px-4 py-2 border rounded-xl border-gray-300">
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Voice</label>
                  <select className="w-full px-4 py-2 border rounded-xl border-gray-300">
                    <option>Select</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Choose Calendar</label>
                  <select className="w-full px-4 py-2 border rounded-xl border-gray-300">
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Max Call Time (Minutes)</label>
                  <select className="w-full px-4 py-2 border rounded-xl border-gray-300">
                    <option>Select</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Target Lists</label>
                <select className="w-full px-4 py-2 border rounded-xl border-gray-300">
                  <option>Select</option>
                </select>
                <button className="text-[#7065F0] text-sm font-medium mt-1">+ Create New Contact List</button>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Choose an Agent</label>
                <select className="w-full px-4 py-2 border rounded-xl border-gray-300">
                  <option>Select</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter number"
                  className="w-full px-4 py-2 border rounded-xl border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-gray-700">
                  Tom, Engages the Conversation
                </span>
                <button
                  onClick={() => setToggleTom(!toggleTom)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${
                    toggleTom ? "bg-[#7065F0]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                      toggleTom ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  ></span>
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Your Catch Phrase</label>
                <textarea
                  placeholder="Enter your catch phrase"
                  className="w-full px-4 py-2 border rounded-xl border-gray-300"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Your Call Script</label>
                <textarea
                  placeholder="Enter your call script"
                  className="w-full px-4 py-2 border rounded-xl border-gray-300"
                  rows={4}
                />
              </div>

              <div className="flex gap-4 mt-6 justify-between">
                <button className="px-6 py-2 border rounded-xl text-gray-700 border-gray-300 w-[45%]">
                  Test Call
                </button>
                <button className="px-6 py-2 bg-[#7065F0] text-white rounded-xl w-[45%]">
                  Launch Calls
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
