import { Component, OnInit, ViewChild } from '@angular/core'
import { Endpoint, Link, Scenario, Server, Step } from '../models/documentation.model'
import { combineLatest, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { DocumentationState } from '../stores/documentation.state'
import { getLinks, selectAllActiveServers, selectAllServers } from '../stores/server/servers.selector'
import { selectActiveScenarios, selectAllScenarios } from '../stores/scenario/scenario.selector'
import { loadServers, resolveServersPositions, showEndpoint } from '../stores/server/server.action'
import { loadScenarios } from '../stores/scenario/scenario.action'
import { DRAW_HEIGHT, DRAW_WIDTH, SERVER_HEIGHT, SERVER_WIDTH } from '../constants/constants'
import { MatSidenav } from '@angular/material/sidenav'

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css']
})
export class CarteComponent implements OnInit {
  public servers$: Observable<Server[]>;
  public allServers$: Observable<Server[]>;
  public links$: Observable<Link[]>;
  public scenarios$: Observable<Scenario[]>;
  public activeScenarios$: Observable<Scenario[]>;
  public lastSave: string;
  private allScenarios: Scenario[];
  private allServers: Server[];
  @ViewChild('sidenavServers') public sidenav: MatSidenav;

  constructor (private store: Store<DocumentationState>) {
    this.servers$ = this.store.select(selectAllActiveServers)
    this.allServers$ = this.store.select(selectAllServers).pipe(tap((servers: Server[]) => { this.allServers = servers }))
    this.scenarios$ = this.store.select(selectAllScenarios).pipe(tap((scenarios: Scenario[]) => { this.allScenarios = scenarios }))
    this.activeScenarios$ = this.store.select(selectActiveScenarios)
    this.links$ = this.store.select(getLinks)
    combineLatest(this.servers$, this.links$, this.scenarios$).subscribe(([servers, links, scenarios]) => {
      this.store.dispatch(resolveServersPositions({ activeServers: servers, links: links }))
    })
  }

  ngOnInit (): void {
    const scenariosJSON = localStorage.getItem('scenarios')
    if (scenariosJSON) {
      const scenarios = JSON.parse(scenariosJSON)
      this.store.dispatch(loadScenarios({ scenarios }))
    }
    const serversJSON = localStorage.getItem('servers')
    if (serversJSON) {
      const servers = JSON.parse(serversJSON)
      this.store.dispatch(loadServers({ servers }))
    }
  }

  save (): void {
    localStorage.setItem('scenarios', JSON.stringify(this.allScenarios))
    localStorage.setItem('servers', JSON.stringify(this.allServers))
    this.lastSave = JSON.stringify(this.allScenarios) + JSON.stringify(this.allServers)
  }

  saveNeeded () : boolean {
    return JSON.stringify(this.allScenarios) + JSON.stringify(this.allServers) !== this.lastSave
  }

  public getScale (servers: Server[]): number {
    try {
      const copiedServers = JSON.parse(JSON.stringify(servers)) as Server[]
      let sorted = copiedServers.sort((a, b) => b.coordinates.x - a.coordinates.x)
      const factorWidth = 1 / ((sorted[0].coordinates.x + SERVER_WIDTH) / DRAW_WIDTH)
      sorted = copiedServers.sort((a, b) => b.coordinates.y - a.coordinates.y)
      const factorHeight = 1 / ((sorted[0].coordinates.y + SERVER_HEIGHT) / DRAW_HEIGHT)
      if (factorWidth > factorHeight) {
        return factorHeight > 1 ? 1 : factorHeight
      } else {
        return factorWidth > 1 ? 1 : factorWidth
      }
    } catch (e) {
      return 1
    }
  }

  public isScenarioActive (scenario: Scenario, activeScenarios: Scenario[]) {
    return activeScenarios.find((activeScenario: Scenario) => activeScenario.name === scenario.name) !== undefined
  }

  openSideNav (sidenav: MatSidenav, type) {
    console.log(sidenav.opened)
    if (!sidenav.opened) {
      sidenav.toggle()
    }
    sidenav.close().then((v) => {
      console.log(v)
      sidenav.open()
    })
  }

  highlighEndpoint (step: Step): void {
    console.log(step)
    let server: Server = null
    if (step.request) {
      server = this.allServers.find((s: Server) => s.key === step.request.target)
    }
    if (step.response) {
      server = this.allServers.find((s: Server) => s.key === step.server)
    }
    if (server) {
      const endpoint = server.endpoints.find((e: Endpoint) => e.name === step.request?.endpoint || e.name === step.response?.endpoint)
      if (endpoint) {
        this.sidenav.open()
        this.store.dispatch(showEndpoint({ server, endpoint }))
      }
    }
  }
}
