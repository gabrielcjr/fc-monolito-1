export interface PlaceOrderInputDto {
    clientId: string;
    products: {
        productId: string;
    }[];
}

export interface PlaceOrderOutputDto {
    id: string;
    clientId: string;
    invoiceId: string;
    status: string;
    total: number;
    products: {
        id: string;
    }[];
}