import {Routes} from '@angular/router';
import {TodoListOverviewComponent} from '../components/todo-list-overview/todo-list-overview.component';
import {MainViewComponent} from '../components/main-view/main-view.component';
import {CreateOrModifyTasksComponent} from '../components/create-or-modify-tasks/create-or-modify-tasks-view.component';
import {NotFoundTaskComponent} from '../components/not-found-task/not-found-task.component';

export const ROUTES: Routes = [
  {path: '', redirectTo: '/dashboard/overview', pathMatch: 'full'},
  {
    path: 'dashboard', component: MainViewComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'overview'},
      {path: 'overview', component: TodoListOverviewComponent},
      {path: 'create', component: CreateOrModifyTasksComponent},
      {path: 'detail/:id', component: CreateOrModifyTasksComponent},
      {path: '404', component: NotFoundTaskComponent}
    ]
  },
  {path: '**', redirectTo: '/dashboard/overview'}
];
