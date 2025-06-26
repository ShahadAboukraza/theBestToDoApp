// Import route-related modules and components
import {Routes} from '@angular/router';
import {Login} from './pages/login/login';
import {AuthGuard} from './guards/auth.guard';
import {PagesComponent} from './pages/pages.component';
import {TaskKanban} from './pages/task-kanban/task-kanban';
import {TaskList} from './pages/task-list/task-list';
import {TodoCalendar} from './todo-calendar/todo-calendar';
import {TaskTimeline} from './pages/task-timeline/task-timeline';

// Define app routes
export const routes: Routes = [
    // Public login route
    {path: 'login', component: Login},

    // Protected routes (requires authentication)
    {
        path: '',
        component: PagesComponent,     // Wrapper layout component
        canActivate: [AuthGuard],      // Guard to block access if not logged in
        children: [
            {path: '', redirectTo: 'tasks', pathMatch: 'full'}, // Default route

            // Kanban board view
            {path: 'tasks', component: TaskKanban},

            // List view of tasks
            {path: 'tasks/list', component: TaskList},

            // Calendar view of tasks
            {path: 'tasks/calendar', component: TodoCalendar},

            // Timeline view of tasks
            {path: 'tasks/timeline', component: TaskTimeline},
        ]
    }
];
