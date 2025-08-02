import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {File, Folder} from "./index";

function DirectoryView() {
  const currentDirectory = useSelector((state) => state.directory.currentDirectory);
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);


  useEffect(() => {
    if (currentDirectory) {
      setDirectoriesList(currentDirectory.directories);
      setFilesList(currentDirectory.files);
    }

  }, [currentDirectory])

  if (currentDirectory) return (
    <div className='w-[80%] max-w-[80%] mx-auto py-10 space-y-5 bg-custom-white font-inter'>
      <h3 className="text-2xl capitalize">My Drive</h3 >

      <div className='flex flex-col gap-2'>
        <h4 className='text-md text-neutral-500'>Folders</h4>

        <ul className='flex'>
          {directoriesList?.map(({id, name}) => (
            <li key={id}>
              <Folder name={name}/>
            </li>
          ))}
        </ul>
      </div>

      <div className='flex flex-col gap-2'>
        <h4 className='text-md text-neutral-500'>Files</h4>

        <ul className='flex flex-col gap-2'>
          {filesList?.map(({id, name}) => (
            <li key={id}>
              <File name={name}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DirectoryView