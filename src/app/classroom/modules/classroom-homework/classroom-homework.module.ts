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
import { DateLabelPipe } from 'src/app/_utils/date-label.pipe';
import { ClassroomHomeworkMapViewComponent } from './components/classroom-homework-map-view/classroom-homework-map-view.component';
import { ClassroomHomeworkListCardsComponent } from './components/classroom-homework-list-cards/classroom-homework-list-cards.component';
import { ClassroomHomeworkTeacherViewComponent } from './components/classroom-homework-teacher-view/classroom-homework-teacher-view.component';
import { ClassroomHomeworkMapCreateComponent } from './components/classroom-homework-map-create/classroom-homework-map-create.component';


@NgModule({
  declarations: [
    ClassroomHomeworkCreateComponent,
    ClassroomHomeworkListComponent,
    ClassroomHomeworkViewComponent,
    DateLabelPipe,
    ClassroomHomeworkMapViewComponent,
    ClassroomHomeworkListCardsComponent,
    ClassroomHomeworkTeacherViewComponent,
    ClassroomHomeworkMapCreateComponent
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
    ClassroomHomeworkListComponent,
    ClassroomHomeworkListCardsComponent
  ],
  providers: [
    ClassroomHomeworkService
  ],
})
export class ClassroomHomeworkModule { }
