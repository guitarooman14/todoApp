import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundTaskComponent } from './not-found-task.component';

describe('NotFoundTaskComponent', () => {
  let component: NotFoundTaskComponent;
  let fixture: ComponentFixture<NotFoundTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotFoundTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
