import { Login } from "../components";

function SignIn() {


  return (
    <div className='w-full flex justify-center items-center'>
      <div className='w-[400px] flex flex-col items-start gap-5 bg-[#1A1A1A] border border-white/12 rounded-3xl py-5 px-5'>
        <Login />
      </div>
    </div>
  )
}

export default SignIn;