import express from "express";

const app = express();
const PORT = 4000;

const middleWare = (req, res, next) => {
  if (req.protocol != "https") {
    console.log("Insecure");
  }
  console.log("Someone is trying to enter this url. ⛔");
  console.log(`Method: ${req.path}`);
  next();
};
const homeRes = (req, res) => {
  console.log("** This is the response for home. **");
  return res.send("<h1>Response for home Completed</h1>");
};
const loginRes = (req, res) => {
  console.log("** This is the response for login. **");
  return res.send("<h1>Response for login Completed</h1>");
};
app.use(middleWare);
app.get("/", homeRes);
app.get("/login", loginRes);

const handleListening = () =>
  console.log(`Server listening on http://localhost:${PORT}🌏`);
app.listen(PORT, handleListening);
