import { useState } from "react";
import { File } from "../index";
import { IoGrid, IoGridOutline } from 'react-icons/io5';
import { AiOutlineBars } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useDeleteFiles } from "../../hooks/fileHooks/fileHooks";
import { FileViewer } from "../index";

function ChildFilesView({
    filesList = []
}) {

    const [activeView, setActiveView] = useState("grid");
    const [checkedFiles, setCheckedFiles] = useState([]);
    const { dirId } = useParams();
    const useDeleteFilesMutation = useDeleteFiles(() => {
        setCheckedFiles([]);
    });
    const [openedFile, setOpenedFile] = useState(null);

    return (
        <div className='flex flex-col gap-5'>
            
            <div className='w-full flex justify-between items-center'>
                <h4 className='text-md text-text-gray'>Files</h4>
                <div className='flex items-center gap-2 text-text-gray'>
                    <button className={`cursor-pointer rounded-sm p-2 ${activeView === "grid" && "text-custom-cyan bg-secodary-gray"}`} onClick={() => setActiveView("grid")}>
                        {activeView === 'grid' ? <IoGrid /> : <IoGridOutline />}
                    </button>
                    <button className={`cursor-pointer p-2 rounded-sm ${activeView === "list" && "text-custom-cyan bg-secodary-gray"}`} onClick={() => setActiveView("list")}>
                        <AiOutlineBars />
                    </button>
                </div>
            </div>

            {checkedFiles.length > 0 && <div>
                <button
                    className='flex gap-1 cursor-pointer items-center bg-custom-cyan text-primary-dark py-1.5 px-5 rounded-md border border-white'
                    onClick={() => useDeleteFilesMutation.mutate({ parentDirId: dirId || "", files: checkedFiles })}
                >
                    <MdOutlineDelete size={25} />
                    <span className="text-sm font-semibold">Delete</span>
                </button>
            </div>}

            <ul className={`w-full max-h-[400px] mx-auto flex overflow-x-hidden overflow-y-auto ${activeView === "grid" ? "flex-row justify-start flex-wrap space-y-2" : "flex-col"} gap-2`}>
                {filesList?.map((file) => (
                    <li key={file._id}>
                        <File activeViewType={activeView} name={file.name} id={file._id} checkedFiles={checkedFiles} setCheckedFiles={setCheckedFiles} onFileClick={() => setOpenedFile(file)} />
                    </li>
                ))}

            </ul>

            {openedFile && <FileViewer file={openedFile} onCloseClick={() => setOpenedFile(null)}/>}
        </div>
    )
}

export default ChildFilesView;