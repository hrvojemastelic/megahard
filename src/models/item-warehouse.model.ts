import { Category } from "./category.model";

export interface ItemWarehouse {
    id:number;
    name: string;
    value: number;
    quantity: number;
    category:number;
    qToPay:number;
  }
