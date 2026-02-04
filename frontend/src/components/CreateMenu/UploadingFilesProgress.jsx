import { useEffect, useState } from "react";
import useFileIcon from "../../hooks/useFileIcon";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoClose } from "react-icons/io5";

function UploadingFilesProgress({
    uploadingFiles = [],
    onClose
}) {

    const [isFileList, setIsFileList] = useState(true);

    return (
        <div className="w-[350px] overflow-hidden fixed z-40 right-4 bottom-0 bg-menu-gray border border-white/10 rounded-xl space-y-1">
            <div className="w-full py-3 px-2 flex justify-between items-center text-custom-white font-inter bg-secodary-dark">
                <h4>{uploadingFiles.filter((file) => file.isUploaded).length} uploaded successfully!</h4>

                <div className="flex justify-center gap-2">
                    <button onClick={() => setIsFileList((prev) => !prev)} className="text-custom-white cursor-pointer hover:bg-secodary-gray p-1 rounded-full transition-colors duration-300">
                        {isFileList ? <IoIosArrowDown size={20} /> : <IoIosArrowUp size={20} />}
                    </button>
                    <button onClick={onClose} className="text-custom-white cursor-pointer hover:bg-secodary-gray p-1 rounded-full transition-colors duration-300"><IoClose size={20} /></button>
                </div>
            </div>
            {isFileList && <ul className="flex flex-col gap-4 py-4 px-2">
                {uploadingFiles?.map((file) => (
                    <li key={file.id}>
                        <UploadingFile file={file} />
                    </li>
                ))}
            </ul>}
        </div>
    )
}

function UploadingFile({
    file
}) {

    const [status, setStatus] = useState("uploading");
    const { icon: FileIcon, color } = useFileIcon(file.name);
    function shortenFilename(filename = "", front = 5, back = 8) {
        const dotIndex = filename.lastIndexOf(".");
        if (dotIndex === -1) return filename;

        const ext = filename.slice(dotIndex);
        const name = filename.slice(0, dotIndex);

        const firstPart = name.slice(0, front);
        const lastPart = name.slice(-back);

        return `${firstPart}...${lastPart}${ext}`;
    }

    useEffect(() => {
        console.log({ file });
        if (file.progress !== 100) return;

        const fileStatus = file.isUploaded ? "uploaded" : "failed";
        setStatus(fileStatus);

    }, [file]);

    return (
        <div className="w-full flex-col items-center">
            <div className="w-full flex justify-between items-center">
                <div className="flex justify-center items-center gap-1">
                    <div>
                        {FileIcon && <FileIcon className={`${color ? color : "text-custom-cyan"}`} />}
                    </div>
                    <span className="overflow-clip text-xs text-text-gray truncate">{shortenFilename(file.name)}</span>
                </div>
                <button
                    disabled={file.progress === 100}
                    className={`text-xs cursor-pointer text-custom-white/80 border border-white/12 py-1 px-2 rounded-md transition-colors duration-300 ${status === "uploading" && "bg-primary-dark hover:bg-secodary-gray"} ${status === "uploaded" && "bg-green-400"} ${status === "failed" && "bg-red-500"}`}
                >
                    {status}
                </button>
            </div>
            <div
                className="mt-2 bg-custom-cyan h-1 rounded"
                style={{ width: `${file.progress}%` }}
            />
        </div>
    )
}

export default UploadingFilesProgress;