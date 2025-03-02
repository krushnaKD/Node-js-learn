const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
     return  res.status(401).send("please Login !");
    }

    const decodeData = await jwt.verify(token, "Dev@Tinder$431");

    const { _id } = decodeData;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User Invalid");
    }
    req.user = user;

    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  userAuth,
};
