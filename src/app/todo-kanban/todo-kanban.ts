import { Component, OnInit, inject, TrackByFunction } from '@angular/core';
import { CommonModule }                                from '@angular/common';
import { FormsModule }                                 from '@angular/forms';
import { MatDialog, MatDialogModule }                  from '@angular/material/dialog';
import { MatButtonModule }                             from '@angular/material/button';
import { MatIconModule }                               from '@angular/material/icon';
import { MatCardModule }                               from '@angular/material/card';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

import { AddTask, DialogData }                         from '../components/add-task/add-task';

export interface KanbanTask {
  title:       string;
  description: string;
  startDate:   string;
  endDate:     string;
  stage:       string;
  members:     string;
}

export interface KanbanColumn {
  title: string;
  tasks: KanbanTask[];
}

@Component({
  standalone: true,
  selector:   'app-todo-kanban',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
    AddTask
  ],
  templateUrl: './todo-kanban.html',
  styleUrls:   ['./todo-kanban.scss']
})
export class TodoKanban implements OnInit {
  private dialog = inject(MatDialog);

  columns: KanbanColumn[] = [
    { title: 'To Do',       tasks: [] },
    { title: 'In Progress', tasks: [] },
    { title: 'Review',      tasks: [] },
    { title: 'Done',        tasks: [] }
  ];

  ngOnInit(): void {
    const saved = localStorage.getItem('kanbanColumns');
    if (saved) {
      this.columns = JSON.parse(saved) as KanbanColumn[];
    }
  }

  openDialog(colIdx: number): void {
    const ref = this.dialog.open<AddTask, DialogData, Partial<KanbanTask>>(AddTask, {
      width: '400px',
      data: { stage: this.columns[colIdx].title }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.columns[colIdx].tasks.push({
        title:       result.title!,
        description: result.description!,
        startDate:   result.startDate!,
        endDate:     result.endDate!,
        stage:       result.stage!,
        members:     '0'
      });
      this.save();
    });
  }

  drop(event: CdkDragDrop<KanbanTask[]>, toColIdx: number) {
    const from = event.previousContainer.data;
    const to   = event.container.data;
    const toCol = this.columns[toColIdx];
    if (event.previousContainer === event.container) {
      moveItemInArray(to, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(from, to, event.previousIndex, event.currentIndex);
      to[event.currentIndex].stage = toCol.title;
    }
    this.save();
  }


  deleteTask(colIdx: number, taskIdx: number): void {
    this.columns[colIdx].tasks.splice(taskIdx, 1);
    this.save();
  }

  private save() {
    localStorage.setItem('kanbanColumns', JSON.stringify(this.columns));
  }

  trackByColumn: TrackByFunction<KanbanColumn> = (index, c) => c.title;
  trackByTask:   TrackByFunction<KanbanTask>   = (index, t) => t.title;
}
