import React, { useEffect, useRef, useState } from 'react'
import { FaRegFileVideo, FaBars } from "react-icons/fa";
import { GoFile } from 'react-icons/go';
import { BsFileEarmarkPdf, BsFiletypeTxt, BsFileEarmarkCode, BsFileEarmarkZip, BsFiletypeXlsx, BsFileEarmarkImage, BsFileEarmark, BsFiletypeDocx, BsThreeDotsVertical } from "react-icons/bs";
import { setOpenMenu } from "../features/menuContextSlice/menuContextSlice";
import { useDispatch } from 'react-redux';
import { IoMdReturnLeft } from 'react-icons/io';

function File({
  activeViewType = "grid",
  name = "",
  id = "",
  checkedFiles=[],
  setCheckedFiles
}) {

  const [isImage, setIsImage] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const dispatch = useDispatch();
  const fileItemRef = useRef(null);
  const checkBoxRef = useRef(null);

  function getIconConfig(filename) {
    const ext = filename.includes('.') ? filename.split('.').pop().toLowerCase() : '';


    const config = {
      txt: { icon: BsFiletypeTxt },
      pdf: { icon: BsFileEarmarkPdf, color: "text-red-500" },
      docx: { icon: BsFiletypeDocx, color: "text-red-500" },
      xlsx: { icon: BsFiletypeXlsx, color: "text-[#299438]" },
      png: { icon: BsFileEarmarkImage },
      jpg: { icon: BsFileEarmarkImage },
      jpeg: { icon: BsFileEarmarkImage },
      gif: { icon: BsFileEarmarkImage },
      mp4: { icon: FaRegFileVideo },
      mkv: { icon: FaRegFileVideo },
      mov: { icon: FaRegFileVideo },
      avi: { icon: FaRegFileVideo },
      zip: { icon: BsFileEarmarkZip, color: "text-[#4A5568]" },
      rar: { icon: BsFileEarmarkZip, color: "text-[#4A5568]" },
      tar: { icon: BsFileEarmarkZip, color: "text-[#4A5568]" },
      gz: { icon: BsFileEarmarkZip, color: "text-[#4A5568]" },
      js: { icon: BsFileEarmarkCode, color: "text-green-500" },
      jsx: { icon: BsFileEarmarkCode },
      ts: { icon: BsFileEarmarkCode },
      tsx: { icon: BsFileEarmarkCode },
      html: { icon: BsFileEarmarkCode },
      css: { icon: BsFileEarmarkCode },
      py: { icon: BsFileEarmarkCode },
      java: { icon: BsFileEarmarkCode },
    };

    return config[ext] || { icon: GoFile };
  }

  function handleOptions(e) {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(rect.left + window.scrollX);
    const y = Math.round(rect.bottom + window.scrollY);
    dispatch(setOpenMenu({ type: `itemOption:${id}`, x, y, itemContext: "file", id, name }));
  }

  function handleSelect(e) {
    const ext = name.includes('.') ? `.${name.split('.').pop().toLowerCase()}` : '';
    if(e.target.checked) {
      setCheckedFiles((prev) => ([...prev, {fileId: id, extension: ext}]));
    } else {
      if(checkedFiles.length <= 0) return;
      const newCheckedFiles = checkedFiles.filter(({fileId}) => fileId !== id);
      setCheckedFiles(newCheckedFiles);
    }
  }

  const { icon: FileIcon, color } = getIconConfig(name);

  useEffect(() => {
    const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';

    if (["png", "jpeg", "jpg"].includes(ext)) {
      setIsImage(true);
    }
  }, [name]);


  return (
    <div
    ref={fileItemRef}
     className={`${activeViewType === "grid" ? "flex-col aspect-[2/1.5] w-46 py-2 bg-secodary-dark hover:bg-file-hover" : "flex-row w-full py-3 bg-primary-dark hover:bg-secodary-dark"} px-2 rounded-md flex  items-center gap-2 text-custom-cyan relative border border-white/12 transition-colors duration-300`}

     onMouseEnter={() => setIsHover(true)}
     onMouseLeave={() => {
      if(!checkBoxRef.current) return;
      if(checkBoxRef.current.checked) return;
      setIsHover(false);
     }}
     >

      {isHover && <input ref={checkBoxRef} className={`appearance-none w-5 h-5 ${activeViewType === "grid" && "absolute bottom-2 right-2"} cursor-pointer border border-white bg-transparent rounded-sm outline-none checked:bg-custom-cyan checked:before:content-['✔'] checked:before:text-black checked:before:flex checked:before:items-center checked:before:justify-center text-[12px]`} type="checkbox" name="select" id="select-file" onChange={handleSelect}  />}

      {activeViewType === "grid" && <div href={`http://localhost/file/${id}?action=open`} className={`w-full flex items-center justify-between gap-2`}>
        {FileIcon && <FileIcon className={`${color && color}`} size={22} />}
        <span className="w-full blzock capitalize text-[12px] font-semibold text-start text-custom-white truncate">{name}</span>

        <button onClick={handleOptions} className={`cursor-pointer hover:bg-secodary-gray rounded-full p-1 transition-colors duration-300`}><BsThreeDotsVertical /></button>
      </div>}

      {activeViewType === "list" && <a href={`http://localhost/file/${id}?action=open`} className={`w-full flex items-center justify-between gap-2`}>
        {FileIcon && <FileIcon className={`${color && color}`} size={22} />}
        <span className={`w-full blzock capitalize text-[12px] font-semibold text-custom-white truncate`}>{name}</span>

        <button onClick={handleOptions} className={`cursor-pointer hover:bg-neutral-300 rounded-full p-1 transition-colors duration-300`}><BsThreeDotsVertical /></button>
      </a>}

      {activeViewType === "grid" && <a href={`http://localhost/file/${id}?action=open`} className={`${activeViewType === "grid" && "w-full h-full aspect-[4/2] border border-white/12"} flex items-center overflow-hidden rounded-md`} >
        {isImage && <img src={`http://localhost/file/${id}?action=open`} className='w-full h-full object-cover' />}
        {!isImage && <FileIcon className={`${color && color} object-cover w-full h-[80%]`} />}
      </a>
      }

    </div>
  )
}

export default File;