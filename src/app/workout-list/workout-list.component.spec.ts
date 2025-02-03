import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutListComponent } from './workout-list.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutListComponent],
      providers:[
        {provide:ActivatedRoute,
          useValue:{
            params: of({id:2})
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
