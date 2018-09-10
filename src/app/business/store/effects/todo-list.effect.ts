import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { TodoListModule } from '@Actions/todo-list.action';
import {Observable, of} from 'rxjs';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {TodoService} from '@Services/get-data/todo.service';
import {ITodoListModel} from '@Models/i-todolist-model';
import {catchError} from 'rxjs/internal/operators';

@Injectable()
export  class  TodoListEffects {
  // Ecoute les actions passées dans le store
  @Effect() LoadTasks$: Observable<TodoListModule.Actions> = this.actions$
    .pipe(
      // Si l'action est de type 'LOAD_INIT_TASKS', applique la suite sinon ne fait rien
      ofType(TodoListModule.ActionTypes.LOAD_INIT_TASKS),

      // l'action du switchMap est l'objet d'action qui est récupérer dans le ofType
      // action = { type: '[todoList] Load Init Todos' }
      switchMap(action  =>  this.todoListService.listTask()),
      // Dans le switchMap, on éxécute le service qui retournera la réponse dans le map suivant
      // todos = Todo[]
      // Il n'y a plus qu'à renvoyer une action SuccessInitTasks avec les todos en params
      map((tasks: ITodoListModel[]) => new TodoListModule.SuccessInitTasks(tasks)),

      // Si le resolve n'a pas abouti, il passe dans la fonction catchError
      // Qui renvoie l'action ErrorInitTasks
      catchError(() => of(new TodoListModule.ErrorInitTasks()))
);

  constructor(
    private todoListService: TodoService,
    private actions$: Actions
  ) {}
}
