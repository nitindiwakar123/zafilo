import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import { changeProfile, getCurrentUser, getCurrentUserProfile, userLogin, userLogout, userRegister } from "../controllers/userController.js";

const router = express.Router();

router.get("/", checkAuth, getCurrentUser);

router.post("/register", userRegister);

router.post("/login", userLogin);

router.post("/logout", userLogout);

router.route("/profile-pic")
    .get(checkAuth, getCurrentUserProfile)
    .patch(checkAuth, changeProfile)


export default router;