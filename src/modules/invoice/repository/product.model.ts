import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { ProductModel } from "../../product-adm/repository/product.model";
import CatalogProductModel from "../../store-catalog/repository/product.model";

@Table({
  tableName: "invoice_items",
  timestamps: false,
})
export class InvoiceProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  price: number;

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  invoice_id: string;

  @BelongsTo(() => InvoiceModel)
  invoice: InvoiceModel;

  @ForeignKey(() => CatalogProductModel)
  @Column({ allowNull: false })
  product_id: string;

  @BelongsTo(() => CatalogProductModel)
  product: CatalogProductModel;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}