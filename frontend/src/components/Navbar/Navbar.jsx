import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IoHomeSharp, IoNotificationsSharp, IoSettingsSharp, IoSearch } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiHardDrive3Fill } from "react-icons/ri";
import { FaRegPlusSquare } from "react-icons/fa";
import { ContextMenu, ProfileModal } from "../index";
import { defaultProfileImage } from "../../assets";
import { useSelector } from 'react-redux';


function Navbar() {

    const location = useLocation();
    const [currentPage, setCurrentPage] = useState({
        title: "Home",
        icon: IoHomeSharp
    });
    const [showContextMenu, setShowContextMenu] = useState(null);
    const [username, setUsername] = useState("Guest");
    const userData = useSelector((state) => state.auth.userData);
    const newButtonRef = useRef();
    const profileButtonRef = useRef();
    const currentMenuRef = useRef();

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
    }, [location.pathname])

    function handleContextMenu(e) {
        console.log("Hello function!");
        if (e.currentTarget === newButtonRef.current) {
            // const { bottom, left } = newButtonRef.current.getBoundingClientRect();
            // console.log({ bottom, left });
            // setMenuPosition({
            //     top: Math.round(bottom + window.scrollY),
            //     left: Math.round(left + window.scrollX)
            // });
            setShowContextMenu("create");
        } else if (e.currentTarget === profileButtonRef.current) {
            // const { top, left } = profileButtonRef.current.getBoundingClientRect();
            // setMenuPosition({
            //     top: Math.ceil(top + window.scrollY),
            //     left: Math.ceil(left + window.scrollX)
            // });
            setShowContextMenu("profile");
        }
    }

    useEffect(() => {
        function handleContextMenu(e) {
            if(!currentMenuRef.current) return;
            if(e.target !== currentMenuRef.current && !currentMenuRef.current.contains(e.target)) {
                setShowContextMenu("");
            }
        }

        window.addEventListener('mousedown', handleContextMenu);

        return () => {
            window.removeEventListener('mousedown', handleContextMenu);
        }
    }, []);

    useEffect(() => {
        if (userData) {
            const fullname = userData.name.trim().split(" ");
            setUsername(fullname[0]);
        }

    }, [userData])



    return (
        <div className='w-full flex justify-between items-center py-2 px-10 font-inter relative'>

            {/* {showContextMenu && userData? <ProfileModal name={userData.name} email={userData.email} />: null} */}
            <div className='flex gap-2 items-center text-custom-cyan relative'>
                <currentPage.icon />
                <p className='text-gray-900 relative top-[2px] text-sm font-semibold'>{currentPage.title}</p>
            </div>
            <div className='flex gap-5 items-center'>
                {showContextMenu && <ContextMenu
                    ref={currentMenuRef}
                    type={showContextMenu}
                />}
                <button
                    ref={newButtonRef}
                    onClick={handleContextMenu}
                    className='flex gap-2 cursor-pointer items-center bg-custom-cyan text-custom-white py-1 px-3 rounded-md'>
                    <FaRegPlusSquare size={20} />
                    <span className='text-xs font-medium'>New</span>
                </button>
                <div className='text-gray-900 relative flex items-center gap-1 text-sm font-semibold'>
                    <div className='w-8 h-8 overflow-hidden rounded-full mr-2'>
                        <img className='w-full h-full object-cover' src={defaultProfileImage} alt="profile" />

                    </div>
                    <span className="text-gray-900 relative top-[2px] text-sm font-semibold">{username}</span>
                    <button
                        ref={profileButtonRef}
                        onClick={handleContextMenu}
                        className='cursor-pointer text-gray-900 rounded-full hover:bg-neutral-200 transition-colors duration-300 flex items-center relative'><RiArrowDropDownLine size={25} className='relative top-[2px]' /></button>
                </div>
            </div>
        </div>
    )
}

export default Navbar