import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ClassroomService } from '../../services/classroom.service';
import { CLASSROOM_ACTION, Classroom } from '../../models/Classroom';

@Component({
  selector: 'app-classroom-create',
  templateUrl: './classroom-create.component.html',
  styles: [
  ]
})
export class ClassroomCreateComponent {
  public loading: boolean;

  public classroomCreateForm = this._fb.group({
    name: [null, Validators.required],
    size: [null, [Validators.min(1), Validators.max(2000), Validators.required]],
  });

  constructor(private _fb: FormBuilder, private _classroomService: ClassroomService, private _alertService: AlertService) { 
    this.loading = false;
  }

  public onSubmit(): void {
    let classroom: Classroom = { 
      name: this.classroomCreateForm.value.name!,
      size: this.classroomCreateForm.value.size!,
    };

    this.loading = true;
    this._classroomService.createClassroom(classroom).subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        this._alertService.success("Class successfully created");
        this._classroomService.updatedClassrooms$.emit(CLASSROOM_ACTION.CREATE)
        this.classroomCreateForm.reset();
      }
      this.loading = false;
    });
  }
}
