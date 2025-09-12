import express from "express";
import validateId from "../middlewares/validateIdMiddleware.js";
import { createDirectory, deleteDirectory, getDirectory, renameDirectory } from "../controllers/directoryController.js";

const router = express.Router();

router.param("id", validateId);
router.param("parentDirId", validateId);

router.route("/{:id}").get(getDirectory).patch(renameDirectory).delete(deleteDirectory);
router.route("/{:parentDirId}").post(createDirectory);

export default router;


// Serving Trash Directory Content
// router.get("/trash", async (req, res) => {
//     const contentList = await getDirectoryContent("./trash");
//     res.json(contentList);
// });
