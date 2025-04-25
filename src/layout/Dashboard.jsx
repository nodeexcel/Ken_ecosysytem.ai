import React from 'react'
import Sidebar from '../components/Sidebar'

function Dashboard({ children }) {
    return (
        <div className='w-full flex h-screen space-y-6 overflow-y-auto'>
            <div className='w-[5%] min-w-[53px]'>
            <Sidebar />
            </div>
            <div className='w-[95%] bg-[#F6F7F9]'>
                {children}
            </div>

        </div>
    )
}

export default Dashboard
