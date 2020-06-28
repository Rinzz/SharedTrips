const env = process.env.NODE_ENV;

const jwt = require("jsonwebtoken");
const config = require("../config/config")[env];
const bcrypt = require("bcrypt");
const User = require("../models/user");

const generateToken = (data) => {
  const token = jwt.sign(data, config.privateKey);

  return token;
};

const saveUser = async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = new User({
      email,
      password: hashedPassword,
    });

    const userObject = await user.save();

    const token = generateToken({
      userID: userObject._id,
      username: userObject.username,
    });

    res.cookie("auth-cookie", token);

    return token;
  } catch (err) {
    return {
      error: true,
      message: err,
    };
  }
};

const verifyUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        error: true,
        message: "There is no such user",
      };
    }
    const status = await bcrypt.compare(password, user.password);
    if (status) {
      const token = generateToken({
        userID: user._id,
        username: user.username,
      });

      res.cookie("auth-cookie", token);
    }

    return {
      error: !status,
      message: status || "Wrong password",
    };
  } catch (err) {
    return {
      error: true,
      message: "There is no such user",
      status,
    };
  }
};

const verifyAuthAccess = (req, res, next) => {
  const token = req.cookies["auth-cookie"];
  if (!token) {
    return res.redirect("/");
  }

  try {
    jwt.verify(token, config.privateKey);
    next();
  } catch (err) {
    return res.redirect("/");
  }
};

const guestAccess = (req, res, next) => {
  const token = req.cookies["auth-cookie"];
  if (token) {
    return res.redirect("/");
  }
  next();
};

const getUserStatus = async (req, res, next) => {
  const token = req.cookies["auth-cookie"];
  if (!token) {
    req.isLoggedIn = false;
  }

  try {
    await jwt.verify(token, config.privateKey, async (err, user) => {
      req.user = await User.findById(user.userID).lean();
    });
    req.isLoggedIn = true;
  } catch (err) {
    req.isLoggedIn = false;
  }
  next();
};

const verifyIsCreator = (req, res, next) => {
  req.isCreator = req.user._id.toString() === req.trip.creator.toString()
  console.log(req.isCreator)
  next()
}

module.exports = {
  saveUser,
  verifyUser,
  verifyAuthAccess,
  guestAccess,
  getUserStatus,
  verifyIsCreator
};
