import { readdir, mkdir } from "node:fs/promises";
import { join } from "node:path";
import express from "express";
import directoriesData from "../directoriesDB.json" with {type: "json"};
import filesData from "../filesDB.json" with {type: "json"};


const router = express.Router();

// Directory Operations
// Serving Directory Content
router.get("/{:id}", async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            const directoryData = directoriesData[0];
            const files = directoryData.files?.map((fileId) => {
                return filesData.find((file) => file.id === fileId);
            });
            res.json({...directoryData, files});
        } else {
            const directoryData = directoriesData.find((dir) => dir.id === id);
            res.json(directoryData);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Serving Trash Directory Content
router.get("/trash", async (req, res) => {
    const contentList = await getDirectoryContent("./trash");
    res.json(contentList);
});

// Create a Directory
router.post("/*path", async (req, res) => {
    let path = req.params.path.join("/");
    path = path ? join("/", path) : undefined;

    const fullDirPath = join(`./storage/${path ? path : ""}`);
    try {
        await mkdir(fullDirPath);
        res.json({ "message": "Folder Successfully Created!" })
    } catch (error) {
        res.status(404).json({ "message": error.message });
    }
});


async function getDirectoryContent(path = "") {
    const content = await readdir(path, { withFileTypes: true });
    const contentList = content.map((item) => {
        return { name: item.name, isDirectory: item.isDirectory() }
    });
    return contentList;
}

export default router;