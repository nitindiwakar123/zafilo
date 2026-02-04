import { Input } from "./index";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import { useRegister, useRegisterVerifyOtp, useGoogleAuth } from "../hooks/userHooks/userHooks";
import { useNavigate } from "react-router-dom";
import { useSendOtp } from '../hooks/userHooks/userHooks';
import { useRef, useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";


function Signup() {

    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [isOtpField, setIsOtpField] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [otp, setOtp] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const emailInputRef = useRef();
    const signUpMutation = useRegister();
    const sendOtpMutation = useSendOtp(() => {
        setIsOtpField(true);
    });
    const verifyOtpMutation = useRegisterVerifyOtp(() => {
        setIsEmailVerified(true);
        setIsOtpField(false);
    });

    const googleAuthMutation = useGoogleAuth(() => {
        navigate("/");
    })

    async function signUp(data) {
        console.log("SIGNED UP CALLED!");
        if (!isEmailVerified) {
            alert("Verify your email first!");
            return;
        };
        try {
            const result = await signUpMutation.mutateAsync({ formData: { ...data, otp } });
            console.log({ result });
            if (result.success) {
                console.log({ success: result.data.success });
                navigate("/");
            }
        } catch (error) {
            console.log({ error });
        }
    }

    return (
        <div className='w-full space-y-5'>
            <div>
                <h3 className='text-custom-white font-semibold text-xl'>Create an account</h3>
            </div>
            <form onSubmit={handleSubmit(signUp)} className='space-y-3'>
                <Input
                    id='name'
                    icon={FaRegCircleUser}
                    placeHolder='Full name'
                    {...register("name", { required: true })}
                />

                <InputWithButton
                    ref={emailInputRef}
                    id="email"
                    type="email"
                    icon={TfiEmail}
                    placeHolder="Enter your email"
                    onBtnClick={() => sendOtpMutation.mutate({ email: inputValue })}
                    {...register("email", { required: true })}
                    btnTxt={isEmailVerified ? "Verified" : "Send Otp"}
                    onInput={(e) => setInputValue(e.target.value)}
                />

                {isOtpField &&
                    <InputWithButton
                        id="otp"
                        type="text"
                        placeHolder="Enter Otp"
                        icon={FaClock}
                        onBtnClick={() => verifyOtpMutation.mutate({ email: inputValue, otp })}
                        onInput={(e) => setOtp(e.target.value)}
                        btnTxt="Verify"
                    />
                }

                <Input
                    id='password'
                    type='password'
                    icon={RiLockPasswordLine}
                    placeHolder='Enter your password'
                    {...register("password", { required: true })}
                />

                <button type='submit' className='mt-4 w-full py-3 bg-custom-cyan text-black cursor-pointer text-sm rounded-md font-semibold'>Create an account</button>
            </form>

            <div className='flex items-center justify-between'>
                <span className='w-1/3 h-[1px] bg-white/12'></span>
                <span className='text-[10px] text-text-gray'>OR SIGN UP WITH</span>
                <span className='w-1/3 h-[1px] bg-white/12'></span>
            </div>

            <div className='flex flex-col items-center justify-between gap-2'>
                <div className="border border-white/12 overflow-hidden h-10 rounded-md">
                    <GoogleLogin
                        theme="filled_black"
                        width={350}
                        onSuccess={credentialResponse => {
                            const idToken = credentialResponse.credential;
                            googleAuthMutation.mutate({ idToken });
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        onNonOAuthError={(response) => {
                            console.log(`Oops something went wrong! ${response}`)
                        }}
                        useOneTap
                        use_fedcm_for_prompt
                    />;
                </div>
                <button className='py-3 w-1/2 flex justify-center items-center border border-white/12 rounded-md text-white'><FaGithub /></button>
            </div>

            <div className='flex items-center justify-center'>
                <p className='text-[10px] text-text-gray'>By creating an account, you agree to our Terms & Service</p>
            </div>
        </div>
    )
}


function InputWithButton({
    ref,
    id = "",
    type = "",
    placeHolder = "",
    icon: Icon,
    onBtnClick,
    btnTxt = "",
    ...props
}) {


    return (
        <div className={`w-full py-3 px-3 flex items-center justify-between gap-2 border border-white/12 rounded-md text-text-gray`}>
            <label htmlFor="email">{Icon && <Icon className="text-text-gray" />}</label>
            <input
                ref={ref}
                className='w-full bg-transparent focus:bg-transparent border-none outline-none text-sm'
                type={type}
                id={id}
                placeholder={placeHolder}
                {...props} />

            <button
                type="button"
                onClick={onBtnClick}
                className="w-20 text-[10px] rounded-md cursor-pointer bg-custom-cyan py-1 px-2 text-black">{btnTxt}</button>
        </div>
    )
}

export default Signup