import { Component } from '@angular/core';
import { StockSearcherService } from '../../services/stock-searcher.service';
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent{
  query: string = "";
  stocks: any[] = [];
  error: string | null = null;

  constructor(private stockSearcherService: StockSearcherService) {}

  searchStocks(event:any): void {
    this.error = null;
    if(!event.target.value) {
      this.query = event.target.value;
      this.stocks = [];
      return;
    }
    this.stockSearcherService.searchStocks(event.target.value).subscribe({
      next: (results: any) => {
        this.stocks = results;
        this.query = event.target.value;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'An error occurred while searching stock database';
      },
    });
  }
}
