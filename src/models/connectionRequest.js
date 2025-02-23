const mongoose = require("mongoose");

const connectionRequestdata = new mongoose.Schema(
  {
    fromuserID: {
      type: mongoose.Schema.Types.ObjectId
    },
    touserID: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "rejected", "intrested", "accepted"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestdata.pre("save",function (next){
  const connectionRequest = this;
  if(connectionRequest.fromuserID.equals(connectionRequest.touserID)){
    throw new Error("You Cannot send request to Yourself!")
  }
  next()
})


const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestdata)

module.exports = ConnectionRequestModel;