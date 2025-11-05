import React, { useState } from 'react';
import { BiShow, BiHide } from "react-icons/bi";

function Input({
    id = "",
    type = "text",
    icon: Icon,
    placeHolder = "",
    ...props
}) {

    const [inputType, setInputType] = useState(type);

    return (
        <div className={`w-full py-3 px-3 flex items-center justify-between gap-2 border border-white/12 rounded-md text-text-gray`}>
            <label htmlFor={id}>{Icon && <Icon className="text-text-gray" />}</label>
            <input className='w-full bg-transparent focus:bg-transparent border-none outline-none text-sm' type={inputType} id={id} placeholder={placeHolder} {...props} />
            {
                type === "password" && <button
                    className='cursor-pointer'
                    onClick={() => {
                        if (inputType === "password") {
                            setInputType("text");
                        } else {
                            setInputType("password");
                        }
                    }}
                >
                    {inputType === "password" ? <BiShow size={18} /> : <BiHide size={18} />}
                </button>
            }
        </div>
    )
}

export default Input