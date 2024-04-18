import { Component } from '@angular/core';
import { User } from 'src/app/user/models/User';
import { ClassroomHomework } from '../../models/ClassroomHomework';
import { ClassroomHomeworkMap } from '../../models/ClassroomHomeworkMap';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomHomeworkService } from '../../services/classroom-homework.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/alert/alert.service';
import * as Plotly from 'plotly.js-dist-min'
import { BsModalService } from 'ngx-bootstrap/modal';
import { ClassroomHomeworkMapViewComponent } from '../classroom-homework-map-view/classroom-homework-map-view.component';
import { Location } from '@angular/common';

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
  selector: 'app-classroom-homework-teacher-view',
  templateUrl: './classroom-homework-teacher-view.component.html',
  styles: [
  ]
})
export class ClassroomHomeworkTeacherViewComponent {
  public user!: User;
  public classroom_id!: string;
  public homework_id!: string;

  public loading: boolean;

  public homeworkFilterForm = new FormGroup({
    'node_min': new FormControl(0, Validators.required),
    'node_max': new FormControl(0, Validators.required),
    'edge_min': new FormControl(0, Validators.required),
    'edge_max': new FormControl(0, Validators.required),
    'param_min': new FormControl(0, Validators.required),
    'param_max': new FormControl(0, Validators.required),
  }, fieldsRangeValidator);

  public current_chart_type: CHART_TYPE;
  public homework: ClassroomHomework | null;

  public maxMapsValues: {
    nodes: number;
    edges: number;
    entropy: number;
    entropy_percent: number;
    effort: number;
  }

  public minMapsValues: {
    nodes: number;
    edges: number;
    entropy: number;
    entropy_percent: number;
    effort: number;
  }

  public currentMap: ClassroomHomeworkMap | null;


  constructor(private _route: ActivatedRoute, private _classroomHomeworkService: ClassroomHomeworkService, 
    private _router: Router, private _alertService: AlertService, private _modalService: BsModalService, 
    private _location: Location) {
    this.loading = false;

    this.homework = null;
    this.currentMap = null;
    this.current_chart_type = CHART_TYPE.Entropy;

    this.maxMapsValues = {
      nodes: 0,
      edges: 0,
      entropy: 0,
      entropy_percent: 0,
      effort: 0
    };

    this.minMapsValues = {
      nodes: 999999999,
      edges: 999999999,
      entropy: 999999999,
      entropy_percent: 999999999,
      effort: 999999999
    };

    let currentUserData = JSON.parse(localStorage.getItem('currentUserData')!);

    if(!currentUserData)      
      this._router.navigate(['/users/auth']);
    
    this.user = currentUserData;
  }

  ngOnInit() {
    this.classroom_id = this._route.snapshot.paramMap.get('classroom_id')!;
    this.homework_id = this._route.snapshot.paramMap.get('homework_id')!;

    this.getClassroomHomework();
  }

