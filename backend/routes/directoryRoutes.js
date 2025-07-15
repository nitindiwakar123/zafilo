import { readdir, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import express from "express";
import directoriesData from "../directoriesDB.json" with {type: "json"};
import filesData from "../filesDB.json" with {type: "json"};


const router = express.Router();

// Directory Operations
// Serving Directory Content
router.get("/{:id}", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const directoryData = directoriesData[0];
            const files = directoryData.files?.map((fileId) => {
                return filesData.find((file) => file.id === fileId);
            });
            res.json({ ...directoryData, files });
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
router.post("/:dirname", async (req, res) => {
    const { dirname } = req.params;
    const parentDirId = req.headers.parentdirid || directoriesData[0].id;
    try {
        const directoryData = {
            id: crypto.randomUUID(),
            name: dirname,
            parentDirId,
            files: [],
            directories: []
        }
        directoriesData.push(directoryData);
        const parentDir = directoriesData.find((dir) => dir.id === parentDirId);
        parentDir.directories.push(directoryData.id);

        await writeFile('./directoriesDB.json', JSON.stringify(directoriesData));
        res.json({ "message": "Folder Successfully Created!" })
    } catch (error) {
        res.status(404).json({ "message": error.message });
    }
});

// Rename a Directory
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { newDirname } = req.body;
    try {
        const directoryData = directoriesData.find((dir) => dir.id === id);
        directoryData.name = newDirname;
        await writeFile('./directoriesDB.json', JSON.stringify(directoriesData));
        res.json({ "message": "Folder renamed successfully!" });
    } catch (error) {
        res.status(404).json({ "message": error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const directoryData = directoriesData.find((dir) => dir.id === id);
        const newDirectoriesData = directoriesData.filter((dir) => dir.id !== directoryData.id && dir.parentDirId !== directoryData.id);
        const parentDirData = newDirectoriesData.find((dir) => dir.id === directoryData.parentDirId);
        parentDirData.directories = parentDirData.directories.filter((dirId) => dirId !== directoryData.id);
        console.log(newDirectoriesData);
        await writeFile('./directoriesDB.json', JSON.stringify(newDirectoriesData));
        res.json({ "message": "Folder deleted successfully!" });
    } catch (error) {
        res.status(404).json({"message": error.message});
    }
})

async function getDirectoryContent(path = "") {
    const content = await readdir(path, { withFileTypes: true });
    const contentList = content.map((item) => {
        return { name: item.name, isDirectory: item.isDirectory() }
    });
    return contentList;
}

export default router;