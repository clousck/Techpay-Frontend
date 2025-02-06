import { Component } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { CommonModule, NgFor } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Transaction } from '../model/transaction';
import { jsPDF } from 'jspdf';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import html2canvas from 'html2canvas';

Chart.register(...registerables)

@Component({
  selector: 'app-reports',
  imports: [NgFor, CommonModule, NgxChartsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  chartData: Transaction[] = []
  labelData: any[] = [];
  realData: any[] = [];
  transactionCountData: number[] = [];
  constructor(private restApi: RestApiService) { }

  ngOnInit(): void {
    this.getChartData();
  }

  getMonthYear(fecha: string): string {
    const date = new Date(fecha);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  getChartData() {
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

  exportToCSV() {
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

  exportToPDF() {
    const canvasElement = document.getElementById('barchart') as HTMLCanvasElement;

    html2canvas(canvasElement).then((canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 120); // Ajusta tamaño según lo necesites
      pdf.save('grafico.pdf');
    });
  }
}
