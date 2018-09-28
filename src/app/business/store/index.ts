import {ActionReducerMap} from '@ngrx/store';
import {InjectionToken} from '@angular/core';

import {todosReducer} from '@Reducers/todo-list.reducer';
import {ITodoListState} from '@Models/i-todolist-model';
import {TodoListEffects} from './effects/todo-list.effect';

// Root reducer
const reducers = {
  tasks: todosReducer
};

export const appEffects = [TodoListEffects];

export interface AppState {
  tasks: ITodoListState;
}
// Mandatory for AOT
export function getReducers() {
  return reducers;
}
// Mandatory for AOT
export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<AppState>>('Registered Reducers');
