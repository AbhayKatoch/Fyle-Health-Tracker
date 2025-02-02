import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkoutService } from '../services/workout.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-workout-form',
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  
  ],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.css'
})
export class WorkoutFormComponent {
  userName = '';
  workoutType = '';
  workoutMinutes = 0;

  workoutTypes = ['Running', 'Cycling', 'Swimming', 'Yoga'];
  showNotification: boolean = false;

  
  constructor(private workoutService: WorkoutService){}

  addWorkout(){
    if(this.userName && this.workoutType && this.workoutMinutes >0 ){
      const user = this.workoutService.getUsers().find((u)=>u.name ===this.userName);

      if(user){
        this.workoutService.addWorkout(user.id, {
          type:this.workoutType,
          minutes : this.workoutMinutes,
        });
      } else{
        const newUser = {
          id: Date.now(),
          name : this.userName,
          workouts:[{
            type: this.workoutType,
            minutes: this.workoutMinutes,
          }],
        };
        this.workoutService.addUser(newUser);
      }
    }
    

    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

}
