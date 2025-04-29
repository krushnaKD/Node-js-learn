require('dotenv').config();
const express = require("express");
const mongoDB = require("./config/database");
const { SignupValidation } = require("./utils/Validatons");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");


const port = process.env.PORT || 4000;
const allowedOrigins = [
  "http://localhost:5173",                 // for local dev
  "https://devtinderrr.netlify.app"        // your deployed frontend
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require('./routes/payments');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/",paymentRouter)



mongoDB()
  .then(() => {
    console.log("connected succesfully");
    app.listen(port, () => {
      console.log(`🚀 Server is listening on port ${port}`);

    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
  

