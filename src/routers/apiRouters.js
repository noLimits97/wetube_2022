/*
# 12.0 ~ 12.1  View Controller
There are some change in "apiRouters", videoControllers.js", "./client/js/videoPlayer.js"
*/

import express from "express";
import { increaseView, attachComment } from "../controllers/videoControllers";

const apiRouter = express.Router();

apiRouter.post("video/:id([0-9a-f]{24})/view", increaseView);
apiRouter.post("video/:id([0-9a-f]{24})/comment", attachComment);

export default apiRouter;
