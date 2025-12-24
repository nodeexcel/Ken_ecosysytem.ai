import { useEffect, useRef, useState } from "react";
import { Trash2, PhoneOutgoing, Plus, X, Info, Search } from "lucide-react";
import { InboundCall, OutboundCall } from "../icons/icons";
import { FaChevronDown } from "react-icons/fa";
import { addPhoneNumber, getPhoneNumber, updatePhoneNumberStatus, deletePhoneNumber } from "../api/callAgent"

import { DateFormat } from "../utils/TimeFormat";
import { t } from "i18next";
import ToastModal from "./ToastModal";

// Import flag images
import uk_flag from "../assets/images/uk_flag.png"
import us_flag from "../assets/images/us_flag.png"
import fr_flag from "../assets/images/fr_flag.png"

// Import direction icons
import InboundDirection from "../assets/svg/InboundDirection.svg";
import OutboundDirection from "../assets/svg/OutboundDirection.svg";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Import flag-icons CSS
import "flag-icons/css/flag-icons.min.css";

export default function PhoneNumbers() {
  const [rows, setRows] = useState([]);

  // Use hardcoded countries data from CallAgent
  const countries = [
    { name: "United States", code: "US", dial_code: "+1", flag: us_flag, flagCode: "us" },
    { name: "United Kingdom", code: "GB", dial_code: "+44", flag: uk_flag, flagCode: "gb" },
    { name: "France", code: "FR", dial_code: "+33", flag: fr_flag, flagCode: "fr" },
  ];

  // Helper function to get country flag code from country name
  const getCountryFlagCode = (countryName) => {
    if (!countryName) return "us"; // default

    const country = countries.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    if (country) return country.flagCode;

    // Fallback: try to extract country code from common country names
    const countryNameMap = {
      "united states": "us",
      "usa": "us",
      "united kingdom": "gb",
      "uk": "gb",
      "france": "fr",
      "germany": "de",
      "spain": "es",
      "italy": "it",
      "canada": "ca",
      "australia": "au",
      "japan": "jp",
      "china": "cn",
      "india": "in",
      "brazil": "br",
      "mexico": "mx",
      "netherlands": "nl",
      "belgium": "be",
      "switzerland": "ch",
      "austria": "at",
      "sweden": "se",
      "norway": "no",
      "denmark": "dk",
      "poland": "pl",
      "portugal": "pt",
      "greece": "gr",
      "turkey": "tr",
      "russia": "ru",
      "south korea": "kr",
      "singapore": "sg",
      "thailand": "th",
      "indonesia": "id",
      "philippines": "ph",
      "vietnam": "vn",
      "malaysia": "my",
      "new zealand": "nz",
      "south africa": "za",
      "egypt": "eg",
      "saudi arabia": "sa",
      "uae": "ae",
      "israel": "il",
      "argentina": "ar",
      "chile": "cl",
      "colombia": "co",
      "peru": "pe",
      "venezuela": "ve",
      "morocco": "ma",
    };

    const normalizedName = countryName.toLowerCase().trim();
    return countryNameMap[normalizedName] || "us";
  };

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("outbound")
  const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.dial_code === "+33") || countries[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [phoneName, setPhoneName] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({});
  const [deleteRow, setDeleteRow] = useState(null);
  const [loading, setLoading] = useState(true)
  const [otpModal, setOtpModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ open: false, type: 'success', title: '', description: '', highlightText: '' });
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


  function validatePhoneNumber(phoneNumber) {
    try {
      const parsed = parsePhoneNumberFromString(phoneNumber);
      return parsed && parsed.isValid();
    } catch (err) {
      return false;
    }
  };

  const validateSubmit = () => {
    const errors = {};
    if (!validatePhoneNumber(selectedCountry.dial_code + number)) {
      errors.number = t("brain_ai.invalid_phone_no");
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  }

  const handleAddNumber = async (e) => {
    e.preventDefault();
    if (!validateSubmit()) {
      return;
    }
    setLoader(true);
    try {
      const response = await addPhoneNumber({ name: phoneName, phone_number: number, country: selectedCountry.name, number_type: activeTab });

      if (response.status === 201) {
        console.log("Phone number added successfully");
        fetchPhoneNumbers();
        setShowModal(false);
        setLoader(false);
        setNumber("")
        setPhoneName("")
        setSelectedCountry(countries[0])
        setError({})
        
        // Show success toast
        const phoneNumberDisplay = phoneName || `${selectedCountry.dial_code}${number}`;
        setToast({
          open: true,
          type: 'success',
          title: 'Phone Number Added Successfully',
          description: `Your phone number "${phoneNumberDisplay}" has been added.`,
          highlightText: phoneNumberDisplay
        });
      } else {
        setLoader(false);
        const errorMessage = response?.response?.data?.error || t("phone.phone_number_failed");
        setToast({
          open: true,
          type: 'error',
          title: 'Failed to Add Phone Number',
          description: errorMessage,
        });
      }
    } catch (error) {
      console.error("Error adding phone number:", error);
      setLoader(false);
      setToast({
        open: true,
        type: 'error',
        title: 'Failed to Add Phone Number',
        description: t("phone.phone_number_failed") || 'We couldn\'t add the phone number. Please try again.',
      });
    }
  }

  const removeRow = async (id) => {
    try {
      // Find the phone number before deleting to show in toast
      const phoneToDelete = rows.find(row => row.id === id);
      const phoneNumberDisplay = phoneToDelete?.name || phoneToDelete?.phone_number || 'phone number';

      const response = await deletePhoneNumber(id);
      console.log("RESPONSE:", response);
      if (response.status === 200) {
        console.log("Phone number removed successfully");
        fetchPhoneNumbers();
        setDeleteRow(null);
        
        // Show success toast
        setToast({
          open: true,
          type: 'success',
          title: 'Phone Number Deleted Successfully',
          description: `Your phone number "${phoneNumberDisplay}" has been deleted.`,
          highlightText: phoneNumberDisplay
        });
      } else {
        console.error("Failed to remove phone number");
        setDeleteRow(null);
        setToast({
          open: true,
          type: 'error',
          title: 'Delete Failed',
          description: 'We couldn\'t delete the phone number. Please try again.',
        });
      }

    } catch (error) {
      console.error("Error removing phone number:", error);
      setDeleteRow(null);
      setToast({
        open: true,
        type: 'error',
        title: 'Delete Failed',
        description: 'We couldn\'t delete the phone number. Please try again.',
      });
    }
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
    if (rows && rows.length > 0) {
      setLoading(false)
    }
  }, [rows])

  useEffect(() => {

    fetchPhoneNumbers();

  }, []);


  const searchHandle = (e) => {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue === "") {
      return;
    }
    const filteredRows = countries.filter((country) =>
      country.name.toLowerCase().includes(searchValue) ||
      country.dial_code.toLowerCase().includes(searchValue)
    );
    // Note: Since we're using hardcoded countries, search is just for display purposes
  }
  const renderPhoneNumber = (phone, country) => {
    const filterCode = countries.filter((e) => e.name === country)
    return `${filterCode[0]?.dial_code}${phone}`
  }

  // Filter and search logic
  const filteredRows = rows.filter((row) => {
    // Filter by status
    let statusMatch = true;
    if (filterStatus === "Active") {
      statusMatch = row.status === true;
    } else if (filterStatus === "Pending") {
      statusMatch = row.status === false && row.pending === true;
    } else if (filterStatus === "Inactive") {
      statusMatch = row.status === false && !row.pending;
    }

    // Filter by search query
    const searchMatch = searchQuery === "" ||
      row.phone_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.name && row.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return statusMatch && searchMatch;
  });

  const filterTabs = [
    { label: t("phone.all") || "All", value: "All" },
    { label: t("phone.active") || "Active", value: "Active" },
    { label: t("phone.pending") || "Pending", value: "Pending" },
    { label: t("phone.inactive") || "Inactive", value: "Inactive" },
  ];

  return (

    <div className="p-12 min-h-[calc(100vh-80px)] overflow-y-auto flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-[24px] font-[500] text-[#1E1E1E]">{t("phone.phone_numbers")}</h1>
          <p className="text-[16px] font-[400] text-[#5A687C] mt-1">
            {t("phone.manage_and_monitor_active_business_numbers") || "Manage and monitor active business numbers across your organization."}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#675FFF] cursor-pointer whitespace-nowrap text-white rounded-lg text-sm md:text-base px-3 py-1.5 mt-3 md:mt-0 flex items-center gap-2"
        >
          <Plus size={20} />
          {t("phone.new_phone_number")}
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#F3F4F6] border border-[#D6D6D6] rounded-lg p-0.5 ">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition cursor-pointer ${filterStatus === tab.value
                ? "bg-white text-[#1E1E1E] font-semibold border border-[#D6D6D6] "
                : "text-[#5A687C] hover:text-[#1E1E1E]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 md:flex-initial md:w-auto md:max-w-md bg-white rounded-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A687C] w-4 h-4" />
          <input
            type="text"
            placeholder={t("phone.search_name_or_phone_number") || "Search name or phone number"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-2 border whitespace-nowrap border-[#E1E4EA] rounded-lg focus:outline-none focus:border-[#675FFF] text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#D6D6D6] overflow-auto mb-2">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-[#F7F7F8]">
              <tr className="text-[#5A687C]">
                <th className="px-3 sm:px-4 md:px-6 text-start py-3 text-xs sm:text-sm md:text-[16px] font-[400] whitespace-nowrap">{t("phone.phone_numbers")}</th>
                <th className="px-2 sm:px-3 md:px-6 text-start py-3 text-xs sm:text-sm md:text-[16px] font-[400] whitespace-nowrap">{t("phone.country")}</th>
                <th className="px-2 sm:px-3 md:px-6 text-start py-3 text-xs sm:text-sm md:text-[16px] font-[400] whitespace-nowrap">{t("phone.status")}</th>
                <th className="px-2 sm:px-3 md:px-6 text-start py-3 text-xs sm:text-sm md:text-[16px] font-[400] whitespace-nowrap">{t("phone.total_call")}</th>
                <th className="px-2 sm:px-3 md:px-6 text-center py-3 text-xs sm:text-sm md:text-[16px] font-[400] whitespace-nowrap">{t("phone.direction")}</th>
                <th className="px-2 sm:px-3 md:px-6 text-start py-3 text-xs sm:text-sm md:text-[16px] font-[400] whitespace-nowrap">{t("phone.creation_date")}</th>
                <th className="px-3 sm:px-4 md:px-12 text-center py-3 text-xs sm:text-sm md:text-[16px] font-[400] whitespace-nowrap">{t("phone.actions")}</th>
              </tr>
            </thead>

            <tbody className="bg-white [&>tr:first-child>td:first-child]:rounded-tl-2xl [&>tr:first-child>td:first-child]:border-t [&>tr:first-child>td:last-child]:rounded-tr-2xl [&>tr:first-child>td:last-child]:border-t [&>tr:first-child>td]:border-t [&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:first-child]:border-b [&>tr:last-child>td:last-child]:rounded-br-2xl [&>tr:last-child>td:last-child]:border-b [&>tr:last-child>td]:border-b [&>tr>td]:border-[#D6D6D6]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <span className="loader" />
                  </td>
                </tr>
              ) : filteredRows.length !== 0 ? (
                filteredRows.map((row, index) => {
                  return (
                    <tr key={row.id} className="text-sm sm:text-base md:text-[16px] text-[#1E1E1E]">
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-4 text-xs sm:text-sm md:text-[14px] text-black font-[400] text-start break-words">
                        {row.phone_number}
                      </td>
                      <td className="px-2 sm:px-3 md:px-6 py-3 sm:py-4 md:py-4 text-xs sm:text-sm md:text-[14px] text-black font-[400] text-start whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 overflow-hidden flex">
                            <span
                              className={`fi-${getCountryFlagCode(row.country)} w-full h-full rounded-4xl overflow-hidden`}
                            ></span>
                          </div>
                          <div>
                            <span>{row.country}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-6 py-3 sm:py-4 md:py-4 text-xs sm:text-sm md:text-[14px]">
                        <div className="flex items-center">
                          <span
                            className={`text-[10px] sm:text-xs md:text-[14px] font-[500] px-2 sm:px-3 py-1 rounded-full border whitespace-nowrap inline-flex items-center justify-center gap-2 ${row.status === true
                                ? "border-[#34C759] text-[#34C759] bg-[#EBF9EE]"
                                : row.status === false && row.pending === true
                                  ? "border-[#FF9500] text-[#FF9500] bg-[#FFF4E6]"
                                  : "border-[#FF3B30] text-[#FF3B30] bg-[#FFEBEE]"
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${row.status === true
                                  ? "bg-[#34C759]"
                                  : row.status === false && row.pending === true
                                    ? "bg-[#FF9500]"
                                    : "bg-[#FF3B30]"
                                }`}
                            />

                            {/* Status Text */}
                            {row.status === true
                              ? "Active"
                              : row.status === false && row.pending === true
                                ? "Pending"
                                : "Inactive"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 sm:px-3 md:px-6 py-3 sm:py-4 md:py-4 text-xs sm:text-sm md:text-[14px] text-black font-[400] text-center whitespace-nowrap">
                        {row.total_calls}
                      </td>
                      <td className="px-2 sm:px-3 md:px-2 py-3 sm:py-4 md:py-4 text-xs sm:text-sm md:text-[14px] text-start">
                        <div className="flex items-center justify-center gap-2">
                          <img 
                            src={row.direction === "inbound" ? InboundDirection : OutboundDirection} 
                            alt={row.direction === "inbound" ? "Inbound" : "Outbound"}
                            className="w-3 h-3"
                          />
                          <span className="text-[#1E1E1E]">
                            {row.direction === "inbound" ? t("phone.inbound") : t("phone.outbound")}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-6 py-3 sm:py-4 md:py-4 text-xs sm:text-sm md:text-[14px] text-black font-[400] text-start whitespace-nowrap">
                        {DateFormat(row.creation_date)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-4 text-center">
                        <button
                          onClick={() => setDeleteRow(row.id)}
                          className="text-[#FF3B30] cursor-pointer hover:text-[#ff3a30b7]"
                        >
                          <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-xs sm:text-sm md:text-[16px] text-[#5A687C]">
                    {t("phone.no_phonenumber_listed")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRows.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-[#F7F7F8] px-4 sm:px-6 py-3 gap-4 sm:gap-0">

  {/* Page Navigation Buttons */}
  <div className="flex items-center gap-1 md:gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide py-1">
    
    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-2 py-1 text-xs sm:text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors whitespace-nowrap">
      ‹ {t("phone.prev")}
    </button>

    <button className="bg-[#675FFF] text-white rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer min-w-[32px] sm:min-w-[36px] hover:bg-[#5E54FF] transition-colors whitespace-nowrap">
      1
    </button>

    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer min-w-[32px] sm:min-w-[36px] hover:bg-gray-50 transition-colors whitespace-nowrap">
      2
    </button>

    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer min-w-[32px] sm:min-w-[36px] hover:bg-gray-50 transition-colors whitespace-nowrap">
      3
    </button>

    <span className="text-[#000000] text-xs sm:text-sm px-1 whitespace-nowrap">…</span>

    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer min-w-[32px] sm:min-w-[36px] hover:bg-gray-50 transition-colors whitespace-nowrap">
      10
    </button>

    <button className="border border-[#D6D6D6] text-[#000000] rounded-lg px-2 py-1 text-xs sm:text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors whitespace-nowrap">
      {t("phone.next")} ›
    </button>
  </div>

  {/* Rows per page */}
  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5A687C] w-full sm:w-auto justify-center sm:justify-end">

    <div className="flex gap-1">
      <button className="border rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer bg-white border-[#D6D6D6] text-[#000000] hover:bg-gray-50 transition-colors whitespace-nowrap">
        5 {t("phone.rows")}
      </button>

      <button className="border rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer bg-transparent border-[#D6D6D6] text-[#5A687C] hover:bg-white transition-colors whitespace-nowrap">
        10
      </button>

      <button className="border rounded-lg px-2 py-1 text-xs sm:text-sm cursor-pointer bg-transparent border-[#D6D6D6] text-[#5A687C] hover:bg-white transition-colors whitespace-nowrap">
        20
      </button>
    </div>
  </div>

</div>


        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-[460px] max-h-[85vh] overflow-auto p-6 relative shadow-lg">
            <button
              className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowModal(false)
                setError({})
              }}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {
                t("phone.add_new_number")
              }
            </h2>
            <hr className="border border-gray-200 w-full"></hr>

            {/* Tabs */}
            <div className="flex border bg-[#F3F4F6] border-[#E1E4EA] rounded-lg overflow-hidden my-4">
              {tabs.map((tab) => (
                <div key={tab.key} className="w-full p-0.5 " onClick={() => setActiveTab(tab.key)}>
                  <button

                    className={`w-full py-1.5 cursor-pointer text-sm font-medium transition  ${activeTab === tab.key
                      ? "bg-white text-[#1E1E1E] rounded-lg border border-gray-200"
                      : "text-[#5A687C] "
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
                  placeholder={t("phone.enter_number_placeholder")}
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
                  <div className="relative isolate">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-[120px] flex hover:cursor-pointer relative border-none justify-between gap-1 items-center border py-1 text-left"
                    >
                      <div className="flex items-center gap-2 mr-3">
                        {selectedCountry && <img src={selectedCountry.flag} alt={selectedCountry.name} className="w-4 h-4 rounded-full" />}
                        <p className="text-[#5A687C] font-[400] text-[16px]">{selectedCountry ? selectedCountry.dial_code : "+1"}</p>
                      </div>
                      <FaChevronDown color="#5A687C" className={`w-[10px]  transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                      <hr style={{ color: "#E1E4EA", width: "22px", transform: "rotate(-90deg)" }} />
                    </button>
                    {isOpen && (
                      <div className="absolute px-1 z-[9999] rounded-md shadow-lg border border-gray-200 max-h-[200px] overflow-auto top-6 w-full left-[-13px] bg-white mt-1 isolate transform-gpu will-change-transform">
                        <input type="text" placeholder="Search" className="w-full px-3 py-2 border-b border-gray-200 outline-none text-sm" onChange={searchHandle} />
                        {countries.map((country, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsOpen(false);
                            }}
                            className={`flex gap-2 px-2 hover:bg-[#F4F5F6] hover:rounded-lg  my-1 py-2 ${selectedCountry?.code === country?.code && 'bg-[#F4F5F6] rounded-lg'} cursor-pointer flex items-center`}
                          >
                            <img src={country.flag} alt={country.name} className="w-4 h-4 rounded-full" />
                            <p className="text-[#5A687C] font-[400] text-[16px]">{country.dial_code}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    placeholder={t("phone.enter_number")}
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

              <div className={`text-sm rounded-lg px-4 py-3 flex items-center gap-2 ${activeTab === 'outbound'
                ? 'bg-[#F7F7FF] text-[#675FFF]'
                : 'bg-[#F7f7ff] text-[#675FFF]'
                }`}>
                <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.84375 10.3438L9.87963 10.3262C9.99183 10.2702 10.1177 10.2475 10.2425 10.2608C10.3672 10.2741 10.4855 10.3228 10.5833 10.4012C10.6812 10.4797 10.7545 10.5845 10.7947 10.7034C10.8348 10.8222 10.84 10.95 10.8098 11.0717L10.1902 13.5533C10.1598 13.675 10.1648 13.803 10.2049 13.922C10.2449 14.0409 10.3182 14.146 10.4161 14.2245C10.514 14.3031 10.6324 14.3519 10.7572 14.3652C10.8821 14.3785 11.0081 14.3558 11.1204 14.2996L11.1562 14.2812M18.375 11C18.375 12.0342 18.1713 13.0582 17.7756 14.0136C17.3798 14.9691 16.7997 15.8372 16.0685 16.5685C15.3372 17.2997 14.4691 17.8798 13.5136 18.2756C12.5582 18.6713 11.5342 18.875 10.5 18.875C9.46584 18.875 8.44181 18.6713 7.48637 18.2756C6.53093 17.8798 5.6628 17.2997 4.93153 16.5685C4.20027 15.8372 3.6202 14.9691 3.22445 14.0136C2.82869 13.0582 2.625 12.0342 2.625 11C2.625 8.91142 3.45469 6.90838 4.93153 5.43153C6.40838 3.95469 8.41142 3.125 10.5 3.125C12.5886 3.125 14.5916 3.95469 16.0685 5.43153C17.5453 6.90838 18.375 8.91142 18.375 11ZM10.5 7.71875H10.507V7.72575H10.5V7.71875Z" stroke={activeTab === 'outbound' ? '#675FFF' : '#675FFF'} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {activeTab === 'outbound' ? t("phone.active_outbound_msg") : t("phone.active_outbound_msg")}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowModal(false)
                  setError({})
                }}
                className="w-full text-[16px] cursor-pointer text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
              >
                {
                  t("phone.cancel")
                }
              </button>
              <button
                className="w-full text-[16px] cursor-pointer text-white rounded-[8px] bg-[#5E54FF]  h-[38px] flex items-center justify-center gap-2 relative"
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
      {/* 
      {
        otpModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-[610px] max-h-[357px] overflow-auto p-6 relative shadow-lg">
              <button
                className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setOtpModal(false)}
              >
                <X size={20} />
              </button>
              <div className="flex flex-col gap-7">
                <p className="text-[#1E1E1E] font-[500] text-[20px]">{t("phone.verification_code")}</p>
                <p className="text-[#1E1E1E] font-[700] bg-[#F0EFFF] w-full text-center text-[44px] px-[12px] py-[17px] rounded-[10px]">0600525</p>
                <p className="text-[#5A687C] text-[16px] font-[400] mb-4">{t("phone.enter_verification_code")}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOtpModal(false)}
                    className="w-full cursor-pointer px-[20px] py-[7px] text-[16px] text-[#5A687C] bg-white border-[1.5px] border-[#E1E4EA] rounded-[8px]"
                  >
                    {t("phone.cancel")}
                  </button>
                  <button
                    onClick={() => setOtpModal(false)}
                    className="w-full cursor-pointer text-[16px] text-white rounded-[8px] bg-[#675FFF] px-[20px] py-[7px] flex justify-center items-center gap-2 relative"
                  >
                    {t("phone.submit")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      } */}

      {
        deleteRow && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-[460px] p-6 relative shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("phone.delete_phone_number")}</h2>
              <p className="text-gray-500 mb-4">{t("phone.delete_phone_number_msg")}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteRow(null)}
                  className="w-full cursor-pointer text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => {
                    removeRow(deleteRow);

                  }}
                  className="w-full cursor-pointer text-[16px] text-white rounded-[8px] bg-red-500 h-[38px] flex justify-center items-center gap-2 relative"
                >
                  {t("delete")}
                  {/* <span className="loader"></span> */}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Toast Modal */}
      <ToastModal
        open={toast.open}
        type={toast.type}
        title={toast.title}
        description={toast.description}
        highlightText={toast.highlightText}
        onClose={() => setToast({ ...toast, open: false })}
      />
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
