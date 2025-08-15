import React, { useEffect } from 'react'
import { MdAttachEmail, MdOutlineAttachEmail } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux';
import { BiLogOutCircle } from 'react-icons/bi';
import { refreshUserData, refreshDirectoryData } from "../../features/refreshSlice/refreshSlice";

function ProfileModal({
    ref
}) {

    const BASE_URL = "http://localhost";
    const userData = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();

    async function handleLogout() {
        try {
            const response = await fetch(`${BASE_URL}/user/logout`, {
                method: "POST",
                credentials: 'include'
            });

            if(response.ok) {
                dispatch(refreshUserData());
                dispatch(refreshDirectoryData());
            }
        } catch (error) {
            console.log("ProfileModal :: handleLogout :: error :: ", error);
        }
    }

    if (userData) return (
        <div ref={ref} className='absolute top-2 right-0 shadow-sm shadow-neutral-400 w-[200px] rounded-md overflow-hidden flex flex-col bg-bg-custom-gray'>
            <div className='flex cursor-pointer hover:text-custom-cyan hover:bg-[#E5EAF7] text-neutral-600 border-b border-b-neutral-300 items-center justify-start gap-2 py-3 transition-colors duration-300 px-2'>

                <FaRegCircleUser size={18} />
                <span className='text-[12px] font-inter'>{userData ? userData.name : ""}</span>
            </div>
            <div className='flex cursor-pointer hover:text-custom-cyan hover:bg-[#E5EAF7] text-neutral-600 justify-start gap-2 items-center py-3 transition-colors duration-300 px-2 border-b border-b-neutral-300'>
                <MdOutlineAttachEmail size={18} />
                <span className='text-[12px] font-inter'>{userData ? userData.email : ""}</span>
            </div>
            <button className='flex cursor-pointer hover:text-custom-cyan hover:bg-[#E5EAF7] text-neutral-600 justify-start gap-2 items-center py-3 transition-colors duration-300 px-2' onClick={handleLogout}>
                <BiLogOutCircle size={18} />
                <span className='text-[12px] font-inter'>Logout</span>
            </button>
        </div>
    );
}

export default ProfileModal