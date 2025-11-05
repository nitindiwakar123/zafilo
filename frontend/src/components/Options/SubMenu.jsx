import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';

function SubMenu({
    childrens=[]
}) {

    // const menu = useSelector((state) => state.menuContext.openMenu);

    useEffect(() => {
      console.log("Submenu rendered!");
    }, [])
    

    return (
        <div
            className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] w-[250px] rounded-md overflow-hidden flex flex-col bg-[#242321] border border-white/12"
        >
            {childrens?.map((children, idx) => (
                <button key={idx} onClick={children.eventHandler}>
                    <children.icon />
                    <span>{children.text}</span>
                </button>
            ))}
        </div>
    )
}

export default SubMenu