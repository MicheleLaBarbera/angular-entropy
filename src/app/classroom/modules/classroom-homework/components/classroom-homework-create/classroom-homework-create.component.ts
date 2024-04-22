import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ClassroomHomeworkService } from '../../services/classroom-homework.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ActivatedRoute } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { CLASSROOM_HOMEWORK_ACTION, ClassroomHomework } from '../../models/ClassroomHomework';

const fieldsRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const node_min = parseInt(control.get('node_min')!.value);
  const node_max = parseInt(control.get('node_max')!.value);

  return (node_min > node_max) ? { inRange: false } : null;
};

@Component({
  selector: 'app-classroom-homework-create',
  templateUrl: './classroom-homework-create.component.html',
  styles: [
  ]
})
export class ClassroomHomeworkCreateComponent {
  public classroom_id!: string;
  public loading: boolean;
  public editor!: Editor;
  public toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  public classroomHomeworkCreateForm = new FormGroup({
    'title': new FormControl(null, Validators.required),
    'body': new FormControl(null, Validators.required),
    'node_min': new FormControl(null, [Validators.required, Validators.min(1)]),
    'node_max': new FormControl(null, [Validators.required, Validators.max(30)]),
    'start_date': new FormControl(null, Validators.required),
    'expire_date': new FormControl(null, Validators.required),
    'start_time': new FormControl('00:00', Validators.required),
    'expire_time': new FormControl('00:00', Validators.required),
  }, fieldsRangeValidator);

  constructor(private _classroomHomeworkService: ClassroomHomeworkService, private _alertService: AlertService, private _route: ActivatedRoute) { 
    this.loading = false;
  }

  ngOnInit() {
    this.classroom_id = this._route.snapshot.paramMap.get('classroom_id')!;
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  public onSubmit(): void {
    const start_date = new Date(this.classroomHomeworkCreateForm.value.start_date! + " " + this.classroomHomeworkCreateForm.value.start_time!).getTime() / 1000;
    const expire_date = new Date(this.classroomHomeworkCreateForm.value.expire_date! + " " + this.classroomHomeworkCreateForm.value.expire_time!).getTime() / 1000;

    if(start_date > expire_date)
      return this._alertService.error("Type an expiration date greater than the start date")

    let classroomHomework: ClassroomHomework = { 
      classroom_id: this.classroom_id,
      title: this.classroomHomeworkCreateForm.value.title!,
      body: JSON.stringify(this.classroomHomeworkCreateForm.value.body),
      node_min: this.classroomHomeworkCreateForm.value.node_min!,
      node_max: this.classroomHomeworkCreateForm.value.node_max!,
      start_datetime: start_date,
      expire_datetime: expire_date
    };    

    this.loading = true;
    this._classroomHomeworkService.createClassroomHomework(classroomHomework).subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        this._alertService.success("Homework successfully created");
        this._classroomHomeworkService.updatedClassroomHomeworks$.emit(CLASSROOM_HOMEWORK_ACTION.CREATE)
        this.classroomHomeworkCreateForm.reset();
      }
      this.loading = false;
    });
  }


}
