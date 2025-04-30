import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutState } from '../../store/authSlice'
import { logout } from '../../api/auth'
import { useNavigate } from 'react-router-dom'
import { discardData } from '../../store/profileSlice'

function Home() {
    const userDetails = useSelector((state) => state.profile)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        const response = await logout()
        if (response?.data?.success) {
            navigate("/")
        }
        localStorage.clear()
        dispatch(logoutState())
        dispatch(discardData())

    }

    if (userDetails?.loading) return <p className='flex justify-center items-center h-full'><span className='loader' /></p>

    return (
        <div className='flex flex-col justify-center items-center gap-1 h-full'>
            <h1>Welcome, {userDetails?.user?.email}</h1>
            <div>
                <button className='bg-[#675FFF] p-2 rounded-lg text-white cursor-pointer' onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default Home
