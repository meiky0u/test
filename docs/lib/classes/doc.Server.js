/**
 * Server.js Documentation
 * 
 * This file defines the Server class, which is responsible for handling 
 * server-side operations such as managing HTTP requests, routing, and 
 * middleware integration.
 * 
 * Key Features:
 * - Starts and stops the server.
 * - Handles incoming HTTP requests and routes them to appropriate handlers.
 * - Supports middleware for request/response processing.
 * 
 * Example Usage:
 * 
 * const Server = require('./Server');
 * const server = new Server();
 * 
 * server.use((req, res, next) => {
 *   console.log(`${req.method} ${req.url}`);
 *   next();
 * });
 * 
 * server.start(3000, () => {
 *   console.log('Server is running on port 3000');
 * });
 * 
 * Key Methods:
 * - `start(port, callback)`: Starts the server on the specified port.
 * - `stop(callback)`: Stops the server.
 * - `use(middleware)`: Adds middleware to the server.
 * 
 * Note: Ensure to handle errors and edge cases when using the Server class.
 */
