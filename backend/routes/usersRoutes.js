import express from "express";
import { getAllUsers, logoutById, deleteById } from "../controllers/usersController.js";
import checkRole from "../middlewares/checkRole.js";

const router = express.Router();

router.route("/").get(checkRole, getAllUsers);
router.route("/:id").post(checkRole, logoutById).delete(deleteById);

export default router;