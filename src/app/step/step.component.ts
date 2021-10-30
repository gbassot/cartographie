import { Component, Input, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { Scenario, Server, Step } from '../models/documentation.model'
import { DocumentationState } from '../stores/documentation.state'
import { selectActiveSteps, selectAllScenarios } from '../stores/scenario/scenario.selector'
import {
  deleteStep,
  toogleActiveStep,
  updateOrCreateStep
} from '../stores/scenario/scenario.action'
import { MatDialog } from '@angular/material/dialog'
import { selectAllServers } from '../stores/server/servers.selector'
import { FormControl, FormGroup } from '@angular/forms'
import { DialogStepEditComponent, DialogStepEditData } from './dialog-step-edit.component'
import { tap } from 'rxjs/operators'

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent implements OnInit {
  @Input() step: Step;
  @Input() scenario: Scenario;
  @Input() index: number;
  public activeSteps$: Observable<Step[]>;
  public servers$: Observable<Server[]>;
  public scenarios$: Observable<Scenario[]>;
  private allScenarios: Scenario[];

  constructor (private store: Store<DocumentationState>, public dialog: MatDialog) {
    this.activeSteps$ = this.store.select(selectActiveSteps)
    this.servers$ = this.store.select(selectAllServers)
    this.scenarios$ = this.store.select(selectAllScenarios).pipe(tap((scenarios: Scenario[]) => { this.allScenarios = scenarios }))
  }

  ngOnInit (): void {
  }

  stepIsActive (activeSteps: Step[]): boolean {
    return !!activeSteps.find((step: Step) => step === this.step)
  }

  toogleActive (): void {
    this.store.dispatch(toogleActiveStep({ scenario: this.scenario, step: this.step }))
  }

  getScenario (): Scenario {
    return this.allScenarios.find((scenario: Scenario) => scenario.key === this.step.includedScenario?.scenario)
  }

  getServer (servers: Server[], serverKey: string): Server {
    return servers.find((server: Server) => server.key === serverKey)
  }

  toogleIncludedScenario (): void {
    const newStep = JSON.parse(JSON.stringify(this.step))
    newStep.includedScenario.active = !newStep.includedScenario.active
    newStep.active = false
    this.store.dispatch(updateOrCreateStep({ scenario: this.scenario, step: newStep, currentIndex: 0 }))
  }

  edit (stepEditData: DialogStepEditData) {
    const dialogRef = this.dialog.open(DialogStepEditComponent, {
      width: '1000px',
      data: stepEditData
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result?.form) {
        const newStep: Step = {
          id: result.step.id,
          includedScenario: null,
          server: null,
          active: result.step.active
        }
        if (result.form.value.type === 'scenario') {
          newStep.includedScenario = {
            scenario: result.form.value.scenario,
            active: false
          }
        } else {
          newStep.server = result.form.value.server
          switch (result.form.value.action) {
            case 'algo':
              newStep.algo = {
                title: result.form.value.title,
                description: result.form.value.description
              }
              break
            case 'request':
              newStep.request = {
                target: result.form.value.target,
                endpoint: result.form.value.endpoint
              }
              break
            case 'response':
              newStep.response = {
                target: result.form.value.target,
                endpoint: result.form.value.endpoint
              }
              break
          }
        }
        this.store.dispatch(updateOrCreateStep({ scenario: this.scenario, step: newStep, currentIndex: this.index + 1 }))
      }
      if (result?.delete) {
        this.store.dispatch(deleteStep({ scenario: this.scenario, step: this.step }))
      }
    })
  }

  getCurrentStepEditData () : DialogStepEditData {
    return {
      step: this.step,
      servers$: this.servers$,
      scenarios$: this.scenarios$,
      form: this.buildForm(this.step)
    }
  }

  getNewStepEditData () : DialogStepEditData {
    const newStep = { server: null, active: false }
    return {
      step: newStep,
      servers$: this.servers$,
      scenarios$: this.scenarios$,
      form: this.buildForm(newStep)
    }
  }

  buildForm (step: Step) {
    return new FormGroup({
      type: new FormControl(step.includedScenario ? 'scenario' : 'normal'),
      scenario: new FormControl(step.includedScenario?.scenario),
      server: new FormControl(step.server),
      action: new FormControl(step.request ? 'request' : (step.response ? 'response' : 'algo')),
      target: new FormControl(step?.request?.target ? step?.request?.target : (step?.response?.target ? step?.response?.target : null)),
      endpoint: new FormControl(step?.request?.endpoint ? step?.request?.endpoint : (step?.response?.endpoint ? step?.response?.endpoint : null)),
      title: new FormControl(step.algo?.title ? step.algo?.title : null),
      description: new FormControl(step.algo?.description ? step.algo?.description : null)
    })
  }
}
