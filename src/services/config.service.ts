import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private backendUrl = 'https://megahard.duckdns.org'; // Replace with your backend server URL

  getBackendUrl(): string {
    return this.backendUrl;
  }
}
