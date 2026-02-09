import Session from "../models/sessionModel.js";
import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import mongoose from "mongoose";
import redisClient from "../config/redisConfig.js";
import getAllSessionsHashes from "../utils/getAllSessionsHashes.mjs";

export const getAllUsers = async (req, res, next) => {
    try {
        const usersList = await User.find().select("name email").lean();
        const allSessions = await getAllSessionsHashes();
        const allSessionsSet = new Set(allSessions);
        const usersData = usersList.map(({ _id, name, email, role }) => ({ id: _id, name, email, isLoggedIn: allSessionsSet.has(_id.toString()) }));
        res.json(usersData);
    } catch (error) {
        next(error);
    }
}

export const logoutById = async (req, res, next) => {
    console.log("Hello");
    const targetId = req.params?.id;
    const actor = req.user;
    try {
        console.log({ actor: actor.name, role: actor.role });
        if (actor.role !== "admin") {
            console.log("Inside the check for admin!");
            const targetUser = await User.findById(targetId).select("role").lean();
            if (!targetUser) return res.status(404).json({ success: false, message: "user not found!", error: "not found" });

            if (targetUser.role === "admin") return res.status(403).json({ success: false, message: "illegal operation you cannot logout admin!", error: "illegal operation" });
        }
        await Session.deleteMany({ userId: targetId });
        return res.status(200).json({ success: true, message: `all sessions is deleted by ${actor.role}!` });
    } catch (error) {
        console.log({ error });
        next(error);
    }
}

export const deleteById = async (req, res, next) => {
    const targetId = req.params?.id;
    if(!targetId) return res.status(400).json({success: false, message: "Target id not recieved!", error: "Id not recieved!"});

    const actor = req.user;
    if(actor.role !== 'admin') return res.status(403).json({success: false, message: "Illegal operation you cannot delete a user!", error: "Illegal operation!"});

    if(actor._id.toString() === targetId) return res.status(403).json({success: false, message: "Illegal operation you cannot delete yourself!", error: "Illegal operation!"});

    try {
        // Soft delete
        await User.findByIdAndUpdate(targetId, {isDeleted: true});
        await Session.deleteMany({userId: targetId});

        return res.status(204).json({success: true, message: "User deleted successfully!"});
    } catch (error) {
        next(error);
    }
}