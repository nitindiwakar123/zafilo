import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function DirectoryView() {

  const BASE_URL = "http://localhost";
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newFilename, setNewFilename] = useState("");
  const [newFolder, setNewFolder] = useState({
    isNewFolder: false,
    foldername: "",
  });
  const { dirId } = useParams();

  const fetchData = async () => {
    try {
      console.log(BASE_URL);
      const response = await fetch(`${BASE_URL}/folder/${dirId || ""}`);
      const contentList = await response.json();


      if (contentList) {
        console.log(contentList);
        setDirectoriesList(contentList.directories);
        setFilesList(contentList.files);

      }
    } catch (error) {
      console.log("fetchData :: catch :: error :: ", error);
    }
  }

  const handleCreateDirectory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/folder/${dirId || ""}`, {
        method: "POST",
        headers: {
          dirname: newFolder.foldername
        }
      });

      const data = await response.json();
      if (data) {
        console.log(data);
        fetchData();
        setNewFolder({ isNewFolder: false, foldername: "" });
      }
    } catch (error) {
      console.log("App.jsx ::handleCreateDirectory :: error :: ", error);
    }
  }

  const handleRenameDirectory = async (id) => {
    console.log(newFolder.foldername);
    try {
      const response = await fetch(`${BASE_URL}/folder/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newDirname: `${newFolder.foldername}` })
      });

      const data = await response.json();
      if (data) {
        fetchData();
        setNewFolder((prev) => ({ ...prev, foldername: "" }));
      }
    } catch (error) {
      console.log("handleRenameDirectory :: error :: ", error.message);
    }
  }

  const handleDeleteDirectory = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/folder/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();
      if (data) {
        console.log(data);
        fetchData();
      }
    } catch (error) {
      console.log("handleDeleteDirectory :: error :: ", error.message);
    }
  }

  const handleFileUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    // console.log("loading: ", loading);
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${BASE_URL}/file/${dirId || ""}`);
      xhr.setRequestHeader("filename", file.name);
      xhr.upload.addEventListener('progress', (e) => {
        const per = (e.loaded / e.total).toFixed(2) * 100;
        setPercentage(per);
      });
      xhr.send(file);

      xhr.addEventListener('load', () => {
        console.log(xhr.response);
        fetchData();
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      })
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }

  const handleFileRename = async (id) => {
    try {
      const reponse = await fetch(`${BASE_URL}/file/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newFilename: `${newFilename}` }),
      });
      const data = await reponse.json();

      if (data) {
        console.log(data);
        fetchData();
      }
    } catch (error) {
      console.log("handleRename :: error :: ", error.message);
    }
  }

  const handleFileDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/file/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data) {
        console.log(data);
        fetchData();
      }
    } catch (error) {
      console.log("handleFileDelete :: catch :: error :: ", error.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, [dirId]);

  return (
    <div className="flex py-20 px-20 items-center justify-between">
      {/* Functionality Panel */}
      <div className="">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <h2>Upload New File</h2>
            <label htmlFor="file">Choose a file</label>
            <input className="border border-black" type="file" id="file" name="file" onChange={handleFileUpload} />
            {loading && <p>{Math.round(percentage)}% Uploaded!</p>}
          </div>

          <div className="flex flex-col gap-2">
            <button className="border border-black" onClick={() => setNewFolder((prev) => ({ ...prev, isNewFolder: true }))}>Create a new folder</button>
            {newFolder.isNewFolder &&
              <div className="flex gap-2">
                <input className="border border-black" value={newFolder.foldername} onChange={(e) => {
                  setNewFolder((prev) => ({ ...prev, foldername: e.target.value }));
                }} type="text" placeholder="Foler name" />
                <button className="border border-black" onClick={handleCreateDirectory}>Create</button>
              </div>
            }
          </div>
        </div>

      </div>

      {/* File List Panel */}
      <div className="">


        <h2>Stored Folders</h2>

        <ul>
          {directoriesList?.map(({ id, name }) => (
            <li key={id} className="flex items-center gap-5">
              <span>{name}</span>

              <div className="flex items-center gap-2">
                <button className="border border-black">
                  <Link to={`/folder/${id}`}>Open</Link>
                </button>
                <button className="border border-black" onClick={() => {
                  handleDeleteDirectory(id);
                }}>Delete</button>
                <input className="border border-black" type="text" placeholder="New name" onChange={(e) => setNewFolder((prev) => ({ ...prev, foldername: e.target.value }))} />
                <button className="border border-black" onClick={() => handleRenameDirectory(id)}>Rename</button>
              </div>


            </li>
          ))}
        </ul>

        <h2>Stored Files</h2>

        <ul>
          {filesList?.map(({ id, name }) => (
            <li key={id} className="flex items-center gap-5">
              <span>{name}</span>

              <div className="flex items-center gap-2">
                <button className="border border-black">
                  <a href={`${BASE_URL}/file/${id}`}>Open</a>
                </button>
                <button className="border border-black"><a href={`${BASE_URL}/file/${id}?action=download`}>Download</a></button>
                <button className="border border-black" onClick={() => {
                  handleFileDelete(id);
                }}>Delete</button>
                <input className="border border-black" type="text" placeholder="New name" onChange={(e) => setNewFilename(e.target.value)} value={newFilename} />
                <button className="border border-black" onClick={() => handleFileRename(id)}>Rename</button>
              </div>


            </li>
          ))}
        </ul>

        {/* <button className="border border-black" onClick={() => setBASE_URL(`${BASE_URL}/trash`)}>trash files</button> */}

      </div>
    </div>

  )
}

export default DirectoryView;
