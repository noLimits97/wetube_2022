import express from "express";
import {
  getUploadVideo,
  getVideo,
  getEditVideo,
} from "../controllers/videoConts.js";

const videoRouter = express.Router();

videoRouter.get("/upload", getUploadVideo);
videoRouter.get("/:id", getVideo);
videoRouter.get("/:id/edit", getEditVideo);

export default videoRouter;
