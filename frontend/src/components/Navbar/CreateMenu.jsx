import React, { useRef, useState, useEffect } from 'react';
import { MdOutlineCreateNewFolder, MdOutlineUploadFile, MdCreateNewFolder, MdUploadFile } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { refreshDirectoryData } from "../../features/refreshSlice/refreshSlice";
import { setOpenMenu } from "../../features/menuContextSlice/menuContextSlice";
import { FileUploadProgressLoader } from "../index";

function CreateMenu({
  ref
}) {

  const BASE_URL = "http://localhost";
  const directoryData = useSelector((state) => state.directory.currentDirectory);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentContext, setCurrentContext] = useState("menu");
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { dirId } = useParams();

  async function handleCreateDirectory(e, dirname) {
    e.preventDefault();
    // setErrorMessage("");
    console.log("Hello handleCreateDirectory!");
    try {
      const response = await fetch(`${BASE_URL}/folder/${dirId || ""}`, {
        method: "POST",
        headers: {
          dirname
        },
        credentials: "include",
      });

      const data = await response.json();
      if (data) {
        dispatch(refreshDirectoryData());
        dispatch(setOpenMenu(null));
      }
    } catch (error) {
    }
  }

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
        const percent = (event.loaded / event.total) * 100;
        setUploadingFiles((prev) => ([...prev, {name: file.name, progress: percent}]));
        // console.log(`${file.name} upload progress: ${percent.toFixed(2)}%`);
      }
    };

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

      {currentContext === "createFolder" && <CreateDirectory onCreateSubmit={handleCreateDirectory} />}
      {/* {currentContext === "menu" && <uploadProgress />} */}
    </div>
  )
}

function CreateDirectory({
  onCreateSubmit
}) {

  const [dirName, setDirName] = useState("New Folder");
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, [])


  return (
    <div className='w-[300px] py-5 px-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-dark shadow-sm shadow-neutral-400 rounded-2xl overflow-hidden flex flex-col gap-4 border border-custom-cyan'>
      <h4 className='text-2xl font-normal text-gray-900'>Create folder</h4>
      <form onSubmit={(e) => onCreateSubmit(e, dirName)}>
        <input ref={inputRef} className='text-sm p-2 text-neutral-800 rounded-md border border-neutral-500' type="text" value={dirName} onChange={(e) => setDirName(e.target.value)} />
        <div className='w-full flex justify-end items-center'>
          <button type='submit' className='cursor-pointer bg-custom-cyan py-2 px-4 text-sm rounded-md text-custom-white'>Create</button>
        </div>
      </form>
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