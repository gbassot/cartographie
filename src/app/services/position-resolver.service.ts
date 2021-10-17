import { Injectable } from '@angular/core';
import { DIST } from '../constants/constants';
import { Link, Server } from '../models/documentation.model';

@Injectable({
  providedIn: 'root',
})
export class PositionResolverService {

  constructor() { }

  static positionResolver(elements: Server[], links: Link[]): Server[] {
      elements = JSON.parse(JSON.stringify(elements));
    const sortedServers = elements.sort((a,b) => {
      return links.filter((link)=>link.between.find((server)=>server.name===b.name)).length - links.filter((link)=>link.between.find((server)=>server.name===a.name)).length
    });

    sortedServers.forEach((element) => element.coordinates={x:0,y:0});
    //premier element au centre
    sortedServers[0].coordinates = {x:500, y:500};
    this.placeNeighbors(sortedServers[0], elements, links);
    this.slideToZero(sortedServers);
    return sortedServers;
  }

  static placeNeighbors(center: Server, servers: Server[], links: Link[]) {
    const neighbors = servers.filter((server)=>
      (
        server.name!==center.name && 
        server.coordinates.x === 0 &&
        links.find((link)=>
          (
            link.between.find((s)=>(s.name===server.name)) && link.between.find((s)=>(s.name===center.name))
          )
        )
      )
    );
    let angle = Math.PI*2/neighbors.length;
    let angleOffset = 0;
    if(center.neighbors) {
      angle = Math.PI*2/(neighbors.length+center.neighbors.length);
      angleOffset = center.neighbors[0].angle;
    }    
    
    neighbors.forEach((element, index) => {
      if(!center.neighbors) {
        center.neighbors=[];
      }
      center.neighbors.push( { server:element, angle: angle*(index+1)});
      if(!element.neighbors) {
        element.neighbors = [];
      }
      element.neighbors.push({ server:center, angle: angle*(index+1)-Math.PI});
      element.coordinates = {
        x: Math.round(center.coordinates.x + Math.cos(angle*(index+1)+angleOffset)*DIST), 
        y: Math.round(center.coordinates.y + Math.sin(angle*(index+1)+angleOffset)*DIST)
      }
    });
    neighbors.forEach((element)=>this.placeNeighbors(element, servers, links));
  }

  static slideToZero(elements: Server[]): void {
    const minX = elements.sort((a,b) => a.coordinates.x - b.coordinates.x);
    const offsetX = minX[0].coordinates.x-10;
    const minY = elements.sort((a,b) => a.coordinates.y - b.coordinates.y);
    const offsetY = minY[0].coordinates.y-10;
    elements.forEach((element)=>{
      element.coordinates.x -= offsetX;
      element.coordinates.y -= offsetY;
    })
  }

}

