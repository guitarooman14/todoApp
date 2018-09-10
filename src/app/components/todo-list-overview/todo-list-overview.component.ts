import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, Sort} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {ITodoListModel} from '@Models/i-todolist-model';
import {AbstractTodoService} from '@Services/get-data/abstract-todo.service';
import {AppState} from '@StoreConfig';
import {TodoListModule} from '@Actions/todo-list.action';
import {selectTodosLoading$} from '@Selectors/todo-list.selector';
import {fadeInTransition} from '../../render/animations/animations';

@Component({
  selector: 'app-todo-list-overview',
  templateUrl: './todo-list-overview.component.html',
  styleUrls: ['./todo-list-overview.component.scss'],
  animations: [fadeInTransition],
  encapsulation: ViewEncapsulation.None
})
export class TodoListOverviewComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['status', 'title', 'criticity', 'action'];
  public isLoading = true;
  public dataSource: MatTableDataSource<ITodoListModel>;
  public selection = new SelectionModel<ITodoListModel>(true, []);
  public tasksLoading: Observable<boolean>;
  public isLoadingStatic: boolean;
  public toDoListItemsWithRedux: Observable<ITodoListModel[]>;
  private getTasksSubscription: Subscription;
  private isLoadingSubscription: Subscription;

  constructor(private todoService: AbstractTodoService,
              private router: Router,
              private store: Store<AppState>) {
    this.tasksLoading = store.pipe(select(selectTodosLoading$));
    this.toDoListItemsWithRedux = this.store.pipe(select((state) => state.tasks.data));
    this.isLoadingStatic = true;
  }

  ngOnInit(): void {
    this.isLoadingSubscription = this.tasksLoading.subscribe((isLoading: boolean) => {
      this.isLoadingStatic = isLoading;
    });
    this.getTasksSubscription = this.toDoListItemsWithRedux.subscribe((tasks: ITodoListModel[]) => {
      this.dataSource = new MatTableDataSource<ITodoListModel>(tasks);
      // default sort: the completed todo are placed in the bottom of the list
      this.setDefaultSort();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.getTasksSubscription) {
      this.getTasksSubscription.unsubscribe();
    }
    if (this.isLoadingSubscription) {
      this.isLoadingSubscription.unsubscribe();
    }
  }

  applyFilter(filterValue: string) {
    const tableFilters = [];
    tableFilters.push({
      id: 'status',
      value: filterValue
    });

    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public updateData(task: ITodoListModel) {
    // we are working on filtered data and not on datasource data so
    // we  have to modify manually the datasource
    // If a filter has been applied
    if (this.dataSource.filter.length > 0) {
      const itemToModify = this.dataSource.data.find((item: ITodoListModel) => {
        return item.id === task.id;
      });
      itemToModify.status = task.status;

      const index = this.dataSource.filteredData.findIndex((item: ITodoListModel) => {
        return item.id === task.id;
      });
      if (this.dataSource.filteredData.length > 1) {
        this.dataSource.filteredData = this.dataSource.filteredData.slice(index, 1);
      } else {
        this.dataSource.filteredData = this.dataSource.filteredData.slice(0, 0);
      }
      // apply again the filter, it will refresh the table
      this.dataSource.filter = this.dataSource.filter;
    }
    this.sortData(this.sort);
  }

  public resetFilter() {
    const isFilterAlreadyEmpty = this.dataSource.filter === '' ? true : false;
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (!isFilterAlreadyEmpty) {
      this.sortData(this.sort);
    }
  }

  public filterAlreadyDoneTask() {
    this.dataSource.filterPredicate = (data: ITodoListModel, filter: string) => data.status;
    this.applyFilter('true');
  }

  public filterNotDoneYetTask() {
    this.dataSource.filterPredicate = (data: ITodoListModel, filter: string) => !data.status;
    this.applyFilter('false');
  }

  public deleteRowDataTable(itemId: number) {
    this.store.dispatch(new TodoListModule.RemoveTask(itemId));
    // We have to navigate to previous page if we are going to delete the last row of the current page
    if (this.dataSource.paginator.hasPreviousPage() && this.dataSource.paginator.pageSize === 1) {
      this.dataSource.paginator.previousPage();
    }
  }

  private compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortData(sort: Sort) {
    let dataToManage: ITodoListModel[];
    if (this.dataSource.filter.length > 0) {
      dataToManage = this.dataSource.filteredData;
    } else {
      dataToManage = this.dataSource.data;
    }
    if (!sort.active || sort.direction === '') {
      if (dataToManage && dataToManage.length > 1) {
        this.setDefaultSort();
      }
    } else {
      dataToManage.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'status':
            return this.compare(a.status, b.status, isAsc);
          case 'title':
            return this.compare(a.title, b.title, isAsc);
          case 'criticity':
            return this.compare(a.criticity, b.criticity, isAsc);
          default:
            return 0;
        }
      });
    }
  }

  private setDefaultSort() {
    // default sort: the completed todo are placed in the bottom of the list
    this.dataSource.data = this.dataSource.data.sort(
      (a: ITodoListModel, b: ITodoListModel) => {
        return (a.status < b.status ? -1 : 1);
      }
    );
  }

  public goToDetailView(taskId: number) {
    this.router.navigate(['/dashboard/detail/', '' + taskId]);
  }

  public goToCreateTaskView() {
    this.router.navigate(['/dashboard/create']);
  }
}
