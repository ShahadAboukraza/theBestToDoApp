// Import Angular core and required modules
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
import {KanbanTask, TaskModel} from '../../models/task';
import {TaskCard} from "../../components/task-card/task-card";

// Define Kanban component
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
    // Define structure for tasks in each Kanban column
    kanbanTasks: KanbanTask = {todo: [], inProgress: [], review: [], done: []};

    // Inject services
    private dialog = inject(MatDialog);
    private taskService = inject(TaskService);

    // Subject to handle unsubscription
    private destroy$ = new Subject<void>();

    // On init, subscribe to task changes and group them
    ngOnInit(): void {
        this.taskService.tasks
            .pipe(takeUntil(this.destroy$)) // Auto-cleanup on destroy
            .subscribe(tasks => this.groupTasks(tasks));
    }

    // Group tasks into Kanban columns based on stage
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
            }
        }

        // Sort each column by task start date
        Object.values(grouped).forEach(list =>
            list.sort((a: TaskModel, b: TaskModel) =>
                new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            )
        );

        // Update Kanban board
        this.kanbanTasks = grouped;
    }

    // Open dialog to create a new task in a specific column
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

    // Handle drag-and-drop between columns or reorder within the same column
    drop(event: CdkDragDrop<TaskModel[]>, stage: string): void {
        if (event.previousContainer === event.container) {
            // Same column: just reorder
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            // Move task to a new column
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }

        // Update task with new stage
        const task = event.item.data as TaskModel;
        const updated = {...task, stage};
        this.taskService.updateTask(updated).then();
    }

    // Delete a task by ID
    deleteTask(id: string): void {
        this.taskService.deleteTask(id).then();
    }

    // Cleanup subscriptions on destroy
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
