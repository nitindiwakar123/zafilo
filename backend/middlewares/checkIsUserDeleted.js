import User from "../models/userModel.js";

export default async function checkIsUserDeleted(req, res, next) {
    const userId = req.user?._id;
    const user = await User.findById(userId).select("-_id isDeleted").lean();
    // console.log("deleted: ", user.isDeleted);
    if (user.isDeleted === true) return res.status(403).json({ success: false, message: "User is deleted Contact Our team for Recovery!", error: "User deleted!" });
    next();
}