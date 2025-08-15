import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshDirectoryData } from "../features/refreshSlice/refreshSlice";
import { setOpenMenu } from '../features/menuContextSlice/menuContextSlice';

function RenameModal({ ref }) {

    const BASE_URL = "http://localhost";
    const [currentItemId, setCurrentItemId] = useState("");
    const [currentItem, setCurrentItem] = useState(null);
    const [newName, setNewName] = useState("");
    const dispatch = useDispatch();
    const menu = useSelector((state) => state.menuContext.openMenu);


    async function handleItemRename() {
        if (!currentItemId || !currentItem) return;
        console.log({ currentItemId, currentItem });
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
            setNewName(menu.name);
            
        }
    }, [menu])


    return (
        <div ref={ref} className='w-[400px] py-6 px-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-custom-gray shadow-sm shadow-neutral-400 rounded-2xl overflow-hidden flex flex-col gap-5 border border-custom-cyan'>
            <h4 className='text-2xl font-normal text-gray-900'>Rename</h4>
            <input className='text-sm p-2 text-neutral-800 rounded-md border border-neutral-500' type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <div className='w-full flex justify-end items-center'>
                <button onClick={handleItemRename} className='cursor-pointer bg-custom-cyan py-2 px-4 text-sm rounded-md text-custom-white'>Rename</button>
            </div>
        </div>
    )
}

export default RenameModal