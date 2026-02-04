import { useSelector, useDispatch } from 'react-redux';
import { BiLogOutCircle } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import { refreshProfileImage } from "../../features/refreshSlice/refreshSlice";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from 'react-router-dom';
import { setOpenMenu } from '../../features/menuContextSlice/menuContextSlice';
import { useLogout, useUserData } from '../../hooks/userHooks/userHooks';
import { config } from '../../config/config.js';

function ProfileModal({
    ref
}) {

    const authStatus = useSelector((state) => state.auth.status);
    const profileRefresh = useSelector((state) => state.refresh.profileRefresh);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {data} = useUserData();
    const logoutMutation = useLogout(() => {
        dispatch(logout());
    });


    if (authStatus) return (
        <div ref={ref} className='absolute z-40 top-2 right-0 px-8 py-5 shadow-[0_3px_10px_rgb(0,0,0,0.2)] w-[340px] rounded-md overflow-hidden flex flex-col gap-2 bg-menu-gray border border-white/12'>
            <div className='w-full flex items-center gap-5 border-b border-white/10 pb-4'>
                <div className='rounded-full overflow-hidden w-16 h-16'>
                    <img className='w-full h-full object-cover' src={`${config.baseUrl}/user/profile-pic?${profileRefresh}`} alt="defaultProfileImage" />
                </div>
                <div className='flex flex-col justify-center items-start'>
                    <h4 className='text-xl font-inter font-medium text-custom-white'>{data.name}</h4>
                    <p className='font-sans text-text-gray'>{data.email}</p>
                </div>
            </div>
            <div className='flex flex-col justify-center items-start gap-1'>
                <button onClick={() => {
                    navigate("/my-account");
                    dispatch(setOpenMenu(null));
                }} className='w-full flex items-center gap-2 py-3 px-1 cursor-pointer hover:bg-secodary-gray rounded-md transition-colors duration-300 text-text-gray hover:text-custom-white'>
                    <IoSettingsOutline size={20} />
                    <span className='font-sans text-md font-medium'>Account Settings</span>
                </button>

                <button onClick={() => {
                    console.log("hello logout")
                    logoutMutation.mutate();
                }} className='w-full flex items-center gap-2 py-3 px-1 cursor-pointer hover:bg-secodary-gray rounded-md transition-colors duration-300 text-text-gray hover:text-custom-white'>
                    <BiLogOutCircle size={20} />
                    <span className='font-sans text-md font-medium '>Sign  Out</span>
                </button>

            </div>
        </div>
    );
}

export default ProfileModal