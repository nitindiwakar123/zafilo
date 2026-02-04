import Directory from "../models/directoryModel.js";
import User from "../models/userModel.js";
import path from "node:path";
import { open, rm } from "node:fs/promises";
import crypto from "node:crypto";
import mongoose from "mongoose";
import { hash, compare } from "bcrypt";
import Otp from "../models/otpModel.js";
import { sendOtpService } from "../services/sendOtpService.js";
import OTP from "../models/otpModel.js";
import { verifyIdToken } from "../services/googleAuthService.js";
import redisClient from "../config/redisConfig.js";

export const getCurrentUser = async (req, res) => {
    const userId = req.user._id;
    console.log(req.user);
    const user = await User.findById(userId).select('name email role').lean();
    return res.status(200).json({
        success: true, data: {
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });
}

export const getCurrentUserProfile = async (req, res) => {
    let filePath;
    const userId = req.user._id;
    const user = await User.findById(userId).select("-_id profilePic").lean();
    if (!user.profilePic) {
        filePath = path.join(process.cwd(), "profiles", "default-profile.jpg");
    } else {
        if (!user.profilePic.includes("googleusercontent.com")) {
            filePath = path.join(process.cwd(), "profiles", user.profilePic);
        } else {
            filePath = user.profilePic;
        }
    }
    res.set("Cache-Control", "no-cache");
    return res.status(200).sendFile(filePath);
}

export const userSendOtp = async (req, res, next) => {
    const email = req.body?.email;
    if (!email) return res.status(400).json({ success: false, error: "email not recieved!" });
    try {
        const result = await sendOtpService(email);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export const registerVerifyOtp = async (req, res, next) => {
    const email = req.body?.email;
    const enteredOtp = req.body?.otp;
    console.log({enteredOtp});
    if (!email || !enteredOtp) return res.status(400).json({ success: false, error: "OTP is not valid!" });
    try {
        const sentOtp = await Otp.findOne({ email, otp: enteredOtp }).lean();
        console.log({sentOtp});
        if (!sentOtp) {
            return res.status(400).json({ success: false, error: "otp is not valid or expired!" })
        }
        return res.status(200).json({ success: true, message: "email verified successfully!" });
    } catch (error) {
        next(error);
    }
}

export const loginVerifyOtp = async (req, res, next) => {
    const email = req.body?.email;
    const enteredOtp = req.body?.otp;
    if (!email || !enteredOtp) return res.status(400).json({ success: false, error: "OTP is not valid!" });
    console.log("Hello login verify otp!");
    try {
        const sentOtp = await Otp.findOne({ email, otp: enteredOtp }).lean();
        if (!sentOtp) {
            return res.status(400).json({ success: false, error: "otp is not valid or expired!" })
        }

        const userData = await User.findOne({ email }).select("isDeleted rootDirId role").lean();

        if (userData.isDeleted === true) return res.status(403).json({ success: false, message: "User is deleted Contact Our team for Recovery!", error: "User deleted!" });

        const sessionId = crypto.randomUUID();
        const redisKey = `session:${sessionId}`;
        const session = {
            userId: userData._id.toString(),
            rootDirId: userData.rootDirId.toString(),
            role: userData.role
        }
        await redisClient.hSet(redisKey, session);
        await redisClient.expire(redisKey, 60 * 60 * 24 * 7);

        res.cookie('sid', sessionId, {
            httpOnly: true,
            signed: true,
            maxAge: 60 * 1000 * 60 * 24 * 7
        });

        return res.status(200).json({ success: true, message: "email verified successfully!" });
    } catch (error) {
        next(error);
    }
}

export const userRegister = async (req, res, next) => {
    const email = req.body?.email;
    const name = req.body?.name;
    const password = req.body?.password;
    const otp = req.body?.otp;

    console.log(req.body);

    if (!email || !name || !password || !otp) return res.status(404).json({ success: false, error: "Name or email or password not valid!" });

    const session = await mongoose.startSession();

    try {
        const otpRecord = await OTP.findOne({ email, otp });

        console.log({otpRecord});
        if (!otpRecord) {
            return res.status(400).json({ error: "Invalid or Expired OTP!" });
        }

        await otpRecord.deleteOne();

        const userData = await User.findOne({ email }, { _id: 1, password: 1, isDeleted: 1, authStrategy: 1 });
        console.log({ userData });
        if (userData) {
            if (!userData.isDeleted) return res.status(404).json({ success: false, error: "User already exists!" });

            const hashedPassword = await hash(password, 12);
            userData.isDeleted = false;
            userData.name = name;
            userData.password = hashedPassword;
            const current = userData.authStrategy;
            userData.authStrategy = (current === 'oidc' || current === 'both') ? 'both' : 'local';
            await userData.save();

            return res.status(200).json({ success: true, message: "Registered Successfully!" });

        };

        const userId = new mongoose.Types.ObjectId();

        session.startTransaction();

        const userRootDir = await Directory.insertOne({
            name: `root-${email}`,
            parentDirId: null,
            userId
        }, { session });

        const rootDirId = userRootDir._id;

        const hashedPassword = await hash(password, 12);

        await User.insertOne({
            _id: userId,
            name,
            email,
            authStrategy: 'local',
            password: hashedPassword,
            rootDirId
        }, { session });

        await session.commitTransaction();

        return res.status(201).json({ success: true, message: "Registration Successfull!" });
    } catch (error) {
        console.log({ error });
        await session.abortTransaction();
        if (error.errors) {
            const firstError = Object.keys(error.errors)[0];
            const errorMessage = error.errors[firstError].properties.message;
            return res.status(400).json({ success: false, error: errorMessage });
        } else if (error.code === 121) {
            return res.status(400).json({ success: false, error: "Invalid Credentails!" });
        } else if (error.code === 11000 && error.keyValue.email) {
            return res.status(409).json({
                success: false,
                error: "User already exists!",
                message: "A user with this email is already exists!"
            });
        } else {
            next(error);
        }

    } finally {
        await session.endSession();
    }
}

export const userLogin = async (req, res, next) => {
    const email = req.body?.email;
    const password = req.body?.password;
    const MAX_DEVICES = 2;
    console.log({ email, password });
    if (!email || !password) return res.status(404).json({ success: false, error: "email or password is not valid!" });
    try {

        const userData = await User.findOne({ email }, { _id: 1, password: 1, isDeleted: 1 }).lean();
        console.log({ userData });
        if (!userData) return res.status(404).json({ success: false, error: "Invalid Credentials!" });

        if (userData.isDeleted === true) return res.status(403).json({ success: false, message: "User is deleted Contact Our team for Recovery!", error: "User deleted!" });

        const isMatched = await compare(password, userData.password);
        console.log({ isMatched });
        if (!isMatched) {
            return res.status(401).json({ success: false, error: "Invalid Credentials!" });
        }

        const allSessions = await redisClient.ft.search(
            "userIdIdx",
            `@userId:{${userData._id.toString()}}`,
            {
                RETURN: []
            }
        );
        console.log({ allSessions });
        if (allSessions.total >= MAX_DEVICES) {
            await redisClient.del(allSessions.documents[0].id);
        }

        const result = await sendOtpService(email);

        return res.json(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const userLogout = async (req, res, next) => {
    const { sid } = req.signedCookies;

    await redisClient.del(`session:${sid}`);
    res.clearCookie("sid", {
        httpOnly: true,
    });
    return res.status(200).json({ success: true, message: "Logged out!" });
}

export const changeProfile = async (req, res, next) => {

    const userId = req.user._id;
    const user = await User.findById(userId).select("profilePic").lean();
    const filename = req.headers.filename;
    console.log({ filename });
    try {
        if (!filename) return res.status(400).json({ success: false, error: "filename not found!" });
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
            return res.status(201).json({ success: true, "message": "Profile pic changed!" });
        });

        writeStream.on("error", async (err) => {
            console.error("File write error:", err);
            return res.status(500).json({ success: false, error: "Failed to save profile picture" });
        });

        req.on("error", (err) => {
            console.error("Request error:", err);
            return res.status(400).json({ success: false, error: "Bad request data" });
        });

    } catch (error) {
        next(error);
    }
}

export const userLogoutFromAllDevices = async (req, res, next) => {
    console.log("Hello logout all!");
    const userId = req.user._id;
    try {
        // await Session.deleteMany({ userId }).lean();
        res.clearCookie("sid", {
            httpOnly: true,
        });
        return res.status(200).json({ success: true, message: "Logged out from all devices!" });
    } catch (error) {
        next(error)
    }
}

export const googleAuth = async (req, res, next) => {
    try {
        const MAX_DEVICES = 2;
        const idToken = req.body?.idToken;
        if (!idToken) return res.status(400).json({ success: false, message: "id token not recieved!" });
        const userData = await verifyIdToken(idToken);
        if (!userData) return res.status(500).json({ success: false, message: "Oops! something went wrong!" });
        const { name, email, picture, sub } = userData;
        const userExist = await User.findOne({ email }).select("_id isDeleted authStrategy rootDirId role");
        // console.log({userExist});
        if (userExist.isDeleted === true) {
            userExist.isDeleted = false;
            userExist.name = name;
            const current = userData.authStrategy;
            userExist.authStrategy = (current === 'local' || current === 'both') ? 'both' : 'oidc';
            await userExist.save();
        }

        const userId = userExist?._id || new mongoose.Types.ObjectId();
        const rootDirId = userExist?.rootDirId || new mongoose.Types.ObjectId();
        if (!userExist) {
            const session = await mongoose.startSession();
            session.startTransaction();
            await Directory.insertOne({
                _id: rootDirId,
                name: `root-${email}`,
                parentDirId: null,
                userId
            }, { session });

            await User.insertOne({
                _id: userId,
                name,
                email,
                authStrategy: 'oidc',
                oidcId: sub,
                profilePic: picture,
                rootDirId
            }, { session });

            await session.commitTransaction();
            session.endSession();
        }


        const allSessions = await redisClient.ft.search(
            "userIdIdx",
            `@userId:{${userId.toString()}}`,
            {
                RETURN: []
            }
        );
        console.log({ allSessions: allSessions.documents });
        if (allSessions.total >= MAX_DEVICES) {
            await redisClient.del(allSessions.documents[0].id);
        }

        const sessionId = crypto.randomUUID();
        const redisKey = `session:${sessionId}`;
        const role = userExist?.role || 'user';
        const session = {
            userId: userId.toString(),
            rootDirId: rootDirId.toString(),
            role
        }

        await redisClient.hSet(redisKey, session);
        await redisClient.expire(redisKey, 60 * 60 * 24 * 7);
        
        res.cookie('sid', sessionId, {
            httpOnly: true,
            signed: true,
            maxAge: 60 * 1000 * 60 * 24 * 7
        });

        return res.status(200).json({ success: true, message: "Authenticated successfully!" });
    } catch (error) {
        // await session.abortTransaction();
        next(error);
    }
}