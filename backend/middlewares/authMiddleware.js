import User from "../models/userModel.js";
import { signedCookie } from "cookie-parser";



export default async function checkAuth(req, res, next) {
  const { token } = req.signedCookies;
  if (!token) {
    res.clearCookie("token", {
      httpOnly: true,
    });
    return res.status(401).json({ error: "Not logged in!" });
  }
  const { id, expiry: expiryTimeInSeconds } = JSON.parse(Buffer.from(token, "base64url"));

  const currentTimeInSeconds = Math.round(Date.now() / 1000);

  // console.log("currentTime: ", new Date(currentTimeInSeconds * 1000).toString());
  // console.log("expiryTime: ", new Date(expiryTimeInSeconds * 1000).toString());

  if (currentTimeInSeconds > expiryTimeInSeconds) {
    res.clearCookie("token", {
      httpOnly: true,
    });
    return res.status(401).json({ error: "login session expired!" });
  }

  const user = await User.findOne({ _id: id }).lean();
  if (!user) {
    return res.status(401).json({ error: "user not found!" });
  }
  req.user = user;
  next();
}
