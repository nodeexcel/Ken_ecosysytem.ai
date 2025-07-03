import { useEffect, useRef, useState } from "react";
import { Trash2, PhoneOutgoing, Plus, X, Info } from "lucide-react";
import { InboundCall, OutboundCall } from "../icons/icons";
import { format } from "date-fns";
import { FaChevronDown } from "react-icons/fa";
import uk_flag from "../assets/images/uk_flag.png"
import us_flag from "../assets/images/us_flag.png"
import fr_flag from "../assets/images/fr_flag.png"
import { addPhoneNumber, getPhoneNumber, updatePhoneNumberStatus, deletePhoneNumber } from "../api/callAgent"
import { set } from "date-fns";
import { DateFormat } from "../utils/TimeFormat";
import { useSelector } from "react-redux";
import { t } from "i18next";
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



// const countries = [
//   { name: "United States", code: "US", dial_code: "+1", flag: us_flag },
//   { name: "United Kingdom", code: "GB", dial_code: "+44", flag: uk_flag }, ,
//   { name: "France", code: "FR", dial_code: "+33", flag: fr_flag }, ,
//   // Add more countries as needed
// ];

export default function PhoneNumbers() {
  const [rows, setRows] = useState([]);
  const countries = useSelector((state) => state.country.data)
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("outbound")
  const [selectedCountry, setSelectedCountry] = useState(countries[240]);
  const [isOpen, setIsOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [phoneName, setPhoneName] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({});
  const [responseError, setResponseError] = useState();
  const [deleteRow, setDeleteRow] = useState(null);
  const [loading, setLoading] = useState(true)
  const [otpModal, setOtpModal] = useState(false)
  const countryRef = useRef()

  const tabs = [
    { label: t("phone.outbound_number"), key: "outbound", icon: <OutboundCall active={activeTab == "outbound"} /> },
    { label: t("phone.inbound_number"), key: "inbound", icon: <InboundCall active={activeTab == "inbound"} /> },
  ]

  const toggleActive = async (index, id) => {
    try {

      const response = await updatePhoneNumberStatus(id);

      if (response.status === 200) {
        console.log("Phone number status updated successfully");
        const updated = [...rows];
        updated[index]["status"] = !updated[index]["status"];
        setRows(updated);
      } else {
        console.error("Failed to update phone number status");
      }
    } catch (error) {
      console.log("Error updating phone number status:", error);
    }


  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ValidateSubmit = () => {
    const errors = {};
    if (!phoneName) {
      errors.phoneName = t("phone.phone_number_validation");
    }
    if (!number) {
      errors.number = t("phone.phone_number_failed");
    } else if (!/^\+?[0-9\s]+$/.test(number)) {
      errors.number = t("phone.phone_number_format_validation");
    }
    // else if (number.replace(/\D/g, "").length !== 10) {
    //   errors.number = "Phone number must be exactly 10 digits";
    // }
    setError(errors);
    return Object.keys(errors).length === 0;
  }

  const handleAddNumber = async (e) => {
    e.preventDefault();
    if (!ValidateSubmit()) {
      return;
    }
    setLoader(true);
    const response = await addPhoneNumber({ name: phoneName, phone_number: number, country: selectedCountry.name, number_type: activeTab });

    if (response.status === 201) {
      console.log("Phone number added successfully");
      fetchPhoneNumbers();
      setShowModal(false);
      setLoader(false);
      setOtpModal(true)

    } else {
      setLoader(false);
      setResponseError(response.response.data.error || t("phone.phone_number_failed"));
    }
  }

  const removeRow = async (id) => {
    try {

      const response = await deletePhoneNumber(id);
      console.log("RESPONSE:", response);
      if (response.status === 200) {
        console.log("Phone number removed successfully");
        fetchPhoneNumbers();
      } else {
        console.error("Failed to remove phone number");
      }

    } catch (error) {
      console.error("Error removing phone number:", error);
    }

    setDeleteRow(null);


  };

  const fetchPhoneNumbers = async () => {
    try {
      const response = await getPhoneNumber();
      if (response.status === 200) {
        setRows(response.data.phone_numbers);
        if (response?.data?.phone_numbers?.length === 0) {
          setLoading(false)
        }
      } else {
        console.error("Failed to fetch phone numbers");
        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
      setLoading(false)
    }
  }

  useEffect(() => {
    if (rows.length > 0) {
      setLoading(false)
    }
  }, [rows])

  useEffect(() => {

    fetchPhoneNumbers();

  }, []);

  const renderPhoneNumber = (phone, country) => {
    const filterCode = countries.filter((e) => e.name === country)
    return `${filterCode[0]?.dial_code}${phone}`
  }

  return (
    <div className="py-4 pr-2 h-screen overflow-auto flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[24px] font-[600] text-[#1E1E1E]">{t("phone.phone_numbers")} </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#675FFF] border border-[#5F58E8] text-white font-medium rounded-lg px-5 py-2 flex items-center gap-2"
        >
         {
          t("phone.new_phone_number")
         }
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto w-full">
        <table className="w-full">
          <div className="px-5 w-full">
            <thead>
              <tr className="text-left text-[#5A687C] text-[16px]">
                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">{t("phone.phone_numbers")}</th>
                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">{t("phone.country")}</th>
                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">{t("phone.status")}</th>
                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">{t("phone.total_call")}</th>
                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">{t("phone.direction")}</th>
                <th className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] whitespace-nowrap">{t("phone.creation_date")}</th>
                <th className="p-[14px] w-full font-[400] whitespace-nowrap">{t("phone.actions")}</th>
              </tr>
            </thead>
          </div>
          <div className="border border-[#E1E4EA] w-full bg-white rounded-2xl p-3">
            {loading ? <p className="flex justify-center items-center h-34"><span className="loader" /></p> :
              rows.length !== 0 ?
                <tbody className="w-full">
                  {rows.map((row, index) =>
                    <tr
                      key={row.id}
                      className={`text-[16px] text-[#1E1E1E] ${index !== rows?.length - 1 ? 'border-b border-[#E1E4EA]' : ''}`}
                    >
                      <td className="p-[14px] min-w-[200px] max-w-[17%] w-full font-[400] text-[#1E1E1E]">{renderPhoneNumber(row.phone_number, row.country)}</td>
                      <td className="py-[14px] pl-[24px] pr-[14px] min-w-[200px] max-w-[17%] w-full text-[#5A687C] whitespace-nowrap">{row.country}</td>
                      <td className="p-[14px] min-w-[200px] max-w-[17%] w-full">
                        <div className="flex w-[120px] justify-between items-center">
                          <span
                            className={`text-[14px] font-[500] px-2.5 py-0.5 rounded-full border-[1.5px] ${row.status
                              ? "border-[#34C759] text-[#34C759] bg-[#EBF9EE]"
                              : "text-[#FF9500] border-[#FF9500] bg-[#FFF4E6]"
                              }`}
                          >
                            {row.status ? t("phone.active") : t("phone.inactive")}
                          </span>
                          <ToggleSwitch
                            checked={row.status}
                            onChange={() => toggleActive(index, row.id)}
                          />
                        </div>
                      </td>
                      <td className="py-[14px] pl-[30px] pr-[14px] min-w-[200px] max-w-[17%] w-full text-[#5A687C]">{row.total_calls}</td>
                      <td className="py-[14px] pl-[14px] pr-[14px] min-w-[186px] max-w-[17%] w-full">
                        {row.direction === "inbound" ? <InboundCall active={true} /> : <OutboundCall active={true} />}
                      </td>
                      <td className="min-w-[210px] max-w-[17%] w-full text-[#5A687C] whitespace-nowrap">{DateFormat(row.creation_date)}</td>

                      <td className="p-[14px] pr-[30px] w-full">
                        <button
                          onClick={() => setDeleteRow(row.id)}
                          className="text-[#FF3B30] hover:text-[#ff3a30b7]"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody> : <p className="flex justify-center items-center h-34 text-[#1E1E1E]">{t("phone.no_phonenumber_listed")}</p>}
          </div>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[610px] max-h-[85vh] overflow-auto p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowModal(false)
                setError({})
              }}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-1">
             {
              t("phone.add_new_number")
             }
            </h2>
            <p className="text-gray-500 text-sm mb-4">
             {
              t("phone.enter_new_phone_number")
             }
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
                {
                  t("phone.name_number")
                }
                </label>
                <input
                  type="text"
                  placeholder="Enter number name"
                  className={`w-full px-4 py-2 border rounded-lg resize-none ${error.phoneName ? 'border-red-500' : 'border-[#E1E4EA]'}  focus:outline-none focus:border-[#675FFF]`}
                  onChange={(e) => {
                    setPhoneName(e.target.value);
                    ((prev) => ({ ...prev, phoneName: "" }));
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
                  {
                    t("phone.number")
                  }
                </label>
                <div ref={countryRef} className={`flex group items-center focus-within:border-[#675FFF] gap-2 border ${error.number ? 'border-red-500' : 'border-[#E1E4EA]'} rounded-lg px-4 py-2`}>
                  <div className="relative">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-[120px] flex hover:cursor-pointer relative border-none justify-between gap-1 items-center border py-1 text-left"
                    >
                      <div className="flex items-center gap-2 mr-3">
                        <p className={`fi fi-${selectedCountry.flag} fis w-4 h-4 rounded-full`}></p>
                        <p className="text-[#5A687C] font-[400] text-[16px]">{selectedCountry.dial_code}</p>
                      </div>
                      <FaChevronDown color="#5A687C" className={`w-[10px]  transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                      <hr style={{ color: "#E1E4EA", width: "22px", transform: "rotate(-90deg)" }} />
                    </button>
                    {isOpen && (
                      <div className="absolute px-1 z-10 rounded-md shadow-lg border border-gray-200 max-h-30 overflow-auto top-6 w-full left-[-13px] bg-white mt-1">
                        {countries.map((country) => (
                          <div
                            key={country.code}
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsOpen(false);
                            }}
                            className={`flex gap-2 px-2 hover:bg-[#F4F5F6] hover:rounded-lg  my-1 py-2 ${selectedCountry?.code === country?.code && 'bg-[#F4F5F6] rounded-lg'} cursor-pointer flex items-center`}
                          >
                            <p className={`fi fi-${country.flag} fis w-4 h-4 rounded-full`}></p>
                            <p className="text-[#5A687C] font-[400] text-[16px]">{country.dial_code}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter number"
                    className="w-full outline-none"
                    onChange={(e) => {
                      setNumber(e.target.value);
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
                {activeTab === 'outbound' ? t("phone.active_outbound_msg") : t("phone.inactive_outbound_msg")}
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
                onClick={() => {
                  setShowModal(false)
                  setError({})
                }}
                className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
              >
                {
                  t("phone.cancel")
                }
              </button>
              <button
                className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF]  h-[38px] flex items-center justify-center gap-2 relative"
                disabled={loader}
                onClick={handleAddNumber}
              >

                <p>{t("phone.add_number")}</p>
                {loader && <span className="loader text-[#5E54FF]"></span>}


              </button>
            </div>


          </div>
        </div>
      )}

      {
        otpModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-[610px] max-h-[357px] overflow-auto p-6 relative shadow-lg">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setOtpModal(false)}
              >
                <X size={20} />
              </button>
              <div className="flex flex-col gap-7">
                <p className="text-[#1E1E1E] font-[500] text-[20px]">Verification Code</p>
                <p className="text-[#1E1E1E] font-[700] bg-[#F0EFFF] w-full text-center text-[44px] px-[12px] py-[17px] rounded-[10px]">0600525</p>
                <p className="text-[#5A687C] text-[16px] font-[400] mb-4">Please enter the code on your phone’s keypad to activate this number.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOtpModal(false)}
                    className="w-full  px-[20px] py-[7px] text-[16px] text-[#5A687C] bg-white border-[1.5px] border-[#E1E4EA] rounded-[8px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setOtpModal(false)}
                    className="w-full text-[16px] text-white rounded-[8px] bg-[#675FFF] px-[20px] py-[7px] flex justify-center items-center gap-2 relative"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {
        deleteRow && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-[400px] p-6 relative shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Phone Number</h2>
              <p className="text-gray-500 mb-4">Are you sure you want to delete this phone number?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteRow(null)}
                  className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    removeRow(deleteRow);

                  }}
                  className="w-full text-[16px] text-white rounded-[8px] bg-red-500 h-[38px] flex justify-center items-center gap-2 relative"
                >
                  Delete
                  {/* <span className="loader"></span> */}
                </button>
              </div>
            </div>
          </div>
        )
      }
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
