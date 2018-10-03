import {Action} from '@ngrx/store';
import {ITodoListModel} from '@Models/i-todolist-model';
import {HttpErrorResponse} from '@angular/common/http';

export namespace TodoListModule {

  export enum ActionTypes {
    LOAD_INIT_TASKS = '[todoList] Load Init Todos',
    SUCCESS_INIT_TASKS = '[todoList] Success Init Todos',
    LOAD_ADD_TASK = '[todoList] add task',
    SUCCESS_ADD_TASK = '[todoList] Success Add Todo',
    LOAD_REMOVE_TASK = '[todoList] remove task',
    SUCCESS_REMOVE_TASK = '[todoList] Success Remove Todo',
    LOAD_UPDATE_TASK = '[todoList] update task',
    SUCCESS_UPDATE_TASK = '[todoList] Success Update Todo',
    LOAD_ERROR_ACTION = '[todoList] Error Load Action',
  }

  export class LoadInitTasks implements Action {
    readonly type = ActionTypes.LOAD_INIT_TASKS;
  }

  export class SuccessInitTasks implements Action {
    readonly type = ActionTypes.SUCCESS_INIT_TASKS;
    constructor(public payload: ITodoListModel[]) {}
  }

  export class LoadAddTask implements Action {
    readonly type = ActionTypes.LOAD_ADD_TASK;
    constructor(public payload: ITodoListModel) { }
  }

  export class SuccessAddTask implements Action {
    readonly type = ActionTypes.SUCCESS_ADD_TASK;
    constructor(public payload: ITodoListModel) { }
  }

  export class LoadRemoveTask implements Action {
    readonly type = ActionTypes.LOAD_REMOVE_TASK;
    constructor(public payload: number) { }
  }

  export class SuccessRemoveTask implements Action {
    readonly type = ActionTypes.SUCCESS_REMOVE_TASK;
    constructor(public payload: number) { }
  }

  export class LoadUpdateTask implements Action {
    readonly type = ActionTypes.LOAD_UPDATE_TASK;
    constructor(public payload: ITodoListModel) { }
  }

  export class SuccessUpdateTask implements Action {
    readonly type = ActionTypes.SUCCESS_UPDATE_TASK;
    constructor(public payload: ITodoListModel) { }
  }

  export class ErrorAction implements Action {
    readonly type = ActionTypes.LOAD_ERROR_ACTION;
    constructor(public payload: HttpErrorResponse) {}
  }


  export type Actions =
    LoadInitTasks |
    SuccessInitTasks |
    LoadAddTask |
    SuccessAddTask|
    LoadRemoveTask |
    SuccessRemoveTask |
    LoadUpdateTask |
    SuccessUpdateTask |
    ErrorAction;
}
