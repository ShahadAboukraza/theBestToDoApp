// Import Angular and Firebase Firestore utilities
import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionSnapshots,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore';
import {BehaviorSubject, map} from 'rxjs';
import {TaskModel} from '../models/task';
import {AuthService} from './auth-service';

@Injectable({
    providedIn: 'root' // Makes this service available app-wide
})
export class TaskService {
    // Observable that holds the current list of tasks
    tasks = new BehaviorSubject<TaskModel[]>([]);

    constructor(private firestore: Firestore, private authService: AuthService) {
    }

    // Fetch tasks from Firestore for the logged-in user
    getTasks() {
        const userId = this.authService.currentUser?.uid;
        if (!userId) return;

        const tasksRef = collection(this.firestore, 'tasks');

        // Query tasks by current user, ordered by start date (newest first)
        const q = query(tasksRef, orderBy('startDate', 'desc'), where('ownerId', '==', userId));

        // Listen for real-time updates to the queried tasks
        collectionSnapshots(q).pipe(
            map(snapshot => {
                const tasks = snapshot.map(snap => ({
                    id: snap.id,
                    ...snap.data()
                })) as unknown as TaskModel[];

                this.tasks.next(tasks); // Update BehaviorSubject
                return tasks;
            })
        ).subscribe();
    }

    // Add a new task to Firestore
    addTask(task: any) {
        const ownerId = this.authService.currentUser?.uid;
        const tasksRef = collection(this.firestore, 'tasks');

        // Convert dates to string format for storage
        const payload = {
            ...task,
            ownerId,
            startDate: task.startDate.toISOString(),
            endDate: task.endDate.toISOString(),
        };

        return addDoc(tasksRef, payload);
    }

    // Delete a task by its ID
    deleteTask(id: string) {
        const docRef = doc(this.firestore, 'tasks', id);
        return deleteDoc(docRef);
    }

    // Update an existing task
    updateTask(task: any) {
        const {id, ...payload} = task;
        const docRef = doc(this.firestore, 'tasks', id);

        // Ensure date fields are in ISO format
        payload.startDate = task.startDate instanceof Date ? task.startDate.toISOString() : task.startDate;
        payload.endDate = task.endDate instanceof Date ? task.endDate.toISOString() : task.endDate;

        return updateDoc(docRef, payload);
    }
}
