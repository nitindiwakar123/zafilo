import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import { changeProfile, getCurrentUser, getCurrentUserProfile, loginVerifyOtp, registerVerifyOtp, userLogin, userLogout, userLogoutFromAllDevices, userRegister, userSendOtp, googleAuth } from "../controllers/userController.js";
import checkIsUserDeleted from "../middlewares/checkIsUserDeleted.js";

const router = express.Router();

router.get("/", checkAuth, checkIsUserDeleted, getCurrentUser);

router.post("/send-otp", userSendOtp);

router.post("/register/verify-otp", registerVerifyOtp);

router.post("/login/verify-otp", loginVerifyOtp);

router.post("/register", userRegister);

router.post("/login", userLogin);

router.post("/logout", userLogout);

router.route("/profile-pic")
    .get(checkAuth, checkIsUserDeleted, getCurrentUserProfile)
    .patch(checkAuth, checkIsUserDeleted, changeProfile);

router.post("/logout-all", checkAuth, checkIsUserDeleted, userLogoutFromAllDevices);

router.post("/auth/google", googleAuth);

export default router;