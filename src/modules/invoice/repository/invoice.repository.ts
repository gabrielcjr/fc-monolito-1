import Id from "../../@shared/domain/value-object/id.value-object";
import CatalogProductModel from "../../store-catalog/repository/product.model";
import Address from "../domain/address.value-object";
import Invoice from "../domain/invoice.entity";
import Item from "../domain/item.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./item.model";

export default class InvoiceRepository implements InvoiceGateway {
  async save(invoice: Invoice): Promise<void> {

    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map(item => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
      {
        include: [InvoiceItemModel]
      }
    )
  }
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne(
      {
        where: {
          id
        },
        include: [
          {
            model: InvoiceItemModel
          }
        ]
      }
    );

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
      }),
      items: invoice.items.map(item => new Item(
        {
          id: new Id(item.id),
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }
      )),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    })
  }
}