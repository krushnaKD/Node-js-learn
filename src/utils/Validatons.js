var validator = require("validator");

const SignupValidation = (req) =>{
 
    const {firstName,lastName,emailID,password} = req.body;

    if(!firstName){
        throw new Error("Name should be required");
        
    }else if(!validator.isEmail(emailID)){
        throw new Error("email is not Correct");
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Password should be Strong");
    }

}

module.exports = {
    SignupValidation,
}