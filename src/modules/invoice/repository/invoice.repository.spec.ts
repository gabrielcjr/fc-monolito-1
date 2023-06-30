import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { ProductModel } from "./product.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.value-object";
import Product from "../domain/product.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should save an invoice", async () => {
    const invoiceProps = {
      id: new Id("1"), 
      name: "Invoice 1",
      document: "Invoice 1 document",
      address: new Address({
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "São Paulo",
        state: "SP",
        zipCode: "123.456.789-00",
      }),
      items: [
        new Product({
          id: new Id("1"),
          name: "Product 1",
          price: 100
        })
      ]
    };
    const invoice = new Invoice(invoiceProps);
    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.save(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoiceProps.id.id },
      include: ["items"],
    });

    expect(invoiceDb).toBeDefined()
    expect(invoiceDb.id).toEqual(invoiceProps.id.id);
    expect(invoiceDb.name).toEqual(invoiceProps.name);
    expect(invoiceDb.document).toEqual(invoiceProps.document);
    expect(invoiceDb.city).toEqual(invoiceProps.address.city);
    expect(invoiceDb.complement).toEqual(invoiceProps.address.complement);
    expect(invoiceDb.number).toEqual(invoiceProps.address.number);
    expect(invoiceDb.state).toEqual(invoiceProps.address.state);
    expect(invoiceDb.street).toEqual(invoiceProps.address.street);
    expect(invoiceDb.zipCode).toEqual(invoiceProps.address.zipCode);
    expect(invoiceDb.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "1",
          name: "Product 1",
          price: 100,
          invoice_id: "1"
        })
      ])
    );
  })
  
})