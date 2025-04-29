const mongoose = require("mongoose");
var validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
          throw new Error("email is not valid" + value);
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg",
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
    about:{
      type:String,
      default:"this is default about"
    },
    isPremium:{
      type:Boolean,
      default:false
    },
    membershiptype:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$431", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.Validatepass = async function (password) {
  const user = this;

  const isPasswordCorrect = await bcrypt.compare(password, this.password);

  return isPasswordCorrect;
};

module.exports = mongoose.model("User", userSchema);
