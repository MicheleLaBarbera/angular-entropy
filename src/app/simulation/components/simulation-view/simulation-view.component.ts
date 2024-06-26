import { Component } from '@angular/core';
import { SimulationService } from '../../services/simulation.service';
import { Simulation } from '../../models/Simulation';
import { ActivatedRoute, Router } from '@angular/router';
import { Point3D, Dataset, PointMetadata, ScatterGL, RenderMode } from 'scatter-gl';
import { SimulationMap } from '../../models/SimulationMap';
import { SimulationMapViewComponent } from '../simulation-map-view/simulation-map-view.component';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as Plotly from 'plotly.js-dist-min'
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export interface GraphNode {
  labels: string[];
  labelNames: string[];
  colors: [number, number, number][];
  projection: [number, number, number][];
}

enum CHART_TYPE {
  Entropy = 0,
  EntropyPercent,
  Effort
}

const fieldsRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const node_min = parseInt(control.get('node_min')!.value);
  const node_max = parseInt(control.get('node_max')!.value);

  const edge_min = parseInt(control.get('edge_min')!.value);
  const edge_max = parseInt(control.get('edge_max')!.value);

  const param_min = parseInt(control.get('param_min')!.value);
  const param_max = parseInt(control.get('param_max')!.value);

  return ((node_min > node_max) || (edge_min > edge_max) || (param_min > param_max)) ? { inRange: false } : null;
};

@Component({
  selector: 'app-simulation-view',
  templateUrl: './simulation-view.component.html',
  styles: [
  ]
})

export class SimulationViewComponent {

  public loading: boolean;

  public simulationFilterForm = new FormGroup({
    'node_min': new FormControl(0, Validators.required),
    'node_max': new FormControl(0, Validators.required),
    'edge_min': new FormControl(0, Validators.required),
    'edge_max': new FormControl(0, Validators.required),
    'param_min': new FormControl(0, Validators.required),
    'param_max': new FormControl(0, Validators.required),
  }, fieldsRangeValidator);

  public current_chart_type: CHART_TYPE;
  public simulation_id: string | null;
  public simulation: Simulation | null;
  public currentMap: SimulationMap | null;

  public maxMapsValues: {
    nodes: number;
    edges: number;
    entropy: number;
    entropy_percent: number;
    effort: number;
  }
  
  constructor(private _simulationService: SimulationService, private _route: ActivatedRoute, private _router: Router, private _modalService: BsModalService,
    private _fb: FormBuilder) {
    this.simulation_id = null;
    this.simulation = null;
    this.currentMap = null;
    this.current_chart_type = CHART_TYPE.Entropy;

    this.maxMapsValues = {
      nodes: 0,
      edges: 0,
      entropy: 0,
      entropy_percent: 0,
      effort: 0
    };

    this.loading = true;
  }

  public unpack(rows: any, key: any) {
    return rows.map(function(row: any)
    { return row[key]; });}
  

