import {Component, Input, OnInit} from '@angular/core';
import {Link} from '../models/link.model';
import {ElementCoordinates} from '../models/element-coordinates.model';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit  {

  @Input() link: Link;

  public origin: ElementCoordinates;
  public diagonale: string;
  public width: number;
  public height: number;

  constructor() { }

  ngOnInit(): void {
    console.log(this.link);
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
    switch (this.getDiagonale(this.link.between[0], this.link.between[1])) {
      case 'ghdb':
        return 'M0 '+(offset+30)+', C'+(150-offset)+' '+offset+',' + (this.width / 2 -offset) + ' ' + (this.height / 2) + ', ' + (this.width / 2 - offset) + ' ' + (this.height / 2 ) +
          ' S ' + (this.width - 150 - offset) + ' ' + (this.height+offset) + ', ' + this.width + ' ' + (this.height+offset-30);
      case 'hgbd':
        return 'M'+(offset+30)+' 0, C'+offset+' '+(150-offset)+',' + this.width / 2 + ' ' + (this.height / 2 - offset) + ', ' + this.width / 2 + ' ' + (this.height / 2 - offset) +
          ' S ' + (this.width + offset) + ' ' + (this.height - 150 - offset) + ', ' + (this.width + offset - 30) + ' ' + (this.height);
      case 'gbdh':
        return 'M0 ' + (this.height + offset - 30) + ', C'+(150+offset)+' ' + (this.height+offset) + ',' +  (this.width / 2 +offset) + ' ' + this.height / 2 + ', ' + (this.width / 2 +offset) + ' ' + this.height / 2 +
          ' S ' + (this.width - 150 + offset) + ' '+offset+', ' + this.width + ' '+(offset+30);
      case 'bghd':
        return 'M'+(offset+30)+' ' + this.height + ', C'+offset+' ' + (this.height - 150 + offset) + ',' + this.width / 2 + ' ' + (this.height / 2 + offset) + ', ' + this.width / 2 + ' ' + (this.height / 2 + offset) +
          ' S ' + (this.width + offset) + ' '+(150 + offset)+', ' + (this.width + offset -30) + ' 0';
      default:
        return '';
    }
  }
}
