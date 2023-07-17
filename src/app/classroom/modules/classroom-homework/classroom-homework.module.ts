import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserModule } from 'src/app/user/user.module';
import { ClassroomHomeworkCreateComponent } from './components/classroom-homework-create/classroom-homework-create.component';
import { ClassroomHomeworkService } from './services/classroom-homework.service';
import { ClassroomHomeworkListComponent } from './components/classroom-homework-list/classroom-homework-list.component';
import { ClassroomHomeworkViewComponent } from './components/classroom-homework-view/classroom-homework-view.component';
import { ClassroomHomeworkRoutingModule } from './classroom-homework-routing.module';
import { NgxGraphModule } from '@swimlane/ngx-graph';


@NgModule({
  declarations: [
    ClassroomHomeworkCreateComponent,
    ClassroomHomeworkListComponent,
    ClassroomHomeworkViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserModule,
    ClassroomHomeworkRoutingModule,
    NgxGraphModule,
  ],
  exports: [
    ClassroomHomeworkCreateComponent,
    ClassroomHomeworkListComponent
  ],
  providers: [
    ClassroomHomeworkService
  ],
})
export class ClassroomHomeworkModule { }
