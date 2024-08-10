import { Router } from "express";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// unprotected routes
router.get("/:videoId", getComments);
// protected routes
// add a comment
router.post("/", verifyJWT, addComment);
// delete comment
router.delete("/:id", verifyJWT, deleteComment);
// update a comment
router.patch("/update/:commentId", verifyJWT, updateComment);

export default router;
