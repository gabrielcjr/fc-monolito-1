import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/facade.factory";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create()

    const input = {
      name: "Invoice 1",
      document: "Invoice 1 document",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "São Paulo",
      state: "SP",
      zipCode: "123.456.789-00",
      items: [{
        id: "Product 1 Id",
        name: "Product 1",
        price: 100
      }]
    };

    const result = await invoiceFacade.generateInvoice(input);

    expect(result.id).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.total).toBe(input.items.reduce((prev, curr) => curr.price + prev, 0));
  });

});