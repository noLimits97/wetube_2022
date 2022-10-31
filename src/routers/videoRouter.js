import express from "express";
import {
  goToUploadVideo,
  goToVideo,
  goToEditVideo,
  goToDeleteVideo,
} from "../controllers/videoCont.js";

const videoRouter = express.Router();

videoRouter.get("/upload", goToUploadVideo);
videoRouter.get("/:id", goToVideo);
videoRouter.get("/:id/edit", goToEditVideo);
videoRouter.get("/:id/delete", goToDeleteVideo);

export default videoRouter;
