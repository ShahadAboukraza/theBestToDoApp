import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatToolbar} from '@angular/material/toolbar';
import {TaskService} from '../services/task-service';
import {AuthService} from '../services/auth-service';
import {User} from '@angular/fire/auth';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButton,
    MatMenu,
    MatToolbar,
    RouterLink,
    RouterLinkActive,
    MatMenuTrigger,
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent {
  currentUser: User | null = null;

  constructor(private taskService: TaskService, private authService: AuthService) {
    this.taskService.getTasks();
    this.currentUser = authService.currentUser;
  }

  logout() {
    this.authService.logout();
  }
}
