import request from 'supertest';
import { Sequelize } from "sequelize-typescript";
import express, { Express } from 'express';
import { ProductModel } from '../../../modules/product-adm/repository/product.model';
import { productRoute } from '../routes/product.route';
import { Umzug } from 'umzug';
import { migrator } from "./config-migrations/migrator";

describe('E2E test for product', () => {
	const app: Express = express()
	app.use(express.json())
	app.use("/product", productRoute)

	let sequelize: Sequelize

	let migration: Umzug<Sequelize>;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ":memory:",
			logging: false
		})

		sequelize.addModels([ProductModel]);

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

	it('should create a product', async () => {
		const response = await request(app)
			.post('/product')
			.send({
				name: 'Product A',
				description: 'Product A Description',
				purchasePrice: 10,
				stock: 100,
			});

		let result = await ProductModel.findAll();

		expect(response.status).toBe(200);
		expect(response.body.id).toBeDefined();
		expect(response.body.name).toBe('Product A');
		expect(response.body.description).toBe('Product A Description');
		expect(response.body.purchasePrice).toBe(10);
		expect(response.body.stock).toBe(100);
	});
});
