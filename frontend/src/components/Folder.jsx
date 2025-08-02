import React from 'react'
import { FaFolder } from "react-icons/fa";

function Folder({
    name=""
}) {
  return (
    <div className='py-2 px-4 rounded-md bg-[#E5EAF7] flex items-center gap-2 text-custom-cyan'>
        <FaFolder />
        <span className='text-gray-900 text-xs font-medium'>{name}</span>
    </div>
  )
}

export default Folder;