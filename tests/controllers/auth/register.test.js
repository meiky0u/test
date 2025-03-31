import request from 'supertest';
import app from '../../../src/app.js'; // Adjust the import path as necessary

describe('POST /api/v1/auth/register', () => {
    it('should register a user successfully', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register') // Updated endpoint
			.send({
                username: 'testuser',
                password: 'testpassword',
                emailAddress: 'testuser@example.com', // Updated field name
                phoneNumber: '+1234567890' // Added phoneNumber to match schema
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('username', 'testuser');
    });

    it('should return an error for missing fields', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register') // Updated endpoint
            .send({
                username: 'testuser'
            });
        expect(response.status).toBe(400); // Assuming validation returns 400 for missing fields
        expect(response.body).toHaveProperty('message'); // Adjusted to match your error response structure
    });

    it('should return an error for duplicate users', async () => {
        // First request to create the user
        await request(app)
            .post('/api/v1/auth/register') // Updated endpoint
            .send({
                username: 'duplicateuser',
                password: 'testpassword',
                emailAddress: 'duplicateuser@example.com', // Updated field name
                phoneNumber: '+1234567890' // Added phoneNumber to match schema
            });

        // Second request to trigger duplicate user error
        const response = await request(app)
            .post('/api/v1/auth/register') // Updated endpoint
            .send({
                username: 'duplicateuser',
                password: 'testpassword',
                emailAddress: 'duplicateuser@example.com', // Updated field name
                phoneNumber: '+1234567890' // Added phoneNumber to match schema
            });
        expect(response.status).toBe(409); // Assuming duplicate user returns 409
        expect(response.body).toHaveProperty('message'); // Adjusted to match your error response structure
    });
});