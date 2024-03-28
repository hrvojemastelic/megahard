// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userKey = 'user';
  private userSubject = new ReplaySubject<any>(1);
  private token: string | null = null;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router
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

        return this.http.post(`${this.backendUrl}/api/login`, credentials).pipe(
            tap((data: any) => {
                if (data.success) {
                    this.saveToken(data.token); // Save token to local storage
                     // Store user information in localStorage on successful login
                    this.setLocalStorageItem(this.userKey, JSON.stringify(data.user));
                    // Update the user state
                    this.userSubject.next(data.user);
                }
            })
        );
    }
  saveToken(token: string): void {
      localStorage.setItem('token', token); // Store token in local storage
  }
 setToken(token: string): void {
    this.token = token;
  }
  getToken(): string | null {
    return localStorage.getItem('token'); // Retrieve token from local storage
}
removeToken(): void {
  localStorage.removeItem('token'); // Remove token from local storage
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
    this.removeToken();
    this.router.navigate(['/login']);
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
