import { useEffect, useState } from "react";
import { Trash2, PhoneOutgoing, Plus, X, Info } from "lucide-react";
import { InboundCall, OutboundCall } from "../icons/icons";
import { format } from "date-fns";
import { FaChevronDown } from "react-icons/fa";
import uk_flag from "../assets/images/uk_flag.png"
import us_flag from "../assets/images/us_flag.png"
import fr_flag from "../assets/images/fr_flag.png"
import {addPhoneNumber, getPhoneNumber} from "../api/callAgent"
import { set } from "date-fns";
const initialRows = [
  {
    id: "1",
    phone_number: "+41778090925",
    country: "Switzerland",
    active: true,
    total_calls: 0,
    direction: "outbound",
    createdAt: "27/03/2025 03:30 PM",
  },
  {
    id: "2",
    phone_number: "+41778090925",
    country: "Switzerland",
    active: true,
    total_calls: 0,
    direction: "outbound",
    createdAt: "27/03/2025 03:30 PM",
  },
  {
    id: "3",
    phone_number: "+41778090925",
    country: "Switzerland",
    active: true,
    total_calls: 0,
    direction: "outbound",
    createdAt: "27/03/2025 03:30 PM",
  },
  {
    id: "4",
    phone_number: "+41778090925",
    country: "Switzerland",
    active: true,
    total_calls: 0,
    direction: "outbound",
    createdAt: "27/03/2025 03:30 PM",
  },
  {
    id: "5",
    phone_number: "+41778090925",
    country: "Switzerland",
    active: true,
    total_calls: 0,
    direction: "outbound",
    createdAt: "27/03/2025 03:30 PM",
  },
];



const countries = [
  { name: "United States", code: "US", dial_code: "+1", flag: us_flag },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: uk_flag }, ,
  { name: "France", code: "FR", dial_code: "+33", flag: fr_flag }, ,
  // Add more countries as needed
];

