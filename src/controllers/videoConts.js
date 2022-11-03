export const getVideo = (req, res, next) => {
  const { id } = req.params;
  return res.render("videos/video.pug", { pageTitle: `Video #${id}` });
};
export const getUploadVideo = (req, res, next) => {
  return res.render("videos/uploadVideo.pug", { pageTitle: "Upload Video" });
};
export const getEditVideo = (req, res, next) => {
  const { id } = req.params;
  return res.render("videos/editVideo.pug", { pageTitle: `Edit Video #${id}` });
};
