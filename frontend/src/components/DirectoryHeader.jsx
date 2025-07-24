import { useRef, useState, useEffect } from "react";
import { FaFolderPlus, FaUpload, FaUser, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

function DirectoryHeader({
  directoryName,
  onCreateFolderClick,
  onUploadFilesClick,
  fileInputRef,
  handleFileSelect,
}) {

  const BASE_URL = "http://localhost";
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState({});
  const user = useSelector((state) => state.auth);
  const userMenuRef = useRef();
  const dispatch = useDispatch();

  async function handleLogout() {
    try {
      const response = await fetch(`${BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include"
      });

      const data = await response.json();
      if (data) {
        dispatch(logout());
      }
    } catch (error) {
      console.log("DirectoryHeader :: handleLogout :: Error :: ", error.message);
    }
  }

  useEffect(() => {

    function handleDocumentClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);

    }
  }, []);

  useEffect(() => {
    if (user.status) {
      const { name, email } = user.userData;
      setUserData({ name, email });
    }

  }, [user.status]);



  return (
    <header className="directory-header">
      <h1>{directoryName}</h1>
      <div className="flex flex-wrap items-center gap-4 relative">
        {/* Create Folder (icon button) */}
        <button
          className="icon-button"
          title="Create Folder"
          onClick={onCreateFolderClick}
        >
          <FaFolderPlus />
        </button>

        {/* Upload Files (icon button) - multiple files */}
        <button
          className="icon-button"
          title="Upload Files"
          onClick={onUploadFilesClick}
        >
          <FaUpload />
        </button>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          style={{ display: "none" }}
          multiple // Allows multiple file selection
          onChange={handleFileSelect}
        />

        <button
          className="icon-button"
          title="Upload Files"
          onClick={() => setShowUserMenu(true)}
        >
          <FaUser />
        </button>

        {showUserMenu && <div ref={userMenuRef} className='absolute top-[40px] flex flex-col items-start gap-2 py-2 right-0 bg-neutral-200 border border-gray-400 shadow shadow-gray-500'>
          {user.status && <div>
            <h3 className='font-semibold px-4'>{userData.name}</h3>
            <p className='text-sm px-4'>{userData.email}</p>
            <button onClick={handleLogout} className='w-full px-4 flex items-center gap-1 cursor-pointer hover:bg-neutral-100'><FaSignOutAlt /> Logout</button>
          </div>}
          {!user.status && <Link to="/login" className="w-full px-4 flex items-center gap-1 cursor-pointer hover:bg-neutral-100">
            <FaSignInAlt /> Login
          </Link>}
        </div>}
      </div>
    </header>
  );
}

export default DirectoryHeader;
