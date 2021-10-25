import { createReducer, on } from '@ngrx/store'
import { Scenario, Step } from 'src/app/models/documentation.model'
import { changeActiveStep, loadScenarios, toggleScenario } from './scenario.action'
import { ScenarioState } from './scenario.state'

export const initialState: ScenarioState = {
  scenarios: [],
  activeScenarios: [],
  activeStep: null
}

const _scenarioReducer = createReducer(
  initialState,
  on(loadScenarios, (state, { scenarios }) => { return { ...state, scenarios } }),
  on(toggleScenario, (state, { scenario }) => {
    let newActiveScenarios = JSON.parse(JSON.stringify(state.activeScenarios)) as Scenario[]
    if (state.activeScenarios.find((activeScenario: Scenario) => activeScenario.name === scenario.name)) {
      newActiveScenarios = newActiveScenarios.filter((activeScenario: Scenario) => activeScenario.name !== scenario.name)
    } else {
      newActiveScenarios = [scenario]
    }
    let activeStep = null
    if (newActiveScenarios.length > 0) {
      activeStep = newActiveScenarios[0].steps[0]
    }
    return { ...state, activeScenarios: newActiveScenarios, activeStep }
  }),
  on(changeActiveStep, (state, { offset }) => {
    if (state.activeScenarios.length > 0 || state.activeStep) {
      const index = state.activeScenarios[0].steps.findIndex((step: Step) => step === state.activeStep)
      if ((index + offset) >= 0 && (index + offset) < (state.activeScenarios[0].steps.length)) { return { ...state, activeStep: state.activeScenarios[0].steps[index + offset] } }
    }
    return state
  })
)

export function scenarioReducer (state, action) {
  return _scenarioReducer(state, action)
}
