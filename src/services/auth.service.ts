// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userKey = 'user';
  private userSubject = new ReplaySubject<any>(1);

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    // Initialize user state on service creation
    this.userSubject.next(this.getUser());
  }

  private get backendUrl(): string {
    return this.configService.getBackendUrl();
  }

  loginUser(username: any, password: any): Observable<any> {
    const credentials = {
      username,
      password
    };

    // Adjust the endpoint and request type based on your backend implementation
    return this.http.post(`${this.backendUrl}/api/login`, credentials).pipe(
      tap((data: any) => {
        if (data.success) {
          // Store user information in localStorage on successful login
          this.setLocalStorageItem(this.userKey, JSON.stringify(data.user));
          // Update the user state
          this.userSubject.next(data.user);
        }
      })
    );
  }

  getUser(): any {
    // Retrieve user information from localStorage (if available)
    return this.getLocalStorageItem(this.userKey);
  }

  getUserObservable(): Observable<any> {
    // Provide a replay subject to track changes in user state
    return this.userSubject.asObservable();
  }

  logout(): void {
    // Remove user information from localStorage (if available) on logout
    this.removeLocalStorageItem(this.userKey);
    // Reset the user state
    this.userSubject.next(null);
  }

  private setLocalStorageItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  private getLocalStorageItem(key: string): any {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private removeLocalStorageItem(key: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

  registerUser(username: any, password: any, email: any): Observable<any> {
    const user = { username, password, email };
    return this.http.post(`${this.backendUrl}/api/register`, user);
  }
}
