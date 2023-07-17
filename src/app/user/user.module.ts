import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UserService } from './services/user.service';
import { UserAuthComponent } from './components/user-auth/user-auth.component';
import { UserRoutingModule } from './user-routing.module';
import { UserLogoutComponent } from './components/user-logout/user-logout.component';
import { UserCreateComponent } from './components/user-create/user-create.component';

@NgModule({
  declarations: [
    UserAuthComponent,
    UserLogoutComponent,
    UserCreateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule
  ],
  exports: [
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }
