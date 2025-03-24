import mongoose from 'mongoose';
import fastify from 'fastify';

import cookie from '@fastify/cookie';
import cors from '@fastify/cors';

// if (!process.env.TOKEN_KEY) {
//     throw new Error('Environment variable TOKEN_KEY is not defined. Please set it before starting the server.');
// }

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
                .catch(err => {
                    console.error(`An error has occurred while attempting to connect to MongoDB! => ${err}`);
                    throw err;
                });

            console.log('Loading fastify plugins.....');

            const app = fastify({
                logger: true
            });

            await app
                .register(cors)
                .register(cookie, {
                    secret: process.env.TOKEN_KEY,
                    httpOnly: false,
                })
                .then(() => console.log('Successfully loaded the fastify plugins!'))
                .catch(err => {
                    console.error(`An error has occurred while attempting to load the fastify plugins! => ${err}`);
                    throw err;
                });

            // console.log('Attempting to load the routes.....');

            // await app
            //     .register(import('../../routes/index.js'))
            //     .then(() => console.log('Successfully loaded the routes!'))
            //     .catch(err => {
            //         console.error(`An error has occurred while attempting to load the routes! => ${err}`);
            //         throw err;
            //     });

            console.log('Attempting to start the server.....');

            await app.listen({
                port: 8080
            })
                .then(() => console.log('Successfully started the server! on port 8080'))
                .catch(err => {
                    console.error(`An error has occurred while attempting to start the server! => ${err}`);
                    throw err;
                });
        }

        catch (err) {
            console.error(err);
        }
    }
};