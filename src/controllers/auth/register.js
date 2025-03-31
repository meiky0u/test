// Required modules.
import parsePhoneNumber from 'libphonenumber-js';
import bcrypt from 'bcrypt';

// Required schemas.
import registerSchema from '../../schemas/auth/register.js';

// Required models.
import User from '../../models/User.js';

export default function register(fastify, options, done) {
    fastify.post('/api/v1/auth/register', async (req, rep) => {
        try {
            console.log('Attempting to validate the request body.....');

            await registerSchema
                .validateAsync(req.body)
                .then(() => {
                    console.log('Successfully validated the request body!');
                    return req.body;
                })
                .catch(err => {
                    console.error(`An error has occurred while attempting to validate the request body! => ${err}`);
                    throw err;
                });

            // Checks if the user already exists in the database.
            console.log('Attempting to check if the user already exists in the database.....');

            const doesUserExist = await User.findOne({
                $or: [
                    { emailAddress: req.body.emailAddress },
                    { username: req.body.username },
                    { phoneNumber: req.body.phoneNumber }
                ]
            });

            // If the user already exists, return a 409 error.
            if (doesUserExist) {
                const { emailAddress, username, phoneNumber } = doesUserExist;

                const takenFields = [
                    emailAddress && `${emailAddress} is already taken!`,
                    username && `${username} is already taken!`,
                    phoneNumber?.number && `${phoneNumber.number} is already taken!`
                ].filter(Boolean);

                return rep.status(409).send({ message: takenFields });
            }

            // Parses phone number.
            let parsedPhoneNumber = null;
            if (req.body.phoneNumber) {
                const phoneNumber = req.body.phoneNumber;
                parsedPhoneNumber = parsePhoneNumber(phoneNumber);
            }

            // Encrypts the user password.
            const encryptedPassword = await bcrypt.hash(req.body.password, 10);

            // Creates the user in the database.
            const user = await User.create({
                ...req.body,
                phoneNumber: parsedPhoneNumber,
                password: encryptedPassword,
                verification: {
                    code: {
                        value: Math.random().toString(36).substring(2, 8)
                    }
                }
            });

            console.log('Successfully created the user!');

            return rep.status(201).send(user);
        } catch (error) {
            // TODO: Service that sends the error to a logging service.
            console.error(`An error has occurred while attempting to register the user! => ${error}`);

            return rep.status(500).send({ message: error.message });
        }
    });

    done();
}