  public getClassroomHomework() {
    this._classroomHomeworkService.getClassroomHomework(this.classroom_id, this.homework_id).subscribe(response => {
      this.loading = false;

      if(response.hasOwnProperty('error')) {
        this._router.navigate(['/not-found']);
        return;
      }
      this.homework = <ClassroomHomework>response;
      let tmpMaps: ClassroomHomeworkMap[] = [];

      if(this.homework.maps && this.homework.maps.length > 0) {    
        for(let map of this.homework.maps) {
          if(map.nodes_count > this.maxMapsValues.nodes)
            this.maxMapsValues.nodes = map.nodes_count;

          if(map.edges_count > this.maxMapsValues.edges)
            this.maxMapsValues.edges = map.edges_count;

          if(map.entropy && map.entropy > this.maxMapsValues.entropy)
            this.maxMapsValues.entropy = map.entropy;

          if(map.entropy_percent && map.entropy_percent > this.maxMapsValues.entropy_percent)
            this.maxMapsValues.entropy_percent = map.entropy_percent;

          if(map.effort && map.effort > this.maxMapsValues.effort)
            this.maxMapsValues.effort = map.effort;

          if(map.nodes_count < this.minMapsValues.nodes)
            this.minMapsValues.nodes = map.nodes_count;

          if(map.edges_count < this.minMapsValues.edges)
            this.minMapsValues.edges = map.edges_count;

          if(map.entropy! < this.minMapsValues.entropy)
            this.minMapsValues.entropy = map.entropy!;

          if(map.entropy_percent! < this.minMapsValues.entropy_percent)
            this.minMapsValues.entropy_percent = map.entropy_percent!;

          if(map.effort! < this.minMapsValues.effort)
            this.minMapsValues.effort = map.effort!;
        }
        this.resetFilterForm(this.current_chart_type);

        let split_entropy = (this.maxMapsValues.entropy - this.minMapsValues.entropy) / 3
        let first_part_entropy = this.minMapsValues.entropy + split_entropy;
        let second_part_entropy = first_part_entropy + split_entropy;

        let split_entropy_percent = (this.maxMapsValues.entropy_percent - this.minMapsValues.entropy_percent) / 3
        let first_part_entropy_percent = this.minMapsValues.entropy_percent + split_entropy_percent;
        let second_part_entropy_percent = first_part_entropy_percent + split_entropy_percent;
      
        let split_effort = (this.maxMapsValues.effort - this.minMapsValues.effort) / 3
        let first_part_effort = this.minMapsValues.effort + split_effort;
        let second_part_effort = first_part_effort + split_effort;

        for(let map of this.homework.maps!) {
          let color_entropy = 0
          let color_entropy_percent = 0
          let color_effort = 0

          if(map.is_teacher_map) {
            color_entropy = 3;
            color_entropy_percent = 3;
            color_effort = 3;
          } else {
            if(map.entropy! > first_part_entropy && map.entropy! < second_part_entropy)
              color_entropy = 1
            else if(map.entropy! >= second_part_entropy)
              color_entropy = 2
        
            if(map.entropy_percent! > first_part_entropy_percent && map.entropy_percent! < second_part_entropy_percent)
              color_entropy_percent = 1
            else if(map.entropy_percent! >= second_part_entropy_percent)
              color_entropy_percent = 2
        
            if(map.effort! > first_part_effort && map.effort! < second_part_effort)
              color_effort = 1
            else if(map.effort! >= second_part_effort)
              color_effort = 2
          }

          tmpMaps = [
            ...tmpMaps, {
              _id: map._id,
              color_entropy: color_entropy,
              color_entropy_percent: color_entropy_percent,
              color_effort: color_effort,
              edges_count: map.edges_count,
              entropy: map.entropy!,
              entropy_percent: map.entropy_percent!,
              effort: map.effort!,
              nodes_count: map.nodes_count,
              homework_id: map.homework_id,
              adjacency_matrix: map.adjacency_matrix,
              created_at: map.created_at,
              nodes_labels: map.nodes_labels,
              adjacency_matrix_labels: map.adjacency_matrix_labels,
              author_name: map.author_name,
              is_teacher_map: map.is_teacher_map,
              map_name: map.map_name,
              display_name: "<b>Nodes Count:</b> " + map.nodes_count +
                            "<br><b>Edges Count:</b> " + map.edges_count +
                            "<br><br><b>Entropy:</b> " + map.entropy +
                            "<br><b>Entropy Percent:</b> " + map.entropy_percent + "%" +
                            "<br><b>Effort:</b> " + map.effort +
                            "<br><br><b>Map Name:</b> " + map.map_name + 
                            "<br><b>Author:</b> " + map.author_name + 
                            "<br><b>Created At:</b> " + this.dateTransform(map.created_at!)
            }
          ]
        }
      } else {
        this._location.back();
        this._alertService.error("Homework has no submitted maps.");
        return;
      }
      
      this.homework = {
        classroom_id: this.homework.classroom_id,
        title: this.homework.title,
        node_min: this.homework.node_min,
        node_max: this.homework.node_max,
        maps: tmpMaps,
        body: this.homework.body,
        start_datetime: this.homework.start_datetime,
        expire_datetime: this.homework.expire_datetime
      };
      this.renderScatterPlot(this.current_chart_type);
    })
  }

  public unpack(rows: any, key: any) {
    return rows.map(function(row: any)
    { return row[key]; });}
  