  public resetFilterForm(chart_type: CHART_TYPE) {
    this.simulationFilterForm.get('node_min')!.setValidators([Validators.min(this.simulation!.node_min), Validators.required]);
    this.simulationFilterForm.patchValue({
      node_min: this.simulation!.node_min
    })
    this.simulationFilterForm.get('node_min')!.updateValueAndValidity();

    this.simulationFilterForm.get('edge_min')!.setValidators([Validators.min(this.simulation!.node_min), Validators.required]);
    this.simulationFilterForm.patchValue({
      edge_min: this.simulation!.node_min
    })
    this.simulationFilterForm.get('edge_min')!.updateValueAndValidity();

    if(chart_type == CHART_TYPE.Entropy) {
      this.simulationFilterForm.get('param_min')!.setValidators([Validators.min(0), Validators.required]);
      this.simulationFilterForm.patchValue({
        param_min: 0
      })
      this.simulationFilterForm.get('param_min')!.updateValueAndValidity();

      this.simulationFilterForm.get('param_max')!.setValidators([Validators.max(this.maxMapsValues.entropy), Validators.required]);
      this.simulationFilterForm.patchValue({
        param_max: this.maxMapsValues.entropy
      })
      this.simulationFilterForm.get('param_max')!.updateValueAndValidity();
    }

    else if(chart_type == CHART_TYPE.EntropyPercent) {
      this.simulationFilterForm.get('param_min')!.setValidators([Validators.min(0), Validators.required]);
      this.simulationFilterForm.patchValue({
        param_min: 0
      })
      this.simulationFilterForm.get('param_min')!.updateValueAndValidity();

      this.simulationFilterForm.get('param_max')!.setValidators([Validators.max(this.maxMapsValues.entropy_percent), Validators.required]);
      this.simulationFilterForm.patchValue({
        param_max: this.maxMapsValues.entropy_percent
      })
      this.simulationFilterForm.get('param_max')!.updateValueAndValidity();
    }

    else if(chart_type == CHART_TYPE.Effort) {
      this.simulationFilterForm.get('param_min')!.setValidators([Validators.min(0), Validators.required]);
      this.simulationFilterForm.patchValue({
        param_min: 0
      })
      this.simulationFilterForm.get('param_min')!.updateValueAndValidity();

      this.simulationFilterForm.get('param_max')!.setValidators([Validators.max(this.maxMapsValues.effort), Validators.required]);
      this.simulationFilterForm.patchValue({
        param_max: this.maxMapsValues.effort
      })
      this.simulationFilterForm.get('param_max')!.updateValueAndValidity();
    }

    this.simulationFilterForm.get('node_max')!.setValidators([Validators.max(this.simulation!.node_max), Validators.required]);
    this.simulationFilterForm.patchValue({
      node_max: this.simulation!.node_max
    })
    this.simulationFilterForm.get('node_max')!.updateValueAndValidity();

    this.simulationFilterForm.get('edge_max')!.setValidators([Validators.max(this.maxMapsValues.edges), Validators.required]);
    this.simulationFilterForm.patchValue({
      edge_max: this.maxMapsValues.edges
    })
    this.simulationFilterForm.get('edge_max')!.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.simulation_id = this._route.snapshot.paramMap.get('id');

    if(this.simulation_id) {
      this._simulationService.getSimulation(this.simulation_id).subscribe(response => {
        this.loading = false;

        if(response.hasOwnProperty('error')) {
          this._router.navigate(['/not-found']);
          return;
        }
        
        this.simulation = <Simulation>response;
        if(this.simulation.maps) {
          
          this.simulationFilterForm.get('node_min')!.setValidators([Validators.min(this.simulation.node_min), Validators.required]);
          this.simulationFilterForm.patchValue({
            node_min: this.simulation.node_min
          })
          this.simulationFilterForm.get('node_min')!.updateValueAndValidity();

          this.simulationFilterForm.get('edge_min')!.setValidators([Validators.min(this.simulation.node_min), Validators.required]);
          this.simulationFilterForm.patchValue({
            edge_min: this.simulation.node_min
          })
          this.simulationFilterForm.get('edge_min')!.updateValueAndValidity();

          this.simulationFilterForm.get('node_max')!.setValidators([Validators.max(this.simulation.node_max), Validators.required]);
          this.simulationFilterForm.patchValue({
            node_max: this.simulation.node_max
          })
          this.simulationFilterForm.get('node_max')!.updateValueAndValidity();

          for(let map of this.simulation.maps) {
            if(map.nodes_count > this.maxMapsValues.nodes)
              this.maxMapsValues.nodes = map.nodes_count;

            if(map.edges_count > this.maxMapsValues.edges)
              this.maxMapsValues.edges = map.edges_count;

            if(map.entropy > this.maxMapsValues.entropy)
              this.maxMapsValues.entropy = map.entropy;

            if(map.entropy_percent > this.maxMapsValues.entropy_percent)
              this.maxMapsValues.entropy_percent = map.entropy_percent;

            if(map.effort > this.maxMapsValues.effort)
              this.maxMapsValues.effort = map.effort;
          }
          this.resetFilterForm(this.current_chart_type);
          this.renderScatterPlot(this.current_chart_type);
        }
      })
    }
  }

