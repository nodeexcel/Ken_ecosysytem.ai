import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

function Dashboard() {
    return (
        <div className='w-full flex h-screen'>
            <div className='w-[5%] h-full'>
                <Sidebar />
            </div>
            <div className='w-[95%] h-full'>
                <Outlet/>
            </div>
        </div>
    )
}

export default Dashboard
