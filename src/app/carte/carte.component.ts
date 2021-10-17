import { Component, OnInit } from '@angular/core';
import {Link, Scenario, Server} from '../models/documentation.model';
import { combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { decrement, increment, reset } from '../stores/documentation.action';
import { DocumentationState } from '../stores/documentation.state';
import { getLinks, selectAllActiveServers, selectAllServers } from '../stores/server/servers.selector';
import { selectAllScenarios } from '../stores/scenario/scenario.selector';
import { resolveServersPositions } from '../stores/server/server.action';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css']
})
export class CarteComponent implements OnInit {

  public servers$: Observable<Server[]>;
  public links$: Observable<Link[]>;
  public scenarios$: Observable<Scenario[]>;


  constructor(private store: Store<DocumentationState>) { 
    this.servers$ = this.store.select(selectAllActiveServers);
    this.scenarios$ = this.store.select(selectAllScenarios);
    this.links$ = this.store.select(getLinks);
    combineLatest(this.servers$, this.links$).subscribe(([servers, links]) => {
      this.store.dispatch(resolveServersPositions({activeServers: servers, links: links}));
    });
  }

  ngOnInit(): void {
  }

}
