import { Component } from '@angular/core';
import { User } from 'src/app/user/models/User';
import { ClassroomHomework } from '../../models/ClassroomHomework';
import { ClassroomHomeworkMap } from '../../models/ClassroomHomeworkMap';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomHomeworkService } from '../../services/classroom-homework.service';
import { DagreSettings, Edge, Orientation, Node } from '@swimlane/ngx-graph';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { Simulation } from 'src/app/simulation/models/Simulation';
import * as Plotly from 'plotly.js-dist-min'
import { SimulationMap } from 'src/app/simulation/models/SimulationMap';

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
  selector: 'app-classroom-homework-view',
  templateUrl: './classroom-homework-view.component.html',
  styles: [
  ]
})
export class ClassroomHomeworkViewComponent {
  public user!: User;
  public classroom_id!: string;
  public homework_id!: string;
  public homework!: ClassroomHomework;

  public loading: boolean;
  public loadingAddNode: boolean;

  public layoutSettings: DagreSettings = {
    orientation: Orientation.TOP_TO_BOTTOM
  }

  public nodes!: Node[];
  public links!: Edge[];

  public nodesCount: number;
  public linksCount: number;

  public sourceLinkNodeId: string | null;
  public targetLinkNodeId: string | null;
  public labelLink: string | null;

  public isValidGraph!: boolean;

  public nodeCreateForm = new FormGroup({
    'name': new FormControl(null, Validators.required),
  });

  public adjacencyMatrix!: number[][];

  // =========================================

  public simulationFilterForm = new FormGroup({
    'node_min': new FormControl(0, Validators.required),
    'node_max': new FormControl(0, Validators.required),
    'edge_min': new FormControl(0, Validators.required),
    'edge_max': new FormControl(0, Validators.required),
    'param_min': new FormControl(0, Validators.required),
    'param_max': new FormControl(0, Validators.required),
  }, fieldsRangeValidator);

  public current_chart_type: CHART_TYPE;
  public simulation: Simulation | null;

  public maxMapsValues: {
    nodes: number;
    edges: number;
    entropy: number;
    entropy_percent: number;
    effort: number;
  }

  constructor(private _route: ActivatedRoute, private _classroomHomeworkService: ClassroomHomeworkService, 
    private _router: Router, private _alertService: AlertService) {
    this.loading = false;
    this.loadingAddNode = false;
    this.nodesCount = 0;
    this.linksCount = 0;
    this.nodes = [];
    this.links = [];
    this.sourceLinkNodeId = null;
    this.targetLinkNodeId = null;
    this.labelLink = null;

    this.isValidGraph = false;

    this.simulation = null;
    this.current_chart_type = CHART_TYPE.Entropy;

    this.maxMapsValues = {
      nodes: 0,
      edges: 0,
      entropy: 0,
      entropy_percent: 0,
      effort: 0
    };

    let currentUserData = JSON.parse(localStorage.getItem('currentUserData')!);

    if(!currentUserData)      
      this._router.navigate(['/users/auth']);
    
    this.user = currentUserData;
  }

