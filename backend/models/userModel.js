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
            unique: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "please enter a valid email!"],
            trim: true
        },
        authStrategy: {
            type: String,
            enum: ['local', 'oidc', 'both'],
            required: true
        },
        oidcId: { type: String },
        password: {
            type: String,
            required: function () { return this.authStrategy === 'local'; }
        },
        rootDirId: {
            type: Schema.Types.ObjectId,
            required: [true, "rootDirId is a required field!"],
        },
        profilePic: {
            type: String,
        },
        role: {
            type: String,
            enum: ['admin', 'manager', 'user'],
            default: 'user'
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        strict: "throw",
        timestamps: true
    }
);

const User = model("User", userSchema);

export default User;