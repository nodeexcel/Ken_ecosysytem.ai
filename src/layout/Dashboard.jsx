import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getProfileData } from '../store/profileSlice';
import { getProfile } from '../api/profile';

function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const token = localStorage.getItem("token")
    const userDetails = useSelector((state) => state.profile)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

        if (token && userDetails.loading) {
            handleProfile()
        }
        if (!token && userDetails.loading) {
            navigate("/")
        }

    }, [token, userDetails.loading])


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

    const handleProfile = async () => {
        try {

            const response = await getProfile(token)
            if (response?.status === 200) {
                console.log(response?.data)
                dispatch(getProfileData(response?.data))
            }

        } catch (error) {
            console.log(error)
        }
    }


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    return (
        <div className='w-full flex h-full'>
            <div className={`md:w-[5%] h-full transition-all duration-300 ${isSidebarOpen ? 'w-[250px]' : 'w-[0%]'} md:w-[5%] md:relative fixed z-50`}>
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            <div className='w-[95%] h-full'>
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
