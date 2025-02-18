const mongoose = require("mongoose");
var validator = require("validator");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "femal", "other"].includes(value)) {
          throw new Error("data is not valid");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    emailID: {
      type: String,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid"+value);
        }
      },
    },
    photoUrl: {
      type: String,
      default: "abc.png",
    },
    password: {
      type: String,
      require: true,
      unique: true,
      minLength: 4,
    },
    skills: {
      type: [],
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("User", userSchema);
