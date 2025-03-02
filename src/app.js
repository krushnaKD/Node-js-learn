const express = require("express");
const mongoDB = require("./config/database");
const { SignupValidation } = require("./utils/Validatons");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
