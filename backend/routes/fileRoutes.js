import express from "express";
import validateId from "../middlewares/validateIdMiddleware.js";
import { createFile, deleteFile, getFile, renameFile, deleteFiles } from "../controllers/fileController.js";

const router = express.Router();

router.param("id", validateId);
router.param("parentDirId", validateId);

router.route("/{:parentDirId}").post(createFile);
router.route("/delete-multiple/{:parentDirId}").delete(deleteFiles);
router.route("/:id").get(getFile).patch(renameFile).delete(deleteFile);

export default router;