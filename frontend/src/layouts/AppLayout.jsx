import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, Navbar, ContextMenu } from "../components";
import { useQuery } from '@tanstack/react-query';
import { getUserDataApi } from '../api/endpoints/userApi';
import { useUserData } from '../hooks/userHooks/userHooks';
import { useDispatch } from 'react-redux';
import { login, logout } from '../features/auth/authSlice';

function AppLayout() {

    const { data, isError } = useUserData();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log({data, isError});
        if (isError) {
            dispatch(logout());
        } else if (!isError && data) {
            dispatch(login(data.userId));
        }
    }, [isError]);

    return (
        <div className="w-full h-screen flex">
            <Sidebar />
            <div className="w-full flex flex-col bg-primary-dark">
                <Navbar />
                <ContextMenu />
                <main className="py-5 px-20">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AppLayout