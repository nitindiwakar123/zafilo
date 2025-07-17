import { readdir, mkdir, writeFile, rename } from "node:fs/promises";
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
        console.log(id);
        const directoryData = id ? directoriesData.find((dir) => dir.id === id) : directoriesData[0];
        const files = directoryData.files?.map((fileId) => {
            return filesData.find((file) => file.id === fileId);
        });
        const directories = directoryData.directories?.map((dirId) => {
            return directoriesData.find((dir) => dir.id === dirId);
        }).map(({ id, name }) => ({ id, name }));
        res.json({ ...directoryData, files, directories });

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
router.post("/{:parentDirId}", async (req, res) => {
    const parentDirId = req.params.parentDirId || directoriesData[0].id;
    const { dirname } = req.headers;
    try {
        const directoryData = {
            id: crypto.randomUUID(),
            name: dirname,
            parentDirId,
            files: [],
            directories: []
        }
        const parentDir = directoriesData.find((dir) => dir.id === parentDirId);
        parentDir.directories.push(directoryData.id);
        directoriesData.push(directoryData);

        await writeFile('./directoriesDB.json', JSON.stringify(directoriesData));
        res.json({ "message": "Folder Successfully Created!" })
    } catch (error) {
        res.status(404).json({ "message": error.message });
    }
});

// Rename a Directory
router.patch("/:id", async (req, res) => {
    console.log(req.url)
    const { id } = req.params;
    const { newDirname } = req.body;
    console.log(newDirname);
    try {
        const directoryData = directoriesData.find((dir) => dir.id === id);
        directoryData.name = newDirname;
        await writeFile('./directoriesDB.json', JSON.stringify(directoriesData));
        res.json({ "message": "Folder renamed successfully!" });
    } catch (error) {
        res.status(404).json({ "message": error.message });
    }
});

// Delete a Directory
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const directoryData = directoriesData.find((dir) => dir.id === id);
        const parentDirData = directoriesData.find((dir) => dir.id === directoryData.parentDirId);
        parentDirData.directories = parentDirData.directories.filter((dirId) => dirId !== id);
        await deleteDirectory(id);
        res.json({ "message": "Folder deleted successfully!" });
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

async function deleteDirectory(dirId) {
    const directoryIndex = directoriesData.findIndex((dir) => dir.id === dirId);
    if (directoryIndex === -1) return;
    const directoryData = directoriesData[directoryIndex];
    directoriesData.splice(directoryIndex, 1);
    try {

        for (const fileId of directoryData.files) {
            const fileIndex = filesData.findIndex((file) => file.id === fileId);
            const { extension } = filesData[fileIndex];
            await rename(`./storage/${fileId}${extension}`, `./trash/${fileId}${extension}`);
            filesData.splice(fileIndex, 1);
        }

        for (const dirId of directoryData.directories) {
            await deleteDirectory(dirId);
        }

        await writeFile('./filesDB.json', JSON.stringify(filesData));
        await writeFile('./directoriesDB.json', JSON.stringify(directoriesData));
    } catch (error) {
        console.log("deleteDirectory :: error :: ", error);
    }
}

export default router;