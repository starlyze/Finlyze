import {inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {catchError, firstValueFrom, map, Observable, of, tap, throwError} from "rxjs";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  id: string | null = null;
  email: string | null = null;
  username: string | null = null;
  authenticated: boolean = false;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {
  }

  async isAuthenticated(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log("bad");
    }
    const jwt = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('auth_jwt='));
    if (!jwt) {
      console.log("cookie doesnt exist")
      return false;
    }
    try {
      return await firstValueFrom(
        this.http.get(`http://localhost:4200/api/auth/authenticate?token=${jwt}`).pipe(
          tap((data: any) => {
            this.authenticated = true;
            this.id = data.id;
            this.email = data.email;
            this.username = data.username;
          }),
          map(() => true),
          catchError((error: any) => {
            console.log(error);
            this.authenticated = false;
            return of(false);
          })
        ));
    } catch (error: any) {
      this.authenticated = false;
      console.log(error);
      return false;
    }
  }

  onSignin(object: any): Observable<any> {
    return this.http.post('http://localhost:4200/api/auth/signin', object).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    );
  }
  onSignup(object: any): Observable<any> {
    return this.http.post('http://localhost:4200/api/auth/signup', object).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    );
  }
  onRequestVerification(email: string): Observable<any> {
    return this.http.post('http://localhost:4200/api/auth/verify-request', { email: email }).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    )
  }
  onVerifyEmail(token: string): Observable<any> {
    return this.http.get(`http://localhost:4200/api/auth/verify-email?token=${token}`).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    );
  }
  onForgotPassword(email: string): Observable<any> {
    return this.http.post('http://localhost:4200/api/auth/forgot-password', { email: email }).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    )
  }
  onChangePassword(object: any, token: string): Observable<any> {
    return this.http.post(`http://localhost:4200/api/auth/change-password?token=${token}`, object).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    )
  }
  onGoogleSignin(): Observable<any> {
    return this.http.get('http://localhost:4200/api/auth/google').pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    )
  }
}
