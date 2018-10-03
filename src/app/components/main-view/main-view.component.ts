import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {TodoListModule} from '@Actions/todo-list.action';
import {AppState} from '@StoreConfig';
import {selectTodosLogs$} from '@Selectors/todo-list.selector';
import {tap} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainViewComponent implements OnInit, OnDestroy {
  public todoListErrors$: Observable<any>;
  private switchLanguageSubscription: Subscription;

  constructor(private translate: TranslateService,
              private store: Store<AppState>,
              private toastr: ToastrService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    translate.setDefaultLang('fr');
    iconRegistry.addSvgIcon('england', sanitizer.bypassSecurityTrustResourceUrl('assets/img/england.svg'));
    iconRegistry.addSvgIcon('france', sanitizer.bypassSecurityTrustResourceUrl('assets/img/france.svg'));
    iconRegistry.addSvgIcon('translation', sanitizer.bypassSecurityTrustResourceUrl('assets/img/google.svg'));
    iconRegistry.addSvgIcon('list', sanitizer.bypassSecurityTrustResourceUrl('assets/img/list.svg'));
    iconRegistry.addSvgIcon('removeAll', sanitizer.bypassSecurityTrustResourceUrl('assets/img/removeAll.svg'));
    iconRegistry.addSvgIcon('success', sanitizer.bypassSecurityTrustResourceUrl('assets/img/success.svg'));
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/img/add.svg'));
    iconRegistry.addSvgIcon('remove', sanitizer.bypassSecurityTrustResourceUrl('assets/img/remove.svg'));
    iconRegistry.addSvgIcon('more-details', sanitizer.bypassSecurityTrustResourceUrl('assets/img/more-details.svg'));
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {
    this.todoListErrors$ = this.store.pipe(
      select(selectTodosLogs$),
      tap((dialog: {type: string, messageLabel: string}) => {
        if (!dialog) {
          return;
        }
        const messageToDisplay: string = this.translate.instant(dialog.messageLabel);
        if (dialog.type === 'ERROR') {
          this.toastr.error(messageToDisplay);
        } else {
          this.toastr.success(messageToDisplay);
        }
        console.log(dialog);
      })
    );
    this.todoListErrors$.subscribe();
    this.store.dispatch(new TodoListModule.LoadInitTasks());
  }

  ngOnDestroy(): void {
    if (this.switchLanguageSubscription) {
      this.switchLanguageSubscription.unsubscribe();
    }
  }
}
