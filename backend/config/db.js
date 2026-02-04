import mongoose from "mongoose";
import { config } from "./config.js";

export async function connectDB() {
    const url = config.dbUrl;

    try {
        await mongoose.connect(url);
        console.log("Database Connected!");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    console.log("Database Disconnected!");
    process.exit();
});