import {Routes} from '@angular/router';
import {NotFoundComponent} from '../components/not-found/not-found.component';
import {MainViewComponent} from '../components/main-view/main-view.component';

export const ROUTES: Routes = [
  {path: '', component: MainViewComponent},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];
