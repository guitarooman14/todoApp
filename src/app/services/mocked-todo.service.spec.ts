import { TestBed, inject } from '@angular/core/testing';

import { MockedTodoService } from './mocked-todo.service';

describe('MockedTodoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockedTodoService]
    });
  });

  it('should be created', inject([MockedTodoService], (service: MockedTodoService) => {
    expect(service).toBeTruthy();
  }));
});
