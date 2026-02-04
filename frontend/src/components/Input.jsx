import { useState, useEffect } from 'react';
import { BiShow, BiHide } from "react-icons/bi";
import { useSendOtp } from '../hooks/userHooks/userHooks';
import { useLocation } from 'react-router-dom';

function Input({
    id = "",
    type = "text",
    icon: Icon,
    placeHolder = "",
    ...props
}) {

    const [inputType, setInputType] = useState(type);
    const [text, setText] = useState("");
    const { pathname } = useLocation();
    const sendOtpMutation = useSendOtp(() => {

    });

    return (
        <div className={`w-full py-3 px-3 flex items-center justify-between gap-2 border border-white/12 rounded-md text-text-gray`}>
            <label htmlFor={id}>{Icon && <Icon className="text-text-gray" />}</label>
            <input
                className='w-full bg-transparent focus:bg-transparent border-none outline-none text-sm' value={text}
                onInput={(e) => setText(e.target.value)}
                type={inputType}
                id={id}
                placeholder={placeHolder}
                {...props} />

        </div>
    )
}

export default Input