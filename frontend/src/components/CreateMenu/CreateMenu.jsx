import { useState } from 'react';
import { MdOutlineCreateNewFolder, MdOutlineUploadFile, MdCreateNewFolder, MdUploadFile } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { CreateDirectoryModal, UploadingFilesProgress } from "../index";
import { useUploadFile } from '../../hooks/fileHooks/fileHooks';
import { useQueryClient } from '@tanstack/react-query';

function CreateMenu({
  ref
}) {

  const [currentContext, setCurrentContext] = useState("menu");
  const [uploadingFiles, setUploadingFiles] = useState(null);
  const { dirId } = useParams();
  const uploadFileMutation = useUploadFile();
  const queryClient = useQueryClient();



  async function processNext(files, results) {
    console.log({ files, results });
    if (files.length <= 0) return results;

    const file = files.shift();
    try {
      const res = await uploadFileMutation.mutateAsync({
        parentDirId: dirId || "",
        file,
        onUploadProgress: (percent) => {
          setUploadingFiles(prev =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress: percent } : f
            )
          );
        },
      });

      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, isUploaded: res.success } : f
        )
      );
      results.push({ filename: file.name, isUploaded: res.success, data: res.data });
    } catch (error) {
      results.push({ filename: file.name, isUploaded: res.success, error });
    }

    // FIX: return the recursive call!
    return await processNext(files, results);
  }

  async function handleFileUpload(e) {
    try {
      let files = Array.from(e.target.files).map((file) => {
        file.id = crypto.randomUUID();
        return file;
      });

      setUploadingFiles(files.map((file) => ({
        id: file.id,
        name: file.name,
        progress: 0,
        isUploaded: false,
      })));

      const results = await processNext(files, []);
      const uploadedFiles = results
        .filter((file) => file.isUploaded === true)
        .map((file) => file.data);

      console.log({ results, uploadedFiles });
      queryClient.setQueryData(["directory", dirId || ""], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          files: [...oldData.files, ...uploadedFiles]
        };
      });
    }
    catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div ref={ref} >
      {currentContext === "menu" && <div className='absolute top-2 border border-white/12 right-[-80px] shadow-sm w-[200px] rounded-md overflow-hidden flex flex-col bg-menu-gray'>
        <button onClick={() => {
          setCurrentContext("createFolder");
        }} className='flex cursor-pointer hover:bg-secodary-gray hover:text-custom-white text-text-gray border-b border-white/12 items-center justify-start gap-2 py-3 transition-colors duration-300 px-2'>
          <MdOutlineCreateNewFolder size={18} />
          <span className='text-[12px] font-inter'>New Folder</span>
        </button>

        <button onClick={() => document.getElementById("file").click()} className='flex cursor-pointer hover:bg-secodary-gray hover:text-custom-white text-text-gray border-b border-white/12 items-center justify-start gap-2 py-3 transition-colors duration-300 px-2'>
          <input className='hidden' type="file" name="File" id="file" onInput={handleFileUpload} multiple />
          <MdOutlineUploadFile size={18} />
          <span className='text-[12px] font-inter'>File upload</span>
        </button>

      </div>}

      {currentContext === "createFolder" && <CreateDirectoryModal />}
      {uploadingFiles && <UploadingFilesProgress uploadingFiles={uploadingFiles} onClose={() => setUploadingFiles(null)} />}
    </div>
  )
}

export default CreateMenu;