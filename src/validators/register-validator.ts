import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    errorMessage: "Invalid email",
    notEmpty: true,
    trim: true,
  },
});
