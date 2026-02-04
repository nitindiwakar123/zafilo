import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAllFiles } from '../hooks/fileHooks/fileHooks';
import { useDirectoryData } from '../hooks/directoryHooks/directoryHooks';


function Home() {

  const { data } = useAllFiles();
  const { data: directoryData } = useAllFiles();
  const currentDate = new Date();

  if (data) return (
    <div className='w-full mx-auto space-y-4'>
      <h1 className="text-2xl text-custom-white font-inter">Welcome to Zafilo</h1 >

      <div className='w-full'>
        <h4 className='text-md text-text-gray'>Recent Folders</h4>

        {/* <ul className='flex gap-2 flex-wrap'>
          {directoryData.directories?.map(({ _id, name, createdAt }) => (
            createdAt <= currentDate &&
          ))}
        </ul> */}

      </div>
      {console.log({ allFiles: data })}

    </div>
  )
}

export default Home;