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
    firstName: {
        trim: true,
        notEmpty: true,
        errorMessage: "First name is required",
    },

    lastName: {
        trim: true,
        notEmpty: true,
        errorMessage: "First name is required",
    },
    password: {
        trim: true,
        notEmpty: true,
        errorMessage: "First name is required",
        isLength: {
            options: {
                min: 8,
            },
            errorMessage: "Password must be at least 8 characters long",
        },
    },
});
