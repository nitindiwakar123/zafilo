import React from 'react'
import { FaFolder } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { setOpenMenu } from "../features/menuContextSlice/menuContextSlice";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Folder({
  name = "",
  id = ""
}) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/folder/${id}`)} className='py-3 cursor-context-menu px-2 rounded-md bg-[#E5EAF7] flex items-center justify-between gap-5 text-custom-cyan'>
      <div className='flex items-center gap-2'>
        <FaFolder />
        <span className='text-neutral-800 capitalize text-[12px] font-semibold'>{name}</span>
      </div>

      <button onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(rect.left + window.scrollX);
        const y = Math.round(rect.bottom + window.scrollY);
        dispatch(setOpenMenu({ type: `itemOption:${id}`, x, y, itemContext: "folder", id }));
      }} className={`cursor-pointer hover:bg-neutral-300 rounded-full p-1 transition-colors duration-300`}><BsThreeDotsVertical /></button>
    </div>
  )
}

export default Folder;