import { Component, inject }       from '@angular/core';
import { ActivatedRoute }          from '@angular/router';
import { CommonModule }            from '@angular/common';
import { FormsModule }             from '@angular/forms';
import { MatCardModule }           from '@angular/material/card';
import { MatButtonModule }         from '@angular/material/button';
import { MatCheckboxModule }       from '@angular/material/checkbox';
import { MatIconModule }           from '@angular/material/icon';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-todo',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo.html',
  styleUrls: ['./todo.scss']
})
export class Todo {
  name = '';
  newText     = '';
  newPriority = 'red';
  newDueDate  = '';

  tasks: Array<{
    text: string;
    priority: string;
    dueDate: string;
    completed: boolean;
  }> = [];

  private route = inject(ActivatedRoute);

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    this.name = params['name'] || 'Guest';
  }

  addTask() {
    if (!this.newText) return;
    this.tasks.push({
      text: this.newText,
      priority: this.newPriority,
      dueDate: this.newDueDate,
      completed: false
    });
    this.newText = '';
    this.newDueDate = '';
  }

  toggleCompleted(i: number) {
    this.tasks[i].completed = !this.tasks[i].completed;
  }

  deleteTask(i: number) {
    this.tasks.splice(i, 1);
  }
}
