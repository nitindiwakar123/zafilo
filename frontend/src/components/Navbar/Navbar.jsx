import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IoHomeSharp, IoNotificationsSharp, IoSettingsSharp, IoSearch } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiHardDrive3Fill } from "react-icons/ri";
import { FaRegPlusSquare } from "react-icons/fa";
import { ContextMenu, ProfileModal } from "../index";
import { defaultProfileImage } from "../../assets";
import { useSelector, useDispatch } from 'react-redux';
import { setOpenMenu } from "../../features/menuContextSlice/menuContextSlice";

function Navbar() {

    const location = useLocation();
    const [currentPage, setCurrentPage] = useState({
        title: "Home",
        icon: IoHomeSharp
    });
    const [showContextMenu, setShowContextMenu] = useState(null);
    const [username, setUsername] = useState("Guest");
    const userData = useSelector((state) => state.auth.userData);
    const userRefresh = useSelector((state) => state.refresh.userRefresh);
    const newButtonRef = useRef();
    const currentMenuRef = useRef();
    const profileButtonRef = useRef();
    const dispatch = useDispatch();


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

    useEffect(() => {
        if(!userData) setUsername("");
        if (userData) {
            const fullname = userData.name.trim().split(" ");
            setUsername(fullname[0]);
        }

    }, [userData]);


    function handleContextMenu(e) {
        if (e.currentTarget === newButtonRef.current) {
            setShowContextMenu("create");
        } else if (e.currentTarget === profileButtonRef.current) {
            setShowContextMenu("profile");
        }
    }





    return (
        <div className='w-full flex justify-between items-center py-2 px-10 font-inter relative'>

            <div className='flex gap-2 items-center text-custom-cyan relative'>
                <currentPage.icon />
                <p className='text-gray-900 relative top-[2px] text-sm font-semibold'>{currentPage.title}</p>
            </div>

            <div className='flex gap-5 items-center'>

                <button
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.round(rect.left + window.scrollX);
                        const y = Math.round(rect.bottom + window.scrollY);
                        dispatch(setOpenMenu({ type: "create", x, y }));
                    }}
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
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = Math.round(rect.left + window.scrollX);
                            const y = Math.round(rect.bottom + window.scrollY);
                            dispatch(setOpenMenu({ type: "profile", x, y }));
                        }}
                        className='cursor-pointer text-gray-900 rounded-full hover:bg-neutral-200 transition-colors duration-300 flex items-center relative'><RiArrowDropDownLine size={25} className='relative top-[2px]' /></button>
                </div>
            </div>
        </div>
    )
}

export default Navbar