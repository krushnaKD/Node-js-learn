const mongoose = require("mongoose");

const mongoDB = async () => {
  await mongoose.connect(
    "mongodb+srv://kdmongo05:eTv7xPeIVBL56PLe@nodejslearn.zxnts.mongodb.net/devTinder"
  );
};
module.exports = mongoDB

