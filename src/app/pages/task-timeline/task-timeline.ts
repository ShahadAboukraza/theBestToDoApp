import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {TaskService} from '../../services/task-service';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {ReviewTask} from '../../components/review-task/review-task';
import {MatDialog} from '@angular/material/dialog';
import {TaskModel} from '../../models/task';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-task-timeline',
  standalone: true,
  templateUrl: './task-timeline.html',
  styleUrls: ['./task-timeline.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    DatePipe,
    MatIconButton
  ]
})
export class TaskTimeline implements OnInit {
  tasks: TaskModel[] = [];
  private destroy$ = new Subject<void>();
  intervalHandles: { [key: string]: any } = {};
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.taskService.tasks
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => this.tasks = tasks);
  }

  toggleTimer(task: TaskModel): void {
    const taskId = task.id;

    if (this.intervalHandles[taskId]) {
      clearInterval(this.intervalHandles[taskId]);
      delete this.intervalHandles[taskId];
      this.taskService.updateTask(task).then(); // Save on pause
    } else {
      if (!task.elapsed) task.elapsed = 0;
      this.intervalHandles[taskId] = setInterval(() => {
        task.elapsed!++;
        this.taskService.updateTask(task).then(); // update so it can be reloaded in timeline
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
    this.taskService.updateTask(task).then();
  }

  resetTimer(task: TaskModel): void {
    task.elapsed = 0;
    this.taskService.updateTask(task).then();
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
