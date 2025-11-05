import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useCreateDirectory } from "../../hooks/directoryHooks/directoryHooks";
import { setOpenMenu } from "../../features/menuContextSlice/menuContextSlice";
import { useSelector } from "react-redux";

function CreateDirectoryModal() {

  const [dirname, setDirname] = useState("New Folder");
  const inputRef = useRef();
  const { dirId } = useParams();
  const dispatch = useDispatch();
  const parentDirId = useSelector((state) => state.currentContext.currentDirectoryId);

  const createDirectoryMutation = useCreateDirectory(() => {
    // callback when mutation succeeds
    dispatch(setOpenMenu(null));
  });

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, [])


  return (
    <div className='w-[300px] py-5 px-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-dark shadow-sm shadow-neutral-400 rounded-2xl overflow-hidden flex flex-col gap-4 border border-custom-cyan'>
      <h4 className='text-2xl font-normal text-gray-900'>Create folder</h4>
      <form onSubmit={(e) => {
        e.preventDefault();
        createDirectoryMutation.mutate({ parentDirId: dirId, dirname });
      }}>
        <input ref={inputRef} className='text-sm p-2 text-neutral-800 rounded-md border border-neutral-500' type="text" value={dirname} onChange={(e) => setDirname(e.target.value)} />
        <div className='w-full flex justify-end items-center'>
          <button type='submit' className='cursor-pointer bg-custom-cyan py-2 px-4 text-sm rounded-md text-custom-white'>Create</button>
        </div>
      </form>
    </div>
  )
}

export default CreateDirectoryModal;