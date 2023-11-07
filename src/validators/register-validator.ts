import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    errorMessage: "Invalid email",
    notEmpty: true,
    trim: true,
  },
  firstName: {
    errorMessage: "First name is required",
    notEmpty: true,
    trim: true,
  },
});
