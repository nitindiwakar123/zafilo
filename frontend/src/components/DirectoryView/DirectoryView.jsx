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

  }, [currentDirectory]);

  if (currentDirectory) return (
    <div className='w-[85%] max-w-[90%] mx-auto py- space-y-5 bg-custom-white font-inter'>
      
      <h3 className="text-2xl capitalize">{currentDirectory.name.startsWith("root")? "My Drive": currentDirectory.name}</h3 >

      <div className='flex flex-col gap-2'>
        <h4 className='text-md text-neutral-500'>Folders</h4>

        <ul className='flex gap-2'>
          {directoriesList?.map(({ _id, name }) => (
            <li key={_id}>
              <Folder name={name} id={_id} />
            </li>
          ))}
        </ul>
      </div>

      <div className='flex flex-col gap-5'>
        <div className='w-full flex justify-between items-center'>
          <h4 className='text-md text-neutral-500'>Files</h4>

          <div className='flex items-center gap-2 text-neutral-500'>
            <button className={`cursor-pointer rounded-sm p-2 ${activeView === "grid" && "text-custom-cyan bg-custom-bg-gray2"}`} onClick={() => setActiveView("grid")}>
              {activeView === 'grid' ? <IoGrid /> : <IoGridOutline />}
            </button>
            <button className={`cursor-pointer p-2 rounded-sm ${activeView === "list" && "text-custom-cyan bg-custom-bg-gray2"}`} onClick={() => setActiveView("list")}>
              <AiOutlineBars />
            </button>
          </div>
        </div>

        <ul className={`w-full max-h-[400px] mx-auto flex overflow-x-hidden overflow-y-auto ${activeView === "grid" ? "flex-row justify-between flex-wrap space-y-2" : "flex-col"} gap-2`}>
          {filesList?.map(({ _id, name }) => (
            <li key={_id}>
              <File activeViewType={activeView} name={name} id={_id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DirectoryView