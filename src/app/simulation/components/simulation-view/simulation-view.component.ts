import { Component } from '@angular/core';
import { SimulationService } from '../../services/simulation.service';
import { Simulation } from '../../models/Simulation';
import { ActivatedRoute, Router } from '@angular/router';
import { Point3D, Dataset, PointMetadata, ScatterGL, RenderMode } from 'scatter-gl';
import { SimulationMap } from '../../models/SimulationMap';
import { SimulationMapViewComponent } from '../simulation-map-view/simulation-map-view.component';
import { BsModalService } from 'ngx-bootstrap/modal';

export interface GraphNode {
  labels: string[];
  labelNames: string[];
  colors: [number, number, number][];
  projection: [number, number, number][];
}

@Component({
  selector: 'app-simulation-view',
  templateUrl: './simulation-view.component.html',
  styles: [
  ]
})

export class SimulationViewComponent {
  public currentChartType: number;
  public simulation_id: string | null;
  public simulation: Simulation | null;
  public currentMap: SimulationMap | null;
  
  constructor(private _simulationService: SimulationService, private _route: ActivatedRoute, private _router: Router, private _modalService: BsModalService) {
    this.simulation_id = null;
    this.simulation = null;
    this.currentMap = null;
    this.currentChartType = 0;
  }

  ngOnInit(): void {
    this.simulation_id = this._route.snapshot.paramMap.get('id');

    if(this.simulation_id) {
      this._simulationService.getSimulation(this.simulation_id).subscribe(response => {
        if(response.hasOwnProperty('error')) {
          this._router.navigate(['/not-found']);
        }
        if(!response.hasOwnProperty('error')) {
          this.simulation = <Simulation>response;

          let data: GraphNode = {
            labels: [],
            labelNames: [],
            colors: [],
            projection: []
          };

          let max_nodes_count = 0, max_edges_count = 0, max_entropy = 0;

          for(let map of this.simulation.maps!) {
            if(map.nodes_count > max_nodes_count)
              max_nodes_count = map.nodes_count;

            if(map.edges_count > max_edges_count)
              max_edges_count = map.edges_count;
            
            if(map.entropy > max_entropy)
              max_entropy = map.entropy;

            data.labels.push(map._id);
            data.labelNames.push("Nodes: " + map.nodes_count.toString() + " - Edges: " + map.edges_count.toString() + " - Entropy: " + map.entropy.toFixed(2).toString())
            data.colors.push([map.color_entropy, map.color_entropy_percent, map.color_effort]);
            data.projection.push([map.nodes_count, map.entropy, map.edges_count]);
          }

          data.labels.push("origin");
          data.labelNames.push("origin")
          data.colors.push([-1, -1, -1]);
          data.projection.push([-max_nodes_count, -max_entropy, -max_edges_count]);

          const dataPoints: Point3D[] = [];
          const metadata: PointMetadata[] = [];

          data.projection.forEach((vector, index) => {
            dataPoints.push(vector);
            metadata.push({
              index,
              label: data.labelNames[index],
            });
          });

          const dataset = new Dataset(dataPoints, metadata);

          const containerElement = document.getElementById('container')!;

          const scatterGL = new ScatterGL(containerElement, {
            onClick: (point: number | null) => {
              if(point) {
                this.currentMap = this.simulation!.maps![point];
              }
            },
            onHover: (point: number | null) => {
            },
            renderMode: RenderMode.POINT,
            orbitControls: {
              zoomSpeed: 1.125,
            },
          });

          window.addEventListener('resize', () => {
            scatterGL.resize();
          });

          const colors = ['rgba(168, 50, 50, 0.75)', 'rgba(161, 158, 157, 0.75)', 'rgba(86, 199, 30, 0.75)'];

          scatterGL.setPointColorer((i, selectedIndices, hoverIndex) => {
            if(data.labels[i] == 'origin')
              return `rgba(0, 0, 0, 0)`;

            if (hoverIndex === i) 
              return `rgba(230, 0, 0, 0.75)`;
            return colors[data.colors[i][this.currentChartType]]
          });

          scatterGL.render(dataset);
        }
      })
    }
  }

  public getChartTypeLabel(chart_type: number): string {
    switch(chart_type) {
      case 0: return 'Entropy (H)';
      case 1: return 'Entropy Percent (Hr)';
      case 2: return 'Effort (M)'
    }
    return '';
  }

  public getChartId(chart_type: number): string {
    switch(chart_type) {
      case 0: return 'chartHolderEntropy';
      case 1: return 'chartHolderEntropyPercent';
      case 2: return 'chartHolderEffort'
    }
    return '';
  }

  public showCurrentMap() {
    const initialState = {
      map: this.currentMap!
    };

    this._modalService.show(SimulationMapViewComponent, { id: 'SimulationMapViewComponent', class: 'modal-lg', initialState });
  }
}
