import { rename } from "node:fs/promises";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import updateParentSize from "../utils/updateParentSize.js";
import mongoose from "mongoose";

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

        const pathArray = await Directory.find({_id: {$in: directoryData.path}}).select("name").lean();

        return res.status(200).json({ ...directoryData, files, directories, pathArray });
    } catch (error) {
        next(error);
    }
}

export const createDirectory = async (req, res, next) => {
    const user = req.user;
    const parentDirId = req.params.parentDirId || user.rootDirId.toString();
    const dirname = req.body?.dirname || "New Folder";
    try {

        const parentDir = await Directory.findById(parentDirId).select('path').lean();
        if (!parentDir) {
            return res.status(404).json({ message: "Parent Folder not found!" });
        }
        const dirId = new mongoose.Types.ObjectId();
        const directoryData = {
            _id: dirId,
            name: dirname,
            parentDirId,
            userId: user._id,
            path: [...parentDir.path, dirId]
        }
        const createdDirectory = await Directory.insertOne(directoryData);
        return res.status(201).json({ success: true, data: createdDirectory });
    } catch (error) {
        console.log({ error });
        next(error);
    }
}

export const renameDirectory = async (req, res, next) => {
    const { id } = req.params;
    const newName = req.body?.newName || undefined;
    if (!newName) return res.status(400).json({ error: "Invalid Name!" });

    try {
        const updatedDirectory = await Directory.findByIdAndUpdate(id, { name: newName }, { new: true }).lean();
        return res.status(200).json({ success: true, data: updatedDirectory });

    } catch (error) {
        next(error);
    }
}

export const deleteDirectory = async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const session = await mongoose.startSession();
    try {
        const directoryData = await Directory.findOne({ _id: id, userId: user._id }).select("parentDirId size").lean();
        if (!directoryData) {
            return res.status(404).json({ message: "Folder not found!" });
        }

        const { files: allFiles, directories: allDirectories } = await getDirectoryContent(directoryData._id);

        for (const { _id, extension } of allFiles) {
            const fileId = _id.toString();
            await rename(`./storage/${fileId}${extension}`, `./trash/${fileId}${extension}`);
        }

        session.startTransaction();
        await File.deleteMany({
            _id: { $in: allFiles.map(({ _id }) => _id) }
        }, { session });

        await Directory.deleteMany({
            _id: { $in: [...allDirectories.map(({ _id }) => _id), directoryData._id] }
        }, { session });

        await updateParentSize(directoryData.parentDirId, -directoryData.size, session);
        await session.commitTransaction();

        return res.status(200).json({ success: true, message: "Folder deleted successfully!" });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        await session.endSession();
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