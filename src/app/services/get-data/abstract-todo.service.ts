import {ITodoListModel} from '../../model/i-todolist-model';
import {Observable} from 'rxjs';

export abstract class AbstractTodoService {
  abstract listTask(): Observable<ITodoListModel[]>;
}
