import express from "express";
import {
  getUserProfile,
  getEditUserProfile,
  postEditUserProfile,
  startGithubLogin,
  finishGithubLogin,
  getLogout,
  getChangePassword,
  postChangePassword,
} from "../controllers/userControllers.js";
import {
  imagesUploadMiddleware,
  publicOnlyMiddeleware,
  userOnlyMiddleware,
} from "../middlewares/middlewares.js";

const userRouter = express.Router();

userRouter
  .route("/:id([a-z0-9]{24})")
  .all(userOnlyMiddleware)
  .get(getUserProfile);
userRouter.get("/github/startLogin", publicOnlyMiddeleware, startGithubLogin);
userRouter.get("/github/finishLogin", publicOnlyMiddeleware, finishGithubLogin);
userRouter.get("/logout", userOnlyMiddleware, getLogout);
userRouter
  .route("/edit")
  .all(userOnlyMiddleware)
  .get(getEditUserProfile)
  .post(imagesUploadMiddleware.single("avatar"), postEditUserProfile);
userRouter
  .route("/changePassword")
  .all(userOnlyMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
export default userRouter;
