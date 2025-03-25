import register from '../controllers/auth/register.js';

export default (fastify) => {
    fastify
          .register(register);
};