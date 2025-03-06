const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {SignupValidation} = require("../utils/Validatons")

const authRouter = express.Router();


authRouter.post("/signUp", async (req, res) => {
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

     const saveduser =  await user.save();
     const token = await saveduser.getJWT()
     res.cookie("token", token);
   ;
    res.json({message:"added successfully",data:saveduser});
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
    try {
      const { emailID, password } = req.body;
  
      const user = await User.findOne({ emailID: emailID });
      if (!user) {
        throw new Error("User Doesn't Exist");
      }
  
      const isPasswordCorrect = await user.Validatepass(password) ;
  
      if (isPasswordCorrect) {
  
        const token = await user.getJWT();
  
        res.cookie("token", token);
      
        res.send(user);
      } else {
        throw new Error("password is Wrong");
      }
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

authRouter.post("/logout",async (req,res)=>{
    
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    })  
    res.send("Logged Out!")
})

module.exports =   authRouter