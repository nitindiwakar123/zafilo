import { useEffect, useRef, useState } from 'react';
import { setOpenMenu } from "../features/menuContextSlice/menuContextSlice";
import { useDispatch } from 'react-redux';
import useFileIcon from '../hooks/useFileIcon';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { config } from '../config/config';

function File({
  activeViewType = "grid",
  name = "",
  id = "",
  checkedFiles = [],
  setCheckedFiles,
  onFileClick
}) {

  const [isImage, setIsImage] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const dispatch = useDispatch();
  const fileItemRef = useRef(null);
  const checkBoxRef = useRef(null);
  const { icon: FileIcon, color } = useFileIcon(name);

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
    if (e.target.checked) {
      setCheckedFiles((prev) => ([...prev, { fileId: id, extension: ext }]));
    } else {
      if (checkedFiles.length <= 0) return;
      const newCheckedFiles = checkedFiles.filter(({ fileId }) => fileId !== id);
      setCheckedFiles(newCheckedFiles);
    }
  }

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
        if (!checkBoxRef.current) return;
        if (checkBoxRef.current.checked) return;
        setIsHover(false);
      }}
    >

      {isHover && <input ref={checkBoxRef} className={`appearance-none w-5 h-5 ${activeViewType === "grid" && "absolute bottom-2 right-2"} cursor-pointer border border-white bg-transparent rounded-sm outline-none checked:bg-custom-cyan checked:before:content-['✔'] checked:before:text-black checked:before:flex checked:before:items-center checked:before:justify-center text-[12px]`} type="checkbox" name="select" id="select-file" onChange={handleSelect} />}

      {activeViewType === "grid" && <div onClick={onFileClick} className={`w-full flex items-center justify-between gap-2`}>
        {FileIcon && <FileIcon className={`${color && color}`} size={22} />}
        <span className="w-full blzock capitalize text-[12px] font-semibold text-start text-custom-white truncate">{name}</span>

        <button onClick={handleOptions} className={`cursor-pointer hover:bg-secodary-gray rounded-full p-1 transition-colors duration-300`}><BsThreeDotsVertical /></button>
      </div>}

      {activeViewType === "list" && <div onClick={onFileClick} className={`w-full flex items-center justify-between gap-2`}>
        {FileIcon && <FileIcon className={`${color && color}`} size={22} />}
        <span className={`w-full blzock capitalize text-[12px] font-semibold text-custom-white truncate`}>{name}</span>

        <button onClick={handleOptions} className={`cursor-pointer hover:bg-neutral-300 rounded-full p-1 transition-colors duration-300`}><BsThreeDotsVertical /></button>
      </div>}

      {activeViewType === "grid" && <button onClick={onFileClick} className={`${activeViewType === "grid" && "w-full h-full aspect-[4/2] border border-white/12"} flex items-center overflow-hidden rounded-md`} >
        {isImage && <img src={`${config.baseUrl}/file/${id}?action=open`} className='w-full h-full object-cover' />}
        {!isImage && <FileIcon className={`${color && color} object-cover w-full h-[80%]`} />}
      </button>
      }

    </div>
  )
}

export default File;