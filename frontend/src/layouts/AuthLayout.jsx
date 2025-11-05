import { Outlet } from 'react-router-dom';


function AuthLayout() {
    
    return (
        <div className="w-full h-screen flex bg-primary-dark">
            <Outlet />
        </div>
    )
}

export default AuthLayout