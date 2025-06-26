// Import necessary Angular modules and components
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
    imports: [
        MatTableModule, DatePipe, MatIconButton,
        MatSelect, MatOption, MatFormField,
        FormsModule, NgForOf
    ],
})
export class TaskList implements OnInit {
    // Define columns shown in the task table
    displayedColumns: string[] = ['title', 'stage', 'startDate', 'endDate', 'priority', 'actions'];

    // Data source for the table
    dataSource: TaskModel[] = [];

    // Predefined stages for tasks
    stages = ['To do', 'In progress', 'Review', 'Done'];

    // Inject dependencies
    private dialog = inject(MatDialog);
    private taskService = inject(TaskService);

    // Used to clean up subscriptions on destroy
    private destroy$ = new Subject<void>();

    // Subscribe to task updates when component initializes
    ngOnInit(): void {
        this.taskService.tasks
            .pipe(takeUntil(this.destroy$)) // Auto unsubscribe on destroy
            .subscribe(tasks => this.dataSource = tasks); // Update table data
    }

    // Open dialog to create a new task
    openDialog(): void {
        const dialogRef = this.dialog.open(AddTask, {
            width: '600px',
            data: {
                stage: 'To do',   // Default stage
                isEdit: true      // Enable form input for creation
            }
        });

        // When dialog closes with valid result, save the task
        dialogRef.afterClosed().subscribe(result => {
            if (result) this.save(result);
        });
    }

    // Save a new task using the task service
    save(data: TaskModel): void {
        this.taskService.addTask(data).then();
    }

    // Delete a task after user confirms
    deleteTask(taskId: string): void {
        const ref = this.dialog.open(ConfirmationDialog, {
            width: '400px',
        });

        ref.afterClosed().subscribe(result => {
            if (!result) return; // Do nothing if cancelled
            this.taskService.deleteTask(taskId).then();
        });
    }

    // Open dialog to edit an existing task
    editTask(task: TaskModel): void {
        const dialogRef = this.dialog.open(AddTask, {
            data: {task: task, isEdit: true} // Pass existing task data and isEdit true to toggle edit mode
        });

        // Update task if user saved changes
        dialogRef.afterClosed().subscribe((updatedTask: TaskModel) => {
            if (updatedTask) {
                this.taskService.updateTask(updatedTask).then();
            }
        });
    }

    // Update the stage of a task when selected from dropdown
    updateStage($event: string, task: TaskModel): void {
        task.stage = $event;
        this.taskService.updateTask(task).then();
    }

    // View task in read-only mode (if needed)
    viewTask(task: TaskModel): void {
        this.dialog.open(AddTask, {
            data: {task: task}
        });
    }

    // Clean up subscriptions when component is destroyed
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
