import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getProfileData } from '../store/profileSlice';
import { getProfile } from '../api/profile';
import { loginSuccess } from '../store/authSlice';
import Navbar from '../components/Navbar';


function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const token = localStorage.getItem("token")
    const userDetails = useSelector((state) => state.profile)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

        if (token && userDetails.loading) {
            handleProfile()
            dispatch(loginSuccess({token:token}))
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

    const SidebarItems=[
        {id:"agents",label:"Agents"},
        {id:"brain",label:"Brain AI"},
        {id:"settings",label:"Settings"},
        {id:"documentation",label:"Documentation"},
        {id:"support",label:"Support"},
        {id:"community",label:"Community"},
        {id:"notification",label:"Notification"},
    ]

    const handleProfile = async () => {
        try {

            const response = await getProfile()
            if (response?.status === 200) {
                console.log(response?.data)
                if(!response?.data?.isProfileComplete){
                    navigate("settings")
                }
                dispatch(getProfileData(response?.data))
            }
        } catch (error) {
            console.log(error)
        }
    }


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (userDetails?.loading) return <p className='flex justify-center items-center h-full'><span className='loader' /></p>



    return (
        <div className='w-full flex h-full'>
            <div className={`md:w-[5%]  transition-all duration-300 ${isSidebarOpen ? 'w-[250px]' : 'w-[0%]'} md:w-[5%] md:relative fixed z-50`}>
                <Sidebar sidebarItems={SidebarItems} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            <div className='w-[95%]'>
                <Navbar sidebarItems={SidebarItems}/>
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
