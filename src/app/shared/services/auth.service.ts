import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from '@shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  clearLogoutTimeout: any;
  api: string = `http://localhost:3000/api/v1`;

  constructor(private http: HttpClient) {
    if (this.isValidToken()) {
      this.currentUserSubject.next(JSON.parse(localStorage.getItem('user')!));
    } else {
      this.logout();
    }
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.api}/users/register`, user).pipe(
      map((response: User) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      }),

      catchError(this.handleError),
    );
  }

  login(email: string, password: string): Observable<User> {
    let userData = { email, password };
    return this.http.post<{ user: User, token: string }>(`${this.api}/users/login`, userData).pipe(
      map((response) => {
        if (response.token) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);

          this.currentUserSubject.next(response.user);
          this.autoLogout(response.token);
        }
        return response.user;
      }),

      catchError(this.handleError),
    );
  }

  getUserInfo(userId: string): Observable<User> {
    return this.http.get<User>(`${this.api}/users/${userId}`).pipe(
      catchError(this.handleError),
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.api}/users/${user.id}`, user).pipe(
      map((response: User) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
          this.autoLogout(response.token);
        }
        this.setCurrentUser(response);
        return response;
      }),
      catchError(this.handleError),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    if (this.clearLogoutTimeout) {
      clearTimeout(this.clearLogoutTimeout);
    }
  }

  autoLogout(token: string): void {
    let expirationDate = this.getExpirationDate(token);
    let timeUntilExpiration = expirationDate - Date.now();

    if (timeUntilExpiration <= 0) {
      this.logout();
      return;
    }

    this.clearLogoutTimeout = setTimeout(() => {
      this.logout();
    }, timeUntilExpiration);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/users`).pipe(
      catchError(this.handleError),
    );
  }

  private isValidToken (): boolean {
    let token = localStorage.getItem('token')!;
    if (token) {
      let expirationDate = this.getExpirationDate(token);
      let timeUntilExpiration = expirationDate - Date.now();
      return timeUntilExpiration > 0;
    }
    return false;
  }

  private getExpirationDate(token: string): number {
    const payload = this.decodeJwtToken(token);
    if (payload && payload.exp) {
      return payload.exp * 1000;
    }
    return 0;
  }

  private decodeJwtToken(token: string) {
    const basePayload = token.split('.')[1];
    if (basePayload) {
      const payload = basePayload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');

      try {
        const decodedPayload = atob(paddedPayload);
        return JSON.parse(decodedPayload);
      } catch (error) {
        console.error('Failed to decode JWT:', error);
        return '';
      }
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error}`;
      console.error(error);
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
