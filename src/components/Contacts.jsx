import { Contact, Download, Mail, Phone, SquarePen, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { Delete, Duplicate, Edit, Notes, ThreeDots, UploadIcon } from "../icons/icons";
import { addContactsToList, createContactList, getContactList, uploadContacts, getLists, newContactAdd, deleteList, duplicateList, updateList, deleteContact, updateContact } from "../api/brainai";
import { DateFormat } from "../utils/TimeFormat";
import { format } from "date-fns";
import { FaChevronDown } from "react-icons/fa";
import uk_flag from "../assets/images/uk_flag.png"
import us_flag from "../assets/images/us_flag.png"
import fr_flag from "../assets/images/fr_flag.png"
import { SelectDropdown } from "./Dropdown";
import { useSelector } from "react-redux";

const countries = [
  { name: "United States", code: "US", dial_code: "+1", flag: us_flag },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: uk_flag }, ,
  { name: "France", code: "FR", dial_code: "+33", flag: fr_flag }, ,
  // Add more countries as needed
];

const ContactsPage = () => {
  const [activeTab, setActiveTab] = useState("all-contacts");
  const [open, setOpen] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [formData, setFormData] = useState({ listName: '', description: '', channel: '' })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [channelSelect, setChannelSelect] = useState("all")
  const [channelSelectList, setChannelSelectList] = useState("all")
  const [statusSelect, setStatusSelect] = useState("any");
  const [createList, setCreateList] = useState(false);
  const [fileUploadError, setFileUploadError] = useState("")
  const [contactSearch, setContactSearch] = useState("")
  const [listSearch, setListSearch] = useState("")
  const countryData = useSelector((state) => state.country.data)

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
  const [totalContacts, setTotalContacts] = useState(0);
  const [contactLists, setContactLists] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [addContactModal, setAddContactModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);
  const [addNewContact, setAddNewContact] = useState({
    firstName: '',
    lastName: '',
    // phoneCode: selectedCountry.dial_code,
    email: '',
    companyName: '',
  });
  const [error, setError] = useState({});
  const [listMessage, setListMessage] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [isEdit, setIsEdit] = useState("");
  const [contactIsEdit, setContactIsEdit] = useState("")

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;


  const validateSubmit = () => {
    const errors = {};
    if (!addNewContact.firstName) {
      errors.firstName = "First name is required";
    }
    if (!addNewContact.lastName) {
      errors.lastName = "Last name is required";
    }
    if (!addNewContact.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s]+$/.test(addNewContact.phone)) {
      errors.phone = "Invalid phone number format";
    }
    //  else if (addNewContact.phone.replace(/\D/g, "").length !== 10) {
    //   errors.phone = "Phone number must be exactly 10 digits";
    // }
    if (!addNewContact.email) {
      errors.email = "Email is required";
    }
    if (!addNewContact.companyName) {
      errors.companyName = "Company Name is required";
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  }


  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };


  const handleAddContactChange = (e) => {
    const { name, value } = e.target;
    setAddNewContact((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: '' }));
  }


  // useEffect(() => {
  //   if (currentContacts?.length > 0) {
  //     setLoadingStatus(false)
  //   }
  // }, [currentContacts])

  const handleNewContactSubmit = async () => {
    if (!validateSubmit()) {
      return;
    }
    setLoading(true)
    try {
      const response = await newContactAdd({ ...addNewContact, phone: selectedCountry.dial_code + " " + addNewContact.phone })
      if (response?.status === 201) {
        setAddContactModal(false);
        setAddNewContact({
          firstName: '',
          lastName: '',
          // phoneCode: '',
          phone: '',
          email: '',
          companyName: '',
        });
        getAllContacts();
      } else {
        console.log(response)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateContactSubmit = async () => {
    if (!validateSubmit()) {
      return;
    }
    setLoading(true)
    try {
      const response = await updateContact({ ...addNewContact, phone: selectedCountry.dial_code + " " + addNewContact.phone, contactId: contactIsEdit })
      if (response?.status === 200) {
        setAddContactModal(false);
        setAddNewContact({
          firstName: '',
          lastName: '',
          // phoneCode: '',
          phone: '',
          email: '',
          companyName: '',
        });
        setContactIsEdit("");
        getAllContacts();
      } else {
        console.log(response)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


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



  const tableHeaders = [
    { name: "Full Name", width: "flex-1" },
    { name: "Email", width: "w-[290px]" },
    { name: "Phone No", width: "flex-1" },
    { name: "Date Created", width: "flex-1" },
    { name: "Actions", width: "w-[120px]" },
  ];

  const statusOptions = [{ label: "Any", key: "any" }, { label: "Active", key: "active" }, { label: "Unconfirmed", key: "unconfirmed" }, { label: "Unsubscribed", key: "unsubscribed" }, { label: "Bounced", key: "bounced" }]
  const channelOptions = [{ label: "All", key: "all" }, { label: "Email", key: "email" }, { label: "Phone No", key: "phone" }]
  const listChannelOptions = [{ label: "Email", key: "email" }, { label: "Phone No", key: "phone" }]
  const rowsPerPageOptions = [{ label: "10", key: 10 }, { label: "20", key: 20 }, { label: "50", key: 50 }, { label: "75", key: 75 }, { label: "100", key: 100 }]

  useEffect(() => {
    if (contactLists?.length > 0) {
      setListLoading(false);
    }
  }, [contactLists])

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

  const handleDeleteContact = async (contactId) => {
    setActiveDropdown(null);
    try {
      const response = await deleteContact(contactId);
      if (response?.status === 200) {
        getAllContacts();
      }
    } catch (error) {
      console.log(error)
    }
  }


  const handleDeleteList = async (listId) => {
    setActiveDropdown(null);
    try {
      const response = await deleteList(listId);
      if (response?.status === 200) {
        handleGetLists();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDuplicateList = async (listId) => {
    setActiveDropdown(null);
    try {
      const response = await duplicateList({ listId: listId });
      if (response?.status === 200) {
        handleGetLists();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateList = async () => {
    if (!validateListForm()) {
      return;
    }
    setLoading(true)
    try {
      const response = await updateList({ ...formData, listId: isEdit });
      if (response?.status === 200) {
        handleGetLists();
        setOpen(false);
        setIsEdit("");
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

  const getAllContacts = async () => {
    setAllContactsMessage("")
    try {
      const response = await getContactList(currentPage, rowsPerPage, channelSelect, contactSearch);
      if (response?.status === 200) {
        console.log(response?.data)

        if (response?.data?.contacts?.length == 0) {

          setAllContactsMessage("No Contacts Found")
          setAllContacts([])
        } else {
          setAllContacts(response?.data?.contacts);
          setTotalPages(response?.data?.totalPages);
          setTotalContacts(response?.data?.totalContacts);

        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingStatus(false)
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
        handleGetLists()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


  const handleGetLists = async () => {
    setListMessage("");
    try {
      setListLoading(true);
      const response = await getLists(channelSelectList, listSearch);
      if (response?.status === 200) {
        setContactLists(response?.data?.lists);
        console.log(response?.data?.lists)
        if (response?.data?.lists?.length === 0) {
          setListLoading(false);
          setListMessage("No Lists Found");
        }
      }

    } catch (error) {
      console.log(error)
    }
  }


  const handleSubmit = async () => {
    if (!validateListForm()) {
      return;
    }
    setLoading(true)
    try {
      const response = await createContactList(formData);
      if (response?.status === 201) {
        setOpen(false)
        handleGetLists();
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

  const extractPhoneDetails = (phoneNumber) => {
    const regex = /^(\+\d+)\s*(\d+)$/;
    const match = phoneNumber.match(regex);

    if (match) {
      const countryCode = match[1];
      const number = match[2];
      return { countryCode, number };
    }
    return { countryCode: "", number: "" };
  };


  const renderPhoneNumber = (phone) => {
    const { countryCode, number } = extractPhoneDetails(phone);
    return `${countryCode}-${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6)}`
  }

  const handleEditList = (list) => {
    console.log(list)
    setIsEdit(list.id);
    setActiveDropdown(null);
    setOpen(true)
    setFormData({ listName: list.listName, description: list.description, channel: list.channel })
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      handleGetLists()
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [channelSelectList, listSearch])

  useEffect(() => {
    const handler = setTimeout(() => {
      getAllContacts()
    }, 300);

    return () => {
      clearTimeout(handler);
    };

  }, [currentPage, rowsPerPage, channelSelect, contactSearch]);



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

            <button onClick={activeTab === "lists" ? () => setOpen(true) : () => setAddContactModal(true)} className="flex items-center gap-2.5 px-5 py-[7px] bg-[#675FFF] border-[1.5px] border-[#5f58e8] rounded-[7px] text-white">
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
              <SelectDropdown
                name="all_contacts_channel"
                options={channelOptions}
                value={channelSelect}
                onChange={(updated) => setChannelSelect(updated)}
                placeholder="Select"
                className="w-[198px]"
                extraName="Channel"
              />
              <SelectDropdown
                name="all_contacts_status"
                options={statusOptions}
                value={statusSelect}
                onChange={(updated) => setStatusSelect(updated)}
                placeholder="Select"
                className="w-[215px]"
                extraName="Status"
              />
              <div className="relative w-[179px]">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value.trim())}
                  className="w-full pl-10 pr-3.5 pt-[8px] pb-[8px] bg-white border border-[#e1e4ea] focus:outline-none focus:border-[#675FFF] rounded-lg"
                />
              </div>
              {activeTab !== "lists" && <button disabled={formCreateList.contactsId?.length === 0} onClick={() => setCreateList(true)} className="flex items-center text-[16px] font-[500] gap-2.5 px-5 py-[7px] bg-[#675FFF] border-[1.5px] border-[#5f58e8] rounded-[7px] text-white">
                Create List
              </button>}
            </div>
          </div>
          <div className="overflow-auto w-full">
            <table className="min-w-full">
              <div className="px-3 w-full">
                <thead>
                  <tr className="text-left text-[#5A687C]">
                    {tableHeaders.map((header, index) => (
                      <th key={index} className={`p-[14px] ${index !== tableHeaders.length - 1 && 'min-w-[200px] max-w-[25%]'} w-full text-[16px] font-[400] whitespace-nowrap`}>
                        {header.name === 'Full Name' ? (
                          <div className="flex items-center gap-2">
                            <label className="checkbox-container">
                              <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleSelectAll}
                              />
                              <span className="checkmark"></span>
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
              </div>
              <div className="border border-[#E1E4EA] w-full bg-white rounded-2xl p-3">
                {loadingStatus ? <p className="flex justify-center items-center h-34"><span className="loader" /></p> :
                  allContacts.length !== 0 ?
                    <tbody className="w-full">
                      {allContacts.map((contact, index) => (
                        <tr key={index} className={`${allContacts.length - 1 !== index && 'border-b border-[#E1E4EA]'}`}>
                          <td className="p-[14px] min-w-[200px] max-w-[25%] w-full text-sm text-gray-800 font-semibold whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <label className="checkbox-container">
                                <input
                                  type="checkbox"
                                  checked={formCreateList.contactsId.includes(contact.id)}
                                  onChange={() => toggleSelectOne(contact.id)}
                                />
                                <span className="checkmark"></span>
                              </label>
                              {contact?.firstName}{" "}{contact?.lastName}
                            </div>
                          </td>
                          <td className="py-[14px] pr-[14px] min-w-[200px] max-w-[25%] w-full text-sm text-[#5A687C] whitespace-nowrap">
                            {contact?.email}
                          </td>
                          <td className="py-[14px] pr-[14px] min-w-[200px] max-w-[25%] w-full text-sm text-[#5A687C] whitespace-nowrap">
                            {renderPhoneNumber(contact?.phone)}
                          </td>
                          <td className="py-[14px] pr-[14px] min-w-[200px] max-w-[25%] w-full text-sm text-[#5A687C] whitespace-nowrap">
                            {DateFormat(contact?.created_at)}
                          </td>
                          <td className="p-[14px]  w-full text-sm text-[#5A687C]">
                            <div className="flex items-center gap-3.5">
                              <div onClick={() => {
                                setContactIsEdit(contact.id);
                                setAddContactModal(true);
                                const { countryCode, number } = extractPhoneDetails(contact.phone);
                                setAddNewContact(({ ...contact, phone: number }))
                                const filterCountry = countryData.filter((e) => e.dial_code == countryCode)
                                setSelectedCountry(filterCountry[0])
                              }}>
                                <Edit />
                              </div>
                              <div onClick={() => handleDeleteContact(contact.id)}>
                                <Delete className="text-red-500" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody> : <p className="flex justify-center items-center h-34 text-[#1E1E1E]">No Contacts Listed</p>}
              </div>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4 px-4 flex-wrap gap-3 w-full">
            <div className="flex items-center gap-2 text-[16px] text-[#5A687C]">
              <div>
                Showing {(currentPage - 1) * rowsPerPage + 1} - {Math.min((currentPage) * rowsPerPage, totalContacts)} of {totalContacts}

              </div>
              |
              <span>Rows per page:</span>
              <SelectDropdown
                name="rowsPerPage"
                options={rowsPerPageOptions}
                value={rowsPerPage}
                onChange={(updated) => {
                  setRowsPerPage(Number(updated));
                  setCurrentPage(1);
                }}
                placeholder="Select"
                className=""
              />
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
        </>
      ) :

        (<>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-start gap-3">
              <SelectDropdown
                name="list_channel"
                options={channelOptions}
                value={channelSelectList}
                onChange={(updated) => setChannelSelectList(updated)}
                placeholder="Select"
                className="w-[198px]"
                extraName="Channel"
              />
              <div className="relative w-[179px]">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value.trim())}
                  placeholder="Search"
                  className="w-full pl-10 pr-3.5 pt-[8px] pb-[8px] bg-white border border-[#e1e4ea] focus:outline-none focus:border-[#675FFF] rounded-lg"
                />
              </div>
            </div>
          </div>
          <div className="overflow-auto w-full">
            <table className="w-full">
              <div className="px-5 w-full">
                <thead>
                  <tr className="text-left text-[#5A687C] text-[16px] font-[400]">
                    <th className="p-[14px] min-w-[200px] max-w-[25%] w-full font-[400] whitespace-nowrap">List Name</th>
                    <th className="p-[14px] min-w-[200px] max-w-[25%] w-full font-[400] whitespace-nowrap">Active Contacts</th>
                    <th className="p-[14px] min-w-[200px] max-w-[25%] w-full font-[400] whitespace-nowrap">Channel</th>
                    <th className="p-[14px] min-w-[200px] max-w-[25%] w-full font-[400] whitespace-nowrap">Created Date</th>
                    <th className="p-[14px] w-full font-[400] whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
              </div>
              <div className="border border-[#E1E4EA] w-full bg-white rounded-2xl p-3">
                {listLoading ? <p className="flex justify-center items-center h-34"><span className="loader" /></p> :
                  contactLists.length !== 0 ?
                    <tbody className="w-full">
                      {contactLists.map((list, index) => (
                        <tr key={list.name} className={`${contactLists.length - 1 !== index && 'border-b border-[#E1E4EA] text-[16px]'}`}>
                          <td className="p-[14px] min-w-[200px] max-w-[25%] w-full font-[600] whitespace-nowrap">{list.listName}</td>
                          <td className="py-[14px] pl-[25px] pr-[14px] min-w-[200px] max-w-[25%] w-full font-[400] text-[#5A687C] whitespace-nowrap">{list.activeContacts.toLocaleString()}</td>
                          <td className="py-[14px] pl-[10px] pr-[14px] min-w-[200px] max-w-[25%] w-full font-[400] whitespace-nowrap">
                            {list.channel.toLowerCase() === "email" ? (
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
                          <td className="py-[14px] pl-[5px] pr-[14px] min-w-[200px] max-w-[25%] w-full font-[400] text-[#5A687C] whitespace-nowrap">{format(list.createdDate, 'dd/MM/yyyy hh:mm a')}</td>
                          <td className="p-[14px] w-full">
                            <button onClick={() => handleDropdownClick(index)} className="p-2 rounded-lg relative">
                              <div className='bg-[#F4F5F6] p-2 rounded-lg'><ThreeDots /></div>
                              {activeDropdown === index && (
                                <div className="absolute right-6 px-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 z-10">
                                  <div className="py-1">
                                    <button
                                      className="block group w-full hover:rounded-lg  text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] font-[500] hover:bg-[#F4F5F6]"
                                      onClick={() => {
                                        handleEditList(list);
                                      }}
                                    >
                                      <div className="flex items-center gap-2"><div className='group-hover:hidden'><Edit /></div> <div className='hidden group-hover:block'><Edit status={true} /></div> <span>Edit</span> </div>
                                    </button>
                                    <button
                                      className="block group w-full hover:rounded-lg  text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] font-[500] hover:bg-[#F4F5F6]"
                                      onClick={() => {
                                        setActiveDropdown(null);
                                      }}
                                    >
                                      <div className="flex items-center gap-2"><div className='group-hover:hidden'><Notes /></div> <div className='hidden group-hover:block'><Notes status={true} /></div> <span>View Contacts</span> </div>
                                    </button>
                                    <button
                                      className="block group w-full hover:rounded-lg  text-left px-4 py-2 text-sm text-[#5A687C] hover:text-[#675FFF] font-[500] hover:bg-[#F4F5F6]"
                                      onClick={() => {
                                        handleDuplicateList(list.id);
                                      }}
                                    >
                                      <div className="flex items-center gap-2"><div className='group-hover:hidden'><Duplicate /></div> <div className='hidden group-hover:block'><Duplicate status={true} /></div> <span>Duplicate</span> </div>
                                    </button>
                                    <hr style={{ color: "#E6EAEE", marginTop: "5px" }} />
                                    <div className='py-2'>
                                      <button
                                        className="block w-full text-left hover:rounded-lg  px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F4F5F6]"
                                        onClick={() => {
                                          handleDeleteList(list.id);
                                        }}
                                      >
                                        <div className="flex items-center gap-2">{<Delete />} <span className="font-[500]">Delete</span> </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody> : <p className="flex justify-center items-center h-34 text-[#1E1E1E]">No Contacts Listed</p>}
              </div>
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
                setIsEdit("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-[#1E1E1E] font-semibold text-[20px] mb-2">{isEdit ? 'Update' : 'Create'} a List</h2>

            <div className="flex flex-col gap-2">
              <div>
                <label className="block text-[14px] font-medium text-[#292D32] mb-1">Name</label>
                <input
                  type="text"
                  name="listName"
                  placeholder="e.g. Monthly Newsletter, Sales Leads, etc."
                  value={formData?.listName}
                  onChange={handleChange}
                  className={`flex w-full items-center border ${formErrors.listName ? 'border-red-500' : 'border-gray-300'} rounded-[8px] px-4 py-2 focus:outline-none focus:border-[#675FFF]`}
                />
                <p className="text-[12px] pt-2 text-[#5A687C] font-[400]">List names are visible to contacts</p>
              </div>
              {formErrors.listName && <p className="text-sm text-red-500">{formErrors.listName}</p>}
              <div>
                <label className="block text-[14px] font-medium text-[#292D32] mb-1">List Description</label>
                <textarea
                  type="text"
                  name="description"
                  placeholder="Describe your list to your team. This description will not be visible to your contacts. "
                  value={formData?.description}
                  rows={4}
                  onChange={handleChange}
                  className={`flex w-full items-center border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-[8px] px-4 py-3 focus:outline-none focus:border-[#675FFF] resize-none`}
                />
                {formErrors.description && <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>}
              </div>
              <label className="block mt-2 text-[14px] font-medium text-[#292D32]">Channel</label>
              <SelectDropdown
                name="channel"
                options={listChannelOptions}
                value={formData?.channel}
                onChange={(updated) => {
                  setFormData((prev) => ({
                    ...prev, channel: updated
                  }))
                  setFormErrors((prev) => ({
                    ...prev, channel: ''
                  }))
                }}
                placeholder="Select"
                className=""
                errors={formErrors}
              />
              {formErrors.channel && <p className="text-sm text-red-500">{formErrors.channel}</p>}
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => {
                setOpen(false)
                setFormData({ listName: '', description: '', channel: '' })
                setFormErrors({})
                setIsEdit("");
              }} className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]">
                Cancel
              </button>
              <button onClick={!isEdit ? () => handleSubmit() : () => handleUpdateList()} className={`w-full text-[16px] text-white rounded-[8px] ${loading ? "bg-[#5f54ff98]" : " bg-[#5E54FF]"} h-[38px]`}>
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
                  <input
                    type="text"
                    name="listName"
                    placeholder="Enter list name"
                    value={formCreateList?.listName}
                    onChange={handleCreateListChange}
                    className={`flex w-full items-center border ${createListErrors.listName ? 'border-red-500' : 'border-gray-300'} rounded-[8px] px-4 py-2 focus:outline-none focus:border-[#675FFF]`}
                  />
                  {createListErrors.listName && <p className="text-sm text-red-500 mt-1">{createListErrors.listName}</p>}
                </div>
                <div>
                  <label className="block mt-2 text-[14px] font-medium text-[#292D32]">Channel</label>
                  <SelectDropdown
                    name="channel"
                    options={listChannelOptions}
                    value={formCreateList?.channel}
                    onChange={(updated) => {
                      setFormCreateList((prev) => ({
                        ...prev, channel: updated
                      }))
                      setCreateListErrors((prev) => ({
                        ...prev, channel: ''
                      }))
                    }}
                    placeholder="Select"
                    className=""
                    errors={createListErrors}
                  />
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

      {addContactModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[510px] max-h-[85vh] overflow-auto  p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setAddContactModal(false)
                setContactIsEdit("")
                setAddNewContact({
                  firstName: '',
                  lastName: '',
                  // phoneCode: '',
                  phone: '',
                  email: '',
                  companyName: '',
                });
                setError({})
              }}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              {contactIsEdit ? 'Update' : 'Add New'} Contact
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[14px] text-[#1E1E1E] font-[500] block mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={addNewContact.firstName}
                    onChange={handleAddContactChange}
                    placeholder="Enter first name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#675FFF]"
                  />

                  {error.firstName && (
                    <p className="text-red-500 text-sm mt-1">{error.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="text-[14px] text-[#1E1E1E] font-[500] block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={addNewContact.lastName}
                    onChange={handleAddContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#675FFF]"
                  />

                  {error.lastName && (
                    <p className="text-red-500 text-sm mt-1">{error.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[14px] text-[#1E1E1E] font-[500] block mb-1">
                  Number
                </label>
                <div className="flex group items-center focus-within:border-[#675FFF] gap-2 border border-gray-300 rounded-lg px-4 py-2">
                  <div className="relative">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-fit flex hover:cursor-pointer relative border-none justify-between gap-1 items-center border py-1 text-left"
                    >
                      <div className="flex items-center gap-2 mr-3">
                        <img src={selectedCountry?.flag} alt={selectedCountry?.name} className='w-4 h-4 rounded-full' />
                        <p className="text-[#5A687C] font-[400] text-[16px]">{selectedCountry.dial_code}</p>
                      </div>
                      <FaChevronDown color="#5A687C" className={`w-[10px]  transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                      <hr style={{ color: "#E1E4EA", width: "22px", transform: "rotate(-90deg)" }} />
                    </button>
                    {isOpen && (
                      <div className="absolute px-1 z-10 rounded-md shadow-lg border border-gray-200 max-h-40 overflow-auto top-6 w-full left-[-13px] bg-white mt-1">
                        {countryData.map((country) => (
                          <div
                            key={country.code}
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsOpen(false);
                              // setAddNewContact((prev) => ({ ...prev, phoneCode: country.dial_code }));
                            }}
                            className={`flex justify-center gap-2 hover:bg-[#F4F5F6] hover:rounded-lg pr-1 my-1 py-2 ${selectedCountry?.code === country?.code && 'bg-[#F4F5F6] rounded-lg'} cursor-pointer flex items-center`}
                          >
                            <img src={country.flag} alt={country.name} className='w-4 h-4 rounded-full' />
                            <p className="text-[#5A687C] font-[400] text-[16px]">{country.dial_code}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={addNewContact.phone}
                    onChange={handleAddContactChange}
                    placeholder="Enter number"
                    className="w-full outline-none"
                  // onChange={(e) => {
                  //   setNumber(e.target.value);
                  //   setError((prev) => ({ ...prev, number: "" }));
                  // }}
                  // value={number}
                  />


                </div>
                {error.phone && (
                  <p className="text-red-500 text-sm mt-1">{error.phone}</p>
                )}
              </div>
              <div>
                <label className="text-[14px] text-[#1E1E1E] font-[500] block mb-1">
                  Email Address
                </label>
                <input
                  type="text"
                  name="email"
                  value={addNewContact.email}
                  onChange={handleAddContactChange}
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#675FFF]"
                />

                {error.email && (
                  <p className="text-red-500 text-sm mt-1">{error.email}</p>
                )}
              </div>
              <div>
                <label className="text-[14px] text-[#1E1E1E] font-[500] block mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={addNewContact.companyName}
                  onChange={handleAddContactChange}
                  placeholder="Enter company Name "
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#675FFF]"
                />

                {error.companyName && (
                  <p className="text-red-500 text-sm mt-1">{error.companyName}</p>
                )}
              </div>
            </div>
            {/*
            {responseError && (
              <div className="mt-4 text-red-500 text-sm">
                {responseError}
              </div>
            )} */}

            {/* Footer */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setAddContactModal(false)
                  setContactIsEdit("")
                  setAddNewContact({
                    firstName: '',
                    lastName: '',
                    // phoneCode: '',
                    phone: '',
                    email: '',
                    companyName: '',
                  });
                  setError({})
                }}
                className="w-full text-[16px] text-[#5A687C] bg-white border-[1.5px] border-[#E1E4EA] rounded-[8px] h-[38px]"
              >
                Cancel
              </button>
              <button
                className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF]  h-[38px] flex items-center justify-center gap-2 relative"
                disabled={loading}
                onClick={contactIsEdit ? () => handleUpdateContactSubmit() : () => handleNewContactSubmit()}
              >
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