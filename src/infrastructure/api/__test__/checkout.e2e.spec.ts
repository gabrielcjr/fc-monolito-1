import request from 'supertest';
import ClientRepository from '../../../modules/client-adm/repository/client.repository';
import AddClientUseCase from '../../../modules/client-adm/usecase/add-client/add-client.usecase';
import ProductRepository from '../../../modules/product-adm/repository/product.repository';
import AddProductUseCase from '../../../modules/product-adm/usecase/add-product/add-product.usecase';
import { app, sequelize } from '../express';

describe('E2E test for checkout', () => {
	beforeEach(async () => {
		await sequelize.sync({ force: true });
	});

	afterAll(async () => {
		await sequelize.close();
	});

	it('should create a checkout', async () => {
		const repository = new ClientRepository();
    const addClientUsecase = new AddClientUseCase(repository);
		const client = await addClientUsecase.execute(
			{
					name: 'checkout 1',
					email: 'checkout@email.com',
					document: "123",
					street: "street 1",
					number: "1",
					complement: "",
					city: "São Paulo",
					state: "SP",
					zipCode: "1234567890",
			}
		)

		const productRepository = new ProductRepository()
		const addProductUseCase = new AddProductUseCase(productRepository)
		const product = await addProductUseCase.execute({
			name: "Product 1",
			description: "Product description",
			purchasePrice: 123,
			stock: 10
		})
		const response = await request(app)
			.post('/checkout')
			.send({
				clientId: client.id,
				products: [product].map(p => ({ productId: p.id }))
			});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({});
	});
});
