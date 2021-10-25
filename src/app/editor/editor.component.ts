import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Scenario } from '../models/documentation.model'
import { DocumentationState } from '../stores/documentation.state'
import { loadScenarios } from '../stores/scenario/scenario.action'
import { tap } from 'rxjs/operators'

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
        name: 'Webshop - Demande de stock',
        steps: [
          { server: 'webshop-front', algo: { title: 'Besoin du stock', description: "L'utilisateur a configuré un produit, on veut savoir si il est en stock" } },
          { server: 'webshop-front', request: { target: 'webshop-back', endpoint: 'api/stock' } },
          { server: 'webshop-back', request: { target: 'japi', endpoint: 'api/stock_request' } },
          { server: 'japi', algo: { title: 'GSM', description: 'Choix des entrepots à requeter selon le GSM, entrepot interne' } },
          { server: 'japi', request: { target: 'jac', endpoint: 'api.php?action=stock_available' } },
          { server: 'jac', response: { target: 'japi', endpoint: 'api.php?action=stock_available' } },
          { server: 'japi', algo: { title: 'GSM', description: 'Choix des entrepots à requeter selon le GSM, entrepots externes' } },
          { server: 'japi', request: { target: 'jac', endpoint: 'api.php?action=stock_available' } },
          { server: 'jac', response: { target: 'japi', endpoint: 'api.php?action=stock_available' } },
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
