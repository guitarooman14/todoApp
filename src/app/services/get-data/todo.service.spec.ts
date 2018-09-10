import {inject, TestBed} from '@angular/core/testing';

import {TodoService} from './todo.service';
import {of, Subscription} from 'rxjs';
import {Criticity, ITodoListModel} from '../../business/store/models/i-todolist-model';
import {HttpClient, HttpClientModule} from '@angular/common/http';

describe('TodoService', () => {
  let retrieveDataSubscription: Subscription;
  const spyDataService = jasmine.createSpyObj('spyHttpService', ['get']);
  spyDataService.get.and.returnValue(of<ITodoListModel[]>([{
      id: 0,
      status: false,
      title: 'test',
      description: 'description of test',
      criticity: Criticity.LOW
    }])
  );
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TodoService,
        {
          provide: HttpClient,
          useValue: spyDataService
        }
      ]
    });
  });

  beforeEach(inject([TodoService], (injectedService: TodoService) => {
    service = injectedService;
  }));

  afterEach(() => {
    if (retrieveDataSubscription) {
      retrieveDataSubscription.unsubscribe();
    }
  });

  it('should return 1 task from service', (done) => {
    retrieveDataSubscription = service.listTask().subscribe((res: ITodoListModel[]) => {
      expect(spyDataService.get).toHaveBeenCalled();
      expect(res).not.toBeNull();
      expect(res.length).toEqual(1);
      expect(res[0].title).toEqual('test');
      done();
    });
  });
});
