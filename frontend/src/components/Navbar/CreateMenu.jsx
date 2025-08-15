import React, { useRef, useState } from 'react';
import { MdOutlineCreateNewFolder, MdOutlineUploadFile, MdCreateNewFolder, MdUploadFile } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { refreshDirectoryData } from "../../features/refreshSlice/refreshSlice";
import { setOpenMenu } from "../../features/menuContextSlice/menuContextSlice";

function CreateMenu({
  ref
}) {

  const BASE_URL = "http://localhost";
  const directoryData = useSelector((state) => state.directory.currentDirectory);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCreateDirectory, setIsCreateDirectory] = useState(false);
  const [dirName, setDirName] = useState("New Folder");
  const { dirId } = useParams();


  async function handleFileUpload(e) {
    try {
      const file = e.target.files[0];

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open("POST", `${BASE_URL}/file/${dirId || ""}`, true);
      xhr.setRequestHeader("filename", file.name);
      xhr.send(file);

      xhr.addEventListener('load', (response) => {
        console.log(response.loaded);
        dispatch(refreshDirectoryData());
      });

    } catch (error) {

    }
  }

  async function handleCreateDirectory(e) {
    // e.preventDefault();
    // setErrorMessage("");
    console.log("Hello handleCreateDirectory!");
    try {
      const response = await fetch(`${BASE_URL}/folder/${dirId || ""}`, {
        method: "POST",
        headers: {
          dirname: dirName,
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);
      setDirName("New Folder");
      setIsCreateDirectory(false);
      dispatch(refreshDirectoryData());
    } catch (error) {
    }
  }

  return (
    <div ref={ref} className='absolute top-2 right-[-80px] shadow-sm shadow-neutral-400 w-[200px] rounded-md overflow-hidden flex flex-col bg-bg-custom-gray'>
      {isCreateDirectory &&
        <div className='w-[300px] py-5 px-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-custom-gray shadow-sm shadow-neutral-400 rounded-2xl overflow-hidden flex flex-col gap-4 border border-custom-cyan'>
          <h4 className='text-2xl font-normal text-gray-900'>Create folder</h4>
          <input className='text-sm p-2 text-neutral-800 rounded-md border border-neutral-500' type="text" value={dirName} onChange={(e) => setDirName(e.target.value)} />
          <div className='w-full flex justify-end items-center'>
            <button className='cursor-pointer bg-custom-cyan py-2 px-4 text-sm rounded-md text-custom-white' onClick={handleCreateDirectory}>Create</button>
          </div>
        </div>
      }

      <button onClick={() => {
        setIsCreateDirectory(true);
      }} className='flex cursor-pointer hover:text-custom-cyan hover:bg-[#E5EAF7] text-neutral-600 border-b border-b-neutral-300 items-center justify-start gap-2 py-3 transition-colors duration-300 px-2'>
        <MdOutlineCreateNewFolder size={18} />
        <span className='text-[12px] font-inter'>New Folder</span>
      </button>

      <button onClick={() => document.getElementById("file").click()} className='flex cursor-pointer hover:text-custom-cyan hover:bg-[#E5EAF7] text-neutral-600 justify-start gap-2 items-center py-3 transition-colors duration-300 px-2'>
        <input className='hidden' type="file" name="File" id="file" onInput={handleFileUpload} />
        <MdOutlineUploadFile size={18} />
        <span className='text-[12px] font-inter'>File upload</span>
      </button>
    </div>
  )
}

export default CreateMenu