import { Item } from "./item.model";

export interface Customer {
    id:number;
    name: string;
    toPay: number;
    quantity: number;
    category:number;
    items:Item[];
    x:number;
    y:number;
  }