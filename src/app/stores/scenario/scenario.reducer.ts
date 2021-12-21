import { createReducer, on } from '@ngrx/store'
import { Scenario, Step } from 'src/app/models/documentation.model'
import {
  changeActiveStep, deleteScenario, deleteStep,
  loadScenarios,
  toggleScenario, toogleActiveStep, updateOrCreateScenario,
  updateOrCreateStep,
  updateStepOrder
} from './scenario.action'
import { ScenarioState } from './scenario.state'

export const initialState: ScenarioState = {
  scenarios: [{ id: 1, name: 'Demande stock JAC', key: 'demande-stock-jac', steps: [{ id: 2, includedScenario: null, server: 'japi', active: false, request: { target: 'jac', endpoint: 'getMaterialStockAvailable' }, isIncluded: 0 }, { id: 3, includedScenario: null, server: 'jac', active: false, response: { target: 'japi', endpoint: 'getMaterialStockAvailable' }, isIncluded: 0 }], computedSteps: [{ id: 2, includedScenario: null, server: 'japi', active: false, request: { target: 'jac', endpoint: 'getMaterialStockAvailable' }, isIncluded: 0 }, { id: 3, includedScenario: null, server: 'jac', active: false, response: { target: 'japi', endpoint: 'getMaterialStockAvailable' }, isIncluded: 0 }], active: false }, { id: 4, name: 'Jacquet - Requête de stock', key: 'jacquet-stock-request', steps: [{ includedScenario: null, server: 'webshop-front', active: false, algo: { title: 'Demande de stock', description: "<p>Une pièce découpée vient d'être configurée entièrement (on a toute les infos pour l'ajouter au panier) et on veut connaitre le stock ainsi que le délais de production/livraison.</p><p><br></p><p><br></p>" }, id: 61 }, { includedScenario: null, server: 'webshop-front', active: false, request: { target: 'webshop-back', endpoint: '/cutting/stock/available' }, id: 60 }, { id: 5, includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Demande de stock', description: '<p>On veut connaitre le stock sur un produit découpé. On doit donc avoir toute la configuration de ce produit découpé <strong>(dimensions, nuance, forme)</strong>.</p><p><br></p><p>En plus de cette configuration qui provient du front, il nous faut la <strong>liste des entrepôts</strong> dans la quelle chercher le stock.</p>' }, isIncluded: 0 }, { id: 6, includedScenario: null, server: 'webshop-back', active: false, request: { target: 'japi', endpoint: '/api/warehouses_priorities' }, isIncluded: 0 }, { id: 7, includedScenario: null, server: 'japi', active: false, response: { target: 'webshop-back', endpoint: '/api/warehouses_priorities' }, isIncluded: 0 }, { id: 8, includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Requête de stock', description: "<p>Grace à la liste d’entrepôts trié, on a tout ce qu'il nous faut pour faire la requête de stock des pièces découpées.</p>" }, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, request: { target: 'japi', endpoint: '/api/cutting_stocks' }, id: 9, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: false, response: { target: 'webshop-back', endpoint: '/api/cutting_stocks' }, id: 10, isIncluded: 0 }, { id: 11, includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Délai production et livraison', description: '<p>On sait maintenant si la quantité demandée est en stock et où se trouve ce stock. On peut alors enrichir la réponse avec le délais de production <a href="https://redmine.jacquetmetals.com/issues/173284" rel="noopener noreferrer" target="_blank">https://redmine.jacquetmetals.com/issues/173284</a> et le délais de livraison <a href="https://redmine.jacquetmetals.com/issues/173291" rel="noopener noreferrer" target="_blank">https://redmine.jacquetmetals.com/issues/173291</a>.</p><p><br></p><p>Dans ces deux cas on prendra la valeur maximum des différentes réponses (si on interroge deux entrepôts, on ne conservera que le temps le plus long)</p><p><br></p><p><br></p><p><br></p>' }, isIncluded: 0 }, { id: 12, includedScenario: null, server: 'webshop-back', active: false, request: { target: 'japi', endpoint: '/api/production_times' }, isIncluded: 0 }, { id: 13, includedScenario: null, server: 'japi', active: false, response: { target: 'webshop-back', endpoint: '/api/production_times' }, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, request: { target: 'japi', endpoint: '/api/delivery_times' }, id: 14, isIncluded: 0 }], computedSteps: [{ includedScenario: null, server: 'webshop-front', active: true, algo: { title: 'Demande de stock', description: "<p>Une pièce découpée vient d'être configurée entièrement (on a toute les infos pour l'ajouter au panier) et on veut connaitre le stock ainsi que le délais de production/livraison.</p><p><br></p><p><br></p>" }, id: 61 }, { includedScenario: null, server: 'webshop-front', active: false, request: { target: 'webshop-back', endpoint: '/cutting/stock/available' }, id: 60 }, { id: 5, includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Demande de stock', description: '<p>On veut connaitre le stock sur un produit découpé. On doit donc avoir toute la configuration de ce produit découpé <strong>(dimensions, nuance, forme)</strong>.</p><p><br></p><p>En plus de cette configuration qui provient du front, il nous faut la <strong>liste des entrepôts</strong> dans la quelle chercher le stock.</p>' }, isIncluded: 0 }, { id: 6, includedScenario: null, server: 'webshop-back', active: false, request: { target: 'japi', endpoint: '/api/warehouses_priorities' }, isIncluded: 0 }, { id: 7, includedScenario: null, server: 'japi', active: false, response: { target: 'webshop-back', endpoint: '/api/warehouses_priorities' }, isIncluded: 0 }, { id: 8, includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Requête de stock', description: "<p>Grace à la liste d’entrepôts trié, on a tout ce qu'il nous faut pour faire la requête de stock des pièces découpées.</p>" }, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, request: { target: 'japi', endpoint: '/api/cutting_stocks' }, id: 9, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: false, response: { target: 'webshop-back', endpoint: '/api/cutting_stocks' }, id: 10, isIncluded: 0 }, { id: 11, includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Délai production et livraison', description: '<p>On sait maintenant si la quantité demandée est en stock et où se trouve ce stock. On peut alors enrichir la réponse avec le délais de production <a href="https://redmine.jacquetmetals.com/issues/173284" rel="noopener noreferrer" target="_blank">https://redmine.jacquetmetals.com/issues/173284</a> et le délais de livraison <a href="https://redmine.jacquetmetals.com/issues/173291" rel="noopener noreferrer" target="_blank">https://redmine.jacquetmetals.com/issues/173291</a>.</p><p><br></p><p>Dans ces deux cas on prendra la valeur maximum des différentes réponses (si on interroge deux entrepôts, on ne conservera que le temps le plus long)</p><p><br></p><p><br></p><p><br></p>' }, isIncluded: 0 }, { id: 12, includedScenario: null, server: 'webshop-back', active: false, request: { target: 'japi', endpoint: '/api/production_times' }, isIncluded: 0 }, { id: 13, includedScenario: null, server: 'japi', active: false, response: { target: 'webshop-back', endpoint: '/api/production_times' }, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, request: { target: 'japi', endpoint: '/api/delivery_times' }, id: 14, isIncluded: 0 }], active: true }, { id: 15, name: 'JAPI - Creation de BT', key: 'japi-create-bt', steps: [{ id: 16, includedScenario: null, server: 'japi', active: false, algo: { title: 'Récupération du message', description: 'Via messenger:consume, on récupère les message createWorkOrder' }, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: false, algo: { title: 'Split de ligne', description: 'Algo de split de ligne de BT : On cherche a répartir la demande de chaque lgne sur les entrepots en fonction du stock' }, id: 17, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: false, request: { target: 'jac', endpoint: '/action/createAutoNewBT' }, id: 18, isIncluded: 0 }, { includedScenario: null, server: 'jac', active: false, response: { target: 'japi', endpoint: '/action/createAutoNewBT' }, id: 19, isIncluded: 0 }], computedSteps: [{ id: 16, includedScenario: null, server: 'japi', active: false, algo: { title: 'Récupération du message', description: 'Via messenger:consume, on récupère les message createWorkOrder' }, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: true, algo: { title: 'Split de ligne', description: 'Algo de split de ligne de BT : On cherche a répartir la demande de chaque lgne sur les entrepots en fonction du stock' }, id: 17, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: false, request: { target: 'jac', endpoint: '/action/createAutoNewBT' }, id: 18, isIncluded: 0 }, { includedScenario: null, server: 'jac', active: false, response: { target: 'japi', endpoint: '/action/createAutoNewBT' }, id: 19, isIncluded: 0 }], active: false }, { id: 20, name: 'JAPI - Nearest Location', key: 'japi-nearest-location', steps: [{ includedScenario: null, server: 'japi', active: false, algo: { title: 'Tri des lieux par distance', description: 'Tri des lieux en fonction de leur distance au client : \ngetNearestLocation' }, id: 21, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: false, request: { target: 'google-api', endpoint: '/maps/api/directions/json' }, id: 22, isIncluded: 0 }, { includedScenario: null, server: 'google-api', active: false, response: { target: 'japi', endpoint: '/maps/api/directions/json' }, id: 23, isIncluded: 0 }], computedSteps: [{ includedScenario: null, server: 'japi', active: false, algo: { title: 'Tri des lieux par distance', description: 'Tri des lieux en fonction de leur distance au client : \ngetNearestLocation' }, id: 21, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: true, request: { target: 'google-api', endpoint: '/maps/api/directions/json' }, id: 22, isIncluded: 0 }, { includedScenario: null, server: 'google-api', active: false, response: { target: 'japi', endpoint: '/maps/api/directions/json' }, id: 23, isIncluded: 0 }], active: false }, { id: 24, name: 'Webshop - Création de BT', key: 'webshop-create-bt', steps: [{ id: 25, includedScenario: null, server: 'webshop-front', active: false, request: { target: 'webshop-back', endpoint: '/order/complete' }, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Creation du workOrder', description: 'Tranformation de la commande Silius en WorkOrder pour JAPI' }, id: 26, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, request: { target: 'japi', endpoint: '/api/work_orders' }, id: 27, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: false, algo: { title: 'Reservation num BT', description: 'Réservation du numéro de BT' }, id: 28, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: false, algo: { title: 'Envoi à Messenger', description: 'Envoi de la demande de creation de BT via le message createWorkOrder' }, id: 29, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: false, response: { target: 'webshop-back', endpoint: '/api/work_orders' }, id: 30, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, response: { target: 'webshop-front', endpoint: '/order/complete' }, id: 31, isIncluded: 0 }, { includedScenario: null, server: 'webshop-front', active: false, algo: { title: 'Page de remerciement', description: 'Lien vers la commande dans le client account' }, id: 32, isIncluded: 0 }], computedSteps: [{ id: 25, includedScenario: null, server: 'webshop-front', active: false, request: { target: 'webshop-back', endpoint: '/order/complete' }, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Creation du workOrder', description: 'Tranformation de la commande Silius en WorkOrder pour JAPI' }, id: 26, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, request: { target: 'japi', endpoint: '/api/work_orders' }, id: 27, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: false, algo: { title: 'Reservation num BT', description: 'Réservation du numéro de BT' }, id: 28, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: false, algo: { title: 'Envoi à Messenger', description: 'Envoi de la demande de creation de BT via le message createWorkOrder' }, id: 29, isIncluded: 0 }, { includedScenario: null, server: 'japi', active: false, response: { target: 'webshop-back', endpoint: '/api/work_orders' }, id: 30, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, response: { target: 'webshop-front', endpoint: '/order/complete' }, id: 31, isIncluded: 0 }, { includedScenario: null, server: 'webshop-front', active: false, algo: { title: 'Page de remerciement', description: 'Lien vers la commande dans le client account' }, id: 32, isIncluded: 0 }], active: false }, { id: 33, name: 'Webshop - Demande de stock', key: 'webshop-demande-de-stock', steps: [{ id: 34, includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Génère InventoryRequest', description: "Génération de la stock request comprise par l'api JAC" }, isIncluded: 0 }, { server: 'webshop-back', active: false, request: { target: 'japi', endpoint: '/api/stocks/%d' }, id: 35, isIncluded: 0 }, { id: 36, includedScenario: null, server: 'japi', active: false, algo: { title: 'getStock', description: "Calcul du stock selon l'algo du GSM" }, isIncluded: 0 }, { id: 37, server: 'japi', active: false, algo: { title: 'Recherche interne', description: 'Stock sur les lieux internes de la société' }, isIncluded: 0 }, { id: 38, includedScenario: { scenario: 'demande-stock-jac', active: true }, server: null, active: false, isIncluded: 0 }, { id: 39, includedScenario: { scenario: 'japi-nearest-location', active: false }, server: null, active: false, isIncluded: 0 }, { id: 40, server: 'japi', active: false, algo: { title: 'Recherche externe', description: 'Si le stock interne ne suffit pas, rechreche de stock sur les lieux externes de la société selon le paramétrage GSM' }, isIncluded: 0 }, { id: 41, includedScenario: { scenario: 'demande-stock-jac', active: false }, server: null, active: false, isIncluded: 0 }, { server: 'japi', active: false, algo: { title: 'Stock récupéré', description: "L'information de stock est récupérée" }, id: 42, isIncluded: 0 }, { id: 43, server: 'japi', active: false, algo: { title: 'Delais de livraison', description: 'Enrichissement de la réponse avec le calcul des delais de livraison : deliveryLeadTime' }, isIncluded: 0 }, { server: 'japi', active: false, algo: { title: 'findProductionTime', description: null }, id: 44, isIncluded: 0 }, { server: 'japi', active: false, algo: { title: 'calculRoadLeadTime', description: null }, id: 45, isIncluded: 0 }, { server: 'japi', active: false, response: { target: 'webshop-back', endpoint: '/api/stocks/%d' }, id: 46, isIncluded: 0 }], computedSteps: [{ id: 34, includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Génère InventoryRequest', description: "Génération de la stock request comprise par l'api JAC" }, isIncluded: 0 }, { server: 'webshop-back', active: false, request: { target: 'japi', endpoint: '/api/stocks/%d' }, id: 35, isIncluded: 0 }, { id: 36, includedScenario: null, server: 'japi', active: false, algo: { title: 'getStock', description: "Calcul du stock selon l'algo du GSM" }, isIncluded: 0 }, { id: 37, server: 'japi', active: false, algo: { title: 'Recherche interne', description: 'Stock sur les lieux internes de la société' }, isIncluded: 0 }, { id: 38, includedScenario: { scenario: 'demande-stock-jac', active: true }, server: null, active: false, isIncluded: 0 }, { id: 2, includedScenario: null, server: 'japi', active: false, request: { target: 'jac', endpoint: 'getMaterialStockAvailable' }, isIncluded: 1 }, { id: 3, includedScenario: null, server: 'jac', active: false, response: { target: 'japi', endpoint: 'getMaterialStockAvailable' }, isIncluded: 1 }, { id: 39, includedScenario: { scenario: 'japi-nearest-location', active: false }, server: null, active: false, isIncluded: 0 }, { id: 40, server: 'japi', active: false, algo: { title: 'Recherche externe', description: 'Si le stock interne ne suffit pas, rechreche de stock sur les lieux externes de la société selon le paramétrage GSM' }, isIncluded: 0 }, { id: 41, includedScenario: { scenario: 'demande-stock-jac', active: false }, server: null, active: false, isIncluded: 0 }, { server: 'japi', active: false, algo: { title: 'Stock récupéré', description: "L'information de stock est récupérée" }, id: 42, isIncluded: 0 }, { id: 43, server: 'japi', active: false, algo: { title: 'Delais de livraison', description: 'Enrichissement de la réponse avec le calcul des delais de livraison : deliveryLeadTime' }, isIncluded: 0 }, { server: 'japi', active: false, algo: { title: 'findProductionTime', description: null }, id: 44, isIncluded: 0 }, { server: 'japi', active: false, algo: { title: 'calculRoadLeadTime', description: null }, id: 45, isIncluded: 0 }, { server: 'japi', active: false, response: { target: 'webshop-back', endpoint: '/api/stocks/%d' }, id: 46, isIncluded: 0 }], active: false }, { id: 47, name: 'Webshop - Page Panier', key: 'webshop-cart', steps: [{ includedScenario: null, server: 'webshop-front', active: false, algo: { title: 'Chargement Panier', description: 'Chargement de la page panier' }, id: 48, isIncluded: 0 }, { includedScenario: null, server: 'webshop-front', active: false, request: { target: 'webshop-back', endpoint: '/carts' }, id: 49, isIncluded: 0 }, { id: 50, includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Mise a jour du stock', description: 'Pour chaque ligne du panier on met à jour le stock : addStockInformation' }, isIncluded: 0 }, { includedScenario: { scenario: 'webshop-demande-de-stock', active: true }, server: null, active: false, id: 51, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, response: { target: 'webshop-front', endpoint: '/carts' }, id: 52, isIncluded: 0 }, { includedScenario: null, server: 'webshop-front', active: false, algo: { title: 'Affichage du panier', description: "Le panier est affichée grace au retour de l'API /carts\nAttention, les steps font exploser la taille du json !" }, id: 53, isIncluded: 0 }], computedSteps: [{ includedScenario: null, server: 'webshop-front', active: false, algo: { title: 'Chargement Panier', description: 'Chargement de la page panier' }, id: 48, isIncluded: 0 }, { includedScenario: null, server: 'webshop-front', active: false, request: { target: 'webshop-back', endpoint: '/carts' }, id: 49, isIncluded: 0 }, { id: 50, includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Mise a jour du stock', description: 'Pour chaque ligne du panier on met à jour le stock : addStockInformation' }, isIncluded: 0 }, { includedScenario: { scenario: 'webshop-demande-de-stock', active: true }, server: null, active: false, id: 51, isIncluded: 0 }, { id: 34, includedScenario: null, server: 'webshop-back', active: false, algo: { title: 'Génère InventoryRequest', description: "Génération de la stock request comprise par l'api JAC" }, isIncluded: 1 }, { server: 'webshop-back', active: true, request: { target: 'japi', endpoint: '/api/stocks/%d' }, id: 35, isIncluded: 1 }, { id: 36, includedScenario: null, server: 'japi', active: false, algo: { title: 'getStock', description: "Calcul du stock selon l'algo du GSM" }, isIncluded: 1 }, { id: 37, server: 'japi', active: false, algo: { title: 'Recherche interne', description: 'Stock sur les lieux internes de la société' }, isIncluded: 1 }, { id: 38, includedScenario: { scenario: 'demande-stock-jac', active: true }, server: null, active: false, isIncluded: 1 }, { id: 2, includedScenario: null, server: 'japi', active: false, request: { target: 'jac', endpoint: 'getMaterialStockAvailable' }, isIncluded: 2 }, { id: 3, includedScenario: null, server: 'jac', active: false, response: { target: 'japi', endpoint: 'getMaterialStockAvailable' }, isIncluded: 2 }, { id: 39, includedScenario: { scenario: 'japi-nearest-location', active: false }, server: null, active: false, isIncluded: 1 }, { id: 40, server: 'japi', active: false, algo: { title: 'Recherche externe', description: 'Si le stock interne ne suffit pas, rechreche de stock sur les lieux externes de la société selon le paramétrage GSM' }, isIncluded: 1 }, { id: 41, includedScenario: { scenario: 'demande-stock-jac', active: false }, server: null, active: false, isIncluded: 1 }, { server: 'japi', active: false, algo: { title: 'Stock récupéré', description: "L'information de stock est récupérée" }, id: 42, isIncluded: 1 }, { id: 43, server: 'japi', active: false, algo: { title: 'Delais de livraison', description: 'Enrichissement de la réponse avec le calcul des delais de livraison : deliveryLeadTime' }, isIncluded: 1 }, { server: 'japi', active: false, algo: { title: 'findProductionTime', description: null }, id: 44, isIncluded: 1 }, { server: 'japi', active: false, algo: { title: 'calculRoadLeadTime', description: null }, id: 45, isIncluded: 1 }, { server: 'japi', active: false, response: { target: 'webshop-back', endpoint: '/api/stocks/%d' }, id: 46, isIncluded: 1 }, { includedScenario: null, server: 'webshop-back', active: false, response: { target: 'webshop-front', endpoint: '/carts' }, id: 52, isIncluded: 0 }, { includedScenario: null, server: 'webshop-front', active: false, algo: { title: 'Affichage du panier', description: "Le panier est affichée grace au retour de l'API /carts\nAttention, les steps font exploser la taille du json !" }, id: 53, isIncluded: 0 }], active: false }, { id: 54, name: 'Webshop - Page produit', key: 'ws-page-produit', steps: [{ id: 55, includedScenario: null, server: 'webshop-front', active: false, algo: { title: 'Demande de stock', description: 'Le produit est sélectionné, la demande de stock est envoyée : \ncheckStockAvailability (js)' }, isIncluded: 0 }, { includedScenario: null, server: 'webshop-front', active: false, request: { target: 'webshop-back', endpoint: '/material/stock/available' }, id: 56, isIncluded: 0 }, { id: 57, includedScenario: { scenario: 'webshop-demande-de-stock', active: false }, server: null, active: false, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, response: { target: 'webshop-front', endpoint: '/material/stock/available' }, id: 58, isIncluded: 0 }, { includedScenario: null, server: 'webshop-front', active: false, algo: { title: 'Affichage stock', description: 'Affichage du stock sur la page produit' }, id: 59, isIncluded: 0 }], computedSteps: [{ id: 55, includedScenario: null, server: 'webshop-front', active: false, algo: { title: 'Demande de stock', description: 'Le produit est sélectionné, la demande de stock est envoyée : \ncheckStockAvailability (js)' }, isIncluded: 0 }, { includedScenario: null, server: 'webshop-front', active: false, request: { target: 'webshop-back', endpoint: '/material/stock/available' }, id: 56, isIncluded: 0 }, { id: 57, includedScenario: { scenario: 'webshop-demande-de-stock', active: false }, server: null, active: false, isIncluded: 0 }, { includedScenario: null, server: 'webshop-back', active: false, response: { target: 'webshop-front', endpoint: '/material/stock/available' }, id: 58, isIncluded: 0 }, { includedScenario: null, server: 'webshop-front', active: false, algo: { title: 'Affichage stock', description: 'Affichage du stock sur la page produit' }, id: 59, isIncluded: 0 }], active: false }],
  cpt: 1
}

const _scenarioReducer = createReducer(
  initialState,
  on(loadScenarios, (state, { scenarios }) => {
    const newScenarios = JSON.parse(JSON.stringify(scenarios)) as Scenario[]
    let cpt = 1
    newScenarios.forEach((scenario: Scenario) => {
      scenario.id = cpt++
      scenario.steps.forEach((step: Step) => {
        step.id = cpt++
        step.active = false
        step.isIncluded = 0
      })
    })
    updateComputedSteps(newScenarios)
    newScenarios.sort((a, b) => a.name.localeCompare(b.name))
    return { ...state, scenarios: newScenarios, cpt }
  }),
  on(toggleScenario, (state, { scenario }) => {
    const newScenarios = JSON.parse(JSON.stringify(state.scenarios)) as Scenario[]
    newScenarios.forEach((newScenario: Scenario) => {
      if (scenario.id === newScenario.id) {
        newScenario.active = !newScenario.active
      }
    })
    updateComputedSteps(newScenarios)
    return { ...state, scenarios: newScenarios }
  }),
  on(changeActiveStep, (state, { scenario, offset }) => {
    const newScenarios = JSON.parse(JSON.stringify(state.scenarios)) as Scenario[]
    newScenarios.forEach((newScenario: Scenario) => {
      if (scenario.id === newScenario.id) {
        let index = newScenario.computedSteps.findIndex((step: Step) => step.active)
        if (index < 0 && offset > 0) {
          index = -offset
        }
        if (index < 0 && offset < 0) {
          index = newScenario.computedSteps.length - 1 - offset
        }
        if (newScenario.computedSteps[index]) {
          newScenario.computedSteps[index].active = false
        }

        if ((index + offset) < 0) {
          newScenario.computedSteps[0].active = true
        } else if ((index + offset) >= (newScenario.computedSteps.length)) {
          newScenario.computedSteps[(newScenario.computedSteps.length) - 1].active = true
        } else {
          newScenario.computedSteps[index + offset].active = true
        }
      }
    })
    return { ...state, scenarios: newScenarios }
  }),
  on(toogleActiveStep, (state, { scenario, step }) => {
    const newScenarios = JSON.parse(JSON.stringify(state.scenarios)) as Scenario[]
    newScenarios.forEach((newScenario: Scenario) => {
      if (scenario.id === newScenario.id) {
        const indexActive = scenario.computedSteps.findIndex((s: Step) => s === step)
        newScenario.computedSteps[indexActive].active = !newScenario.computedSteps[indexActive].active
        // desactive other steps
        newScenario.computedSteps.forEach((s: Step, index) => {
          if (s.active && index !== indexActive) {
            s.active = false
          }
        })
      }
    })
    return { ...state, scenarios: newScenarios }
  }),
  on(updateStepOrder, (state, { scenario, previousIndex, currentIndex }) => {
    const newScenarios = JSON.parse(JSON.stringify(state.scenarios)) as Scenario[]
    newScenarios.forEach((newScenario: Scenario) => {
      if (scenario.id === newScenario.id) {
        const step = scenario.steps[previousIndex]
        newScenario.steps.splice(previousIndex, 1)
        newScenario.steps.splice(currentIndex, 0, step)
      }
    })
    updateComputedSteps(newScenarios)
    return { ...state, scenarios: newScenarios }
  }),
  on(updateOrCreateStep, (state, { scenario, step, currentIndex }) => {
    const newScenarios = JSON.parse(JSON.stringify(state.scenarios)) as Scenario[]
    let cpt = state.cpt
    if (step.id) {
      newScenarios.forEach((newScenario: Scenario) => {
        currentIndex = newScenario.steps.findIndex((s: Step) => s.id === step.id)
        if (currentIndex >= 0) {
          newScenario.steps.splice(currentIndex, 1, step)
        }
      })
    } else {
      newScenarios.forEach((newScenario: Scenario) => {
        if (scenario.id === newScenario.id) {
          const newStep = JSON.parse(JSON.stringify(step)) as Step
          newStep.id = cpt++
          newScenario.steps.splice(currentIndex, 0, newStep)
        }
      })
    }
    updateComputedSteps(newScenarios)
    return { ...state, scenarios: newScenarios, cpt }
  }),
  on(deleteStep, (state, { scenario, step }) => {
    const newScenarios = JSON.parse(JSON.stringify(state.scenarios)) as Scenario[]
    newScenarios.forEach((newScenario: Scenario) => {
      if (scenario.id === newScenario.id) {
        if (step.id) {
          const currentIndex = newScenario.steps.findIndex((s: Step) => s.id === step.id)
          newScenario.steps.splice(currentIndex, 1)
        }
      }
    })
    updateComputedSteps(newScenarios)
    return { ...state, scenarios: newScenarios }
  }),
  on(updateOrCreateScenario, (state, { scenario }) => {
    const newScenarios = JSON.parse(JSON.stringify(state.scenarios)) as Scenario[]
    let cpt = state.cpt

    if (scenario.id) {
      const currentIndex = newScenarios.findIndex((s: Scenario) => s.id === scenario.id)
      newScenarios.splice(currentIndex, 1, scenario)
    } else {
      const newScenario = JSON.parse(JSON.stringify(scenario)) as Scenario
      newScenario.id = cpt++
      newScenarios.push(newScenario)
    }
    newScenarios.sort((a, b) => a.name.localeCompare(b.name))
    return { ...state, scenarios: newScenarios, cpt }
  }),
  on(deleteScenario, (state, { scenario }) => {
    const newScenarios = JSON.parse(JSON.stringify(state.scenarios)) as Scenario[]
    if (scenario.id) {
      const currentIndex = newScenarios.findIndex((s: Scenario) => s.id === scenario.id)
      newScenarios.splice(currentIndex, 1)
    }
    return { ...state, scenarios: newScenarios }
  })
)

export function updateComputedSteps (scenarios: Scenario[]): void {
  scenarios.forEach((scenario:Scenario) => {
    const selectedStep = scenario.computedSteps.find((step: Step) => step.active)
    // transform scenario steps
    const newSteps: Step[] = []
    scenario.steps.forEach((step: Step, index:number) => {
      pushIncludedSteps(newSteps, step, scenarios, 1)
    })
    if (selectedStep && newSteps.find((step:Step) => step.id === selectedStep.id)) {
      newSteps.find((step:Step) => step.id === selectedStep.id).active = true
    }

    scenario.computedSteps = newSteps
  })
}

export function pushIncludedSteps (steps: Step[], currentStep: Step, scenarios: Scenario[], level: number): void {
  if (level > 3) return
  const newStep = JSON.parse((JSON.stringify(currentStep)))
  steps.push(newStep)
  if (currentStep.includedScenario?.active) {
    const includedScenario = scenarios.find((s) => s.key === currentStep.includedScenario.scenario)
    const includedSteps = JSON.parse(JSON.stringify(includedScenario.steps)) as Step[]
    const addSteps: Step[] = []
    includedSteps.forEach((includedStep: Step) => {
      includedStep.active = false
      includedStep.isIncluded = level
      pushIncludedSteps(addSteps, includedStep, scenarios, level + 1)
    })
    steps.push(...addSteps)
  }
}

export function scenarioReducer (state, action) {
  return _scenarioReducer(state, action)
}
