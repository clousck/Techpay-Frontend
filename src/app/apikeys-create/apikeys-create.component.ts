import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-creacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apikeys-create.component.html',
  styleUrl: './apikeys-create.component.css'
})
export class ApikeysCreateComponent implements OnInit {
  apikeyForm: FormGroup;
  constructor(
    public restApi: RestApiService,
    private router: Router,
    public formBuilder: FormBuilder
  ) {
    this.apikeyForm = this.formBuilder.group({
      apikeyId: [''],
      apikeyKey: [''],
      apikeyDescripcion: [''],
      clienteId: [''],
      apikeyEstado: ['']
    });
  } ngOnInit(): void {
  }
  createApikey() {
    this.restApi.createApikey(this.apikeyForm.value).subscribe((data: {}) => {
      this.router.navigate(['/apikeys'])
    })
  }
}