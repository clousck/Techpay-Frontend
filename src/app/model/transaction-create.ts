export interface TransactionCreate {
    apiKey: string;
    tarjetaNumero: string;
    tarjetaCvv: number;
    tarjetaTitular: string;
    tarjetaFecha: string;
    monto: number;
    moneda: string;
    descripcion: string;
}
