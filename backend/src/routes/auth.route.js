import { Router } from "express";
import {
  googleAuth,
  loginUser,
  registerUser,
} from "../controllers/auth.controller.js";

const router = Router();

// signup
router.post("/signup", registerUser);
// signin
router.post("/signin", loginUser);
// google auth
router.post("/google", googleAuth);

export default router;
