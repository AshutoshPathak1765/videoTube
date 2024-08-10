import { Router } from "express";
import {
  deleteUser,
  dislikeVideo,
  getUser,
  likeVideo,
  subscribeChannel,
  unsubscribeChannel,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// unprotected routes
// get a user
router.get("/get/:id", getUser);

// protected routes
// update a user
router.patch("/find/:id", verifyJWT, updateUser);
// delete a user
router.delete("/delete/:id", verifyJWT, deleteUser);
// subscribe a user
router.patch("/sub/:id", verifyJWT, subscribeChannel);
// unsubscribe a user
router.patch("/unsub/:id", verifyJWT, unsubscribeChannel);
// like a video
router.patch("/like/:videoId", verifyJWT, likeVideo);
// dislike a video
router.patch("/dislike/:videoId", verifyJWT, dislikeVideo);

export default router;
