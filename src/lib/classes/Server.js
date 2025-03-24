import mongoose from 'mongoose';
import fastify from 'fastify';

import cookie from '@fastify/cookie';
import cors from '@fastify/cors';

export class Server {
    constructor(
        {
            mongodbURI
        }) {
        this.mongodbURI = mongodbURI;
    };

    async start() {
        try {
            console.log("Attempting to connect to MongoDB.....");

            await mongoose
                .connect(this.mongodbURI)
                .then(() => console.log('Successfully connected to MongoDB!'))
                .catch(err => `An error has occured while attempting to connect to MongoDB! => ${err}`);

            console.log('Loading fastify plugins.....');

            await fastify(
                {
                    logger: true
                }
            )
                .register(cors)
                .register(cookie,
                    {
                        secret: process.env.TOKEN_KEY,
                        httpOnly: false,
                    })
                .then(() => console.log('Successfully loaded the fastify plugins!'))
                .catch(err => `An error has occured while attempting to load fastify plugins! => ${err}`);

            console.log('attempting to load the routes.....');
            await fastify()
                .register(import('../../routes/index.js'))
                .then(() => console.log('Successfully loaded the routes!'))
                .catch(err => `An error has occured while attempting to load the routes! => ${err}`);

            console.log('Attempting to start the server.....');

            await fastify().listen({
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