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

  constructor(private authService: AuthService, private router: Router, private statisticService: statisticService) { }

  ngOnInit(): void {
    this.statisticService.getStatistic().subscribe(data => {
      this.statistic = data;
      console.log(this.statistic);
      this.createFoodChart('daily'); // Default to daily view
      this.createCostChart('daily'); // Default to daily view
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
            labels: ['Lahmacun', 'Ayran', 'Tatlı', 'Çorba', 'Antep Lahmacun', 'Su', 'Cola', 'Bahşiş'],
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
            labels: ['Lahmacun', 'Ayran', 'Tatlı', 'Çorba', 'Antep Lahmacun', 'Su', 'Cola', 'Bahşiş'],
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
    this.createFoodChart(period);
    this.createCostChart(period);
  }

  getChartData(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): number[] {
    const daysInMonth = 30; // Average days in a month
    const daysInYear = 365; // Average days in a year
    const weeksInYear = 52; // Weeks in a year

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

    if (period === 'daily') {
      data = dailyData;
    } else if (period === 'weekly') {
      data = dailyData.map(value => (value / 14) * 7); // Weekly data
    } else if (period === 'monthly') {
      data = dailyData.map(value => (value / 14) * daysInMonth); // Monthly data
    } else if (period === 'yearly') {
      data = dailyData.map(value => (value / 14) * daysInYear); // Yearly data
    }

    return data;
  }

  getCostData(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): number[] {
    const daysInMonth = 30; // Average days in a month
    const daysInYear = 365; // Average days in a year
    const weeksInYear = 52; // Weeks in a year

    let costData = this.prices.map(item => item.price);
    let dailyData = this.getChartData('daily');

    let cost: number[] = [];

    if (period === 'daily') {
      cost = costData.map((price, index) => dailyData[index] * price);
    } else if (period === 'weekly') {
      cost = costData.map((price, index) => (dailyData[index] / 7) * price);
    } else if (period === 'monthly') {
      cost = costData.map((price, index) => (dailyData[index] / 30) * price);
    } else if (period === 'yearly') {
      cost = costData.map((price, index) => (dailyData[index] / 365) * price);
    }

    return cost;
  }
}
