import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import CatalogProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {

  async create(entity: Product): Promise<void> {
    await CatalogProductModel.create({
      id: entity.id.id,
      name: entity.name,
      description: entity.description,
      salesPrice: entity.salesPrice,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  async findAll(): Promise<Product[]> {
    const products = await CatalogProductModel.findAll();

    return products.map(
      (product) =>
        new Product({
          id: new Id(product.id),
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        })
    );
  }
  async find(id: string): Promise<Product> {
    const product = await CatalogProductModel.findOne({
      where: {
        id: id,
      },
    });

    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}
