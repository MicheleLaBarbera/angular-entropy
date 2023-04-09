import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationViewComponent } from './components/simulation-view/simulation-view.component';
import { SimulationService } from './services/simulation.service';
import { SharedModule } from '../shared/shared.module';
import { SimulationCreateComponent } from './components/simulation-create/simulation-create.component';
import { SimulationSearchComponent } from './components/simulation-search/simulation-search.component';
import { SimulationRoutingModule } from './simulation-routing.module';
import { UserModule } from '../user/user.module';
import { SimulationMapViewComponent } from './components/simulation-map-view/simulation-map-view.component';

@NgModule({
  declarations: [
    SimulationViewComponent,
    SimulationCreateComponent,
    SimulationSearchComponent,
    SimulationMapViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserModule,
    SimulationRoutingModule,
  ],
  exports: [
    SimulationViewComponent,
    SimulationCreateComponent,
    SimulationSearchComponent
  ],
  providers: [
    SimulationService
  ],
})
export class SimulationModule { }
