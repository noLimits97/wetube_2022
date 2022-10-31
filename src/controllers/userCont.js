export const goToJoin = (req, res, next) => {
  return res.send(`<h1>Join</h1>`);
};
export const goToLogin = (req, res, next) => {
  return res.send(`<h1>Login</h1>`);
};
export const goToLogout = (req, res, next) => {
  return res.send(`<h1>Logout ID: ${req.params.id}</h1>`);
};
export const goToPf = (req, res, next) => {
  return res.send(`<h1>ID: ${req.params.id}</h1>`);
};
export const goToEditPf = (req, res, next) => {
  return res.send(`<h1>Edit ID: ${req.params.id}</h1>`);
};
export const goToDeletePf = (req, res, next) => {
  return res.send(`<h1>Delete ID: ${req.params.id}</h1>`);
};
