import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const Home = async (req, res) => {
  const isHome = true;
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", isHome, videos });
};
/*
export const Home = (req, res) => {
  const isHome = true;
  console.log("Start!");
  Video.find({}, (error, videos) => {
    console.log("Complete!");
  });
  return res.render("home.pug", { pageTitle: "Home", isHome, videos });
};
>>>> Start!
>>>> ...render
>>>> Complete!
각 함수마다 실행이 완료되는 시간이 다른데다, JS가 싱글 스레드로 작업 처리를 하기 때문에 발생하는 문제이다.
이는 async, await처럼 비동기로 작업을 처리하는 코드를 추가하여 해결할 수 있다.
 */

export const getWatch = async (req, res) => {
  const isWatch = true;
  const { id } = req.params;
  // mongoose가 populate한 Object를 찾아 data를 가져 온다.
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.render("404", { pageTitle: "404 Error: Video Not Found" });
  }
  return res.render("video/watch", { video, isWatch });
};

export const getUpload = (req, res) => {
  return res.render("video/upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  // middleware가 fields일 떄는 req.files
  const {
    user: { _id },
  } = req.session;
  const { path: fileUrl } = req.file;
  const { title, description, hashtags } = req.body;
  try {
    // new 대신 create를 사용하면 Video.save(video)를 생략해도 된다.
    const createdVideo = await Video.create({
      owner: _id,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      vidUrl: fileUrl,
      /* 
      hashtags: hashtags
        .split(",")
        .map((hashtag) => (hashtag.startsWith("#") ? hashtag : `#${hashtag}`)),
      */
    });
    const user = await User.findById(_id);
    user.videos.push(createdVideo._id);
    user.save();
    createdVideo.vidUrl.replaceAll(/\\/g, "/");
    createdVideo.thumbUrl.replaceAll(/\\/g, "/");
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("video/upload");
  }
  // 일단 생성되면 MongoDB에서 자체적으로 id를 부여한다.
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404");
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("video/edit", { video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById({ id });
  if (!video) {
    return res.render("404");
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  // await video.save()를 생략할 수 있다.
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/video/${id}`);
};

export const getDelete = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  if (!video) {
    return res.render("404");
  }
  const video = await Video.findById({ id });
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  const user = await User.findById(_id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};

export const Search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`^${keyword}`, "i"),
      },
    });
  }
  return res.render("video/search", { pageTitle: "Search", videos });
};

export const increaseView = async (req, res) => {
  const { id } = req.params;
  try {
    await Video.findByIdAndUpdate(id, {
      views: views + 1,
    });
    // status만으로는 아무 것도 return 되지 않늗나.
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(404);
  }
};

export const attachComment = async (req, res) => {
  // console.log(req.params);
  // console.log(req.body);
  // console.log(req.body.text, req.body.rating);
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  const foundUser = await User.findById({ _id: loggedInUser._id }).populate(
    "comments"
  );
  if (!foundUser) {
    return res.sendStatus(404);
  }
  const createdComment = await Comment.create({
    owner: loggedInUser._id,
    video: id,
    text,
  });
  foundUser.comments.push(createdComment);
  foundUser.save();

  return res.sendStatus(201);
};
