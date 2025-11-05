import React, { useEffect, useState } from 'react'
import { MdOutlineDelete, MdOutlineDriveFileRenameOutline, MdOutlineOpenWith, MdOutlinePreview } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { FaFileDownload } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux';
import { refreshDirectoryData } from '../../features/refreshSlice/refreshSlice';
import { setOpenMenu } from '../../features/menuContextSlice/menuContextSlice';
import { TbFileInfo } from "react-icons/tb";
import SubMenuCompo from "./SubMenu";


const subMenus = {
    openSubMenu: {
        parent: "Open",
        elements: [
            {
                title: "Open in new tab",
                icon: null,
                eventHandler: () => { }
            },
            {
                title: "Preview (Zafilo)",
                icon: null,
                eventHandler: () => { }
            },
        ]
    }
}

function Options({
    ref,
}) {

    const menu = useSelector((state) => state.menuContext.openMenu);
    const [subMenu, setSubMenu] = useState([]);

    const dispatch = useDispatch();

    const options = [
        {
            title: "Rename",
            icon: MdOutlineDriveFileRenameOutline,
            eventHandler: () => {
                if (!menu.id) return;
                dispatch(setOpenMenu({ type: `rename:${menu.id}`, x: 0, y: 0, itemContext: menu.itemContext, id: menu.id, name: menu.name }));
            }
        },
        {
            title: "Delete",
            icon: MdOutlineDelete,
            eventHandler: () => {
                if (!menu.id) return;
                dispatch(setOpenMenu({ type: `delete:${menu.id}`, x: 0, y: 0, itemContext: menu.itemContext, id: menu.id, name: menu.name }));
            },
            isBorder: true
        },
        {
            title: "Download",
            icon: FaFileDownload,
            eventHandler: () => { }
        },
        {
            title: "Open",
            icon: FiExternalLink,
            eventHandler: () => {
                setSubMenu(subMenus.openSubMenu.elements);
            },
            hasSubMenu: true,
            isBorder: true
        },
        {
            title: "File Details",
            icon: TbFileInfo,
            eventHandler: () => { }
        },
    ];

    return (
        <div ref={ref} className={`shadow-[0_3px_10px_rgb(0,0,0,0.2)] w-[250px] rounded-md overflow-hidden flex flex-col bg-[#242321] border border-white/12 py-2`}>

            {subMenu.length > 0 ? <SubMenuCompo childrens={subMenu} /> : null}

            {options.map((option, idx) => (
                <button key={idx} onClick={option.eventHandler} className={`flex cursor-pointer hover:bg-secodary-gray  text-custom-white items-center justify-between gap-2 py-2 transition-colors duration-300 px-3 ${option.isBorder && "border-b border-white/12"} `}>
                    <div className='flex items-center gap-2'>
                        <option.icon size={18} />
                        <span className='text-[12px] font-inter'>{option.title}</span>
                    </div>

                    {option.hasSubMenu && <FaAngleRight size={12} />}
                </button>
            ))}

        </div>
    )
}

export default Options