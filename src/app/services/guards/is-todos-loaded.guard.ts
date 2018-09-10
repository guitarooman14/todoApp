import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {AppState} from '@StoreConfig';
import {Observable} from 'rxjs';
import {selectTodosLoaded$} from '@Selectors/todo-list.selector';
import {map} from 'rxjs/internal/operators';
import {TodoListModule} from '@Actions/todo-list.action';

@Injectable()
export class IsTodosLoadedGuard implements CanActivate {

  constructor(private store: Store<AppState>) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.store
      .pipe(
        select(selectTodosLoaded$),
        map(isLoaded => {
          if (!isLoaded) {
            this.store.dispatch(new TodoListModule.LoadInitTasks());
          }
          return true;
        })
      );
  }
}
