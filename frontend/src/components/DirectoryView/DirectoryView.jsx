import { useEffect, useRef, useState } from 'react';
import { ChildFilesView, ChildFoldersView } from "../index";
import {useDirectoryData} from "../../hooks/directoryHooks/directoryHooks";
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentDirectoryId } from '../../features/currentContext/currentContextSlice';

function DirectoryView() {

  const dispatch = useDispatch();
  const {dirId} = useParams();
  const {data} = useDirectoryData(dirId);
  
  useEffect(() => {
    if(!data) return;
    dispatch(setCurrentDirectoryId(dirId? dirId: ""));
  }, [data])

  if (data) return (
 
    <div className='mx-auto space-y-4 font-inter'>
      {/* <h1 className="text-2xl capitalize text-custom-white">{currentDirectory.name.startsWith("root") ? "My Drive" : currentDirectory.name}</h1 > */}

      <ChildFoldersView directoriesList={data.directories} />

      <ChildFilesView filesList={data.files} />

    </div>
  )
}

export default DirectoryView;