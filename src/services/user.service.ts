import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  private get backendUrl(): string {
    return this.configService.getBackendUrl();
  }

  loginUser(username: any, password:any): Observable<any> {
    const credentials = {
      username,
      password
    }
    // Adjust the endpoint and request type based on your backend implementation
    return this.http.post(`${this.backendUrl}/api/login`, credentials);
  }
}
