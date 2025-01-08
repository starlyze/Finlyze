import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {GraphComponent} from "../../../components/graph/graph.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    GraphComponent,
    NgClass
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @Input() token: string;
  username: string | null = null;
  portfolioData: any = [[1, 1], [3, 2], [4, 100]];
  netDepositData: any = [[1, 1], [3, 40]];
  portfolioValue: number;
  netDeposit: number;
  percentageChange: number;

  constructor(private router: Router, private authService: AuthService) {
    this.username = this.authService.username;
  }
  ngOnInit() {
    this.portfolioValue = this.portfolioData[this.portfolioData.length - 1][1];
    this.percentageChange = ((this.portfolioValue - this.netDepositData[this.netDepositData.length-1][1]) / this.netDepositData[this.netDepositData.length-1][1]) * 100;
    this.netDeposit = this.netDepositData[this.netDepositData.length - 1][1];
  }
  onGraphHover(index: number) {
    this.portfolioValue = this.portfolioData[index][1];
    let netDepositIndex: number = 1;
    while (netDepositIndex < this.netDepositData.length && this.portfolioData[index][0] >= this.netDepositData[netDepositIndex][0]) netDepositIndex++;
    netDepositIndex--;
    this.netDeposit = this.netDepositData[netDepositIndex][1];
    this.percentageChange = ((this.portfolioValue - this.netDepositData[netDepositIndex][1]) / this.netDepositData[netDepositIndex][1]) * 100;
  }
}
