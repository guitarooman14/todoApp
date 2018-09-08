import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ITodoListModel} from '../../model/i-todolist-model';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedStorage} from 'ngx-store';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-create-or-modify-tasks',
  templateUrl: './create-or-modify-tasks-view.component.html',
  styleUrls: ['./create-or-modify-tasks-view.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('true', style({opacity: 1})),
      state('false', style({opacity: 0})),
      transition('1 => 0', animate('300ms')),
      transition('0 => 1', animate('900ms'))
    ])]
})
export class CreateOrModifyTasksComponent implements AfterViewChecked, OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective;
  @SharedStorage('toDoListItems') toDoListItems: Array<ITodoListModel>;
  public title = new FormControl('', [Validators.required]);
  public description = new FormControl('');
  public criticity = new FormControl('', Validators.required);
  public createOrModifybuttonLabel: string;
  public dataLoaded = false;
  public createModifyForm: FormGroup;
  private titleRequiredErrorLabel: string;
  private critictyRequiredErrorLabel: string;
  private viewMode: ViewType;

  constructor(private translate: TranslateService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {
  }


  ngAfterViewChecked(): void {
    if (this.toDoListItems && !this.dataLoaded) {
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
      this.dataLoaded = true;
      this.cdr.detectChanges();
    }
  }

  private getNextIdNotUsed(existingIds: number[]): number {
    return Math.max.apply(null, existingIds) + 1;
  }

  ngOnInit() {
    const type: ViewType = this.route.snapshot.paramMap.has('id') ? ViewType.MODIFY : ViewType.CREATE;
    this.createModifyForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      criticty: this.criticity
    });
    this.translate.onLangChange.subscribe(() => {
      this.translateLabels(type);
    });

    this.translate.onDefaultLangChange.subscribe(() => {
      this.translateLabels(type);
    });
  }

  getErrorMessage(controlName: string): string {
    let resultat = '';
    if (controlName && controlName === 'title') {
      resultat = this.title.hasError('required') ? this.titleRequiredErrorLabel : '';
    } else if (controlName && controlName === 'criticity') {
      resultat = this.criticity.hasError('required') ? this.critictyRequiredErrorLabel : '';
    }
    return resultat;
  }

  translateLabels(viewType: ViewType) {
    if (viewType === ViewType.CREATE) {
      this.createOrModifybuttonLabel = this.translate.instant('AddNewTaskLabel');
    } else {
      this.createOrModifybuttonLabel = this.translate.instant('ModifyTaskLabel');
    }
    this.titleRequiredErrorLabel = this.translate.instant('TitleRequiredErrorLabel');
    this.critictyRequiredErrorLabel = this.translate.instant('CriticityRequiredErrorLabel');
  }

  public submit() {
    // stop here if form is invalid
    if (this.createModifyForm.invalid) {
      return;
    }

    if (this.viewMode === ViewType.CREATE) {
      const newTask: ITodoListModel = {
        id: this.getNextIdNotUsed(this.toDoListItems.map((item: ITodoListModel) => item.id)),
        status: false,
        title: this.title.value,
        description: this.description.value,
        criticity: +this.criticity.value
      };
      this.toDoListItems.push(newTask);
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      const task: ITodoListModel = this.toDoListItems.find((item: ITodoListModel) => {
        return item.id === +id;
      });
      task.criticity = +this.criticity.value;
      task.description = this.description.value;
      task.title = this.title.value;
    }
    // this.sharedService.addNewTask(newTask);
    // We have to use the formGroupDirective in order to
    // remove all controls data and invalid status
    if (this.formGroupDirective) {
      this.formGroupDirective.resetForm();
    }
    this.router.navigate(['/dashboard']);
  }
}

enum ViewType {
  CREATE, MODIFY
}
