import {inject, TestBed} from '@angular/core/testing';

import {MockedTodoService} from './mocked-todo.service';
import {Subscription} from 'rxjs';
import {ITodoListModel} from '../../business/store/models/i-todolist-model';

describe('MockedTodoService', () => {
  let retrieveDataSubscription: Subscription;
  let service: MockedTodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockedTodoService]
    });
  });

  beforeEach(inject([MockedTodoService], (injectedService: MockedTodoService) => {
    service = injectedService;
  }));

  afterEach(() => {
    if (retrieveDataSubscription) {
      retrieveDataSubscription.unsubscribe();
    }
  });

  it('should return 2 task from mocked service', (done) => {
    retrieveDataSubscription = service.listTask().subscribe((res: ITodoListModel[]) => {
      expect(res).not.toBeNull();
      expect(res.length).toEqual(2);
      expect(res[0].title).toEqual('faire les courses');
      done();
    });
  });
});
