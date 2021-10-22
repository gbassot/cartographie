import {Component, Input, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Scenario } from '../models/documentation.model';
import { DocumentationState } from '../stores/documentation.state';
import { toggleScenario } from '../stores/scenario/scenario.action';
import { selectActiveScenarios } from '../stores/scenario/scenario.selector';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})
export class ScenarioComponent implements OnInit { 

  @Input() scenario: Scenario;

  public activeScenarios$: Observable<Scenario[]>;
  public isActive = false; 

  constructor(private store: Store<DocumentationState>) {
    this.activeScenarios$ = this.store.select(selectActiveScenarios).pipe(
      tap((scenarios: Scenario[]) => {
        if(scenarios.find((activeScenario: Scenario) => activeScenario.name === this.scenario.name)) {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
      })  
    );
   }

  ngOnInit(): void {
  }

  toogle(): void {
      this.store.dispatch(toggleScenario({scenario: this.scenario}));
  }

}

