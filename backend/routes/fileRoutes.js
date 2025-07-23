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
    try {
        const fileData = filesData.find((file) => file.id === id);
        if (!fileData) {
            return res.status(404).json({ message: "File not Found!" });
        }
        const fullFilePath = `${process.cwd()}/storage/${id}${fileData.extension}`;
        if (req.query.action === "download") {
            res.set("Content-Disposition", `attachment; filename=${fileData.name}`);
        }
        return res.status(200).sendFile(fullFilePath);
    } catch (error) {
        return res.status(404).json({ message: "File not Found!" });
    }
}
);

// Upload File
router.post("/{:parentDirId}", async (req, res, next) => {
    const parentDirId = req.params.parentDirId || directoriesData[0].id;
    const { filename } = req.headers || "untitled";
    const id = crypto.randomUUID();
    const extension = path.extname(filename);
    const fullFilename = `${id}${extension}`;
    const fileHandle = await open(`./storage/${fullFilename}`, "w");
    const writeStream = fileHandle.createWriteStream();

    try {
        req.pipe(writeStream);
        req.on('end', async () => {
            const fileData = {
                id,
                extension,
                name: filename,
                parentDirId: parentDirId
            };
            filesData.push(fileData);
            const parentDirData = directoriesData.find((dir) => dir.id === parentDirId);
            parentDirData.files.push(fileData.id);
            await writeFile('./filesDB.json', JSON.stringify(filesData));
            await writeFile('./directoriesDB.json', JSON.stringify(directoriesData));
            await fileHandle?.close();
            return res.status(201).json({ "message": "File Successfully Uploaded!" });
        });
    } catch (error) {
        next(error);
    }
});

// Rename File
router.patch("/:id", async (req, res, next) => {
    const { id } = req.params;
    const { newFilename } = req.body;
    try {

        const fileData = filesData.find((file) => file.id === id);
        if (!fileData) {
            return res.status(404).json({ message: "File not Found!" });
        }
        if (newFilename) {
            fileData.name = newFilename;
        }
        await writeFile('./filesDB.json', JSON.stringify(filesData));
        return res.status(200).json({ message: "File Renamed Successfully!" });
    } catch (error) {
        next(error);
    }
});

// Delete File
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const fileIndex = filesData.findIndex((file) => file.id === id);
        const fileData = filesData[fileIndex];
        if (!fileData) {
            return res.status(404).json({ message: "File not Found!" });
        }
        const { extension } = fileData;
        await rename(`./storage/${id}${extension}`, `./trash/${id}${extension}`);
        filesData.splice(fileIndex, 1);
        const parentDirData = directoriesData.find((dir) => dir.id === fileData.parentDirId);
        parentDirData.files = parentDirData.files.filter((fileId) => fileId !== fileData.id);
        await writeFile('./filesDB.json', JSON.stringify(filesData));
        await writeFile('./directoriesDB.json', JSON.stringify(directoriesData));
        return res.status(200).json({ message: "File Deleted Successfully!" });
    } catch (error) {
        next(error);
    }
});


export default router;