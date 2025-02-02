import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../Models/workout.model';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WorkoutService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(WorkoutService);

    // Mock localStorage methods individually
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) => mockLocalStorage[key] || null);
    spyOn(window.localStorage, 'setItem').and.callFake((key: string, value: string) => mockLocalStorage[key] = value);
  });

  // Reset localStorage mock before each test
  let mockLocalStorage: { [key: string]: string } = {};

  beforeEach(() => {
    mockLocalStorage = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty users array if localStorage is empty', () => {
    expect(service.getUsers()).toEqual([]);
  });

  it('should return users from localStorage', () => {
    const mockUsers: User[] = [{ id: 1, name: 'John', workouts: [] }];
    mockLocalStorage['UserData'] = JSON.stringify(mockUsers);
    expect(service.getUsers()).toEqual(mockUsers);
  });

  it('should save users to localStorage', () => {
    const mockUsers: User[] = [{ id: 2, name: 'Doe', workouts: [] }];
    service.saveUsers(mockUsers);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('UserData', JSON.stringify(mockUsers));
  });

  it('should add a new user and update localStorage', () => {
    const mockUsers: User[] = [];
    spyOn(service, 'getUsers').and.returnValue(mockUsers);
    spyOn(service, 'saveUsers');

    const newUser: User = { id: 3, name: 'Alice', workouts: [] };
    service.addUser(newUser);

    expect(mockUsers.length).toBe(1);
    expect(mockUsers[0]).toEqual(newUser);
    expect(service.saveUsers).toHaveBeenCalledWith(mockUsers);
  });

  it('should add a workout for an existing user', () => {
    const mockUsers: User[] = [{ id: 4, name: 'Bob', workouts: [] }];
    spyOn(service, 'getUsers').and.returnValue(mockUsers);
    spyOn(service, 'saveUsers');

    const workout = { type: 'Running', minutes: 30 };
    service.addWorkout(4, workout);

    expect(mockUsers[0].workouts.length).toBe(1);
    expect(mockUsers[0].workouts[0]).toEqual(workout);
    expect(service.saveUsers).toHaveBeenCalledWith(mockUsers);
  });

  it('should not add a workout if user is not found', () => {
    const mockUsers: User[] = [{ id: 5, name: 'Charlie', workouts: [] }];
    spyOn(service, 'getUsers').and.returnValue(mockUsers);
    spyOn(service, 'saveUsers');

    service.addWorkout(99, { type: 'Swimming', minutes: 45 });

    expect(mockUsers[0].workouts.length).toBe(0);
    expect(service.saveUsers).not.toHaveBeenCalled();
  });

  it('should return empty array if not running in a browser', () => {
    const serviceNonBrowser = new WorkoutService('server');
    expect(serviceNonBrowser.getUsers()).toEqual([]);
  });
});
