import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, CommonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  clients: any = [];
  constructor(
    public restApi: RestApiService
  ) { }
  ngOnInit(): void {
    this.getClients()
  }
  //Obtener la lista de empleados:
  getClients() {
    return this.restApi.getClients().subscribe((data: {}) => {
      this.clients = data;
    })
  }
}