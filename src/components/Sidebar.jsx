import React from 'react';
import person from '../assets/images/person.svg'
import aiFrame from '../assets/images/Frame.svg'
import switchuser from '../assets/images/switch_user.svg'
import { GrAppsRounded } from 'react-icons/gr';
import { IoSettingsOutline } from 'react-icons/io5';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { TfiHeadphoneAlt } from 'react-icons/tfi';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuBrain } from 'react-icons/lu';

const Sidebar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleSelect = (path) => {
        navigate(path)
    }

    return (
        <aside className="bg-[#F3F4F6] shadow-md fixed h-full w-[5%] flex flex-col justify-between">
            <div className='flex flex-col'>
                <div className="text-xl text-center py-4 font-bold">E</div>
                <hr className='text-[#E1E4EA]' />
                <div className='text-xl flex justify-center py-4'>
                    <img src={person} alt='image' />
                </div>
                <hr className='text-[#E1E4EA]' />
                <div className='text-xl flex justify-center py-4'>
                    <GrAppsRounded size={25} color='#5A687C' />
                </div>
                <div className='text-xl flex justify-center py-4'>
                    <LuBrain size={25} color='#5A687C's/>
                </div>
                <div className='text-xl flex justify-center py-4' onClick={() => handleSelect("settings")}>
                    <IoSettingsOutline size={25} color={`${location.pathname.includes("settings") ? "#675FFF" : "#5A687C"}`} />
                </div>
                <hr className='text-[#E1E4EA]' />
            </div>
            <div className='flex flex-col'>
                <hr className='text-[#E1E4EA]' />
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
    );
};

export default Sidebar;