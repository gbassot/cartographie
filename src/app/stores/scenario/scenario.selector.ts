import { createSelector } from '@ngrx/store'
import { DocumentationState } from '../documentation.state'
import { ScenarioState } from './scenario.state'

export const selectScenarios = (state: DocumentationState) => state.scenarios

export const selectAllScenarios = createSelector(
  selectScenarios,
  (state: ScenarioState) => state.scenarios
)

export const selectActiveScenariosOrAllScenarios = createSelector(
  selectScenarios,
  (state: ScenarioState) => state.activeScenarios.length > 0 ? state.activeScenarios : state.scenarios
)

export const selectActiveScenarios = createSelector(
  selectScenarios,
  (state: ScenarioState) => state.activeScenarios
)

export const selectActiveStep = createSelector(
  selectScenarios,
  (state: ScenarioState) => state.activeStep
)

export const isFirstStep = createSelector(
  selectScenarios,
  (state: ScenarioState) => state.activeStep === state.activeScenarios[0]?.steps[0]
)

export const isLastStep = createSelector(
  selectScenarios,
  (state: ScenarioState) => state.activeStep === state.activeScenarios[0]?.steps[state.activeScenarios[0]?.steps.length - 1]
)
