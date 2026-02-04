import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import checkAuth from "./middlewares/authMiddleware.js";
import { connectDB } from "./config/db.js";
import checkIsUserDeleted from "./middlewares/checkIsUserDeleted.js";
import { config } from "./config/config.js";

await connectDB();

const app = express();
const PORT = config.PORT || 4000;

// Enabling CORS
app.use(cors({
    origin: config.clientUrl,
    credentials: true,
}));

app.use(cookieParser(config.sessionSecret));

// Parsing Body into JSON
app.use(express.json());

app.use("/folder", checkAuth, checkIsUserDeleted, directoryRoutes);
app.use("/file", checkAuth, checkIsUserDeleted, fileRoutes);
app.use("/users", checkAuth, checkIsUserDeleted, usersRoutes);
app.use("/user", userRoutes);

app.use((err, req, res, next) => {
    console.log({err});
    res.status(err.status || 500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
    console.log("Server Started!");
});
