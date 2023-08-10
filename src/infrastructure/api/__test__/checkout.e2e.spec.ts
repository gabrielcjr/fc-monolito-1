import express, { Express } from 'express';
import { Sequelize } from "sequelize-typescript";
import request from 'supertest';
import { Umzug } from "umzug";
import { OrderModel } from "../../../modules/checkout/repository/order.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import ClientRepository from '../../../modules/client-adm/repository/client.repository';
import AddClientUseCase from '../../../modules/client-adm/usecase/add-client/add-client.usecase';
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceProductModel } from "../../../modules/invoice/repository/product.model";
import TransactionModel from '../../../modules/payment/repository/transaction.model';
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import ProductRepository from '../../../modules/product-adm/repository/product.repository';
import AddProductUseCase from '../../../modules/product-adm/usecase/add-product/add-product.usecase';
import CatalogProductModel from "../../../modules/store-catalog/repository/product.model";
import { checkoutRoute } from "../routes/checkout.route";
import { migrator } from "./config-migrations/migrator";

describe('E2E test for checkout', () => {

	const app: Express = express()
	app.use(express.json())
	app.use("/checkout", checkoutRoute)

	let sequelize: Sequelize

	let migration: Umzug<Sequelize>;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ":memory:",
			logging: false
		})

		sequelize.addModels([ProductModel, InvoiceModel, InvoiceProductModel, ClientModel, OrderModel, CatalogProductModel, TransactionModel]);

		migration = migrator(sequelize)
		await migration.up()
	});

	afterEach(async () => {
		if (!migration || !sequelize) {
			return
		}
		await migration.down()
		await sequelize.close()
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
		
		CatalogProductModel.update(
			{ salesPrice: product.purchasePrice },
			{ where: { id: product.id } }
		);

		const response = await request(app)
			.post('/checkout')
			.send({
				clientId: client.id,
				products: [product].map(p => ({ productId: p.id }))
			});

		console.log(response.body)
		expect(response.status).toBe(200);

		expect(response.body).toEqual({
			id: expect.any(String),
			clientId: expect.any(String),
			invoiceId: expect.any(String),
			status: 'approved',
			total: 123,
			products: response.body.products
		});
	});
});
