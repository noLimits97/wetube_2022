import express from "express";
/* #15.0 FLash Messages 
  (1) npm i express-flash
  (2) add "app.use(flash())" in server.js, and thenn, add "req.flash(text)" in js files where you want to show messages.
*/
import flash from "express-flash";
import session from "express-session";
/* #7.12 Mongo Store
  connect-mongo는 session을 DB에 저장하는 데 필요한 모듈이다.
  Session data는 Cookie에 session ID만을 전달하고, data 자체는 server에 저장된다. 또한 저장된 data의 server-side storage는 memoryStore로
  배포나 상업 목적의 프로그램에는 권장되지 않는다. 대신 DB를 이용한 sessionStore를 이용하라.
 */
import MongoStore from "connect-mongo";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter.js";
import videoRouter from "./routers/videoRouter.js";
import userRouter from "./routers/uesrRouter.js";
import apiRouter from "./routers/apiRouters.js";
import { localsMiddleware } from "./middlewares/middlewares.js";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  /* 
  (1) 백엔드는 req하는 client를 기억한다.
  (2) 백엔드는 브라우저를 통해 client에게 session id가 담긴 cookie를 전달하고, client가 접속할 때마다 session id를 건네받는 방식으로 client를 기억한다.
  (3) 정보를 저장하기 위해 session을 사용한다. session은 서버에 저장되며, 브라우저와 백엔드 사이 memory(or history) 역할을 한다.
  (4) session을 사용하면 웹 브라우저가 상태를 유지할 수 있다.
  (5) Cookie는 client에, session은 server에 저장된다.
  */
  session({
    secret: process.env.COOKIE_SECRET, // session hijacking 등을 피하기 위한 signature에 사용되는 string
    // 모든 session을 저장하게 되면 보다 큰 DB가 필요해지므로, 'req.session.user' 또는 'req.session.loggedIn'처럼

    resave: false,
    saveUninitialized: false,
    // 이 부분을 지우면 session이 다시 server-side에 저장된다. session이 server에 저장되면, server가 재시작될 때마다 session이 초기화된다.
    // 면 보다 큰 DB가 필요해지므로, 'req.session.user' 또는 'req.session.logge
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(localsMiddleware);
/*
# 8.8 Static Files and Recap: What is 'express.static(root, [ooptions])'?
: Static files를 제공하는 express의 built-in middleware이다. root에는 static assets이 제공될 root directory를 명시해야 한다.
*/
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets")); // "/static" 페이지에서 assets에 포함된 파일들을 확인할 수 있다.
// #14.2 fix sharedArrayBuffer
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
// app.use(flash());
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);
app.use("/api", apiRouter);

export default app;
