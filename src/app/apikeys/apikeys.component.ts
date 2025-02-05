import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, CommonModule],
  templateUrl: './apikeys.component.html',
  styleUrl: './apikeys.component.css'
})
export class ApikeysComponent implements OnInit {
  apikeys: any = [];
  constructor(
    public restApi: RestApiService
  ) { }
  ngOnInit(): void {
    this.getApikeys()
  }
  //Obtener la lista de empleados:
  getApikeys() {
    return this.restApi.getApikeys().subscribe((data: {}) => {
      this.apikeys = data;
    })
  }

  toggleApikeyStatus(id: number, status: boolean) {
    this.restApi.toggleApikeyStatus(id, status).subscribe(data => {
      this.getApikeys()
    })
  }
}