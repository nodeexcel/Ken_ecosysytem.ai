import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

function Home() {
    const email=useSelector((state)=>state.auth)
    
  return (
    <div className='flex justify-center items-center h-full'>
        Welcome
    </div>
  )
}

export default Home
