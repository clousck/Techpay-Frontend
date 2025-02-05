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
  showApikeys: boolean = false;
  showTransactions: boolean = false;
  clients: any = [];
  apikeys: any = [];
  transactions: any = [];

  editingClient: any = false;

  selectedClient: number = NaN;
  constructor(
    public restApi: RestApiService
  ) { }
  ngOnInit(): void {
    this.getClients()
  }

  onInputChange(event: Event, client: any) {
    const inputElement = event.target as HTMLInputElement;
    client.clienteNombre = inputElement.value; // Guardamos lo que el usuario escribe
  }

  //Obtener la lista de empleados:
  getClients() {
    return this.restApi.getClients().subscribe((data: {}) => {
      this.clients = data;
    })
  }

  editClient(client: any) {
    client.isEditing = true;
  }

  saveClient(client: any) {
    client.isEditing = false;
    this.restApi.updateClient(client.clienteId, client.clienteNombre).subscribe(() => {
      this.getClients();
    });
  }

  getApikeysByClient(id: number) {
    this.apikeys = this.clients[id - 1].apikeys;
    this.showTransactions = false;
    this.showApikeys = true;
    this.selectedClient = id;
  }

  toggleApikeyStatus(id: number, status: boolean) {
    this.restApi.toggleApikeyStatus(id, status).subscribe(() => {
      this.getClients(); // Espera a que los clientes se actualicen
      setTimeout(() => {
        this.getApikeysByClient(this.selectedClient); // Llama después de actualizar los clientes
      }, 100); // Espera un corto tiempo para evitar que la data no esté lista
    });
  }

  getTransactionsByClient(id: number) {
    this.transactions = this.clients[id - 1].transacciones;
    this.showApikeys = false;
    this.showTransactions = true;
    this.selectedClient = id;
  }
}