import express from "express";
import {
  goToLogout,
  goToPf,
  goToEditPf,
  goToDeletePf,
} from "../controllers/userConts.js";

const userRouter = express.Router();

userRouter.get("/logout", goToLogout);
userRouter.get("/:id", goToPf);
userRouter.get("/:id/edit", goToEditPf);
userRouter.get("/:id/delete", goToDeletePf);

export default userRouter;
