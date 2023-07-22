import { app, sequelize } from '../express';
import request from 'supertest';

describe('E2E test for client', () => {
	beforeEach(async () => {
		await sequelize.sync({ force: true });
	});

	afterAll(async () => {
		await sequelize.close();
	});

	it('should create a client', async () => {
		const response = await request(app)
			.post('/client')
			.send({
				name: 'Client 1',
				email: 'client@email.com',
				address: 'Client address',
			});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({});
	});
});
