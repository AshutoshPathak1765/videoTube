import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;
  if ([name, email, password].some((field) => field?.trim() === ""))
    throw new ApiError(400, "All fields are required");
  const existedUser = await User.findOne({
    $or: [{ email }, { name }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  const newUser = new User({
    ...req.body,
    name: name.trim(),
    email: email.trim(),
    password: password.trim(),
  });
  await newUser.save();
  return res
    .status(200)
    .json(new ApiResponse(200, newUser, "User created successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
  // console.log(req.body);
  if (!req.body.name || !req.body.password)
    throw new ApiError(400, "name or password are required!");
  const user = await User.findOne({
    name: req.body.name.trim(),
  });
  if (!user) throw new ApiError(404, "User not found!");
  const isPasswordCorrect = await user.isPasswordCorrect(req.body.password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid user credentials");
  const accessToken = user.generateAccessToken();
  const options = {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  };
  const { password, ...others } = user._doc;
  others.token = accessToken;
  return res
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, others, "User Logged In Successfully!"));
});

const googleAuth = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const accessToken = user.generateAccessToken();
    const options = {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    };
    user._doc.token = accessToken;
    return res
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, user._doc, "User Logged In Successfully!"));
  } else {
    const newUser = new User({
      ...req.body,
      fromGoogle: true,
    });
    const savedUser = await newUser.save();
    const accessToken = savedUser.generateAccessToken();
    const options = {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    };
    savedUser._doc.token = accessToken;
    return res
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(200, savedUser._doc, "User Logged In Successfully!")
      );
  }
});

export { registerUser, loginUser, googleAuth };
