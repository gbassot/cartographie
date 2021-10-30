import { createAction, props } from '@ngrx/store'
import { Scenario, Step } from 'src/app/models/documentation.model'

export const toggleScenario = createAction(
  '[Active Scenario List] Toogle scenario',
  props<{ scenario: Scenario }>()
)

export const changeActiveStep = createAction(
  '[Active Step] Change current step with offset',
  props<{ scenario: Scenario, offset: number }>()
)

export const toogleActiveStep = createAction(
  '[Active Step] Toogle current step',
  props<{ scenario: Scenario, step: Step }>()
)

export const loadScenarios = createAction(
  '[Scenario List] Load all scenario',
  props<{ scenarios: Scenario[] }>()
)

export const updateStepOrder = createAction(
  '[Step list] Change step list order',
  props<{ scenario: Scenario, previousIndex: number, currentIndex: number }>()
)

export const updateOrCreateStep = createAction(
  '[Step list] Create or update Step',
  props<{ scenario: Scenario, step: Step, currentIndex: number }>()
)

export const deleteStep = createAction(
  '[Step list] Delete Step',
  props<{ scenario: Scenario, step: Step }>()
)

export const updateOrCreateScenario = createAction(
  '[Scenario list] Create or update Scenario',
  props<{ scenario: Scenario }>()
)

export const deleteScenario = createAction(
  '[Scenario list] Delete Scenario',
  props<{ scenario: Scenario }>()
)
