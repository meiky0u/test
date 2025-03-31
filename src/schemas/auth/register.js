const joi = require('joi');

// todo: isPhoneNumberValid function.
// todo: isPasswordStrong function.

const registerSchema = joi.object({
    firstName: joi
        .string()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-Z]+$/)
        .trim()
        .lowercase()
        .required()
        .messages({
            'string.empty': 'First name is required.',
            'any.required': 'First name is required.'
        }),
    middleName: joi
        .string()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-Z]+$/)
        .trim()
        .lowercase()
        .optional(),
    lastName: joi
        .string()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-Z]+$/)
        .trim()
        .lowercase()
        .required()
        .messages({
            'string.empty': 'Last name is required.',
            'any.required': 'Last name is required.'
        }),
    emailAddress: joi
        .string()
        .email({ tlds: { allow: false } })
        .trim()
        .lowercase(),
    phoneNumber: joi
        .when('emailAddress', {
            switch: [
                {
                    // if emailAddress is not provided, then phoneNumber is required.
                    is: joi
                        .string()
                        .empty('')
                        .required(),
                    then: joi.object({
                        countryCallingCode: joi
                        .string().required(),
                        nationalNumber: joi.string().required(),
                        number: joi.string().required()
                    }),
                    otherwise: joi.object({
                        countryCallingCode: joi.string().optional(),
                        nationalNumber: joi.string().optional(),
                        number: joi.string().optional()
                    })
                }
            ]
        }),
    username: joi
        .string()
        .alphanum()
        .min(4)
        .max(40)
        .pattern(/^[a-zA-Z0-9]+$/)
        .trim()
        .lowercase()
        .optional(),
    password: joi
        .string()
        .min(8)
        .max(64)
        .pattern(/^[a-zA-Z0-9!@#$%^&*()_+]+$/)
        .trim()
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'any.required': 'Password is required.'
        })
});

export default registerSchema;