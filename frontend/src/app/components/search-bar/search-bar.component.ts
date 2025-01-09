import { Component } from '@angular/core';
import { StockSearcherService } from '../../services/stock-searcher.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent{
  query: string = "";
  stocks: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private stockSearcherService: StockSearcherService){
    console.log("hello")
  }

  searchStocks(event:any): void {
    if(!event.target.value) return;
    this.isLoading = true;
    this.error = null;
    this.stockSearcherService.searchStocks(event.target.value).subscribe({
      next: (results: any) => {
        this.stocks = results;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'An error occurred while searching stock database';
        this.isLoading = false;
      },
    });
    
  }
}
