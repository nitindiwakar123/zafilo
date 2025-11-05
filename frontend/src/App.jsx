import { useParams } from "react-router-dom";
import { Protected } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { setDirectoryData, clearDirectoryData } from "./features/directory/directorySlice";
import { login, logout } from "./features/auth/authSlice";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import { Mydrive, Search, Settings, Account, Notifications, Auth, Home } from "./pages";
import { AppLayout, AuthLayout } from "./layouts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Auth Routes (no sidebar/navbar) */}
      <Route element={(
        <Protected authentication={false}>
          <AuthLayout />
        </Protected>
      )}>
        <Route path="/auth" element={<Auth />} />
      </Route>

      {/* Main App Routes (with sidebar/navbar) */}
      <Route element={
        <Protected authentication={true}>
          <AppLayout />
        </Protected>
      }>
        <Route path="/" element={<Home />} />
        <Route path="/my-drive" element={<Mydrive />} />
        <Route path="/my-drive/folder/:dirId" element={<Mydrive />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/my-account" element={<Account />} />
      </Route >
    </>
  )
);

function App() {

  const { dirId } = useParams();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App;   