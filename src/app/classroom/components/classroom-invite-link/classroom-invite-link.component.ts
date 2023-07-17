import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomService } from '../../services/classroom.service';
import { AlertService } from 'src/app/shared/alert/alert.service';

@Component({
  selector: 'app-classroom-invite-link',
  templateUrl: './classroom-invite-link.component.html',
  styles: [
  ]
})
export class ClassroomInviteLinkComponent {
  public invite_token!: string;

  constructor(private _route: ActivatedRoute, private _classroomService: ClassroomService, private _alertService: AlertService,
    private _router: Router) {

  }

  ngOnInit() {
    this.invite_token = this._route.snapshot.paramMap.get('invite_token')!;

    if(this.invite_token) {
      this._classroomService.joinStudentClassroom(this.invite_token).subscribe(response => {
        if(!response.hasOwnProperty('error')) {
          this._alertService.success("Class successfully joined");
        }
        this._router.navigate(['/']);
      })
    }
  }
}
