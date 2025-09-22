import { ObjectId } from "mongodb";
import User from "../models/userModel.js"

export default async function checkAuth(req, res, next) {
  const { uid } = req.cookies;
  if (!uid) {
    return res.status(401).json({ error: "Not logged in!" });
  }
  const {id, expiry} = JSON.parse(Buffer.from(uid, "base64url").toString());
  
  const currentTimeInSeconds = Math.round(Date.now() / 1000);

  // console.log("expiryTime: ", new Date(expiry * 1000).toString());
  // console.log("currentTime: ", new Date(currentTimeInSeconds * 1000).toString());

  if (currentTimeInSeconds > expiry) {
    res.clearCookie("uid", {
      httpOnly: true,
    });
    return res.status(401).json({ error: "login session expired!" });
  }

  const user = await User.findOne({ _id: id }).lean();
  if (!user) {
    return res.status(401).json({ error: "Not logged in!" });
  }
  req.user = user;
  next();
}
