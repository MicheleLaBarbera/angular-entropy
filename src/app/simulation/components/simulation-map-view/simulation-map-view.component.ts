import { Component, Input } from '@angular/core';
import { SimulationMap } from '../../models/SimulationMap';

import * as d3 from 'd3';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-simulation-map-view',
  templateUrl: './simulation-map-view.component.html',
  styles: [
  ]
})
export class SimulationMapViewComponent {
  public map!: SimulationMap;

  constructor(private _modalService: BsModalService) {

  }

  ngOnInit() {
    this.drawMap(this.map);
  }
  
  public drawMap(map: SimulationMap) {
    if(!map)
      return;

    const nodeHorizontalSpace = 30;
    const nodeVerticalSpace = 40;

    const width = window.innerWidth / 4;
    const heigth = 450;

    d3.selectAll("svg").remove() 

    let svg = d3.select('#map').append('svg').attr('viewBox', [0, 0, width, heigth]);

    let currentNode: any = 0;
    let visitedNodes: any[] = [];

    let cx = width / 2;
    let cy = 20;

    let nodeRadius = 5;

    let root = svg
      .append('circle')
      .attr('id', "node0")
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', nodeRadius)
      .style('fill', 'green')
  
    let queue = [0];
    let insertedNodes = [0];

    while(queue.length > 0) {
      currentNode = queue[0];

      queue.shift()

      cx = parseInt(d3.select("#node" + currentNode).attr("cx"));
      cy = parseInt(d3.select("#node" + currentNode).attr("cy"));

      let nextNodes = [];
      let sonsLen;
      
      for(let j = 0; j < map!.adjacency_matrix[currentNode].length; j++) {
        if(map!.adjacency_matrix[currentNode][j] == 1) {
          nextNodes.push(j);
          if(!visitedNodes.includes(j) && !queue.includes(j)) {
            queue.push(j)
          }
        }
      }


      let calc = cx - ((nextNodes.length / 2) * nodeHorizontalSpace);
      let startPos = (nextNodes.length != 1) ? calc : cx;
      let count = 0;

      sonsLen = nextNodes.length;

      while(nextNodes.length) {
        if(insertedNodes.includes(nextNodes[0])) {
        
          let fatherX = parseInt(d3.select("#node"+currentNode).attr('cx'));
          let fatherY = parseInt(d3.select("#node"+currentNode).attr('cy'));

          let sonX = parseInt(d3.select("#node"+nextNodes[0]).attr('cx'));
          let sonY = parseInt(d3.select("#node"+nextNodes[0]).attr('cy'));

          if(fatherX < sonX) {
            fatherX += nodeRadius;
            sonX -= nodeRadius
          } else {
            fatherX -= nodeRadius;
            sonX += nodeRadius
          }

          const link = d3.linkHorizontal()({
            source: [fatherX, fatherY],
            target: [sonX, sonY],
          });

          svg
            .append('path')
            .attr('d', link)
            .attr('stroke', 'black')
            .attr('marker-end', 'url(#arrow)')
            .attr('fill', 'none');
        } else {
          if(startPos == cx && sonsLen > 1) {
            startPos += nodeHorizontalSpace;
          }
          let son = svg
          .append('circle')
          .attr('id', "node" + nextNodes[0])
          .attr('cx', startPos)
          .attr('cy', cy + nodeVerticalSpace + Math.floor(Math.random() * 15) + Math.floor(Math.random() * 15) + Math.floor(Math.random() * 15))
          .attr('r', nodeRadius)
          .style('fill', 'green');

          let fatherX = parseInt(d3.select("#node"+currentNode).attr('cx'));
          let fatherY = parseInt(d3.select("#node"+currentNode).attr('cy')) + nodeRadius;

          let sonX = parseInt(d3.select("#node"+nextNodes[0]).attr('cx'));
          let sonY = parseInt(d3.select("#node"+nextNodes[0]).attr('cy')) - nodeRadius;

          const link = d3.linkVertical()({
            source: [fatherX, fatherY],
            target: [sonX, sonY]
          });

          svg.append("svg:defs").selectAll("marker")
            .data(["arrow"])      // Different link/path types can be defined here
          .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 9)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("orient", "auto")
          .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");
          
          // Append the link to the svg element
          svg
            .append('path')
            .attr('d', link)
            .attr('stroke', 'black')
            .attr('marker-end', 'url(#arrow)')
            .attr('fill', 'none');

          count++;
          startPos += nodeHorizontalSpace;
          insertedNodes.push(nextNodes[0])
        }
        nextNodes.shift();
      }
      visitedNodes.push(currentNode);
    }
    svg.attr('viewBox', [0, 0, width, heigth]);
  }

  public hideModal(): void {
    this._modalService.hide('SimulationMapViewComponent');
  }
}