  public resetFilterForm(chart_type: CHART_TYPE) {
    this.homeworkFilterForm.get('node_min')!.setValidators([Validators.min(this.minMapsValues.nodes), Validators.required]);
    this.homeworkFilterForm.patchValue({
      node_min: this.minMapsValues.nodes
    })
    this.homeworkFilterForm.get('node_min')!.updateValueAndValidity();

    this.homeworkFilterForm.get('edge_min')!.setValidators([Validators.min(this.minMapsValues.edges), Validators.required]);
    this.homeworkFilterForm.patchValue({
      edge_min: this.minMapsValues.edges
    })
    this.homeworkFilterForm.get('edge_min')!.updateValueAndValidity();

    if(chart_type == CHART_TYPE.Entropy) {
      this.homeworkFilterForm.get('param_min')!.setValidators([Validators.min(this.minMapsValues.entropy), Validators.required]);
      this.homeworkFilterForm.patchValue({
        param_min: parseFloat(this.minMapsValues.entropy.toFixed(2))
      })
      this.homeworkFilterForm.get('param_min')!.updateValueAndValidity();

      this.homeworkFilterForm.get('param_max')!.setValidators([Validators.max(this.maxMapsValues.entropy), Validators.required]);
      this.homeworkFilterForm.patchValue({
        param_max: parseFloat(this.maxMapsValues.entropy.toFixed(2))
      })
      this.homeworkFilterForm.get('param_max')!.updateValueAndValidity();
    }

    else if(chart_type == CHART_TYPE.EntropyPercent) {
      this.homeworkFilterForm.get('param_min')!.setValidators([Validators.min(this.minMapsValues.entropy_percent), Validators.required]);
      this.homeworkFilterForm.patchValue({
        param_min: parseFloat(this.minMapsValues.entropy_percent.toFixed(2))
      })
      this.homeworkFilterForm.get('param_min')!.updateValueAndValidity();

      this.homeworkFilterForm.get('param_max')!.setValidators([Validators.max(this.maxMapsValues.entropy_percent), Validators.required]);
      this.homeworkFilterForm.patchValue({
        param_max: parseFloat(this.maxMapsValues.entropy_percent.toFixed(2))
      })
      this.homeworkFilterForm.get('param_max')!.updateValueAndValidity();
    }

    else if(chart_type == CHART_TYPE.Effort) {
      this.homeworkFilterForm.get('param_min')!.setValidators([Validators.min(this.minMapsValues.effort), Validators.required]);
      this.homeworkFilterForm.patchValue({
        param_min: parseFloat(this.minMapsValues.effort.toFixed(2))
      })
      this.homeworkFilterForm.get('param_min')!.updateValueAndValidity();

      this.homeworkFilterForm.get('param_max')!.setValidators([Validators.max(this.maxMapsValues.effort), Validators.required]);
      this.homeworkFilterForm.patchValue({
        param_max: parseFloat(this.maxMapsValues.effort.toFixed(2))
      })
      this.homeworkFilterForm.get('param_max')!.updateValueAndValidity();
    }

    this.homeworkFilterForm.get('node_max')!.setValidators([Validators.max(this.maxMapsValues.nodes), Validators.required]);
    this.homeworkFilterForm.patchValue({
      node_max: this.maxMapsValues.nodes
    })
    this.homeworkFilterForm.get('node_max')!.updateValueAndValidity();

    this.homeworkFilterForm.get('edge_max')!.setValidators([Validators.max(this.maxMapsValues.edges), Validators.required]);
    this.homeworkFilterForm.patchValue({
      edge_max: this.maxMapsValues.edges
    })
    this.homeworkFilterForm.get('edge_max')!.updateValueAndValidity();
  }

  
  public getCoordsDatum(chart_type: CHART_TYPE, trace: number) {
    let x = this.unpack(this.homework!.maps!.filter(map => 
      map.color_entropy == trace && 
      map.nodes_count >= this.homeworkFilterForm.value.node_min! && map.nodes_count <= this.homeworkFilterForm.value.node_max! &&
      map.edges_count >= this.homeworkFilterForm.value.edge_min! && map.edges_count <= this.homeworkFilterForm.value.edge_max! &&
      map.entropy! >= this.homeworkFilterForm.value.param_min! && map.entropy! <= this.homeworkFilterForm.value.param_max!
    ), 'nodes_count');

    let y = this.unpack(this.homework!.maps!.filter(map => 
      map.color_entropy == trace && 
      map.nodes_count >= this.homeworkFilterForm.value.node_min! && map.nodes_count <= this.homeworkFilterForm.value.node_max! &&
      map.edges_count >= this.homeworkFilterForm.value.edge_min! && map.edges_count <= this.homeworkFilterForm.value.edge_max! &&
      map.entropy! >= this.homeworkFilterForm.value.param_min! && map.entropy! <= this.homeworkFilterForm.value.param_max!
    ), 'edges_count');

    let z = this.unpack(this.homework!.maps!.filter(map => 
      map.color_entropy == trace && 
      map.nodes_count >= this.homeworkFilterForm.value.node_min! && map.nodes_count <= this.homeworkFilterForm.value.node_max! &&
      map.edges_count >= this.homeworkFilterForm.value.edge_min! && map.edges_count <= this.homeworkFilterForm.value.edge_max! &&
      map.entropy! >= this.homeworkFilterForm.value.param_min! && map.entropy! <= this.homeworkFilterForm.value.param_max!
    ), 'entropy');

    let displayName = this.unpack(this.homework!.maps!.filter(map => 
      map.color_entropy == trace && 
      map.nodes_count >= this.homeworkFilterForm.value.node_min! && map.nodes_count <= this.homeworkFilterForm.value.node_max! &&
      map.edges_count >= this.homeworkFilterForm.value.edge_min! && map.edges_count <= this.homeworkFilterForm.value.edge_max! &&
      map.entropy! >= this.homeworkFilterForm.value.param_min! && map.entropy! <= this.homeworkFilterForm.value.param_max!
    ), 'display_name');

    if(chart_type == CHART_TYPE.EntropyPercent) {
      x = this.unpack(this.homework!.maps!.filter(map => 
        map.color_entropy_percent == trace &&
        map.nodes_count >= this.homeworkFilterForm.value.node_min! && map.nodes_count <= this.homeworkFilterForm.value.node_max! &&
        map.edges_count >= this.homeworkFilterForm.value.edge_min! && map.edges_count <= this.homeworkFilterForm.value.edge_max! &&
        map.entropy_percent! >= this.homeworkFilterForm.value.param_min! && map.entropy_percent! <= this.homeworkFilterForm.value.param_max!
      ), 'nodes_count');

      y = this.unpack(this.homework!.maps!.filter(map => 
        map.color_entropy_percent == trace &&
        map.nodes_count >= this.homeworkFilterForm.value.node_min! && map.nodes_count <= this.homeworkFilterForm.value.node_max! &&
        map.edges_count >= this.homeworkFilterForm.value.edge_min! && map.edges_count <= this.homeworkFilterForm.value.edge_max! &&
        map.entropy_percent! >= this.homeworkFilterForm.value.param_min! && map.entropy_percent! <= this.homeworkFilterForm.value.param_max!
      ), 'edges_count');

      z = this.unpack(this.homework!.maps!.filter(map => 
        map.color_entropy_percent == trace &&
        map.nodes_count >= this.homeworkFilterForm.value.node_min! && map.nodes_count <= this.homeworkFilterForm.value.node_max! &&
        map.edges_count >= this.homeworkFilterForm.value.edge_min! && map.edges_count <= this.homeworkFilterForm.value.edge_max! &&
        map.entropy_percent! >= this.homeworkFilterForm.value.param_min! && map.entropy_percent! <= this.homeworkFilterForm.value.param_max!
      ), 'entropy_percent');

      displayName = this.unpack(this.homework!.maps!.filter(map => 
        map.color_entropy_percent == trace &&
        map.nodes_count >= this.homeworkFilterForm.value.node_min! && map.nodes_count <= this.homeworkFilterForm.value.node_max! &&
        map.edges_count >= this.homeworkFilterForm.value.edge_min! && map.edges_count <= this.homeworkFilterForm.value.edge_max! &&
        map.entropy_percent! >= this.homeworkFilterForm.value.param_min! && map.entropy_percent! <= this.homeworkFilterForm.value.param_max!
      ), 'display_name');
    }
    else if(chart_type == CHART_TYPE.Effort) {
      x = this.unpack(this.homework!.maps!.filter(map => 
        map.color_effort == trace &&
        map.nodes_count >= this.homeworkFilterForm.value.node_min! && map.nodes_count <= this.homeworkFilterForm.value.node_max! &&
        map.edges_count >= this.homeworkFilterForm.value.edge_min! && map.edges_count <= this.homeworkFilterForm.value.edge_max! &&
        map.effort! >= this.homeworkFilterForm.value.param_min! && map.effort! <= this.homeworkFilterForm.value.param_max!
      ), 'nodes_count');

      y = this.unpack(this.homework!.maps!.filter(map => 
        map.color_effort == trace &&
        map.nodes_count >= this.homeworkFilterForm.value.node_min! && map.nodes_count <= this.homeworkFilterForm.value.node_max! &&
        map.edges_count >= this.homeworkFilterForm.value.edge_min! && map.edges_count <= this.homeworkFilterForm.value.edge_max! &&
        map.effort! >= this.homeworkFilterForm.value.param_min! && map.effort! <= this.homeworkFilterForm.value.param_max!
      ), 'edges_count');

      z = this.unpack(this.homework!.maps!.filter(map => 
        map.color_effort == trace &&
        map.nodes_count >= this.homeworkFilterForm.value.node_min! && map.nodes_count <= this.homeworkFilterForm.value.node_max! &&
        map.edges_count >= this.homeworkFilterForm.value.edge_min! && map.edges_count <= this.homeworkFilterForm.value.edge_max! &&
        map.effort! >= this.homeworkFilterForm.value.param_min! && map.effort! <= this.homeworkFilterForm.value.param_max!
      ), 'effort');

      displayName = this.unpack(this.homework!.maps!.filter(map => 
        map.color_effort == trace &&
        map.nodes_count >= this.homeworkFilterForm.value.node_min! && map.nodes_count <= this.homeworkFilterForm.value.node_max! &&
        map.edges_count >= this.homeworkFilterForm.value.edge_min! && map.edges_count <= this.homeworkFilterForm.value.edge_max! &&
        map.effort! >= this.homeworkFilterForm.value.param_min! && map.effort! <= this.homeworkFilterForm.value.param_max!
      ), 'display_name');
    }
    return [x, y, z, displayName]
  }

