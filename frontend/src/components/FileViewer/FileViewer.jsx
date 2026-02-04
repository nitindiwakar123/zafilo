import { useEffect, useRef, useState } from 'react'
import useFileIcon from "../../hooks/useFileIcon";
import { IoClose } from "react-icons/io5";
import { BsArrowsFullscreen } from "react-icons/bs";
import { RiFullscreenExitFill } from "react-icons/ri";
import { getFile } from '../../api/endpoints/fileApi';
import { renderAsync } from 'docx-preview';
import { BiSolidDownload } from "react-icons/bi";
import { config } from '../../config/config.js';


const imageFiles = ["png", "jpeg", "jpg"];
const audioFiles = ["mp3", "wav", "aac", "m4a"];

function FileViewer({
  file,
  onCloseClick
}) {
  const [fullScreen, setFullScreen] = useState(false);
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const { icon: FileIcon, color } = useFileIcon(file.name);
  const docxContainer = useRef(null);
  const docStyleRef = useRef(null);

  async function fetchFileData() {
    if (!["xlsx", "docx"].includes(ext)) return;
    console.log({ ext });
    const response = await getFile(file._id);
    if (ext === "docx" && response.data) {
      await renderAsync(response.data,
        docxContainer.current,
        docStyleRef.current,
        {
          className: "object-contain",
          inWrapper: true,
          ignoreWidth: true,
          ignoreHeight: true,
          breakPages: true,
          ignoreFonts: false,
          ignoreLastRenderedPageBreak: true,
        }
      );
    }
  }

  useEffect(() => {
    fetchFileData();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div
        style={{
          width: fullScreen ? "100%" : "90%",
          height: fullScreen ? "100%" : "90%",
          borderRadius: fullScreen ? "0px" : "16px",
        }}
        className="bg-secodary-dark border border-white/15 flex flex-col">
        {/* ------- header (fixed height) ------- */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-white/15 shrink-0">
          <div className="flex items-center gap-3">
            {FileIcon && <FileIcon size={40} className={color || 'text-custom-cyan'} />}
            <div>
              <h4 className="text-custom-white text-base">{file.name}</h4>
              <p className="text-sm text-text-gray">2.5 MB</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <a className="text-text-gray hover:text-white cursor-pointer transition" href={`${config.baseUrl}/file/${file._id}?action=download`}><BiSolidDownload size={18} /></a>
            <button
              onClick={() => setFullScreen((prev) => !prev)}
              className="text-text-gray hover:text-white cursor-pointer transition">
              {fullScreen ? <RiFullscreenExitFill size={18} /> : <BsArrowsFullscreen size={14} />}
            </button>
            <button onClick={onCloseClick} className="text-text-gray hover:text-white cursor-pointer transition">
              <IoClose size={25} />
            </button>
          </div>
        </div>

        {imageFiles.includes(ext) && (
          <div className="grow overflow-auto flex items-center justify-center p-4">
            <img
              className="max-w-full max-h-full object-contain"
              src={`${config.baseUrl}/file/${file._id}?action=open`}
              alt={file.name}
            />
          </div>
        )}

        {["pdf", "txt", "md"].includes(ext) && (
          <iframe
            className="grow w-full"
            src={`${config.baseUrl}/file/${file._id}?action=open`}
            title="PDF"
          />
        )}

        {audioFiles.includes(ext) && (
          <div className="flex justify-center items-center h-full">
            <audio controls src={`${config.baseUrl}/file/${file._id}?action=open`} />
          </div>
        )}


        {ext === "docx" &&
          <div className='mx-auto max-w-[90%] overflow-auto'>
            <div ref={docStyleRef} style={{ display: "none" }}></div>

            <div ref={docxContainer} className="grow overflow-auto flex items-center justify-center p-4">
            </div>
          </div>
        }

      </div>

    </div>
  );
}

export default FileViewer;