import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-creacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transactions-create.component.html',
  styleUrl: './transactions-create.component.css'
})
export class TransactionsCreateComponent implements OnInit {
  transactionForm: FormGroup;
  constructor(
    public restApi: RestApiService,
    private router: Router,
    public formBuilder: FormBuilder
  ) {
    this.transactionForm = this.formBuilder.group({
      apiKey: [''],
      tarjetaNumero: [''],
      tarjetaCvv: [''],
      tarjetaTitular: [''],
      tarjetaFecha: [''],
      monto: [''],
      moneda: [''],
      descripcion: ['']
    });
  } ngOnInit(): void {
  }
  createTransaction() {
    this.restApi.createTransaction(this.transactionForm.value).subscribe((data: {}) => {
      this.router.navigate(['/transactions'])
    })
  }
}