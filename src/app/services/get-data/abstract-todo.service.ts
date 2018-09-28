import {ITodoListModel} from '@Models/i-todolist-model';
import {Observable} from 'rxjs';

export abstract class AbstractTodoService {
  abstract listTask(): Observable<ITodoListModel[]>;
}
