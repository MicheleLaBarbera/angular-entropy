import { Component } from '@angular/core';
import { User } from 'src/app/user/models/User';
import { ClassroomHomework } from '../../models/ClassroomHomework';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomHomeworkService } from '../../services/classroom-homework.service';

export interface GraphNode {
  labels: string[];
  labelNames: string[];
  colors: [number, number, number][];
  projection: [number, number, number][];
}

@Component({
  selector: 'app-classroom-homework-view',
  templateUrl: './classroom-homework-view.component.html',
  styles: [
  ]
})
export class ClassroomHomeworkViewComponent {
  public user!: User;
  public classroom_id!: string;
  public homework_id!: string;
  public homework!: ClassroomHomework;
  public loading: boolean;

  constructor(private _route: ActivatedRoute, private _classroomHomeworkService: ClassroomHomeworkService, private _router: Router) {

    this.loading = false;

    let currentUserData = JSON.parse(localStorage.getItem('currentUserData')!);

    if(!currentUserData)      
      this._router.navigate(['/users/auth']);
    
    this.user = currentUserData;
  }

  ngOnInit() {
    this.classroom_id = this._route.snapshot.paramMap.get('classroom_id')!;
    this.homework_id = this._route.snapshot.paramMap.get('homework_id')!;

    this.getClassroomHomework();
  }

  public getClassroomHomework() {
    this.loading = true;
    this._classroomHomeworkService.getClassroomHomework(this.classroom_id, this.homework_id).subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        this.homework = <ClassroomHomework>response;
      } else 
        this._router.navigate(['/']);

      this.loading = false;
    });
  }
}
