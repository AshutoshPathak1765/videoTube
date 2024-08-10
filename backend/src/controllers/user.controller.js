import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const updateUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, updateUser, "User updated successfuly!"));
  } else throw new ApiError(403, "You can update only your account!");
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedUser, "User has been deleted successfuly!")
      );
  } else throw new ApiError(403, "You can delete only your account!");
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found!");
  return res.status(200).json(new ApiResponse(200, user, "User found!"));
});

const subscribeChannel = asyncHandler(async (req, res) => {
  let user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { subscribedUsers: req.params.id },
    },
    {
      new: true,
    }
  );
  user = await User.findByIdAndUpdate(req.params.id, {
    $inc: { subscribers: 1 },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subscription Successful!"));
});

const unsubscribeChannel = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { subscribedUsers: req.params.id },
  });
  await User.findByIdAndUpdate(req.params.id, {
    $inc: { subscribers: -1 },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Unsubscription Successful!"));
});

const likeVideo = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  await Video.findByIdAndUpdate(videoId, {
    $addToSet: { likes: id },
    $pull: { dislikes: id },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video liked successfully!"));
});

const dislikeVideo = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  await Video.findByIdAndUpdate(videoId, {
    $addToSet: { dislikes: id },
    $pull: { likes: id },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video disliked successfully!"));
});

export {
  updateUser,
  deleteUser,
  getUser,
  likeVideo,
  dislikeVideo,
  subscribeChannel,
  unsubscribeChannel,
};
