import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTransactions(): any {
    return this.http.post(`/api/transactions`, {userId: this.authService.id});
  }
}
