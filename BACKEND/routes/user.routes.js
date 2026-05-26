import express from "express";
import { getMe, login, logoutUser, registerUser, verifyUser } from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify", verifyUser);
router.post("/login", login);
router.get("/me", isLoggedIn, getMe);
router.get("/logout", isLoggedIn, logoutUser);


export default router;