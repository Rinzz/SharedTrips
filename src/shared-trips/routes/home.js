const { Router } = require("express");
const { getUserStatus } = require("../handlers/users");

const router = Router();

router.get("/",getUserStatus, async (req, res) => {
  res.render("home/home", {
    isLoggedIn: req.isLoggedIn,
  });
});

module.exports = router;
