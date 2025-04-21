const mongoose = require("mongoose");

const mongoDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};
module.exports = mongoDB

