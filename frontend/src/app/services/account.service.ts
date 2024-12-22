import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  email: string | null = null;
  username: string | null = null;

  constructor(private http: HttpClient) { }
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
}
