import { Protected } from "./components";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import { Mydrive, Search, Settings, Account, Notifications, Home, SignIn, SignUp, UsersPage } from "./pages";
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
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
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
        <Route path="/users" element={<UsersPage />} />
      </Route >
    </>
  )
);

function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App;   