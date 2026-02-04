import { Resend } from "resend";
import OTP from "../models/otpModel.js";
import { config } from "../config/config.js";

const resend = new Resend(config.resendApiKey);

export async function sendOtpService(email) {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await OTP.findOneAndUpdate(
        { email },
        { otp, createdAt: new Date() },
        { upsert: true }
    );

    const html = `
    <div style="font-family:sans-serif;">
      <h2>Your OTP is: ${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `;

    const result = await resend.emails.send({
        from: 'Zafilo <otp@nitin-dev.tech>',
        to: email,
        subject: 'Zafilo Otp for Email Verification',
        html,
    });

    if (result.error) {
        return { success: false, error: `OTP not sent, something went wrong!` };
    }

    return { success: true, message: `OTP sent successfully on ${email}` };

}