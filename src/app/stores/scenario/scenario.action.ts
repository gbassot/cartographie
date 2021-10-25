import { createAction, props } from '@ngrx/store'
import { Scenario } from 'src/app/models/documentation.model'

export const toggleScenario = createAction(
  '[Active Scenario List] Toogle scenario',
  props<{ scenario: Scenario }>()
)

export const changeActiveStep = createAction(
  '[Active Step] Change current step',
  props<{ offset: number }>()
)

export const loadScenarios = createAction(
  '[Scenario List] Load all scenario',
  props<{ scenarios: Scenario[] }>()
)
