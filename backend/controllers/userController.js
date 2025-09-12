import Directory from "../models/directoryModel.js";
import User from "../models/userModel.js";
import path from "node:path";
import { open, rm } from "node:fs/promises";
import mongoose, { Schema } from "mongoose";

export const getCurrentUser = (req, res) => {
    const user = req.user;
    return res.status(200).json({ name: user.name, email: user.email });
}

export const getCurrentUserProfile = (req, res) => {
    let filePath;
    const user = req.user;
    if (!user.profilePic) {
        filePath = path.join(process.cwd(), "profiles", "default-profile.jpg");
    } else {
        filePath = path.join(process.cwd(), "profiles", user.profilePic);
    }
    res.set("Cache-Control", "no-cache");
    return res.status(200).sendFile(filePath);
}

export const userRegister = async (req, res, next) => {
    const { name, password, email } = req.body;
    if (!email || !name || !password) return res.status(404).json({ error: "Name or email or password not valid!" });

    const session = await mongoose.startSession();

    try {
        const isExistingEmail = await User.findOne({ email: email }, { _id: 1 }).lean();
        if (isExistingEmail) return res.status(409).json({
            error: "User already exists!",
            message: "A user with this email is already exists!"
        });

        const userId = new mongoose.Types.ObjectId();

        session.startTransaction(); 

        const userRootDir = await Directory.insertOne({
            name: `root-${email}`,
            parentDirId: null,
            userId
        }, { session });

        const rootDirId = userRootDir._id;

        await User.insertOne({
            _id: userId,
            name,
            email,
            password,
            rootDirId
        }, { session });

        await session.commitTransaction();

        return res.status(201).json({ message: "Registration Successfull!" });
    } catch (error) {
        await session.abortTransaction();
        if (error.errors) {
            const firstError = Object.keys(error.errors)[0]; 
            const errorMessage = error.errors[firstError].properties.message;
            return res.status(400).json({ error: errorMessage });
        } if (error.code === 121) {
            return res.status(400).json({ error: "Invalid Credentails!" });
        } else {
            next(error);
        }

    } finally {
        await session.endSession();
    }
}

export const userLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const userData = await User.findOne({ email, password }, { _id: 1 }).lean();
        if (!userData) return res.status(404).json({ error: "Invalid Credentials!" });
        const userId = userData._id.toString();
        res.cookie('uid', userId, {
            httpOnly: true,
            maxAge: 60 * 1000 * 60 * 24 * 7
        });
        return res.json({ messsage: "Logged In!", userData });
    } catch (error) {
        next(error);
    }
}

export const userLogout = (req, res, next) => {
    res.clearCookie("uid", {
        httpOnly: true,
    });
    return res.status(200).json({ message: "Logged out!" });
}

export const changeProfile = async (req, res, next) => {

    const user = req.user;
    const filename = req.headers.filename;

    try {
        if (!filename) return res.status(400).json({ error: "filename not found!" });
        const extension = filename ? path.extname(filename) : ".png";
        const profileId = crypto.randomUUID();
        const fullFilename = `${profileId}${extension}`;

        const fileHandle = await open(`./profiles/${fullFilename}`, "w");
        const writeStream = fileHandle.createWriteStream();
        req.pipe(writeStream);

        writeStream.on('finish', async () => {
            if (user.profilePic) {
                await rm(`./profiles/${user.profilePic}`);
            }
            await User.updateOne({ _id: user._id }, { $set: { profilePic: fullFilename } });
            await fileHandle?.close();
            return res.status(201).json({ "message": "Profile pic changed!" });
        });

        writeStream.on("error", async (err) => {
            console.error("File write error:", err);
            return res.status(500).json({ error: "Failed to save profile picture" });
        });

        req.on("error", (err) => {
            console.error("Request error:", err);
            return res.status(400).json({ error: "Bad request data" });
        });

    } catch (error) {
        next(error);
    }
}