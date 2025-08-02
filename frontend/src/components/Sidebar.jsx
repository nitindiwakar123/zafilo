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
        <div className='w-[220px] h-screen px-2 py-5 max-w-[200px] relative left-0 inset-y-0 bg-[#F6F6F6] border-r border-gray-300'>
            <ul className='space-y-2'>
                {navLinks.map(({ title, link, OutlineIcon, FilledIcon }) => (
                    <li className={`w-full px-2 py-2 rounded-xl text-md ${activeLink === link ? "text-custom-cyan bg-[#E5EAF7]" : "text-neutral-600"}`} key={title}>
                        <NavLink to={link} className="flex items-center gap-2">
                            {activeLink === link ? <FilledIcon size={18} /> : <OutlineIcon size={18} />}
                            <span className='font-inter'>{title}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
            {console.log(activeLink)}
        </div>
        
    )
}
export default Sidebar;