import { Component, Input, OnInit } from '@angular/core'
import { Link, Scenario, Server, Step } from '../models/documentation.model'
import { Store } from '@ngrx/store'
import { DocumentationState } from '../stores/documentation.state'
import { MatDialog } from '@angular/material/dialog'
import { deleteScenario, toggleScenario, updateOrCreateScenario } from '../stores/scenario/scenario.action'
import { FormControl, FormGroup } from '@angular/forms'
import { DialogScenarioEditComponent, DialogScenarioEditData } from './dialog-scenario-edit.component'
import { Observable } from 'rxjs'
import { selectAllServers } from '../stores/server/servers.selector'
import { tap } from 'rxjs/operators'

@Component({
  selector: 'app-scenario-editor',
  templateUrl: './scenario-editor.component.html',
  styleUrls: ['./scenario-editor.component.css']
})
export class ScenarioEditorComponent implements OnInit {
  @Input() scenario: Scenario;
  @Input() index: number;
  public allServers$: Observable<Server[]>;

  constructor (private store: Store<DocumentationState>, public dialog: MatDialog) {
    this.allServers$ = this.store.select(selectAllServers)
  }

  ngOnInit (): void {
  }

  toogleScenario (): void {
    this.store.dispatch(toggleScenario({ scenario: this.scenario }))
  }

  getScenarioServers (allServers: Server[]): Server[] {
    const servers: Server[] = []
    this.scenario.steps.forEach((step: Step) => {
      const server = allServers.find((s:Server) => s.key === step.server)
      if (server && !servers.find((serv: Server) => serv === server)) {
        servers.push(server)
      }
      if (step.request?.target) {
        const server = allServers.find((s:Server) => s.key === step.request.target)
        if (server && !servers.find((serv: Server) => serv === server)) {
          servers.push(server)
        }
      }
      if (step.response?.target) {
        const server = allServers.find((s:Server) => s.key === step.response.target)
        if (server && !servers.find((serv: Server) => serv === server)) {
          servers.push(server)
        }
      }
    })

    return servers
  }

  edit (scenarioEditData: DialogScenarioEditData) {
    const dialogRef = this.dialog.open(DialogScenarioEditComponent, {
      width: '1000px',
      data: scenarioEditData
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result?.form) {
        const newScenario: Scenario = {
          id: result.scenario.id,
          name: result.form.value.name,
          key: result.form.value.key,
          steps: result.scenario.steps,
          computedSteps: result.scenario.computedSteps,
          active: result.scenario.active
        }

        this.store.dispatch(updateOrCreateScenario({ scenario: newScenario }))
      }
      if (result?.delete) {
        this.store.dispatch(deleteScenario({ scenario: this.scenario }))
      }
    })
  }

  getCurrentScenarioEditData () : DialogScenarioEditData {
    return {
      scenario: this.scenario,
      form: this.buildForm(this.scenario)
    }
  }

  getNewScenarioEditData () : DialogScenarioEditData {
    const newScenario: Scenario = {
      id: null,
      name: null,
      steps: [],
      computedSteps: [],
      active: true
    }
    return {
      scenario: newScenario,
      form: this.buildForm(newScenario)
    }
  }

  buildForm (scenario: Scenario): FormGroup {
    return new FormGroup({
      name: new FormControl(scenario.name),
      key: new FormControl(scenario.key)
    })
  }
}
