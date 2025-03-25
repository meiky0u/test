export default function register(fastify, options, done) {
    fastify.get('/api/auth/register', async (req, rep ) => {
        return rep.send({ message: 'Hello World' });
    })

    done();
};