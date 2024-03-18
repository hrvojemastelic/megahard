import { EventEmitter, Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemWarehouse } from '../models/item-warehouse.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {


constructor(    private http: HttpClient,
  private configService: ConfigService) { }

  private get backendUrl(): string {
    return this.configService.getBackendUrl();
  }

  getWarehouseList(userId: number): Observable<any> {
    const credentials = {
      userId
    }
    // Adjust the endpoint and request type based on your backend implementation
    return this.http.post(`${this.backendUrl}/api/warehouse/getList`, credentials);
  }

  insert(itemList:ItemWarehouse[],userId:number):Observable<any>
  {
    const credentials = {
      itemList,
      userId
    }
    return this.http.post(`${this.backendUrl}/api/warehouse/insert`, credentials);

  }


}
