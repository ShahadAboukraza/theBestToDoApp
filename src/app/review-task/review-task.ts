import {Component, Input} from '@angular/core';
import {TaskModel} from '../todo-kanban/todo-kanban';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-review-task',
  imports: [
    DatePipe
  ],
  templateUrl: './review-task.html',
  styleUrl: './review-task.scss'
})
export class ReviewTask {
  @Input() task!: TaskModel;

  ngOnInit() {
    console.log(this.task);
  }
}
