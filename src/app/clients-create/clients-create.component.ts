import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-creacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clients-create.component.html',
  styleUrl: './clients-create.component.css'
})
export class ClientCreateComponent implements OnInit {
  clientForm: FormGroup;
  constructor(
    public restApi: RestApiService,
    private router: Router,
    public formBuilder: FormBuilder
  ) {
    this.clientForm = this.formBuilder.group({
      clienteNombre: ['']
    });
  } ngOnInit(): void {
  }
  createClient() {
    this.restApi.createClient(this.clientForm.value).subscribe((data: {}) => {
      this.router.navigate(['/clients'])
    })
  }
}