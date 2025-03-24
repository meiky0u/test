import mongoose from 'mongoose';

/**
 * Initializes a Fastify instance with logging enabled.
 *
 * @constant {FastifyInstance} fastify - The Fastify instance configured with a logger.
 */
import fastify from 'fastify';

import cookie from '@fastify/cookie';
import cors from '@fastify/cors';

export class Server {
  constructor({
    mongodbURI
  }) {
    this.mongodbURI = mongodbURI;
  };

  async start() {
    try {
      console.log("Attempting to connect to MongoDB.....");

      await mongoose.connect(this.mongodbURI);

      console.log('Successfully connected to MongoDB!');

      console.log('Loading fastify plugins.....');
         
      fastify()
               .register(cors)
               .register(cookie, {
                   secret: process.env.TOKEN_KEY,
                   httpOnly: false,
               });
        
      console.log('Successfully loaded fastify plugins!');

      fastify().register(import('../../routes/index.js'));

      console.log('Attempting to start the server.....');
      
      fastify().listen({
            port: 8080
      })
        .then(() => console.log('Successfully started the server! on port 8080'))
        .catch(err => `An error has occured while attempting to start the server! => ${err}`);
    }

    catch (err) {
      console.error(err);
    }

    }
};