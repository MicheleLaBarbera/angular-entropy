import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Simulation } from '../../models/Simulation';
import { SimulationService } from '../../services/simulation.service';

@Component({
  selector: 'app-simulation-search',
  templateUrl: './simulation-search.component.html',
  styles: [
  ]
})
export class SimulationSearchComponent {
  @Output() searchSimulationEvent = new EventEmitter<string | null>();

  public simulationSearchForm = this._fb.group({
    name: [null, Validators.required],
  });

  constructor(private _fb: FormBuilder, private _simulationService: SimulationService, private _router: Router) { }

  public onSubmit(): void {
    this._router.navigateByUrl('/simulations/' + this.simulationSearchForm.value.name);
  }
}
