import express from "express";
import {
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
} from "../controllers/userControllers.js";
import { Home, Search } from "../controllers/videoControllers.js";
import {
  publicOnlyMiddeleware,
  userOnlyMiddleware,
} from "../middlewares/middlewares.js";

const globalRouter = express.Router();

globalRouter.get("/", Home);
globalRouter
  .route("/signup")
  .all(publicOnlyMiddeleware)
  .get(getSignUp)
  .post(postSignUp);
globalRouter
  .route("/login")
  .all(publicOnlyMiddeleware)
  .get(getLogin)
  .post(postLogin);
globalRouter.get("/search", Search);

export default globalRouter;
