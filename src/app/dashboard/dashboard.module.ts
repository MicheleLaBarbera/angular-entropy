import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SimulationModule } from '../simulation/simulation.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { ClassroomModule } from '../classroom/classroom.module';
import { DashboardStudentComponent } from './components/dashboard-student/dashboard-student.component';
import { ClassroomHomeworkModule } from '../classroom/modules/classroom-homework/classroom-homework.module';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardStudentComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    SimulationModule,
    ClassroomModule,
    ClassroomHomeworkModule,
    UserModule,
  ],
})
export class DashboardModule { }
