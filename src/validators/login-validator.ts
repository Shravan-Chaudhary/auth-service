import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    errorMessage: "Email is required",
    notEmpty: true,
    trim: true,
    isEmail: {
      errorMessage: "Invalid Email",
    },
  },
  password: {
    errorMessage: "Password is required",
    notEmpty: true,
    trim: true,
  },
});
