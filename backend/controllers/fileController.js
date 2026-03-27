import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import { open, readFile, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
import mime from "mime-types";
import { pipeline } from "node:stream/promises";
import XLSX from "xlsx";
import mongoose from "mongoose";
import { Transform } from "node:stream";
import CustomError from "../utils/customError.js";
import updateParentSize from "../utils/updateParentSize.js";

export const createFile = async (req, res, next) => {
    const user = req.user;
    const parentDirId = req.params.parentDirId || user.rootDirId.toString();
    const MAX_SIZE_LIMIT = 50 * 1024 * 1024;
    const filename = req.headers.filename || "untitled";
    const claimedFileSize = Number(req.headers.filesize);
    const extension = path.extname(filename);
    const fileId = new mongoose.Types.ObjectId();
    const fullFilename = `${fileId}${extension}`;
    const filePath = `./storage/${fullFilename}`;
    const fileHandle = await open(filePath, "w");
    const session = await mongoose.startSession();

    console.log({extension})
    try {
        const parentDirData = await Directory.findOne({ _id: parentDirId, userId: user._id }).select("_id").lean();
        if (!parentDirData) {
            return res.status(404).json({ success: false, error: "Parent Folder Not Found!" });
        }
        console.log({ parentDirData });


        if (claimedFileSize > MAX_SIZE_LIMIT) {
            await unlink(filePath).catch(() => { });
            return req.destroy();
        }

        const writeStream = fileHandle.createWriteStream();

        let size = 0;
        const counter = new Transform({
            async transform(chunk, encoding, callback) {
                size += chunk.length;
                if (size > claimedFileSize) {
                    console.log({ size, claimedFileSize });
                    return callback(new CustomError("LIMIT_EXCEEDED!", 413));
                }
                callback(null, chunk);
            }
        });

        await pipeline(req, counter, writeStream);

        const fileData = {
            _id: fileId,
            name: filename,
            extension,
            parentDirId: parentDirData._id,
            userId: user._id,
            size
        };

        session.startTransaction()
        const createdFile = await File.create([fileData], { session });
        await updateParentSize(parentDirData._id, size, session);
        await session.commitTransaction();
        return res.status(201).json({ success: true, "message": "File Successfully Uploaded!", data: createdFile });
    } catch (error) {
        await session.abortTransaction();
        await unlink(filePath).catch(() => { });
        if (error.code === 413) {
            return res.status(413).json({ success: false, error: "File exceeds 50MB limit." });
        }
        if (error.code === 121) {
            console.log(error.errorResponse.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied[0]);
        }
        next(error);
    } finally {
        await session.endSession();
        await fileHandle?.close();
    }
}

export const getFile = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const fileData = await File.findOne({ _id: id, userId: user._id }).select("extension name");
        if (!fileData) {
            return res.status(404).json({ success: false, message: "File not Found!" });
        }
        const fullFilePath = `${process.cwd()}/storage/${id}${fileData.extension}`;
        console.log({fullFilePath})
        if (req.query.action === "download") {
            console.log({ fileData });
            return res.status(200).download(fullFilePath, fileData.name);
        }

        fileData.openedAt = new Date();
        await fileData.save();

        const mimeType = mime.lookup(fileData.extension) || 'application/octet-stream';
        res.set('Content-Type', mimeType);          // <-- now it sticks

        const fileHandle = await open(fullFilePath, 'r');
        const readStream = fileHandle.createReadStream();
        readStream.pipe(res);
        return;
    } catch (error) {
        console.log(error);
        return res.status(404).json({ success: false, message: "File not Found!" });
    }
}

export const renameFile = async (req, res, next) => {
    const { id } = req.params;
    const newName = req.body ? req.body.newName : undefined;
    if (!newName) return res.status(400).json({ success: false, error: "Invalid Name!" });
    const user = req.user;
    try {

        const file = await File.findOne({ _id: id, userId: user._id });
        if (!file) {
            return res.status(404).json({ success: false, message: "File not Found!" });
        }

        file.name = newName;
        await file.save();
        return res.status(200).json({ success: true, data: file });

    } catch (error) {
        next(error);
    }
}

export const deleteFile = async (req, res, next) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    try {
        const user = req.user;
        const file = await File.findOne(
            { _id: id, userId: user._id }).select("extension parentDirId size");
        if (!file) {
            return res.status(404).json({ success: false, message: "File not Found!" });
        }
        const { extension, parentDirId, size } = file;
        await rename(`./storage/${id}${extension}`, `./trash/${id}${extension}`);
        session.startTransaction();
        await file.deleteOne({ session });
        await updateParentSize(parentDirId, -size, session);
        await session.commitTransaction();

        return res.status(200).json({ success: true, message: "File Deleted Successfully!" });
    } catch (error) {
        await session.abortTransaction();
        if (error.code === 121) {
            console.log(error.errorResponse.errInfo.details);
        }
        next(error);
    } finally {
        await session.endSession()
    }
}

export const deleteFiles = async (req, res, next) => {
    const user = req.user;
    const parentDirId = req.params.parentDirId || user.rootDirId.toString();
    const fileId = req.body?.files || [];
    console.log({ fileId });
    const userId = user._id.toString();
    const session = await mongoose.startSession();
    if (fileId.length <= 0) {
        return res.status(404).json({ success: false, message: "files Id not received!" });
    }
    try {
        const isParentDirExists = await Directory.exists({ _id: parentDirId, userId });
        if (!isParentDirExists) return res.status(404).json({ success: false, error: "parent folder not found!" });

        const files = await File.find({ _id: { $in: fileId } }).select("extension size");
        if (files.length <= 0) return res.status(404).json({ success: false, message: "files not exists!" });
        console.log({ files });

        for (const { _id, extension } of files) {
            await rename(`./storage/${_id.toString()}${extension}`, `./trash/${_id.toString()}${extension}`);
        }

        const totalSize = files.reduce((accumulator, {size}) => {
            return accumulator + size;
        }, 0);
        console.log({totalSize});

        session.startTransaction();
        await File.deleteMany({ _id: { $in: fileId } }, { session });
        await updateParentSize(parentDirId, -totalSize, session);
        await session.commitTransaction();
        return res.status(200).json({ success: true, message: "files deleted successfully!" });
    } catch (error) {
        await session.abortTransaction();
        console.log(error);
        next(error);
    } finally {
        await session.endSession();
    }
}

export const getAllFiles = async (req, res, next) => {
    const user = req.user;
    try {
        const allFiles = await File.find({ userId: user._id }).lean();
        return res.status(200).json({ success: true, data: allFiles });
    } catch (error) {
        next(error);
    }
}