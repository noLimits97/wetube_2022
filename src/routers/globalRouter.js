import express from "express";
import { getHome } from "../controllers/globalConts.js";
import { getSignUp, getLogin } from "../controllers/userConts.js";

const globalRouter = express.Router();

globalRouter.get("/", getHome);
globalRouter.get("/signup", getSignUp);
globalRouter.get("/login", getLogin);

export default globalRouter;
