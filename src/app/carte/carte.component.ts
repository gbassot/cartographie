import { Component, OnInit } from '@angular/core';
import {Server} from '../models/server.model';
import {Link} from '../models/link.model';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css']
})
export class CarteComponent implements OnInit {

  public servers: Server[];
  public links: Link[];
  constructor() { }

  ngOnInit(): void {
    const japi: Server = {
      id: 1,
      name: 'JAPI',
      coordinates: {
        x: 500,
        y: 300,
      }
    };
    const jwebshopBack: Server = {
      id: 2,
      name: 'Webshop Symfony',
      coordinates: {
        x: 200,
        y: 100,
      }
    };
    const jwebshopFront: Server = {
      id: 2,
      name: 'Webshop Front',
      coordinates: {
        x: 400,
        y: 0,
      }
    };
    const jac: Server = {
      id: 3,
      name: 'Jac2web',
      coordinates: {
        x: 700,
        y: 200,
      }
    };
    const jedi: Server = {
      id: 4,
      name: 'Jedi',
      coordinates: {
        x: 300,
        y: 600,
      }
    };
    const jpdf: Server = {
      id: 5,
      name: 'JPDF',
      coordinates: {
        x: 700,
        y: 500,
      }
    };
    this.servers = [japi, jwebshopBack, jwebshopFront, jac, jedi, jpdf];
    this.links = [
      { id: 1, between: [japi, jwebshopBack]},
      { id: 2, between: [japi, jac]},
      { id: 3, between: [japi, jedi]},
      { id: 4, between: [japi, jpdf]},
      { id: 5, between: [jwebshopFront, jwebshopBack]},
      { id: 5, between: [jwebshopFront, japi]},
    ];
  }
}
