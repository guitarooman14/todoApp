import {Injectable} from '@angular/core';
import {AbstractTodoService} from './abstract-todo.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ITodoListModel} from '@Models/i-todolist-model';

@Injectable({
  providedIn: 'root'
})
export class TodoService extends AbstractTodoService {

  constructor(private http: HttpClient) {
    super();
  }

  listTask(): Observable<ITodoListModel[]> {
    // check render with 5s delay
    // return timer(5000).pipe(switchMap(() => this.http.get<ITodoListModel[]>('assets/data/tasks.json')));
    return this.http.get<ITodoListModel[]>('assets/data/tasks.json');
  }
}
