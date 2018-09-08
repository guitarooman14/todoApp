import {AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, Sort} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {ITodoListModel} from '../../model/i-todolist-model';
import {AbstractTodoService} from '../../services/get-data/abstract-todo.service';
import {Subscription} from 'rxjs';
import {SharedStorage} from 'ngx-store';
import {Router} from '@angular/router';

@Component({
  selector: 'app-todo-list-overview',
  templateUrl: './todo-list-overview.component.html',
  styleUrls: ['./todo-list-overview.component.scss']
})
export class TodoListOverviewComponent implements AfterViewChecked, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @SharedStorage('toDoListItems') toDoListItems: Array<ITodoListModel>;

  private dataLoaded = false;
  private getTasksSubscription: Subscription;
  public displayedColumns: string[] = ['status', 'title', 'criticity', 'action'];
  public isLoading = true;
  public dataSource: MatTableDataSource<ITodoListModel>;
  public selection = new SelectionModel<ITodoListModel>(true, []);

  constructor(private todoService: AbstractTodoService,
              private cdr: ChangeDetectorRef,
              private router: Router) {
  }

  ngAfterViewChecked(): void {
    if (this.toDoListItems && !this.dataLoaded) {
      this.dataSource = new MatTableDataSource<ITodoListModel>(this.toDoListItems);
      // default sort: the completed tasks are placed in the bottom of the list
      this.setDefaultSort();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
      // In order to avoid the ExpressionChangedAfterItHasBeenCheckedError
      // we have to defined when the component should detect changes
      this.cdr.detectChanges();
      this.dataLoaded = true;
    }
  }

  ngOnDestroy(): void {
    if (this.getTasksSubscription) {
      this.getTasksSubscription.unsubscribe();
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
      /*const id = this.dataSource.data.findIndex((item: ITodoListModel) => {
        return item.id === task.id;
      });*/
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
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.sortData(this.sort);
  }

  public filterAlreadyDoneTask() {
    this.dataSource.filterPredicate = (data: ITodoListModel, filter: string) => data.status;
    this.applyFilter('true');
  }

  public filterNotDoneYetTask() {
    this.dataSource.filterPredicate = (data: ITodoListModel, filter: string) => !data.status;
    this.applyFilter('false');
  }

  public deleteRowDataTable(itemId: number, paginator: MatPaginator) {
    const itemIndex = this.dataSource.data.findIndex(
      (obj: ITodoListModel) => obj.id === itemId);
    this.toDoListItems.splice(itemIndex, 1);
    this.dataSource.data = this.toDoListItems;
    // this.dataSource.data.splice(itemIndex, 1);
    // Allow to refresh the view after remove the data in datasource
    this.dataSource.paginator = paginator;
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
      dataToManage = dataToManage.sort((a, b) => {
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
      if (this.dataSource.filter.length > 0) {
        this.dataSource.filteredData = dataToManage;
      } else {
        this.dataSource.data = dataToManage;
      }
    }
  }

  private setDefaultSort() {
    // default sort: the completed tasks are placed in the bottom of the list
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
