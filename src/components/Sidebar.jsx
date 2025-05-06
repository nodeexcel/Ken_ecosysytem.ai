import React, { useState } from 'react';
import person from '../assets/images/person.svg'
import logo from '../assets/images/ecosystem_logo.svg'
import switchuser from '../assets/images/switch_user.svg'
import { GrAppsRounded } from 'react-icons/gr';
import { IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { TfiHeadphoneAlt } from 'react-icons/tfi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuBrain } from 'react-icons/lu';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen, toggleSidebar, sidebarItems }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const userDetails = useSelector((state) => state.profile.user)

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');

    const languages = {
        en: { label: 'English', flag: '/src/assets/images/english_flag.jpg' },
        fr: { label: 'French', flag: '/src/assets/images/french_flag.png' }
    };

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleLanguageSelect = (lang) => {
        setSelectedLang(lang);
        setShowDropdown(false);
    };


    const handleSelect = (path) => {
        setShowDropdown(false)
        navigate(path)
    }

    const renderColor = (index) => {
        if (location.pathname.includes(sidebarItems[index].id)) {
            return "#675FFF"
        }
        return "#5A687C"
    }

    return (
        <>
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 right-4 z-50 text-gray-600 hover:text-gray-800 bg-white p-2 rounded-full shadow-md"
            >
                {isOpen ? <IoClose size={24} /> : <RxHamburgerMenu size={24} />}
            </button>
            <aside className={`bg-[#F3F4F6] md:max-w-[58px] shadow-md fixed h-full transition-all duration-300 ${isOpen ? 'w-[100px]' : 'w-0 overflow-hidden'} md:w-[5%] flex flex-col justify-between`}>
                <div className='flex flex-col'>
                    <div className="flex justify-center py-4" onClick={() => navigate("/dashboard")}>
                        <img src={logo} alt='image' />
                    </div>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex justify-center py-4'>
                        <img src={userDetails?.image ?? person} alt='image' className='rounded-[40px]' height={30} width={30} />
                    </div>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[6].id)}>
                        <IoNotificationsOutline size={25} color={renderColor(6)} />
                    </div>
                    <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[1].id)}>
                        <LuBrain size={25} color={renderColor(1)} />
                    </div>
                    <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[0].id)}>
                        <GrAppsRounded size={25} color={renderColor(0)} />
                    </div>
                    <hr className='text-[#E1E4EA]' />
                </div>
                <div className='flex flex-col'>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[2].id)}>
                        <IoSettingsOutline size={25} color={renderColor(2)} />
                    </div>
                    <div
                        className='relative text-xl flex justify-center py-4 cursor-pointer'
                        onClick={toggleDropdown}
                    >
                        <img
                            src={languages[selectedLang].flag}
                            className='w-6 h-6 rounded-full'
                            alt={languages[selectedLang].label}
                        />
                        {showDropdown && (
                            <div
                                className='fixed md:left-[57px] left-[102px] top-[338px] bg-white shadow-md rounded p-2 z-[9999]'
                            >
                                {Object.entries(languages).map(([key, value]) => (
                                    <div
                                        key={key}
                                        onClick={() => handleLanguageSelect(key)}
                                        className='flex items-center gap-2 py-1 hover:bg-gray-100 px-2 rounded cursor-pointer'
                                    >
                                        <img
                                            src={value.flag}
                                            className='w-5 h-5 rounded-full'
                                            alt={value.label}
                                        />
                                        <span className='text-sm'>{value.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[3].id)}>
                        <HiOutlineDocumentText size={25} color={renderColor(3)} />
                    </div>
                    {/* <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[4].id)}>
                        <TfiHeadphoneAlt size={25} color={renderColor(4)} />
                    </div>
                    <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[5].id)}>
                        <img src={switchuser} alt='aiframe' color={renderColor(5)} />
                    </div> */}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;