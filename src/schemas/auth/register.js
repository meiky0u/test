import joi from 'joi';

const nameField = () =>
    joi
        .string()
        .min(2)
        .max(30)
        .pattern(/^[a-zA-Z]+$/)
        .trim()
        .lowercase();

const phoneNumberSchema = joi.object({
    countryCallingCode: joi.string().required(),
    nationalNumber: joi.string().required(),
    number: joi.string().required(),
});

const registerSchema = joi.object({
    firstName: nameField()
        .required()
        .messages({
            'string.empty': 'First name is required.',
            'any.required': 'First name is required.',
        }),
    middleName: nameField().optional(),
    lastName: nameField()
        .required()
        .messages({
            'string.empty': 'Last name is required.',
            'any.required': 'Last name is required.',
        }),
    emailAddress: joi
        .string()
        .email()
        .trim()
        .lowercase()
        .messages({
            'string.email': 'Invalid email address.',
        }),
    phoneNumber: joi
        .alternatives()
        .conditional('emailAddress', {
            is: joi.string().empty(''),
            then: phoneNumberSchema.required(),
            otherwise: phoneNumberSchema.optional(),
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
            'any.required': 'Password is required.',
        }),
});

export default registerSchema;