import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { InvoiceProductModel } from "./product.model";
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

    sequelize.addModels([InvoiceModel, InvoiceProductModel]);
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
      ],
      createdAt: new Date(),
      updatedAt: new Date()
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
    expect(invoiceDb.items[0].name).toEqual(invoiceProps.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(invoiceProps.items[0].price);
    expect(invoiceDb.createdAt).toEqual(invoiceProps.createdAt);
    expect(invoiceDb.updatedAt).toEqual(invoiceProps.updatedAt);
  })

  it("should find an invoice", async () => {
    const invoice = await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "123",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "São Paulo",
      state: "São Paulo",
      zipCode: "1234567890",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "Product 2",
          price: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
      {
        include: [{ model: InvoiceProductModel }],
      }
    );

    const repository = new InvoiceRepository();
    const result = await repository.find(invoice.id);

    expect(result.id.id).toEqual(invoice.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.address.street).toEqual(invoice.street);
    expect(result.address.number).toEqual(invoice.number);
    expect(result.address.complement).toEqual(invoice.complement);
    expect(result.address.city).toEqual(invoice.city);
    expect(result.address.state).toEqual(invoice.state);
    expect(result.address.zipCode).toEqual(invoice.zipCode);
    expect(result.items[0].id.id).toEqual(invoice.items[0].id);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[0].createdAt).toStrictEqual(invoice.items[0].createdAt);
    expect(result.items[0].updatedAt).toStrictEqual(invoice.items[0].updatedAt);
    expect(result.address.zipCode).toEqual(invoice.zipCode);
    expect(result.items[1].id.id).toEqual(invoice.items[1].id);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
    expect(result.items[1].createdAt).toStrictEqual(invoice.items[1].createdAt);
    expect(result.items[1].updatedAt).toStrictEqual(invoice.items[1].updatedAt);
    expect(result.createdAt).toStrictEqual(invoice.createdAt);
  });

})