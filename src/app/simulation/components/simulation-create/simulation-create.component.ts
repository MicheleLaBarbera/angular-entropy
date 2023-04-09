import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { Simulation } from '../../models/Simulation';
import { SimulationService } from '../../services/simulation.service';

@Component({
  selector: 'app-simulation-create',
  templateUrl: './simulation-create.component.html',
  styles: [
  ]
})
export class SimulationCreateComponent {

  public simulationCreateForm = this._fb.group({
    name: [null, Validators.required],
    maps_count: [null, [Validators.min(1), Validators.max(1000), Validators.required]],
    node_min: [null, [Validators.min(1), Validators.required]],
    node_max: [null, [Validators.max(30), Validators.required, this.greaterThan('node_min')]],
    is_public: [false]
  });

  constructor(private _fb: FormBuilder, private _simulationService: SimulationService, private _alertService: AlertService) { 
  }

  public onSubmit(): void {
    let simulation: Simulation = { 
      name: this.simulationCreateForm.value.name!,
      maps_count: this.simulationCreateForm.value.maps_count!,
      node_min: this.simulationCreateForm.value.node_min!,
      node_max: this.simulationCreateForm.value.node_max!
    };

    this._simulationService.createSimulation(simulation).subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        this._alertService.success("Simulation successfully generated");
        this.simulationCreateForm.reset();
      }
    });
  }

  greaterThan(field: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const group = control.parent;
      if(group) {
        const fieldToCompare = group.get(field);
        const isLessThan = Number(fieldToCompare!.value) > Number(control.value);
        return isLessThan ? {'lessThan': {value: control.value}} : null;
      }
      return null;
    }
  }

  /*public toggleSimulationName() {
    this.simulationCreateForm.get('name')!.reset();
    this.simulationCreateForm.get('name')!.setValidators(!(this.simulationCreateForm.value.is_public) ? [Validators.required] : null);
    console.log(this.simulationCreateForm.get('name')!)
    this.simulationCreateForm.get('name')!.updateValueAndValidity();

    if((this.simulationCreateForm.value.is_public))
      this.simulationCreateForm.get('name')!.disable();
    else
      this.simulationCreateForm.get('name')!.enable();

    this.simulationCreateForm.value.name = null;
  }*/
}
