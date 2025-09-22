import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChildFilesView, ChildFoldersView } from "../index";

function DirectoryView() {

  const currentDirectory = useSelector((state) => state.directory.currentDirectory);
  const directoriesList = currentDirectory?.directories || [];
  const filesList = currentDirectory?.files || [];


  if (currentDirectory) return (
    <div className='mx-auto space-y-4 font-inter'>

      <h1 className="text-2xl capitalize text-custom-white">{currentDirectory.name.startsWith("root") ? "My Drive" : currentDirectory.name}</h1 >

      <ChildFoldersView directoriesList={directoriesList} />

      <ChildFilesView filesList={filesList} />


    </div>
  )
}

export default DirectoryView;