import React, { useEffect, useRef, useState } from 'react';
import person from '../assets/images/person.svg'
import switchuser from '../assets/images/switch_user.svg'
import { GrAppsRounded } from 'react-icons/gr';
import { IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { TfiHeadphoneAlt } from 'react-icons/tfi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuBrain } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import uk_flag from "../assets/images/uk_flag.png"
import fr_flag from "../assets/images/fr_flag.png"
import Notification from '../pages/Dashboard/Notification';
import { X } from 'lucide-react';
import { getNavbarData } from '../store/navbarSlice';
import { GiftIcon, SidebarBrainIcon, SidebarFourBoxIcon, SidebarHelpCenterIcon, SidebarNotificationIcon, SidebarSettingIcon, SkillsIcon } from '../icons/icons';
import logo from '../assets/svg/dashboard_logo.svg'
import { changeLanguage } from '../api/profile';
import i18n from '../i18n';
import lifeTimeImg from "../assets/svg/eco_systeme_lifetime_commission.svg"
import { useTranslation } from "react-i18next";

const Sidebar = ({ isOpen, toggleSidebar, sidebarItems }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const userDetails = useSelector((state) => state.profile.user)
    const lastPath = location.pathname.split('/').filter(Boolean).pop();
    const { t } = useTranslation();

    const paths = ['campaigns', 'phone', 'appointment-setter', "accounting", "hr", "coo", "seo", "content-creation", "customer-support"]

    const [isNotification, setIsNotification] = useState(false);

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');
    const [modalStatus, setModalStatus] = useState(false);
    const [commissionStatus, setCommissionStatus] = useState(false);
    const noticationRef = useRef()
    const languageRef = useRef()

    // const languages = {
    //     en: { label: 'English', flag: uk_flag,key:"" },
    //     fr: { label: 'French', flag: fr_flag }
    // };

    const languagesOptions = [{ label: "ENG", flag: uk_flag, key: "en" }, { label: "FR", flag: fr_flag, key: "fr" }]


    useEffect(() => {
        if (userDetails?.language !== null) {
            setSelectedLang(userDetails?.language)
        }
    }, [userDetails])

    const renderLangSrc = () => {
        const filterSrc = languagesOptions.filter((e) => e.key === selectedLang)
        return filterSrc[0].flag
    }

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleLanguageSelect = async (lang) => {
        try {
            const response = await changeLanguage({ language: lang })
            if (response?.status === 200) {
                i18n.changeLanguage(lang);
                localStorage.setItem("lan", lang)
                setSelectedLang(lang);
                setShowDropdown(false);
            }
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (noticationRef.current && !noticationRef.current.contains(event.target)) {
                setIsNotification(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (languageRef.current && !languageRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleSelect = (path, label) => {
        if (userDetails?.isProfileComplete === false && path !== "settings") {
            setModalStatus(true)
        } else {
            dispatch(getNavbarData(label))
            setShowDropdown(false)
            navigate(path)
        }
    }

    const handleNotification = () => {
        if (userDetails?.isProfileComplete === false) {
            setModalStatus(true)
        }
        else {
            setIsNotification(true)
        }
    }

    const handleHome = () => {
        if (userDetails?.isProfileComplete === false) {
            setModalStatus(true)
        }
        else {
            dispatch(getNavbarData("Home"))
            navigate("/dashboard")
        }
    }

    const renderColor = (index) => {
        if (isNotification && index === 6) {
            return true
        }
        else if ((lastPath === "dashboard" || paths.includes(lastPath)) && index === 0) {
            return true
        }
        else if (lastPath === sidebarItems[index].id) {
            return true
        }
        return false
    }

    const redirectHelpCenterDoc = () => {
        window.open("https://docs.ecosysteme.ai/fr/", "_blank");
    }

    return (
        <>
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 right-4 z-50 text-gray-600 hover:text-gray-800 bg-white p-2 rounded-full shadow-md"
            >
                {isOpen ? <IoClose size={24} /> : <RxHamburgerMenu size={24} />}
            </button>
            <aside className={`bg-[#FFFFFF] overflow-auto w-full border-r border-[#E1E4EA] h-full transition-all duration-300 ${isOpen ? 'w-[100px]' : 'w-0 overflow-auto'}  flex flex-col justify-between`}>
                <div className='flex flex-col'>
                    <div className="flex justify-center py-4" onClick={handleHome}>
                        <img src={logo} alt='image' />
                    </div>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex justify-center py-3'>
                        <img
                            src={userDetails?.image ?? person}
                            alt='image'
                            className='w-8 h-8 rounded-full'
                        />
                    </div>
                    <hr className='text-[#E1E4EA]' />
                    <div ref={noticationRef}>
                        <div className={`text-xl flex ${!isNotification && 'group'} hover:cursor-pointer justify-center relative py-3`} onClick={handleNotification}>
                            <div className="flex items-center gap-2"><div className='group-hover:hidden'><SidebarNotificationIcon status={renderColor(6)} /></div> <div className='hidden group-hover:block'><SidebarNotificationIcon status={true} /></div> </div>
                            <div className="flex-col mb-1 gap-1 transform -translate-x-1/2 text-[#5A687C] text-xs  py-1 px-2 hidden group-hover:flex transition-opacity duration-200 fixed md:left-[116px] left-[102px] bg-white shadow-md rounded p-2 z-[9999]">
                                <p className='font-[400]'>{t("sidebar.notification")}</p>
                            </div>
                        </div>
                        {isNotification && <Notification setNotification={setIsNotification} />}
                    </div>
                    <div className='text-xl flex group hover:cursor-pointer relative justify-center py-3' onClick={() => handleSelect(sidebarItems[0].id, sidebarItems[0].label)}>
                        <div className="flex items-center gap-2"><div className='group-hover:hidden'><SidebarFourBoxIcon status={renderColor(0)} /></div> <div className='hidden group-hover:block'><SidebarFourBoxIcon status={true} /></div> </div>
                        <div className={`flex-col mb-1 gap-1 transform -translate-x-1/2 text-[#5A687C] text-xs  py-1 px-2 hidden group-hover:flex transition-opacity duration-200 fixed ${i18n.language === "fr" ? 'md:left-[101px]' : 'md:left-[97px]'} left-[102px]  bg-white shadow-md rounded p-2 z-[9999]`}>
                            <p className='font-[400]'>{t("sidebar.home")}</p>
                        </div>
                    </div>
                    <div className='text-xl flex group hover:cursor-pointer relative justify-center py-3' onClick={() => handleSelect(sidebarItems[7].id, sidebarItems[7].label)}>
                        <div className="flex items-center gap-2"><div className='group-hover:hidden'><SkillsIcon status={renderColor(7)} /></div> <div className='hidden group-hover:block'><SkillsIcon status={true} /></div> </div>
                        <div className={`flex-col mb-1 gap-1 transform -translate-x-1/2 text-[#5A687C] text-xs  py-1 px-2 hidden group-hover:flex transition-opacity duration-200 fixed ${i18n.language === "fr" ? 'md:left-[120px]' : 'md:left-[95px]'} left-[102px] bg-white shadow-md rounded p-2 z-[9999]`}>
                            <p className='font-[400]'>{t("sidebar.skills")}</p>
                        </div>
                    </div>
                    <div className='text-xl flex group hover:cursor-pointer relative justify-center py-3' onClick={() => handleSelect(sidebarItems[1].id, sidebarItems[1].label)}>
                        <div className="flex items-center gap-2"><div className='group-hover:hidden'><SidebarBrainIcon status={renderColor(1)} /></div> <div className='hidden group-hover:block'><SidebarBrainIcon status={true} /></div> </div>
                        <div className="flex-col mb-1 gap-1 transform -translate-x-1/2 text-[#5A687C] text-xs  py-1 px-2 hidden group-hover:flex transition-opacity duration-200 fixed md:left-[102px] left-[102px] bg-white shadow-md rounded p-2 z-[9999]">
                            <p className='font-[400]'>{t("sidebar.brain_ai")}</p>
                        </div>
                    </div>
                    <hr className='text-[#E1E4EA]' />
                </div>
                <div className='flex flex-col'>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex group hover:cursor-pointer relative justify-center py-3' onClick={() => handleSelect(sidebarItems[2].id, sidebarItems[2].label)}>
                        <div className="flex items-center gap-2"><div className='group-hover:hidden'><SidebarSettingIcon status={renderColor(2)} /></div> <div className='hidden group-hover:block'><SidebarSettingIcon status={true} /></div> </div>
                        <div className={`flex-col mb-1 gap-1 transform -translate-x-1/2 text-[#5A687C] text-xs  py-1 px-2 hidden group-hover:flex transition-opacity duration-200 fixed ${i18n.language === "fr" ? 'md:left-[113px]' : 'md:left-[104px]'} left-[102px] bg-white shadow-md rounded p-2 z-[9999]`}>
                            <p className='font-[400]'>{t("sidebar.settings")}</p>
                        </div>
                    </div>
                    <div
                        ref={languageRef}
                        className={`relative ${!showDropdown && 'group'} text-xl flex justify-center py-3 cursor-pointer`}
                        onClick={toggleDropdown}
                    >
                        <img src={renderLangSrc()} alt={selectedLang} width={20} />
                        {showDropdown && (
                            <div
                                className='fixed md:left-[72px] left-[102px] bg-white shadow-md rounded p-2 z-[9999]'
                            >
                                {languagesOptions.map(e => (
                                    <div
                                        key={e.key}
                                        onClick={() => handleLanguageSelect(e.key)}
                                        className={`flex items-center gap-2 py-2 hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF] px-3 my-1 cursor-pointer ${e.key === selectedLang && 'bg-[#F4F5F6] rounded-lg text-[#675FFF]'}`}
                                    >
                                        <img src={e.flag} alt={e.key} width={20} />
                                        <span className='text-sm'>{e.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className={`flex-col mb-1 gap-1 transform -translate-x-1/2 text-[#5A687C] text-xs  py-1 px-2 hidden group-hover:flex transition-opacity duration-200 fixed ${i18n.language === "fr" ? 'md:left-[101px]' : 'md:left-[109px]'} left-[102px] bg-white shadow-md rounded p-2 z-[9999]`}>
                            <p className='font-[400]'>{t("sidebar.language")}</p>
                        </div>
                    </div>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex group hover:cursor-pointer relative justify-center py-3' onClick={redirectHelpCenterDoc}>
                        <div className="flex items-center gap-2"><div className='group-hover:hidden'><SidebarHelpCenterIcon status={renderColor(3)} /></div> <div className='hidden group-hover:block'><SidebarHelpCenterIcon status={true} /></div> </div>
                        <div className={`flex-col mb-1 gap-1 transform -translate-x-1/2 text-[#5A687C] text-xs  py-1 px-2 hidden group-hover:flex transition-opacity duration-200 fixed ${i18n.language === "fr" ? 'md:left-[118px]' : 'md:left-[113px]'} left-[102px] bg-white shadow-md rounded p-2 z-[9999]`}>
                            <p className='font-[400]'>{t("sidebar.help_center")}</p>
                        </div>
                    </div>
                    <div className='text-xl flex group hover:cursor-pointer relative justify-center py-3' onClick={() => setCommissionStatus(true)}>
                        <div className="flex items-center gap-2"><div className='group-hover:hidden'><GiftIcon status={renderColor(4)} /></div> <div className='hidden group-hover:block'><GiftIcon status={true} /></div> </div>
                        <div className={`flex-col mb-1 gap-1 transform -translate-x-1/2 text-[#5A687C] text-xs  py-1 px-2 hidden group-hover:flex transition-opacity duration-200 fixed ${i18n.language === "fr" ? 'md:left-[103px]' : 'md:left-[107px]'} left-[102px] bg-white shadow-md rounded p-2 z-[9999]`}>
                            <p className='font-[400]'>{t("sidebar.support")}</p>
                        </div>
                    </div>
                    {/* <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[5].id)}>
                        <img src={switchuser} alt='aiframe' color={renderColor(5)} />
                    </div> */}
                </div>
            </aside>


            {modalStatus && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl w-full max-w-[514px] p-6 relative shadow-lg">
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        onClick={() => {
                            setModalStatus(false)
                        }}
                    >
                        <X size={20} />
                    </button>

                    <div className='h-[120px] flex flex-col justify-around gap-2 items-center '>
                        <h2 className="text-[20px] font-[600] text-[#1E1E1E] mb-1">
                            {t("sidebar.please_complete_profile")}
                        </h2>
                        <button
                            className="bg-[#675FFF] text-white px-5 py-2 font-[500] test-[16px]  rounded-lg"
                            onClick={() => setModalStatus(false)}
                        >
                            {t("brain_ai.integrations.ok")}
                        </button>
                    </div>
                </div>
            </div>}

            {commissionStatus && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl w-full max-w-[510px] p-6 relative shadow-lg">
                    <button
                        className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
                        onClick={() => {
                            setCommissionStatus(false)
                        }}
                    >
                        <X size={20} />
                    </button>

                    <div className='flex flex-col gap-6 py-4'>
                        <div>
                            <img src={lifeTimeImg} alt='commission' className='object-fit' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h2 className="text-[20px] font-[600] text-[#1E1E1E]">
                                {t("sidebar.lifetime_commission")}
                            </h2>
                            <h3 className='text-[16px] font-[400] text-[#5A687C]'>Share <span className='text-[#675FFF]'>Ecosysteme.ai</span> with your friends and get lifetime commission.</h3>
                        </div>
                        <button
                            className="bg-[#675FFF] cursor-pointer w-full text-white px-5 py-2 font-[500] test-[16px]  rounded-lg"
                            onClick={() => setCommissionStatus(false)}
                        >
                            {t("sidebar.get_it_now")}
                        </button>
                    </div>
                </div>
            </div>}
        </>
    );
};

export default Sidebar;