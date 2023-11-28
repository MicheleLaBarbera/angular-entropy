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
import { DateLabelPipe } from '../_utils/date-label.pipe';
import { ClassroomListCardsComponent } from './components/classroom-list-cards/classroom-list-cards.component';

@NgModule({
  declarations: [
    ClassroomCreateComponent,
    ClassroomInviteLinkComponent,
    ClassroomViewComponent,
    ClassroomListComponent,
    ClassroomStudentListComponent,
    ClassroomListCardsComponent,
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
    ClassroomListComponent,
    ClassroomListCardsComponent
  ],
  providers: [
    ClassroomService
  ],
})
export class ClassroomModule { }
