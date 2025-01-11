import {Component, Input, OnInit} from '@angular/core';
import {GraphComponent} from "../../../components/graph/graph.component";
import {StockSearcherService} from "../../../services/stock-searcher.service";
import {NgClass, NgIf} from "@angular/common";
import {GraphMenuComponent} from "../../../components/graph-menu/graph-menu.component";

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    GraphComponent,
    NgIf,
    NgClass,
    GraphMenuComponent
  ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent implements OnInit {
  @Input() id: string;
  interval: number = 0;
  data: number[][] = [[]];
  name: string | null = null;
  symbol: string | null = null;
  exchange: string | null = null;
  price: number | null = null;
  percentDiff: number | null = null;
  date: string | null = null;

  constructor(private stockSearcherService: StockSearcherService) {}
  ngOnInit() {
    this.getGraphData();
  }
  getGraphData() {
    this.stockSearcherService.getStockData(this.id, this.interval).subscribe({
      next: (result: any) => {
        this.name = result.metaData.name;
        this.symbol = result.metaData.symbol;
        this.exchange = result.metaData.exchange;
        this.data = result.data;
        this.price = result.lastBar.ClosePrice;
        this.percentDiff = Math.round(10000 * (this.data[this.data.length - 1][1]/this.data[0][1] - 1))/100;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
  onMenuChange(index: number) {
    this.interval = index;
    this.getGraphData();
  }
  onGraphHover(index: number) {
    if (index == this.data.length - 1) {
      this.date = 'Now';
    }
    else this.date = new Date (this.data[index][0]).toLocaleString();
    this.price = this.data[index][1];
    this.percentDiff = Math.round(10000 * (this.data[index][1]/this.data[0][1] - 1))/100;
  }
}
