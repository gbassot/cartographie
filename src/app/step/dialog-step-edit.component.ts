import { Component, Inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Endpoint, Scenario, Server, Step } from '../models/documentation.model'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { FormGroup } from '@angular/forms'

export interface DialogStepEditData {
  step: Step;
  servers$: Observable<Server[]>;
  scenarios$: Observable<Scenario[]>;
  form: FormGroup;
}

@Component({
  selector: 'dialog-step-edit',
  templateUrl: 'dialog-step-edit.component.html'
})
export class DialogStepEditComponent {
  constructor (
    public dialogRef: MatDialogRef<DialogStepEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogStepEditData) {}

  save (): void {
    this.dialogRef.close({ step: this.data.step, form: this.data.form })
  }

  delete (): void {
    this.dialogRef.close({ step: this.data.step, delete: true })
  }

  isRequestOrResponse (): boolean {
    return !!['request', 'response'].find((v: String) => v === this.data.form.get('action').value)
  }

  possibleEndpoints (servers: Server[]): Endpoint[] {
    let selectedServer: Server = null
    if (this.data.form.get('action').value === 'request') {
      selectedServer = servers.find((server: Server) => server.key === this.data.form.get('target').value)
    }
    if (this.data.form.get('action').value === 'response') {
      selectedServer = servers.find((server: Server) => server.key === this.data.form.get('server').value)
    }
    if (selectedServer) {
      return selectedServer.endpoints
    }
    return []
  }
}
