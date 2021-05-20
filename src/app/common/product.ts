import { Category } from "./category";

export class Product {

    productId: string;
    name: string;
    category: Category;
    description: string;
    unitPrice: number;
    imageUrl: string;
    active: boolean;
    unitsInStock: number;
}
