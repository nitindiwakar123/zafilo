import { useSelector, useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { setOpenMenu } from "../features/menuContextSlice/menuContextSlice";
import useFileIcon from '../hooks/useFileIcon';
import { FaFolder } from "react-icons/fa";

import {
    BsFileEarmarkText,
    BsInfoCircle,
    BsCalendar3,
    BsClockHistory,
    BsDatabase,
    BsFiletypeMd,
    BsX
} from "react-icons/bs";

// Utility for bytes to human-readable format
export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Utility for dates
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const ItemDetails = ({ ref }) => {
    const queryClient = useQueryClient();
    const [item, setItem] = useState(null);
    const [itemIcon, setItemIcon] = useState({
        Icon: null,
        color: "text-custom-cyan"
    });
    const currentDirectory = useSelector((state) => state.currentContext.currentDirectoryId);
    const menu = useSelector((state) => state.menuContext.openMenu);
    const dispatch = useDispatch();


    useEffect(() => {
        if (!menu) return;
        const itemId = menu.id;
        const directoryData = queryClient.getQueryData(["directory", currentDirectory]);
        if (menu.itemContext === "file") {
            const item = directoryData?.files?.find(({ _id }) => _id === itemId);
            setItem(item);
            const { icon, color } = useFileIcon(item.name);
            setItemIcon({Icon: icon, color: color});
        } else {
            const item = directoryData?.directories?.find(({ _id }) => _id === itemId);
            setItem(item);
            setItemIcon((prev) => ({...prev, Icon: FaFolder}));
        }
        
    }, [currentDirectory]);

    if (!item || !menu) return null;

    const { name, extension, size, createdAt, updatedAt, openedAt, _id } = item;

    return (
        <div ref={ref} className="w-80 fixed right-0 top-0 h-full bg-secodary-dark border-l border-secodary-gray/30 flex flex-col font-inter">
            {/* Header */}
            <div className="p-3 border-b border-secodary-gray/20 flex justify-between items-center">
                <h2 className="text-custom-white font-semibold flex items-center gap-2">
                    {itemIcon.Icon && <itemIcon.Icon className={`${itemIcon.color ? itemIcon.color : "text-custom-cyan"} text-md`} />}
                    <span className="text-sm">Details</span>
                </h2>
                <button onClick={() => dispatch(setOpenMenu(null))} className="text-text-gray hover:text-custom-white p-1 hover:bg-menu-gray rounded-lg transition-colors">
                    <BsX size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {/* Visual Preview / Large Icon Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 bg-primary-dark rounded-2xl border border-secodary-gray/30 flex items-center justify-center shadow-2xl relative mb-4">
                        {itemIcon.Icon && <itemIcon.Icon className={`${itemIcon.color ? itemIcon.color : "text-custom-cyan"} text-4xl`} />}
                        {extension && <div className="absolute -bottom-2 -right-2 bg-custom-cyan text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {extension.replace('.', '')}
                        </div>}
                    </div>
                    <h3 className="text-custom-white text-center font-medium break-all px-2">
                        {name}
                    </h3>
                </div>

                {/* Metadata Groups */}
                <div className="space-y-6">
                    <section>
                        <p className="text-[11px] font-bold text-text-gray uppercase tracking-widest mb-3 px-1">{menu.itemContext} Properties</p>
                        <div className="bg-primary-dark/50 rounded-xl border border-secodary-gray/10 overflow-hidden">
                            <DetailRow icon={<BsDatabase />} label="Size" value={formatBytes(size)} />
                            {extension && <DetailRow icon={<BsFileEarmarkText />} label="Type" value={`${extension.toUpperCase()} File`} />}
                            <DetailRow icon={<BsInfoCircle />} label="ID" value={_id.slice(-8)} isCode />
                        </div>
                    </section>

                    <section>
                        <p className="text-[11px] font-bold text-text-gray uppercase tracking-widest mb-3 px-1">Timeline</p>
                        <div className="bg-primary-dark/50 rounded-xl border border-secodary-gray/10 overflow-hidden">
                            <DetailRow icon={<BsCalendar3 />} label="Created" value={formatDate(createdAt)} />
                            <DetailRow icon={<BsClockHistory />} label="Modified" value={formatDate(updatedAt)} />
                            <DetailRow icon={<BsClockHistory />} label="Last Opened" value={formatDate(openedAt)} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

// Reusable Row Component for consistency
const DetailRow = ({ icon, label, value, isCode }) => (
    <div className="flex items-center gap-3 p-3 border-b border-secodary-gray/10 last:border-0 hover:bg-file-hover/40 transition-colors">
        <div className="text-text-gray/60">{icon}</div>
        <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-text-gray uppercase font-roboto leading-none mb-1">{label}</span>
            <span className={`text-sm text-custom-white truncate ${isCode ? 'font-mono text-xs text-custom-cyan/80' : ''}`}>
                {value}
            </span>
        </div>
    </div>
);

export default ItemDetails;