import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app-component/app.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import {MatTabsModule} from '@angular/material/tabs';
import {RouterModule} from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import {ROUTES} from './routes/route.app';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    MatTabsModule,
    RouterModule.forRoot(ROUTES, {enableTracing: true}),
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
