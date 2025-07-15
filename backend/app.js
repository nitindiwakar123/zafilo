import express from "express";
import cors from "cors";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

const app = express();
const port = 80;

// Enabling CORS
app.use(cors());

// Parsing Body into JSON
app.use(express.json());

app.use("/folder", directoryRoutes);
app.use("/file", fileRoutes);

app.listen(port, () => {
    console.log("Listening!");
});
