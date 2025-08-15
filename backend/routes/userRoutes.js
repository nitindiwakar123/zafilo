import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", checkAuth, (req, res) => {
    const user = req.user;
    return res.status(200).json({ name: user.name, email: user.email });
});

router.post("/register", async (req, res, next) => {
    const db = req.db;
    const usersCollection = db.collection("users");
    const directoriesCollection = db.collection("directories");
    const { name, password, email } = req.body;
    if (!email || !name || !password) return res.status(404).json({ error: "Name or email or password not valid!" });

    try {
        const isExistingEmail = await usersCollection.findOne({ email: email });
        if (isExistingEmail) return res.status(409).json({
            error: "User already exists!",
            message: "A user with this email is already exists!"
        });

        const userRootDir = await directoriesCollection.insertOne({
            name: `root-${email}`,
            parentDirId: null,
        });

        const rootDirId = userRootDir.insertedId;
        const user = await usersCollection.insertOne({
            name,
            email,
            password,
            rootDirId: rootDirId
        });
        const userId = user.insertedId;

        await directoriesCollection.updateOne({ _id: rootDirId }, { $set: { userId } });

        return res.status(201).json({ message: "Registration Successfull!" });
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    const db = req.db;
    const usersCollection = db.collection("users");
    const { email, password } = req.body;
    try {
        const userData = await usersCollection.findOne({email, password});
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
});

router.post("/logout", (req, res, next) => {
    res.clearCookie("uid", {
        httpOnly: true,
    });
    return res.status(200).json({ message: "Logged out!" });
});

export default router;