import { Component, Input, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { Endpoint, Server, Step } from '../models/documentation.model'
import { DocumentationState } from '../stores/documentation.state'
import { selectActiveSteps } from '../stores/scenario/scenario.selector'
import { selectAllActiveServers } from '../stores/server/servers.selector'

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {
  @Input() server: Server;
  public activeSteps$: Observable<Step[]>;
  public servers$: Observable<Server[]>;

  constructor (private store: Store<DocumentationState>) {
    this.activeSteps$ = this.store.select(selectActiveSteps)
    this.servers$ = this.store.select(selectAllActiveServers)
  }

  ngOnInit (): void {
  }

  isServerActive (activeSteps : Step[]): boolean {
    return !!activeSteps.find((step: Step) => step.server === this.server.key)
  }

  isTargetServer (activeSteps : Step[]): boolean {
    return !!activeSteps.find((step: Step) => step?.request?.target === this.server.key || step?.response?.target === this.server.key)
  }

  getActiveStep (activeSteps : Step[]): Step {
    const originStep = activeSteps.find((step: Step) => step.server === this.server.key)
    if (originStep) {
      return originStep
    }
    return activeSteps.find((step: Step) => step?.request?.target === this.server.key || step?.response?.target === this.server.key)
  }

  getEndpoint (activeStep: Step, servers: Server[]): Endpoint {
    const unknownEndpoint = { name: 'Unknown', request: 'Unknown request', response: 'Unknown response', payload: 'Unknown payload' }
    const server = servers.find((server: Server) => server.key === activeStep?.request?.target || (activeStep?.response?.target && server.key === activeStep?.server))
    if (!server || !server.endpoints) {
      console.log(server.name + ' has no endpoints !')
      return unknownEndpoint
    }
    const endpoint = server.endpoints.find((endpoint: Endpoint) => endpoint.name === activeStep?.request?.endpoint || endpoint.name === activeStep?.response?.endpoint)
    if (!endpoint) {
      console.log('Unable to find endpoint ' + (activeStep?.request?.endpoint ? activeStep?.request?.endpoint : activeStep?.response?.endpoint) + ' on server ' + server.name)
      return unknownEndpoint
    }
    return endpoint
  }
}
