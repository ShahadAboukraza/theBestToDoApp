import { Routes } from '@angular/router';
import {Todo} from './todo/todo';
import {TodoList} from './todo-list/todo-list';
import {TodoTimeline} from './todo-timeline/todo-timeline';
import {TodoCalendar} from './todo-calendar/todo-calendar';
import {TodoKanban} from './todo-kanban/todo-kanban';

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
