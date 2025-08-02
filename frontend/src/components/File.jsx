import React from 'react'
import { FaFile } from "react-icons/fa6";

function File({
    icon="",
    name=""
}) {
  return (
    <div className='py-2 px-4 rounded-md bg-[#E5EAF7] flex items-center gap-2 text-custom-cyan'>
        {icon ? <icon />: <FaFile />}
        <span className='text-gray-900 text-xs font-medium'>{name}</span>
    </div>
  )
}

export default File;