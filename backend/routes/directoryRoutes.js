import { readdir, mkdir, writeFile, rename } from "node:fs/promises";
import express from "express";
import directoriesData from "../directoriesDB.json" with {type: "json"};
import filesData from "../filesDB.json" with {type: "json"};
import usersData from "../usersDB.json" with {type: "json"};

const router = express.Router();

// Directory Operations
// Serving Directory Content
router.get("/{:id}", async (req, res, next) => {
    const { uid } = req.cookies;
    const userData = usersData.find((user) => user.id === uid);
    const id = req.params.id || userData.rootDirId;
    try {
        const directoryData = directoriesData.find((dir) => dir.id === id);
        if (!directoryData) {
            return res.status(404).json({ message: "Folder not found!" });
        }
        const files = directoryData.files?.map((fileId) => {
            return filesData.find((file) => file.id === fileId);
        });
        const directories = directoryData.directories?.map((dirId) => {
            return directoriesData.find((dir) => dir.id === dirId);
        }).map(({ id, name }) => ({ id, name }));
        return res.status(200).json({ ...directoryData, files, directories });

    } catch (error) {
        next(error);
    }
});

// Serving Trash Directory Content
router.get("/trash", async (req, res) => {
    const contentList = await getDirectoryContent("./trash");
    res.json(contentList);
});

// Create a Directory
router.post("/{:parentDirId}", async (req, res, next) => {
    const { uid } = req.cookies;
    const userData = usersData.find((user) => user.id === uid);
    const parentDirId = req.params.parentDirId || userData.rootDirId;
    const dirname = req.headers.dirname || "New Folder";
    try {
        const directoryData = {
            id: crypto.randomUUID(),
            name: dirname,
            parentDirId,
            userId: uid,
            files: [],
            directories: []
        }
        const parentDir = directoriesData.find((dir) => dir.id === parentDirId);
        if (!parentDir) {
            return res.status(404).json({ message: "Parent Folder not found!" });
        }
        parentDir.directories.push(directoryData.id);
        directoriesData.push(directoryData);

        await writeFile('./directoriesDB.json', JSON.stringify(directoriesData));
        return res.status(201).json({ "message": "Folder Successfully Created!" })
    } catch (error) {
        next(error);
    }
});

// Rename a Directory
router.patch("/:id", async (req, res, next) => {
    const { id } = req.params;
    const { newDirname } = req.body;
    try {
        const directoryData = directoriesData.find((dir) => dir.id === id);
        if (!directoryData) {
            return res.status(404).json({ message: "Folder not found!" });
        }
        directoryData.name = newDirname;
        await writeFile('./directoriesDB.json', JSON.stringify(directoriesData));
        return res.status(200).json({ "message": "Folder renamed successfully!" });
    } catch (error) {
        next(error);
    }
});

// Delete a Directory
router.delete("/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const directoryData = directoriesData.find((dir) => dir.id === id);
        if (!directoryData) {
            return res.status(404).json({ message: "Folder not found!" });
        }
        const parentDirData = directoriesData.find((dir) => dir.id === directoryData.parentDirId);
        parentDirData.directories = parentDirData.directories.filter((dirId) => dirId !== id);
        await deleteDirectory(id);
        return res.status(200).json({ "message": "Folder deleted successfully!" });
    } catch (error) {
        next(error);
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