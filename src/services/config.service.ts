import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private backendUrl = 'http://localhost:3000'; // Replace with your backend server URL

  getBackendUrl(): string {
    return this.backendUrl;
  }
}
