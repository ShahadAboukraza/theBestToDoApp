import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Subject, takeUntil} from 'rxjs';
import {AddTask} from '../../components/add-task/add-task';
import {TaskService} from '../../services/task-service';
import {TaskCard} from '../../components/task-card/task-card';
import {KanbanTask, TaskModel} from '../../models/task';

@Component({
  standalone: true,
  selector: 'app-task-kanban',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
    TaskCard,
  ],
  templateUrl: './task-kanban.html',
  styleUrls: ['./task-kanban.scss']
})
export class TaskKanban implements OnInit, OnDestroy {
  kanbanTasks: KanbanTask = {todo: [], inProgress: [], review: [], done: []};
  private dialog = inject(MatDialog);
  private taskService = inject(TaskService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.taskService.tasks
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => this.groupTasks(tasks));
  }

  private groupTasks(tasks: TaskModel[]): void {
    const grouped: KanbanTask = {todo: [], inProgress: [], review: [], done: []};
    for (const t of tasks) {
      switch (t.stage) {
        case 'In progress':
          grouped.inProgress.push(t);
          break;
        case 'Review':
          grouped.review.push(t);
          break;
        case 'Done':
          grouped.done.push(t);
          break;
        default:
          grouped.todo.push(t);
          break;
      }
    }
    this.kanbanTasks = grouped;
  }

  openDialog(stage: string): void {
    const ref = this.dialog.open(AddTask, {
      width: '600px',
      data: {stage, isEdit: true}
    });
    ref.afterClosed().subscribe(task => {
      if (!task) return;
      this.taskService.addTask(task).then();
    });
  }

  drop(event: CdkDragDrop<TaskModel[]>, stage: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    const task = event.item.data as TaskModel;
    const updated = {...task, stage};
    this.taskService.updateTask(updated).then();
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).then();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
