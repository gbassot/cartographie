import { Scenario, Step } from 'src/app/models/documentation.model'

export interface ScenarioState {
    scenarios: Scenario[];
    activeScenarios: Scenario[];
    activeStep: Step;
}
