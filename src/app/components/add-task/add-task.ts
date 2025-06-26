import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {provideNativeDateAdapter} from '@angular/material/core';
import {ReviewTask} from '../review-task/review-task';

@Component({
    standalone: true,
    selector: 'app-add-task',
    imports: [
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatDatepickerToggle,
        MatButtonModule,
        MatIconModule,
        ReviewTask
    ],
    templateUrl: './add-task.html',
    styleUrls: ['./add-task.scss'],
    providers: [provideNativeDateAdapter()]
})
export class AddTask implements OnInit {
    readonly data = inject<any>(MAT_DIALOG_DATA);
    isEdit = false;
    task: any = {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        stage: this.data.stage,
        members: '',
        priority: ''
    };
    private dialogRef = inject(MatDialogRef<AddTask>);

    ngOnInit() {
        // If editing existing task
        this.isEdit = this.data.isEdit;
        if (this.data.task) {
            this.task = {...this.data.task}
        } else {
            this.task.stage = this.data.stage;
        }
        console.log(this.task);
    }

    saveTask() {
        this.dialogRef.close(this.task);
    }
}
