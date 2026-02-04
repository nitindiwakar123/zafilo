import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenMenu } from '../features/menuContextSlice/menuContextSlice';
import { useDeleteDirectory } from '../hooks/directoryHooks/directoryHooks';
import { useDeleteFile } from '../hooks/fileHooks/fileHooks';

function DeleteModal({ ref }) {

    const [currentItem, setCurrentItem] = useState({
        id: "",
        name: "",
        type: ""
    });
    const dispatch = useDispatch();
    const menu = useSelector((state) => state.menuContext.openMenu);
    const parentDirId = useSelector((state) => state.currentContext.currentDirectoryId);

    const deleteDirectoryMutation = useDeleteDirectory(() => {
        dispatch(setOpenMenu(null));
    });

    const deleteFileMutation = useDeleteFile(() => {
        dispatch(setOpenMenu(null));
    });

    useEffect(() => {
        if (!menu.id || !menu.itemContext || !menu.name) return;

        setCurrentItem({ id: menu.id, name: menu.name, type: menu.itemContext });
    }, [menu])



    if (!menu.type.startsWith("delete")) return null;

    return (
        <div ref={ref} className='w-[400px] py-6 px-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-menu-gray shadow-sm rounded-2xl overflow-hidden flex flex-col gap-5 border border-white/12'>
            <h4 className='text-2xl font-normal text-custom-white'>Delete forever?</h4>
            <p className='text-sm text-text-gray'>"{currentItem.name}" will be deleted forever. This can't be undone.</p>
            <div className='w-full flex justify-end items-center gap-2'>
                <button onClick={() => {
                    dispatch(setOpenMenu(null));
                }} className='cursor-pointer py-2 px-4 text-sm rounded-md text-custom-cyan'>Cancel</button>
                <button onClick={() => {
                    if (currentItem.type === "folder") {
                        deleteDirectoryMutation.mutate({ dirId: currentItem.id, parentDirId });
                    } else if (currentItem.type === "file") {
                        deleteFileMutation.mutate({fileId: currentItem.id, parentDirId});
                    } else {
                        return;
                    }
                }} className='cursor-pointer bg-[#b93730] hover:bg-[#d62f26] transition-colors duration-300 py-2 px-4 text-sm rounded-md text-custom-white'>Delete forever</button>
            </div>
        </div>
    )
}

export default DeleteModal