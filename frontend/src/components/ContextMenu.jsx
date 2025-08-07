import React from 'react';
import { CreateMenu, ProfileModal } from "./index";


function ContextMenu({
    ref,
    type = "",
}) {
    
    return (
        <>
            {type === "create" && <CreateMenu ref={ref} />}
            {type === "profile" && <ProfileModal ref={ref} />}
        </>
    )
}

export default ContextMenu;