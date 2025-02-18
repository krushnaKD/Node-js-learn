const express = require("express");
const mongoDB = require("./config/database");
const User = require("./models/user");
const user = require("./models/user");
const { SignupValidation } = require("./utils/Validatons");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signUp", async (req, res) => {
  try {
    SignupValidation(req);

    const { firstName, lastName, emailID, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailID,
      password: passwordHash,
    });

    await user.save();
    res.send("added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID: emailID });
    if (!user) {
      throw new Error("User Doesn't Exist");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {

      const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$431");
      console.log("gg" + token);

      res.cookie("token", token);

      res.send("logged in Succesfully");
    } else {
      throw new Error("password is Wrong");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", async (req, res) => {
  const cookies = req.cookies;
  const { token } = cookies;

  if(!token){
    throw new Error("Invalid token");
    
  }

  const decodemassage = await jwt.verify(token, "Dev@Tinder$431");

  const { _id } = decodemassage;
  const user = await User.findById(_id);

  if (!user) {
    throw new Error("Invalid data");
  }

  res.send(user);
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailID;

  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    console.log("something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.log("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user Deleted");
  } catch (error) {
    res.status(404).send("something went wrong");
  }
});

app.patch("/user/:userID", async (req, res) => {
  const userId = req.params?.userID;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    const ALLOWED_UPDATES = ["age", "gender", "photoUrl", "skills"];

    const isUpdateallowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateallowed) {
      throw new Error("Update not allowed");
    }
    if (data.skills.length > 5) {
      throw new Error("Skills should be maximum 5");
    }
    res.send("user updated");
  } catch (error) {
    res.status(404).send("Update failed:" + error.message);
  }
});

mongoDB()
  .then(() => {
    console.log("connected succesfully");
    app.listen(3000, () => {
      console.log("req is listen on 3000");
    });
  })
  .catch((err) => {
    console.log("not Connected");
  });
