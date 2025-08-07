import React, { useRef } from 'react';
import { MdOutlineCreateNewFolder, MdOutlineUploadFile, MdCreateNewFolder, MdUploadFile } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { refresh } from "../../features/refreshSlice/refreshSlice";

function CreateMenu({
  ref
}) {

  const BASE_URL = "http://localhost";
  const directoryData = useSelector((state) => state.directory.currentDirectory);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleFileUpload(e) {
    try {
      const file = e.target.files[0];

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open("POST", `${BASE_URL}/file/${directoryData.id}`, true);
      xhr.setRequestHeader("filename", file.name);
      xhr.send(file);

      xhr.addEventListener('load', (response) => {
        console.log(response.loaded);
        dispatch(refresh());
      });

    } catch (error) {

    }
  }
  return (
    <div ref={ref} className='absolute z-50 top-11 right-40 shadow-sm shadow-neutral-400 w-[200px] rounded-md overflow-hidden flex flex-col bg-bg-custom-gray'>

      <button className='flex cursor-pointer hover:text-custom-cyan hover:bg-[#E5EAF7] text-neutral-600 border-b border-b-neutral-300 items-center justify-start gap-2 py-3 transition-colors duration-300 px-2'>
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