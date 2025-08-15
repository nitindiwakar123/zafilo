import { open, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import express from "express";
import validateId from "../middlewares/validateIdMiddleware.js";
import { Db, ObjectId } from "mongodb";

const router = express.Router();

router.param("id", validateId);
router.param("parentDirId", validateId);

// Upload File
router.post("/{:parentDirId}", async (req, res, next) => {
    const db = req.db;
    const filesCollection = db.collection("files");
    const user = req.user;
    const parentDirId = req.params.parentDirId || user.rootDirId;
    const filename = req.headers.filename || "untitled";
    const extension = path.extname(filename);

    try {
        const parentDirData = await db.collection("directories").findOne({ _id: new ObjectId(parentDirId), userId: user._id });
        if (!parentDirData) {
            return res.status(404).json({ error: "Parent Folder Not Found!" });
        }

        const fileData = {
            name: filename,
            extension,
            parentDirId: parentDirData._id,
            userId: user._id
        };
        const createdFile = await filesCollection.insertOne(fileData);
        const createdFileId = createdFile.insertedId.toString();

        const fullFilename = `${createdFileId}${extension}`;
        const fileHandle = await open(`./storage/${fullFilename}`, "w");
        const writeStream = fileHandle.createWriteStream();
        req.pipe(writeStream);

        req.on('end', async () => {
            await fileHandle?.close();
            return res.status(201).json({ "message": "File Successfully Uploaded!" });
        });

        req.on("error", async () => {
            await filesCollection.deleteOne({ _id: createdFile.insertedId });
            return res.status(500).json({ "message": "File Upload Cancled!" });
        });
    } catch (error) {
        next(error);
    }
});

// File Operations

// Read File
router.get("/:id", async (req, res) => {
    const db = req.db;
    const { id } = req.params;
    const user = req.user;
    try {
        const fileData = await db.collection("files").findOne({ _id: new ObjectId(id), userId: user._id });
        if (!fileData) {
            return res.status(404).json({ message: "File not Found!" });
        }
        const fullFilePath = `${process.cwd()}/storage/${id}${fileData.extension}`;
        if (req.query.action === "download") {
            return res.status(200).download(fullFilePath, fileData.name);
        }
        return res.status(200).sendFile(fullFilePath);
    } catch (error) {
        return res.status(404).json({ message: "File not Found!" });
    }
}
);

// Rename File
router.patch("/:id", async (req, res, next) => {
    const db = req.db;
    const filesCollection = db.collection("files");
    const { id } = req.params;
    const newName = req.body ? req.body.newName : undefined;
    if (!newName) return res.status(400).json({ error: "Invalid Name!" });
    const user = req.user;
    try {

        const fileData = await filesCollection.findOne({ _id: new ObjectId(id), userId: user._id });
        if (!fileData) {
            return res.status(404).json({ message: "File not Found!" });
        }

        await filesCollection.updateOne({ _id: new ObjectId(id) }, { $set: { name: newName } });
        return res.status(200).json({ message: "File Renamed!" });
    } catch (error) {
        next(error);
    }
});

// Delete File
router.delete("/:id", async (req, res, next) => {
    const db = req.db;
    const filesCollection = db.collection("files");
    try {
        const { id } = req.params;
        const user = req.user;
        const fileData = await filesCollection.findOne({ _id: new ObjectId(id), userId: user._id });
        if (!fileData) {
            return res.status(404).json({ message: "File not Found!" });
        }
        const { extension } = fileData;
        await rename(`./storage/${id}${extension}`, `./trash/${id}${extension}`);
        await filesCollection.deleteOne({ _id: fileData._id });
        return res.status(200).json({ message: "File Deleted Successfully!" });
    } catch (error) {
        next(error);
    }
});



export default router;