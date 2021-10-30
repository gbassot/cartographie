import { createAction, props } from '@ngrx/store'
import { Endpoint, Link, Scenario, Server } from 'src/app/models/documentation.model'

export const resolveServersPositions = createAction(
  '[Server List] Update Active Server position',
  props<{ activeServers: Server[], links: Link[]} >()
)

export const loadServers = createAction(
  '[Server List] Load all servers',
  props<{ servers: Server[] }>()
)

export const updateOrCreateServer = createAction(
  '[Server list] Create or update Server',
  props<{ server: Server }>()
)

export const deleteServer = createAction(
  '[Server list] Delete Server',
  props<{ server: Server }>()
)

export const updateOrCreateEndpoint = createAction(
  '[Endpoint list] Create or update Endpoint',
  props<{ server: Server, endpoint: Endpoint }>()
)

export const deleteEndpoint = createAction(
  '[Endpoint list] Delete Endpoint',
  props<{ server: Server, endpoint: Endpoint }>()
)

export const toogleServer = createAction(
  '[Server List] Toogle server',
  props<{ server: Server }>()
)

export const showEndpoint = createAction(
  '[Server List, Endppoint] Open server and highlight endpoint',
  props<{ server: Server, endpoint: Endpoint }>()
)
