import { ItemWarehouse } from "./item-warehouse.model";

export interface Customer {
    id:number;
    name: string;
    toPay: number;
    quantity: number;
    category:number;
    items:ItemWarehouse[];
    x:number;
    y:number;
    tabId:number | null;
  }
