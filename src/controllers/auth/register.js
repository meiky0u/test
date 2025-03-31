// import 
import registerSchema from '../../schemas/auth/register.js';
import User from '../../models/User.js';


export default function register(fastify, options, done) {
    fastify.post('/api/v1/auth/register', async (req, rep ) => {
        try {
            req.local = { body: await registerSchema.validateAsync(req.body) };
        } catch (error) {
            return rep.status(400).send({ message: error.message });
        };

        try {
            const user = await User.create(req.local.body);
            return rep.status(201).send(user);
        } catch (error) {
            if (error.code === 11000) {
                return rep.status(409).send({ message: 'User already exists' });
            };
            return rep.status(500).send({ message: error.message });
        }
        
        return rep.send({ message: 'Hello World' });
    })

    done();
};