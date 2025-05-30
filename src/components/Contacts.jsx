import { Contact, Download, Mail, Phone, SquarePen, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { Delete, Duplicate, Edit, Notes, ThreeDots, UploadIcon } from "../icons/icons";
import { addContactsToList, createContactList, getContactList, uploadContacts } from "../api/brainai";
import { DateFormat } from "../utils/TimeFormat";

const ContactsPage = () => {
  const [activeTab, setActiveTab] = useState("all-contacts");
  const [open, setOpen] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [formData, setFormData] = useState({ listName: '', description: '', channel: '' })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [channelSelect, setChannelSelect] = useState("all")
  const [statusSelect, setStatusSelect] = useState("any");
  const [createList, setCreateList] = useState(false);
  const [fileUploadError, setFileUploadError] = useState("")

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [formCreateList, setFormCreateList] = useState({ listName: '', contactsId: [], channel: '' });
  const [createListErrors, setCreateListErrors] = useState({});
  const [allContacts, setAllContacts] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [allContactsMessage, setAllContactsMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentContacts, setCurrentContacts] = useState([])

  const totalPages = Math.ceil(allContacts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;


  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };


  useEffect(() => {
    getAllContacts()
  }, [])

  useEffect(() => {
    if (currentContacts?.length > 0) {
      setLoadingStatus(false)
    }
  }, [currentContacts])

  useEffect(() => {
    if (allContacts?.length > 0) {
      setCurrentContacts(allContacts.slice(startIndex, endIndex))
    }
  }, [startIndex, endIndex, allContacts])

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileUploadError("")
    if (file) {
      setSelectedFile(file);
      console.log('Selected file:', file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFileUploadError("")
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('Dropped file:', file);
    }
  };

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

  const statusOptions = [{ label: "Any", key: "any" }, { label: "Active", key: "active" }, { label: "Unconfirmed", key: "unconfirmed" }, { label: "Unsubscribed", key: "unsubscribed" }, { label: "Bounced", key: "bounced" }]
  const channelOptions = [{ label: "All", key: "all" }, { label: "Email", key: "email" }, { label: "Phone No", key: "phone_no" }]

  const selectedChannel = channelOptions.find((a) => a.key == channelSelect)?.label;

  const selectedStatus = statusOptions.find((a) => a.key == statusSelect)?.label;

  const validateForm = () => {
    const newErrors = {};

    if (!formCreateList.listName.trim()) newErrors.listName = "List name is required.";
    if (!formCreateList.channel) newErrors.channel = "Channel is required.";

    setCreateListErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const validateListForm = () => {
    const newErrors = {};

    if (!formData.listName.trim()) newErrors.listName = "List name is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.channel) newErrors.channel = "Channel is required.";

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name]: value
    }))
    setFormErrors((prev) => ({
      ...prev, [name]: ''
    }))
  }

  const handleCreateListChange = (e) => {
    const { name, value } = e.target;
    setFormCreateList((prev) => ({
      ...prev, [name]: value
    }))
    setCreateListErrors((prev) => ({
      ...prev, [name]: ''
    }))
  }

  const getAllContacts = async () => {
    setAllContactsMessage("")
    try {
      const response = await getContactList();
      if (response?.status === 200) {
        console.log(response?.data)
        setAllContacts(...allContacts, response?.data?.contacts)
        if (response?.data?.contacts?.length == 0) {
          setLoadingStatus(false)
          setAllContactsMessage("No Data Found")
          setAllContacts([])
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleListSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true)
    try {
      const response = await addContactsToList(formCreateList);
      if (response?.status === 200) {
        setCreateList(false)
        setFormCreateList({ listName: '', contactsId: [], channel: '' })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


  const handleSubmit = async () => {
    if (!validateListForm()) {
      return;
    }
    setLoading(true)
    try {
      const response = await createContactList(formData);
      if (response?.status === 200) {
        setOpen(false)
      } else {
        console.log(response)
        setFormErrors((prev) => ({ ...prev, listName: response?.response?.data?.message }))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    const response = await fetch('../assets/file/sample_file.svg');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_file';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleDropdownClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const allSelected = formCreateList.contactsId.length === allContacts.length && allContacts.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setFormCreateList((prev) => ({ ...prev, contactsId: [] }));
    } else {
      setFormCreateList((prev) => ({
        ...prev, contactsId: allContacts.map((details) => details.id)
      }))
    }
  };

  const toggleSelectOne = (id) => {
    if (formCreateList.contactsId.includes(id)) {
      setFormCreateList((prev) => ({
        ...prev, contactsId: formCreateList.contactsId.filter(i => i !== id)
      }))
    } else {
      setFormCreateList((prev) => ({
        ...prev, contactsId: [...formCreateList.contactsId, id]
      }))
    }
  };


  const handleUploadFile = async () => {
    console.log(selectedFile)
    if (selectedFile == null) {
      setFileUploadError("File is required")
      return
    }
    setLoading(true)
    try {
      const form = new FormData();
      form.append("file", selectedFile);
      const response = await uploadContacts(form)
      if (response?.status === 200) {
        setOpenImport(false)
        getAllContacts()
      } else {
        console.log(response)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToContactsList = async () => {
    try {
      const response = await addContactsToList(formCreateList)
      if (response?.status === 200) {
        setCreateList(true)
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="flex overflow-auto pr-4 py-4 flex-col w-full items-start gap-6 ">
      <div className="flex flex-col items-start gap-2.5 w-full">
        <div className="flex items-center justify-between w-full">
          <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">
            Contacts
          </h1>

          <div className="flex gap-2.5 items-center">
            {activeTab !== "lists" && <button className="flex items-center gap-2.5 px-5 py-[7px] border-[1.5px] border-[#E1E4EA] rounded-[7px] bg-white">
              <Download color="#5A687C" />
              <span className="font-[500] text-[16px] leading-6 text-[#5A687C]">
                Export
              </span>
            </button>}

            {activeTab !== "lists" && <button onClick={() => setOpenImport(true)} className="flex items-center gap-2.5 px-5 py-[7px] border-[1.5px] border-[#5F58E8] rounded-[7px] bg-white">
              <Upload color="#675FFF" />
              <span className="font-[500] text-[16px] leading-6 text-[#675FFF]">Import</span>
            </button>}

            <button onClick={activeTab === "lists" ? () => setOpen(true) : undefined} className="flex items-center gap-2.5 px-5 py-[7px] bg-[#675FFF] border-[1.5px] border-[#5f58e8] rounded-[7px] text-white">
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
                : "border-transparent text-[#5A687C]"
                }`}
            >
              All Contacts
            </button>
            <button
              onClick={() => setActiveTab("lists")}
              className={`inline-flex items-center justify-center gap-1 p-2.5 border-b-2 ${activeTab === "lists"
                ? "border-[#675fff] text-[#675FFF]"
                : "border-transparent text-[#5A687C]"
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
              <select value={channelSelect} onChange={(e) => setChannelSelect(e.target.value)} className="text-[#5A687C] min-w-[147px] px-3.5 py-[8px] bg-white border border-[#e1e4ea] shadow-shadows-shadow-xs rounded-lg">
                <option value={channelSelect} disabled>
                  Channel: {selectedChannel}
                </option>
                {channelOptions.map(e => (
                  <option className={`${channelSelect == e.key && 'hidden'}`} key={e.key} value={e.key}>{e.label}</option>
                ))}
              </select>

              <select value={statusSelect} onChange={(e) => setStatusSelect(e.target.value)} className="text-[#5A687C] min-w-[147px] px-3.5 py-[8px] bg-white border border-[#e1e4ea] shadow-shadows-shadow-xs rounded-lg">
                <option value={statusSelect} disabled>
                  Status: {selectedStatus}
                </option>
                {statusOptions.map(e => (
                  <option className={`${statusSelect == e.key && 'hidden'}`} key={e.key} value={e.key}>{e.label}</option>
                ))}
              </select>
              <div className="relative w-[179px]">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search"
                  className="w-full pl-10 pr-3.5 pt-[7px] pb-[6px] bg-white border border-[#e1e4ea] shadow-shadows-shadow-xs rounded-lg"
                />
              </div>
              {activeTab !== "lists" && <button disabled={formCreateList.contactsId?.length === 0} onClick={handleAddToContactsList} className="flex items-center gap-2.5 px-5 py-[6px] bg-[#675FFF] border-[1.5px] border-[#5f58e8] rounded-[7px] text-white">
                <span className="font-medium text-base leading-6">
                  Create List
                </span>
              </button>}
            </div>
          </div>
          <div className="overflow-auto w-full">
            <table className="min-w-full rounded-2xl">
              <thead>
                <tr className="text-left text-[#5A687C]">
                  {tableHeaders.map((header, index) => (
                    <th key={index} className="px-6 py-3 text-[16px] font-[400] whitespace-nowrap">
                      {header.name === 'Full Name' ? (
                        <div className="flex items-center gap-2">
                          <label class="checkbox-container">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={toggleSelectAll}
                            />
                            <span class="checkmark"></span>
                          </label>
                          {header.name}
                        </div>
                      ) : (
                        header.name
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white border border-[#E1E4EA] rounded-[16px]">
                {loadingStatus ? <tr className='h-34'><td ></td><td ></td><td><span className='loader' /></td></tr> : allContactsMessage ? <tr className='h-34'><td></td><td ></td><td>{allContactsMessage}</td></tr> : <>
                  {currentContacts.map((contact, index) => (
                    <tr key={index} className={`${contacts.length - 1 !== index && 'border border-[#E1E4EA] px-4'}`}>
                      <td className="px-6 py-4 text-sm text-gray-800 font-semibold whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <label class="checkbox-container">
                            <input
                              type="checkbox"
                              checked={formCreateList.contactsId.includes(contact.id)}
                              onChange={() => toggleSelectOne(contact.id)}
                            />
                            <span class="checkmark"></span>
                          </label>
                          {contact?.firstName}{" "}{contact?.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {contact?.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {contact?.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {DateFormat(contact?.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-3.5">
                          <Edit />
                          <Delete className="text-red-500" />
                        </div>
                      </td>
                    </tr>
                  ))}</>}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 px-4 flex-wrap gap-3">
              <div className="flex items-center gap-2 text-[16px] text-[#5A687C]">
                <div>
                  Showing {startIndex + 1} - {Math.min(endIndex, allContacts.length)} of {allContacts.length}
                </div>
                |
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="border border-[#E1E4EA] rounded-lg px-2 py-1"
                >
                  {[10, 20, 50, 75, 100].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-gray-600 h-[32px] w-[32px] flex justify-center items-center rounded-md border border-[#E1E4EA] hover:text-black disabled:opacity-30"
                >
                  <FiChevronLeft />
                </button>

                {(() => {
                  const buttons = [];
                  const visiblePages = 5;

                  if (totalPages <= visiblePages) {
                    for (let i = 1; i <= totalPages; i++) {
                      buttons.push(i);
                    }
                  } else {
                    buttons.push(1);
                    const left = currentPage - 1;
                    const right = currentPage + 1;
                    if (currentPage > 3) {
                      buttons.push("...");
                    }
                    for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
                      buttons.push(i);
                    }
                    if (currentPage < totalPages - 2) {
                      buttons.push("...");
                    }
                    buttons.push(totalPages);
                  }
                  return buttons.map((page, index) =>
                    page === "..." ? (
                      <span key={`ellipsis-${index}`} className="mx-1 text-gray-500">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-[32px] w-[32px] flex justify-center items-center rounded-md text-[16px] border ${currentPage === page
                          ? 'bg-[#675FFF] text-white'
                          : 'bg-white text-[#5A687C] border-[#E1E4EA]'
                          }`}
                      >
                        {page}
                      </button>
                    )
                  );
                })()}


                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="text-gray-600 rounded-md  border border-[#E1E4EA] h-[32px] w-[32px] flex justify-center items-center hover:text-black disabled:opacity-30"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </>
      ) :

        (<>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-start gap-3">
              <select value={channelSelect} onChange={(e) => setChannelSelect(e.target.value)} className="text-[#5A687C] min-w-[147px] px-3.5 py-[8px] bg-white border border-[#e1e4ea] shadow-shadows-shadow-xs rounded-lg">
                <option value={channelSelect} disabled>
                  Channel: {selectedChannel}
                </option>
                {channelOptions.map(e => (
                  <option className={`${channelSelect == e.key && 'hidden'}`} key={e.key} value={e.key}>{e.label}</option>
                ))}
              </select>
              <div className="relative w-[179px]">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search"
                  className="w-full pl-10 pr-3.5 pt-[7px] pb-[6px] bg-white border border-[#e1e4ea] shadow-shadows-shadow-xs rounded-lg"
                />
              </div>
            </div>
          </div>
          <div className="overflow-auto w-full rounded-2xl">
            <table className="w-full rounded-2xl">
              <thead>
                <tr className="text-left text-[#5A687C] text-[16px] font-[400]">
                  <th className="px-6 py-3 font-[400] whitespace-nowrap">List Name</th>
                  <th className="px-6 py-3 font-[400] whitespace-nowrap">Active Contacts</th>
                  <th className="px-6 py-3 font-[400] whitespace-nowrap">Channel</th>
                  <th className="px-6 py-3 font-[400] whitespace-nowrap">Created Date</th>
                  <th className="px-6 py-3 font-[400] whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white border border-[#E1E4EA] rounded-[16px]">
                {contactLists.map((list, index) => (
                  <tr key={list.name} className={`${contacts.length - 1 !== index && 'border border-[#E1E4EA] px-4 text-[16px]'}`}>
                    <td className="px-6 py-4 font-[600] whitespace-nowrap">{list.name}</td>
                    <td className="px-6 py-4 font-[400] text-[#5A687C] whitespace-nowrap">{list.activeContacts.toLocaleString()}</td>
                    <td className="px-6 py-4 font-[400] whitespace-nowrap">
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
                    <td className="px-6 py-4 font-[400] text-[#5A687C] whitespace-nowrap">{list.createdDate}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDropdownClick(index)} className="p-2 rounded-lg">
                        <div className='bg-[#F4F5F6] p-2 rounded-lg'><ThreeDots /></div>
                      </button>
                      {activeDropdown === index && (
                        <div className="absolute right-6  w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                          <div className="py-1">
                            <button
                              className="block group w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] font-[500] hover:bg-gray-100"
                              onClick={() => {
                                setActiveDropdown(null);
                              }}
                            >
                              <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>Edit</span> </div>
                            </button>
                            <button
                              className="block group w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] font-[500] hover:bg-[#F4F5F6]"
                              onClick={() => {
                                setActiveDropdown(null);
                              }}
                            >
                              <div className="flex items-center gap-2"><div className='group-hover:hidden'><Notes /></div> <div className='hidden group-hover:block'><Notes status={true} /></div> <span>View Contacts</span> </div>
                            </button>
                            <button
                              className="block group w-full text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] font-[500] hover:bg-[#F4F5F6]"
                              onClick={() => {
                                setActiveDropdown(null);
                              }}
                            >
                              <div className="flex items-center gap-2"><div className='group-hover:hidden'><Duplicate /></div> <div className='hidden group-hover:block'><Duplicate status={true} /></div> <span>Duplicate</span> </div>
                            </button>
                            <hr style={{ color: "#E6EAEE" }} />
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6]"
                              onClick={() => {
                                setActiveDropdown(null);
                              }}
                            >
                              <div className="flex items-center gap-2">{<Delete />} <span className="font-[500]">Delete</span> </div>
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

        </>)
      }

      {open && (
        <div className=" fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
          <div className="bg-white max-h-[547px] overflow-auto flex flex-col gap-3 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => {
                setOpen(false)
                setFormData({ listName: '', description: '', channel: '' })
                setFormErrors({})
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-[#1E1E1E] font-semibold text-[20px] mb-2">Create a List</h2>

            <div className="flex flex-col gap-2">
              <div>
                <label className="block text-[14px] font-medium text-[#292D32] mb-1">Name</label>
                <div className={`flex items-center border ${formData.listName ? 'border-red-500' : 'border-gray-300'} rounded-[8px] px-4 py-3`}>
                  <input
                    type="text"
                    name="listName"
                    placeholder="e.g. Monthly Newsletter, Sales Leads, etc."
                    value={formData?.listName}
                    onChange={handleChange}
                    className="w-full focus:outline-none"
                  />
                </div>
                <p className="text-[12px] pt-2 text-[#5A687C] font-[400]">List names are visible to contacts</p>
              </div>
              {formErrors.listName && <p className="text-sm text-red-500">{formErrors.listName}</p>}
              <div>
                <label className="block text-[14px] font-medium text-[#292D32] mb-1">List Description</label>
                <div className={`flex items-center border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-[8px] px-4 py-3`}>
                  <textarea
                    type="text"
                    name="description"
                    placeholder="Describe your list to your team. This description will not be visible to your contacts. "
                    value={formData?.description}
                    rows={4}
                    onChange={handleChange}
                    className="w-full focus:outline-none resize-none"
                  />
                </div>
                {formErrors.description && <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>}
              </div>
              <label className="block mt-2 text-[14px] font-medium text-[#292D32]">Channel</label>
              <div className={`w-full flex items-center border ${formErrors.channel ? 'border-red-500' : 'border-gray-300'} rounded-lg pb-1`}>
                <select
                  value={formData?.channel}
                  name="channel"
                  onChange={handleChange}
                  className="w-full bg-white px-4 py-2 text-[#5A687C] rounded-lg "
                >
                  <option value="" disabled>Select</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
              {formErrors.channel && <p className="text-sm text-red-500">{formErrors.channel}</p>}
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => {
                setOpen(false)
                setFormData({ listName: '', description: '', channel: '' })
                setFormErrors({})
              }} className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                Cancel
              </button>
              <button onClick={handleSubmit} className={`w-full text-[16px] text-white rounded-[8px] ${loading ? "bg-[#5f54ff98]" : " bg-[#5E54FF]"} h-[38px]`}>
                {loading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {createList && (
        <div className=" fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
          <div className="bg-white max-h-[547px] overflow-auto flex flex-col gap-3 w-full max-w-[510px] rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => {
                setCreateList(false)
                setFormCreateList({ listName: "", channel: '', contactsId: [] })
                setCreateListErrors({})
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>


            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-[#1E1E1E] font-[600] text-[20px]">Create List</h2>
                <h2 className="text-[#5A687C] font-[400] text-[16px]">{formCreateList.contactsId?.length} Contact Selected</h2>
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <label className="block text-[14px] font-medium text-[#292D32] mb-1">List Name</label>
                  <div className={`flex items-center border ${createListErrors.listName ? 'border-red-500' : 'border-gray-300'} rounded-[8px] px-4 py-3`}>
                    <input
                      type="text"
                      name="listName"
                      placeholder="Enter list name"
                      value={formCreateList?.listName}
                      onChange={handleCreateListChange}
                      className="w-full focus:outline-none"
                    />
                  </div>
                  {createListErrors.listName && <p className="text-sm text-red-500 mt-1">{createListErrors.listName}</p>}
                </div>
                <div>
                  <label className="block mt-2 text-[14px] font-medium text-[#292D32]">Channel</label>
                  <div className={`w-full flex items-center border ${createListErrors.channel ? 'border-red-500' : 'border-gray-300'} rounded-lg pb-1`}>
                    <select
                      value={formCreateList?.channel}
                      name="channel"
                      onChange={handleCreateListChange}
                      className="w-full bg-white px-4 py-2 text-[#5A687C] rounded-lg "
                    >
                      <option value="" disabled>Select</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                  {createListErrors.channel && <p className="text-sm text-red-500">{createListErrors.channel}</p>}
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button onClick={() => {
                  {
                    setCreateList(false)
                    setFormCreateList({ listName: "", channel: '', contactsId: [] })
                    setCreateListErrors({})
                  }
                }} className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                  Cancel
                </button>
                <button onClick={handleListSubmit} className={`w-full text-[16px] text-white rounded-[8px] ${loading ? "bg-[#5f54ff98]" : " bg-[#5E54FF]"} h-[38px]`}>
                  {loading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Save"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {openImport && (
        <div className=" fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
          <div className="bg-white max-h-[547px] flex flex-col gap-3 w-full max-w-3xl rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => {
                setOpenImport(false)
                setSelectedFile(null)
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-[#1E1E1E] font-[600] text-[20px] mb-2">Upload your files</h2>
            <p className="text-[16px] font-[400] text-[#5A687C]">Before uploading files. make sure your file is ready to import. <span onClick={handleDownload} className="text-[#675FFF]">Download sample file</span> or <span className="text-[#675FFF]">learn more</span>.</p>
            <div className="flex flex-col gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Upload File / Images</label>
                <div className="mt-2">
                  <div
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center py-4 border-2 border-dashed rounded-md text-center cursor-pointer transition ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-[#335CFF80] bg-[#F5F7FF]'
                      }`}
                  >
                    <UploadIcon />
                    <p className="text-[18px] font-[600] text-[#1E1E1E] mt-2">
                      Upload from your computer
                    </p>
                    <p className="text-[14px] font-[500] text-[#5A687C] mt-1">
                      or drag and drop
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {selectedFile && (
                    <div className="mt-3 text-sm text-gray-700">
                      <strong>Selected File:</strong> {selectedFile.name}
                    </div>
                  )}
                </div>
                {fileUploadError && <p className="text-sm text-red-500 mt-1">{fileUploadError}</p>}
              </div>
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                <div>
                  <label className="block text-[14px] font-medium text-[#292D32] mb-1">Choose how to import contacts</label>
                  <div className="w-full flex items-center border border-gray-300 rounded-lg">
                    <select
                      name="channel"
                      className="w-full bg-white px-4 py-2 rounded-lg focus:outline-none"
                    >
                      <option value="" disabled>Select</option>
                      <option value="create_contact">Create contact</option>
                      <option value="update_contact">Update contact</option>
                      <option value="create_update_contact">Create and update contact</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-[500] text-[#1E1E1E] mb-1">Find existing contacts based on</label>
                  <div className="w-full flex items-center border border-gray-300 rounded-lg">
                    <select
                      name="existing_contacts"
                      className="w-full bg-white px-4 py-2 rounded-lg focus:outline-none"
                    >
                      <option value="" disabled>Select</option>
                      <option value="phone">Phone</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => {
                setOpenImport(false)
                setSelectedFile(null)
              }} className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                Cancel
              </button>
              <button onClick={handleUploadFile} className={`w-full text-[16px] text-white rounded-[8px] ${loading ? "bg-[#5f54ff98]" : " bg-[#5E54FF]"} h-[38px]`}>
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