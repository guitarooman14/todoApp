import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ITodoListModel} from '@Models/i-todolist-model.ts';
import {ActivatedRoute, Router} from '@angular/router';
import {AppState} from '@StoreConfig';
import {select, Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {TodoListModule} from '@Actions/todo-list.action';
import {selectTodoListData$, selectTodosLoading$} from '@Selectors/todo-list.selector';
import {visibilityChangedTransition} from '../../render/animations/animations';
import {filterEmpty} from '../../shared/utils/custom-operator';

@Component({
  selector: 'app-create-or-modify-tasks',
  templateUrl: './create-or-modify-tasks-view.component.html',
  styleUrls: ['./create-or-modify-tasks-view.component.scss'],
  animations: [visibilityChangedTransition]
})
export class CreateOrModifyTasksComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formGroupDirective;
  public title = new FormControl('', [Validators.required]);
  public description = new FormControl('');
  public criticity = new FormControl('', Validators.required);
  public createOrModifybuttonLabel: string;
  public createModifyForm: FormGroup;
  public tasksLoading: Observable<boolean>;
  public toDoListItemsWithRedux: Observable<ITodoListModel[]>;
  public isLoading: boolean;
  private getTasksSubscription: Subscription;
  private isLoadingSubscription: Subscription;
  private toDoListItems: ITodoListModel[];
  private viewMode: ViewType;
  private titleRequiredErrorLabel: string;
  private criticityRequiredErrorLabel: string;

  constructor(private translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>) {
    this.tasksLoading = store.pipe(select(selectTodosLoading$));
    this.toDoListItemsWithRedux = store.pipe(filterEmpty(), select(selectTodoListData$));
  }

  public ngOnInit() {
    const type: ViewType = this.route.snapshot.paramMap.has('id') ? ViewType.MODIFY : ViewType.CREATE;
    this.createModifyForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      criticity: this.criticity
    });
    this.translate.onLangChange.subscribe(() => {
      this.translateLabels(type);
    });

    this.translate.onDefaultLangChange.subscribe(() => {
      this.translateLabels(type);
    });

    this.isLoadingSubscription = this.tasksLoading.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });

    this.getTasksSubscription = this.toDoListItemsWithRedux.subscribe((tasks: ITodoListModel[]) => {
      this.toDoListItems = tasks;
      if (this.route.snapshot.paramMap.has('id')) {
        this.viewMode = ViewType.MODIFY;
        const id = this.route.snapshot.paramMap.get('id');
        const task: ITodoListModel = this.toDoListItems.find((item: ITodoListModel) => {
          return item.id === +id;
        });
        if (task) {
          this.translateLabels(ViewType.MODIFY);
          this.title.setValue(task.title);
          this.description.setValue(task.description);
          this.criticity.setValue('' + task.criticity);
        } else {
          this.router.navigate(['/dashboard/404']);
        }
      } else {
        this.viewMode = ViewType.CREATE;
        this.translateLabels(ViewType.CREATE);
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.getTasksSubscription) {
      this.getTasksSubscription.unsubscribe();
    }
    if (this.isLoadingSubscription) {
      this.isLoadingSubscription.unsubscribe();
    }
  }

  public getErrorMessage(controlName: string): string {
    let resultat = '';
    if (controlName && controlName === 'title') {
      resultat = this.title.hasError('required') ? this.titleRequiredErrorLabel : '';
    } else if (controlName && controlName === 'criticity') {
      resultat = this.criticity.hasError('required') ? this.criticityRequiredErrorLabel : '';
    }
    return resultat;
  }

  public translateLabels(viewType: ViewType) {
    if (viewType === ViewType.CREATE) {
      this.createOrModifybuttonLabel = this.translate.instant('AddNewTaskLabel');
    } else {
      this.createOrModifybuttonLabel = this.translate.instant('ModifyTaskLabel');
    }
    this.titleRequiredErrorLabel = this.translate.instant('TitleRequiredErrorLabel');
    this.criticityRequiredErrorLabel = this.translate.instant('CriticityRequiredErrorLabel');
  }

  public submit() {
    // stop here if form is invalid
    if (this.createModifyForm.invalid) {
      return;
    }

    if (this.viewMode === ViewType.CREATE) {
      const newTask: ITodoListModel = {
        id: getNextIdNotUsed(this.toDoListItems.map((item: ITodoListModel) => item.id)),
        status: false,
        title: this.title.value,
        description: this.description.value,
        criticity: +this.criticity.value
      };
      this.store.dispatch(new TodoListModule.LoadAddTask(newTask));
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      const selectedTask: ITodoListModel = this.toDoListItems.find((item: ITodoListModel) => {
        return item.id === +id;
      });
      const payload = Object.assign(selectedTask, this.createModifyForm.value);
      payload.criticity = +payload.criticity;
      this.store.dispatch(new TodoListModule.LoadUpdateTask(payload));
    }
    // We have to use the formGroupDirective in order to
    // remove all controls data and invalid status
    if (this.formGroupDirective) {
      this.formGroupDirective.resetForm();
    }
    this.router.navigate(['/dashboard']);
  }
}

function getNextIdNotUsed(existingIds: number[]): number {
  return Math.max.apply(null, existingIds) + 1;
}

enum ViewType {
  CREATE, MODIFY
}
