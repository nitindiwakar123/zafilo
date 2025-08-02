import { writeFile } from "node:fs/promises";
import express from "express";
import usersData from "../usersDB.json" with { type: "json" };
import directoriesData from "../directoriesDB.json" with {type: "json"};
import checkAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", checkAuth, (req, res) => {
    const user = req.user;
    return res.status(200).json({ name: user.name, email: user.email });
});

router.post("/register", async (req, res, next) => {
    const { name, password, email } = req.body;
    if (!email || !name || !password) return res.status(404).json({ error: "Name or email or password not valid!" });
    const isExistingEmail = usersData.find((user) => user.email === email);
    if (isExistingEmail) return res.status(409).json({
        error: "User already exists!",
        message: "A user with this email is already exists!"
    });
    const userId = crypto.randomUUID();
    const rootDir = {
        id: crypto.randomUUID(),
        name: `root-${email}`,
        parentDirId: null,
        userId,
        files: [],
        directories: []
    };
    const user = {
        id: userId,
        name,
        email,
        password,
        rootDirId: rootDir.id
    }
    try {
        directoriesData.push(rootDir);
        usersData.push(user);
        await writeFile('./directoriesDB.json', JSON.stringify(directoriesData));
        await writeFile('./usersDB.json', JSON.stringify(usersData));
        return res.status(201).json({ message: "Registration Successfull!" });
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const userData = usersData.find((user) => user.email === email);
        if (!userData || userData.password !== password) return res.status(404).json({ error: "Invalid Credentials!" });
        res.cookie('uid', userData.id, {
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