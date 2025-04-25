import React from 'react'
import Sidebar from '../components/Sidebar'

function Dashboard({ children }) {
    return (
        <div className='w-full flex'>
            <div className='w-[5%]'>
            <Sidebar />
            </div>
            <div className='w-[95%]'>
                {children}
            </div>

        </div>
    )
}

export default Dashboard
