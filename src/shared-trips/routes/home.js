const { Router } = require("express");
const { getUserStatus, verifyAuthAccess } = require("../handlers/auth");

const router = Router();

router.get("/", getUserStatus, (req, res) => {
  if (req.user) {
    return res.render("home/home", {
      isLoggedIn: req.isLoggedIn,
      userEmail: req.user.email,
    });
  }
  res.render("home/home")
});

module.exports = router;
