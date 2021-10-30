import { Component, Input, OnInit } from '@angular/core'
import { Endpoint, Server } from '../models/documentation.model'
import { Store } from '@ngrx/store'
import { DocumentationState } from '../stores/documentation.state'
import { MatDialog } from '@angular/material/dialog'
import {
  deleteEndpoint,
  updateOrCreateEndpoint
} from '../stores/server/server.action'
import { FormControl, FormGroup } from '@angular/forms'
import { DialogEndpointEditComponent, DialogEndpointEditData } from './dialog-endpoint-edit.component'

@Component({
  selector: 'app-endpoint',
  templateUrl: './endpoint.component.html',
  styleUrls: ['./endpoint.component.css']
})
export class EndpointComponent implements OnInit {
  @Input() endpoint: Endpoint;
  @Input() server: Server;

  constructor (private store: Store<DocumentationState>, public dialog: MatDialog) { }

  ngOnInit (): void {
  }

  edit (endpointEditData: DialogEndpointEditData) {
    const dialogRef = this.dialog.open(DialogEndpointEditComponent, {
      width: '1000px',
      data: endpointEditData
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result?.form) {
        const newEndpoint: Endpoint = {
          id: result.endpoint.id,
          name: result.form.value.name,
          request: result.form.value.request,
          response: result.form.value.response,
          payload: result.form.value.payload
        }
        this.store.dispatch(updateOrCreateEndpoint({ server: this.server, endpoint: newEndpoint }))
      }
      if (result?.delete) {
        this.store.dispatch(deleteEndpoint({ server: this.server, endpoint: this.endpoint }))
      }
    })
  }

  getCurrentEndpointEditData () : DialogEndpointEditData {
    return {
      endpoint: this.endpoint,
      form: this.buildForm(this.endpoint)
    }
  }

  getNewEndpointEditData () : DialogEndpointEditData {
    const newEndpoint: Endpoint = {
      id: null,
      name: null,
      response: null,
      request: null,
      payload: null
    }
    return {
      endpoint: newEndpoint,
      form: this.buildForm(newEndpoint)
    }
  }

  buildForm (endpoint: Endpoint) {
    return new FormGroup({
      name: new FormControl(endpoint.name),
      request: new FormControl(endpoint.request),
      response: new FormControl(endpoint.response),
      payload: new FormControl(endpoint.payload)
    })
  }
}
