import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideCalcService {
  private customerDataSubject = new BehaviorSubject<any>(null); // replace 'any' with your Customer object type
  customerData$ = this.customerDataSubject.asObservable();

constructor() { }

setCustomerData(data: any) {
  this.customerDataSubject.next(data);
}

getCustomerData() {
  return this.customerDataSubject.value;
}
}
