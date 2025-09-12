import { model, Schema } from "mongoose";

const directorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is a required field!"],
            minLength: 1,
            maxLength: 50,
            trim: true
        },
        parentDirId: {
            type: Schema.Types.ObjectId,
            required() {
                return !this.name.startsWith("root-");
            },
            default: null
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

const Directory = model("Directory", directorySchema);

export default Directory;