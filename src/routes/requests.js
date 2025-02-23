const express = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:touserId",
  userAuth,
  async (req, res) => {
    try {
      const fromuserID = req.user._id;
      const touserID = req.params.touserId;
      const status = req.params.status;

      const userInDb = await User.findById(touserID);

      if (!userInDb) {
        return res.status(400).json({ message: "In valid User" });
      }

      const allowedStatus = ["ignored", "intrested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "status is Invalide  " + status });
      }
  
      const existinguserInDB = await ConnectionRequestModel.findOne({
        $or: [
          { fromuserID, touserID },
          { fromuserID: touserID, touserID: fromuserID },
        ],
      });

      if (existinguserInDB) {
        return res
          .status(400)
          .json({ message: "Connection request is alredy exist!" });
      }

      const RequestData = new ConnectionRequestModel({
        fromuserID,
        touserID,
        status,
      });

      const data = await RequestData.save();
      res.json({
        massage: "Request send succsfully!",
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR :" + error.message);
    }
  }
);

module.exports = requestRouter;
