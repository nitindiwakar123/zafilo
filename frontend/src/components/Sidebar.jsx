import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IoSettingsOutline, IoHomeOutline, IoNotificationsOutline, IoHomeSharp, IoNotificationsSharp, IoSettingsSharp, IoSearch } from "react-icons/io5";
import { RiHardDrive3Line, RiHardDrive3Fill } from "react-icons/ri";

const navLinks = [
    {
        title: "Home",
        link: "/",
        OutlineIcon: IoHomeOutline,
        FilledIcon: IoHomeSharp
    },
    {
        title: "My Drive",
        link: "/my-drive",
        OutlineIcon: RiHardDrive3Line,
        FilledIcon: RiHardDrive3Fill
    },
    {
        title: "Search",
        link: "/search",
        OutlineIcon: IoSearch,
        FilledIcon: IoSearch
    },
    {
        title: "Notifications",
        link: "/notifications",
        OutlineIcon: IoNotificationsOutline,
        FilledIcon: IoNotificationsSharp

    },
    {
        title: "Settings",
        link: "/settings",
        OutlineIcon: IoSettingsOutline,
        FilledIcon: IoSettingsSharp
    },
]

function Sidebar() {
    const [activeLink, setAcitveLink] = useState("");
    const location = useLocation();

    useEffect(() => {
        // This will update only when the route changes, outside render phase
        setAcitveLink(location.pathname);
    }, [location]);
    return (
        <div className='hidden lg:block w-[300px] h-screen px-4 py-5 relative left-0 inset-y-0 bg-secodary-dark border border-white/12'>
            <ul className='space-y-2'>
                {navLinks.map(({ title, link, OutlineIcon, FilledIcon }) => (
                    <li className={`w-full px-2 py-2 rounded-xl text-md ${activeLink === link ? "text-custom-white bg-secodary-gray" : "text-text-gray"}`} key={title}>
                        <NavLink to={link} className="flex items-center gap-2">
                            {activeLink === link ? <FilledIcon size={18} /> : <OutlineIcon size={18} />}
                            <span className='font-inter'>{title}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
        
    )
}
export default Sidebar;