import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

function Dashboard({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function to reset overflow when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSidebarOpen]);

    return (
        <div className='w-full flex h-full'>
            <div className={`md:w-[5%] h-full transition-all duration-300 ${isSidebarOpen ? 'w-[250px]' : 'w-[0%]'} md:w-[5%] md:relative fixed z-50`}>
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            <div className='w-[95%] h-full'>
                <Outlet/>
            </div>
        </div>
    )
}

export default Dashboard
