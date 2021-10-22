import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ElementCoordinates} from '../models/mapping.model';
import { DIST } from '../constants/constants';
import { Link } from '../models/documentation.model';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit, OnChanges  {

  @Input() link: Link;

  public origin: ElementCoordinates;
  public diagonale: string;
  public width: number;
  public height: number;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
    this.origin = this.getOrigin(this.link.between[0], this.link.between[1]);
    this.width = Math.abs(this.link.between[1].coordinates.x - this.link.between[0].coordinates.x) + 20;
    this.height = Math.abs(this.link.between[1].coordinates.y - this.link.between[0].coordinates.y) + 20;
  }

  getOrigin(element1, element2): ElementCoordinates {
    return {
      x: (element1.coordinates.x < element2.coordinates.x ? element1.coordinates.x : element2.coordinates.x) + 50 - 10,
      y: (element1.coordinates.y < element2.coordinates.y ? element1.coordinates.y : element2.coordinates.y) + 50 - 10
    };
  }

  getDiagonale(element1, element2): string {
    if (element1.coordinates.x === element2.coordinates.x) {
      return 'hb';
    }
    if (element1.coordinates.y === element2.coordinates.y) {
      return 'gd';
    }
    
    if (
      (element1.coordinates.x < element2.coordinates.x && element1.coordinates.y < element2.coordinates.y) ||
      (element2.coordinates.x < element1.coordinates.x && element2.coordinates.y < element1.coordinates.y)
    ){
      if (Math.abs(element1.coordinates.x - element2.coordinates.x) > Math.abs(element1.coordinates.y - element2.coordinates.y)) {
        return 'ghdb';
      } else {
        return 'hgbd';
      }
    } else {
      if (Math.abs(element1.coordinates.x - element2.coordinates.x) > Math.abs(element1.coordinates.y - element2.coordinates.y)) {
        return 'gbdh';
      } else {
        return 'bghd';
      }
    }
  }

  getPathLink(offset): string {

    const vector = DIST/2.5;
    switch (this.getDiagonale(this.link.between[0], this.link.between[1])) {
      case 'hb':
        return 'M'+(10+offset)+' 0 L '+(this.width-10+offset)+' '+this.height;
      case 'gd':
          return 'M0 '+(10+offset)+' L '+(this.width)+' '+(this.height-10+offset);
      case 'ghdb':
        return 'M0 '+(offset+30)+', C'+(vector-offset)+' '+offset+',' + (this.width / 2 -offset) + ' ' + (this.height / 2) + 
        ', ' + (this.width / 2 - offset) + ' ' + (this.height / 2 ) +
          ' S ' + (this.width - vector - offset) + ' ' + (this.height+offset) + ', ' + this.width + ' ' + (this.height+offset-30);
      case 'hgbd':
        return 'M'+(offset+30)+' 0, C'+offset+' '+(vector-offset)+',' + this.width / 2 + ' ' + (this.height / 2 - offset) + 
        ', ' + this.width / 2 + ' ' + (this.height / 2 - offset) +
          ' S ' + (this.width + offset) + ' ' + (this.height - vector - offset) + ', ' + (this.width + offset - 30) + ' ' + (this.height);
      case 'gbdh':
        return 'M0 ' + (this.height + offset - 30) + ', C'+(vector+offset)+' ' + (this.height+offset) + ',' +  (this.width / 2 +offset) + ' ' + this.height / 2 + 
        ', ' + (this.width / 2 +offset) + ' ' + this.height / 2 +
          ' S ' + (this.width - vector + offset) + ' '+offset+', ' + this.width + ' '+(offset+30);
      case 'bghd':
        return 'M'+(offset+30)+' ' + this.height + ', C'+offset+' ' + (this.height - vector + offset) + ',' + this.width / 2 + ' ' + (this.height / 2 + offset) + 
        ', ' + this.width / 2 + ' ' + (this.height / 2 + offset) +
          ' S ' + (this.width + offset) + ' '+(vector + offset)+', ' + (this.width + offset -30) + ' 0';
      default:
        return '';
    }
  }
}
