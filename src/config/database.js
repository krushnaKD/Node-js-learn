const mongoose = require("mongoose");
require("dotenv").config()
const mongoDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};
module.exports = mongoDB

