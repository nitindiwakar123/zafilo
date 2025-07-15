import { open, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import express from "express";
import directoriesData from "../directoriesDB.json" with {type: "json"};
import filesData from "../filesDB.json" with {type: "json"};

const router = express.Router();

// File Operations

// Read File
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { extension } = filesData.find((file) => file.id === id);
    const fullFilePath = `${process.cwd()}/storage/${id}${extension}`;

    if (req.query.action === "download") {
        res.set("Content-Disposition", "attachment");
    }
    res.sendFile(fullFilePath);
}
);

// Upload File
router.post("/:filename", async (req, res) => {
    const { filename } = req.params;
    const id = crypto.randomUUID();
    const extension = path.extname(filename);
    const fullFilename = `${id}${extension}`;
    try {
        const fileHandle = await open(`./storage/${fullFilename}`, "w");
        const writeStream = fileHandle.createWriteStream();
        req.pipe(writeStream);

        req.on('end', async () => {
            const fileData = {
                id,
                extension,
                name: filename,
                parentDirId: "650814cd-8737-4b7d-b32f-44cee7c942d8"
            };
            filesData.push(fileData);
            const parentDirData = directoriesData.find((dir) => dir.id === fileData.parentDirId);
            parentDirData.files.push(fileData.id);
            await writeFile('./filesDB.json', JSON.stringify(filesData));
            await writeFile('./directoriesDB.json', JSON.stringify(directoriesData));
            res.json({ "message": "File Successfully Uploaded!" });
            fileHandle.close();

        });
    } catch (error) {
        res.json({ "message": error.message });
    }
});

// Rename File
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { newFilename } = req.body;
    try {
        filesData.forEach((file) => file.id === id ? file.name = newFilename : null);
        await writeFile('./filesDB.json', JSON.stringify(filesData));
        res.json({ message: "File Renamed Successfully!" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Delete File
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const fileData = filesData.find((file) => file.id === id);
        const { extension } = fileData;
        await rename(`./storage/${id}${extension}`, `./trash/${id}${extension}`);
        const newFilesData = filesData.filter((file) => file.id !== id);
        const parentDirData = directoriesData.find((dir) => dir.id === fileData.parentDirId);
        parentDirData.files = parentDirData.files.filter((fileId) => fileId !== fileData.id);
        await writeFile('./filesDB.json', JSON.stringify(newFilesData));
        await writeFile('./directoriesDB.json', JSON.stringify(directoriesData));
        res.json({ message: "File Deleted Successfully!" });
    } catch (error) {
        res.status(404).json({ message: "Not Found!" });
    }
});

export default router;