import { Injectable, PLATFORM_ID, Inject, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../Models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private StorageKey = 'UserData';

  constructor(@Inject(PLATFORM_ID) private platformId: Object){}

  getUsers(): User[]{
    if (isPlatformBrowser(this.platformId)) { 
      const data = window.localStorage.getItem(this.StorageKey);
      return data ? JSON.parse(data) : [];
    } else {
      return []; 
    }
  }

  saveUsers(users: User[]): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(this.StorageKey, JSON.stringify(users));
    }
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  addWorkout(userId: number, workout: { type:string; minutes: number}): void {
    const users = this.getUsers();
    const user = users.find((u)=> u.id === userId);
    if(user){
      user.workouts.push(workout);
      this.saveUsers(users);
    }
  }

  
}
