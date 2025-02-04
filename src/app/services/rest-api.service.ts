import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Transaction } from '../model/transaction';
import { TransactionCreate } from '../model/transaction-create';
import { Apikey } from '../model/apikey';
import { Client } from '../model/client';
@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  // Definir API
  apiURL = 'https://localhost:3000/api';
  constructor(private http: HttpClient) { }
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
  getTransactions(): Observable<Transaction> {
    return this.http.get<Transaction>(this.apiURL + '/transacciones')
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

  aproveTransaction(id: any) {
    // return this.http.put<Transaction>(this.apiURL + '/transacciones/' + id, this.httpOptions)
    //   .pipe(
    //     retry(1),
    //     catchError(this.handleError)
    //   )
    console.log("Aproving transaction " + id);
    return this.http.get<Transaction>(this.apiURL + '/transacciones')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getApikeys(): Observable<Apikey> {
    return this.http.get<Apikey>(this.apiURL + '/apikeys')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getClients(): Observable<Client> {
    return this.http.get<Client>(this.apiURL + '/clientes')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
}