import { Component, OnInit } from '@angular/core'
import { Link, Scenario, Server } from '../models/documentation.model'
import { combineLatest, Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { DocumentationState } from '../stores/documentation.state'
import { getLinks, selectAllActiveServers } from '../stores/server/servers.selector'
import { selectActiveScenarios, selectAllScenarios } from '../stores/scenario/scenario.selector'
import { resolveServersPositions } from '../stores/server/server.action'
import { toggleScenario } from '../stores/scenario/scenario.action'
import { DRAW_HEIGHT, DRAW_WIDTH, SERVER_HEIGHT, SERVER_WIDTH } from '../constants/constants'

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css']
})
export class CarteComponent implements OnInit {
  public servers$: Observable<Server[]>;
  public links$: Observable<Link[]>;
  public scenarios$: Observable<Scenario[]>;
  public activeScenarios$: Observable<Scenario[]>;

  constructor (private store: Store<DocumentationState>) {
    this.servers$ = this.store.select(selectAllActiveServers)
    this.scenarios$ = this.store.select(selectAllScenarios)
    this.activeScenarios$ = this.store.select(selectActiveScenarios)
    this.links$ = this.store.select(getLinks)
    combineLatest(this.servers$, this.links$, this.scenarios$).subscribe(([servers, links, scenarios]) => {
      this.store.dispatch(resolveServersPositions({ activeServers: servers, links: links }))
    })
  }

  ngOnInit (): void {
  }

  toggle (scenario): void {
    this.store.dispatch(toggleScenario({ scenario }))
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
}
