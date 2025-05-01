import React from 'react'
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'

function Navbar({ sidebarItems }) {
    const location = useLocation()
    const lastPath = location.pathname.split('/').filter(Boolean).pop();
    const navigate = useNavigate()

    const renderLabel = () => {
        const filter = sidebarItems.filter((e) => e.id === lastPath)
        return filter?.[0]?.label
    }

    return (
        <div className=''>
            <div className='flex items-center pl-4 pt-2 pb-[0.4rem]' onClick={() => navigate("/dashboard")}>
                <MdOutlineKeyboardArrowLeft size={25} />
                <h1 className="text-[26px] font-bold pb-1">{renderLabel() ?? "Home"}</h1>
            </div>
            <hr className='text-[#E1E4EA]' />
        </div>
    )
}

export default Navbar
