import {Injectable} from '@angular/core';
import {AbstractTodoService} from './abstract-todo.service';
import {ITodoListModel} from '../../model/i-todolist-model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodoService extends AbstractTodoService {

  constructor(private http: HttpClient) {
    super();
  }

  listTask(): Observable<ITodoListModel[]> {
    return this.http.get<ITodoListModel[]>('assets/data/tasks.json');
  }
}
