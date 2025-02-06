import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Transaction } from '../model/transaction';
import { TransactionCreate } from '../model/transaction-create';
import { Apikey } from '../model/apikey';
import { Client } from '../model/client';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  // Definir API
  apiURL = 'https://localhost:3000/api';
  constructor(private http: HttpClient, private auth: AuthService) { }
  //Http options:
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  // Manejo de errores
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
  //Metodos CRUD para consumir el API RESTful
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiURL + '/transacciones')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  createTransaction(transaction: any): Observable<TransactionCreate> {
    return this.http.post<TransactionCreate>(this.apiURL + '/transacciones/procesar-pago', JSON.stringify(transaction), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getApikeys(): Observable<Apikey[]> {
    const headers = new HttpHeaders({
      'pp-token': `${this.auth.getToken()}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<Apikey[]>(`${this.apiURL}/apikeys`, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createApikey(apikey: any): Observable<Apikey> {
    const headers = new HttpHeaders({
      'pp-token': `${this.auth.getToken()}`,
      'Content-Type': 'application/json'
    });

    const body = { apikey_descripcion: apikey.apikeyDescripcion, cliente_id: apikey.clienteId }

    return this.http.post<Apikey>(this.apiURL + '/apikeys', body, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getClients(): Observable<Client[]> {
    const headers = new HttpHeaders({
      'pp-token': `${this.auth.getToken()}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<Client[]>(`${this.apiURL}/clientes`, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createClient(client: any): Observable<Client> {
    const headers = new HttpHeaders({
      'pp-token': `${this.auth.getToken()}`,
      'Content-Type': 'application/json'
    });

    const body = { clienteNombre: client.clienteNombre };

    return this.http.post<Client>(this.apiURL + '/clientes', body, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  updateClient(id: number, name: string): Observable<Client> {
    const headers = new HttpHeaders({
      'pp-token': `${this.auth.getToken()}`,
      'Content-Type': 'application/json'
    });

    const body = { clienteNombre: name };

    return this.http.put<Client>(this.apiURL + '/clientes/' + id, body, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  toggleApikeyStatus(id: any, status: boolean) {
    const headers = new HttpHeaders({
      'pp-token': `${this.auth.getToken()}`,
      'Content-Type': 'application/json'
    });

    const body = { apikey_estado: status };

    return this.http.put<Apikey>(this.apiURL + '/apikeys/' + id, body, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
}