import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { statisticService } from '../../services/statistic.client.service'; 
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'website-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  statistic: any;
  chartFood: Chart | undefined;
  chartCost: Chart | undefined;
  prices = [
    { name: 'Lahmacun', price: 130 },
    { name: 'Ayran', price: 45 },
    { name: 'Tatlı', price: 30 },
    { name: 'Bahşiş', price: 1 },
    { name: 'Çorba', price: 80 },
    { name: 'Antep Lahmacun', price: 150 },
    { name: 'Su', price: 15 },
    { name: 'Cola', price: 55 },
    { name: 'Içli Köfte', price: 90 }
  ];
  
  activePeriod: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly'; // Default period

  constructor(private authService: AuthService, private router: Router, private statisticService: statisticService) { }

  ngOnInit(): void {
    this.statisticService.getStatistic().subscribe(data => {
      this.statistic = data;
      console.log(this.statistic);
      this.createFoodChart(this.activePeriod); // Default to weekly view
      this.createCostChart(this.activePeriod); // Default to weekly view
    });
  }

  createFoodChart(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): void {
    const canvas = document.getElementById('foodChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const chartData = this.getChartData(period);
        canvas.width = 250; // Adjust width
        canvas.height = 120; // Adjust height

        // Destroy the previous chart instance if exists
        if (this.chartFood) {
          this.chartFood.destroy();
        }

        this.chartFood = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Lahmacun', 'Ayran', 'Tatlı', 'Çorba', 'Antep Lahmacun', 'Içli Köfte', 'Cola', 'Bahşiş','Su'],
            datasets: [{
              label: `Food Statistics (${period.charAt(0).toUpperCase() + period.slice(1)})`,
              data: chartData,
              backgroundColor: 'rgba(75, 192, 192, 1)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  }

  createCostChart(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): void {
    const canvas = document.getElementById('costChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const costData = this.getCostData(period);
        canvas.width = 250; // Adjust width
        canvas.height = 120; // Adjust height

        // Destroy the previous chart instance if exists
        if (this.chartCost) {
          this.chartCost.destroy();
        }

        this.chartCost = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Lahmacun', 'Ayran', 'Tatlı', 'Çorba', 'Antep Lahmacun', 'Içli Köfte', 'Cola', 'Bahşiş','Su'],
            datasets: [{
              label: `Cost (${period.charAt(0).toUpperCase() + period.slice(1)})`,
              data: costData,
              backgroundColor: 'rgba(255, 99, 132, 1)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  }

  updateCharts(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): void {
    this.activePeriod = period; // Update active period
    this.createFoodChart(period);
    this.createCostChart(period);
  }

  getChartData(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): number[] {
    let dailyData = [
      this.statistic.food.lahmacun,
      this.statistic.food.ayran,
      this.statistic.food.tatli,
      this.statistic.food.corba,
      this.statistic.food.AntepLahmacun,
      this.statistic.food.su,
      this.statistic.food.Cola,
      this.statistic.food.bahsis
    ];

    let data: number[] = [];

    if (period === 'weekly') {
      data = dailyData;
    } else if (period === 'daily') {
      data = dailyData.map(value => value / 7); // Weekly data
    } else if (period === 'monthly') {
      data = dailyData.map(value => value / 30); // Monthly data
    } else if (period === 'yearly') {
      data = dailyData.map(value => value / 365); // Yearly data
    }

    return data;
  }

  getCostData(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): number[] {
    let costData = this.prices.map(item => item.price);
    let chartData = this.getChartData(period);
    let cost: number[] = [];

    if (period === 'daily') {
      cost = costData.map((price, index) => (chartData[index] * price)); // Daily cost
    } else if (period === 'weekly') {
      cost = costData.map((price, index) => (chartData[index] * price)); // Weekly cost
    } else if (period === 'monthly') {
      cost = costData.map((price, index) => (chartData[index] * price)); // Monthly cost
    } else if (period === 'yearly') {
      cost = costData.map((price, index) => (chartData[index] * price)); // Yearly cost
    }

    return cost;
  }
}
