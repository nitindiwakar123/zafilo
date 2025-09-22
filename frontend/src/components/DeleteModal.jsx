import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { refreshDirectoryData } from '../features/refreshSlice/refreshSlice';
import { setOpenMenu } from '../features/menuContextSlice/menuContextSlice';

function DeleteModal({ ref }) {

    const BASE_URL = "http://localhost";
    const [currentItem, setCurrentItem] = useState({
        id: "",
        name: "",
        type: ""
    });
    const dispatch = useDispatch();
    const menu = useSelector((state) => state.menuContext.openMenu);

    useEffect(() => {
        if (!menu.id || !menu.itemContext || !menu.name) return;

        setCurrentItem({ id: menu.id, name: menu.name, type: menu.itemContext });
    }, [menu])


    async function handleItemDelete() { 
        console.log("Hello handleItemDelete", currentItem);
        if(!currentItem.id) return;
        try {
            const response = await fetch(`${BASE_URL}/${currentItem.type}/${currentItem.id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if(response.ok) {
                dispatch(refreshDirectoryData());
                dispatch(setOpenMenu(null));
            }

        } catch (error) {
            console.log("DeleteModal :: handleItemDelete :: error :: ", error);
        }
    }

    if (!menu.type.startsWith("delete")) return;

    return (
        <div ref={ref} className='w-[400px] py-6 px-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-dark shadow-sm shadow-neutral-400 rounded-2xl overflow-hidden flex flex-col gap-5 border border-custom-cyan'>
            <h4 className='text-2xl font-normal text-gray-900'>Delete forever?</h4>
            <p className='text-sm text-neutral-500'>"{currentItem.name}" will be deleted forever. This can't be undone.</p>
            <div className='w-full flex justify-end items-center gap-2'>
                <button onClick={() => {
                    dispatch(setOpenMenu(null));
                }} className='cursor-pointer py-2 px-4 text-sm rounded-md text-custom-cyan'>Cancel</button>
                <button onClick={handleItemDelete} className='cursor-pointer bg-[#b93730] py-2 px-4 text-sm rounded-md text-custom-white'>Delete forever</button>
            </div>
        </div>
    )
}

export default DeleteModal