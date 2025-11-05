import React, { useRef, useState, useEffect } from 'react';
import { MdOutlineCreateNewFolder, MdOutlineUploadFile, MdCreateNewFolder, MdUploadFile } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { refreshDirectoryData } from "../../features/refreshSlice/refreshSlice";
import { setOpenMenu } from "../../features/menuContextSlice/menuContextSlice";
import { FileUploadProgressLoader, CreateDirectoryModal } from "../index";

function CreateMenu({
  ref
}) {

  const dispatch = useDispatch();
  const [currentContext, setCurrentContext] = useState("menu");
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { dirId } = useParams();

  async function processNext(queue) {
    const results = [];
    if (queue.length <= 0) return results;

    const file = queue.shift();

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open("POST", `${BASE_URL}/file/${dirId || ""}`, true);
    xhr.setRequestHeader("filename", file.name);

    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        console.log("onprogrsss filename: ", file.name);
        const percent = (event.loaded / event.total) * 100;
        // console.log("uploading files: ", uploadingFiles);

        // console.log(`${file.name} upload progress: ${percent.toFixed(2)}%`);
      }
    };

    xhr.onloadstart = function () {
      setUploadingFiles((prev) => ([...prev, { name: file.name, progress: 0 }]));

    }

    xhr.send(file);

    xhr.onload = async function (e) {
      if (xhr.status >= 200 && xhr.status < 300) {
        results.push(e.target.responseText);
        dispatch(refreshDirectoryData());
        await processNext(queue);
      } else {
        console.log("error not uploaded!");
        return false;
      }
    }

    xhr.onerror = function (e) {
      console.error("Network error (no response from server)");
      return false;
    }
  }

  async function handleFileUpload(e) {
    try {
      const filesList = e.target.files;
      const filesQueue = Array.from(filesList);
      dispatch(setOpenMenu(null));
      const results = await processNext(filesQueue);
      console.log("results: ", results);
    }
    catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    console.log("uploading files: ", uploadingFiles);
  }, [uploadingFiles])


  return (
    <div ref={ref} >
      {currentContext === "menu" && <div className='absolute top-2 right-[-80px] shadow-sm shadow-neutral-400 w-[200px] rounded-md overflow-hidden flex flex-col bg-primary-dark'>
        <button onClick={() => {
          setCurrentContext("createFolder");
        }} className='flex cursor-pointer hover:text-custom-cyan hover:bg-[#E5EAF7] text-neutral-600 border-b border-b-neutral-300 items-center justify-start gap-2 py-3 transition-colors duration-300 px-2'>
          <MdOutlineCreateNewFolder size={18} />
          <span className='text-[12px] font-inter'>New Folder</span>
        </button>

        <button onClick={() => document.getElementById("file").click()} className='flex cursor-pointer hover:text-custom-cyan hover:bg-[#E5EAF7] text-neutral-600 justify-start gap-2 items-center py-3 transition-colors duration-300 px-2'>
          <input className='hidden' type="file" name="File" id="file" onInput={handleFileUpload} multiple />
          <MdOutlineUploadFile size={18} />
          <span className='text-[12px] font-inter'>File upload</span>
        </button>

      </div>}

      {currentContext === "createFolder" && <CreateDirectoryModal />}
      {/* {currentContext === "menu" && <FileUploadProgressLoader />} */}
    </div>
  )
}

function uploadProgress() {
  return (
    <div className='fixed w-20 h-20 bottom-2 right-2'>
      <FileUploadProgressLoader />
    </div>
  )
}


export default CreateMenu