import React, { useEffect, useState } from 'react'
import { FaRegFileVideo } from "react-icons/fa";
import { BsFileEarmarkPdf, BsFileEarmarkCode, BsFileEarmarkZip, BsFiletypeXlsx, BsFileEarmarkImage, BsFileEarmark, BsFiletypeDocx  } from "react-icons/bs";

function File({
  activeViewType = "grid",
  name = "",
  id = "",
}) {

  const [iconType, setIconType] = useState("alt");
  const [iconColor, setIconColor] = useState("");

  function getFileIcon(filename) {
    const ext = filename.split(".").pop().toLowerCase();

    switch (ext) {
      case "pdf":
        setIconColor("text-red-500");
        return "pdf";

      case "docx":
        setIconColor("text-custom-cyan");
        return "docx";

      case "xlsx":
        setIconColor("text-[#299438]");
        return "xlsx";

      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return "image";

      case "mp4":
      case "mkv":
      case "mov":
      case "avi":
        return "video";

      case "zip":
      case "rar":
      case "tar":
      case "gz":
        setIconColor("text-[#4A5568]");
        return "archive";

      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "html":
      case "css":
      case "py":
      case "java":
        return "code";
      default:
        setIconColor("text-neutral-500")
        return "alt";
    }
  }

  useEffect(() => {
    const icon = getFileIcon(name);
    setIconType(icon);
  }, [])


  return (
    <a href={`http://localhost/file/${id}?action=open`} className={`${activeViewType === "grid" ? "flex-col w-36 py-1" : "flex-row w-full py-2"} px-3 rounded-md bg-[#E5EAF7] flex  items-center gap-2 text-custom-cyan`}>
      <div className={`${activeViewType === "grid" && "w-32 aspect-[4/2]"} flex items-center  overflow-hidden rounded-md`} >
        {iconType === "alt" && <BsFileEarmark className={`w-full h-[80%] object-cover ${iconColor}`} />}
        {iconType === "pdf" && <BsFileEarmarkPdf className={`w-full h-[80%] object-cover ${iconColor}`} />}
        {iconType === "video" && <FaRegFileVideo className={`w-full h-[80%] object-cover ${iconColor}`} />}
        {iconType === "archive" && <BsFileEarmarkZip className={`w-full h-[80%] object-cover ${iconColor}`} />}
        {iconType === "code" && <BsFileEarmarkCode className={`w-full h-[80%] object-cover ${iconColor}`} />}
        {iconType === "xlsx" && <BsFiletypeXlsx className={`w-full h-[80%] object-cover ${iconColor}`} />}
        {iconType === "docx" && <BsFiletypeDocx className={`w-full h-[80%] object-cover ${iconColor}`} />}
        {iconType === "image" && activeViewType === "list" ? <BsFileEarmarkImage className={`w-full h-[80%] object-cover ${iconColor}`} /> : null}
        {iconType === "image" && activeViewType === "grid" ? <img src={`http://localhost/file/${id}?action=open`} className="h-full w-full object-cover" alt="" /> : null}
      </div>
      <span className={`w-full block text-xs ${activeViewType === "grid" && "text-center"} font-medium text-gray-900 truncate`}>{name}</span>


    </a>
  )
}

export default File;