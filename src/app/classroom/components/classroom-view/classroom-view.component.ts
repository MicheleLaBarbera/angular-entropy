import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomService } from '../../services/classroom.service';
import { Classroom } from '../../models/Classroom';
import { User } from 'src/app/user/models/User';

@Component({
  selector: 'app-classroom-view',
  templateUrl: './classroom-view.component.html',
  styles: [
  ]
})
export class ClassroomViewComponent {
  public user!: User;
  public classroom_id!: string;
  public classroom!: Classroom;

  public loading: boolean;

  constructor(private _route: ActivatedRoute, private _classroomService: ClassroomService, private _router: Router) {
    this.loading = false;

    let currentUserData = JSON.parse(localStorage.getItem('currentUserData')!);

    if(!currentUserData)      
      this._router.navigate(['/users/auth']);
    
    this.user = currentUserData;
  }

  ngOnInit() {
    this.classroom_id = this._route.snapshot.paramMap.get('classroom_id')!;

    this.getClassroom();
  }

  public getClassroom() {
    this.loading = true;
    this._classroomService.getClassroom(this.classroom_id).subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        this.classroom = <Classroom>response;
      } else 
        this._router.navigate(['/']);

      this.loading = false;
    });
  }
}

