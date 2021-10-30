import { Component, Input } from '@angular/core'
import { Store } from '@ngrx/store'
import { Scenario } from '../models/documentation.model'
import { DocumentationState } from '../stores/documentation.state'
import { changeActiveStep, updateStepOrder } from '../stores/scenario/scenario.action'

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})
export class ScenarioComponent {
  @Input() scenario: Scenario;

  constructor (private store: Store<DocumentationState>) {}

  drop (event) {
    this.store.dispatch(updateStepOrder({ scenario: this.scenario, previousIndex: event.previousIndex, currentIndex: event.currentIndex }))
  }

  firstStepActive (): boolean {
    return this.scenario.computedSteps[0] ? !!this.scenario.computedSteps[0].active : true
  }

  lastStepActive (): boolean {
    return this.scenario.computedSteps[0] ? !!this.scenario.computedSteps[this.scenario.computedSteps.length - 1].active : true
  }

  next () {
    this.store.dispatch(changeActiveStep({ scenario: this.scenario, offset: 1 }))
  }

  prev () {
    this.store.dispatch(changeActiveStep({ scenario: this.scenario, offset: -1 }))
  }

  last () {
    this.store.dispatch(changeActiveStep({ scenario: this.scenario, offset: this.scenario.computedSteps.length }))
  }

  first () {
    this.store.dispatch(changeActiveStep({ scenario: this.scenario, offset: -this.scenario.computedSteps.length }))
  }
}
