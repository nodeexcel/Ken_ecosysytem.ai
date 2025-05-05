import { Contact, Download, Mail, Phone, SquarePen, Trash2, Upload, X } from "lucide-react";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const ContactsPage = () => {
  const [activeTab, setActiveTab] = useState("all-contacts");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const contacts = [
    {
      name: "Mary Freund",
      email: "patricia651@outlook.com",
      phone: "+41778090925",
      dateCreated: "27/03/2025 03:30 PM",
    },
    {
      name: "Corina McCoy",
      email: "david291@gmail.com",
      phone: "+41778090925",
      dateCreated: "27/03/2025 03:30 PM",
    },
    {
      name: "Joshua Jones",
      email: "j.e.dukes@aol.com",
      phone: "+41778090925",
      dateCreated: "27/03/2025 03:30 PM",
    },
  ];

  const contactLists = [
    {
      name: "Clients Mindset",
      activeContacts: 1849,
      channel: "Email",
      createdDate: "27/03/2025 03:30 PM",
    },
    {
      name: "Comminute MBP",
      activeContacts: 141,
      channel: "Phone No",
      createdDate: "27/03/2025 03:30 PM",
    },
    {
      name: "Lead Magnet GLOWUP",
      activeContacts: 89004,
      channel: "Email",
      createdDate: "27/03/2025 03:30 PM",
    },
  ]

  const tableHeaders = [
    { name: "Full Name", width: "flex-1" },
    { name: "Email", width: "w-[290px]" },
    { name: "Phone No", width: "flex-1" },
    { name: "Date Created", width: "flex-1" },
    { name: "Actions", width: "w-[120px]" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name]: value
    }))
  }

  const handleSubmit = () => {
    console.log(formData)
  }


  return (
    <div className="flex flex-col w-full items-start gap-6 onest">
      <div className="flex flex-col items-start gap-2.5 w-full">
        <div className="flex items-center justify-between w-full">
          <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">
            Contacts
          </h1>

          <div className="flex gap-2.5 items-center">
            <button className="flex items-center gap-2.5 px-5 py-[7px] border-[1.5px] border-[#e1e4ea] rounded bg-white">
              <Download />
              <span className="font-medium text-text-grey text-base leading-6 text-[#5A687C]">
                Export
              </span>
            </button>

            <button className="flex items-center gap-2.5 px-5 py-[7px] border-[1.5px] border-[#5f58e8] rounded bg-white">
              <Upload className="text-[#675FFF]" />
              <span className="font-medium text-base leading-6 text-[#675FFF]">Import</span>
            </button>

            <button onClick={activeTab === "lists" ? () => setOpen(true) : undefined} className="flex items-center gap-2.5 px-5 py-[7px] bg-[#675FFF] border-[1.5px] border-[#5f58e8] rounded text-white">
              <span className="font-medium text-base leading-6">
                {activeTab === "lists" ? "Create List" : "Add Contact"}
              </span>
            </button>
          </div>
        </div>

        <div className="w-full border-b border-[#e1e4ea]">
          <div className="flex items-start">
            <button
              onClick={() => setActiveTab("all-contacts")}
              className={`inline-flex items-center justify-center gap-1 p-2.5 border-b-2 ${activeTab === "all-contacts"
                ? "border-[#675fff] text-[#675FFF]"
                : "border-transparent text-text-grey"
                }`}
            >
              All Contacts
            </button>
            <button
              onClick={() => setActiveTab("lists")}
              className={`inline-flex items-center justify-center gap-1 p-2.5 border-b-2 ${activeTab === "lists"
                ? "border-[#675fff] text-[#675FFF]"
                : "border-transparent text-text-grey"
                }`}
            >
              Lists
            </button>
          </div>
        </div>
      </div>
      {activeTab === "all-contacts" ? (
        <>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-start gap-3">
              <select className="text-[#5A687C] w-[147px] px-3.5 py-[8px] bg-white border border-[#e1e4ea] shadow-shadows-shadow-xs rounded-lg">
                <option value="">All Data</option>
              </select>

              <select className="text-[#5A687C] w-[147px] px-3.5 py-[8px] bg-white border border-[#e1e4ea] shadow-shadows-shadow-xs rounded-lg">
                <option value="">Status: Any</option>
              </select>
            </div>
          </div>
          <div className="overflow-auto w-full">
            <table className="min-w-full rounded-2xl">
              <thead>
                <tr className="text-left text-[#5A687C]">
                  {tableHeaders.map((header, index) => (
                    <th key={index} className="px-6 py-3 text-[16px] font-medium whitespace-nowrap">
                      {header.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white shadow-sm">
                {contacts.map((contact, index) => (
                  <tr key={index} className="">
                    <td className="px-6 py-4 text-sm text-gray-800 font-semibold whitespace-nowrap">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {contact.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {contact.dateCreated}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center justify-center gap-3.5">
                        <SquarePen />
                        <Trash2 className="text-red-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) :

        (<>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-start gap-3">
              <div className="relative w-[179px]">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search"
                  className="w-full pl-10 pr-3.5 pt-[7px] pb-[6px] bg-white border border-[#e1e4ea] shadow-shadows-shadow-xs rounded-lg"
                />
              </div>
              <select className="text-[#5A687C] w-[147px] px-3.5 py-[8px] bg-white border border-[#e1e4ea] shadow-shadows-shadow-xs rounded-lg">
                <option value="">Channel: All</option>
              </select>
            </div>
          </div>
          <div className="overflow-auto w-full rounded-2xl">
            <table className="w-full rounded-2xl">
              <thead>
                <tr className="text-left text-[#5a687c] text-[16px]">
                  <th className="px-6 py-3 font-medium whitespace-nowrap">List Name</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Active Contacts</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Channel</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Created Date</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white shadow-sm">
                {contactLists.map((list, index) => (
                  <tr key={list.name} className=" text-sm text-[#1e1e1e]">
                    <td className="px-6 py-4 font-semibold whitespace-nowrap">{list.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{list.activeContacts.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {list.channel === "Email" ? (
                        <div className="flex items-center gap-1.5 bg-[#fff5e6] text-[#ff9500] px-3 py-1 rounded-md w-fit">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-[#f0f0ff] text-[#675fff] px-3 py-1 rounded-md w-fit">
                          <Phone className="h-4 w-4" />
                          <span>Phone No</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#5a687c] whitespace-nowrap">{list.createdDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-[#5A687C] font-[500] border rounded-lg py-2 px-3">Import contacts</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </>)
      }

      {open && (
        <div className="onest fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
          <div className="bg-white max-h-[547px] flex flex-col gap-3 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-[#1E1E1E] font-semibold text-[20px] mb-2">Create a List</h2>

            <div className="flex flex-col gap-2">
              <div>
                <label className="block text-[14px] font-medium text-[#292D32] mb-1">Name</label>
                <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Monthly Newsletter, Sales Leads, etc."
                    value={formData?.name}
                    onChange={handleChange}
                    className="w-full focus:outline-none"
                  />
                </div>
                <p className="text-[12px] pt-2 text-[#5A687C] font-[400]">List names are visible to contacts</p>
              </div>
              {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
              <div>
                <label className="block text-[14px] font-medium text-[#292D32] mb-1">List Description</label>
                <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                  <textarea
                    type="text"
                    name="description"
                    placeholder="Describe your list to your team. This description will not be visible to your contacts. "
                    value={formData?.description}
                    rows={4}
                    onChange={handleChange}
                    className="w-full focus:outline-none"
                  />
                </div>
                {formErrors.description && <p classdescription="text-sm text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <label className="block mt-2 text-[14px] font-medium text-[#292D32]">Channel</label>
              <div className="w-full flex items-center border border-gray-300 rounded-lg pb-1">
                <select
                  value={formData?.channel}
                  name="channel"
                  onChange={handleChange}
                  className="w-full bg-white px-4 py-2 rounded-lg "
                >
                  <option value="" disabled>Channel</option>
                  <option value="email">Email</option>
                  <option value="Member">Member</option>
                  <option value="Guest">Guest</option>
                </select>
              </div>
            </div>
            {formErrors.error && <p className="text-sm text-red-500 mt-1">{formErrors.error}</p>}

            <div className="flex gap-2 mt-3">
              <button onClick={() => setOpen(false)} className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                Cancel
              </button>
              <button onClick={handleSubmit} className={`w-full text-[16px] text-white rounded-[8px] ${loading ? "bg-[#5f54ff98]" : " bg-[#5E54FF]"} h-[38px]`}>
                {loading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default ContactsPage;