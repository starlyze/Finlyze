import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  id: string | null = null;
  email: string | null = null;
  username: string | null = null;
  authenticated: Promise<boolean>;

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {
    this.onAuthenticate();
  }

  onAuthenticate() {
    this.authenticated = new Promise<boolean>(resolve => {
      const token = this.cookieService.get('auth_jwt');
      if (!token) return resolve(false);
      this.http.get(`/api/auth/user?token=${token}`).subscribe({
        next: (res: any) => {
          this.id = res.id;
          this.email = res.email;
          this.username = res.username;
          resolve(true);
        },
        error: (error) => {
          console.log(error);
          resolve(false);
        }
      })
    });
  }

  onSignin(object: any): Observable<any> {
    return this.http.post('/api/auth/signin', object).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    );
  }
  onSignup(object: any): Observable<any> {
    return this.http.post('/api/auth/signup', object).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    );
  }
  onRequestVerification(email: string): Observable<any> {
    return this.http.post('/api/auth/verify-request', { email: email }).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    )
  }
  onVerifyEmail(token: string): Observable<any> {
    return this.http.get(`/api/auth/verify-email?token=${token}`).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    );
  }
  onForgotPassword(email: string): Observable<any> {
    return this.http.post('/api/auth/forgot-password', { email: email }).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    )
  }
  onChangePassword(object: any, token: string): Observable<any> {
    return this.http.post(`/api/auth/change-password?token=${token}`, object).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    )
  }
  onGoogleSignin(): Observable<any> {
    return this.http.get('/api/auth/google').pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => error.error);
      })
    )
  }
  async onSignout(): Promise<void> {
    this.cookieService.delete('auth_jwt');
    this.onAuthenticate();
    await this.router.navigateByUrl('');
  }
}
