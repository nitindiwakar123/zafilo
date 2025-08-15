import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Sidebar, Navbar, ContextMenu } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { setDirectoryData, clearDirectoryData } from "./features/directory/directorySlice";
import { login, logout } from "./features/auth/authSlice";

function App() {

  const BASE_URL = "http://localhost";
  const { dirId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.refresh);
  const [errorMessage, setErrorMessage] = useState("");


  async function getDirectoryItems() {
    setErrorMessage(""); // clear any existing error
    try {
      const response = await fetch(`${BASE_URL}/folder/${dirId || ""}`, {
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (data) {
        dispatch(setDirectoryData(data));
      } else {
        dispatch(clearDirectoryData());
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function getUserData() {
    console.log("Hello getUserData");
    try {
      const response = await fetch(`${BASE_URL}/user/`, {
        credentials: "include"
      });

      const data = await response.json();
      if (response.status === 401) {
        dispatch(logout())
      } else if (response.ok) {
        console.log(data);
        dispatch(login(data));
      } else {
        // Handle other error statuses if needed
        setErrorMessage(data.error);
        console.error("Error fetching user info:", response.status);
      }
    } catch (error) {
      setErrorMessage(error);
    }
  }

  useEffect(() => {
    getUserData();
  }, [BASE_URL, refresh.userRefresh]);

  useEffect(() => {
    getDirectoryItems();
  }, [dirId, refresh.directoryRefresh]);


  return (
    <div className="w-full h-screen overflow-hidden flex">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Navbar />
        <ContextMenu />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default App;