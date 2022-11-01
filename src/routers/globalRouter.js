import express from "express";
import { goToHome } from "../controllers/globalConts.js";
import { goToJoin, goToLogin } from "../controllers/userConts.js";
import { goToSearch } from "../controllers/videoConts.js";

const globalRouter = express.Router();

globalRouter.get("/", goToHome);
globalRouter.get("/join", goToJoin);
globalRouter.get("/login", goToLogin);
globalRouter.get("/search", goToSearch);

export default globalRouter;
