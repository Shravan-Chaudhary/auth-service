import { checkSchema } from "express-validator";

export default checkSchema({
    name: {
        isString: {
            errorMessage: "Tenant name must be a string",
        },
        trim: true,
        notEmpty: {
            errorMessage: "Tenant name cannot be empty",
        },
    },

    address: {
        isString: {
            errorMessage: "Tenant address must be a string",
        },
        trim: true,
        notEmpty: {
            errorMessage: "Tenant address cannot be empty",
        },
    },
});
