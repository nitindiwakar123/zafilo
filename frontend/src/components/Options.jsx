import React, { useEffect, useState } from 'react'
import { MdOutlineDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { refreshDirectoryData } from '../features/refreshSlice/refreshSlice';
import { setOpenMenu } from '../features/menuContextSlice/menuContextSlice';

function Options({
    ref,
}) {

    const menu = useSelector((state) => state.menuContext.openMenu);
    const dispatch = useDispatch();

    return (
        <div ref={ref} className={`shadow-sm shadow-neutral-400 w-[200px] rounded-md overflow-hidden flex flex-col bg-bg-custom-gray`}>
            <button onClick={() => {
                if (!menu.id) return;
                dispatch(setOpenMenu({ type: `rename:${menu.id}`, x: 0, y: 0, itemContext: menu.itemContext, id: menu.id, name: menu.name }));
            }} className='flex cursor-pointer hover:text-custom-cyan hover:bg-[#E5EAF7] text-neutral-600 border-b border-b-neutral-300 items-center justify-start gap-2 py-3 transition-colors duration-300 px-2'>
                <MdOutlineDriveFileRenameOutline size={18} />
                <span className='text-[12px] font-inter'>Rename</span>
            </button>

            <button
            onClick={() => {
                if (!menu.id) return;
                dispatch(setOpenMenu({ type: `delete:${menu.id}`, x: 0, y: 0, itemContext: menu.itemContext, id: menu.id, name: menu.name }));
            }}
            className='flex cursor-pointer hover:text-custom-cyan hover:bg-[#E5EAF7] text-neutral-600 justify-start gap-2 items-center py-3 transition-colors duration-300 px-2'>
                <MdOutlineDelete size={18} />
                <span className='text-[12px] font-inter'>Delete</span>
            </button>
        </div>
    )
}

export default Options