import { Component, Input, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { Scenario } from '../models/documentation.model'
import { DocumentationState } from '../stores/documentation.state'
import { changeActiveStep } from '../stores/scenario/scenario.action'
import { isFirstStep, isLastStep } from '../stores/scenario/scenario.selector'

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})
export class ScenarioComponent implements OnInit {
  @Input() scenario: Scenario;

  public isFirstStep$: Observable<boolean>;
  public isLastStep$: Observable<boolean>;

  constructor (private store: Store<DocumentationState>) {
    this.isFirstStep$ = this.store.select(isFirstStep)
    this.isLastStep$ = this.store.select(isLastStep)
  }

  ngOnInit (): void {
    console.log(this.scenario)
  }

  next () {
    this.store.dispatch(changeActiveStep({ offset: 1 }))
  }

  prev () {
    this.store.dispatch(changeActiveStep({ offset: -1 }))
  }
}
