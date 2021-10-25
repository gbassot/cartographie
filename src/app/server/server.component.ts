import { Component, Input, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { Endpoint, Server, Step } from '../models/documentation.model'
import { DocumentationState } from '../stores/documentation.state'
import { selectActiveStep } from '../stores/scenario/scenario.selector'
import { selectAllActiveServers } from '../stores/server/servers.selector'

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {
  @Input() server: Server;
  public activeStep$: Observable<Step>;
  public servers$: Observable<Server[]>;

  constructor (private store: Store<DocumentationState>) {
    this.activeStep$ = this.store.select(selectActiveStep)
    this.servers$ = this.store.select(selectAllActiveServers)
  }

  ngOnInit (): void {
  }

  isServerActive (activeStep : Step): boolean {
    return activeStep?.server === this.server.key
  }

  isTargetServer (activeStep : Step): boolean {
    return activeStep?.request?.target === this.server.key || activeStep?.response?.target === this.server.key
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
      console.log('Unable to find endpoint ' + activeStep?.request.endpoint + ' on server ' + server.name)
      return unknownEndpoint
    }
    return endpoint
  }
}
