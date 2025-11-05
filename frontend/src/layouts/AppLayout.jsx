import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, Navbar, ContextMenu } from "../components";
import { useQuery } from '@tanstack/react-query';
import { getUserDataApi } from '../api/endpoints/userApi';

function AppLayout() {
   
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