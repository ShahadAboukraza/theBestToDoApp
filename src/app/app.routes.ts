import { Routes } from '@angular/router';
import {TodoTimeline} from './todo-timeline/todo-timeline';
import {TodoCalendar} from './todo-calendar/todo-calendar';
import {TodoKanban} from './todo-kanban/todo-kanban';
import {TodoList} from './todo-list/todo-list';

export const routes: Routes = [
  {path: '', redirectTo: 'tasks', pathMatch: 'full'},
  {path: 'tasks', component: TodoKanban},
  {
    path: 'tasks/list',
    component: TodoList
  },
  {
    path: 'tasks/calendar',
    component: TodoCalendar
  },
  {
    path: 'tasks/timeline',
    component: TodoTimeline
  },
];