  public getCoordsDatum(chart_type: CHART_TYPE, trace: number) {
    let x = this.unpack(this.simulation!.maps!.filter(map => 
      map.color_entropy == trace && 
      map.nodes_count >= this.simulationFilterForm.value.node_min! && map.nodes_count <= this.simulationFilterForm.value.node_max! &&
      map.edges_count >= this.simulationFilterForm.value.edge_min! && map.edges_count <= this.simulationFilterForm.value.edge_max! &&
      map.entropy >= this.simulationFilterForm.value.param_min! && map.entropy <= this.simulationFilterForm.value.param_max!
    ), 'nodes_count');

    let y = this.unpack(this.simulation!.maps!.filter(map => 
      map.color_entropy == trace && 
      map.nodes_count >= this.simulationFilterForm.value.node_min! && map.nodes_count <= this.simulationFilterForm.value.node_max! &&
      map.edges_count >= this.simulationFilterForm.value.edge_min! && map.edges_count <= this.simulationFilterForm.value.edge_max! &&
      map.entropy >= this.simulationFilterForm.value.param_min! && map.entropy <= this.simulationFilterForm.value.param_max!
    ), 'edges_count');

    let z = this.unpack(this.simulation!.maps!.filter(map => 
      map.color_entropy == trace && 
      map.nodes_count >= this.simulationFilterForm.value.node_min! && map.nodes_count <= this.simulationFilterForm.value.node_max! &&
      map.edges_count >= this.simulationFilterForm.value.edge_min! && map.edges_count <= this.simulationFilterForm.value.edge_max! &&
      map.entropy >= this.simulationFilterForm.value.param_min! && map.entropy <= this.simulationFilterForm.value.param_max!
    ), 'entropy');

    if(chart_type == CHART_TYPE.EntropyPercent) {
      x = this.unpack(this.simulation!.maps!.filter(map => 
        map.color_entropy_percent == trace &&
        map.nodes_count >= this.simulationFilterForm.value.node_min! && map.nodes_count <= this.simulationFilterForm.value.node_max! &&
        map.edges_count >= this.simulationFilterForm.value.edge_min! && map.edges_count <= this.simulationFilterForm.value.edge_max! &&
        map.entropy_percent >= this.simulationFilterForm.value.param_min! && map.entropy_percent <= this.simulationFilterForm.value.param_max!
      ), 'nodes_count');

      y = this.unpack(this.simulation!.maps!.filter(map => 
        map.color_entropy_percent == trace &&
        map.nodes_count >= this.simulationFilterForm.value.node_min! && map.nodes_count <= this.simulationFilterForm.value.node_max! &&
        map.edges_count >= this.simulationFilterForm.value.edge_min! && map.edges_count <= this.simulationFilterForm.value.edge_max! &&
        map.entropy_percent >= this.simulationFilterForm.value.param_min! && map.entropy_percent <= this.simulationFilterForm.value.param_max!
      ), 'edges_count');

      z = this.unpack(this.simulation!.maps!.filter(map => 
        map.color_entropy_percent == trace &&
        map.nodes_count >= this.simulationFilterForm.value.node_min! && map.nodes_count <= this.simulationFilterForm.value.node_max! &&
        map.edges_count >= this.simulationFilterForm.value.edge_min! && map.edges_count <= this.simulationFilterForm.value.edge_max! &&
        map.entropy_percent >= this.simulationFilterForm.value.param_min! && map.entropy_percent <= this.simulationFilterForm.value.param_max!
      ), 'entropy_percent');
    }
    else if(chart_type == CHART_TYPE.Effort) {
      x = this.unpack(this.simulation!.maps!.filter(map => 
        map.color_effort == trace &&
        map.nodes_count >= this.simulationFilterForm.value.node_min! && map.nodes_count <= this.simulationFilterForm.value.node_max! &&
        map.edges_count >= this.simulationFilterForm.value.edge_min! && map.edges_count <= this.simulationFilterForm.value.edge_max! &&
        map.effort >= this.simulationFilterForm.value.param_min! && map.effort <= this.simulationFilterForm.value.param_max!
      ), 'nodes_count');
      y = this.unpack(this.simulation!.maps!.filter(map => 
        map.color_effort == trace &&
        map.nodes_count >= this.simulationFilterForm.value.node_min! && map.nodes_count <= this.simulationFilterForm.value.node_max! &&
        map.edges_count >= this.simulationFilterForm.value.edge_min! && map.edges_count <= this.simulationFilterForm.value.edge_max! &&
        map.effort >= this.simulationFilterForm.value.param_min! && map.effort <= this.simulationFilterForm.value.param_max!
      ), 'edges_count');
      z = this.unpack(this.simulation!.maps!.filter(map => 
        map.color_effort == trace &&
        map.nodes_count >= this.simulationFilterForm.value.node_min! && map.nodes_count <= this.simulationFilterForm.value.node_max! &&
        map.edges_count >= this.simulationFilterForm.value.edge_min! && map.edges_count <= this.simulationFilterForm.value.edge_max! &&
        map.effort >= this.simulationFilterForm.value.param_min! && map.effort <= this.simulationFilterForm.value.param_max!
      ), 'effort');
    }
    return [x, y, z]
  }

