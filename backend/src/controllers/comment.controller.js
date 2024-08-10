import Comment from "../models/comment.model.js";
import Video from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async (req, res) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  await newComment.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment added successfully!"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  const video = await Video.findById(req.params.id);
  if (!comment || !video) {
    throw new ApiError(404, "Not found!");
  }
  if (req.params.id === comment.userId || req.params.id === video.userId) {
    await Comment.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "The comment has been deleted"));
  } else throw new ApiError(403, "You can delete only your comment!");
});

const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ videoId: req.params.videoId });
  return res.status(200).json(new ApiResponse(200, comments));
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    throw new ApiError(404, "Comment doesn't exist!");
  }
  if (req.user.id === comment.userId) {
    const updatedCommment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        $set: req.body,
      },
      { new: true }
    );
    console.log(updatedCommment);
    return res
      .status(200)
      .json(
        new ApiResponse(200, updateComment, "Comment updated successfully!")
      );
  } else throw new ApiError(403, "You can only update your comment!");
});

export { addComment, deleteComment, getComments, updateComment };
