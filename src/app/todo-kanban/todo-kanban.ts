import {Component, inject, OnInit, TrackByFunction} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {AddTask} from '../components/add-task/add-task';
import {TaskService} from '../services/task-service';
import {TaskCard} from '../components/task-card/task-card';

export interface KanbanTask {
  todo: TaskModel[];
  inProgress: TaskModel[];
  review: TaskModel[];
  done: TaskModel[];
}

export interface TaskModel {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  stage: string;
  members: string;
  priority: string;
  elapsed?: number;
}

export interface KanbanColumn {
  title: string;
  tasks: TaskModel[];
}

@Component({
  standalone: true,
  selector: 'app-todo-kanban',
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
  templateUrl: './todo-kanban.html',
  styleUrls: ['./todo-kanban.scss']
})
export class TodoKanban implements OnInit {
  kanbanTasks: KanbanTask = {
    todo: [],
    inProgress: [],
    review: [],
    done: []
  };
  private dialog = inject(MatDialog);
  private taskService = inject(TaskService);

  ngOnInit(): void {
    this.groupTasks();
  }

  groupTasks(): void {
    // Get saved tasks list from service
    //For kanban view, sort them into groups by stage

    const tasks = this.taskService.getTasks();

    //Empty kanban list
    const newGroup: KanbanTask = {
      todo: [],
      inProgress: [],
      review: [],
      done: []
    };

    tasks.forEach(task => {
      // Check the task stage
      switch (task.stage) {
        case 'In progress':
          newGroup.inProgress.push(task);
          break;

        case 'Review':
          newGroup.review.push(task);
          break;

        case 'Done':
          newGroup.done.push(task);
          break;

        default:
          newGroup.todo.push(task);
          break;
      }

      this.kanbanTasks = newGroup;
    })
  }

  openDialog(stage: string): void {
    const ref = this.dialog.open(AddTask, {
      width: '600px',
      data: {stage: stage, isEdit: true}
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.save(result);
      this.groupTasks();
    });
  }

  drop(event: CdkDragDrop<TaskModel[]>, stage: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(event.container)
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    const allTasks: TaskModel[] = [
      ...this.kanbanTasks.todo,
      ...this.kanbanTasks.inProgress,
      ...this.kanbanTasks.review,
      ...this.kanbanTasks.done
    ];
    const draggedTask = event.item.data;
    const index = allTasks.findIndex(task => task.id === draggedTask.id);
    allTasks[index] = {...draggedTask, stage: stage};
    this.taskService.updateInStorage(allTasks);
    this.groupTasks();
  }


  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId);
    this.groupTasks();
  }

  save(data: TaskModel): void {
    this.taskService.save(data);
    this.groupTasks();
  }

  reload(): void {
    this.groupTasks();
  }

  trackByColumn: TrackByFunction<TaskModel> = (index, c) => c.title;
  trackByTask: TrackByFunction<TaskModel> = (index, t) => t.title;
}
