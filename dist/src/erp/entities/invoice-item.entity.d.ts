import { Invoice } from "src/erp/entities/invoice.entity";
import { Product } from "src/products/entities/product.entity";
export declare class InvoiceItem {
    id: number;
    invoice: Invoice;
    product: Product;
    quantity: string;
    unitPrice: string;
    total: string;
}
