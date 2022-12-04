import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  res.locals.siteName = "Flamestream";
  next();
};

export const userOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};
export const publicOnlyMiddeleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/");
  }
};
/*
# 8.6 File Uploads part 1: Create Multer middleware and then Add this middleware to edit router.
Multer middleware는 req obj에 file을 추가한다. 즉, req.file을 사용할 수 있다.

# 8.7 File Uploads part 2
: DB에는 절대로 파일을 저장해서는 안 된다. 대신 파일의 위치만을 DB에 저장할 뿐이다.

# 8.8 Static Files and Recap:
: 파일을 Server에 저장하는 것은 좋지 않다. Server가 종료됐을 때 여러가지 문제들이 발생하기 때문이다.
이 문제에 대한 해결 방법은 차후 Section에서...
*/
export const imagesUploadMiddleware = multer({
  dest: "uploads/images/",
  limits: {
    fileSize: 10000000,
  },
});
export const videosUploadMiddleware = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 50000000,
  },
});
