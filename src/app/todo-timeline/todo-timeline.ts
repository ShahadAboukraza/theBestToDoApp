import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {TaskService} from '../services/task-service';
import {TaskModel} from '../todo-kanban/todo-kanban';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {ReviewTask} from '../review-task/review-task';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-todo-timeline',
  standalone: true,
  templateUrl: './todo-timeline.html',
  styleUrls: ['./todo-timeline.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    DatePipe,
    MatIconButton
  ]
})
export class TodoTimeline implements OnInit {
  tasks: TaskModel[] = [];
  timers: { [key: number]: number } = {};
  elapsedSeconds: { [key: number]: number } = {};
  intervalHandles: { [key: number]: any } = {};
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
  }

  toggleTimer(task: TaskModel): void {
    const taskId = task.id;

    if (this.intervalHandles[taskId]) {
      clearInterval(this.intervalHandles[taskId]);
      delete this.intervalHandles[taskId];
      this.taskService.updateSpecificTask(task); // Save on pause
    } else {
      if (!task.elapsed) task.elapsed = 0;
      this.intervalHandles[taskId] = setInterval(() => {
        task.elapsed!++;
        this.taskService.updateSpecificTask(task); // update so it can be reloaded in timeline
      }, 1000);
    }
  }

  formatTime(seconds: number = 0): string {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  markAsDone(task: TaskModel): void {
    task.stage = 'Done';
    this.taskService.updateSpecificTask(task);
  }

  resetTimer(task: TaskModel): void {
    task.elapsed = 0;
    this.taskService.updateSpecificTask(task);
  }

  timelineHeight() {
    return (this.tasks.length - 1) * 204 + 'px';
  }

  viewTask(task: TaskModel): void {
    console.log(task);
    this.dialog.open(ReviewTask, {
      data: {task: task}
    })

  }

}
