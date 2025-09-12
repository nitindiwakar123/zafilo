import mongoose from "mongoose";

const url = "mongodb://nitin:Nitin2006@localhost:27017/storageApp?replicaSet=myReplicaSet";

export async function connectDB() {
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