  public renderScatterPlot(chart_type: CHART_TYPE): void {
    Plotly.purge('container');

    const colors = ['rgba(168, 50, 50, 0.95)', 'rgba(161, 158, 157, 0.95)', 'rgba(86, 199, 30, 0.95)'];

    let firstTrace: Partial<Plotly.PlotData> = {
      x: this.getCoordsDatum(chart_type, 0)[0],
      y: this.getCoordsDatum(chart_type, 0)[1],
      z: this.getCoordsDatum(chart_type, 0)[2],
      mode: 'markers',
      marker: {
        size: 5,
        line: {
          color: colors[0],
          width: 0.5
        },
        opacity: 0.8
      },
      type: 'scatter3d'
    };

    console.log(firstTrace)

    let secondTrace: Partial<Plotly.PlotData> = {
      x: this.getCoordsDatum(chart_type, 1)[0],
      y: this.getCoordsDatum(chart_type, 1)[1],
      z: this.getCoordsDatum(chart_type, 1)[2],
      mode: 'markers',
      marker: {
        size: 5,
        line: {
          color: colors[1],
          width: 0.5
        },
        opacity: 0.8
      },
      type: 'scatter3d'
    };

    let thirdTrace: Partial<Plotly.PlotData> = {
      x: this.getCoordsDatum(chart_type, 2)[0],
      y: this.getCoordsDatum(chart_type, 2)[1],
      z: this.getCoordsDatum(chart_type, 2)[2],
      mode: 'markers',
      marker: {
        size: 5,
        line: {
          color: colors[2],
          width: 0.5
        },
        opacity: 0.8
      },
      type: 'scatter3d'
    };

    let traces: Plotly.Data[] = [firstTrace, secondTrace, thirdTrace];

    let layout: Partial<Plotly.Layout> = {
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 50
      },
      width: window.innerWidth - (window.innerWidth / 2.5),
      height: window.innerHeight - 200,
      colorway : colors,
      scene: {
        xaxis: {
          title: 'Nodes', 
          range: [0, this.maxMapsValues.nodes], 
        },
        yaxis: {
          title: 'Edges',
          range: [0, this.maxMapsValues.edges]
        },
        zaxis: {
          title: this.getChartTypeLabel(this.current_chart_type),
        },
      }
    }   

    Plotly.newPlot('container', traces, layout, {responsive: true});

    var myPlot:any = document.getElementById('container');

    myPlot.on('plotly_click', (data: any) => {
      if(this.current_chart_type == CHART_TYPE.Entropy)
        this.currentMap = this.simulation?.maps?.filter(map => data.points[0].x == map.nodes_count &&
          data.points[0].y == map.edges_count && 
          data.points[0].z == map.entropy)[0]!;
      else if(this.current_chart_type == CHART_TYPE.EntropyPercent)
        this.currentMap = this.simulation?.maps?.filter(map => data.points[0].x == map.nodes_count &&
          data.points[0].y == map.edges_count && 
          data.points[0].z == map.entropy_percent)[0]!;
      else if(this.current_chart_type == CHART_TYPE.Effort)
          this.currentMap = this.simulation?.maps?.filter(map => data.points[0].x == map.nodes_count &&
            data.points[0].y == map.edges_count && 
            data.points[0].z == map.effort)[0]!;

      this.showCurrentMap()
    });
  }

  public getChartTypeLabel(chart_type: CHART_TYPE): string {
    switch(chart_type) {
      case CHART_TYPE.Entropy: return 'Entropy (H)';
      case CHART_TYPE.EntropyPercent: return 'Entropy Percent (Hr)';
      case CHART_TYPE.Effort: return 'Effort (M)'
    }
  }

  public getChartId(chart_type: CHART_TYPE): string {
    switch(chart_type) {
      case CHART_TYPE.Entropy: return 'chartHolderEntropy';
      case CHART_TYPE.EntropyPercent: return 'chartHolderEntropyPercent';
      case CHART_TYPE.Effort: return 'chartHolderEffort'
    }
  }

  public updateChartType(chart_type: CHART_TYPE) {
    this.currentMap = null;
    this.current_chart_type = chart_type;
    this.resetFilterForm(this.current_chart_type);
    this.renderScatterPlot(this.current_chart_type);
  }

  public showCurrentMap() {
    const initialState = {
      map: this.currentMap!
    };

    this._modalService.show(SimulationMapViewComponent, { id: 'SimulationMapViewComponent', class: 'modal-lg', initialState });
  }

  public downloadJson(){
    var sJson = JSON.stringify(this.simulation);
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    element.setAttribute('download', (this.simulation?.name) ? this.simulation?.name + '.json' : 'undefined.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); 
    document.body.removeChild(element);
  }
}
