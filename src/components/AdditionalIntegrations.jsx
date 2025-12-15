import React, { useState } from "react";
import metaIntegartion from '../assets/svg/meta_integration.svg'
import { X, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { IoIosAdd, IoMdHelpCircleOutline } from "react-icons/io";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { TfiHelpAlt } from "react-icons/tfi";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useDispatch } from "react-redux";
import { getNavbarData } from "../store/navbarSlice";
import { LeftArrow } from "../icons/icons";
import Integration from "./Integration";
import { deleteGoogleCalendarAccount, deleteInstaAccount, deleteLinkedInAccount, deleteWhatsappAccount, deleteTikTokAccount } from "../api/brainai";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";



const AdditionalIntegration = ({ setInstagramData, instagramData, integartionData, setFirstRender, whatsappData, setWhatsappData, googleCalendarData, setGoogleCalendarData, linkedInData, setLinkedInData, tikTokData, setTikTokData }) => {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("insta");
    const [errorMessage, setErrorMessage] = useState("")
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const tabs = [
        { label: "Account" },
    ]


    const renderPath = (path) => {
        if (path === "terms") {
            window.open("https://www.ecosysteme.ai/terms", "_blank");
        } else {
            window.open("https://www.ecosysteme.ai/privacy", "_blank");
        }
    }

    const handleDeleteInsta = async (id) => {
        try {
            const response = await deleteInstaAccount(id);

            if (response?.status === 200) {
                setInstagramData((prev) => prev.filter((acc) => acc.instagram_user_id !== id));
            } else if (response?.status === 400) {
                const message = response?.response?.data?.success;
                if (message) setErrorMessage(message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteWhatsapp = async (id) => {
        try {
            const response = await deleteWhatsappAccount(id);
            if (response?.status === 200) {
                setWhatsappData((prev) => prev.filter((acc) => acc.whatsapp_phone_id !== id));
            } else if (response?.status === 400) {
                const message = response?.response?.data?.success;
                if (message) setErrorMessage(message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteGoogleCalendar = async (id) => {
        try {
            const response = await deleteGoogleCalendarAccount(id);
            if (response?.status === 200) {
                setGoogleCalendarData((prev) => prev.filter((acc) => acc.calendar_id !== id));
            } else if (response?.status === 400) {
                const message = response?.response?.data?.success;
                if (message) setErrorMessage(message);
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleDeleteLinkedIn = async (id) => {
        try {
            const response = await deleteLinkedInAccount(id);
            if (response?.status === 200) {
                setLinkedInData((prev) => prev.filter((acc) => acc.linkedin_id !== id));
            } else if (response?.status === 400) {
                const message = response?.response?.data?.success;
                if (message) setErrorMessage(message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTikTok = async (id) => {
        try {
            const response = await deleteTikTokAccount(id);

            if (response?.status === 200) {
                setTikTokData((prev) =>
                    prev.filter((acc) => acc.tiktok_id !== id)  // Correct key
                );
            } else if (response?.status === 400) {
                const message = response?.response?.data?.success;
                if (message) setErrorMessage(message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const RenderAccountData = ({ accountsData, label, id, specialCharacter, handleDelete }) => {
        return (
            <div>
                {accountsData?.length > 0 && accountsData.map((e, i) => (
                    <div key={i} className="w-full mb-2 p-4 flex items-center justify-between border border-[#e1e4ea] bg-white rounded-2xl">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#F6F7F9] flex items-center justify-center flex-shrink-0">
                                <img
                                    className="w-8 h-8"
                                    alt={integartionData.name}
                                    src={integartionData.icon}
                                />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <h1 className="text-[16px] font-[600] font-inter truncate">
                                    {specialCharacter}{e[label].length > 30 ? `${e[label].slice(0, 30)}...` : e[label]}
                                </h1>
                                <p className="text-[13px] text-[#5A687C] font-[500] font-inter truncate">
                                    {t("brain_ai.integrations.read_write")} {integartionData.name}.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            
                            <button
                                onClick={() => handleDelete(e[id])}
                                className="flex items-center cursor-pointer gap-1 px-3 py-1 font-[500] text-sm text-[#FF3B30] bg-white border border-[#FF3B30] rounded-lg hover:bg-[#FFF1EF]"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>{t("brain_ai.delete")}</span>
                            </button>
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
                        handleDelete={handleDeleteWhatsapp}
                    />
                )
            case "Instagram":
                return (
                    <RenderAccountData
                        accountsData={instagramData}
                        label={"username"}
                        id={"instagram_user_id"}
                        specialCharacter={"@"}
                        handleDelete={handleDeleteInsta}
                    />
                )
            case "Google Calendar":
                return (
                    <RenderAccountData
                        accountsData={googleCalendarData}
                        label={"calendar_id"}
                        id={"calendar_id"}
                        handleDelete={handleDeleteGoogleCalendar}
                    />
                )
            case "LinkedIn":
                return (
                    <RenderAccountData
                        accountsData={linkedInData}
                        label={"name"}
                        id={"linkedin_id"}
                        handleDelete={handleDeleteLinkedIn}
                    />
                )
            case "TikTok":
                return (
                    <RenderAccountData
                        accountsData={tikTokData}
                        label={"name"}
                        id={"tiktok_id"}
                        specialCharacter={"@"}
                        handleDelete={handleDeleteTikTok}
                    />
                );


        }
    }

    const handleNext = () => {
        setActiveTab("password")
    }

    const handleBack = () => {
        dispatch(getNavbarData("Brain AI"));
        setFirstRender(true)
        // Clear saved integration when going back to list
        localStorage.removeItem('selectedIntegration')
    }

    const renderNumberOfAccounts = () => {
        switch (integartionData.name) {
            case "Instagram":
                return instagramData?.length
            case "WhatsApp":
                return whatsappData?.length
            case "Google Calendar":
                return googleCalendarData?.length
            case "LinkedIn":
                return linkedInData?.length
            case "TikTok":
                return tikTokData?.length
            default:
                return integartionData.connectedAccounts
        }
    }

    return (
        <div className="w-full flex flex-col gap-5 p-10">
            <div className="flex flex-col w-full items-start gap-6 md:max-w-full lg:px-0 mx-auto">
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-semibold text-[#1e1e1e] text-2xl leading-8">
                            {integartionData.name}
                        </h1>
                        <p className="text-sm text-[#5A687C]">
                            {renderNumberOfAccounts()} Account Connected
                        </p>
                    </div>
                    <button onClick={() => setOpen(true)} className="flex cursor-pointer items-center gap-2.5 px-5 py-[7px] bg-[#675FFF] border-[1.5px] border-[#d6d6d6] rounded-lg text-white">
                        <div className="flex items-center gap-2">
                            <IoIosAdd color="" />
                            <span className="font-medium text-base leading-6">
                                {t("brain_ai.integrations.connect_account")}
                            </span>
                        </div>
                    </button>
                </div>

                {/* Warning Messages */}
                {integartionData.name === "WhatsApp" && (
                    <div className="flex items-center gap-2 text-[#5A687C] text-sm">
                        <AlertTriangle size={16} className="text-[#FF9500] flex-shrink-0" />
                        <span>Only possible with a WhatsApp business account. <span className="text-[#675FFF] cursor-pointer hover:underline">See tutorial.</span></span>
                    </div>
                )}
                {integartionData.name === "Instagram" && (
                    <div className="flex items-center gap-2 text-[#5A687C] text-sm">
                        <AlertTriangle size={16} className="text-[#FF9500] flex-shrink-0" />
                        <span>You can only connect professional and creator account. <span className="text-[#675FFF] cursor-pointer hover:underline">See tutorial.</span></span>
                    </div>
                )}

                <div className="w-full">
                    {renderMainContent()}
                </div>

                {open && <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
                    <div className="bg-white max-h-[600px] flex flex-col gap-4 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center bg-[#F6F7F9] border border-[#E1E4EA] rounded-full w-14 h-14">
                                <img
                                    className="w-8 h-8"
                                    alt={integartionData.name}
                                    src={activeTab === "insta" ? integartionData.icon : metaIntegartion}
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-[#1E1E1E] font-[600] text-[20px] mb-1">
                                {t("brain_ai.integrations.connect")} {integartionData.name}
                            </h2>
                            <p className="text-[16px] font-[400] text-[#5A687C]">
                                {activeTab === "insta" ? ` ${t("brain_ai.integrations.use_your")} ${integartionData.name} ${t("brain_ai.integrations.account_to_ecosystem")}` : `${t("brain_ai.integrations.use_meta_business")}`}
                            </p>
                        </div>

                        {/* Tab Content */}
                        <div className="mt-3">
                            {activeTab === "insta" && (
                                <>
                                    <div className="bg-[#F6F7F9] border border-[#E1E4EA] rounded-xl p-4 flex flex-col gap-3 px-2">
                                        <div className="flex items-center gap-2">
                                            <p className="text-[14px] font-medium text-[#292D32]">{t("brain_ai.integrations.few_steps_left")}</p>
                                            <IoMdHelpCircleOutline className="w-4 h-4 text-[#5A687C]" />
                                        </div>
                                        <p className="text-[16px] font-[400] text-[#5A687C]">
                                            {t("brain_ai.integrations.log_in_with")} {integartionData.name} {t("brain_ai.integrations.your_permissions")}
                                        </p>
                                        
                                    </div>
                                    <div className="flex flex-col gap-3 w-full mt-4">
                                        <a href={integartionData.path} target="_blank">
                                            <button
                                                className="w-full text-[16px] cursor-pointer text-white rounded-[8px] bg-[#5E54FF] h-[38px] font-medium"
                                            >
                                                {t("brain_ai.integrations.go_to")} {integartionData.name}
                                            </button>
                                        </a>

                                        <button
                                            onClick={() => setActiveTab("meta")}
                                            className="w-full cursor-pointer text-[16px] text-[#5E54FF] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px] font-medium"
                                        >
                                            {t("brain_ai.integrations.connect_with_meta")}
                                        </button>
                                    </div>
                                </>
                            )}
                            {activeTab === "meta" && (
                                <>
                                    <div className="bg-[#F6F7F9] border border-[#E1E4EA] rounded-xl p-4 flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <p className="text-[14px] font-medium text-[#292D32]">{t("brain_ai.integrations.continue_with_meta_business")}</p>
                                            <IoMdHelpCircleOutline className="w-4 h-4 text-[#5A687C]" />
                                        </div>
                                        <p className="text-[16px] font-[400] text-[#5A687C]">
                                            {t("brain_ai.integrations.go_to_facebook_to_link")}
                                        </p>
                                    </div>
                                    <div className="flex flex-row gap-3 w-full mt-4">
                                        <button
                                            onClick={() => setActiveTab("insta")}
                                            className="flex-1 flex cursor-pointer items-center justify-center gap-2 text-[16px] text-[#1E1E1E] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px] font-medium"
                                        >
                                            
                                            {t("brain_ai.integrations.back")}
                                        </button>
                                        <button
                                            className="flex-1 text-[16px] cursor-pointer text-white rounded-[8px] bg-[#5E54FF] h-[38px] font-medium"
                                        >
                                            {t("brain_ai.integrations.go_to_facebook")}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>}

                {errorMessage && <div className="inter fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center z-50">
                    <div className="bg-white max-h-[300px] flex flex-col gap-4 w-full max-w-md rounded-2xl shadow-xl p-6 relative">
                        <button
                            onClick={() => {
                                setErrorMessage('')
                            }}
                            className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800"
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