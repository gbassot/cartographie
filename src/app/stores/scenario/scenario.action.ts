import { createAction, props } from '@ngrx/store';
import { Scenario } from 'src/app/models/documentation.model';
 
export const toggleScenario = createAction(
  '[Active Scenario List] Toogle scenario',
  props<{ scenario: Scenario }>()
);

