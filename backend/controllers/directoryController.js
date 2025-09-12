import { rename } from "node:fs/promises";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";

export const getDirectory = async (req, res, next) => {
    const user = req.user;
    const id = req.params.id || user.rootDirId.toString();
    try {
        const directoryData = await Directory.findById(id).lean();
        if (!directoryData) {
            return res.status(404).json({ error: "Folder not found!" });
        }
        const files = await File.find({ parentDirId: id }).lean();
        const directories = await Directory.find({ parentDirId: id }).lean();

        return res.status(200).json({ ...directoryData, files, directories });
    } catch (error) {
        next(error);
    }
}

export const createDirectory = async (req, res, next) => {
    const user = req.user;
    const parentDirId = req.params.parentDirId || user.rootDirId.toString();
    const dirname = req.headers.dirname || "New Folder";
    try {
        const directoryData = {
            name: dirname,
            parentDirId,
            userId: user._id
        }
        const parentDir = await Directory.findById(parentDirId, {_id: 1}).lean();
        if (!parentDir) {
            return res.status(404).json({ message: "Parent Folder not found!" });
        }

        await Directory.insertOne(directoryData);

        return res.status(201).json({ "message": "Folder Successfully Created!" })
    } catch (error) {
        next(error);
    }
}

export const renameDirectory = async (req, res, next) => {
    const { id } = req.params;
    const newName = req.body ? req.body.newName : undefined;
    if (!newName) return res.status(400).json({ error: "Invalid Name!" });
    const user = req.user;
    try {

        await Directory.updateOne({ _id: id, userId: user._id }, { name: newName });
        return res.status(200).json({ "message": "Folder renamed successfully!" });

    } catch (error) {
        next(error);
    }
}

export const deleteDirectory = async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;

    try {
        const directoryData = await Directory.findOne({ _id: id, userId: user._id }, { _id: 1 }).lean();
        if (!directoryData) {
            return res.status(404).json({ message: "Folder not found!" });
        }

        const { files: allFiles, directories: allDirectories } = await getDirectoryContent(directoryData._id);

        for (const { _id, extension } of allFiles) {
            const fileId = _id.toString();
            await rename(`./storage/${fileId}${extension}`, `./trash/${fileId}${extension}`);
        }

        await File.deleteMany({
            _id: { $in: allFiles.map(({ _id }) => _id) }
        });

        await Directory.deleteMany({
            _id: { $in: [...allDirectories.map(({ _id }) => _id), directoryData._id] }
        });

        return res.status(200).json({ "message": "Folder deleted successfully!" });
    } catch (error) {
        next(error);
    }
}

async function getDirectoryContent(dirId) {

    let files = await File.find({ parentDirId: dirId }, { extension: 1 }).lean();
    let directories = await Directory.find({ parentDirId: dirId }, { _id: 1 }).lean();

    for (const { _id } of directories) {
        const { files: childFiles, directories: childDirectories } = await getDirectoryContent(_id);

        files = [...files, ...childFiles];
        directories = [...directories, ...childDirectories];
    }
 
    return { files, directories };
}