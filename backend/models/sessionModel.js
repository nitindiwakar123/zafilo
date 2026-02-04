import { Schema, model } from "mongoose";

const sessionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "userId is a required filed!"],
        },
        data: {
            type: Schema.Types.Mixed, 
            default: {},
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 3600 * 24 * 7,
        }
    },
    {
        strict: "throw",
    }
);

const Session = model("Session", sessionSchema);

export default Session;