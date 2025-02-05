import { Apikey } from "./apikey";
import { Transaction } from "./transaction";

export interface Client {
    clienteId: number;
    clienteNombre: string;
    apikeys: Apikey[];
    transacciones: Transaction[];
}
