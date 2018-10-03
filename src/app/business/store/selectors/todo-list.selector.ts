import {createSelector} from '@ngrx/store';
import {AppState} from '@StoreConfig';
import * as fromTasks from '@Reducers/todo-list.reducer';

export const selectTodoListState$ = (state: AppState) => state.tasks;

export const selectTodoListData$ =
  createSelector(selectTodoListState$, fromTasks.selectTasks);

export  const  selectTodosLoading$ =
  createSelector(selectTodoListState$, ( tasks ) =>  tasks.loading);

export  const  selectTodosLoaded$ =
  createSelector(selectTodoListState$, ( tasks ) =>  tasks.loaded);

export const selectTodosLogs$ =
  createSelector(selectTodoListState$, (tasks) => tasks.logs);
