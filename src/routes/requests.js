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

requestRouter.post(
  "/request/receive/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedIn = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "this status is Not valid " + status });
      }

      const requsetuser = await ConnectionRequestModel.findOne({
        _id: requestId,
        touserID: loggedIn._id,
        status: "intrested",
      });

      if (!requsetuser) {
        return res.status(404).json({ message: "Invalid request!" });
      }

      requsetuser.status = status

      const data = await requsetuser.save();

      res.json({ message: "request accepted Succefully", data });
    } catch (error) {
      res.send("ERROR : " + error.message);
    }
  }
);

requestRouter.get("/feed",userAuth,async(req,res)=>{
  const loggedInuser = req.user;

  const page = parseInt(req.query.skip) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit>50 ? 50 : limit;
  const skip = (page-1)*limit;

  const connectionRequest = await ConnectionRequestModel.find({
    $or :[
      {fromuserID:loggedInuser._id},{touserID:loggedInuser._id}
    ]
  }).select("fromuserID touserID")

  const hideUserfromfeed = new Set();
  connectionRequest.forEach(req => {
    hideUserfromfeed.add(req.fromuserID.toString())
    hideUserfromfeed.add(req.touserID.toString())
  });

const users = await User.find({
  $and:[
    {_id:{$nin:Array.from(hideUserfromfeed)}},
    {_id:{$ne:loggedInuser._id}}
  ]
}).select("firstName lastName age photoUrl").skip(skip).limit(limit)  
 
  res.json({users})

})

module.exports = requestRouter;
