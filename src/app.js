const express = require("express");
const mongoDB = require("./config/database");
const { SignupValidation } = require("./utils/Validatons");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests")


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);



// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailID;

//   try {
//     const users = await User.find({});

//     res.send(users);
//   } catch (err) {
//     console.log("something went wrong");
//   }
// });

// app.get("/feed", userAuth, async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (error) {
//     console.log("something went wrong");
//   }
// });

// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;

//   try {
//     const user = await User.findByIdAndDelete(userId);
//     res.send("user Deleted");
//   } catch (error) {
//     res.status(404).send("something went wrong");
//   }
// });

// app.patch("/user/:userID", async (req, res) => {
//   const userId = req.params?.userID;
//   const data = req.body;

//   try {
//     const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//       runValidators: true,
//     });
//     const ALLOWED_UPDATES = ["age", "gender", "photoUrl", "skills"];

//     const isUpdateallowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateallowed) {
//       throw new Error("Update not allowed");
//     }
//     if (data.skills.length > 5) {
//       throw new Error("Skills should be maximum 5");
//     }
//     res.send("user updated");
//   } catch (error) {
//     res.status(404).send("Update failed:" + error.message);
//   }
// });

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
