import React from 'react';
import person from '../assets/images/person.svg'
import aiFrame from '../assets/images/Frame.svg'
import switchuser from '../assets/images/switch_user.svg'
import { GrAppsRounded } from 'react-icons/gr';
import { IoSettingsOutline } from 'react-icons/io5';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { TfiHeadphoneAlt } from 'react-icons/tfi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuBrain } from 'react-icons/lu';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleSelect = (path) => {
        navigate(path)
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
                    <div className="flex justify-center py-4">
                        <div className="text-xl font-bold">E</div>
                    </div>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex justify-center py-4'>
                        <img src={person} alt='image' />
                    </div>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex justify-center py-4'>
                        <GrAppsRounded size={25} color='#5A687C' />
                    </div>
                    <div className='text-xl flex justify-center py-4'>
                        <LuBrain size={25} color='#5A687C'/>
                    </div>
                    <hr className='text-[#E1E4EA]' />
                </div>
                <div className='flex flex-col'>
                    <hr className='text-[#E1E4EA]' />
                    <div className='text-xl flex justify-center py-4' onClick={() => handleSelect("settings")}>
                        <IoSettingsOutline size={25} color={`${location.pathname.includes("settings") ? "#675FFF" : "#5A687C"}`} />
                    </div>
                    <div className='text-xl flex justify-center py-4 ' onClick={() => handleSelect("settings")}>
                        <img src="/src/assets/svg/flag.svg " className='rounded-full ' alt="" />
                    </div>
                    <div className='text-xl flex justify-center py-4'>
                        <HiOutlineDocumentText size={25} color='#5A687C' />
                    </div>
                    <div className='text-xl flex justify-center py-4'>
                        <TfiHeadphoneAlt size={25} color='#5A687C' />
                    </div>
                    <div className='text-xl flex justify-center py-4'>
                        <img src={switchuser} alt='aiframe' />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;