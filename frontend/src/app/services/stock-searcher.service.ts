import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class StockSearcherService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  searchStocks(query: string): any {
    return this.http.get(`/api/stocks/search?symbol=${query}`);
  }
  getStockData(id: string, interval: number) {
    return this.http.get(`/api/stocks/data?id=${id}&interval=${interval}&user=${this.authService.id}`);
  }
}
