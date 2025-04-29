import React from 'react'
import { useSelector } from 'react-redux'

function Home() {
    const userDetails = useSelector((state) => state.profile)

    if (userDetails?.loading) return <p className='flex justify-center items-center h-full'><span className='loader' /></p>

    return (
        <div className='flex justify-center items-center h-full'>
            Welcome, {userDetails?.user?.email}
        </div>
    )
}

export default Home
