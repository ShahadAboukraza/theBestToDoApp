import {Component, inject, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {TaskService} from '../services/task-service';
import {TaskModel} from '../todo-kanban/todo-kanban';
import {DatePipe, NgForOf} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {AddTask} from '../components/add-task/add-task';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatOption} from '@angular/material/core';
import {MatFormField, MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {ConfirmationDialog} from '../components/confirmation-dialog/confirmation-dialog';
import {ReviewTask} from '../review-task/review-task';

@Component({
  selector: 'app-todo-list',
  styleUrl: 'todo-list.scss',
  templateUrl: 'todo-list.html',
  imports: [MatTableModule, DatePipe, MatIconButton, MatIcon, MatSelect, MatOption, MatFormField, FormsModule, NgForOf],
})


export class TodoList implements OnInit {

  displayedColumns: string[] = ['title', 'stage', 'startDate', 'endDate', 'priority', 'actions']
  dataSource: TaskModel[] = [];
  stages = ['To do', 'In progress', 'Review', 'Done'];
  private dialog = inject(MatDialog);
  private taskService = inject(TaskService);

  ngOnInit(): void {
    this.loadData();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTask, {
      width: '600px',
      data: {
        stage: 'To do' // default value passed to dialog
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.save(result); // Only save if there's valid result
      }
    });
  }

  save(data: TaskModel): void {
    this.taskService.save(data);
    this.loadData();
  }

  deleteTask(taskId: number): void {
    const ref = this.dialog.open(ConfirmationDialog, {
      width: '400px',
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.taskService.deleteTask(taskId);
      this.loadData();
    });
  }

  loadData() {
    this.dataSource = this.taskService.getTasks();
  }

  editTask(task: TaskModel): void {
    const dialogRef = this.dialog.open(AddTask, {
      data: {...task} // pass current task data
    });

    dialogRef.afterClosed().subscribe((updatedTask: TaskModel) => {
      if (updatedTask) {
        this.taskService.updateSpecificTask(updatedTask);
      }
    });
  }

  updateStage($event: string, task: TaskModel): void {
    console.log($event);
    console.log(task);
    //Update the task stage
    // task.stage = $event;
    // this.taskService.updateSpecificTask(task);
    // this.loadData();
  }

  viewTask(task: TaskModel): void {
    console.log(task);
    this.dialog.open(ReviewTask, {
      data: {task: task}
    })

  }

}
