import React from 'react'
import { useForm } from "react-hook-form";
import { Input } from "./index";
import { TfiEmail } from "react-icons/tfi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { refreshDirectoryData, refreshUserData } from '../features/refreshSlice/refreshSlice';
import { useDispatch } from 'react-redux';

function Login() {

  const BASE_URL = "http://localhost";
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "anurag@gmail.com",
      password: "abcdefgh"
    }
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const SignIn = async (data) => {

    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();
      if (result.error) {
        // If there's an error, set the serverError message
        console.log(result.error)
      } else {
        // On success, navigate to home or any other protected route
        console.log(result);
        navigate("/");
        dispatch(refreshUserData());
        dispatch(refreshDirectoryData());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='w-full space-y-5'>
      <div>
        <h3 className='text-custom-white font-semibold text-xl'>Welcome back!</h3>
      </div>
      <form onSubmit={handleSubmit(SignIn)} className='space-y-3'>
        <Input id='email' type='email' icon={TfiEmail} placeHolder='Enter your email' {...register("email", { required: true })} />
        <Input id='password' type='password' icon={RiLockPasswordLine} placeHolder='Enter your password' {...register("password", { required: true })} />

        <input type='submit' value="Log in" className='mt-4 w-full py-3 bg-custom-cyan text-black cursor-pointer text-sm rounded-md font-semibold' />
      </form>

      <div className='flex items-center justify-between'>
        <span className='w-1/3 h-[1px] bg-white/12'></span>
        <span className='text-[10px] text-text-gray'>OR SIGN IN WITH</span>
        <span className='w-1/3 h-[1px] bg-white/12'></span>
      </div>

      <div className='flex items-center justify-between gap-2'>
        <button className='cursor-pointer py-3 w-1/2 flex justify-center items-center border border-white/12 rounded-md'><FcGoogle /></button>
        <button className='cursor-pointer py-3 w-1/2 flex justify-center items-center border border-white/12 rounded-md text-white'><FaGithub /></button>
      </div>

      <div className='flex items-center justify-center'>
        <p className='text-[10px] text-text-gray'>By Sign in, you agree to our Terms & Service</p>
      </div>
    </div>
  )
}

export default Login