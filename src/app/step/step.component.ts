import { Component, Input, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { Step } from '../models/documentation.model'
import { DocumentationState } from '../stores/documentation.state'
import { selectActiveStep } from '../stores/scenario/scenario.selector'

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent implements OnInit {
  @Input() step: Step;
  public activeStep$: Observable<Step>;

  constructor (private store: Store<DocumentationState>) {
    this.activeStep$ = this.store.select(selectActiveStep)
  }

  ngOnInit (): void {
  }
}
