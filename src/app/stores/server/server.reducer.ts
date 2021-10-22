import { createReducer, on } from '@ngrx/store';
import { Server } from 'src/app/models/documentation.model';
import { PositionResolverService } from 'src/app/services/position-resolver.service';
import { resolveServersPositions } from './server.action';
import { ServerState } from './server.state';
 
export const initialState: ServerState = {
    servers: [
        { name:'JAPI', key: 'japi'},
        { name:'Webshop Back', key: 'webshop-back'},
        { name:'Webshop Front', key: 'webshop-front'},
        { name:'JAC', key: 'jac'},

    ]
};
 
const _serverReducer = createReducer(
  initialState,
  on(resolveServersPositions, (state, {activeServers, links}) => {
    const placedServers = PositionResolverService.positionResolver(activeServers, links);
    let updateNeeded = false;
    const clonedServers = JSON.parse(JSON.stringify(state.servers)) as Server[];
    placedServers.forEach((placedServer: Server) => {
      const server = clonedServers.find((clonedServer: Server) => clonedServer.key === placedServer.key);
      if(server?.coordinates?.x !== placedServer.coordinates.x || server?.coordinates?.y !== placedServer.coordinates.y) {
        updateNeeded = true;
        server.coordinates = {
          x: placedServer.coordinates.x,
          y: placedServer.coordinates.y
        };
      }
    });
    if(updateNeeded) {
      return {...state, servers:clonedServers};
    } else {
      return state;
    }
  })
);
 
export function serverReducer(state, action) {
  return _serverReducer(state, action);
}
