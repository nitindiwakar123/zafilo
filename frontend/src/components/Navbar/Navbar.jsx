import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IoHomeSharp, IoNotificationsSharp, IoSettingsSharp, IoSearch } from "react-icons/io5";
import { RiHardDrive3Fill } from "react-icons/ri";
import { FaRegPlusSquare } from "react-icons/fa";
import { defaultProfileImage } from "../../assets";
import { useSelector, useDispatch } from 'react-redux';
import { setOpenMenu } from "../../features/menuContextSlice/menuContextSlice";
import { FaBars } from "react-icons/fa6";

function Navbar() {

    const location = useLocation();
    const [currentPage, setCurrentPage] = useState({
        title: "Home",
        icon: IoHomeSharp
    });
    const [username, setUsername] = useState("Guest");
    const userData = useSelector((state) => state.auth.userData);
    const userRefresh = useSelector((state) => state.refresh.userRefresh);
    const profileRefresh = useSelector((state) => state.refresh.profileRefresh);
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
        if (!userData) setUsername("");
        if (userData) {
            const fullname = userData.name.trim().split(" ");
            setUsername(fullname[0]);
        }

    }, [userData]);

    return (
        <div className='w-full flex justify-between items-center pt-4 pb-1 px-10 font-inter relative'>

            <div className='flex items-center gap-4'>
                <button className='lg:hidden text-text-gray hover:bg-secodary-gray py-2 px-2 rounded-md'>
                    <FaBars size={16} />
                </button>

                <div className='flex gap-2 items-center text-custom-cyan relative'>
                    <currentPage.icon />
                    <p className='text-custom-white relative top-[2px] text-sm font-semibold'>{currentPage.title}</p>
                </div>
            </div>

            <div className='flex gap-5 items-center'>

                <button
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.round(rect.left + window.scrollX);
                        const y = Math.round(rect.bottom + window.scrollY);
                        dispatch(setOpenMenu({ type: "create", x, y }));
                    }}
                    className='flex gap-2 cursor-pointer items-center bg-custom-cyan text-primary-dark py-1.5 px-5 rounded-md'>
                    <FaRegPlusSquare size={20} />
                    <span className='text-sm font-semibold'>New</span>
                </button>
                <div className='text-gray-900 relative flex items-center gap-2 text-sm font-semibold'>
                    <span className="text-custom-white relative top-[2px] text-sm font-semibold">{username}</span>
                    <button className='w-8 h-8 overflow-hidden rounded-full mr-2 cursor-pointer'
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = Math.round(rect.left + window.scrollX);
                            const y = Math.round(rect.bottom + window.scrollY);
                            dispatch(setOpenMenu({ type: "profile", x, y }));
                        }}
                    >
                        <img className='w-full h-full object-cover' src={userData ? `http://localhost/user/profile-pic?${profileRefresh}` : defaultProfileImage} alt="profile" />

                    </button>

                </div>
            </div>
        </div>
    )
}

export default Navbar;