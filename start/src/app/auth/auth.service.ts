import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface SignupData {
  name: string;
  surname: string;
  email: string;
  password: string;
}
export interface AuthData {
  accessToken: string;
  user: {
    email: string;
    id: number;
    name: string;
    surname: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper = new JwtHelperService();
  URL = 'http://localhost:4201';
  private authSubject = new BehaviorSubject<null | AuthData>(null);
  user$ = this.authSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(map((user) => !!user));
  autologoutTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(data: { email: string; password: string }) {
    return this.http.post<AuthData>(`${this.URL}/login`, data).pipe(
      tap((val) => {
        console.log(val);
      }),
      tap((data) => {
        this.authSubject.next(data);
        localStorage.setItem('user', JSON.stringify(data));
      }),
      catchError(this.errors)
    );
  }

  signup(data: SignupData) {
    return this.http
      .post(`${this.URL}/register`, data)
      .pipe(catchError(this.errors));
  }

  logout() {
    this.authSubject.next(null);
    this.router.navigate(['/']);
    localStorage.removeItem('user');
  }

  private errors(err: any) {
    switch (err.error) {
      case 'Email and password are required':
        return throwError(
          () => new Error('Email e password sono obbligatorie')
        );
      case 'Email already exists':
        return throwError(() => new Error('Utente gia registrato'));
      case 'Email format is invalid':
        return throwError(() => new Error('Email scritta male'));
      case 'Cannot find user':
        return throwError(() => new Error('Utente non esiste'));
      default:
        return throwError(() => new Error('Errore nella chiamata'));
    }
  }
}
