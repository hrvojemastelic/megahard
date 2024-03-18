import { EventEmitter, Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemWarehouse } from '../models/item-warehouse.model';

@Injectable({
  providedIn: 'root'
})
export class SideCalcService {
  private customerDataSubject = new BehaviorSubject<any>(null); // replace 'any' with your Customer object type
  customerData$ = this.customerDataSubject.asObservable();
  private originalItemsSubject: BehaviorSubject<ItemWarehouse[]> = new BehaviorSubject<ItemWarehouse[]>([]);
  public originalItems$: Observable<ItemWarehouse[]> = this.originalItemsSubject.asObservable();

constructor() { }

setCustomerData(data: any) {
  this.customerDataSubject.next(data);
}

getCustomerData() {
  return this.customerDataSubject.value;
}

updateOriginalItems(items: ItemWarehouse[]): void {
  this.originalItemsSubject.next(items);
}
}
