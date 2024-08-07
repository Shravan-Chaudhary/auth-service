import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        trim: true,
        errorMessage: "Email is required",
        notEmpty: true,
        isEmail: {
            errorMessage: "Invalid email",
        },
    },

    password: {
        trim: true,
        notEmpty: true,
        errorMessage: "Password is required",
    },
});
