import {Routes} from '@angular/router';
import {TaskKanban} from './task-kanban/task-kanban';
import {TaskList} from './task-list/task-list';
import {TodoCalendar} from '../todo-calendar/todo-calendar';
import {TaskTimeline} from './task-timeline/task-timeline';

export const routes: Routes = [
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
];
