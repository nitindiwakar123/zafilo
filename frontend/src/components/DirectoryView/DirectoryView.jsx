import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { File, Folder } from "../index";
import { IoGrid, IoGridOutline } from 'react-icons/io5';
import { AiOutlineBars } from "react-icons/ai";

function DirectoryView() {

  const currentDirectory = useSelector((state) => state.directory.currentDirectory);
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [activeView, setActiveView] = useState("grid");

  useEffect(() => {
    if (currentDirectory) {
      setDirectoriesList(currentDirectory.directories);
      setFilesList(currentDirectory.files);
    }

  }, [currentDirectory])

  if (currentDirectory) return (
    <div className='w-[80%] max-w-[80%] mx-auto py- space-y-5 bg-custom-white font-inter'>
      <h3 className="text-2xl capitalize">My Drive</h3 >

      <div className='flex flex-col gap-2'>
        <h4 className='text-md text-neutral-500'>Folders</h4>

        <ul className='flex'>
          {directoriesList?.map(({ id, name }) => (
            <li key={id}>
              <Folder name={name} />
            </li>
          ))}
        </ul>
      </div>

      <div className='flex flex-col gap-5'>
        <div className='w-full flex justify-between items-center'>
          <h4 className='text-md text-neutral-500'>Files</h4>

          <div className='flex items-center gap-2 text-neutral-500'>
            <button className={`cursor-pointer rounded-sm p-2 ${activeView === "grid" && "text-custom-cyan bg-custom-bg-gray2"}`} onClick={() => setActiveView("grid")}>
              {activeView === 'grid'? <IoGrid />: <IoGridOutline />}
            </button>
            <button className={`cursor-pointer p-2 rounded-sm ${activeView === "list" && "text-custom-cyan bg-custom-bg-gray2"}`} onClick={() => setActiveView("list")}>
              <AiOutlineBars />
            </button>
          </div>
        </div>

        <ul className={`w-full max-h-[400px] mx-auto flex overflow-x-hidden overflow-y-auto ${activeView === "grid" ? "flex-row justify-start flex-wrap " : "flex-col"} gap-2`}>
          {filesList?.map(({ id, name }) => (
            <li key={id}>
              <File activeViewType={activeView} name={name} id={id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DirectoryView