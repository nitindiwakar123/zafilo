import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Sidebar, Navbar } from "./components";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { setDirectoryData, clearDirectoryData } from "./features/directory/directorySlice";
import { login, logout } from "./features/auth/authSlice";

function App() {

  const BASE_URL = "http://localhost";
  const { dirId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  }, [BASE_URL]);

  useEffect(() => {
    getDirectoryItems();
  }, [dirId]);

  return (
    <div className="w-full flex">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default App;