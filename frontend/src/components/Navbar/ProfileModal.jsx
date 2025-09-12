import React, { useEffect } from 'react'
import { MdAttachEmail, MdOutlineAttachEmail } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux';
import { BiLogOutCircle } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import { refreshUserData, refreshDirectoryData, refreshProfileImage } from "../../features/refreshSlice/refreshSlice";
import { useNavigate } from 'react-router-dom';
import { setOpenMenu } from '../../features/menuContextSlice/menuContextSlice';

function ProfileModal({
    ref
}) {

    const BASE_URL = "http://localhost";
    const userData = useSelector((state) => state.auth.userData);
    const profileRefresh = useSelector((state) => state.refresh.profileRefresh);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            const response = await fetch(`${BASE_URL}/user/logout`, {
                method: "POST",
                credentials: 'include'
            });

            if (response.ok) {
                dispatch(refreshUserData());
                dispatch(refreshDirectoryData());
                dispatch(refreshProfileImage());
            }
        } catch (error) {
            console.log("ProfileModal :: handleLogout :: error :: ", error);
        }
    }

    if (userData) return (
        <div ref={ref} className='absolute top-2 right-0 px-8 py-5 shadow-sm shadow-neutral-400 w-[340px] rounded-md overflow-hidden flex flex-col gap-2 bg-bg-custom-gray'>
            <div className='w-full flex items-center gap-5 border-b border-gray-300 pb-4'>
                <div className='rounded-full overflow-hidden w-16 h-16'>
                    <img className='w-full h-full object-cover' src={`http://localhost/user/profile-pic?${profileRefresh}`} alt="defaultProfileImage" />
                </div>
                <div className='flex flex-col justify-center items-start'>
                    <h4 className='text-xl font-inter font-medium text-gray-900'>{userData.name}</h4>
                    <p className='text-gray-400 font-sans'>{userData.email}</p>
                </div>
            </div>
            <div className='flex flex-col justify-center items-start gap-1'>
                <button onClick={() => {
                    navigate("/my-account");
                    dispatch(setOpenMenu(null));
                }} className='w-full flex items-center gap-2 py-3 px-1 cursor-pointer hover:bg-custom-bg-gray2 rounded-md transition-colors duration-300 text-gray-600'>
                    <IoSettingsOutline size={20} />
                    <span className='font-sans text-md font-medium'>Account Settings</span>
                </button>

                <button onClick={handleLogout} className='w-full flex items-center gap-2 py-3 px-1 cursor-pointer hover:bg-custom-bg-gray2 rounded-md transition-colors duration-300 text-gray-600'>
                    <BiLogOutCircle size={20} />
                    <span className='font-sans text-md font-medium '>Sign  Out</span>
                </button>

            </div>
        </div>
    );
}

export default ProfileModal