export default function PhoneNumbers() {
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("outbound")
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [number, setNumber] = useState("");
  const[phoneName, setPhoneName] = useState("");
  const [loader,setLoader] = useState(false);
  const [error,setError]=useState({});
  const[responseError,setResponseError]=useState();

  const tabs = [
    { label: "Outbound Number", key: "outbound", icon: <OutboundCall active={activeTab == "outbound"} /> },
    { label: "Inbound Number", key: "inbound", icon: <InboundCall active={activeTab == "inbound"} /> },
  ]

  const toggleActive = (id) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, active: !r.active } : r
      )
    );
  };

  const ValidateSubmit=()=>{
    const errors = {};
    if (!phoneName) {
      errors.phoneName = "Phone name is required";
    }
    if (!number) {
      errors.number = "Phone number is required";
    }
    if (number && !/^\+?[0-9\s]+$/.test(number)) {
      errors.number = "Invalid phone number format";
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  }

  const handleAddNumber = async(e) => {
        e.preventDefault();
       if(!ValidateSubmit()) {
        return;
       }
       setLoader(true);
       const response=await addPhoneNumber({name:phoneName, phone_number:number, country: selectedCountry.name,number_type:activeTab});

       if(response.status === 201){
        console.log("Phone number added successfully");
        fetchPhoneNumbers();
         setShowModal(false);
         setLoader(false);

       }else{
        setLoader(false);
        setResponseError(response.response.data.error || "Failed to add phone number");
       }
  }

  const removeRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));

  };

  const fetchPhoneNumbers = async () => {
    try {
      const response = await getPhoneNumber();
      if (response.status === 200) {
        console.log(response.data.phone_numbers);
        setRows(response.data.phone_numbers);
      } else {
        console.error("Failed to fetch phone numbers");
      }
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
    }
  }

  useEffect(()=>{

    fetchPhoneNumbers();

  },[]);

  return (
    <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[24px] font-[600] text-[#1E1E1E]">Phone Numbers </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#675FFF] border border-[#5F58E8] text-white font-medium rounded-lg px-5 py-2 flex items-center gap-2"
        >
          New Phone Number
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto w-full rounded-2xl">
        <table className="w-full rounded-2xl">
          <thead>
            <tr className="text-left text-[#5a687c] text-[16px]">
              <th className="px-6 py-3 font-medium whitespace-nowrap">Phone Number</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Country</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Status</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Total Calls</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Direction</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Creation Date</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white shadow-sm">

            { rows.length !== 0 ? (
            rows.map((row) => (
              <tr
                key={row.id}
                className="text-sm text-[#1e1e1e]"
              >
                <td className="px-6 py-5 font-medium text-gray-900">{row.phone_number}</td>
                <td className="px-6 py-5 text-gray-600">{row.country }</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${row.active
                        ? "border-green-500 text-green-600"
                        : "border-gray-400 text-gray-500"
                        }`}
                    >
                      {row.active ? "Active" : "Inactive"}
                    </span>
                    <ToggleSwitch
                      checked={row.active}
                      onChange={() => toggleActive(row.id)}
                    />
                  </div>
                </td>
                <td className="px-6 py-5 text-center text-gray-600">{row.total_calls}</td>
                <td className="px-6 py-5 text-center">
                  <PhoneOutgoing size={18} className="text-green-600 inline" />
                </td>
                <td className="px-6 py-5 text-gray-600">{format(row.creation_date,"mm-dd-yyyy hh:mm a")}</td>

                <td className="px-6 py-5 text-center">
                  <button
                    onClick={() => removeRow(row.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ):(
            <tr className="text-sm text-[#1e1e1e]">
              <td colSpan="7" className="px-6 py-5 text-center text-gray-500">
                No phone numbers found.
              </td>
            </tr>
          )

          }



          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[610px] p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              Add a New Number
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Enter your new phone number in the field below.
            </p>

            {/* Tabs */}
            <div className="flex border bg-[#F3F4F6] border-[#E1E4EA] rounded-lg overflow-hidden my-4">
              {tabs.map((tab) => (
                <div key={tab.key} className="w-full p-1" onClick={() => setActiveTab(tab.key)}>
                  <button

                    className={`w-full py-1.5 text-sm font-medium transition ${activeTab === tab.key
                      ? "bg-white text-[#1E1E1E] rounded-lg"
                      : "text-[#5A687C]"
                      }`}

                  >
                    <div className="flex items-center gap-2 justify-center">{tab.icon} <span>{tab.label}</span> </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 font-medium block mb-1">
                  Name The Number
                </label>
                <input
                  type="text"
                  placeholder="Enter number name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  onChange={(e) =>{ setPhoneName(e.target.value);
                    setError((prev) => ({ ...prev, phoneName: "" }));
                  }}
                  value={phoneName}
                />

                {error.phoneName && (
                  <p className="text-red-500 text-sm mt-1">{error.phoneName}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium block mb-1">
                  Number
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
                    onChange={(e) =>{ setNumber(e.target.value);
                      setError((prev) => ({ ...prev, number: "" }));
                    }}
                    value={number}
                  />


                </div>
                 {error.number && (
                    <p className="text-red-500 text-sm mt-1">{error.number}</p>
                  )}
              </div>

              <div className="bg-[#FFF4E6] text-[#5A687C] text-sm rounded-lg px-4 py-3 flex items-center gap-2">
                <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.84375 10.3438L9.87963 10.3262C9.99183 10.2702 10.1177 10.2475 10.2425 10.2608C10.3672 10.2741 10.4855 10.3228 10.5833 10.4012C10.6812 10.4797 10.7545 10.5845 10.7947 10.7034C10.8348 10.8222 10.84 10.95 10.8098 11.0717L10.1902 13.5533C10.1598 13.675 10.1648 13.803 10.2049 13.922C10.2449 14.0409 10.3182 14.146 10.4161 14.2245C10.514 14.3031 10.6324 14.3519 10.7572 14.3652C10.8821 14.3785 11.0081 14.3558 11.1204 14.2996L11.1562 14.2812M18.375 11C18.375 12.0342 18.1713 13.0582 17.7756 14.0136C17.3798 14.9691 16.7997 15.8372 16.0685 16.5685C15.3372 17.2997 14.4691 17.8798 13.5136 18.2756C12.5582 18.6713 11.5342 18.875 10.5 18.875C9.46584 18.875 8.44181 18.6713 7.48637 18.2756C6.53093 17.8798 5.6628 17.2997 4.93153 16.5685C4.20027 15.8372 3.6202 14.9691 3.22445 14.0136C2.82869 13.0582 2.625 12.0342 2.625 11C2.625 8.91142 3.45469 6.90838 4.93153 5.43153C6.40838 3.95469 8.41142 3.125 10.5 3.125C12.5886 3.125 14.5916 3.95469 16.0685 5.43153C17.5453 6.90838 18.375 8.91142 18.375 11ZM10.5 7.71875H10.507V7.72575H10.5V7.71875Z" stroke="#FF9500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {activeTab === 'outbound' ? "You Will Receive a Call on This Number to Validate It" : `“Message text here @sami”`}
              </div>
            </div>

              {responseError && (
              <div className="mt-4 text-red-500 text-sm">
                {responseError}
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
              >
                Cancel
              </button>
              <button
                className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF]  h-[38px] flex items-center justify-center gap-2 relative"
                disabled={loader}
                onClick={handleAddNumber}
              >

                <p>  Add Number</p>
              { loader&& <span className="loader text-[#5E54FF]"></span>}


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
