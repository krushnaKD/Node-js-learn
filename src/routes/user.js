const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/request/receive", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      touserID: loggedInuser._id,
      status: "intrested",
    }).populate("fromuserID", ["firstName", "lastName"]);

    res.json({ message: "fetch data", data: connectionRequest });
  } catch (err) {
    res.send("ERROR :" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const logedInuser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { touserID: logedInuser._id, status: "accepted" },
        { fromuserID: logedInuser._id, status: "accepted" },
      ],
    })
      .populate("fromuserID", "firstName lastName age")
      .populate("touserID", "firstName lastName age");

    const data = connectionRequest.map((row) => {
      if (row.fromuserID._id.toString() === logedInuser._id.toString()) {
        return row.touserID;
      }
      return row.fromuserID;
    });

    res.json({ data });
  } catch (err) {
    res.send("ERROR :" + err.message);
  }
});

module.exports = userRouter;
