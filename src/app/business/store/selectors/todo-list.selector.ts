import {createSelector} from '@ngrx/store';
import {AppState} from '@StoreConfig';

export const selectTodoListState$ = (state: AppState) => state.tasks;

export  const  selectTodosLoading$ =
  createSelector(selectTodoListState$, ( tasks ) =>  tasks.loading);

export  const  selectTodosLoaded$ =
  createSelector(selectTodoListState$, ( tasks ) =>  tasks.loaded);
