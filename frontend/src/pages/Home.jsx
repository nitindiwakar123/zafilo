import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAllFiles } from '../hooks/fileHooks/fileHooks'

function Home() {

  const {data} = useAllFiles();

    if (data) return (
    <div className='w-full'>
      <div className='mx-auto space-y-4 font-inter'>
      
            <h1 className="text-2xl capitalize text-custom-white">Welcome Back!</h1 >

            {console.log({allFiles: data})}
      
          </div>
    </div>
  )
}

export default Home