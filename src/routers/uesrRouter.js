import express from "express";
import {
  getLogout,
  getProfile,
  getEditProfile,
} from "../controllers/userConts.js";

const userRouter = express.Router();

userRouter.get("/logout", getLogout);
userRouter.get("/:id", getProfile);
userRouter.get("/:id/edit", getEditProfile);

export default userRouter;