  ngOnInit() {
    this.classroom_id = this._route.snapshot.paramMap.get('classroom_id')!;
    this.homework_id = this._route.snapshot.paramMap.get('homework_id')!;

    if(this.user.role == 0)
      this.getClassroomHomework();
    else {
      this._classroomHomeworkService.getClassroomHomework(this.classroom_id, this.homework_id).subscribe(response => {
        this.loading = false;

        if(response.hasOwnProperty('error')) {
          this._router.navigate(['/not-found']);
          return;
        }
        this.homework = <ClassroomHomework>response;

        let tmpMaps: SimulationMap[] = [];

        console.log(this.homework.maps)
        
        for(let map of this.homework.maps!) {
          tmpMaps = [
            ...tmpMaps, {
              _id: '',
              color_entropy: 0,
              color_entropy_percent: 0,
              color_effort: 0,
              edges_count: map.edges_count,
              entropy: map.entropy!,
              entropy_percent: map.entropy_percent!,
              effort: map.effort!,
              nodes_count: map.nodes_count,
              simulation_id: '',
              adjacency_matrix: map.adjacency_matrix,
              created_at: 0
            }
          ]
        }
        
        this.simulation = {
          name: '',
          maps_count: this.homework.maps!.length,
          node_min: this.homework.node_min,
          node_max: this.homework.node_max,
          maps: tmpMaps,
          is_public: true
        };


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

  public getClassroomHomework() {
    this.loading = true;
    this._classroomHomeworkService.getClassroomHomework(this.classroom_id, this.homework_id).subscribe(response => {
      if(!response.hasOwnProperty('error')) {
        this.homework = <ClassroomHomework>response;

        if(this.homework.student_map) {
          for(let node_label of this.homework.student_map.nodes_labels) {
            this.nodes = [...this.nodes, {
              id: 'node' + this.nodesCount.toString(),
              label: node_label
            }];
            this.nodesCount++;
          }

          for(let i = 0; i < this.homework.student_map.adjacency_matrix.length; i++) {
            for(let j = 0; j < this.homework.student_map.adjacency_matrix[i].length; j++) {
              if(this.homework.student_map.adjacency_matrix[i][j]) {
                this.links = [...this.links, {
                  id: 'link' + this.linksCount.toString(),
                  source: 'node' + i,
                  target: 'node' + j,
                  label: this.homework.student_map.adjacency_matrix_labels[i][j]
                }];
            
                this.linksCount++;
              }
            }
          }
        }
      } else 
        this._router.navigate(['/']);

      this.loading = false;
    });
  }

  public onSubmitNode() {
    if(this.nodes.length == this.homework.node_max)
      return this._alertService.error("You have reached the maximum amount of nodes.");

    this.nodes = [...this.nodes, {
      id: 'node' + this.nodesCount.toString(),
      label: this.nodeCreateForm.value.name!
    }];

    this.nodesCount++;
    this.nodeCreateForm.reset();

    this.isValidGraph = this.checkDAG();
  }

  public linkNodes() {
    this.links = [...this.links, {
      id: 'link' + this.linksCount.toString(),
      source: this.sourceLinkNodeId!,
      target:  this.targetLinkNodeId!,
      label: this.labelLink!
    }];

    this.linksCount++;
    this.sourceLinkNodeId = null;
    this.targetLinkNodeId = null;
    this.labelLink = null;

    this.isValidGraph = this.checkDAG();
  }

  public submitHomework() {
    /*homework_id: PyObjectId = Field(default_factory=PyObjectId)
    nodes_count: int 
    edges_count: int
    nodes_labels: List[str]
    adjacency_matrix: List[List[int]]
    adjacency_matrix_labels: List[List[str]]*/

    let nodes_labels: string[] = [];
    let links_labels: string[][] = Array.from(Array(this.nodes.length), _ => Array(this.nodes.length).fill(''));

    for(let link of this.links) {
      let i = parseInt(link.source.replace("node", ""));
      let j = parseInt(link.target.replace("node", ""));

      links_labels[i][j] = link.label!;
    }

    for(let node of this.nodes)
      nodes_labels.push(node.label!);

    let homework_map: ClassroomHomeworkMap = {
      homework_id: this.homework_id,
      nodes_count: this.nodes.length,
      edges_count: this.links.length,
      nodes_labels: nodes_labels,
      adjacency_matrix: this.adjacencyMatrix,
      adjacency_matrix_labels: links_labels
    };
    this._classroomHomeworkService.createClassroomHomeworkMap(this.classroom_id, this.homework_id, homework_map).subscribe(response => {
      console.log(response)
    });

  }

  public checkDAG() {
    if(this.nodes.length < this.homework.node_min)
      return false;

    this.adjacencyMatrix = Array.from(Array(this.nodes.length), _ => Array(this.nodes.length).fill(0));

    for(let link of this.links) {
      let i = parseInt(link.source.replace("node", ""));
      let j = parseInt(link.target.replace("node", ""));

      this.adjacencyMatrix[i][j] = 1;
    }

    if(!this.isConnected(this.adjacencyMatrix))
      return false;

    return this.isDAG(this.adjacencyMatrix);
  }

  public isDAG(adjacencyMatrix: number[][]): boolean {
    const n = adjacencyMatrix.length;
    const visited: boolean[] = Array(n).fill(false);
    const recursionStack: boolean[] = Array(n).fill(false);
  
    for (let node = 0; node < n; node++) {
      if (!visited[node] && this.isCyclic(node, visited, recursionStack, adjacencyMatrix)) {
        return false;
      }
    }
  
    return true;
  }
  
  public isCyclic(
    node: number,
    visited: boolean[],
    recursionStack: boolean[],
    adjacencyMatrix: number[][]
  ): boolean {
    visited[node] = true;
    recursionStack[node] = true;
  
    for (let neighbor = 0; neighbor < adjacencyMatrix[node].length; neighbor++) {
      if (adjacencyMatrix[node][neighbor] === 1) {
        if (!visited[neighbor] && this.isCyclic(neighbor, visited, recursionStack, adjacencyMatrix)) {
          return true;
        } else if (recursionStack[neighbor]) {
          return true;
        }
      }
    }
  
    recursionStack[node] = false;
    return false;
  }

  public isConnected(adjacencyMatrix: number[][]): boolean {
    const n = adjacencyMatrix.length;
    const visited: boolean[] = Array(n).fill(false);
    const stack: number[] = [];
  
    // Start with the first node
    stack.push(0);
    visited[0] = true;
  
    while (stack.length > 0) {
      const node = stack.pop()!;
  
      for (let neighbor = 0; neighbor < n; neighbor++) {
        if (adjacencyMatrix[node][neighbor] === 1 && !visited[neighbor]) {
          stack.push(neighbor);
          visited[neighbor] = true;
        }
      }
    }
  
    // Check if all nodes were visited
    return visited.every((value) => value);
  }
  

  public getDateLabel(timestamp: number) {
    const date = new Date(timestamp * 1000);

    return date.toLocaleDateString("en-GB", { // you can use undefined as first argument
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) + " - " + date.getHours() + ":" + date.getMinutes();
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

    /*myPlot.on('plotly_click', (data: any) => {
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
    });*/
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
    this.current_chart_type = chart_type;
    this.resetFilterForm(this.current_chart_type);
    this.renderScatterPlot(this.current_chart_type);
  }

  public downloadJson(){
    var sJson = JSON.stringify(this.simulation);
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    element.setAttribute('download', (this.simulation?.name) ? this.simulation?.name + '.json' : 'undefined.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
  }

}
