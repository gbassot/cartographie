import { createReducer, on } from '@ngrx/store'
import { Endpoint, Scenario, Server, Step } from 'src/app/models/documentation.model'
import { PositionResolverService } from 'src/app/services/position-resolver.service'
import {
  deleteEndpoint,
  deleteServer,
  loadServers,
  resolveServersPositions, showEndpoint, toogleServer,
  updateOrCreateEndpoint,
  updateOrCreateServer
} from './server.action'
import { ServerState } from './server.state'
import { deleteStep, updateOrCreateStep } from '../scenario/scenario.action'

export const initialState: ServerState = {
  servers: [
    /* {
      name: 'JAPI',
      key: 'japi',
      endpoints: [
        { name: 'api/work_orders', request: 'Demande de création de BT', payload: 'POST avec la demande de creation de BT', response: 'Demande de création enrichie du numéro de BT' },
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
        name: 'order/complete',
        request: 'Validation de la commande',
        payload: '?',
        response: 'Numero de BT créé'
      }, {
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
      endpoints: [
        {
          name: 'action/createAutoNewBT',
          request: 'Demande de cration de BT coté JAC',
          response: 'Success si le BT est bien créé',
          payload: "L'objet WorkOrder de JAPI sérialisé en JSON"
        },
        { name: 'action/getMaterialStockAvailable', request: 'Requete de stock pour JAC', payload: "Même payload que la visustock de l'ERP", response: "Visu stock de l'ERP" }
      ],
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
    },
    {
      name: 'MailJet',
      key: 'mailjet',
      technologies: [{ name: 'symfony' }]
    } */
  ],
  cpt: 1
}

const _serverReducer = createReducer(
  initialState,
  on(loadServers, (state, { servers }) => {
    const clonedServers = JSON.parse(JSON.stringify(servers)) as Server[]
    let cpt = state.cpt
    clonedServers.sort((a, b) => a.name.localeCompare(b.name))
    clonedServers.forEach((server: Server) => {
      server.id = cpt++
      server.endpoints?.sort((a, b) => a.name.localeCompare(b.name))
      server.endpoints?.forEach((endpoint: Endpoint) => {
        endpoint.id = cpt++
      })
    })
    clonedServers.sort((a, b) => a.name.localeCompare(b.name))

    return { ...state, servers: clonedServers, cpt }
  }),
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
  }),
  on(updateOrCreateServer, (state, { server }) => {
    const newServers = JSON.parse(JSON.stringify(state.servers)) as Server[]
    let cpt = state.cpt

    if (server.id) {
      const currentIndex = newServers.findIndex((newServer: Server) => newServer.id === server.id)
      newServers.splice(currentIndex, 1, server)
    } else {
      const newServer = JSON.parse(JSON.stringify(server)) as Server
      newServer.id = cpt++
      newServers.push(newServer)
    }
    newServers.sort((a, b) => a.name.localeCompare(b.name))
    return { ...state, servers: newServers, cpt }
  }),
  on(deleteServer, (state, { server }) => {
    const newServers = JSON.parse(JSON.stringify(state.servers)) as Server[]
    const currentIndex = newServers.findIndex((newServer: Server) => newServer.id === server.id)
    newServers.splice(currentIndex, 1)
    return { ...state, servers: newServers }
  }),
  on(updateOrCreateEndpoint, (state, { server, endpoint }) => {
    const newServers = JSON.parse(JSON.stringify(state.servers)) as Server[]
    let cpt = state.cpt
    newServers.forEach((newServer: Server) => {
      if (server.id === newServer.id) {
        if (endpoint.id) {
          const currentIndex = newServer.endpoints.findIndex((e: Endpoint) => e.id === endpoint.id)
          newServer.endpoints.splice(currentIndex, 1, endpoint)
        } else {
          const newEndpoint = JSON.parse(JSON.stringify(endpoint)) as Endpoint
          newEndpoint.id = cpt++
          newServer.endpoints.push(newEndpoint)
        }
        newServer.endpoints?.sort((a, b) => a.name.localeCompare(b.name))
      }
    })
    console.log(newServers)
    return { ...state, servers: newServers, cpt }
  }),
  on(deleteEndpoint, (state, { server, endpoint }) => {
    const newServers = JSON.parse(JSON.stringify(state.servers)) as Server[]
    newServers.forEach((newServer: Server) => {
      if (server.id === newServer.id) {
        if (endpoint.id) {
          const currentIndex = newServer.endpoints.findIndex((e: Endpoint) => e.id === endpoint.id)
          newServer.endpoints.splice(currentIndex, 1)
        }
      }
    })
    return { ...state, servers: newServers }
  }),
  on(toogleServer, (state, { server }) => {
    const newServers = JSON.parse(JSON.stringify(state.servers)) as Server[]
    const newServer = newServers.find((newServer: Server) => server.id === newServer.id)
    newServer.active = !newServer.active

    return { ...state, servers: newServers }
  }),
  on(showEndpoint, (state, { server, endpoint }) => {
    const newServers = JSON.parse(JSON.stringify(state.servers)) as Server[]
    newServers.forEach((newServer: Server) => {
      if (server.id === newServer.id) {
        newServer.active = true
        newServer.endpoints.forEach((e: Endpoint) => {
          e.active = e.id === endpoint.id
        })
      } else {
        newServer.active = false
      }
    })
    return { ...state, servers: newServers }
  })
)

export function serverReducer (state, action) {
  return _serverReducer(state, action)
}
