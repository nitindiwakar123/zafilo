import { useEffect } from 'react';
import { ChildFilesView, ChildFoldersView, BreadCrumb } from "../index";
import { useDirectoryData } from "../../hooks/directoryHooks/directoryHooks";
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentDirectoryId } from '../../features/currentContext/currentContextSlice';

function DirectoryView() {

  const dispatch = useDispatch();
  const { dirId } = useParams();
  const { data } = useDirectoryData(dirId);

  useEffect(() => {
    if (!data) return;
    // console.log({dirData: data});
    dispatch(setCurrentDirectoryId(dirId ? dirId : ""));
  }, [data])

  if (data) return (

    <div className='mx-auto space-y-4 font-inter'>

      <BreadCrumb pathArray={data.pathArray} currentDirId={data._id} />

      <ChildFoldersView directoriesList={data.directories} />

      <ChildFilesView filesList={data.files} />

    </div>
  )
}

export default DirectoryView;