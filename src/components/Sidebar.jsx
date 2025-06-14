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
import { useDispatch, useSelector } from 'react-redux';
import uk_flag from "../assets/images/uk_flag.png"
import fr_flag from "../assets/images/fr_flag.png"
import Notification from '../pages/Dashboard/Notification';
import { X } from 'lucide-react';
import { getNavbarData } from '../store/navbarSlice';

const Sidebar = ({ isOpen, toggleSidebar, sidebarItems }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const userDetails = useSelector((state) => state.profile.user)
    const lastPath = location.pathname.split('/').filter(Boolean).pop();

    const paths = ['campaigns', 'phone', 'appointment-setter']

    const [isNotification, setIsNotification] = useState(false);

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');
    const [modalStatus, setModalStatus] = useState(false);

    const languages = {
        en: { label: 'English', flag: uk_flag },
        fr: { label: 'French', flag: fr_flag }
    };

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleLanguageSelect = (lang) => {
        setSelectedLang(lang);
        setShowDropdown(false);
    };


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
            return "#675FFF"
        }
        else if ((lastPath === "dashboard" || paths.includes(lastPath)) && index === 0) {
            return '#675FFF'
        }
        else if (lastPath === sidebarItems[index].id) {
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
            <aside className={`bg-[#FFFFFF] md:w-[58px] border-r border-[#E1E4EA] h-full transition-all duration-300 ${isOpen ? 'w-[100px]' : 'w-0 overflow-hidden'}  flex flex-col justify-between`}>
                <div className='flex flex-col'>
                    <div className="flex justify-center py-4" onClick={handleHome}>
                        <img src={logo} alt='image' />
                    </div>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex justify-center py-4'>
                        <img
                            src={userDetails?.image ?? person}
                            alt='image'
                            className='w-8 h-8 rounded-full'
                        />
                    </div>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex justify-center py-4' onClick={handleNotification}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.0167 17.1086C8.07499 17.1086 6.13333 16.8003 4.29166 16.1836C3.59166 15.9419 3.05833 15.4503 2.82499 14.8086C2.58333 14.1669 2.66666 13.4586 3.04999 12.8253L4.00833 11.2336C4.20833 10.9003 4.39166 10.2336 4.39166 9.84193V7.43359C4.39166 4.33359 6.91666 1.80859 10.0167 1.80859C13.1167 1.80859 15.6417 4.33359 15.6417 7.43359V9.84193C15.6417 10.2253 15.825 10.9003 16.025 11.2419L16.975 12.8253C17.3333 13.4253 17.4 14.1503 17.1583 14.8086C16.9167 15.4669 16.3917 15.9669 15.7333 16.1836C13.9 16.8003 11.9583 17.1086 10.0167 17.1086ZM10.0167 3.05859C7.60833 3.05859 5.64166 5.01693 5.64166 7.43359V9.84193C5.64166 10.4503 5.39166 11.3503 5.08333 11.8753L4.12499 13.4669C3.94166 13.7753 3.89166 14.1003 3.99999 14.3753C4.09999 14.6586 4.34999 14.8753 4.69166 14.9919C8.17499 16.1586 11.8667 16.1586 15.35 14.9919C15.65 14.8919 15.8833 14.6669 15.9917 14.3669C16.1 14.0669 16.075 13.7419 15.9083 13.4669L14.95 11.8753C14.6333 11.3336 14.3917 10.4419 14.3917 9.83359V7.43359C14.3917 5.01693 12.4333 3.05859 10.0167 3.05859Z" fill={renderColor(6)} />
                            <path d="M11.5667 3.28242C11.5083 3.28242 11.45 3.27409 11.3917 3.25742C11.15 3.19076 10.9167 3.14076 10.6917 3.10742C9.98333 3.01576 9.29999 3.06576 8.65833 3.25742C8.42499 3.33242 8.17499 3.25742 8.01666 3.08242C7.85833 2.90742 7.80833 2.65742 7.89999 2.43242C8.24166 1.55742 9.07499 0.982422 10.025 0.982422C10.975 0.982422 11.8083 1.54909 12.15 2.43242C12.2333 2.65742 12.1917 2.90742 12.0333 3.08242C11.9083 3.21576 11.7333 3.28242 11.5667 3.28242Z" fill={renderColor(6)} />
                            <path d="M10.0167 19.0078C9.19169 19.0078 8.39169 18.6745 7.80835 18.0911C7.22502 17.5078 6.89169 16.7078 6.89169 15.8828H8.14169C8.14169 16.3745 8.34169 16.8578 8.69169 17.2078C9.04169 17.5578 9.52502 17.7578 10.0167 17.7578C11.05 17.7578 11.8917 16.9161 11.8917 15.8828H13.1417C13.1417 17.6078 11.7417 19.0078 10.0167 19.0078Z" fill={renderColor(6)} />
                        </svg>
                    </div>
                    <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[1].id, sidebarItems[1].label)}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.80299 16.843C3.40783 16.843 2.23123 15.7256 2.23123 14.352C2.23123 13.7519 2.44716 13.2014 2.80661 12.7718C1.55588 12.6229 0.586441 11.575 0.586441 10.3033C0.586441 8.96703 1.65686 7.87725 2.99947 7.81896C2.64784 7.3916 2.43683 6.84749 2.43683 6.25472C2.43683 4.88106 3.57161 3.76701 4.96676 3.76701C4.95237 3.65871 4.94516 3.54957 4.94518 3.44032C4.94518 2.06667 6.07616 0.953125 7.47128 0.953125C8.86639 0.953125 9.99741 2.06667 9.99741 3.44032H10.0003V16.4747C10.0003 17.895 8.83093 19.0465 7.38839 19.0465C6.0728 19.0464 4.98443 18.0888 4.80299 16.843Z" stroke={renderColor(1)} strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.82296 8.04943C5.91164 8.04943 6.79416 8.91839 6.79416 9.99026C6.79416 11.0622 5.91164 11.9311 4.82296 11.9311M4.96676 3.76693C5.12295 4.939 6.14133 5.84381 7.37431 5.84381M4.80298 16.8429C4.78525 16.721 4.77636 16.5979 4.7764 16.4747C4.7764 15.0544 5.94581 13.903 7.38835 13.903M9.99968 16.4747C9.99968 17.895 11.1691 19.0464 12.6116 19.0464C13.9272 19.0464 15.0156 18.0888 15.197 16.8429C16.5922 16.8429 17.7688 15.7256 17.7688 14.352C17.7688 13.7518 17.5528 13.2014 17.1934 12.7717C18.4441 12.6229 19.4135 11.575 19.4135 10.3033C19.4135 8.96703 18.3431 7.87725 17.0005 7.81896C17.3521 7.3916 17.5632 6.84749 17.5632 6.25471C17.5632 4.88106 16.4284 3.76701 15.0332 3.76701C15.0475 3.66008 15.0548 3.55104 15.0548 3.44032C15.0548 2.06667 13.9238 0.953125 12.5287 0.953125C11.1335 0.953125 10.0026 2.06667 10.0026 3.44032H9.99964" stroke={renderColor(1)} strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15.177 8.0491C14.0883 8.0491 13.2058 8.91806 13.2058 9.98993C13.2058 11.0618 14.0883 11.9308 15.177 11.9308M15.0333 3.7666C14.8771 4.93867 13.8587 5.84348 12.6257 5.84348M15.197 16.8426C15.2145 16.7223 15.2236 16.5994 15.2236 16.4744C15.2236 15.0541 14.0542 13.9027 12.6116 13.9027" stroke={renderColor(1)} strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[0].id, sidebarItems[0].label)}>
                        <svg width="44" height="32" viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.6667 9.33268C13.6667 8.41221 14.4129 7.66602 15.3333 7.66602H18.6667C19.5871 7.66602 20.3333 8.41221 20.3333 9.33268V12.666C20.3333 13.5865 19.5871 14.3327 18.6667 14.3327H15.3333C14.4129 14.3327 13.6667 13.5865 13.6667 12.666V9.33268Z" stroke={renderColor(0)} strokeWidth="1.25" strokeLinejoin="round" />
                            <path d="M23.6667 9.33268C23.6667 8.41221 24.4129 7.66602 25.3333 7.66602H28.6667C29.5871 7.66602 30.3333 8.41221 30.3333 9.33268V12.666C30.3333 13.5865 29.5871 14.3327 28.6667 14.3327H25.3333C24.4129 14.3327 23.6667 13.5865 23.6667 12.666V9.33268Z" stroke={renderColor(0)} strokeWidth="1.25" strokeLinejoin="round" />
                            <path d="M13.6667 19.3327C13.6667 18.4122 14.4129 17.666 15.3333 17.666H18.6667C19.5871 17.666 20.3333 18.4122 20.3333 19.3327V22.666C20.3333 23.5865 19.5871 24.3327 18.6667 24.3327H15.3333C14.4129 24.3327 13.6667 23.5865 13.6667 22.666V19.3327Z" stroke={renderColor(0)} strokeWidth="1.25" strokeLinejoin="round" />
                            <path d="M23.6667 19.3327C23.6667 18.4122 24.4129 17.666 25.3333 17.666H28.6667C29.5871 17.666 30.3333 18.4122 30.3333 19.3327V22.666C30.3333 23.5865 29.5871 24.3327 28.6667 24.3327H25.3333C24.4129 24.3327 23.6667 23.5865 23.6667 22.666V19.3327Z" stroke={renderColor(0)} strokeWidth="1.25" strokeLinejoin="round" />
                        </svg>

                    </div>
                    <hr className='text-[#E1E4EA]' />
                </div>
                <div className='flex flex-col'>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[2].id, sidebarItems[2].label)}>
                        <svg width="44" height="32" viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M29.2866 19.1005L28.7536 18.7741H28.7536L29.2866 19.1005ZM28.4911 20.3995L29.0241 20.7259V20.7259L28.4911 20.3995ZM14.7134 12.8995L14.1804 12.5731L14.1804 12.5731L14.7134 12.8995ZM15.5089 11.6005L16.0419 11.9269V11.9269L15.5089 11.6005ZM17.6821 11.0514L17.9809 10.5025L17.9809 10.5025L17.6821 11.0514ZM15.2957 14.9486L14.9969 15.4975H14.9969L15.2957 14.9486ZM26.3179 20.9486L26.0191 21.4975H26.0191L26.3179 20.9486ZM28.7043 17.0514L28.4055 17.6004L28.4055 17.6004L28.7043 17.0514ZM15.5089 20.3995L14.9759 20.7259H14.9759L15.5089 20.3995ZM14.7134 19.1005L15.2464 18.7741H15.2464L14.7134 19.1005ZM28.4911 11.6005L29.0241 11.2741V11.2741L28.4911 11.6005ZM29.2866 12.8995L28.7536 13.2259L28.7536 13.2259L29.2866 12.8995ZM28.7043 14.9486L29.0031 15.4975L29.0031 15.4975L28.7043 14.9486ZM26.3179 11.0514L26.6167 11.6004L26.3179 11.0514ZM15.2957 17.0514L15.5945 17.6004H15.5945L15.2957 17.0514ZM17.6821 20.9486L17.3833 20.3996L17.3833 20.3996L17.6821 20.9486ZM26.2333 11.0975L25.9345 10.5485V10.5485L26.2333 11.0975ZM17.7667 11.0975L17.4678 11.6464L17.4678 11.6464L17.7667 11.0975ZM26.2333 20.9025L26.5322 20.3536L26.5322 20.3536L26.2333 20.9025ZM17.7667 20.9025L18.0655 21.4515L18.0655 21.4515L17.7667 20.9025ZM21.2045 8.5V9.125H22.7955V8.5V7.875H21.2045V8.5ZM22.7955 23.5V22.875H21.2045V23.5V24.125H22.7955V23.5ZM21.2045 23.5V22.875C20.6359 22.875 20.2386 22.4491 20.2386 22H19.6136H18.9886C18.9886 23.2077 20.0159 24.125 21.2045 24.125V23.5ZM24.3864 22H23.7614C23.7614 22.4491 23.3641 22.875 22.7955 22.875V23.5V24.125C23.9841 24.125 25.0114 23.2077 25.0114 22H24.3864ZM22.7955 8.5V9.125C23.3641 9.125 23.7614 9.55089 23.7614 10H24.3864H25.0114C25.0114 8.79225 23.9841 7.875 22.7955 7.875V8.5ZM21.2045 8.5V7.875C20.0159 7.875 18.9886 8.79226 18.9886 10H19.6136H20.2386C20.2386 9.55089 20.6359 9.125 21.2045 9.125V8.5ZM29.2866 19.1005L28.7536 18.7741L27.9581 20.0731L28.4911 20.3995L29.0241 20.7259L29.8196 19.4269L29.2866 19.1005ZM14.7134 12.8995L15.2464 13.2259L16.0419 11.9269L15.5089 11.6005L14.9759 11.2741L14.1804 12.5731L14.7134 12.8995ZM15.5089 11.6005L16.0419 11.9269C16.2991 11.5068 16.9005 11.3375 17.3833 11.6004L17.6821 11.0514L17.9809 10.5025C16.9419 9.9369 15.5973 10.2592 14.9759 11.2741L15.5089 11.6005ZM15.2957 14.9486L15.5945 14.3996C15.1312 14.1474 15.0036 13.6225 15.2464 13.2259L14.7134 12.8995L14.1804 12.5731C13.5446 13.6114 13.9384 14.9213 14.9969 15.4975L15.2957 14.9486ZM28.4911 20.3995L27.9581 20.0731C27.7009 20.4932 27.0995 20.6624 26.6167 20.3996L26.3179 20.9486L26.0191 21.4975C27.0581 22.0631 28.4027 21.7408 29.0241 20.7259L28.4911 20.3995ZM29.2866 19.1005L29.8196 19.4269C30.4554 18.3886 30.0616 17.0787 29.0031 16.5025L28.7043 17.0514L28.4055 17.6004C28.8688 17.8526 28.9964 18.3775 28.7536 18.7741L29.2866 19.1005ZM15.5089 20.3995L16.0419 20.0731L15.2464 18.7741L14.7134 19.1005L14.1804 19.4269L14.9759 20.7259L15.5089 20.3995ZM28.4911 11.6005L27.9581 11.9269L28.7536 13.2259L29.2866 12.8995L29.8196 12.5731L29.0241 11.2741L28.4911 11.6005ZM29.2866 12.8995L28.7536 13.2259C28.9964 13.6225 28.8688 14.1474 28.4055 14.3996L28.7043 14.9486L29.0031 15.4975C30.0616 14.9213 30.4554 13.6114 29.8196 12.5731L29.2866 12.8995ZM26.3179 11.0514L26.6167 11.6004C27.0995 11.3376 27.7009 11.5068 27.9581 11.9269L28.4911 11.6005L29.0241 11.2741C28.4027 10.2592 27.0581 9.93691 26.0191 10.5025L26.3179 11.0514ZM14.7134 19.1005L15.2464 18.7741C15.0036 18.3775 15.1312 17.8526 15.5945 17.6004L15.2957 17.0514L14.9969 16.5025C13.9384 17.0787 13.5446 18.3886 14.1804 19.4269L14.7134 19.1005ZM15.5089 20.3995L14.9759 20.7259C15.5973 21.7408 16.9419 22.0631 17.9809 21.4975L17.6821 20.9486L17.3833 20.3996C16.9005 20.6625 16.2991 20.4932 16.0419 20.0731L15.5089 20.3995ZM26.2333 11.0975L26.5322 11.6464L26.6167 11.6004L26.3179 11.0514L26.0191 10.5025L25.9345 10.5485L26.2333 11.0975ZM17.6821 11.0514L17.3833 11.6004L17.4678 11.6464L17.7667 11.0975L18.0655 10.5485L17.9809 10.5025L17.6821 11.0514ZM26.3179 20.9486L26.6167 20.3996L26.5322 20.3536L26.2333 20.9025L25.9345 21.4515L26.0191 21.4975L26.3179 20.9486ZM17.7667 20.9025L17.4679 20.3536L17.3833 20.3996L17.6821 20.9486L17.9809 21.4975L18.0655 21.4515L17.7667 20.9025ZM15.2957 14.9486L14.9969 15.4975C15.395 15.7142 15.395 16.2858 14.9969 16.5025L15.2957 17.0514L15.5945 17.6004C16.8625 16.9102 16.8625 15.0898 15.5945 14.3996L15.2957 14.9486ZM17.7667 20.9025L18.0655 21.4515C18.4817 21.2249 18.9886 21.5262 18.9886 22H19.6136H20.2386C20.2386 20.5778 18.717 19.6736 17.4678 20.3536L17.7667 20.9025ZM24.3864 22H25.0114C25.0114 21.5262 25.5184 21.2249 25.9345 21.4515L26.2333 20.9025L26.5322 20.3536C25.283 19.6736 23.7614 20.5778 23.7614 22H24.3864ZM28.7043 17.0514L29.0031 16.5025C28.605 16.2858 28.605 15.7142 29.0031 15.4975L28.7043 14.9486L28.4055 14.3996C27.1375 15.0898 27.1375 16.9102 28.4055 17.6004L28.7043 17.0514ZM17.7667 11.0975L17.4678 11.6464C18.717 12.3264 20.2386 11.4222 20.2386 10H19.6136H18.9886C18.9886 10.4738 18.4817 10.7751 18.0655 10.5485L17.7667 11.0975ZM26.2333 11.0975L25.9345 10.5485C25.5184 10.7751 25.0114 10.4738 25.0114 10H24.3864H23.7614C23.7614 11.4222 25.283 12.3264 26.5322 11.6464L26.2333 11.0975ZM24.5 16H23.875C23.875 17.0355 23.0355 17.875 22 17.875V18.5V19.125C23.7259 19.125 25.125 17.7259 25.125 16H24.5ZM22 18.5V17.875C20.9645 17.875 20.125 17.0355 20.125 16H19.5H18.875C18.875 17.7259 20.2741 19.125 22 19.125V18.5ZM19.5 16H20.125C20.125 14.9645 20.9645 14.125 22 14.125V13.5V12.875C20.2741 12.875 18.875 14.2741 18.875 16H19.5ZM22 13.5V14.125C23.0355 14.125 23.875 14.9645 23.875 16H24.5H25.125C25.125 14.2741 23.7259 12.875 22 12.875V13.5Z" fill={renderColor(2)} />
                        </svg>

                    </div>
                    <div
                        className='relative text-xl flex justify-center py-4 cursor-pointer'
                        onClick={toggleDropdown}
                    >
                        <img src={languages[selectedLang].flag} alt={languages[selectedLang].label} width={20} />
                        {showDropdown && (
                            <div
                                className='fixed md:left-[59px] left-[102px] bg-white shadow-md rounded p-2 z-[9999]'
                            >
                                {Object.entries(languages).map(([key, value]) => (
                                    <div
                                        key={key}
                                        onClick={() => handleLanguageSelect(key)}
                                        className={`flex items-center gap-2 py-2 hover:bg-[#F4F5F6] hover:rounded-lg hover:text-[#675FFF] px-3 my-1 cursor-pointer ${value.flag === languages[selectedLang].flag && 'bg-[#F4F5F6] rounded-lg text-[#675FFF]'}`}
                                    >
                                        <img src={value.flag} alt={value.label} width={20} />
                                        <span className='text-sm'>{value.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[3].id, sidebarItems[3].label)}>
                        <svg width="44" height="32" viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.3333 10.9998C15.3333 9.15889 16.8257 7.6665 18.6667 7.6665H24.786C25.67 7.6665 26.5179 8.01769 27.143 8.64281L29.357 10.8569C29.9821 11.482 30.3333 12.3298 30.3333 13.2139V20.9998C30.3333 22.8408 28.8409 24.3332 27 24.3332H18.6667C16.8257 24.3332 15.3333 22.8408 15.3333 20.9998V10.9998Z" stroke={renderColor(3)} strokeWidth="1.25" strokeLinejoin="round" />
                            <path d="M19.5 11.8335L26.1667 11.8335" stroke={renderColor(3)} strokeWidth="1.25" strokeLinecap="round" />
                            <path d="M19.5 16H26.1667" stroke={renderColor(3)} strokeWidth="1.25" strokeLinecap="round" />
                            <path d="M19.5 20.1665H22.8333" stroke={renderColor(3)} strokeWidth="1.25" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[4].id, sidebarItems[4].label)}>
                        <svg width="44" height="32" viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M26.1667 15.8372C26.1667 15.5492 26.1667 15.4052 26.21 15.2768C26.336 14.9038 26.6682 14.7592 27.0009 14.6076C27.375 14.4372 27.562 14.352 27.7473 14.337C27.9578 14.32 28.1685 14.3653 28.3483 14.4662C28.5868 14.6 28.753 14.8542 28.9233 15.061C29.7094 16.0158 30.1024 16.4933 30.2463 17.0198C30.3623 17.4447 30.3623 17.889 30.2463 18.3138C30.0365 19.0817 29.3738 19.7255 28.8832 20.3213C28.6323 20.6261 28.5068 20.7785 28.3483 20.8674C28.1685 20.9683 27.9578 21.0137 27.7473 20.9967C27.562 20.9817 27.375 20.8965 27.0009 20.7261C26.6682 20.5745 26.336 20.4298 26.21 20.0568C26.1667 19.9285 26.1667 19.7845 26.1667 19.4964V15.8372Z" stroke={renderColor(4)} strokeWidth="1.25" />
                            <path d="M17.8333 15.8373C17.8333 15.4746 17.8232 15.1486 17.5299 14.8936C17.4233 14.8009 17.2819 14.7365 16.9991 14.6076C16.625 14.4373 16.438 14.3521 16.2526 14.3371C15.6966 14.2921 15.3974 14.6716 15.0768 15.0611C14.2906 16.016 13.8976 16.4934 13.7537 17.0199C13.6377 17.4448 13.6377 17.8891 13.7537 18.314C13.9635 19.0819 14.6263 19.7256 15.1168 20.3215C15.4261 20.6971 15.7215 21.0397 16.2526 20.9968C16.438 20.9818 16.625 20.8966 16.9991 20.7262C17.2819 20.5974 17.4233 20.533 17.5299 20.4402C17.8232 20.1852 17.8333 19.8593 17.8333 19.4966V15.8373Z" stroke={renderColor(4)} strokeWidth="1.25" />
                            <path d="M28.6667 14.7498V13.4998C28.6667 10.2782 25.6819 7.6665 22 7.6665C18.3181 7.6665 15.3333 10.2782 15.3333 13.4998V14.7498" stroke={renderColor(4)} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M28.6667 20.5835C28.6667 24.3335 25.3333 24.3335 22 24.3335" stroke={renderColor(4)} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                    </div>
                    {/* <div className='text-xl flex justify-center py-4' onClick={() => handleSelect(sidebarItems[5].id)}>
                        <img src={switchuser} alt='aiframe' color={renderColor(5)} />
                    </div> */}
                </div>
            </aside>

            {isNotification && <Notification setNotification={setIsNotification} />}
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
                            Please complete your profile first
                        </h2>
                        <button
                            className="bg-[#675FFF] text-white px-5 py-2 font-[500] test-[16px]  rounded-lg"
                            onClick={() => setModalStatus(false)}
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </div>}
        </>
    );
};

export default Sidebar;