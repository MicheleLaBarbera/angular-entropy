import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { ClassroomHomeworkViewComponent } from './components/classroom-homework-view/classroom-homework-view.component';
import { ClassroomHomeworkTeacherViewComponent } from './components/classroom-homework-teacher-view/classroom-homework-teacher-view.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: ':homework_id', component: ClassroomHomeworkViewComponent , canActivate: [AuthGuard] },
  { path: ':homework_id/teacher', component: ClassroomHomeworkTeacherViewComponent , canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassroomHomeworkRoutingModule { }
