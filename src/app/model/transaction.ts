import { Client } from "./client";
import { TransactionStatus } from "./transaction-status";

export interface Transaction {
    transaccionId: number;
    transaccionMonto: number;
    estadotransaccion: TransactionStatus;
    transaccionFecha: string;
    transaccionMoneda: string;
    transaccionDescripcion: string;
    cliente: Client;
}
