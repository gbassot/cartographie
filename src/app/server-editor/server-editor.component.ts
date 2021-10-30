import { Component, Input, OnInit } from '@angular/core'
import { Server, Step } from '../models/documentation.model'
import { DialogStepEditComponent, DialogStepEditData } from '../step/dialog-step-edit.component'
import { deleteStep, updateOrCreateStep } from '../stores/scenario/scenario.action'
import { MatDialog } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { DocumentationState } from '../stores/documentation.state'
import { DialogServerEditComponent, DialogServerEditData } from './dialog-server-edit.component'
import { FormControl, FormGroup } from '@angular/forms'
import { deleteServer, toogleServer, updateOrCreateServer } from '../stores/server/server.action'

@Component({
  selector: 'app-server-editor',
  templateUrl: './server-editor.component.html',
  styleUrls: ['./server-editor.component.css']
})
export class ServerEditorComponent implements OnInit {
  @Input() server: Server;
  @Input() index: number;

  constructor (private store: Store<DocumentationState>, public dialog: MatDialog) { }

  ngOnInit (): void {
  }

  edit (serverEditData: DialogServerEditData) {
    const dialogRef = this.dialog.open(DialogServerEditComponent, {
      width: '1000px',
      data: serverEditData
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result?.form) {
        const newServer: Server = {
          id: result.server.id,
          name: result.form.value.name,
          key: result.form.value.key,
          endpoints: result.server.endpoints,
          technologies: result.form.value.technologies
        }

        this.store.dispatch(updateOrCreateServer({ server: newServer }))
      }
      if (result?.delete) {
        this.store.dispatch(deleteServer({ server: this.server }))
      }
    })
  }

  getCurrentServerEditData () : DialogServerEditData {
    return {
      server: this.server,
      form: this.buildForm(this.server)
    }
  }

  getNewServerEditData () : DialogServerEditData {
    const newServer: Server = {
      id: null,
      name: null,
      key: null,
      endpoints: [],
      technologies: []
    }
    return {
      server: newServer,
      form: this.buildForm(newServer)
    }
  }

  buildForm (server: Server): FormGroup {
    return new FormGroup({
      name: new FormControl(server.name),
      key: new FormControl(server.key),
      technologies: new FormControl(server.technologies)
    })
  }

  toogleServer (): void {
    this.store.dispatch(toogleServer({ server: this.server }))
  }
}
