import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideo,
  addView,
  deleteVideo,
  getVideo,
  getVideoBySearch,
  getVideoByTags,
  randomVideos,
  subVideos,
  trendingVideos,
  updateVideo,
} from "../controllers/video.controller.js";
const router = Router();

// unprotected routes

// get a video
router.get("/find/:id",getVideo);
// view a video
router.patch("/view/:id", addView);
// trend video
router.get("/trend", trendingVideos);
// random video
router.get("/random", randomVideos);
// find video by tags
router.get("/tags", getVideoByTags);
// find video by search
router.get("/search", getVideoBySearch);

// protected routes

// add a video
router.post("/add", verifyJWT, addVideo);
// delete a video
router.delete("/delete/:id", verifyJWT, deleteVideo);
// update a video
router.patch("/update/:id", verifyJWT, updateVideo);
// subscribed video
router.get("/sub", verifyJWT, subVideos);

export default router;
