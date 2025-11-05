import { Input } from "./index";
import { FaRegCircleUser } from "react-icons/fa6";
import { TfiEmail } from "react-icons/tfi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import { useRegister } from "../hooks/userHooks/userHooks";
import { useNavigate } from "react-router-dom";

function Signup() {

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: "Narendra Modi",
            email: "modi@gmail.com",
            password: "abcdefgh"
        }
    });
    const navigate = useNavigate();

    const signUpMutation = useRegister(() => {
        navigate("/");
    });
    
    

    return (
        <div className='w-full space-y-5'>
            <div>
                <h3 className='text-custom-white font-semibold text-xl'>Create an account</h3>
            </div>
            <form onSubmit={handleSubmit()} className='space-y-3'>
                <Input
                    id='name'
                    icon={FaRegCircleUser}
                    placeHolder='Full name'
                    {...register("name", { required: true })}
                />

                <Input
                    id='email'
                    type='email'
                    icon={TfiEmail}
                    placeHolder='Enter your email'
                    {...register("email", { required: true })}
                />

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

            <div className='flex items-center justify-between gap-2'>
                <button className='py-3 w-1/2 flex justify-center items-center border border-white/12 rounded-md'><FcGoogle /></button>
                <button className='py-3 w-1/2 flex justify-center items-center border border-white/12 rounded-md text-white'><FaGithub /></button>
            </div>

            <div className='flex items-center justify-center'>
                <p className='text-[10px] text-text-gray'>By creating an account, you agree to our Terms & Service</p>
            </div>
        </div>
    )
}


export default Signup