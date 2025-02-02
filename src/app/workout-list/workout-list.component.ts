import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { WorkoutService } from '../services/workout.service';
import { User } from '../Models/workout.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-workout-list',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.css'
})
export class WorkoutListComponent implements OnInit {
  
  users: User[] = [];
  initialUsers: User[] = [ 
    {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      workouts: [
        { type: 'Swimming', minutes: 60 },
        { type: 'Running', minutes: 20 },
      ],
    },
    {
      id: 3,
      name: 'Mike Johnson',
      workouts: [
        { type: 'Yoga', minutes: 50 },
        { type: 'Cycling', minutes: 40 },
      ],
    },
  ];

  searchText = '';
  filterType = '';
  currentPage = 1;
  itemsPerPage = 5;
  workouts : any[]=[];
  showNotification: boolean = false;

  



  constructor(private workoutService: WorkoutService, @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUsers = localStorage.getItem('UserData');
      this.users = storedUsers ? JSON.parse(storedUsers) : this.initialUsers;
    } else {
      this.users = this.initialUsers; 
    }

    this.workoutService.saveUsers(this.users);
      
  }


  get filteredUsers(): User[] {
    return this.users.filter((user)=>user.name.toLowerCase().includes(this.searchText.toLowerCase())).filter((user)=>this.filterType ? user.workouts.some((w)=>w.type === this.filterType) : true);
  }

  getWorkoutTypes(user: User): string {
    if (!user.workouts || !Array.isArray(user.workouts)) {
      return "No Workouts";
    }
    return user.workouts.map(workout => workout.type).join(', ');

  }
  
  
  get PaginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  

  onPageChange(page:number){
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getTotalWorkoutMinutes(user: User): number {
  return user.workouts.reduce((total, w) => total + w.minutes, 0);
  }

  
  



}
