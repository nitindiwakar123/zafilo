import { BsFileEarmarkPdf, BsFiletypeTxt, BsFileEarmarkCode, BsFileEarmarkZip, BsFiletypeXlsx, BsFileEarmarkImage, BsFileEarmark, BsFiletypeDocx, BsThreeDotsVertical } from "react-icons/bs";
import { FaRegFileVideo, FaBars } from "react-icons/fa";
import { GoFile } from 'react-icons/go';
import { MdOutlineAudioFile } from "react-icons/md";

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
    mp3: { icon: MdOutlineAudioFile, color: "text-[#7C3AED]" },
    wav: { icon: MdOutlineAudioFile, color: "text-[#7C3AED]" },
    aac: { icon: MdOutlineAudioFile, color: "text-[#7C3AED]" },
    m4a: { icon: MdOutlineAudioFile, color: "text-[#7C3AED]" },
  };

  return config[ext] || { icon: GoFile };
}

const useFileIcon = (filename) => {
  return getIconConfig(filename);
}

export default useFileIcon;