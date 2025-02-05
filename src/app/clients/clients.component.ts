import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Client } from '../model/client';
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

  selectedClient: Client | undefined;

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

  getApikeysByClient(client: any) {
    this.showTransactions = false;
    this.showApikeys = true;
    
    if (client.apikeys.length == 0) {
      window.alert("El cliente no tiene apikeys.");
    }

    this.apikeys = client.apikeys;
    this.selectedClient = client;
  }

  getTransactionsByClient(client: any) {
    this.showApikeys = false;
    this.showTransactions = true;
    
    if (client.transacciones.length == 0) {
      window.alert("El cliente no tiene transacciones.");
    }

    this.transactions = client.transacciones;
    this.selectedClient = client;
  }

  toggleApikeyStatus(id: number, status: boolean) {
    const updatedStatus = !status;
    this.restApi.toggleApikeyStatus(id, updatedStatus).subscribe(() => {
      const apikey = this.apikeys.find((key: any) => key.apikeyId === id);
      if (apikey) {
        apikey.apikeyEstado = updatedStatus;
      }
    });
  }
}