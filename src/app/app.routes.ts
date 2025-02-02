import { Routes } from '@angular/router';
import { WorkoutFormComponent } from './workout-form/workout-form.component';
import { WorkoutListComponent } from './workout-list/workout-list.component';
import { WorkoutChartComponent } from './workout-chart/workout-chart.component';

export const routes: Routes = [
    {
        path: '',
        component: WorkoutFormComponent,
    },
    {
        path: 'workout-list',
        component: WorkoutListComponent,
    },
    {
        path: 'workout-charts',
        component: WorkoutChartComponent,
    },
    
];
