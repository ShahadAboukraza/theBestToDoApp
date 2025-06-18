import { Component, OnInit, inject } from '@angular/core';
import { FormsModule }                from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import { MatFormFieldModule }         from '@angular/material/form-field';
import { MatInputModule }             from '@angular/material/input';
import { MatSelectModule }            from '@angular/material/select';
import { MatDatepickerModule }        from '@angular/material/datepicker';
import { MatDatepickerToggle }        from '@angular/material/datepicker';
import { MatButtonModule }            from '@angular/material/button';
import { MatIconModule }              from '@angular/material/icon';
import { provideNativeDateAdapter }   from '@angular/material/core';

export interface DialogData {
  stage: string;
}

@Component({
  standalone: true,
  selector:  'app-add-task',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDatepickerToggle,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './add-task.html',
  styleUrls:   ['./add-task.scss'],
  providers:   [ provideNativeDateAdapter() ]
})
export class AddTask implements OnInit {
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<AddTask>);

  task = {
    title:       '',
    description: '',
    startDate:   '',
    endDate:     '',
    stage:       ''
  };

  ngOnInit() {
    this.task.stage = this.data.stage;
  }

  cancel() {
    this.dialogRef.close();
  }

  saveTask() {
    this.dialogRef.close(this.task);
  }
}
