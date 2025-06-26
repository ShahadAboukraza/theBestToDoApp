import {Component, Input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {TaskModel} from '../../models/task';

@Component({
    selector: 'app-review-task',
    imports: [
        DatePipe
    ],
    templateUrl: './review-task.html',
    styleUrl: './review-task.scss'
})
export class ReviewTask {
    // Pass task from the parent component
    @Input() task!: TaskModel;
}
