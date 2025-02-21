const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validatedit, Validatepass } = require("../utils/Validatons");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  const user = req.user;

  res.send(user);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validatedit(req)) {
      throw new Error("Invalid Edit");
    }
    const loggedIn = req.user;

    Object.keys(req.body).forEach((key) => (loggedIn[key] = req.body[key]));

    res.json({
      message: `${loggedIn.firstName} you profile is Updated`,
      Data: loggedIn,
    });
    await loggedIn.save();
  } catch (error) {
    res.status(400).send("Invalid request" + error.massage);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!Validatepass(req)) {
      throw new Error("Something went Wrong");
    }

    const newPassword = req.body.newPassword;
    const loggedIn = req.user;
    const newpasshash = await bcrypt.hash(newPassword, 10);

    loggedIn.password = newpasshash;

    await loggedIn.save();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
