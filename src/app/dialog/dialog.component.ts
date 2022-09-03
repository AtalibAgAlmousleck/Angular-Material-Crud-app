import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  EmailValidator,
} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  studentForm!: FormGroup;

  actionBtn: string = 'Register';
  actionForm: string = 'Add New Student';

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {
    this.studentForm = this.formBuilder.group({
      studentName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      major: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  get studentName() {
    return this.studentForm.get('studentName');
  }

  ngOnInit(): void {
    if (this.editData) {
      this.actionBtn = 'Update';
      this.studentForm.controls['studentName'].setValue(
        this.editData.studentName
      );
      this.studentForm.controls['email'].setValue(this.editData.email);
      this.studentForm.controls['major'].setValue(this.editData.major);
      this.studentForm.controls['date'].setValue(this.editData.date);
    }
  }

  onSubmit() {
    if (!this.editData) {
      if (this.studentForm.valid) {
        this.apiService.postStudent(this.studentForm.value).subscribe({
          next: (response) => {
            this.toastrService.success("Student Added Success");
            this.studentForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert('Error found');
          },
        });
      }
    } else {
      this.updateStudent();
    }
  }

  updateStudent() {
    this.apiService
      .putStudent(this.studentForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          this.toastrService.info("Student Updated Success");
          this.studentForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert('Error found');
        },
      });
  }
}
