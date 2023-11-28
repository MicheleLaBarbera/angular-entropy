import { Component } from '@angular/core';
import { DagreSettings, Node, Edge, Orientation } from '@swimlane/ngx-graph';
import { ClassroomHomeworkMap } from '../../models/ClassroomHomeworkMap';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-classroom-homework-map-view',
  templateUrl: './classroom-homework-map-view.component.html',
  styles: [
  ]
})
export class ClassroomHomeworkMapViewComponent {
  public map!: ClassroomHomeworkMap;
  public isModal: boolean;

  public nodesCount: number;
  public linksCount: number;

  public layoutSettings: DagreSettings = {
    orientation: Orientation.TOP_TO_BOTTOM
  }

  public nodes: Node[];
  public links: Edge[];

  constructor(private _modalService: BsModalService) {
    this.nodesCount = 0;
    this.linksCount = 0;

    this.nodes = [];
    this.links = [];

    this.isModal = false;
  }

  ngOnInit() {
    for(let node_label of this.map.nodes_labels) {
      this.nodes = [...this.nodes, {
        id: 'node' + this.nodesCount.toString(),
        label: node_label
      }];
      this.nodesCount++;
    }

    for(let i = 0; i < this.map.adjacency_matrix.length; i++) {
      for(let j = 0; j < this.map.adjacency_matrix[i].length; j++) {
        if(this.map.adjacency_matrix[i][j]) {
          this.links = [...this.links, {
            id: 'link' + this.linksCount.toString(),
            source: 'node' + i,
            target: 'node' + j,
            label: this.map.adjacency_matrix_labels[i][j]
          }];
      
          this.linksCount++;
        }
      }
    }
  }

  public hideModal(): void {
    this._modalService.hide('ClassroomHomeworkMapViewComponent');
  }
}
