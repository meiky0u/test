// import 
import registerSchema from '../../schemas/auth/register.js';
import bcrypt from 'bcrypt';
import User from '../../models/User.js';
import parsePhoneNumber from 'libphonenumber-js';

export default function register(fastify, options, done) {
    fastify.post('/api/v1/auth/register', async (req, rep ) => {
        try {
            console.log('Attempting to validate the request body.....');

            req.local = { 
                body: await registerSchema
                            .validateAsync(req.body)
                            .then(() => {
                                console.log('Successfully validated the request body!');
                                return req.body;
                            })
                            .catch(err => {
                                console.error(`An error has occurred while attempting to validate the request body! => ${err}`);
                                throw err;
                            })
             };

             // Checks if the user already exists in the database.
             console.log('Attempting to check if the user already exists in the database.....');
             const doesUserExist = await User.findOne({
                $or: [
                    { emailAddress: req.body.emailAddress },
                    { username: req.body.username },
                    { phoneNumber: req.body.phoneNumber }
                ]
             });

             if (doesUserExist) {
                const {
                     emailAddress,
                     username,
                     phoneNumber
                } = doesUserExist;

                const takenFields = [
                    emailAddress && `${emailAddress} is already taken!`,
                    username && `${username} is already taken!`,
                    phoneNumber?.number && `${phoneNumber.number} is already taken!`
                ].filter(Boolean);

                return rep.status(409).send({ message: takenFields });
             };

             // parse phone number.
             let parsedPhoneNumber = null;
             if(req.local.body.phoneNumber) {
                const phoneNumber = req.local.body.phoneNumber;

                parsedPhoneNumber = parsePhoneNumber(phoneNumber);
             }

             const encryptedPassword = await bcrypt.hash(req.local.body.password, 10);

             const verificationCode = {
                code: {
                    value: Math.random().toString(36).substring(2, 8)
                }
             };

             const user = await User.create(req.local.body, parsedPhoneNumber, encryptedPassword, verificationCode);

             console.log('Successfully created the user!');
             return rep.status(201).send(user);
        } catch (error) {
            console.log(error)
            return rep.status(500).send({ message: error.message });
        };
    })

    done();
};