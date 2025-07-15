import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function DirectoryView() {

  const BASE_URL = "http://localhost";
  const [contentList, setContentList] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newFilename, setNewFilename] = useState("");
  const [newFolder, setNewFolder] = useState({
    isNewFolder: false,
    foldername: "",
  });
  const { '*': dirPath } = useParams();

  const fetchData = async () => {
    try {
      console.log(BASE_URL);
      const response = await fetch(`${BASE_URL}/folder/${dirPath? dirPath+"/": ""}`);
      const contentList = await response.json();

      if (contentList) {
        console.log(contentList);
        setContentList(contentList);
      }
    } catch (error) {
      console.log("fetchData :: catch :: error :: ", error);
    }
  }

  const handleUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    // console.log("loading: ", loading);
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${BASE_URL}/file/${file.name}`);
      xhr.setRequestHeader("parentDirId", contentList.id);
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

  const handleCreateDirectory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/directory/${dirPath? dirPath+"/": ""}${newFolder.foldername}`, {
        method: "POST",
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

  const handleDelete = async (id) => {
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
      console.log("handleDelete :: catch :: error :: ", error.message);
    }
  }

  const handleRename = async (id) => {
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

  useEffect(() => {
    fetchData();
  }, [dirPath]);

  return (
    <div className="flex py-20 px-20 items-center justify-between">
      {/* Functionality Panel */}
      <div className="">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <h2>Upload New File</h2>
            <label htmlFor="file">Choose a file</label>
            <input className="border border-black" type="file" id="file" name="file" onChange={handleUpload} />
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


        <h2>Stored Files</h2>

        <ul>
          {contentList.files?.map((item) => (
            <li key={item.id} className="flex items-center gap-5">
              <span>{item.name}({item.isDirectory ? "folder" : "file"})</span>

              <div className="flex items-center gap-2">
                <button className="border border-black" onClick={() => {

                }}>
                  {!item.isDirectory && <a href={`${BASE_URL}/file/${item.id}?action=open`}>Open</a>}
                  {item.isDirectory && <Link to={`./${item.name}`}>Open</Link>}
                </button>
                {!item.isDirectory && <button className="border border-black"><a href={`${BASE_URL}/file/${item.id}?action=download`}>Download</a></button>}
                <button className="border border-black" onClick={() => {
                  handleDelete(item.id);
                }}>Delete</button>
                <input className="border border-black" type="text" placeholder="New name" onChange={(e) => setNewFilename(e.target.value)} value={newFilename} />
                <button className="border border-black" onClick={() => handleRename(item.id)}>Rename</button>
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
