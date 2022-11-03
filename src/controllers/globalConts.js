export const getHome = (req, res, next) => {
  return res.render("home.pug", { pageTitle: "Home" });
};
