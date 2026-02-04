import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenMenu } from '../features/menuContextSlice/menuContextSlice';
import { useRenameDirectory } from '../hooks/directoryHooks/directoryHooks';
import { useRenameFile } from '../hooks/fileHooks/fileHooks';

function RenameModal({ ref }) {

    const [currentItemId, setCurrentItemId] = useState("");
    const [currentItem, setCurrentItem] = useState(null);
    const [newName, setNewName] = useState("");
    const dispatch = useDispatch();
    const menu = useSelector((state) => state.menuContext.openMenu);
    const parentDirId = useSelector((state) => state.currentContext.currentDirectoryId);
    const inputRef = useRef();

    const renameDirectoryMutation = useRenameDirectory(() => {
        dispatch(setOpenMenu(null));
    });

    const renameFileMutation = useRenameFile(() => {
        dispatch(setOpenMenu(null));
    });

    useEffect(() => {
        if (menu.id) {
            setCurrentItemId(menu.id);
            setCurrentItem(menu.itemContext);
            setNewName(menu.name);  // ✅ keep full file name
        }
    }, [menu]);

    useEffect(() => {
        if (inputRef.current) {
            const value = inputRef.current.value.split(".")[0];
            console.log(value);
            inputRef.current.focus();
            inputRef.current.setSelectionRange(0, value.length);
        }
    }, [currentItem]);

    return (
        <div ref={ref} className='w-[400px] py-6 px-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-menu-gray shadow-sm rounded-2xl overflow-hidden flex flex-col gap-5 border border-white/12'>
            <h4 className='text-2xl font-normal text-custom-white'>Rename</h4>
            <form onSubmit={(e) => {
                e.preventDefault();
                console.log({ currentItem });
                if (currentItem === "file") {
                    renameFileMutation.mutate({ fileId: currentItemId, newName, parentDirId });
                } else if (currentItem === "folder") {
                    renameDirectoryMutation.mutate({ dirId: currentItemId, newName, parentDirId });
                } else {
                    return;
                }
            }}>
                <input
                    ref={inputRef}
                    className='text-sm p-2 text-text-gray rounded-md border border-neutral-500 w-full'
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <div className='w-full flex justify-end items-center mt-3'>
                    <button
                        type='submit'
                        className='cursor-pointer bg-custom-cyan hover:bg-[#3a74fc] py-2 px-4 text-sm rounded-md text-custom-white transition-colors duration-300'
                    >
                        Rename
                    </button>
                </div>
            </form>
        </div>
    )
}

export default RenameModal;
