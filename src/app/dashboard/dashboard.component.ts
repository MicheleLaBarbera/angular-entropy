import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})

export class DashboardComponent {
  public generatedSimulations: number;
  public generatedMaps: number;

  constructor() {
    this.generatedSimulations = 23;
    this.generatedMaps = 586;
  }
}
