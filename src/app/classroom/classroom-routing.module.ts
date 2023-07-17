import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ClassroomInviteLinkComponent } from './components/classroom-invite-link/classroom-invite-link.component';
import { ClassroomViewComponent } from './components/classroom-view/classroom-view.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'invite/:invite_token', component: ClassroomInviteLinkComponent , canActivate: [AuthGuard] },
  { path: ':classroom_id', canActivate: [AuthGuard], children: [
    { path: '', pathMatch: 'full', component: ClassroomViewComponent },
    { path: 'homeworks', loadChildren: () => import('./modules/classroom-homework/classroom-homework.module').then(m => m.ClassroomHomeworkModule) },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassroomRoutingModule { }
