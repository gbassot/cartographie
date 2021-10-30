import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Scenario } from '../models/documentation.model'
import { DocumentationState } from '../stores/documentation.state'
import { loadScenarios } from '../stores/scenario/scenario.action'
import { tap } from 'rxjs/operators'
import {serverReducer} from "../stores/server/server.reducer";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  public scenarios: Scenario[];
  public form: FormGroup;
  constructor (private store: Store<DocumentationState>) { }

  ngOnInit (): void {
    this.scenarios = [
      {
        name: 'Webshop - Creation de BT',
        steps: [
          { server: 'webshop-front', algo: { title: "Validation commande", description: "L'utilisateur a validé sa commande, on veut la créer coté ERP" } },
          { server: 'webshop-front', request: { target: 'webshop-back', endpoint: 'order/complete' } },
          { server: 'webshop-back', algo: { title: "Prépa commande", description: "Transformation de la commande en WorkOrder"}  },
          { server: 'webshop-back', request: { target: 'japi', endpoint: 'api/work_orders'}},
          { server: 'japi', algo: { title: 'Réservation num BT', description: "On reserve un numero de BT qu'on va poster dans le message"}},
          { server: 'japi', algo: { title: 'EdlRequest: CreateWorkOrder', description: "Le message de creation de BT est posté en EDLRequest"}},
          { server: 'japi', response: { target: 'webshop-back', endpoint: 'api/work_orders'}},
          { server: 'webshop-back', response: { target: 'webshop-front', endpoint: 'order/complete'}},
          {server: 'webshop-front', algo: { title: 'Affichage success', description: 'Affichage page de remerciement avec le lien vers la commande dans le compte client avec le numéro de BT'}}
         ]
      },
      {
        name: 'JAPI - Traitement create_work_order',
        steps: [
          { server: 'japi', algo: { title: "Symfony Messenger", description: "Le consumer de symfony est lancé et récupère les Edlrequest de type create_work_order" } },
          { server: 'japi', algo: { title: "Split de ligne", description: "Create work order est enrichi par le split de ligne, on demande le stock à JAC pour chaque ligne"} },
          { server: 'japi', request: { target: 'jac', endpoint: 'action/getMaterialStockAvailable'} },
          { server: 'jac', response: { target: 'japi', endpoint: 'action/getMaterialStockAvailable' } },
          { server: 'japi', algo: { title: "Split de ligne", description: "En fonction de la réponse de jac on split chaque ligne en fonction des dispo dans chaque entrepot"} },
          { server: 'japi', algo: { title: "Lieu sur l'entete", description: "Attribution automatique des lieu sur les entêtes"} },
          { server: 'japi', request: {target: 'jac', endpoint: 'action/createAutoNewBT' }},
          { server: 'jac', response: { target: 'japi', endpoint: 'action/createAutoNewBT' } },
          { server: 'japi', algo: { title: "BT créé", description: "Le BT est créé"}}

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
    ]

    this.store.dispatch(loadScenarios({ scenarios: this.scenarios }))

    this.form = new FormGroup({ scenarios: new FormControl(JSON.stringify(this.scenarios, undefined, 4)) })
    this.form.get('scenarios').valueChanges.pipe(tap((inputJson: string) => {
      console.log(inputJson)
      try {
        const scenarios = JSON.parse(inputJson) as Scenario[]
        this.store.dispatch(loadScenarios({ scenarios }))
      } catch (e) {
        console.log('invalid JSON')
      }
    })).subscribe()
  }
}
