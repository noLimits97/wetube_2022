import express from "express";
import {
  getUpload,
  postUpload,
  getEdit,
  postEdit,
  getWatch,
  getDelete,
} from "../controllers/videoControllers.js";
import {
  videosUploadMiddleware,
  userOnlyMiddleware,
} from "../middlewares/middlewares.js";

const videoRouter = express.Router();

videoRouter.get("/:id([a-z0-9]{24})", getWatch);
videoRouter
  .route("/:id([a-z0-9]{24})/edit")
  .all(userOnlyMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/upload")
  .all(userOnlyMiddleware)
  .get(getUpload)
  .post(videosUploadMiddleware.single("video"), postUpload);
videoRouter.all(userOnlyMiddleware).get("/:id([a-z0-9]{24})/delete", getDelete);

export default videoRouter;
