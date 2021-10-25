import { createReducer, on } from '@ngrx/store'
import { Server } from 'src/app/models/documentation.model'
import { PositionResolverService } from 'src/app/services/position-resolver.service'
import { resolveServersPositions } from './server.action'
import { ServerState } from './server.state'

export const initialState: ServerState = {
  servers: [
    {
      name: 'JAPI',
      key: 'japi',
      endpoints: [
        { name: 'api/stock_request', request: 'Requete de stock avec GSM', payload: 'Materiel, client, ancienne requete de stock', response: 'Stock disponible : booleen' },
        { name: 'validate/sap', request: 'request test', payload: 'payload test', response: 'response test' },
        { name: 'send/sap', request: 'request test', payload: 'payload test', response: 'response test' }
      ],
      technologies: [{ name: 'symfony' }]
    },
    {
      name: 'Webshop Back',
      key: 'webshop-back',
      endpoints: [{
        name: 'api/stock',
        request: 'Demande de stock pour un matériel pour un utilisateur',
        payload: 'Materiel, utilisateur, ancienne demande de stock pour JAC',
        response: 'Materiel en stock : booleen'
      }],
      technologies: [{ name: 'symfony' }]
    },
    {
      name: 'Webshop Front',
      key: 'webshop-front',
      technologies: [{ name: 'angular' }]
    },
    {
      name: 'JAC',
      key: 'jac',
      endpoints: [{ name: 'api.php?action=stock_available', request: 'Requete de stock pour JAC', payload: "Même payload que la visustock de l'ERP", response: "Visu stock de l'ERP" }],
      technologies: [{ name: 'php4' }]
    },
    {
      name: 'Jedi',
      key: 'jedi',
      endpoints: [{ name: 'endpoint/sap', request: 'request test', payload: 'payload test', response: 'response test' }],
      technologies: [{ name: 'symfony' }]
    },
    {
      name: 'JPDF',
      key: 'jpdf',
      technologies: [{ name: 'symfony' }]
    },
    {
      name: 'SAP',
      key: 'sap',
      technologies: [{ name: 'symfony' }]
    }
  ]
}

const _serverReducer = createReducer(
  initialState,
  on(resolveServersPositions, (state, { activeServers, links }) => {
    const placedServers = PositionResolverService.positionResolver(activeServers, links)
    let updateNeeded = false
    const clonedServers = JSON.parse(JSON.stringify(state.servers)) as Server[]
    placedServers.forEach((placedServer: Server) => {
      const server = clonedServers.find((clonedServer: Server) => clonedServer.key === placedServer.key)
      if (server?.coordinates?.x !== placedServer.coordinates.x || server?.coordinates?.y !== placedServer.coordinates.y) {
        updateNeeded = true
        server.coordinates = {
          x: placedServer.coordinates.x,
          y: placedServer.coordinates.y
        }
      }
    })
    if (updateNeeded) {
      return { ...state, servers: clonedServers }
    } else {
      return state
    }
  })
)

export function serverReducer (state, action) {
  return _serverReducer(state, action)
}
