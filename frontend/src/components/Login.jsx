import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./index";
import { TfiEmail } from "react-icons/tfi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useLogin, useLoginVerifyOtp, useGoogleAuth } from "../hooks/userHooks/userHooks";
import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

function Login() {

  const [otpStep, setOtpStep] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "anurag@gmail.com",
      password: "abcdefgh"
    }
  });
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const verifyOtpMutation = useLoginVerifyOtp(() => {
    navigate("/");
  });
  const googleAuthMutation = useGoogleAuth(() => {
    navigate("/");
  })

  const SignIn = async (data) => {
    console.log("Hello SignIN!");
    try {
      const result = await loginMutation.mutateAsync({ formData: data });
      setOtpStep(true);
    }
    catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='w-full space-y-5'>
      <div>
        <h3 className='text-custom-white font-semibold text-xl'>{otpStep ? "OTP is Sent!" : "Welcome back!"}</h3>
      </div>
      <form onSubmit={handleSubmit(SignIn)}>
        {!otpStep && <div className='space-y-3'>
          <Input id='email' type='email' icon={TfiEmail} placeHolder='Enter your email' {...register("email", { required: true })} />
          <Input id='password' type='password' icon={RiLockPasswordLine} placeHolder='Enter your password' {...register("password", { required: true })} />

          <input type='submit' value="Log in" className='mt-4 w-full py-3 bg-custom-cyan text-black cursor-pointer text-sm rounded-md font-semibold' />

          <p className="text-xs text-center text-text-gray">Don't have an account? <Link to="/signup" className="text-blue-400">Signup</Link></p>

          <div className='flex items-center justify-between'>
            <span className='w-1/3 h-[1px] bg-white/12'></span>
            <span className='text-[10px] text-text-gray'>OR SIGN IN WITH</span>
            <span className='w-1/3 h-[1px] bg-white/12'></span>
          </div>
        </div>}

        {otpStep &&
          <div>
            <Input id='email' type='text' icon={FaClock} placeHolder='4-digit OTP' {...register("otp", { required: true })} />

            <button
              onClick={handleSubmit(verifyOtpMutation.mutate)}
              className='mt-4 w-full py-3 bg-custom-cyan text-black cursor-pointer text-sm rounded-md font-semibold' >Send OTP</button>

          </div>
        }
      </form>

      <div className='flex flex-col items-center gap-2'>
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
        <button className='cursor-pointer py-3 w-1/2 flex justify-center items-center border border-white/12 rounded-md text-white'><FaGithub /></button>
      </div>
      <div className='flex items-center justify-center'>
        <p className='text-[10px] text-text-gray'>By Sign in, you agree to our Terms & Service</p>
      </div>
    </div>
  )
}

export default Login;