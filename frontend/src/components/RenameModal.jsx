import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshDirectoryData } from "../features/refreshSlice/refreshSlice";
import { setOpenMenu } from '../features/menuContextSlice/menuContextSlice';

function RenameModal({ ref }) {

    const BASE_URL = "http://localhost";
    const [currentItemId, setCurrentItemId] = useState("");
    const [currentItem, setCurrentItem] = useState(null);
    const [oldName, setOldName] = useState("");
    const [newName, setNewName] = useState("");
    const dispatch = useDispatch();
    const menu = useSelector((state) => state.menuContext.openMenu);
    const inputRef = useRef();

    async function handleItemRename(e) {
        e.preventDefault();

        if (!currentItemId || !currentItem) return;
        try {
            const response = await fetch(`${BASE_URL}/${currentItem}/${currentItemId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    newName
                }),
                credentials: "include",
            });

            if (response.ok) {
                dispatch(setOpenMenu(null));
                dispatch(refreshDirectoryData());
            }
        } catch (error) {
            console.log("Options.jsx :: handleRenameFile :: error :: ", error);
        }
    }

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
        <div ref={ref} className='w-[400px] py-6 px-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-dark shadow-sm shadow-neutral-400 rounded-2xl overflow-hidden flex flex-col gap-5 border border-custom-cyan'>
            <h4 className='text-2xl font-normal text-gray-900'>Rename</h4>
            <form onSubmit={handleItemRename}>
                <input
                    ref={inputRef}
                    className='text-sm p-2 text-neutral-800 rounded-md border border-neutral-500 w-full'
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <div className='w-full flex justify-end items-center mt-3'>
                    <button
                        type='submit'
                        className='cursor-pointer bg-custom-cyan py-2 px-4 text-sm rounded-md text-custom-white'
                    >
                        Rename
                    </button>
                </div>
            </form>
        </div>
    )
}

export default RenameModal;
