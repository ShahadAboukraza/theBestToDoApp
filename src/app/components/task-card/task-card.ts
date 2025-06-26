import {MatDialog} from '@angular/material/dialog';
import {AddTask} from '../add-task/add-task';
import {Component, inject, Input} from '@angular/core';
import {TaskService} from '../../services/task-service';
import {DatePipe, NgClass} from '@angular/common';
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {ConfirmationDialog} from '../confirmation-dialog/confirmation-dialog';
import {TaskModel} from '../../models/task';

@Component({
  selector: 'app-task-card',
  imports: [
    DatePipe,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatIconButton,
    NgClass,
    FormsModule
  ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCard {
  @Input() task!: TaskModel;
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  deleteTask(taskId: string): void {
    const ref = this.dialog.open(ConfirmationDialog, {
      width: '400px',
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.taskService.deleteTask(taskId).then();
    });
  }

  editTask(task: TaskModel): void {
    const dialogRef = this.dialog.open(AddTask, {
      data: {...task, isEdit: true}
    });

    dialogRef.afterClosed().subscribe((updatedTask: TaskModel) => {
      if (updatedTask) {
        this.taskService.updateTask(updatedTask).then();
      }
    });
  }

  viewTask(task: TaskModel): void {
    this.dialog.open(AddTask, {
      data: task
    })
  }
}

