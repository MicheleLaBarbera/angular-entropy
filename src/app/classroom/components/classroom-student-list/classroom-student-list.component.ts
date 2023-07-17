import { Component, Input } from '@angular/core';
import { Classroom } from '../../models/Classroom';
import { User } from 'src/app/user/models/User';
import { ClassroomService } from '../../services/classroom.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classroom-student-list',
  templateUrl: './classroom-student-list.component.html',
  styles: [
  ]
})
export class ClassroomStudentListComponent {
  @Input() classroom!: Classroom;

  public loading: boolean;
  public students: User[];
  public user: User;

  constructor(private _classroomService: ClassroomService, private _router: Router) {
    this.loading = false;
    this.students = [];

    let currentUserData = JSON.parse(localStorage.getItem('currentUserData')!);

    if(!currentUserData)      
      this._router.navigate(['/users/auth']);
    
    this.user = currentUserData;
  }

  ngOnInit() {
    this.getClassroomStudents();
  }

  public getClassroomStudents() {
    this.loading = true;
    this._classroomService.getClassroomStudents(this.classroom._id?.$oid!).subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        this.students = <User[]>response;

        if(this.students)
          this.students.sort((a, b) => a.lastname.localeCompare(b.lastname) || a.firstname.localeCompare(b.firstname));
      }
      this.loading = false;
    });
  }
}
