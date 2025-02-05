import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
  transactions: any = [];
  constructor(
    public restApi: RestApiService
  ) { }
  ngOnInit(): void {
    this.getTransactions()
  }
  
  //Obtener la lista de empleados:
  getTransactions() {
    return this.restApi.getTransactions().subscribe((data: {}) => {
      this.transactions = data;
    })
  }

  // aproveTransaction(id: any) {
  //   if (window.confirm('¿Está seguro de que desea aprobar la transacción ' + id + '?')) {
  //     this.restApi.aproveTransaction(id).subscribe(data => {
  //       this.getTransactions()
  //     })
  //   }
  // }
}