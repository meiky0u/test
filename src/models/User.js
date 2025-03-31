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
            type: String
        },
        nationalNumber: {
            type: String
        },
        number: {
            type: String
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
            passwordReset: [
                {
                    value: {
                        type: String
                    },
                    createdAt: {
                        type: Date
                    },
                    expiresAt: {
                        type: Date
                    }
                }
            ]
        }
    },
    verification: {
        isVerified: {
            type: Boolean,
            default: false
        },
        code: {
            value: {
                type: String
            },
            createdAt: {
                type: Date,
                default: () => Date.now()
            },
            expiresAt: {
                type: Date,
                default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now.
            }
        }
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
});

export default mongoose.model('User', userSchema);