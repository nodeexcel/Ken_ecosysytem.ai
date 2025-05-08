// Full-featured modal with pixel-perfect layout, click-outside-to-close, and toggle logic.
import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, X } from "lucide-react";
import { BritishFlag, Delete, Duplicate, Edit, Notes, TestCall } from "../icons/icons";

const agents = [
  {
    id: 1,
    campaign_name: "XYZ Campaign",
    agent_name: "Sami  chosen by the user",
    creation_date: "02-05-2024",
    language: "Francais",
    total_calls: "184 Calls",
    status: "Completed",
  },
  {
    id: 2,
    campaign_name: "XYZ Campaign",
    agent_name: "Sami  chosen by the user",
    creation_date: "02-05-2024",
    language: "Francais",
    total_calls: "91 Calls",
    status: "Pending",
  },
  {
    id: 3,
    campaign_name: "XYZ Campaign",
    agent_name: "Sami  chosen by the user",
    creation_date: "02-05-2024",
    language: "Francais",
    total_calls: "302 Calls",
    status: "Completed",
  },
];

const staticData = [
  {
    label: "Total calls",
    value: "0"
  },
  {
    label: "Unsuccessful calls",
    value: "0"
  },
  {
    label: "Average call duration",
    value: "0"
  },
  {
    label: "Total call time",
    value: "00:00:00"
  }
]

const countries = [
  { name: "United States", code: "US", dial_code: "+1", flag: <BritishFlag /> },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: <BritishFlag /> },
  { name: "India", code: "IN", dial_code: "+91", flag: <BritishFlag /> },
  // Add more countries as needed
];

