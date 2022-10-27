import express from "express";
import morgan from "morgan";

const app = express();
const PORT = 4000;
const logger = morgan("dev");

const middleware = (req, res, next) => {
  if (req.protocol != "https") {
    console.log("Insecure");
  }
  console.log("Someone is trying to enter this url. ⛔");
  next();
};
const handleHome = (req, res) => {
  console.log("** This is the response for home. **");
  return res.send("<h1>Response for home Completed</h1>");
};
const handleLogin = (req, res) => {
  console.log("** This is the response for login. **");
  return res.send("<h1>Response for login Completed</h1>");
};
app.use(middleware, logger);
app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`Server listening on http://localhost:${PORT}🌏`);
app.listen(PORT, handleListening);
