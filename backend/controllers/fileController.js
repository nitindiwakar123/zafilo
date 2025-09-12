import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import { open, rename } from "node:fs/promises";
import path from "node:path";


export const createFile = async (req, res, next) => {
    const user = req.user;
    const parentDirId = req.params.parentDirId || user.rootDirId.toString();
    const filename = req.headers.filename || "untitled";
    const extension = path.extname(filename);

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
        console.log(error);
        next(error);
    }
}

export const getFile = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const fileData = await File.findOne({ _id: id, userId: user._id }, {extension: 1}).lean();
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

export const renameFile = async (req, res, next) => {
    const { id } = req.params;
    const newName = req.body ? req.body.newName : undefined;
    if (!newName) return res.status(400).json({ error: "Invalid Name!" });
    const user = req.user;
    try {

        const file = await File.findOne({ _id: id, userId: user._id });
        if (!file) {
            return res.status(404).json({ message: "File not Found!" });
        }
        
        file.name = newName;
        await file.save();
        return res.status(200).json({ message: "File Renamed!" });

    } catch (error) {
        next(error);
    }
}

export const deleteFile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const file = await File.findOne(
            { _id: id, userId: user._id },
            {extension: 1}
        );
        if (!file) {
            return res.status(404).json({ message: "File not Found!" });
        }
        const { extension } = file;
        await rename(`./storage/${id}${extension}`, `./trash/${id}${extension}`);
        await file.deleteOne();

        return res.status(200).json({ message: "File Deleted Successfully!" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}