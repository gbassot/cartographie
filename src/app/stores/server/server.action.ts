import { createAction, props } from '@ngrx/store';
import { Link, Server } from 'src/app/models/documentation.model';
 
export const resolveServersPositions = createAction(
  '[Server List] Update Active Server position',
  props<{ activeServers: Server[], links: Link[]} >()
);
