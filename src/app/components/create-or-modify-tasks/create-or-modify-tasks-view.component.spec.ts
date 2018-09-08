import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrModifyTasksComponent } from './create-or-modify-tasks-view.component';

describe('CreateOrModifyTasksComponent', () => {
  let component: CreateOrModifyTasksComponent;
  let fixture: ComponentFixture<CreateOrModifyTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrModifyTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrModifyTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
