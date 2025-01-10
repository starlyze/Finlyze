import { Component, OnInit } from '@angular/core';
import {TransactionService} from '../../../services/transaction.service';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  error: string | null = null;

  constructor(private transactionService: TransactionService){}
  ngOnInit(): void {
    this.getTransactions();
  }
  getTransactions(): void {
    this.error = null;
    this.transactionService.getTransactions().subscribe({
      next: (results: any) => {
        this.transactions = results;
        
      },
      error: (err: any) => {
        console.error(err);
        this.error = "An error occurred while retrieving transaction history";
      }
    })
  }
}
