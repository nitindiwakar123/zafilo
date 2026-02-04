import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import { open, readFile, rename } from "node:fs/promises";
import path from "node:path";
import mime from "mime-types";
import XLSX from "xlsx";

export const createFile = async (req, res, next) => {
    const user = req.user;
    const parentDirId = req.params.parentDirId || user.rootDirId.toString();
    const filename = req.headers.filename || "untitled";
    const extension = path.extname(filename);
    console.log({ parentDirId, filename });
    try {
        const parentDirData = await Directory.findOne({ _id: parentDirId, userId: user._id }, { _id: 1 }).lean();
        if (!parentDirData) {
            return res.status(404).json({ success: false, error: "Parent Folder Not Found!" });
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
            return res.status(201).json({ success: true, "message": "File Successfully Uploaded!", data: createdFile });
        });

        req.on("error", async () => {
            await File.deleteOne({ _id: createdFileId });
            return res.status(500).json({ success: false, "message": "File Upload Cancled!" });
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
        const fileData = await File.findOne({ _id: id, userId: user._id }, { extension: 1, name: 1 });
        if (!fileData) {
            return res.status(404).json({ success: false, message: "File not Found!" });
        }
        const fullFilePath = `${process.cwd()}/storage/${id}${fileData.extension}`;
        if (req.query.action === "download") {
            console.log({fileData});
            return res.status(200).download(fullFilePath, fileData.name);
        }

        fileData.openedAt = new Date();
        fileData.save();

        const mimeType = mime.lookup(fileData.extension) || 'application/octet-stream';
        res.set('Content-Type', mimeType);          // <-- now it sticks

        if (fileData.extension === ".xlsx") {
            const workbook = XLSX.readFile(fullFilePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const fileJsonData = XLSX.utils.sheet_to_json(sheet);
            return res.status(200).json({ success: true, fileJsonData });
        }

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
    try {
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
    const user = req.user;
    const parentDirId = req.params.parentDirId || user.rootDirId.toString();
    const files = req.body?.files || [];
    const userId = user._id.toString();
    if (files.length <= 0) {
        return res.status(404).json({ success: false, message: "files Id not received!" });
    }
    try {
        const isParentDirExists = await Directory.exists({ _id: parentDirId, userId });
        if (!isParentDirExists) return res.status(404).json({ success: false, error: "parent folder not found!" });

        for (const { fileId, extension } of files) {
            await rename(`./storage/${fileId}${extension}`, `./trash/${fileId}${extension}`);
        }

        await File.deleteMany({ _id: { $in: files.map(({ fileId }) => fileId) } });
        return res.status(200).json({ success: true, message: "files deleted successfully!" });
    } catch (error) {
        console.log(error);
        next(error);
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