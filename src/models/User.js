import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    middleName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    emailAddress: {
        type: String,
        required: [true, 'Email address is required']
    },
    phoneNumber: {
        countryCallingCode: {
            type: String,
            required: [true, 'Country calling code is required']
        },
        nationalNumber: {
            type: String,
            required: [true, 'National number is required']
        },
        number: {
            type: String,
            required: [true, 'Number is required']
        }
    },
    username: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    authorization: {
        permissionLevel: {
            type: Number,
            default: 0
        },
        tokens: {
            passwordReset: {
                type: Array
            }
        }
    },
    verification: {
        isVerified: {
            type: Boolean,
            enum: [true, false],
            default: false
        },
        code: {
            value: {
                type: String
            },
            createdAt: {
                type: Date,
                default: new Date()
            },
            expiresAt: {
                type: Date,
                default:  new Date(new Date().setHours(new Date().getHours() + 24))
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('User', userSchema);