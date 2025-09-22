import { useState, useEffect } from "react";
import { File } from "../index";
import { IoGrid, IoGridOutline } from 'react-icons/io5';
import { AiOutlineBars } from "react-icons/ai";
import { MdOutlineDelete, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { refreshDirectoryData } from "../../features/refreshSlice/refreshSlice";

function ChildFilesView({
    filesList = []
}) {

    const BASE_URL = "http://localhost";
    const [activeView, setActiveView] = useState("grid");
    const [checkedFiles, setCheckedFiles] = useState([]);
    const { dirId } = useParams();
    const dispatch = useDispatch();

    async function handleMultiFileDelete() {
        try {
            const response = await fetch(`${BASE_URL}/file/delete-multiple/${dirId || ""}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ files: checkedFiles }),
                credentials: "include"
            });

            const data = await response.json();
            if (data) {
                dispatch(refreshDirectoryData());
                setCheckedFiles([]);
                console.log("handleMultiFileDelete: ", data);
            }
        } catch (error) {
            console.log("DirectoryView :: ChildFilesView :: handleMultiFileDelete :: error :: ", error);
        }
    }

    useEffect(() => {
        console.log("checkedFiles: ", checkedFiles);

    }, [checkedFiles])


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
                    onClick={handleMultiFileDelete}
                >
                    <MdOutlineDelete size={25} />
                    <span className="text-sm font-semibold">Delete</span>
                </button>
            </div>}

            <ul className={`w-full max-h-[400px] mx-auto flex overflow-x-hidden overflow-y-auto ${activeView === "grid" ? "flex-row justify-start flex-wrap space-y-2" : "flex-col"} gap-2`}>
                {filesList?.map(({ _id, name }) => (
                    <li key={_id}>
                        <File activeViewType={activeView} name={name} id={_id} checkedFiles={checkedFiles} setCheckedFiles={setCheckedFiles} />
                    </li>
                ))}

            </ul>
        </div>
    )
}

export default ChildFilesView;