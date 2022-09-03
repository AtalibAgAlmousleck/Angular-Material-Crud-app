import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  displayedColumns: string[] = ['id', 'studentName', 'email', 'major', 'date', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
      private dialog: MatDialog, 
      private apiService: ApiService,
      private toastrService: ToastrService,
      ) {

  }

  ngOnInit(): void {
    this.getAllStudent();
  }

  openDelete(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
     width: '25%'
    }).afterClosed().subscribe(val=> {
      if(val === 'save') {
        this.getAllStudent();
      } 
    });
  }

  getAllStudent() {
      this.apiService.getStudent().subscribe({
        next:(response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error:(err) => {
          alert("Error found");
        }
      });
  }

  editStudent(row: any) {
    this.dialog.open(DialogComponent, {
      width:'25%',
      data: row
    }).afterClosed().subscribe(val=> {
      if(val === 'update') {
        this.getAllStudent();
      } 
    });
  }

  deleteStudent(id: number) {
    this.apiService.deleteStudent(id).subscribe({
      next:(response) => {
        this.toastrService.error("Student Deleted...");
        this.getAllStudent();
      },
      error:() => {
        alert("Error found");
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
}
