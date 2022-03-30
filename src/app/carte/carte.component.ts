import { Component, Injectable, OnInit, ViewChild } from '@angular/core'
import { Endpoint, Link, Scenario, Server, Step } from '../models/documentation.model'
import { combineLatest, Observable } from 'rxjs'
import { tap, take } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { DocumentationState } from '../stores/documentation.state'
import { getLinks, selectAllActiveServers, selectAllServers } from '../stores/server/servers.selector'
import { selectActiveScenarios, selectAllScenarios } from '../stores/scenario/scenario.selector'
import { loadServers, resolveServersPositions, showEndpoint } from '../stores/server/server.action'
import { loadScenarios, toggleScenario, toogleActiveStep } from '../stores/scenario/scenario.action'
import { DRAW_HEIGHT, DRAW_WIDTH, SERVER_HEIGHT, SERVER_WIDTH } from '../constants/constants'
import { MatSidenav } from '@angular/material/sidenav'
import { ActivatedRoute, Router } from '@angular/router'
import { MatStepperIntl } from '@angular/material/stepper'

@Injectable()
export class StepperIntl extends MatStepperIntl {
  // the default optional label text, if unspecified is "Optional"
  override optionalLabel = '';
}

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css'],
  providers: [{ provide: MatStepperIntl, useClass: StepperIntl }]
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

  constructor (private store: Store<DocumentationState>, private route: ActivatedRoute, private router: Router) {
    this.servers$ = this.store.select(selectAllActiveServers)
    this.allServers$ = this.store.select(selectAllServers).pipe(tap((servers: Server[]) => { this.allServers = servers }))
    this.scenarios$ = this.store.select(selectAllScenarios).pipe(tap((scenarios: Scenario[]) => { this.allScenarios = scenarios }))
    this.activeScenarios$ = this.store.select(selectActiveScenarios).pipe(tap((scenarios: Scenario[]) => {
      if (scenarios.length > 0) {
        const activeStepIndex = scenarios[0].computedSteps.findIndex((step) => step.active)
        if (activeStepIndex >= 0) {
          this.router.navigate(['carte', scenarios[0].key, activeStepIndex + 1])
        } else {
          this.router.navigate(['carte', scenarios[0].key])
        }
      }
    }))
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

    combineLatest(this.route.params, this.scenarios$).pipe(take(1), tap(
      ([params, scenarios]) => {
        console.log(params)
        if (!params.scenario) {
          return null
        }
        const activeScenario = scenarios.find((scenario: Scenario) => {
          return scenario.key === params.scenario
        })
        if (activeScenario) {
          scenarios.forEach((scenario) => {
            if ((scenario.key === activeScenario.key && !scenario.active) || (scenario.key !== activeScenario.key && scenario.active)) {
              this.store.dispatch(toggleScenario({ scenario: scenario }))
            }
          })
          if (params.step && activeScenario.computedSteps[params.step - 1] && activeScenario.computedSteps[params.step - 1].active === false) {
            this.store.dispatch(toogleActiveStep({ scenario: activeScenario, step: activeScenario.computedSteps[params.step - 1] }))
          }
        }
      }
    )).subscribe()
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

  getServer (servers: Server[], serverKey: string): Server {
    return servers.find((server: Server) => server.key === serverKey)
  }

  toogleActive (scenario, event): void {
    if (!scenario.computedSteps[event.selectedIndex].active) {
      this.store.dispatch(toogleActiveStep({ scenario: scenario, step: scenario.computedSteps[event.selectedIndex] }))
    }
  }

  getActiveStepIndex (scenario: Scenario): number {
    const index = scenario.computedSteps.findIndex((step: Step) => step.active)
    if (index >= 0) {
      return index
    }
    return 0
  }
}
