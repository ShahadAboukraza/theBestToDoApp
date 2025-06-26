// Import Angular core and common modules
import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {TaskService} from '../../services/task-service';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {TaskModel} from '../../models/task';
import {Subject, takeUntil} from 'rxjs';
import {AddTask} from "../../components/add-task/add-task";
import {TaskCard} from "../../components/task-card/task-card";

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
        MatIconButton,
        TaskCard
    ]
})
export class TaskTimeline implements OnInit {
    // Array to hold tasks
    tasks: TaskModel[] = [];

    // Used to unsubscribe from observables when component is destroyed
    private destroy$ = new Subject<void>();

    // Store setInterval handles to control timers
    intervalHandles: { [key: string]: any } = {};

    // Inject required services
    private taskService = inject(TaskService);
    private dialog = inject(MatDialog);

    // Called once after component initializes
    ngOnInit(): void {
        // Subscribe to task updates and clean up on destroy
        this.taskService.tasks
            .pipe(takeUntil(this.destroy$))
            .subscribe(tasks => this.tasks = tasks);
    }

    // Start or stop a task timer
    toggleTimer(task: TaskModel): void {
        const taskId = task.id;

        // If timer is running, stop and clear it
        if (this.intervalHandles[taskId]) {
            clearInterval(this.intervalHandles[taskId]);
            delete this.intervalHandles[taskId];
            this.taskService.updateTask(task).then(); // Save updated task
        } else {
            // Start new timer if not running
            if (!task.elapsed) task.elapsed = 0;
            this.intervalHandles[taskId] = setInterval(() => {
                task.elapsed!++;
                this.taskService.updateTask(task).then(); // Update task every second
            }, 1000);
        }
    }

    // Format seconds into mm:ss format
    formatTime(seconds: number = 0): string {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    // Mark task as done and update it
    markAsDone(task: TaskModel): void {
        task.stage = 'Done';
        this.taskService.updateTask(task).then();
    }

    // Reset task timer to 0
    resetTimer(task: TaskModel): void {
        task.elapsed = 0;
        this.taskService.updateTask(task).then();
    }

    // Calculate height of the timeline based on number of tasks
    timelineHeight() {
        return (this.tasks.length - 1) * 390 + 'px';
    }

    // Open dialog to view task details
    viewTask(task: TaskModel): void {
        this.dialog.open(AddTask, {
            data: {task: task, isEdit: false}
        });
    }
}
