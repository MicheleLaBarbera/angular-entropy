import { Component } from '@angular/core';
import { User } from 'src/app/user/models/User';
import { ClassroomHomework } from '../../models/ClassroomHomework';
import { ClassroomHomeworkMap } from '../../models/ClassroomHomeworkMap';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomHomeworkService } from '../../services/classroom-homework.service';
import { DagreSettings, Edge, Orientation, Node } from '@swimlane/ngx-graph';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/alert/alert.service';

@Component({
  selector: 'app-classroom-homework-map-create',
  templateUrl: './classroom-homework-map-create.component.html',
  styles: [
  ]
})
export class ClassroomHomeworkMapCreateComponent {
  public user!: User;
  public classroom_id!: string;
  public homework_id!: string;
  public homework!: ClassroomHomework;

  public loading: boolean;

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

  constructor(private _route: ActivatedRoute, private _classroomHomeworkService: ClassroomHomeworkService, private _router: Router, private _alertService: AlertService) {
    this.loading = false;
    this.nodesCount = 0;
    this.linksCount = 0;
    this.nodes = [];
    this.links = [];
    this.sourceLinkNodeId = null;
    this.targetLinkNodeId = null;
    this.labelLink = null;
    this.isValidGraph = false;

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
      if(!response.hasOwnProperty('error')) {
        window.location.reload();
        this._alertService.success("Homework submitted.");
      }
    });

  }

  checkDAG(): boolean {
    // Minimum number of nodes check
    if (this.nodes.length < this.homework.node_min) {
      return false;
    }

    // Initialize adjacency matrix with zeros
    this.adjacencyMatrix = Array.from(Array(this.nodes.length), () => Array(this.nodes.length).fill(0));

    // Fill adjacency matrix with connections from links
    for (const link of this.links) {
      const i = parseInt(link.source.replace("node", ""));
      const j = parseInt(link.target.replace("node", ""));
      this.adjacencyMatrix[i][j] = 1;
    }

    // Check if the graph is connected (optional)
    // You might want to comment out this line if not needed
    if (!this.isConnected(this.adjacencyMatrix)) {
      console.log("Graph is not connected")
      return false;
    }

    // Check if the graph is a DAG (Directed Acyclic Graph)
    return this.isDAG(this.adjacencyMatrix);
  }

  isDAG(adjacencyMatrix: number[][]): boolean {
    const n = adjacencyMatrix.length;
    const visited: boolean[] = Array(n).fill(false);
    const recursionStack: boolean[] = Array(n).fill(false); // Track nodes in the current DFS path

    for (let node = 0; node < n; node++) {
      if (!visited[node] && this.isCyclic(node, visited, recursionStack, adjacencyMatrix)) {
        console.log("Cycle detected")
        return false; // Cycle detected
      }
    }
    console.log("No cycle found")
    return true; // No cycles found
  }

  isCyclic(node: number, visited: boolean[], recursionStack: boolean[], adjacencyMatrix: number[][]): boolean {
    visited[node] = true;
    recursionStack[node] = true; // Mark node as part of the current DFS path

    for (let neighbor = 0; neighbor < adjacencyMatrix[node].length; neighbor++) {
      if (adjacencyMatrix[node][neighbor] === 1) {
        if (!visited[neighbor]) {
          if (this.isCyclic(neighbor, visited, recursionStack, adjacencyMatrix)) {
            return true; // Cycle found in a deeper recursion
          }
        } else if (recursionStack[neighbor]) {
          return true; // Back edge detected (cycle)
        }
      }
    }

    recursionStack[node] = false; // Remove node from the current DFS path
    return false; // No cycle found in this branch
  }

  isConnected(adjacencyMatrix: number[][]): boolean {
    const n = adjacencyMatrix.length;
    const visited: boolean[] = Array(n).fill(false);
    let connectedComponents = 0; // Track the number of connected components found
  
    for (let node = 0; node < n; node++) {
      if (!visited[node]) {
        connectedComponents++; // Start of a new connected component
        const queue: number[] = [];
        queue.push(node);
        visited[node] = true;
  
        while (queue.length > 0) {
          const currentNode = queue.shift()!;
  
          for (let neighbor = 0; neighbor < n; neighbor++) {
            if (adjacencyMatrix[currentNode][neighbor] === 1 && !visited[neighbor]) {
              queue.push(neighbor);
              visited[neighbor] = true;
            }
          }
        }
      }
    }
  
    // Check if all nodes are reachable from at least one starting point
    return connectedComponents === n;
  }
}
