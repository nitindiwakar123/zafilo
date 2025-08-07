import React, {useEffect} from 'react'
import { MdAttachEmail, MdOutlineAttachEmail } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector } from 'react-redux';

function ProfileModal({
    ref
}) {

    const userData = useSelector((state) => state.auth.userData);
    if (userData) return (
        <div ref={ref} className='absolute z-50 top-11 right-5 shadow-sm shadow-neutral-400 w-[200px] rounded-md overflow-hidden flex flex-col bg-bg-custom-gray'>
            <div className='flex cursor-pointer hover:text-custom-cyan hover:bg-[#E5EAF7] text-neutral-600 border-b border-b-neutral-300 items-center justify-start gap-2 py-3 transition-colors duration-300 px-2'>

                <FaRegCircleUser size={18} />
                <span className='text-[12px] font-inter'>{userData? userData.name: ""}</span>
            </div>
            <div className='flex cursor-pointer hover:text-custom-cyan hover:bg-[#E5EAF7] text-neutral-600 justify-start gap-2 items-center py-3 transition-colors duration-300 px-2'>
                <MdOutlineAttachEmail size={18} />
                <span className='text-[12px] font-inter'>{userData? userData.email: ""}</span>
            </div>
        </div>
    );
}

export default ProfileModal