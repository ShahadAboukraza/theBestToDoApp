import {Component, inject, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {TaskService} from '../../services/task-service';
import {DatePipe, NgForOf} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {AddTask} from '../../components/add-task/add-task';
import {MatDialog} from '@angular/material/dialog';
import {MatOption} from '@angular/material/core';
import {MatFormField, MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {ConfirmationDialog} from '../../components/confirmation-dialog/confirmation-dialog';
import {Subject, takeUntil} from 'rxjs';
import {TaskModel} from '../../models/task';

@Component({
  selector: 'app-task-list',
  styleUrl: 'task-list.scss',
  templateUrl: 'task-list.html',
  imports: [MatTableModule, DatePipe, MatIconButton, MatSelect, MatOption, MatFormField, FormsModule, NgForOf],
})

export class TaskList implements OnInit {
  displayedColumns: string[] = ['title', 'stage', 'startDate', 'endDate', 'priority', 'actions']
  dataSource: TaskModel[] = [];
  stages = ['To do', 'In progress', 'Review', 'Done'];
  private dialog = inject(MatDialog);
  private taskService = inject(TaskService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.taskService.tasks
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => this.dataSource = tasks);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTask, {
      width: '600px',
      data: {
        stage: 'To do', // default value passed to dialog,
        isEdit: true // to enable edit mode since we are using the same component for view,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.save(result); // Only save if there's valid result
      }
    });
  }

  save(data: TaskModel): void {
    this.taskService.addTask(data).then();
  }

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
      data: {...task} // pass current task data
    });

    dialogRef.afterClosed().subscribe((updatedTask: TaskModel) => {
      if (updatedTask) {
        this.taskService.updateTask(updatedTask).then();
      }
    });
  }

  updateStage($event: string, task: TaskModel): void {
    //  Update the task stage
    task.stage = $event;
    this.taskService.updateTask(task).then();
  }

  viewTask(task: TaskModel): void {
    this.dialog.open(AddTask, {
      data: task
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
