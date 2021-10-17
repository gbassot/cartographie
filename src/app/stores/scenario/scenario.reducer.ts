import { createReducer, on } from '@ngrx/store';
import { ScenarioState } from './scenario.state';
 
export const initialState: ScenarioState = {
    scenarios: [
        { 
          name:'scenario 1', 
          steps: [
            {
              server: 's1',
              algo: { title: 'algo', description: 'algo'}
            },
            {
              server: 's1',
              request: { 
                target: 's2',
                endpoint: 'api'
              }
            },
            {
              server: 's2',
              request: { 
                target: 's3',
                endpoint: 'api'
              }
            }
          ]
       },
       { 
        name:'scenario 2', 
        steps: [
          {
            server: 's4',
            request: { 
              target: 's2',
              endpoint: 'api'
            }
          },
        ]
     }
    ]
};
 

const _scenarioReducer = createReducer(
  initialState,
);
 
export function scenarioReducer(state, action) {
  return _scenarioReducer(state, action);
}
