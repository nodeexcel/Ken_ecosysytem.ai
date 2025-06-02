import React,{useState} from "react";
import { MoreHorizontal, X } from "lucide-react";
import { ThreeDots } from "../icons/icons";
import { FaChevronDown } from "react-icons/fa";
import uk_flag from "../assets/images/uk_flag.png"
import us_flag from "../assets/images/us_flag.png"
import fr_flag from "../assets/images/fr_flag.png"

const data = [
  {
    id: 1,
    name: "Sami",
    language: "FR",
    voice: "Sophie",
    phone: "+33 6 12 34 56 78",
    calls: "184 Calls",
    status: "Completed",
    active: true,
  },
  {
    id: 2,
    name: "Amir",
    language: "ENG",
    voice: "Brian",
    phone: "+44 7700 900123",
    calls: "91 Calls",
    status: "Pending",
    active: false,
  },
  {
    id: 3,
    name: "Lina",
    language: "ENG",
    voice: "Emma",
    phone: "+1 202-555-0143",
    calls: "302 Calls",
    status: "Running",
    active: true,
  },
];


const countries = [
  { name: "United States", code: "US", dial_code: "+1", flag: us_flag },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: uk_flag }, ,
  { name: "France", code: "FR", dial_code: "+33", flag: fr_flag }, ,
  // Add more countries as needed
];

export default function CallAgentsPage() {

    const [agents, setAgents] = useState(data);
    const [showModal, setShowModal] = useState(false);
      const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [isOpen, setIsOpen] = useState(false);

   const toggleActive = (id) => {
    setAgents((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, active: !r.active } : r
      )
    );
  };





  return (
    <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-semibold text-black">Call Agents</h1>
        <button className="bg-[#7065F0] text-white font-medium px-5 py-2 rounded-lg shadow" onClick={() => setShowModal(true)}>
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
          <tbody className="bg-white border rounded-2xl border-[#E1E4EA]  p-3 ">
            {agents.map((agent, index) => (
              <tr
                key={agent.id}
                className={`hover:bg-gray-50 ${index !== agents.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <td className="px-6 py-4 font-medium text-gray-900 ml-3">{agent.name}</td>
                <td className="px-6 py-4">{agent.language}</td>
                <td className="px-6 py-4">{agent.voice}</td>
                <td className="px-6 py-4">{agent.calls}</td>
                  <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <ToggleSwitch
                      checked={agent.active}
                      onChange={() => toggleActive(agent.id)}
                    />
                  </div>
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


       {showModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl w-[610px] p-6 relative shadow-lg">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowModal(false)}
                  >
                    <X size={20} />
                  </button>

                  <h2 className="text-xl font-semibold text-gray-800 mb-8">
                   Add a New Call Agent
                  </h2>



                  {/* Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm  font-medium block mb-1">
                       Agent Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter number name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>

                      <div>
                      <label className="text-sm font-medium block mb-1">
                       Language
                      </label>
                      <select

                        placeholder="Enter number name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      >
                        <option value="">Select </option>
                          <option value="English">English</option>
                          <option value="French">French</option>
                      </select>
                    </div>

                      <div>
                      <label className="text-sm font-medium block mb-1">
                       Voice
                      </label>
                      <select

                        placeholder="Enter number name"
                        className="w-full px-4 py-2 border border-gray-300  text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      >
                        <option value="">Select </option>
                          <option value="English">English</option>
                          <option value="French">French</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 font-medium block mb-1">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
                        <div className="relative">
                          <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-fit flex border-none justify-between gap-2 items-center border pl-1 py-1 text-left"
                          >
                            <img src={selectedCountry.flag} alt={selectedCountry.name} width={16} />
                            <FaChevronDown color="#5A687C" className="w-[10px]" />
                            <hr style={{ color: "#E1E4EA", width: "22px", transform: "rotate(-90deg)" }} />
                          </button>
                          {isOpen && (
                            <div className="absolute z-10  w-full left-[-13px] bg-white mt-1">
                              {countries.map((country) => (
                                <div
                                  key={country.code}
                                  onClick={() => {
                                    setSelectedCountry(country);
                                    setIsOpen(false);
                                  }}
                                  className={`px-4 py-2 hover:bg-gray-100 ${selectedCountry.code === country.code && 'bg-[#EDF3FF]'} cursor-pointer flex items-center`}
                                >
                                  <img src={country.flag} alt={country.name} width={16} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          type="tel"
                          placeholder="Enter number"
                          className="w-full outline-none"
                        />
                      </div>
                    </div>


                  </div>

                  {/* Footer */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
                    >
                      Cancel
                    </button>
                    <button
                      className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]"
                    >
                      Add Agent
                    </button>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
}


function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${checked ? "bg-indigo-500" : "bg-gray-300"
        }`}
    >
      <span
        className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${checked ? "translate-x-4" : "translate-x-0"
          }`}
      />
    </button>
  );
}