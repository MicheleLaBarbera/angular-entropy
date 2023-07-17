import { Component } from '@angular/core';
import { SimulationService } from '../simulation/services/simulation.service';
import { SimulationsCount } from '../simulation/models/SimulationsCount';
import { Router } from '@angular/router';
import { User } from '../user/models/User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})

export class DashboardComponent {
  /*public generatedSimulations: number;
  public generatedMaps: number;
  public loading: boolean;*/
  public user!: User;

  constructor(/*private _simulationService: SimulationService,*/ private _router: Router) {
    /*this.generatedSimulations = 0;
    this.generatedMaps = 0;
    this.loading = true;*/
  }

  ngOnInit() {
    let currentUserData = JSON.parse(localStorage.getItem('currentUserData')!);

    if(!currentUserData)      
      this._router.navigate(['/users/auth']);
    
    this.user = currentUserData;
  }

  /*ngOnInit() {
    this._simulationService.getSimulationsCounts().subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        let smc = <SimulationsCount>response;

        this.generatedSimulations = smc.simulations_count;
        this.generatedMaps = smc.simulations_maps_count;
        this.loading= false;
      }
    });
  }

  public getCurrentYear(): number {
    return new Date().getFullYear();
  }*/
}
