import {MatDialog} from '@angular/material/dialog';
import {AddTask} from '../add-task/add-task';
import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {TaskModel} from '../../todo-kanban/todo-kanban';
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
    MatIcon,
    MatIconButton,
    NgClass,
    FormsModule
  ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCard {
  @Input() task!: TaskModel;
  @Output() taskChange = new EventEmitter<void>();
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  deleteTask(taskId: number): void {
    const ref = this.dialog.open(ConfirmationDialog, {
      width: '400px',
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.taskService.deleteTask(taskId);
      this.taskChange.emit();
    });
  }

  editTask(task: TaskModel): void {
    const dialogRef = this.dialog.open(AddTask, {
      data: {...task, isEdit: true}
    });

    dialogRef.afterClosed().subscribe((updatedTask: TaskModel) => {
      console.log(updatedTask);
      if (updatedTask) {
        this.taskService.updateSpecificTask(updatedTask);
        this.taskChange.emit(); // To reload the parent task list
      }
    });
  }

  viewTask(task: TaskModel): void {
    console.log(task);
    this.dialog.open(AddTask, {
      data: task
    })
  }
}

