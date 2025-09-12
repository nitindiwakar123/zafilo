import { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is a required field!"],
            minLength: [3, "name should be contain atleast 3 characters!"],
            maxLength: [20, "name should not be larger than 20 characters!"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "email is a required field!"],
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "please enter a valid email!"],
            trim: true
        },
        password: {
            type: String,
            required: [true, "password is a required field!"],
            minLength: 8,
            match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "at least 8 characters with upper, lower, number, symbol."]
        },
        rootDirId: {
            type: Schema.Types.ObjectId,
            required: [true, "rootDirId is a required field!"],
        },
        profilePic: {
            type: String,
            match: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
        }
    },
    {
        strict: "throw",
        timestamps: true
    }
);

const User = model("User", userSchema);

export default User;