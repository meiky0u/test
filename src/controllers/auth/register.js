// Required modules.
import parsePhoneNumber from 'libphonenumber-js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Required schemas.
import registerSchema from '../../schemas/auth/register.js';

// Required models.
import User from '../../models/User.js';

export default function register(fastify, options, done) {
    fastify.post('/api/v1/auth/register', async (req, rep) => {
        try {
            console.log('Attempting to validate the request body.....');

            try {
                await registerSchema.validateAsync(req.body, { abortEarly: false });
                console.log('Successfully validated the request body!');
            } catch (error) {
                console.error(`An error has occurred while attempting to validate the request body! => ${error}`);
                return rep.status(400).send({
                    message: 'Invalid request body!',
                });
            }

            // Checks if the user already exists in the database.
            console.log('Attempting to check if the user already exists in the database.....');

            let doesUserExist;

            try {
                doesUserExist = await User.findOne({
                    $or: [
                        { emailAddress: req.body.emailAddress },
                        { username: req.body.username },
                        { phoneNumber: req.body.phoneNumber },
                    ],
                });
            } catch (error) {
                console.error(`An error has occurred while attempting to check if the user already exists in the database! => ${error}`);
                return rep.status(500).send({
                    message: 'An internal server error occurred.',
                });
            }

            // If the user already exists, return a 409 error.
            if (doesUserExist) {
                const { emailAddress, username, phoneNumber } = doesUserExist;

                const takenFields = [
                    emailAddress && `${emailAddress} is already taken!`,
                    username && `${username} is already taken!`,
                    phoneNumber?.number && `${phoneNumber.number} is already taken!`,
                ].filter(Boolean);

                return rep.status(409).send({ message: 'Conflict', details: takenFields });
            }

            // Parses phone number.
            let parsedPhoneNumber;

            if (req.body.phoneNumber) {
                const phoneNumber = req.body.phoneNumber;
                parsedPhoneNumber = parsePhoneNumber(phoneNumber);

                // Checks if the phone number is valid. If the phone number is not valid, return a 400 error.
                if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
                    return rep.status(400).send({ message: 'Invalid phone number!' });
                }
            }

            // Encrypts the user password.
            let encryptedPassword;

            try {
                encryptedPassword = await bcrypt.hash(req.body.password, 10);
            } catch (error) {
                console.error(`An error has occurred while attempting to encrypt the user password! => ${error}`);
                return rep.status(500).send({
                    message: 'An internal server error occurred.',
                });
            }

            // Creates the user in the database.
            const user = await User.create({
                ...req.body,
                phoneNumber: parsedPhoneNumber,
                password: encryptedPassword,
                verification: {
                    code: {
                        value: crypto.randomBytes(3).toString('hex'),
                    },
                },
            });

            console.log('Successfully created the user!');

            // Removes the password and verification code from the user object before sending it to the client.
            const { password, verification, ...safeUser } = user.toObject();

            return rep.status(201).send(safeUser);
        } catch (error) {
            // TODO: Service that sends the error to a logging service.
            console.error(`An error has occurred while attempting to register the user! => ${error}`);
            return rep.status(500).send({ message: 'An internal server error occurred.' });
        }
    });

    done();
}