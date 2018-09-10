import {Action} from '@ngrx/store';
import {ITodoListModel, ITodoListState} from '../models/i-todolist-model';

export namespace TodoListModule {

  export enum ActionTypes {
    LOAD_INIT_TASKS = '[todoList] Load Init Todos',
    SUCCESS_INIT_TASKS = '[todoList] Success Init Todos',
    ERROR_INIT_TASKS = '[todoList] Error Init Todos',
    ADD_TASK = '[todoList] add task',
    REMOVE_TASK = '[todoList] remove task'
  }

  export class LoadInitTasks implements Action {
    readonly type = ActionTypes.LOAD_INIT_TASKS;
  }

  export class SuccessInitTasks implements Action {
    readonly type = ActionTypes.SUCCESS_INIT_TASKS;
    constructor(public payload: ITodoListModel[]) {}
  }

  export class ErrorInitTasks implements Action {
    readonly  type = ActionTypes.ERROR_INIT_TASKS;
  }

  export class AddTask implements Action {
    readonly type = ActionTypes.ADD_TASK;
    constructor(public payload: ITodoListModel) { }
  }

  export class RemoveTask implements Action {
    readonly type = ActionTypes.REMOVE_TASK;
    constructor(public payload: number) { }
  }

  export type Actions = LoadInitTasks | SuccessInitTasks | ErrorInitTasks | AddTask | RemoveTask;
}
