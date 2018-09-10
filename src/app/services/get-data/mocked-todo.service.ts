import {Injectable} from '@angular/core';
import {AbstractTodoService} from './abstract-todo.service';
import {Observable, of} from 'rxjs';
import {Criticity, ITodoListModel} from '../../business/store/models/i-todolist-model';

@Injectable({
  providedIn: 'root'
})
export class MockedTodoService extends AbstractTodoService {

  private MOCKED_DATA: ITodoListModel[] = [{
    id: 0,
    status: true,
    title: 'faire les courses',
    description: 'Aller à Fenouillet pour faire les courses de la semaine juste avant d\'aller au sport',
    criticity: Criticity.NORMAL
  },
    {
      id: 1,
      status: true,
      title: 'aller au sport à 20h',
      description: 'Haltéro cours spécifique',
      criticity: Criticity.URGENT
    }];

  constructor() {
    super();
  }

  listTask(): Observable<ITodoListModel[]> {
    return of(this.MOCKED_DATA);
  }
}