  public dateTransform(timestamp: number): string {
    const date = new Date(timestamp * 1000);

    return date.toLocaleDateString("en-GB", { // you can use undefined as first argument
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) + " - " + String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
  }

  public renderScatterPlot(chart_type: CHART_TYPE): void {
    Plotly.purge('container');

    const colors = ['rgba(168, 50, 50, 0.95)', 'rgba(161, 158, 157, 0.95)', 'rgba(86, 199, 30, 0.95)', 'rgba(51, 102, 255, 0.95)'];

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
        opacity: 0.6
      },
      type: 'scatter3d',
      text: this.getCoordsDatum(chart_type, 0)[3],
      hoverinfo: 'text', 
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
        opacity: 0.6
      },
      type: 'scatter3d',
      text: this.getCoordsDatum(chart_type, 1)[3],
      hoverinfo: 'text', 
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
        opacity: 0.6
      },
      type: 'scatter3d',
      text: this.getCoordsDatum(chart_type, 2)[3],
      hoverinfo: 'text', 
    };

    console.log(this.getCoordsDatum(chart_type, 3)[0])

    let teacherTrace: Partial<Plotly.PlotData> = {
      x: this.getCoordsDatum(chart_type, 3)[0],
      y: this.getCoordsDatum(chart_type, 3)[1],
      z: this.getCoordsDatum(chart_type, 3)[2],
      mode: 'markers',
      marker: {
        size: 5,
        line: {
          color: colors[3],
          width: 0.5
        },
        opacity: 0.6
      },
      name: 'teacher maps',
      type: 'scatter3d',
      text: this.getCoordsDatum(chart_type, 3)[3],
      hoverinfo: 'text', 
    };


    let traces = [firstTrace, secondTrace, thirdTrace, teacherTrace];
  
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
        this.currentMap = this.homework?.maps?.filter(map => data.points[0].x == map.nodes_count &&
          data.points[0].y == map.edges_count && 
          data.points[0].z == map.entropy)[0]!;
      else if(this.current_chart_type == CHART_TYPE.EntropyPercent)
        this.currentMap = this.homework?.maps?.filter(map => data.points[0].x == map.nodes_count &&
          data.points[0].y == map.edges_count && 
          data.points[0].z == map.entropy_percent)[0]!;
      else if(this.current_chart_type == CHART_TYPE.Effort)
          this.currentMap = this.homework?.maps?.filter(map => data.points[0].x == map.nodes_count &&
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

  public getChartTypeValue(map: ClassroomHomeworkMap, chart_type: CHART_TYPE): string {
    switch(chart_type) {
      case CHART_TYPE.Entropy: return map.entropy!.toFixed(2);
      case CHART_TYPE.EntropyPercent: return map.entropy_percent!.toFixed(2);
      case CHART_TYPE.Effort: return map.effort!.toFixed(2);
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
    var sJson = JSON.stringify(this.homework?.maps);
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    element.setAttribute('download', (this.homework?.title) ? this.homework?.title + '_maps.json' : 'undefined.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); 
    document.body.removeChild(element);
  }

  public showCurrentMap() {
    const initialState = {
      map: this.currentMap!,
      isModal: true
    };

    this._modalService.show(ClassroomHomeworkMapViewComponent, { id: 'ClassroomHomeworkMapViewComponent', class: 'modal-lg', initialState });
  }

}
