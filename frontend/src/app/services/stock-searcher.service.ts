import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockSearcherService {
  constructor(private http: HttpClient) {}

  searchStocks(query: string): any {
    return this.http.get(`/api/stocks/search?symbol=${query}`);
  }
}
