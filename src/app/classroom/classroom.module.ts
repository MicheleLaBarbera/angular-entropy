import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { ClassroomCreateComponent } from './components/classroom-create/classroom-create.component';
import { ClassroomService } from './services/classroom.service';
import { ClassroomRoutingModule } from './classroom-routing.module';
import { ClassroomInviteLinkComponent } from './components/classroom-invite-link/classroom-invite-link.component';
import { ClassroomViewComponent } from './components/classroom-view/classroom-view.component';
import { ClassroomListComponent } from './components/classroom-list/classroom-list.component';
import { ClassroomHomeworkModule } from './modules/classroom-homework/classroom-homework.module';
import { ClassroomStudentListComponent } from './components/classroom-student-list/classroom-student-list.component';

@NgModule({
  declarations: [
    ClassroomCreateComponent,
    ClassroomInviteLinkComponent,
    ClassroomViewComponent,
    ClassroomListComponent,
    ClassroomStudentListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserModule,
    ClassroomRoutingModule,
    ClassroomHomeworkModule,
  ],
  exports: [
    ClassroomCreateComponent,
    ClassroomListComponent
  ],
  providers: [
    ClassroomService
  ],
})
export class ClassroomModule { }
