import { asyncHandler } from "../utils/asyncHandler.js";
import Video from "../models/video.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addVideo = asyncHandler(async (req, res) => {
  const video = new Video({
    ...req.body,
    userId: req.user.id,
  });
  const savedVideo = await video.save();
  if (!savedVideo)
    throw new ApiError(500, "Something went wrong while creating a new video!");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video created Successfully!"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) throw new ApiError(404, "Video not found!");
  if (req.user.id === video.userId) {
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video updated successfully!"));
  } else throw new ApiError(403, "You can update only your video!");
});

const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) throw new ApiError(404, "Video not found!");
  if (req.user.id === video.userId) {
    await Video.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video deleted successfully!"));
  } else throw new ApiError(403, "You can delete only your video!");
});

const getVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) throw new ApiError(404, "Video not found!");
  return res.status(200).json(new ApiResponse(200, video));
});

const addView = asyncHandler(async (req, res) => {
  const video = await Video.findByIdAndUpdate(req.params.id, {
    $inc: { views: 1 },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "view has been increased!"));
});

const trendingVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().sort({ views: -1 });
  return res.status(200).json(new ApiResponse(200, videos));
});

const randomVideos = asyncHandler(async (req, res) => {
  console.log("Node");
  const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
  return res.status(200).json(new ApiResponse(200, videos));
});

const subVideos = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const subscribedChannels = user.subscribedUsers;
  const list = await Promise.all(
    subscribedChannels.map((channelId) => {
      return Video.find({ userId: channelId });
    })
  );
  return res.status(200).json(
    new ApiResponse(
      200,
      list.flat().sort((a, b) => a.createdAt - b.createdAt)
    )
  );
});

const getVideoByTags = asyncHandler(async (req, res) => {
  const query = req.query.tags.split(",");
  console.log(query);
  const videos = await Video.find({ tags: { $in: query } }).limit(20);
  return res.status(200).json(new ApiResponse(200, videos));
});

const getVideoBySearch = asyncHandler(async (req, res) => {
  const query = req.query.q;
  const videos = await Video.find({
    title: { $regex: query, $options: "i" },
  }).limit(40);
  return res.status(200).json(new ApiResponse(200, videos));
});

export {
  addVideo,
  deleteVideo,
  getVideo,
  updateVideo,
  addView,
  randomVideos,
  trendingVideos,
  subVideos,
  getVideoBySearch,
  getVideoByTags,
};
