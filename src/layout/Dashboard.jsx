import React from 'react'
import Sidebar from '../components/Sidebar'

function Dashboard({ children }) {
    return (
        <div className='w-full flex h-screen overflow-hidden'>
            <div className='w-[5%] h-screen'>
                <Sidebar />
            </div>
            <div className='w-[95%] bg-[#F6F7F9] overflow-y-auto overflow-x-hidden'>
                {children}
            </div>
        </div>
    )
}

export default Dashboard
