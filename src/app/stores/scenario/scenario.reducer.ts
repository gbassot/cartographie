import { createReducer, on } from '@ngrx/store';
import { Scenario } from 'src/app/models/documentation.model';
import { toggleScenario } from './scenario.action';
import { ScenarioState } from './scenario.state';
 
export const initialState: ScenarioState = {
    scenarios: [
        { 
          name:'Demande de stock', 
          steps: [
            {
              server: 'webshop-front',
              request: { 
                target: 'webshop-back',
                endpoint: 'api'
              }
            },
            {
              server: 'webshop-back',
              request: { 
                target: 'japi',
                endpoint: 'api'
              }
            },
            {
              server: 'japi',
              request: { 
                target: 'jac',
                endpoint: 'api'
              }
            }
          ]
       },
       { 
        name:'scenario 2', 
        steps: [
          {
            server: 'japi',
            request: { 
              target: 'jac',
              endpoint: 'api'
            }
          },
        ]
     }
    ],
    activeScenarios:[],
};
 

const _scenarioReducer = createReducer(
  initialState,
  on(toggleScenario,(state, {scenario}) => {
    let newActiveScenarios = JSON.parse(JSON.stringify(state.activeScenarios)) as Scenario[];
    if(state.activeScenarios.find((activeScenario: Scenario) => activeScenario.name === scenario.name)) {
      newActiveScenarios = newActiveScenarios.filter((activeScenario: Scenario) => activeScenario.name !== scenario.name);
    } else {
      newActiveScenarios.push(scenario);
    }
    return {...state, activeScenarios:newActiveScenarios};
  })
);
 
export function scenarioReducer(state, action) {
  return _scenarioReducer(state, action);
}
