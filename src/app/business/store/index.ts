import {ActionReducerMap} from '@ngrx/store';
import {InjectionToken} from '@angular/core';

import {TodoListEffects} from './effects/todo-list.effect';
import {TodoListStateEntity} from '@Models/i-todolist-model';
import {todosReducer} from '@Reducers/todo-list.reducer';

// Root reducer
const reducers = {
  tasks: todosReducer
};

export const appEffects = [TodoListEffects];

export interface AppState {
  tasks: TodoListStateEntity;
}
// Mandatory for AOT
export function getReducers() {
  return reducers;
}
// Mandatory for AOT
export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<AppState>>('Registered Reducers');
