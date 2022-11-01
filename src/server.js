import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter.js";
import videoRouter from "./routers/videoRouter.js";
import userRouter from "./routers/uesrRouter.js";

const app = express();
const PORT = 4000;
const logger = morgan("dev");

app.set("view engine", "pug");
app.use(logger);
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

const handleListening = () =>
  console.log(`Server listening on http://localhost:${PORT}🌏`);
app.listen(PORT, handleListening);
