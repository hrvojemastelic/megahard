import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Customer } from '../models/customer.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainScreenService {
  tables : Customer[] = [];
  constructor(private configService: ConfigService,private http: HttpClient,) { }

  private get backendUrl(): string {
    return this.configService.getBackendUrl();
  }

  saveTablePositions(tables:Customer[],userId:number,tabs:number)
  {
    const credentials = {
      tables,
      userId,
      tabs
    }
    return this.http.post(`${this.backendUrl}/api/tables/insert`, credentials);
  }


}
