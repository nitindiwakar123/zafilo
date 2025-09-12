import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../components';
import { useDispatch } from 'react-redux';
import { refreshProfileImage } from '../features/refreshSlice/refreshSlice';


function Account() {
    const BASE_URL = "http://localhost";
    const userData = useSelector((state) => state.auth.userData);
    const profileRefresh = useSelector((state) => state.refresh.profileRefresh);
    const dispatch = useDispatch();

    async function handleFileUpload(e) {
        const file = e.target.files[0];
        try {
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.open("PATCH", `${BASE_URL}/user/profile-pic`, true);
            xhr.setRequestHeader("filename", file.name);
            xhr.send(file);

            xhr.addEventListener('load', (response) => {
                console.log(response.loaded);
                dispatch(refreshProfileImage());
            });


        } catch (error) {
            console.log("Account.jsx :: error :: ", error);
        }
    }

    if (!userData) return;

    return (
        <div className='w-full mx-auto rounded-2xl bg-custom-white space-y-6 py-5'>
            <div className='px-5'>
                <h1 className="text-2xl capitalize">Account</h1>
            </div>
            <div className='w-2/3 mx-auto flex flex-col space-y-5 bg-custom-white py-5 px-5 rounded-2xl border border-gray-300'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                        <div className='rounded-full overflow-hidden w-20 h-20 border-2 border-gray-900'>
                            <img className='w-full h-full object-cover' src={`http://localhost/user/profile-pic?${profileRefresh}`} alt="profile-image" />
                        </div>
                        <div className='flex flex-col justify-center gap-2'>
                            <h4>{userData.name}</h4>
                            <p>{userData.email}</p>
                        </div>
                    </div>
                    <Button onClick={() => document.getElementById("profile").click()} className='border border-gray-500 rounded-md font-medium text-gray-900'>
                        <input className='hidden' type="file" name="File" id="profile" onInput={handleFileUpload} />
                        <span className='text-[12px] font-inter'>Change pic</span>
                    </Button>
                </div>
                <div className='flex flex-col justify-center gap-5 mt-5'>
                    <div>
                        <h4 className='text-gray-900'>Full Name</h4>
                        <p className='text-xs text-gray-700'>{userData.name}</p>
                    </div>
                    <div>
                        <h4 className='text-gray-900'>Email</h4>
                        <p className='text-xs text-gray-700'>{userData.email}</p>
                    </div>
                    <div>
                        <h4 className='text-gray-900'>Password</h4>
                        <p className='text-xs text-gray-700'>********</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account