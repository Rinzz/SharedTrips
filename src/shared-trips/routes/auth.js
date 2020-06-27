const { Router } = require("express");
const {
  saveUser,
  verifyUser,
  guestAccess,
  getUserStatus,
} = require("../handlers/auth");

const router = Router();

router.get("/login", guestAccess, getUserStatus, (req, res) => {
  res.render("users/login", {
    isLoggedIn: req.isLoggedIn
  });
});

router.get("/register", guestAccess, getUserStatus, (req, res) => {
  res.render("users/register", {
    isLoggedIn: req.isLoggedIn,
  });
});

router.post("/register", async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 3 || !password.match(/^[A-Za-z0-9]+$/)) {
    return res.render("users/register", {
      error: "Username or password is not valid",
    });
  }

  const { error } = await saveUser(req, res);

  if (error) {
    console.log(error);
    return res.render("users/register", {
      error: "Username or password is not valid",
    });
  }

  res.redirect("/");
});

router.post("/login", async (req, res) => {
  const { error } = await verifyUser(req, res);

  if (error) {
    return res.render("users/login", {
      error: "Email or password is not correct",
    });
  }

  res.redirect("/");
});

router.get("/logout",async (req, res) => {
  res.clearCookie("auth-cookie", {
    path: "/",
  });
  res.redirect("/");
});

module.exports = router;
