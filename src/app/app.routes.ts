import {Routes} from '@angular/router';
import {Login} from './pages/login/login';
import {AuthGuard} from './guards/auth.guard';
import {PagesComponent} from './pages/pages.component';
import {TaskKanban} from './pages/task-kanban/task-kanban';
import {TaskList} from './pages/task-list/task-list';
import {TodoCalendar} from './todo-calendar/todo-calendar';
import {TaskTimeline} from './pages/task-timeline/task-timeline';

export const routes: Routes = [
  {path: 'login', component: Login},
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'tasks', pathMatch: 'full'},
      {path: 'tasks', component: TaskKanban},
      {
        path: 'tasks/list',
        component: TaskList
      },
      {
        path: 'tasks/calendar',
        component: TodoCalendar
      },
      {
        path: 'tasks/timeline',
        component: TaskTimeline
      },
    ]
  },
];
