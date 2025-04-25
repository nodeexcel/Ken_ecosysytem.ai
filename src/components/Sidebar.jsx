import React from 'react';
import person from '../assets/images/person.svg'
import aiFrame from '../assets/images/Frame.svg'
import switchuser from '../assets/images/switch_user.svg'
import { RiHome6Line } from 'react-icons/ri';
import { GrAppsRounded } from 'react-icons/gr';
import { IoSettingsOutline } from 'react-icons/io5';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { TfiHeadphoneAlt } from 'react-icons/tfi';

const Sidebar = () => {
    return (
        <aside className="bg-[#F3F4F6] shadow-md h-screen space-y-6 overflow-y-auto flex justify-between flex-col">
            <div className='gap-2 flex flex-col'>
                <div className="text-xl text-center py-4 font-bold">E</div>
                <hr className='text-[#E1E4EA]' />
                <div className='text-xl flex justify-center py-4'>
                    <img src={person} alt='image'/>
                </div>
                <hr className='text-[#E1E4EA]' />
                <div className='text-xl flex justify-center py-4'>
                    <RiHome6Line size={25} color='#5A687C' />
                </div>
                <div className='text-xl flex justify-center py-4'>
                    <GrAppsRounded size={25} color='#5A687C' />
                </div>
                <hr className='text-[#E1E4EA]' />
            </div>
            <div className='gap-2 flex flex-col'>
                <hr className='text-[#E1E4EA]' />
                <div className='text-xl flex justify-center py-4'>
                    <img src={aiFrame} alt='aiframe' />
                </div>
                <div className='text-xl flex justify-center py-4'>
                    <IoSettingsOutline size={25} color='#5A687C' />
                </div>
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