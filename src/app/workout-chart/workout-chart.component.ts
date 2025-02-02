import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js'
import { User } from '../Models/workout.model';
import { isPlatformBrowser, CommonModule } from '@angular/common'; 

Chart.register(...registerables);

@Component({
  selector: 'app-workout-chart',
  imports: [
    CommonModule
  ],
  templateUrl: './workout-chart.component.html',
  styleUrl: './workout-chart.component.css'
})

export class WorkoutChartComponent implements OnInit, AfterViewInit {
  @ViewChild('workoutChart') workoutChartRef!: ElementRef;
  workoutChart: Chart | undefined;

  users: User[] =[];
  selectedUser: User | undefined;


  @Input() user: User | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.fetchUsersFromLocalStorage();
  }

  
  
  ngAfterViewInit(): void {
    this.createChart();
  }
  
  fetchUsersFromLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUsers = localStorage.getItem('UserData'); // Use your actual key
      this.users = storedUsers ? JSON.parse(storedUsers) : [];

      if (this.users.length > 0) {
        this.selectedUser = this.users[0]; // Select the first user by default
      }
    }
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.createChart();
  }

  createChart() {
    if (!this.workoutChartRef || !this.selectedUser) return;
    if (this.workoutChart) {
      this.workoutChart.destroy();
      this.workoutChart = undefined; // Important: Reset the chart variable
    }

    const ctx = this.workoutChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    

    const workoutData = this.prepareWorkoutData(this.selectedUser);

    this.workoutChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: workoutData.labels,
        datasets: [{
          label: 'Minutes',
          data: workoutData.data,
          backgroundColor: 'rgba(153, 204, 255, 0.5)',
          borderColor: 'rgba(153, 204, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Minutes'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Workout Type'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: `${this.selectedUser.name}'s Workout Progress`,
            font: {
              size: 16
            }
          },
          legend: {
            display: true,
            labels: {
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  prepareWorkoutData(user: User): { labels: string[], data: number[] } {
    const labels: string[] = [];
    const data: number[] = [];

    if (user.workouts && Array.isArray(user.workouts)) {
      user.workouts.forEach(workout => {
        labels.push(workout.type);
        data.push(workout.minutes);
      });
    }

    return { labels, data };
  }
}
