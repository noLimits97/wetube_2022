export const getSignUp = (req, res, next) => {
  return res.render("users/signUp.pug", { pageTitle: "SignUp" });
};
export const getLogin = (req, res, next) => {
  return res.render("users/login.pug", { pageTitle: "Login" });
};
export const getLogout = (req, res, next) => {
  return res.render("users/logout.pug", { pageTitle: "Logout" });
};
export const getProfile = (req, res, next) => {
  const { id } = req.params;
  return res.render("users/profile.pug", { pageTitle: `profile #${id}` });
};
export const getEditProfile = (req, res, next) => {
  return res.render("users/editProfile.pug", { pageTitle: "Home" });
};
