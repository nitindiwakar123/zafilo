import React, { useState } from 'react';
import { Login, Signup } from "../components";

function Auth() {

  const [activeModal, setActiveModal] = useState("signin")

  return (
    <div className='w-full flex justify-center items-center'>
      <div className='w-[400px] flex flex-col items-start gap-5 bg-[#1A1A1A] border border-white/12 rounded-3xl py-5 px-5'>
        <div className='bg-black/50 flex items-center gap-2 rounded-4xl text-text-gray py-1 px-1'>
          <button
            className={`outline-none py-2 px-4 text-sm rounded-3xl cursor-pointer transition-all duration-300 ${activeModal === "signin" && "text-custom-white bg-secodary-gray"}`}
            onClick={() => setActiveModal("signin")}
          >Sign in</button>
          <button
            className={`outline-none py-2 px-4 text-sm rounded-3xl cursor-pointer transition-all duration-300 ${activeModal === "signup" && "text-custom-white bg-secodary-gray"}`}
            onClick={() => setActiveModal("signup")}
          >Sign up</button>
        </div>

        {activeModal === "signin" && <Login />}
        {activeModal === "signup" && <Signup />}
      </div>

    </div>
  )
}

export default Auth