export default function CallCampaign() {
  const [showModal, setShowModal] = useState(false);
  const [secondModel, setSecondModel] = useState(false);
  const [toggleTom, setToggleTom] = useState(true);
  const modalRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewReportModel, setViewReportModel] = useState(false)

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }
    if (showModal) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  const handleDropdownClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className="p-4 flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-black">Call Campaign</h1>
        <button
          className="bg-[#7065F0] text-white font-medium px-5 py-2 rounded-lg shadow"
          onClick={() => setShowModal(true)}
        >
          New Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-3">
        {['Country', 'Language', 'Voice'].map((label) => (
          <select
            key={label}
            className="px-4 py-2 w-48 bg-white text-[#5A687C] border border-gray-300 rounded-lg shadow-sm"
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
              <th className="px-6 py-3 font-medium whitespace-nowrap">Campaign Name</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Agent Name</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Creation Date</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Language</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Total Calls</th>
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
                <td className="px-6 py-4 font-medium text-gray-900">{agent.campaign_name}</td>
                <td className="px-6 py-4">{agent.agent_name}</td>
                <td className="px-6 py-4">{agent.creation_date}</td>
                <td className="px-6 py-4">{agent.language}</td>
                <td className="px-6 py-4">{agent.total_calls}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block border ${agent.status !== "Pending" ? "text-[#34C759] bg-[#EBF9EE] border-[34C759]" : "text-[#FF3B30] border-[#FF3B30] bg-[#F4E1E0]"} text-sm font-medium px-3 py-1 rounded-full`}>
                    {agent.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDropdownClick(index)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreHorizontal size={18} className="text-gray-500" />
                  </button>
                  {activeDropdown === index && (
                    <div className="absolute right-6  w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-gray-100"
                          onClick={() => {
                            // Handle edit action
                            setActiveDropdown(null);
                          }}
                        >
                          <div className="flex items-center gap-2">{<Edit />} <span className="hover:text-[#675FFF]">Edit</span> </div>
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6]"
                          onClick={() => {
                            // Handle delete action
                            setActiveDropdown(null);
                          }}
                        >
                          <div className="flex items-center gap-2">{<Duplicate />} <span className="hover:text-[#675FFF]">Duplicate</span> </div>
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:bg-[#F4F5F6]"
                          onClick={() => {
                            // Handle delete action
                            setActiveDropdown(null);
                            setViewReportModel(true)
                          }}
                        >
                          <div className="flex items-center gap-2">{<Notes />} <span className="hover:text-[#675FFF]">View Report</span> </div>
                        </button>
                        <hr style={{ color: "#E6EAEE" }} />
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6]"
                          onClick={() => {
                            // Handle delete action
                            setActiveDropdown(null);
                          }}
                        >
                          <div className="flex items-center gap-2">{<Delete />} <span>Delete</span> </div>
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          {!secondModel ? <div
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
                  className="w-full px-4 py-2 border rounded-lg border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Language</label>
                  <select className="w-full px-4 py-2 border rounded-lg border-gray-300">
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Voice</label>
                  <select className="w-full px-4 py-2 border rounded-lg border-gray-300">
                    <option>Select</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Choose Calendar</label>
                  <select className="w-full px-4 py-2 border rounded-lg border-gray-300">
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Max Call Time (Minutes)</label>
                  <select className="w-full px-4 py-2 border rounded-lg border-gray-300">
                    <option>Select</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Target Lists</label>
                <select className="w-full px-4 py-2 border rounded-lg border-gray-300">
                  <option>Select</option>
                </select>
                <button className="text-[#7065F0] text-sm font-medium mt-1">+ Create New Contact List</button>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Choose an Agent</label>
                <select className="w-full px-4 py-2 border rounded-lg border-gray-300">
                  <option>Select</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium block mb-1">
                  Phone Number
                </label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
                  <select
                    className="outline-none bg-transparent pr-2 text-xl"
                    value={countries[0].code}
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.dial_code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="Enter number"
                    className="w-full outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-gray-700">
                  Tom, Engages the Conversation
                </span>
                <button
                  onClick={() => setToggleTom(!toggleTom)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${toggleTom ? "bg-[#7065F0]" : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${toggleTom ? "translate-x-5" : "translate-x-0.5"
                      }`}
                  ></span>
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Your Catch Phrase</label>
                <textarea
                  placeholder="Enter your catch phrase"
                  className="w-full px-4 py-2 border rounded-lg border-gray-300"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Your Call Script</label>
                <textarea
                  placeholder="Enter your call script"
                  className="w-full px-4 py-2 border rounded-lg border-gray-300"
                  rows={4}
                />
              </div>

              <div className="flex gap-4 mt-6 justify-between">
                <button onClick={() => setSecondModel(true)} className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                  Test Call
                </button>
                <button className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]">
                  Launch Calls
                </button>
              </div>
            </div>
          </div> : <div className="bg-white rounded-2xl w-full max-w-[514px] p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowModal(false)
                setSecondModel(false)
              }}
            >
              <X size={20} />
            </button>

            <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-1">
              Test Call
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Test your call with <span className="text-[#5E54FF]">Tom</span>
            </p>
            <div className="flex flex-col my-5 justify-center items-center gap-3">
              <div><TestCall /></div>
              <h2 className="text-[20px] text-[#1E1E1E] font-[600]">Call from +99778090935 in Progress...</h2>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
              >
                I Haven’t Received A Call
              </button>
              <button
                className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]"
              >
                Finish The Test
              </button>
            </div>
          </div>}
        </div>
      )}
      {viewReportModel && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-[678px] p-6 relative shadow-lg">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => setViewReportModel(false)}
          >
            <X size={20} />
          </button>

          <h2 className="text-[20px] font-[600] text-[#1E1E1E] my-4">
            Campaign Name : Inbound.4d74997e-2c17-4024-98c4-
            5fbca9d4f5d1
          </h2>
          <div className="grid grid-cols-2 gap-5 w-full">
            {staticData.map((each) => (
              <div
                key={each.label}
                className={`flex flex-col gap-2 rounded-lg border shadow-shadows-shadow-xs transition bg-white border-[#e1e4ea]`}
              >
                <h1 className="text-[#1E1E1E] p-2 bg-[#F2F2F7] text-[14px] font-[400]">
                  {each.label}
                </h1>

                <div className='flex gap-2 p-3 items-center'>
                  <p className="font-[600] text-[#1E1E1E] text-[24px]">
                    {each.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
}
