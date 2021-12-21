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
  servers: [{ id: 1, name: 'Google API', key: 'google-api', endpoints: [{ id: 2, name: '/maps/api/directions/json', request: 'Recupère la distance entre deux adresses', response: 'routes[]: {\nlegs[]: {\ndistance: {\nvalue\n}\n}\n}', payload: 'startAddress,\nendAddress' }], technologies: ['google'], color: '#c4def6', active: false, coordinates: { x: 820, y: 0 } }, { id: 3, name: 'JAC', key: 'jac', endpoints: [{ id: 4, name: '/action/createAutoNewBT', request: "Création d'un BT sur JAC", response: 'success ?', payload: 'workOrder encodé en base64', active: true }, { id: 5, name: 'getMaterialStockAvailable', request: 'Requete de stock sur JAC', response: 'DATA\nstock_lieu[]: {onHand, onHold}\n', payload: 'data : Le meme payload que la visu stock', active: false }], technologies: ['php4'], color: '#db3e00', active: false, coordinates: { x: 270, y: 550 } }, { id: 6, name: 'JAPI', key: 'japi', endpoints: [{ id: 7, name: '/api/country_zones', request: '<p>Liste des zones de pays</p>', response: '<p>Collection de toutes les zones disponibles</p><p>[</p><ul><li><strong>@id</strong> : URI de la zone</li><li><strong>@type</strong> : "CountryZone</li><li><strong>id</strong> : id de la zone</li><li><strong>translationKey</strong> : clef de trad de la zone</li><li><strong>countries</strong>: [liste des uri des iso_countries de la zone]</li></ul><p>]</p>', payload: '<p>aucune</p>', active: false }, { id: 8, name: '/api/cutting_stocks', request: "<p>Interrogation du stock des rectangles capable.</p><p>On cherche parmi les tôles de la bonne <strong>nuance</strong> et de la bonne <strong>épaisseur</strong>, combien de rectangle capables (contenant la pièce à découper) on peut produire.</p><p><br></p><p>La taille du rectangle capable est déduite d'après les <strong>dimensions</strong> de la pièce ainsi que de sa <strong>forme</strong>.</p><p><br></p><p>Les entrepôts dans les quels chercher des tôles sont obligatoirement fourni par ordre de priorité.</p>", response: "<ul><li><strong>isCuttingPossible</strong>: bool</li><li><strong>details</strong>: quantité disponible par entrepôt</li></ul><p class=\"ql-indent-2\">ex : { \"JZ\": 10, \"IS\":5 }</p><ul><li><strong>debug</strong>: détail du calcul</li><li class=\"ql-indent-1\"><strong>computedCapableRectangle</strong> : rectangle capable resultant de la form et des dimension</li><li class=\"ql-indent-1\"><strong>debug </strong>: logs de la procédure de calcul telle qu'elle s'est déroulée</li><li class=\"ql-indent-1\"><strong>JZ</strong> : details des tôles disponibles dans l'entrepot JZ</li><li class=\"ql-indent-1\"><strong>IS</strong> : details des tôles disponibles dans l'entrepot IS</li></ul>", payload: "<ul><li><strong>material</strong> : Material</li><li class=\"ql-indent-1\"><strong>product</strong>: Product</li><li class=\"ql-indent-2\"><strong>shape</strong>: string shape's URI</li><li class=\"ql-indent-2\"><strong>dimension1</strong>: float</li><li class=\"ql-indent-2\"><strong>dimension2</strong>: float</li><li class=\"ql-indent-2\"><strong>dimension3</strong>: float</li><li class=\"ql-indent-2\"><strong>dimension4</strong>: float</li><li class=\"ql-indent-2\"><strong>dimension5</strong>: float</li><li class=\"ql-indent-2\"><strong>dimension6</strong>: float</li><li class=\"ql-indent-1\"><strong>gradeDefinition</strong>: GradeDefinition</li><li class=\"ql-indent-2\"><strong>gradeTypeCode</strong>: string grade (1.4301). Devrait etre le numref, mais c'est bien la nuance.</li><li><strong>requestedQuantity</strong>: int</li><li><strong>warehouses</strong>: string[] liste des entrepots triés par priorité</li><li><strong>certificat</strong>: string</li><li><strong>origin</strong>: int ?!? (vient de l'api/country_zones, manquant pour la v1)</li><li><strong>customerNumber</strong>: int</li><li><strong>companyNumber</strong>: int</li></ul>", active: false }, { id: 9, name: '/api/delivery_times', request: '<p>Délais de livraison macro entre un entrepôt et le client</p>', response: '<ul><li><strong>deliveryTime</strong>: float, délais de livraison en jour</li></ul>', payload: '<ul><li><strong>warehouseDeparture</strong> : string, entrepôt de départ</li><li><strong>clientAddressArrival</strong> : Address</li></ul>' }, { id: 10, name: '/api/production_times', request: "<p>Délais de production macro d'une ou plusieurs pièces découpée.</p><p><br></p><p>Pour le moment on ne considère pas la distance à découper ni le nombre de pièces ni la nuance.</p>", response: '<ul><li><strong>productionTime</strong>: float, délais en jours</li></ul>', payload: "<ul><li><strong>warehouse</strong> : string, l'entrepôt de production</li><li><strong>thickness</strong> : float, l'épaisseur à découper</li><li><strong>cutting</strong> : string, l'URI du type de découpe utilisé</li></ul>", active: false }, { id: 11, name: '/api/stocks/%d', request: 'Demande de stock', response: 'availableStock,\nhasStock,\ndata,\nlength,\ntheoreticalWeight', payload: "inventoryRequest encodée en base64 dans l'url", active: false }, { id: 12, name: '/api/warehouses_priorities', request: '<p>Récupération de la <strong>liste des entrepôts triés</strong> en fonction de la configuration GSM des pièces découpées.</p><p><br></p><p>En fonction de la nuance, on va récupérer le segment correspondant et ainsi trouver la ligne de configuration dans la tableau GSM des pièces découpées (à créer)</p>', response: "<p>Liste d'entrepots trié par priorité de recherche: </p><ul><li><strong>warehouses</strong>: []</li></ul>", payload: '<ul><li><strong>grade</strong>: Grade</li><li><strong>companyNumber</strong>: int</li></ul>', active: false }, { id: 13, name: '/api/work_orders', request: 'Envoi de la demande de création de BT', response: 'Le workOrder enrichi avec le numéro de BT', payload: 'le workOrder en base64', active: false }], technologies: ['symfony', 'api platform'], color: '#1273de', active: false, coordinates: { x: 1100, y: 249.5 } }, { id: 14, name: 'Webshop Back', key: 'webshop-back', endpoints: [{ id: 15, name: '/carts', request: 'Récupération du panier', response: 'order: {\nid,\nitems: {\nsteps: trop lourd !!!\n}\n}', payload: '/carts', active: false }, { id: 19, name: '/cutting/stock/available', request: '<p>request</p>', response: '<p>response</p>', payload: '<p>payload</p>' }, { id: 16, name: '/material/stock/available', request: 'Demande de stock sur un matériel', response: 'available,\ntheoreticalWeight,\ndelivery_time,\nflag,\ntext,\nfromApi\n\n', payload: 'id,\nquantity,\ncertificate,\nstandardLength', active: false }, { id: 17, name: '/order/complete', request: 'Finalisation de la commande', response: 'Numéro du BT créé', payload: '?' }], technologies: ['symfony', 'sylius', 'api platform'], color: '#008b02', active: true, coordinates: { x: 550, y: 249.5 } }, { id: 18, name: 'Webshop Front', key: 'webshop-front', endpoints: [], technologies: ['angular', 'twig'], color: '#fccb00', active: false, coordinates: { x: 0, y: 249.5 } }],
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
