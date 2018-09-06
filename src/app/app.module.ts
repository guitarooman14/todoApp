import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './components/app-component/app.component';
import {MainViewComponent} from './components/main-view/main-view.component';
import {MatTabsModule} from '@angular/material/tabs';
import {RouterModule} from '@angular/router';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {ROUTES} from './routes/route.app';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader, TranslateCompiler, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TodoListOverviewComponent} from './components/todo-list-overview/todo-list-overview.component';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatIconModule, MatMenuModule, MatPaginatorIntl, MatPaginatorModule, MatSortModule,
  MatTableModule, MatToolbarModule
} from '@angular/material';
import {CriticityPipe} from './pipes/criticity/criticity.pipe';
import {MESSAGE_FORMAT_CONFIG, TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {AbstractTodoService} from './services/abstract-todo.service';
import {TodoServiceService} from './services/todo-service.service';
import {MockedTodoService} from './services/mocked-todo.service';
import {MatPaginatorIntlCro} from './business/mat-paginator-customized-label';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// we just have to change this constant when going to prod
const IS_PROD = true;

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    NotFoundComponent,
    TodoListOverviewComponent,
    CriticityPipe
  ],
  imports: [
    BrowserModule,
    MatTabsModule,
    RouterModule.forRoot(ROUTES, {enableTracing: true}),
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatMenuModule,
    MatSortModule,
    TranslateModule.forRoot({
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      },
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: MESSAGE_FORMAT_CONFIG, useValue: {locales: ['en', 'fr']}
    },
    {
      provide: AbstractTodoService,
      useClass: IS_PROD ? TodoServiceService : MockedTodoService
    },
    {
      provide: MatPaginatorIntl,
      useFactory: (translate) => {
        const service = new MatPaginatorIntlCro();
        service.injectTranslateService(translate);
        return service;
      },
      deps: [TranslateService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
