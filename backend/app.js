import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import checkAuth from "./middlewares/authMiddleware.js";
import { connectDB } from "./db.js";

try {
    const db = await connectDB();

    const app = express();
    const port = 80;

    // Enabling CORS
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));

    app.use(cookieParser());

    app.use((req, res, next) => {
        req.db = db;
        next();
    });

    // Parsing Body into JSON
    app.use(express.json());

    app.use("/folder", checkAuth, directoryRoutes);
    app.use("/file", checkAuth, fileRoutes);
    app.use("/user", userRoutes);

    // app.use((err, req, res, next) => {
    //     res.status(err.status || 500).json({ message: "Oops! something went wrong." });
    // });

    app.listen(port, () => {
        console.log("Server Started!");
    });

} catch (error) {
    console.log("Error while try to connect with database: ", error);
}