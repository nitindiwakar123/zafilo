import { readdir, mkdir, writeFile, rename } from "node:fs/promises";
import express from "express";
import validateId from "../middlewares/validateIdMiddleware.js";
import { Db, ObjectId } from "mongodb";

const router = express.Router();

router.param("id", validateId);
router.param("parentDirId", validateId);

// Directory Operations
// Serving Directory Content

router.get("/{:id}", async (req, res, next) => {
    const db = req.db;
    const directoriesCollection = db.collection("directories");
    const user = req.user;
    const id = req.params.id || user.rootDirId;
    try {
        const directoryData = await directoriesCollection.findOne({ _id: new ObjectId(id) });
        if (!directoryData) {
            return res.status(404).json({ error: "Folder not found!" });
        }
        const files = await db.collection("files").find({ parentDirId: directoryData._id }).toArray();
        const directories = await directoriesCollection.find({ parentDirId: directoryData._id }).toArray();

        return res.status(200).json({ ...directoryData, files, directories });
    } catch (error) {
        next(error);
    }
});

// Serving Trash Directory Content
// router.get("/trash", async (req, res) => {
//     const contentList = await getDirectoryContent("./trash");
//     res.json(contentList);
// });

// Create a Directory
router.post("/{:parentDirId}", async (req, res, next) => {
    const db = req.db;
    const directoriesCollection = db.collection("directories");
    const user = req.user;
    const parentDirId = req.params.parentDirId ? new ObjectId(req.params.parentDirId) : user.rootDirId;
    const dirname = req.headers.dirname || "New Folder";
    try {
        const directoryData = {
            name: dirname,
            parentDirId,
            userId: user._id
        }
        const parentDir = await directoriesCollection.findOne({ _id: parentDirId });
        if (!parentDir) {
            return res.status(404).json({ message: "Parent Folder not found!" });
        }

        await directoriesCollection.insertOne(directoryData);

        return res.status(201).json({ "message": "Folder Successfully Created!" })
    } catch (error) {
        next(error);
    }
});

// Rename a Directory
router.patch("/:id", async (req, res, next) => {
    const db = req.db;
    const directoriesCollection = db.collection("directories");
    const { id } = req.params;
    const newName = req.body ? req.body.newName : undefined;
    if (!newName) return res.status(400).json({ error: "Invalid Name!" });
    const user = req.user;
    try {

        await directoriesCollection.updateOne({ _id: new ObjectId(id), userId: user._id }, { $set: { name: newName } });
        return res.status(200).json({ "message": "Folder renamed successfully!" });

    } catch (error) {
        next(error);
    }
});

// Delete a Directory
router.delete("/:id", async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const db = req.db;
    const directoriesCollection = db.collection("directories");
    const filesCollection = db.collection("files");

    try {
        const directoryData = await directoriesCollection.findOne({ _id: new ObjectId(id), userId: user._id }, { projection: { _id: 1 } });
        if (!directoryData) {
            return res.status(404).json({ message: "Folder not found!" });
        }

        const { files: allFiles, directories: allDirectories } = await getDirectoryContent(directoryData._id, db);

        for (const { _id, extension } of allFiles) {
            const fileId = _id.toString();
            await rename(`./storage/${fileId}${extension}`, `./trash/${fileId}${extension}`);
        }

        await filesCollection.deleteMany({
            _id: { $in: allFiles.map(({ _id }) => _id) }
        });

        await directoriesCollection.deleteMany({
            _id: { $in: [...allDirectories.map(({ _id }) => _id), directoryData._id] }
        });

        return res.status(200).json({ "message": "Folder deleted successfully!" });
    } catch (error) {
        next(error);
    }
});

async function getDirectoryContent(dirId, db) {
    const directoriesCollection = db.collection("directories");
    const filesCollection = db.collection("files");

    let files = await filesCollection.find({ parentDirId: dirId }, { projection: { extension: 1 } }).toArray();
    let directories = await directoriesCollection.find({ parentDirId: dirId }, { projection: { _id: 1 } }).toArray();

    for (const { _id } of directories) {
        const { files: childFiles, directories: childDirectories } = await getDirectoryContent(_id, db);

        files = [...files, ...childFiles];
        directories = [...directories, ...childDirectories];
    }

    return { files, directories };
}

export default router;