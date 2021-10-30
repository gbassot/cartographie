import { createSelector } from '@ngrx/store'
import { DocumentationState } from '../documentation.state'
import { ScenarioState } from './scenario.state'
import { Scenario, Step } from '../../models/documentation.model'

export const selectScenarios = (state: DocumentationState) => state.scenarios

export const selectAllScenarios = createSelector(
  selectScenarios,
  (state: ScenarioState) => state.scenarios
)

export const selectActiveScenariosOrAllScenarios = createSelector(
  selectScenarios,
  (state: ScenarioState) => state.scenarios.filter((scenario:Scenario) => scenario.active).length > 0 ? state.scenarios.filter((scenario:Scenario) => scenario.active) : state.scenarios
)

export const selectActiveScenarios = createSelector(
  selectScenarios,
  (state: ScenarioState) => state.scenarios.filter((scenario: Scenario) => scenario.active)
)

export const selectActiveSteps = createSelector(
  selectScenarios,
  (state: ScenarioState) => {
    const activeSteps: Step[] = []
    state.scenarios.forEach((scenario:Scenario) => {
      if (scenario.active) {
        activeSteps.push(...scenario.computedSteps.filter((s: Step) => s.active))
      }
    })
    return activeSteps
  }
)
