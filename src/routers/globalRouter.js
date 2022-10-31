import express from "express";
import { goToHome } from "../controllers/globalCont.js";
import { goToJoin, goToLogin } from "../controllers/userCont.js";
import { goToSearch } from "../controllers/videoCont.js";

const globalRouter = express.Router();

globalRouter.get("/", goToHome);
globalRouter.get("/join", goToJoin);
globalRouter.get("/login", goToLogin);
globalRouter.get("/search", goToSearch);

export default globalRouter;
