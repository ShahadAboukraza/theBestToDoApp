import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionSnapshots,
  deleteDoc,
  doc,
  Firestore, orderBy,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore';
import {BehaviorSubject, map} from 'rxjs';
import {TaskModel} from '../models/task';
import {AuthService} from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks = new BehaviorSubject<TaskModel[]>([]);

  constructor(private firestore: Firestore, private authService: AuthService) {
  }

  getTasks() {
    const userId = this.authService.currentUser?.uid;
    if(!userId) return;
    const tasksRef = collection(this.firestore, 'tasks');
    const q = query(tasksRef, orderBy('startDate', 'desc'), where('ownerId', '==', userId));

    collectionSnapshots(q).pipe(
      map(snapshot => {
        const tasks = snapshot.map(snap => ({
          id: snap.id,
          ...snap.data()
        })) as unknown as TaskModel[];
        this.tasks.next(tasks);
        return tasks;
      })
    ).subscribe();
  }

  addTask(task: any) {
    const ownerId = this.authService.currentUser?.uid;
    const tasksRef = collection(this.firestore, 'tasks');
    const payload = {
      ...task,
      ownerId,
      startDate: task.startDate.toISOString(),
      endDate: task.endDate.toISOString(),
    };
    return addDoc(tasksRef, payload);
  }

  deleteTask(id: string) {
    const docRef = doc(this.firestore, 'tasks', id);
    return deleteDoc(docRef);
  }

  updateTask(task: any) {
    const {id, ...payload} = task;
    const docRef = doc(this.firestore, 'tasks', id);
    payload.startDate = task.startDate instanceof Date ? task.startDate.toISOString() : task.startDate;
    payload.endDate = task.endDate instanceof Date ? task.endDate.toISOString() : task.endDate;
    return updateDoc(docRef, payload);
  }

}
