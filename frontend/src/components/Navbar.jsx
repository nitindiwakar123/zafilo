import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IoHomeSharp, IoNotificationsSharp, IoSettingsSharp, IoSearch } from "react-icons/io5";
import { RiHardDrive3Fill } from "react-icons/ri";
import { FaRegPlusSquare } from "react-icons/fa";

function Navbar() {

    const location = useLocation();
    const [currentPage, setCurrentPage] = useState({
        title: "Home",
        icon: IoHomeSharp
    });

    useEffect(() => {
        switch (location.pathname) {
            case "/":
                setCurrentPage({ title: "Home", icon: IoHomeSharp });
                break;

            case "/my-drive":
                setCurrentPage({ title: "My Drive", icon: RiHardDrive3Fill });
                break;

            case "/search":
                setCurrentPage({ title: "Home", icon: IoSearch });
                break;

            case "/notifications":
                setCurrentPage({ title: "Notifications", icon: IoNotificationsSharp });
                break;

            case "/settings":
                setCurrentPage({ title: "Settings", icon: IoSettingsSharp });
                break;

            default:
                setCurrentPage({
                    title: "Home",
                    icon: IoHomeSharp
                });
                break;
        }
    }, [])

    return (
        <div className='w-full flex justify-between items-center py-2 px-4 font-inter'>
            <div className='flex gap-2 items-center text-custom-cyan'>
                <currentPage.icon />
                <p className='text-gray-900 text-sm font-semibold'>{currentPage.title}</p>
            </div>
            <div className='flex gap-2 items-center'>
                <button className='flex gap-2 cursor-pointer items-center bg-custom-cyan text-custom-white py-1 px-3 rounded-md'>
                    <FaRegPlusSquare size={20} />
                    <span className='text-xs font-medium'>New</span>
                </button>
                <button className='text-gray-900 text-sm font-semibold'>Profile</button>
            </div>
        </div>
    )
}

export default Navbar