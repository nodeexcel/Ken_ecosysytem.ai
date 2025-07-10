import React, { useState } from "react";
import messageIcon from '../assets/svg/message_temp.svg'
import metaIntegartion from '../assets/svg/meta_integration.svg'
import { X } from "lucide-react";
import { IoIosAdd, IoMdHelpCircleOutline } from "react-icons/io";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { TfiHelpAlt } from "react-icons/tfi";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useDispatch } from "react-redux";
import { getNavbarData } from "../store/navbarSlice";
import { LeftArrow } from "../icons/icons";
import Integration from "./Integration";
import { deleteGoogleCalendarAccount, deleteInstaAccount, deleteWhatsappAccount } from "../api/brainai";
import { useTranslation } from "react-i18next";



const AdditionalIntegration = ({ setInstagramData, instagramData, integartionData, setFirstRender, whatsappData, setWhatsappData, googleCalendarData, setGoogleCalendarData }) => {
    const [open, setOpen] = useState(false);
    const [createTemplateOpen, setCreateTemplateOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("insta");
    const [errorMessage, setErrorMessage] = useState("")
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const tabs = [
        { label: "Account" },
    ]
    
    const staticData = [
        { label: `${t("brain_ai.integrations.orsay_sample")}`, status: "Approved", description: `${t("brain_ai.integrations.orsay_description")}` },
        { label: `${t("brain_ai.integrations.orsay_sample")}`, status: "Approved", description: `${t("brain_ai.integrations.orsay_description")}` },
        { label: `${t("brain_ai.integrations.orsay_sample")}`, status: "Approved", description: `${t("brain_ai.integrations.orsay_description")}` }
    ]


    const handleDeleteInsta = async (id) => {
        try {
            const response = await deleteInstaAccount(id)
            if (response?.status === 200) {
                const filterData = instagramData.filter((e) => e.instagram_user_id !== id)
                setInstagramData(filterData)
            } else if (response?.status === 400) {
                if (response?.response?.data?.success) {
                    setErrorMessage(response?.response?.data?.success)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteWhatsapp = async (id) => {
        try {
            const response = await deleteWhatsappAccount(id)
            if (response?.status === 200) {
                const filterData = whatsappData.filter((e) => e.whatsapp_phone_id !== id)
                setWhatsappData(filterData)
            } else if (response?.status === 400) {
                if (response?.response?.data?.success) {
                    setErrorMessage(response?.response?.data?.success)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleDeleteGoogleCalendar = async (id) => {
        try {
            const response = await deleteGoogleCalendarAccount(id)
            if (response?.status === 200) {
                const filterData = googleCalendarData.filter((e) => e.google_calendar_id !== id)
                setGoogleCalendarData(filterData)
            } else if (response?.status === 400) {
                if (response?.response?.data?.success) {
                    setErrorMessage(response?.response?.data?.success)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    const renderMainContent2 = () => {
        switch (integartionData.name) {
            case "WhatsApp":
                return (
                    <>
                        {staticData.map((e) => (
                            <div key={e.label} className="w-full my-1 gap-3 p-3 flex justify-between border border-solid border-[#e1e4ea] bg-white rounded-lg">
                                <div className="flex gap-2">
                                    <div>
                                        <img
                                            className="w-12 h-12"
                                            alt="messageIcon"
                                            src={messageIcon}
                                        />
                                    </div>
                                    <div className="pt-1">
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-[14px] font-[600] font-inter">{e.label}</h1>
                                            <p className="text-[#067647] font-[500] bg-[#ECFDF3] rounded-2xl px-2 border text-[14px] border-[#067647]">{e.status}</p>
                                        </div>
                                        <p className="text-[12px] text-[#5A687C] font-[400] font-inter">{e.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )
        }
    }

    const RenderAccountData = ({ accountsData, label, id, specialCharacter }) => {
        return (
            <div>
                {accountsData?.length > 0 && accountsData.map((e, i) => (
                    <div key={i} className="w-full gap-3 mb-2 p-3 flex justify-between border border-solid border-[#e1e4ea] bg-white rounded-lg">
                        <div className="flex flex-col gap-2 pl-2">
                            <div className="flex items-center gap-2">
                                <div>
                                    <img
                                        className="w-5 h-5"
                                        alt={integartionData.name}
                                        src={integartionData.icon}
                                    />
                                </div>
                                <h1 className="text-[16px] font-[500] font-inter">{specialCharacter}{e[label].length > 30
                                    ? `${e[label].slice(0, 30)}...`
                                    : e[label]}</h1>
                            </div>
                            <li className="text-[12px] pl-1 text-[#5A687C] font-[500] font-inter">{t("brain_ai.integrations.read_write")} {integartionData.name}.</li>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => handleDeleteWhatsapp(e[id])} className="text-[#FF3B30] border-[1.5px] border-[#FF3B30] rounded-lg px-[20px] py-[7px] text-[16px] font-[500]" >{t("brain_ai.delete")}</button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }


    const renderMainContent = () => {
        switch (integartionData.name) {
            case "WhatsApp":
                return (
                    <RenderAccountData
                        accountsData={whatsappData}
                        label={"username"}
                        id={"whatsapp_phone_id"}
                        specialCharacter={"+"}
                    />
                )
            case "Instagram":
                return (
                    <RenderAccountData
                        accountsData={instagramData}
                        label={"username"}
                        id={"instagram_user_id"}
                        specialCharacter={"@"}
                    />
                )
            case "Google Calendar":
                return (
                    <RenderAccountData
                        accountsData={googleCalendarData}
                        label={"calendar_id"}
                        id={"calendar_id"}
                    />
                )
        }
    }

    const handleNext = () => {
        setActiveTab("password")
    }

    const handleBack = () => {
        dispatch(getNavbarData("Brain AI"));
        setFirstRender(true)
    }

    const renderNumberOfAccounts = () => {
        switch (integartionData.name) {
            case "Instagram":
                return instagramData?.length
            case "WhatsApp":
                return whatsappData?.length
            case "Google Calendar":
                return googleCalendarData?.length
            default:
                return integartionData.connectedAccounts
        }
    }

    return (
        <div className="w-full flex flex-col gap-5">
            <div className=''>
                <div className='flex justify-between px-2 items-center'>
                    <div className="flex gap-4 items-center h-[45px] pb-2 pl-5 cursor-pointer" onClick={handleBack}>
                        <LeftArrow />
                        <h1 className="text-[20px] font-[600]">{t("brain_ai.integrations.integrations")}</h1>
                    </div>
                </div>
                <hr className='text-[#E1E4EA]' />
            </div>
            <div className="flex flex-col w-full items-start gap-6 md:max-w-[763px] lg:px-0 px-10 mx-auto">
                <div className="flex items-center justify-between w-full">
                    <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">
                        {integartionData.name}
                    </h1>
                    <button onClick={() => setOpen(true)} className="flex items-center gap-2.5 px-5 py-[7px] bg-[#675FFF] border-[1.5px] border-[#5f58e8] rounded-lg text-white">
                        <div className="flex items-center gap-2">
                            <IoIosAdd color="" />
                            <span className="font-medium text-base leading-6">
                            {t("brain_ai.integrations.connect_account")}
                            </span>
                        </div>
                    </button>
                </div>

                <div className="flex items-start relative self-stretch w-full flex-[0_0_auto] border-b border-[#e1e4ea]">
                    {tabs.map((e, i) => <button
                        key={i}
                        className={`inline-flex items-center justify-center gap-1 p-2.5 relative flex-[0_0_auto] border-b-2 ${integartionData.connectedAccounts > 0
                            ? "border-[black] text-black"
                            : "border-[#e1e4ea] text-text-grey"
                            } rounded-none`}
                    >
                        <span className={`font-medium text-sm tracking-[0] leading-6 whitespace-nowrap ${integartionData.connectedAccounts > 0 ? "text-[black]"
                            : "text-[#5A687C] "}`}>
                            {renderNumberOfAccounts()} {e.label}
                        </span>
                    </button>)}
                </div>

                <div className="w-full">
                    {renderMainContent()}
                </div>
                {/* {open && <div className="onest fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
                <div className="bg-white max-h-[600px] flex flex-col gap-2 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex bg-[#F6F7F9] border border-[#E1E4EA] rounded-xl p-[10px] w-fit">
                        <img
                            className="w-5 h-5"
                            alt={integartionData.name}
                            src={integartionData.icon}
                        />
                    </div>
                    <h2 className="text-[#1E1E1E] font-[600] text-[20px] mb-1">
                        Connect {integartionData.name}
                    </h2>
                    <p className="text-[16px] font-[400] text-[#5A687C]">
                        Use your {integartionData.name} account to connect to Ecosystem.ai
                    </p>

                    <div className="mt-3">
                        {activeTab === "securitykey" && (
                            <div>
                                <label className="block text-[14px] font-medium text-[#292D32] mb-1">Provide your secret key</label>
                                <label>Secret Key:<span>How to get your secret key</span></label>
                                <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="......"
                                        className="w-full focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}
                        {activeTab === "password" && (
                            <div>
                                <label className="block text-[14px] font-medium text-[#292D32] mb-1">Provide the password for @Username</label>
                                <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="@password"
                                        className="w-full focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}
                        {activeTab === "username" && (
                            <div>
                                <label className="block text-[14px] font-medium text-[#292D32] mb-1">Provide your Instagram username</label>
                                <div className="flex items-center border border-gray-300 rounded-[8px] px-4 py-3">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="@ Username"
                                        className="w-full focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}
                        {activeTab === "insta" && (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2" > <p className="text-[14px] font-medium text-[#292D32]">A few steps left
                                </p>
                                    <IoMdHelpCircleOutline /></div>
                                <p className="text-[16px] font-[400] text-[#5A687C]">
                                    Log in with Instagram and set your permissions. Once that’s done, you're all set to connect to Ecosystem.ai
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-5 w-full mt-4">
                        <button
                            onClick={handleNext}
                            className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]"
                        >
                            Go To Instagram
                        </button>
                        <button
                            onClick={() => setOpen(false)}
                            className="w-full text-[16px] text-[#5E54FF] mt-3 bg-white"
                        >
                            Connect with Meta Business Suite instead
                        </button>
                    </div>
                </div>
            </div>} */}
                {open && <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
                    <div className="bg-white max-h-[600px] flex flex-col gap-2 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex bg-[#F6F7F9] border border-[#E1E4EA] rounded-xl p-[10px] w-fit">
                            <img
                                className="w-5 h-5"
                                alt={integartionData.name}
                                src={activeTab === "insta" ? integartionData.icon : metaIntegartion}
                            />
                        </div>
                        <h2 className="text-[#1E1E1E] font-[600] text-[20px] mb-1">
                            {t("brain_ai.integrations.connect")} {integartionData.name}
                        </h2>
                        <p className="text-[16px] font-[400] text-[#5A687C]">
                            {activeTab === "insta" ? ` ${t("brain_ai.integrations.use_your")} ${integartionData.name} ${t("brain_ai.integrations.account_to_ecosystem")}` : `${t("brain_ai.integrations.use_meta_business")}`}
                        </p>

                        {/* Tab Content */}
                        <div className="mt-3">
                            {activeTab === "insta" && (
                                <>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2" > <p className="text-[14px] font-medium text-[#292D32]">{t("brain_ai.integrations.few_steps_left")}
                                        </p>
                                            <IoMdHelpCircleOutline /></div>
                                        <p className="text-[16px] font-[400] text-[#5A687C]">
                                        {t("brain_ai.integrations.log_in_with")} {integartionData.name} {t("brain_ai.integrations.your_permissions")}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-5 w-full mt-4">
                                        <a href={integartionData.path} target="_blank">
                                            <button
                                                // onClick={handleNext}
                                                className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]"


                                            >
                                                {t("brain_ai.integrations.go_to")} {integartionData.name}

                                            </button>
                                        </a>

                                        <button
                                            onClick={() => setActiveTab("meta")}
                                            className="w-full text-[16px] text-[#5E54FF] mt-3 bg-white"
                                        >
                                            {t("brain_ai.integrations.connect_with_meta")}
                                        </button>
                                    </div>
                                </>
                            )}
                            {activeTab === "meta" && (
                                <>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2" > <p className="text-[14px] font-medium text-[#292D32]">{t("brain_ai.integrations.continue_with_meta_business")}
                                        </p>
                                            <IoMdHelpCircleOutline /></div>
                                        <p className="text-[16px] font-[400] text-[#5A687C]">
                                        {t("brain_ai.integrations.go_to_facebook_to_link")}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-5 w-full mt-4">
                                        <button
                                            // onClick={handleNext}
                                            className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]"
                                        >
                                            {t("brain_ai.integrations.go_to_facebook")}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("insta")}
                                            className="w-full flex items-center justify-center gap-3 text-[16px] text-[#1E1E1E] mt-3 bg-white"
                                        >
                                            <FaArrowLeft />
                                            {t("brain_ai.integrations.back")}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>}
                {integartionData.name === "WhatsApp" && <div className="flex items-center justify-between w-full">
                    <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">
                    {t("brain_ai.integrations.message_temple")}
                    </h1>
                    <button onClick={() => setCreateTemplateOpen(true)} className="flex items-center gap-2.5 px-5 py-[7px] border-[#675FFF] border-[1.5px] rounded-lg bg-white text-white">
                        <div className="flex items-center gap-2">
                            <IoIosAdd color="#675FFF" />
                            <span className="font-medium text-[#675FFF] text-base leading-6">
                            {t("brain_ai.integrations.create_temple")}
                            </span>
                        </div>
                    </button>
                </div>}
                <div className="w-full">
                    {renderMainContent2()}
                </div>
                {createTemplateOpen && <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
                    <div className="bg-white max-h-[600px] flex flex-col gap-2 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
                        <button
                            onClick={() => setCreateTemplateOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-[#1E1E1E] font-[600] text-[20px] mb-1">
                        {t("brain_ai.integrations.create_new_message_template")}
                        </h2>
                        <p className="text-[16px] font-[400] text-[#5A687C]">
                        {t("brain_ai.integrations.add_custom_message")}
                        </p>

                        {/* Tab Content */}
                        <div className="mt-3 flex flex-col gap-2">
                            <div>
                                <label className="text-[14px] flex items-center gap-2 font-medium text-[#292D32] mb-1">{t("brain_ai.integrations.heading")} <TfiHelpAlt />
                                </label>
                                <div className="flex items-center border border-[#E1E4EA] focus-within:border-[#675FFF] rounded-[8px] px-4 py-3">
                                    <input
                                        type="text"
                                        name="heading"
                                        placeholder={t("brain_ai.integrations.heading_placeholder")}
                                        className="w-full focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[14px] font-medium text-[#292D32] mb-1">{t("brain_ai.integrations.message")}</label>
                                <div className="flex items-center border border-[#E1E4EA] focus-within:border-[#675FFF] rounded-[8px] px-4 py-3">
                                    <textarea
                                        rows={4}
                                        type="text"
                                        name="message"
                                        placeholder={t("brain_ai.integrations.message_placeholder")}
                                        className="w-full focus:outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setCreateTemplateOpen(false)}
                                className="w-full text-[16px] text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
                            >
                                {t("brain_ai.cancel")}
                            </button>
                            <button
                                className="w-full text-[16px] text-white rounded-[8px] bg-[#5E54FF] h-[38px]"
                            >
                                {t("brain_ai.save")}
                            </button>
                        </div>
                    </div>
                </div>}

                {errorMessage && <div className="inter fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
                    <div className="bg-white max-h-[300px] flex flex-col gap-4 w-full max-w-md rounded-2xl shadow-xl p-6 relative">
                        <button
                            onClick={() => {
                                setErrorMessage('')
                            }}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-6 mt-6">
                            <h2 className="text-[20px] font-[600] text-center text-[#292D32]">{errorMessage}</h2>
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    onClick={() => setErrorMessage('')}
                                    className={`w-fit bg-[#675FFF] cursor-pointer text-white py-[7px] px-[20px] rounded-[8px] font-semibold  transition`}
                                >
                                    {t("brain_ai.integrations.ok")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}

            </div>
        </div>
    );
};

export default AdditionalIntegration;