import { Server } from "./lib/classes/Server.js";

import dotenv from 'dotenv';

dotenv.config({
    path: '../.env'
});

const server = new Server({
    mongodbURI: process.env.MONGODB_URI
});

console.log(process.env.MONGODB_URI)
server.start({
    mongodbURI: process.env.MONGODB_URI
});