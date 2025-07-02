import { useEffect, useState } from 'react'
import { Delete } from '../icons/icons';
import { DateFormat } from '../utils/TimeFormat';
import { X } from 'lucide-react';
import { getListedContacts, removeContactFromList } from '../api/brainai';
import { useTranslation } from "react-i18next";

function ViewContacts({ setSelectedData, selectedData }) {
    const [allContacts, setAllContacts] = useState([]);
    const [loading, setLoading] = useState(true)
    const { t } = useTranslation();
    const tableHeaders = [
        { name: `${t("brain_ai.full_name")}`, width: "flex-1" },
        { name: `${t("brain_ai.email")}`, width: "w-[290px]" },
        { name: `${t("brain_ai.phone_no")}`, width: "flex-1" },
        { name: `${t("brain_ai.date_created")}`, width: "flex-1" },
        { name: `${t("brain_ai.actions")}`, width: "w-[120px]" },
    ];
    const [formCreateList, setFormCreateList] = useState({ listName: '', contactsId: [] });

    const getViewContactsList = async () => {
        try {
            const response = await getListedContacts(selectedData?.id)
            if (response?.status === 200) {
                console.log(response?.data?.contacts)
                if (response?.data?.contacts?.length === 0) {
                    setLoading(false)
                }
                setAllContacts(response?.data?.contacts)
                setFormCreateList({ listName: '', contactsId: [] })
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getViewContactsList()
    }, [])

    useEffect(() => {
        if (allContacts?.length > 0) {
            setLoading(false)
        }
    }, [allContacts])


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
        return `${countryCode + number}`
    }

    const handleDeleteContact = async (contactListId) => {
        try {
            const payload = {
                listId: selectedData?.id,
                contactId: contactListId
            }
            const response = await removeContactFromList(payload);
            if (response?.status === 200) {
                getViewContactsList();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-[80vw] max-h-[80vh] overflow-auto  p-6 relative shadow-lg">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                        setSelectedData({})
                    }}
                >
                    <X size={20} />
                </button>

                <div className='flex flex-col gap-5 py-5'>
                    <h1 className='text-[#1E1E1E] font-[600] text-[16px]'>{selectedData?.listName} contacts</h1>
                    {formCreateList.contactsId?.length > 0 && <div className='flex gap-4 items-center'>
                        <p className='text-[#1E1E1E] font-[600] text-[16px]'>{formCreateList.contactsId?.length + ' Contact Selected'}</p>
                        <button onClick={() => handleDeleteContact(formCreateList.contactsId)} className="flex items-center text-[16px] font-[500] gap-2.5 px-5 py-[7px] border-[1.5px] border-[#FF2D55] rounded-[7px] text-[#FF2D55]">
                            {t("brain_ai.delete")}
                        </button>
                    </div>}
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
                                {loading ? <p className="flex justify-center items-center h-34"><span className="loader" /></p> :
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
                                                            <div onClick={() => handleDeleteContact([contact.id])}>
                                                                <Delete className="text-red-500" />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody> : <p className="flex justify-center items-center h-34 text-[#1E1E1E]">{t("brain_ai.no_contact_message")}</p>}
                            </div>
                        </table>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default ViewContacts
