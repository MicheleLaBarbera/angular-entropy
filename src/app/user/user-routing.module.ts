import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthComponent } from './components/user-auth/user-auth.component';
import { UserLogoutComponent } from './components/user-logout/user-logout.component';
import { UserCreateComponent } from './components/user-create/user-create.component';

const routes: Routes = [
  { path: 'auth', component: UserAuthComponent},
  { path: 'signup', component: UserCreateComponent},
  { path: 'logout', component: UserLogoutComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
