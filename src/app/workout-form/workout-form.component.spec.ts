import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WorkoutFormComponent } from './workout-form.component';
import { WorkoutService } from '../services/workout.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;


  beforeEach(async () => {
    const workoutServiceSpy = jasmine.createSpyObj('WorkoutService', ['getUsers', 'addUser', 'addWorkout']);
    await TestBed.configureTestingModule({
      imports: [WorkoutFormComponent, FormsModule],
      providers: [{ provide: WorkoutService, useValue: workoutServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.userName).toBe('');
    expect(component.workoutType).toBe('');
    expect(component.workoutMinutes).toBe(0);
    expect(component.workoutTypes).toEqual(['Running', 'Cycling', 'Swimming', 'Yoga']);
    expect(component.showNotification).toBeFalse();
  });

  it('should add a workout if user exists', () => {
    const existingUser = { id: 1, name: 'John', workouts: [] };
    workoutService.getUsers.and.returnValue([existingUser]);

    component.userName = 'John';
    component.workoutType = 'Running';
    component.workoutMinutes = 30;

    component.addWorkout();

    expect(workoutService.addWorkout).toHaveBeenCalledWith(1, { type: 'Running', minutes: 30 });
  });

  it('should create a new user if user does not exist', () => {
    workoutService.getUsers.and.returnValue([]);

    component.userName = 'Alice';
    component.workoutType = 'Cycling';
    component.workoutMinutes = 45;

    component.addWorkout();

    expect(workoutService.addUser).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Alice',
      workouts: [{ type: 'Cycling', minutes: 45 }]
    }));
  });

  it('should not add workout if form is invalid', () => {
    component.userName = ''; 
    component.workoutType = 'Running';
    component.workoutMinutes = 20;

    component.addWorkout();

    expect(workoutService.addWorkout).not.toHaveBeenCalled();
    expect(workoutService.addUser).not.toHaveBeenCalled();
  });

  it('should show and hide the notification after adding a workout', fakeAsync(() => {
    workoutService.getUsers.and.returnValue([{ id: 1, name: 'John', workouts: [] }]);

    component.userName = 'John';
    component.workoutType = 'Running';
    component.workoutMinutes = 30;

    component.addWorkout();
    tick();

    expect(component.showNotification).toBeTrue();

    tick(3000); 
    expect(component.showNotification).toBeFalse();
  }));
  





  











});
