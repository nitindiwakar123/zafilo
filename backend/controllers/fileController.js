import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import { open, rename } from "node:fs/promises";
import path from "node:path";


export const createFile = async (req, res, next) => {
    const user = req.user;
    const parentDirId = req.params.parentDirId || user.rootDirId.toString();
    const filename = req.headers.filename || "untitled";
    const extension = path.extname(filename);
    console.log({parentDirId, filename});
    try {
        const parentDirData = await Directory.findOne({ _id: parentDirId, userId: user._id }, { _id: 1 }).lean();
        if (!parentDirData) {
            return res.status(404).json({ error: "Parent Folder Not Found!" });
        }

        const fileData = {
            name: filename,
            extension,
            parentDirId: parentDirData._id,
            userId: user._id
        };
        const createdFile = await File.insertOne(fileData);
        const createdFileId = createdFile.id;
        const fullFilename = `${createdFileId}${extension}`;
        const fileHandle = await open(`./storage/${fullFilename}`, "w");
        const writeStream = fileHandle.createWriteStream();
        req.pipe(writeStream);

        req.on('end', async () => {
            await fileHandle?.close();
            return res.status(201).json({ "message": "File Successfully Uploaded!" });
        });

        req.on("error", async () => {
            await File.deleteOne({ _id: createdFileId });
            return res.status(500).json({ "message": "File Upload Cancled!" });
        });
    } catch (error) {
        if (error.code === 121) {
            console.log(error.errorResponse.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied[0]);
        }
        next(error);
    }
}

export const getFile = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const fileData = await File.findOne({ _id: id, userId: user._id }, { extension: 1 });
        if (!fileData) {
            return res.status(404).json({ message: "File not Found!" });
        }
        const fullFilePath = `${process.cwd()}/storage/${id}${fileData.extension}`;
        if (req.query.action === "download") {
            return res.status(200).download(fullFilePath, fileData.name);
        }

        if (req.query.action === "open") {
            fileData.openedAt = new Date();
            fileData.save();
        }
        return res.status(200).sendFile(fullFilePath);
    } catch (error) {
        return res.status(404).json({ message: "File not Found!" });
    }
}

export const renameFile = async (req, res, next) => {
    const { id } = req.params;
    const newName = req.body ? req.body.newName : undefined;
    if (!newName) return res.status(400).json({ error: "Invalid Name!" });
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
    try {
        console.log({id});
        const user = req.user;
        const file = await File.findOne(
            { _id: id, userId: user._id },
            { extension: 1 }
        );
        if (!file) {
            return res.status(404).json({ success: false, message: "File not Found!" });
        }
        const { extension } = file;
        await rename(`./storage/${id}${extension}`, `./trash/${id}${extension}`);
        await file.deleteOne();

        return res.status(200).json({ success: true, message: "File Deleted Successfully!" });
    } catch (error) {
        if (error.code === 121) {
            console.log(error.errorResponse.errInfo.details);
        }
        next(error);
    }
}

export const deleteFiles = async (req, res, next) => {
    console.log("Req is in delete files!")
    const user = req.user;
    const parentDirId = req.params.parentDirId || user.rootDirId.toString();
    const files = req.body.files || [];
    const userId = user._id.toString();
    if (files.length <= 0) {
        return res.status(404).json({ message: "files Id not received!" });
    }
    try {
        const isParentDirExists = await Directory.exists({ _id: parentDirId, userId });
        if (!isParentDirExists) return res.status(404).json({ error: "parent folder not found!" });

        for (const { fileId, extension } of files) {
            await rename(`./storage/${fileId}${extension}`, `./trash/${fileId}${extension}`);
        }

        await File.deleteMany({ _id: { $in: files.map(({ fileId }) => fileId) } });
        return res.status(200).json({ message: "files deleted successfully!" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}


export const getAllFiles = async (req, res, next) => {
    const user = req.user;
    try {
        const allFiles = await File.find({userId: user._id}).lean();
        return res.status(200).json(allFiles);
    } catch (error) {
        next(error);
    }
}