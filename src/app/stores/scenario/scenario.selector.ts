import { createSelector } from '@ngrx/store';
import { Scenario, Server, Step } from 'src/app/models/documentation.model';
import { DocumentationState } from '../documentation.state';
import { selectAllServers } from '../server/servers.selector';
import { ScenarioState } from './scenario.state';
 
export const selectScenarios = (state: DocumentationState) => state.scenarios;

export const selectAllScenarios = createSelector(
  selectScenarios,
  (state: ScenarioState) => state.scenarios
);
