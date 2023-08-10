import CatalogProductModel from "../../store-catalog/repository/product.model";
import Product from "../domain/product.entity";

export default class ProductRepository {

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
}