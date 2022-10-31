export const goToSearch = (req, res, next) => {
  return res.send(`<h1>Search a Video</h1>`);
};
export const goToUploadVideo = (req, res, next) => {
  return res.send(`<h1>Upload a Video</h1>`);
};
export const goToVideo = (req, res, next) => {
  return res.send(`<h1>Video ID: ${req.params.id}</h1>`);
};
export const goToEditVideo = (req, res, next) => {
  return res.send(`<h1>Edit Video ID: ${req.params.id}</h1>`);
};
export const goToDeleteVideo = (req, res, next) => {
  return res.send(`<h1>Delete Video ID: ${req.params.id}</h1>`);
};
