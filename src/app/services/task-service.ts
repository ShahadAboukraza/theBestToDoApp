import {inject, Injectable} from '@angular/core';
import {TaskModel} from '../todo-kanban/todo-kanban';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks: TaskModel[] = [];
  readonly dialog = inject(MatDialog);
  constructor() { }

  getTasks() {
    // Get saved tasks list from local storage
    const saved = localStorage.getItem('tasks');
    // Check if it's found
    if (saved) {
      //If found parse from JSON string to list
      this.tasks = JSON.parse(saved) as TaskModel[];
    } else {
      // Return empty list
      this.tasks = [];
    }

    return this.tasks;
  }

  save(data: TaskModel): void {
    this.tasks.push(data);
    this.updateTask();
  }

  deleteTask(taskId: number): void {
    //Remove the task with the taskId
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.updateTask();
  }

  updateSpecificTask(updated: TaskModel): void {
    const index = this.tasks.findIndex(t => t.id === updated.id);
    if (index !== -1) {
      this.tasks[index] = updated;
      this.updateTask(); // Save to localStorage
    }
  }

  updateTask() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  updateInStorage(tasks: TaskModel[]): void {
    this.tasks = tasks;
    this.updateTask();
  }

}
