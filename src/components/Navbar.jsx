import React from 'react'
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { logoutState } from '../store/authSlice';
import { discardData } from '../store/profileSlice';
import { getNavbarData } from '../store/navbarSlice';
import { logout } from '../api/auth';

function Navbar({ sidebarItems }) {
    const location = useLocation()
    const lastPath = location.pathname.split('/').filter(Boolean).pop();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const navbarDetails = useSelector((state) => state.navbar)

    const handleLogout = async () => {
        const response = await logout()
        if (response?.data?.success) {
            navigate("/")
        }
        localStorage.clear()
        dispatch(logoutState())
        dispatch(discardData())

    }

    const renderLabel = () => {
        const filter = sidebarItems.filter((e) => e.id === lastPath)
        if (lastPath === "appointment-setter") {
            dispatch(getNavbarData("Seth, Appointment Setter"))
            return "Seth, Appointment Setter"
        } else if (lastPath === "phone") {
            dispatch(getNavbarData("Tom & Rebecca, Phone"))
            return "Tom & Rebecca, Phone"
        }
        else if (lastPath === "campaigns") {
            dispatch(getNavbarData("Emile, Emailing"))
            return "Emile, Emailing"
        }
        return filter?.[0]?.label
    }

    return (
        <div className=''>
            <div className='flex justify-between items-center px-4 pt-2 pb-[0.4rem]' onClick={() => navigate("/dashboard")}>
                {/* <MdOutlineKeyboardArrowLeft size={25} /> */}
                <h1 className="text-[26px] font-[600] pb-1">{navbarDetails.label ?? renderLabel() ?? 'Home'}</h1>
                <div>
                    <button className='bg-[#675FFF] p-2 rounded-lg text-white cursor-pointer' onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <hr className='text-[#E1E4EA]' />
        </div>
    )
}

export default Navbar
