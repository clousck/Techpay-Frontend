import { Component } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { CommonModule, NgFor } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Transaction } from '../model/transaction';
import { jsPDF } from 'jspdf';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import html2canvas from 'html2canvas';
import { Apikey } from '../model/apikey';
import { Client } from '../model/client';

Chart.register(...registerables)

@Component({
  selector: 'app-reports',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  chartData: Transaction[] = []
  apikeys: Apikey[] = []
  clients: Client[] = []
  labelData: any[] = [];
  realData: any[] = [];
  transactionCountData: number[] = [];
  pieChartData: any[] = [];
  constructor(private restApi: RestApiService) { }

  ngOnInit(): void {
    this.getBarChartData();
    this.getPieChartData();

    this.getApikeys();
    this.getClients();
  }

  getClients() {
    return this.restApi.getClients().subscribe(data => {
      this.clients = data;
    })
  }

  getApikeys() {
    return this.restApi.getApikeys().subscribe(data => {
      this.apikeys = data;
    })
  }

  getMonthYear(fecha: string): string {
    const date = new Date(fecha);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  getPieChartData() {
    return this.restApi.getTransactions().subscribe(data => {
      this.chartData = data;

      // Mapeo de IDs a nombres de estados
      const estadoMap: { [key: number]: string } = {
        1: "Inválida",
        2: "Datos incorrectos",
        3: "Rechazada",
        4: "Aprobada",
        5: "Pendiente"
      };

      // Agrupar las transacciones por estado
      const estadoCounts: { [key: number]: number } = {};

      this.chartData.forEach(o => {
        if (!estadoCounts[o.estadotransaccion.estadotrId]) {
          estadoCounts[o.estadotransaccion.estadotrId] = 0;
        }
        estadoCounts[o.estadotransaccion.estadotrId] += 1;
      });

      console.log("Transacciones por estado:", estadoCounts);

      // Convertir los datos al formato requerido por ngx-charts con nombres descriptivos
      this.pieChartData = Object.keys(estadoCounts).map(key => ({
        name: estadoMap[Number(key)] || `Estado ${key}`, // Si no hay un nombre, se usa "Estado X"
        value: estadoCounts[Number(key)]
      }));

      console.log("Datos para gráfico de pie:", this.pieChartData);
    });
  }

  getBarChartData() {
    return this.restApi.getTransactions().subscribe(data => {
      this.chartData = data;

      // Objetos para agrupar por mes/año tanto el monto como el número de transacciones
      const groupedData: { [key: string]: { monto: number, count: number } } = {};

      this.chartData.forEach(o => {
        const mesAnio = this.getMonthYear(o.transaccionFecha);
        const monto = Number(o.transaccionMonto); // Convertir a número por si acaso

        // Verificamos que el monto es un número válido
        console.log(`Procesando: ${monto} en ${mesAnio}`);

        if (!isNaN(monto)) { // Solo sumar si es un número válido
          if (!groupedData[mesAnio]) {
            groupedData[mesAnio] = { monto: 0, count: 0 };
          }
          groupedData[mesAnio].monto += monto; // Sumar el monto
          groupedData[mesAnio].count += 1; // Contar las transacciones
        }
      });

      console.log("Datos agrupados:", groupedData);

      this.labelData = Object.keys(groupedData);
      this.realData = Object.values(groupedData).map(item => item.monto); // Monto total
      this.transactionCountData = Object.values(groupedData).map(item => item.count); // Cantidad de transacciones

      console.log("Label Data:", this.labelData);
      console.log("Real Data (Monto):", this.realData);
      console.log("Transaction Count Data:", this.transactionCountData);

      // Limpiar gráfico antes de renderizar
      this.renderChart(this.labelData, this.realData, this.transactionCountData);
    });
  }

  chartInstance: any;

  renderChart(labelData: any, valueData: any, countData: any) {
    const canvas = document.getElementById('barchart') as HTMLCanvasElement;
    if (this.chartInstance) {
      this.chartInstance.destroy(); // Destruir el gráfico previo si ya existe
    }

    this.chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labelData,
        datasets: [
          {
            label: 'Monto Total por Mes',
            data: valueData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(9, 168, 168)',
            borderWidth: 1
          },
          {
            label: 'Cantidad de Transacciones por Mes',
            data: countData,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  exportTransactionsToCSV() {
    const headers = ["ID", "Monto", "Fecha", "Moneda", "Descripción", "Estado", "Cliente"];
    const csvRows = this.chartData.map(transaction => [
      transaction.transaccionId,
      transaction.transaccionMonto,
      transaction.transaccionFecha,
      transaction.transaccionMoneda,
      transaction.transaccionDescripcion,
      transaction.estadotransaccion.estadotrNombre,
      transaction.cliente.clienteNombre
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transacciones.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  exportApikeysToCSV() {
    const headers = ["ID", "Descripción", "Estado", "Cliente"];
    const csvRows = this.apikeys.map(apikey => [
      apikey.apikeyId,
      apikey.apikeyDescripcion,
      apikey.apikeyEstado ? 'Activo' : 'Inactivo', // Asumiendo que 'apikeyEstado' es un booleano
      apikey.clienteId
    ]);


    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'apikeys.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  exportClientsToCSV() {
    const headers = ["ID", "Descripción", "Estado", "Cliente"];
    const csvRows = this.clients.map(client => [
      client.clienteId,
      client.transacciones.map(transaction => String(transaction.transaccionDescripcion)).join(', '), // Asegurarse de convertir a string
      client.isEditing ? 'Editando' : 'No editando',
      client.clienteNombre
    ]);

    // Si se necesita que las filas sean un solo array:
    const csvData = csvRows.flat(); // Si tienes varios clientes, aplanamos el arreglo.



    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  exportBarChartToPDF() {
    const canvasElement = document.getElementById('barchart') as HTMLCanvasElement;

    html2canvas(canvasElement).then((canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 120); // Ajusta tamaño según lo necesites
      pdf.save('Transacciones-Bar.pdf');
    });
  }

  exportPieChartToPDF() {
    const pieChartElement = document.getElementById('pieChartContainer');

    if (pieChartElement) {
      html2canvas(pieChartElement, { scale: 2 }).then((canvas) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');

        const imgWidth = 190; // Ajusta el ancho en mm
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Mantiene la proporción

        let position = 10;
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);

        pdf.save('Transacciones-Pie.pdf');
      });
    }
  }
}
