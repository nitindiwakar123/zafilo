import { model, Schema } from "mongoose";

const otpSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "email is a required field!"],
            unique: true,
        },
        otp: {
            type: Number,
            required: [true, "Otp is a required field!"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60 * 5,
        }
    },
    {
        strict: "throw",
    }
);

const OTP = model("OTP", otpSchema);

export default OTP;