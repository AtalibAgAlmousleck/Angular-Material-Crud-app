import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  postStudent(data: any) {
    return this.httpClient.post<any>("http://localhost:3000/students/",data);
  }

  getStudent() {
    return this.httpClient.get<any>("http://localhost:3000/students/");
  }

  putStudent(data: any, id: number): Observable<any> {
   return this.httpClient.put<any>("http://localhost:3000/students/"+id,data);
  }

  deleteStudent(id: number) {
    return this.httpClient.delete<any>("http://localhost:3000/students/"+id);
  }
}
