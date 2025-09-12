import { model, Schema } from "mongoose";

const fileSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is a required field!"],
            minLength: 1,
            trim: true
        },
        extension: {
            type: String,
            match: /^\.[a-zA-Z0-9_]{2,}$/
        },
        parentDirId: {
            type: Schema.Types.ObjectId,
            required: [true, "parentDirId is a required field!"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "userId is a required field!"],
        }
    },
    {
        strict: "throw",
        timestamps: true
    }
);

const File = model("File", fileSchema);

export default File;