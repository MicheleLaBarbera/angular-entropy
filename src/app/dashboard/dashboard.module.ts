import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SimulationModule } from '../simulation/simulation.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    SimulationModule,
    UserModule
  ],
})
export class DashboardModule { }
