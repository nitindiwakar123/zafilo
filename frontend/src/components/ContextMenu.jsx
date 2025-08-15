import React, { useRef, useEffect, useState } from 'react';
import { CreateMenu, ProfileModal, Options, RenameModal, DeleteModal } from "./index";
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import { setOpenMenu } from '../features/menuContextSlice/menuContextSlice';

function ContextMenu() {
    const currentMenuRef = useRef();
    const [currentContext, setCurrentContext] = useState("");
    const menu = useSelector((state) => state.menuContext.openMenu);
    const dispatch = useDispatch();

    useEffect(() => {
        function handleContextMenu(e) {
            if (!currentMenuRef.current) return;
            if (e.target !== currentMenuRef.current && !currentMenuRef.current.contains(e.target)) {
                setCurrentContext("");
                // dispatch(setOpenMenu(null));
            }
        }

        window.addEventListener('mousedown', handleContextMenu);

        return () => {
            window.removeEventListener('mousedown', handleContextMenu);
        }
    }, []);

    useEffect(() => {
        if (menu) {
            setCurrentContext(menu.type);
        }
    }, [menu])

    if (!currentContext || !menu) return null;

    return createPortal(
        <div
            style={{
                position: "absolute",
                top: menu.y,
                left: menu.x,
                zIndex: 1000
            }}
        >

            {currentContext === "create" && <CreateMenu ref={currentMenuRef} />}
            {currentContext === "profile" && <ProfileModal ref={currentMenuRef} />}
            {currentContext?.startsWith("itemOption:") && <Options ref={currentMenuRef} />}
            {currentContext?.startsWith("rename:") && <RenameModal ref={currentMenuRef} />}
            {currentContext?.startsWith("delete:") && <DeleteModal ref={currentMenuRef} />}
        </div>,
        document.body
    )
}

export default ContextMenu;