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
  chart: Chart | undefined;

  constructor(private authService: AuthService, private router: Router, private statisticService: statisticService) { }

  ngOnInit(): void {
    this.statisticService.getStatistic().subscribe(data => {
      this.statistic = data;
      console.log(this.statistic);
      this.createChart('daily'); // Default to daily view
    });
  }

  createChart(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): void {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const chartData = this.getChartData(period);
        canvas.width = 225; // Daha küçük genişlik
        canvas.height = 70; // Daha küçük yükseklik

        // Destroy the previous chart instance if exists
        if (this.chart) {
          this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Lahmacun', 'Ayran', 'Tatlı', 'Çorba', 'Antep Lahmacun', 'Su', 'Cola', 'Bahşiş'],
            datasets: [{
              label: `Food Statistics (${period.charAt(0).toUpperCase() + period.slice(1)})`,
              data: chartData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
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

  updateChart(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): void {
    this.createChart(period);
  }

  getChartData(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): number[] {
    const totalDays = 14; // 2 weeks
    const daysInMonth = 30; // Average days in a month
    const daysInYear = 365; // Average days in a year

    let dailyData = [
      this.statistic.food.lahmacun / totalDays,
      this.statistic.food.ayran / totalDays,
      this.statistic.food.tatli / totalDays,
      this.statistic.food.corba / totalDays,
      this.statistic.food.AntepLahmacun / totalDays,
      this.statistic.food.su / totalDays,
      this.statistic.food.Cola / totalDays,
      this.statistic.food.bahsis / totalDays
    ];

    let data: number[] = [];

    if (period === 'daily') {
      data = dailyData;
    } else if (period === 'weekly') {
      data = dailyData.map(value => value * 7); // Weekly data
    } else if (period === 'monthly') {
      data = dailyData.map(value => value * daysInMonth / totalDays); // Monthly data
    } else if (period === 'yearly') {
      data = dailyData.map(value => value * daysInYear / totalDays); // Yearly data
    }

    return data;
  }
}
