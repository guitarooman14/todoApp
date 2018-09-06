import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatIconRegistry, MatPaginator, MatSort, MatSortable, MatTableDataSource, Sort} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {SelectionModel} from '@angular/cdk/collections';
import {ITodoListModel} from '../../model/i-todolist-model';
import {AbstractTodoService} from '../../services/abstract-todo.service';
import {Subscription} from 'rxjs';
import {ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-todo-list-overview',
  templateUrl: './todo-list-overview.component.html',
  styleUrls: ['./todo-list-overview.component.scss']
})
export class TodoListOverviewComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private getTasksSubscription: Subscription;
  public displayedColumns: string[] = ['status', 'title', 'criticity', 'action'];
  public isLoading = true;
  public dataSource: MatTableDataSource<ITodoListModel>;
  public selection = new SelectionModel<ITodoListModel>(true, []);

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private todoService: AbstractTodoService,
              private cdr: ChangeDetectorRef) {
    iconRegistry.addSvgIcon('list', sanitizer.bypassSecurityTrustResourceUrl('assets/img/list.svg'));
    iconRegistry.addSvgIcon('removeAll', sanitizer.bypassSecurityTrustResourceUrl('assets/img/removeAll.svg'));
    iconRegistry.addSvgIcon('success', sanitizer.bypassSecurityTrustResourceUrl('assets/img/success.svg'));
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/img/add.svg'));
    iconRegistry.addSvgIcon('remove', sanitizer.bypassSecurityTrustResourceUrl('assets/img/remove.svg'));
    iconRegistry.addSvgIcon('more-details', sanitizer.bypassSecurityTrustResourceUrl('assets/img/more-details.svg'));
  }

  ngAfterViewInit(): void {
    this.getTasksSubscription = this.todoService.listTask().subscribe((tasks: ITodoListModel[]) => {
      this.dataSource = new MatTableDataSource<ITodoListModel>(tasks);
      // default sort: the completed tasks are placed in the bottom of the list
      this.setDefaultSort();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
      // In order to avoid the ExpressionChangedAfterItHasBeenCheckedError
      // we have to defined when the component should detect changes
      this.cdr.detectChanges();
    });
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

  public resetFilter() {
    this.dataSource.filterPredicate = (data: ITodoListModel, filter: string) => true;
    this.applyFilter('true');
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
    this.dataSource.data.splice(itemIndex, 1);
    // Allow to refresh the view after remove the data in datasource
    this.dataSource.paginator = paginator;
  }

  public updateStatus(rowId: number) {
    const itemIndex = this.dataSource.data.findIndex(
      (obj: ITodoListModel) => obj.id === rowId);
    this.dataSource.data[itemIndex].status = !this.dataSource.data[itemIndex].status;
    this.sortData(this.sort);
  }

  private sortData(sort: Sort) {
    // If no sort has been selected, set the default sort.
    if (!sort.active || sort.direction === '') {
      this.setDefaultSort();
      return;
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
}
