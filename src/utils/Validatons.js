var validator = require("validator");
const bcrypt = require("bcrypt");

const SignupValidation = (req) => {
  const { firstName, lastName, emailID, password } = req.body;

  if (!firstName) {
    throw new Error("Name should be required");
  } else if (!validator.isEmail(emailID)) {
    throw new Error("email is not Correct");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password should be Strong");
  }
};

const validatedit = (req) => {
  const allowedEdit = [
    "firstName",
    "lastName",
    "about",
    "gender",
    "age",
    "photoUrl",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEdit.includes(field)
  );

  return isEditAllowed;
};

const Validatepass = async (req) => {
  const loggedIn = req.body;
  const loggedInPass = req.body.password;

  const Match = await bcrypt.compare(loggedInPass, req.user.password);

return Match
};

module.exports = {
  SignupValidation,
  validatedit,
  Validatepass,
};

// $2b$10$S55b7R5dH9c38f2GDcgsteAw1fbkE6i01AJr60UgXqq5J4hEK28Zi