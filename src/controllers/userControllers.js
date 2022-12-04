import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import fetch from "cross-fetch";

export const getSignUp = (req, res) => {
  return res.render("user/signUp");
};
export const postSignUp = async (req, res) => {
  // Make sure that there is no overlapped nickname or email.
  // Add a process to confirm password.
  const { email, username, realname, password, _password, location } = req.body;
  const passwordMatch = password === _password ? true : false;
  if (!passwordMatch) {
    return res.status(400).render("user/signUp", {
      errorMessage: "Password does not match",
    });
  }
  const existingEmail = await User.exists({ email });
  if (existingEmail) {
    return res.status(400).render("user/signUp", {
      errorMessage: "This email is already in use",
    });
  }
  const existingUsername = await User.exists({ username });
  if (existingUsername) {
    return res.status(400).render("user/signUp", {
      errorMessage: "This username is already in use",
    });
  }
  await User.create({ email, username, realname, password, location });
  return res.redirect("/login");
};

/*
  #7.5-7.6 Login
  DB에는 hashing된 암호가 저장되어 있다. 따라서, user가 입력한 암호도 hashing하여 비교해야 한다. 
*/
export const getLogin = (req, res) => {
  return res.render("user/login");
};
export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, socialLogin: false });
  if (!user) {
    return res.status(400).render("user/login");
  }
  const comparePW = await bcrypt.compare(password, user.password);
  if (!comparePW) {
    return res.status(400).render("user/login");
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const getLogout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENTID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const urlParams = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${urlParams}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENTID,
    client_secret: "fccf1c1bda07a8093dbda047acdac92d1e1eb327",
    //res.redirect된 url의 query에 포함된 code attribute
    code: req.query.code,
  };
  const urlParams = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${urlParams}`;
  /* npm i cross-fetch
NodeJS에는 fetch가 내장되어 있지 않아, 따로 설치할 필요가 있다. node-fetch Ver.3부터는 ESM에만 fetch를 사용할 수 있고, 
CSM과는 호환되지 않으므로 대신 cross-fetch를 설치하자.
*/
  const response = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in response) {
    const { access_token } = response;
    const apiUrl = "https://api.github.com";
    const userIdentity = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userIdentity);
    const userEmailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = userEmailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userIdentity.avatar_url,
        email: emailObj.email,
        username: userIdentity.login,
        realname: userIdentity.name ? userIdentity.name : "Unknown",
        password: "", //required=false
        socialLogin: true,
        location: userIdentity.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  }
};

export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    console.log("User Not Found");
    return res.status(404).render("404");
  }
  return res.render("user/profile", { user });
};
export const getEditUserProfile = (req, res) => {
  return res.render("user/edit");
};
export const postEditUserProfile = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl, username },
    },
    body: { _username, _location },
    file,
  } = req;
  //////////////////// Validity Check /////////////////////
  if (username !== _username) {
    const foundUser = await User.findOne({ username: _username });
    if (foundUser && foundUser._id.toString() !== _id) {
      return res.status(400).render("user/edit", {
        errorMessage: "This username is already in use.",
      });
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      username: _username,
      location: _location,
    },
    { new: true }
  );
  console.log("Updated!");
  //////////////////// Validity Check /////////////////////
  req.session.user = updatedUser;
  return res.redirect("/user/edit");
};

export const getChangePassword = (req, res) => {
  return res.render("user/changePassword");
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, _newPassword },
  } = req;
  const user = await User.findById(_id);
  const comparePW = await bcrypt.compare(oldPassword, user.password);
  if (!comparePW) {
    console.log("Password incorrect");
    return res.status(400).render("user/changePassword");
  }
  if (newPassword !== _newPassword) {
    console.log("Password doesn't match");
    return res.status(400).render("user/changePassword");
  }
  user.password = newPassword;
  // pre("save") middleware를 동작시키기 위함
  user.save();

  return res.redirect("/user/logout");
};
