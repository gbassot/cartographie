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
  /* scenarios: [
    {
      name: 'Webshop - Creation de BT',
      steps: [
        { server: 'webshop-front', algo: { title: 'Validation commande', description: "L'utilisateur a validé sa commande, on veut la créer coté ERP" } },
        { server: 'webshop-front', request: { target: 'webshop-back', endpoint: 'order/complete' } },
        { server: 'webshop-back', algo: { title: 'Prépa commande', description: 'Transformation de la commande en WorkOrder' } },
        { server: 'webshop-back', request: { target: 'japi', endpoint: 'api/work_orders' } },
        { server: 'japi', algo: { title: 'Réservation num BT', description: "On reserve un numero de BT qu'on va poster dans le message" } },
        { server: 'japi', algo: { title: 'EdlRequest: CreateWorkOrder', description: 'Le message de creation de BT est posté en EDLRequest' } },
        { server: 'japi', response: { target: 'webshop-back', endpoint: 'api/work_orders' } },
        { server: 'webshop-back', response: { target: 'webshop-front', endpoint: 'order/complete' } },
        { server: 'webshop-front', algo: { title: 'Affichage success', description: 'Affichage page de remerciement avec le lien vers la commande dans le compte client avec le numéro de BT' } }
      ]
    },
    {
      name: 'JAPI - Traitement create_work_order',
      steps: [
        { server: 'japi', algo: { title: 'Symfony Messenger', description: 'Le consumer de symfony est lancé et récupère les Edlrequest de type create_work_order' } },
        { server: 'japi', algo: { title: 'Split de ligne', description: 'Create work order est enrichi par le split de ligne, on demande le stock à JAC pour chaque ligne' } },
        { server: 'japi', request: { target: 'jac', endpoint: 'action/getMaterialStockAvailable' } },
        { server: 'jac', response: { target: 'japi', endpoint: 'action/getMaterialStockAvailable' } },
        { server: 'japi', algo: { title: 'Split de ligne', description: 'En fonction de la réponse de jac on split chaque ligne en fonction des dispo dans chaque entrepot' } },
        { server: 'japi', algo: { title: "Lieu sur l'entete", description: 'Attribution automatique des lieu sur les entêtes' } },
        { server: 'japi', request: { target: 'jac', endpoint: 'action/createAutoNewBT' } },
        { server: 'jac', response: { target: 'japi', endpoint: 'action/createAutoNewBT' } },
        { server: 'japi', algo: { title: 'BT créé', description: 'Le BT est créé' } }

      ]
    },
    {
      name: 'Webshop - Demande de stock',
      steps: [
        { server: 'webshop-front', algo: { title: 'Besoin du stock', description: "L'utilisateur a configuré un produit, on veut savoir si il est en stock" } },
        { server: 'webshop-front', request: { target: 'webshop-back', endpoint: 'api/stock' } },
        { server: 'webshop-back', request: { target: 'japi', endpoint: 'api/stock_request' } },
        { server: 'japi', algo: { title: 'GSM', description: 'Choix des entrepots à requeter selon le GSM, entrepot interne' } },
        { server: 'japi', request: { target: 'jac', endpoint: 'action/getMaterialStockAvailable' } },
        { server: 'jac', response: { target: 'japi', endpoint: 'action/getMaterialStockAvailable' } },
        { server: 'japi', algo: { title: 'GSM', description: 'Choix des entrepots à requeter selon le GSM, entrepots externes' } },
        { server: 'japi', request: { target: 'jac', endpoint: 'action/getMaterialStockAvailable' } },
        { server: 'jac', response: { target: 'japi', endpoint: 'action/getMaterialStockAvailable' } },
        { server: 'japi', response: { target: 'webshop-back', endpoint: 'api/stock_request' } },
        { server: 'webshop-back', response: { target: 'webshop-front', endpoint: 'api/stock' } },
        { server: 'webshop-front', algo: { title: 'Affichage du stock', description: "Si le produit est en stock, on peut l'ajouter au panier" } }
      ]
    },
    {
      name: 'EDI SAP',
      steps: [
        { server: 'sap', request: { target: 'jedi', endpoint: 'endpoint/sap' } },
        { server: 'jedi', request: { target: 'japi', endpoint: 'validate/sap' } },
        { server: 'japi', response: { target: 'jedi', endpoint: 'validate/sap' } },
        { server: 'jedi', request: { target: 'japi', endpoint: 'send/sap' } }
      ]
    },
    {
      name: 'admin GDD',
      steps: [
        { server: 'jac', request: { target: 'japi', endpoint: 'api/shapes' } }
      ]
    }
  ], */
  scenarios: [],
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
